/**
 * This is used by {@link generators/api-client-generator} to improve the types it outputs
 * @module
 */

import * as fs from "fs"
import * as path from "path"
import * as ts from "typescript"
import { changeTypeReference, getImports, removeNodes, renameNodes } from "./ts-lib/ts-transformers.ts"
import { isAliasOfType, isAliasType, isObjectType, isStructuredType } from "./ts-lib/ts-typing.ts"
import { transformChains, transformNodes, type NodeTuple } from "./ts-lib/ts-utils.ts"


function transformSourceFile( sourceFile: ts.SourceFile, otherSourceFiles: ts.SourceFile[], typeChecker: ts.TypeChecker ): ts.SourceFile {

    interface NodeComparison {
        node: ts.TypeAliasDeclaration,
        otherNode: ts.TypeAliasDeclaration,
        thisNodeIsAliasOfOther: boolean | undefined
        otherNodeIsAliasOfThis: boolean | undefined
        isTypeAlias: boolean | undefined // Should always be true from earlier grouping
    }

    const nodesGroupedByAlias: Record<string, ts.TypeAliasDeclaration[] | undefined> = {}
    const typeRenames: Record<string, string> = {}
    const typeDeletions: Record<string, ts.TypeAliasDeclaration> = {}
    const aliasChangeMap: Record<string, string> = {}
    let allTypeAliasNodes: ts.TypeAliasDeclaration[]
    let allNodesComparisons: Record<string, Record<string, NodeComparison>> = {}
    const filterTransformer: ts.TransformerFactory<ts.SourceFile> = context => rootNode => {
        /** Visits all nodes starting from `node` and sorts them into records keyed by structural and alias similarity */
        function compareNodes( node: ts.Node ): ts.Node | undefined {
            if ( ts.isTypeAliasDeclaration( node ) ) {

                const type = typeChecker.getTypeAtLocation( node )

                if ( !isObjectType( type ) || !isStructuredType( type ) )
                    return ts.visitEachChild( node, compareNodes, context )

                // const nodeName = node.name.text
                // console.log(
                //     "----",
                //     "Sorting",
                //     nodeName,
                //     node.kind,
                //     ( type.symbol.flags & ts.SymbolFlags.TypeAlias ),
                // )

                // Equivalence of ts.TypeAliasDeclaration nodes can be confirmed by first grouping them by structural equivalence (object properties),
                // and then comparing their type with `===` to see if they are type alias,
                // creating new groups for nodes with the same structural properties but in different type alias sets.

                const properties = typeChecker.getPropertiesOfType( type )
                const propertyDetails = properties.map( prop =>
                    `${prop.name}: ${typeChecker.typeToString( typeChecker.getTypeOfSymbolAtLocation( prop, prop.valueDeclaration as ts.Node ) )}`
                )
                const propertiesJSONString = `{ ${propertyDetails.join( ", " )} }`

                // Sort by isAliasType equivalance
                const differentiateTypes = ( type: ts.Type, node: ts.TypeAliasDeclaration, index = 0 ): [string, number] => {
                    const typeAliasGroupKeys = `${index}___${propertiesJSONString}`

                    if ( nodesGroupedByAlias[ typeAliasGroupKeys ] && nodesGroupedByAlias[ typeAliasGroupKeys ].length ) {
                        const groupsType = typeChecker.getTypeAtLocation( nodesGroupedByAlias[ typeAliasGroupKeys ][ 0 ] )
                        const isAlias = isAliasType( type, groupsType )
                        if ( isAlias )
                            nodesGroupedByAlias[ typeAliasGroupKeys ] = [ node, ... nodesGroupedByAlias[ typeAliasGroupKeys ] ]
                        else
                            return differentiateTypes( type, node, ++index )
                    } else {
                        nodesGroupedByAlias[ typeAliasGroupKeys ] = [ node ]
                    }
                    return [ typeAliasGroupKeys, nodesGroupedByAlias[ typeAliasGroupKeys ].length ]
                }
                const [ _sortedTo, _count ] = differentiateTypes( type, node )
                // console.log( `into Object Type: ${count} - ${sortedTo}` )

                return ts.visitEachChild( node, compareNodes, context )
            }

            return ts.visitEachChild( node, compareNodes, context )
        }

        // First visit all nodes from the root and group them into `nodesGroupedByAlias`
        const visitedNode = ts.visitNode( rootNode, compareNodes )

        // Get only the groups with more than one alias
        const nodesGroupedByAliasMultiples = Object.fromEntries(
            Object.entries( nodesGroupedByAlias )
                .filter( ( [ _aliasKey, nodes ] ) => nodes && nodes.length > 1 ) as Array<[string, ts.TypeAliasDeclaration[]]>
        )


        // Get all imports for each other SourceFile in the Program and then see which nodes they import from this SourceFile
        allTypeAliasNodes = Object.values( nodesGroupedByAliasMultiples ).flat()
        // const allTypeAliasNodeNames = allTypeAliasNodes.map( v => v.name.text )
        let allProgramImportsFromThisSourceFile: string[] = []
        otherSourceFiles.forEach( sf => {
            // console.log( "Checking sourcefile imports::", sf.fileName )
            const importDeclarations = getImports( sf )
            const importNamesFromThisSourceFile = Object.entries( importDeclarations )
                .filter( ( [ moduleDeclaration, _typeImport ] ) => {
                    const split = moduleDeclaration.split( "/" )
                    const end = split[ split.length-1 ]
                    return sourceFile.fileName.includes( end )
                } )
                .map( ( [ _moduleDeclaration, typeImport ] ) => typeImport.importNames )
                .flat()
            // console.log( "Imports:", importDeclarations )

            allProgramImportsFromThisSourceFile = [ ...importNamesFromThisSourceFile, ...allProgramImportsFromThisSourceFile ]
        } )


        for ( const propertiesStr in nodesGroupedByAliasMultiples ) {
            const nodes = nodesGroupedByAliasMultiples[ propertiesStr ]
            // console.error( "----" )
            // console.log( propertiesStr, "::::", nodes.length )

            // Compare each node against the others to form a set of comparison objects, showing if they alias to or from each other
            const thisNodesComparisons: Record<string, Record<string, NodeComparison>> = {}
            nodes.forEach( thisNode => {
                const thisNodeType = typeChecker.getTypeAtLocation( thisNode )

                thisNodesComparisons[ thisNode.name.text ] = {}
                nodes
                    .filter( n => n !== thisNode )
                    .forEach( otherNode => {

                        const otherVSthis: NodeComparison  = {
                            node                   : thisNode,
                            otherNode              : otherNode,
                            thisNodeIsAliasOfOther : undefined,
                            otherNodeIsAliasOfThis : undefined,
                            isTypeAlias            : undefined // Should always be true
                        }

                        const otherNodeType = typeChecker.getTypeAtLocation( otherNode )
                        if ( !isAliasType( thisNodeType, otherNodeType ) )
                            throw new Error( "this shouldnt happen" )

                        const thisNodeIsAliasOfOther = isAliasOfType( thisNode, otherNode ) // Middle nodes have one true
                        const otherNodeIsAliasOfThis = isAliasOfType( otherNode, thisNode ) // End node has one true, everything else false

                        const isTypeAlias = isAliasType( thisNodeType, otherNodeType )
                        if ( !isTypeAlias )
                            throw new Error( "this shouldnt happen" ) // Should always be true from above grouping

                        otherVSthis.thisNodeIsAliasOfOther = thisNodeIsAliasOfOther
                        otherVSthis.otherNodeIsAliasOfThis = otherNodeIsAliasOfThis
                        otherVSthis.isTypeAlias = isTypeAlias

                        thisNodesComparisons[ thisNode.name.text ][ otherNode.name.text ] = otherVSthis
                    } )
            } )


            // Convert the `NodeComparison`'s to simpler `NodeTuple`'s that hold a nodes names as its central key,
            // and forward and backward reference keys.
            const nodeTuples: NodeTuple[] = []
            allNodesComparisons = { ...allNodesComparisons, ...thisNodesComparisons }
            Object.entries( thisNodesComparisons )
                .forEach( ( [ nodeName, comparisonAgainstOthers ] ) => {
                    // console.warn( "Comparing node:", nodeName )

                    const forwardNodes: string[] = []
                    const backwardNodes: string[] = []
                    const othersVSthis: Array<[string, NodeComparison]> = Object.entries( comparisonAgainstOthers )
                    othersVSthis
                        .forEach( ( [ otherNodeName, otherNodesComparison ]: [string, NodeComparison] ) => {
                            if ( otherNodesComparison.otherNodeIsAliasOfThis )
                                backwardNodes.push( otherNodeName )
                            if ( otherNodesComparison.thisNodeIsAliasOfOther )
                                forwardNodes.push( otherNodeName )
                            // console.log(
                            //     otherNodesComparison.isTypeAlias ,
                            //     otherNodeName,
                            //     otherNodesComparison.thisNodeIsAliasOfOther,
                            //     otherNodesComparison.otherNodeIsAliasOfThis
                            // )
                        } )

                    // console.log( backwardNodes, "|", nodeName, "|", forwardNodes )
                    nodeTuples.push( [ backwardNodes, nodeName, forwardNodes ] )

                    if ( forwardNodes.length > 1 )
                        throw new Error( "This shouldnt happen" ) // Sometimes this might happen, but not in my source files

                    // if ( backwardNodes.length > 1 )
                    //     throw new Error( "This shouldnt happen" ) // sometimes this happens
                } )

            // Transform the `NodeTuple`'s into a set of node keys for all contiguous chains in the graph of aliased nodes
            const orderedNodeChains = [ ...transformNodes( nodeTuples ) ]
            const chainTuples = transformChains( orderedNodeChains )

            // Filter out any chains that only have keys for nodes that aren't referenced outside this file
            // const filteredChainTuples = chainTuples.filter( chainTuple => {
            //     const [ chain, _refs ] = chainTuple
            //     return chain.some( nodeKey => allProgramImportsFromThisSourceFile.includes( nodeKey ) )
            //     // return Object.keys( allProgramImportsFromThisSourceFile ).includes( chain[ chain.length - 1 ] )
            // } )
            // console.log( "Sorted nodes:", orderedNodeChains )
            // console.log( "Sorted chains:", chainTuples )
            // console.log( "Filtered chains:", filteredChainTuples )


            // Set up transformations
            const endTuples = chainTuples.length === 1 ? chainTuples : chainTuples.filter( ( [ _nodeChain, refs ] ) => refs.length > 0 )
            if ( endTuples.length !== 1 )
                throw new Error( "chain tuples error" )
            // const endTuple = endTuples[ 0 ]
            chainTuples.forEach( ( [ nodeChain, backwardRefs ] ) => {
                // Only for end chain of split chains
                if ( !backwardRefs.length && chainTuples.length > 1 && nodeChain.length > 1 )
                    return

                //TODO: The above guard does miss some - check: Omit_any_Extract_never_or_UpdateRequestBodyOmittedKeysT_keyofUserModelDTO__

                // Assign the start of the chains typename to the end of the chains
                const lastNodeKey = nodeChain[ 0 ]
                const firstNodeKey = nodeChain[ nodeChain.length - 1 ]

                // Change references of all intermediary nodes, and then delete them
                nodeChain.forEach( ( nodeKey, i ) => {
                    if ( i === nodeChain.length - 1 || i === 0 ) return

                    // Change references of intermediary ndoes to the first
                    if ( nodeKey in aliasChangeMap && aliasChangeMap[ nodeKey ] !== firstNodeKey )
                        throw new Error( "node key mismatch" )
                    aliasChangeMap[ nodeKey ] = firstNodeKey
                    typeDeletions[ nodeKey ] = Object.values( thisNodesComparisons[ nodeKey ] ) [ 0 ].node
                } )

                if ( lastNodeKey in typeRenames )
                    throw new Error( "Key error" )
                if ( lastNodeKey === firstNodeKey )
                    throw new Error( "Key error" )

                // Change the last node name to the first node and then delete it
                typeRenames[ lastNodeKey ] = firstNodeKey
                aliasChangeMap[ lastNodeKey ] = firstNodeKey
                typeDeletions[ lastNodeKey ] = Object.values( thisNodesComparisons[ lastNodeKey ] ) [ 0 ].node
            } )

        }

        return visitedNode as ts.SourceFile
    }


    // Gather data for transformations
    const result1 = ts.transform( sourceFile, [
        filterTransformer
    ] )

    // Set up transformations
    const typeRenamesWithNodes: Record<string, [ts.TypeAliasDeclaration, string]> = Object.fromEntries(
        Object.entries( typeRenames ).map( ( [ nodeKey, toNodeKey ] ) => {
            const node = allTypeAliasNodes.find( node => node.name.text === nodeKey )
            if ( !node )
                throw new Error( "Node error" )
            return [ nodeKey, [ node, toNodeKey ] ]
        } )
    )

    // Also delete the ones we renamed
    const renamedNodes = Object.fromEntries(
        Object.values( typeRenamesWithNodes ).map( ( [ _node, renameTo ] ) => [ renameTo, allTypeAliasNodes.find( n => n.name.text === renameTo ) ] )
    ) as Record<string, ts.TypeAliasDeclaration>
    const updatedTypeDeletions = { ...renamedNodes, ...typeDeletions }


    console.log( "Compared", Object.keys( Object.keys( allNodesComparisons ) ).length, "TypeAliasDeclaration nodes" )
    console.log( "Processing", Object.keys( typeRenamesWithNodes ).length, "type renames" )
    console.log( "Processing", Object.keys( updatedTypeDeletions ).length, "type deletions" )
    console.log( "Processing", Object.keys( aliasChangeMap ).length, "alias changes" )


    // Do the transformations
    const result2 = ts.transform( result1.transformed[ 0 ], [
        renameNodes( typeRenamesWithNodes ),
        removeNodes( updatedTypeDeletions ),
        changeTypeReference( aliasChangeMap ),
    ] )

    return result2.transformed[ 0 ]
}



/**
 * Takes a client generated by `@hey-api/openapi-ts` and renames, deletes and changes type references to remove any redundancy
 *
 * @param generatedClientOutputDir - The directory where the generated client was output
 */
const formatApiClient = ( generatedClientOutputDir: string ): void => {

    const files = fs.readdirSync( generatedClientOutputDir )
    const tsFiles = files.filter( file => path.extname( file ) === ".ts" )

    const inputFilePaths = tsFiles.map( tsFile => path.join( generatedClientOutputDir, tsFile ) )

    const targetFilePath = path.join( generatedClientOutputDir, "types.gen.ts" )
    const targetFileName = path.basename( targetFilePath )

    console.log( `Formatting types file - ${targetFilePath}` )

    const program = ts.createProgram( inputFilePaths, {} )
    const typeChecker = program.getTypeChecker()
    const programSourceFiles = program.getSourceFiles()

    const localSourceFiles = programSourceFiles.filter( sf => !sf.fileName.includes( "node_modules" ) )

    const sourceFile = localSourceFiles.find( sf => sf.fileName === targetFilePath )
    const otherSourceFiles = localSourceFiles.filter( sf => sf !== sourceFile && !sf.fileName.includes( ".update." ) )

    if ( !sourceFile )
        throw new Error( "Could not find source file in created program" )

    const printer = ts.createPrinter( { newLine: ts.NewLineKind.LineFeed } )
    const originalContent = printer.printFile( sourceFile )

    const updatedSourceFile = transformSourceFile( sourceFile, otherSourceFiles, typeChecker )
    const updatedContent = printer.printFile( updatedSourceFile )

    const outputFileName = targetFileName
    const outputFilePath = path.join( generatedClientOutputDir, outputFileName )

    const backupFileName = targetFileName + ".bak.ts"
    const backupFilePath = path.join( generatedClientOutputDir, backupFileName )

    fs.writeFileSync( backupFilePath, originalContent, "utf8" )
    fs.writeFileSync( outputFilePath, updatedContent, "utf8" )
    console.log( `Backed up types source file to: ${backupFilePath}` )
    console.log( `Refactored redundant type aliases and saved to: ${outputFilePath}` )

}


export { formatApiClient }
