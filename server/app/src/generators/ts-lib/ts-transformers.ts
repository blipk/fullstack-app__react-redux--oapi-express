/**
 * This file contains functions for transforming types and ndoes in `ts.SourceFile`'s
 * These functions are specifically made for `ts.transform`
 * @module
 */
import * as ts from "typescript"

/**
 * Transformer for `ts.transform` that renames nodes (only TypeAliasDeclaration supported)
 * @param renameMap -  The nodes to rename, keyed by their name or other unique identifier, the values are the originalNode and what to rename it to
 */
function renameNodes( renameMap: Record<string, [ts.TypeAliasDeclaration, string]> ): ts.TransformerFactory<ts.SourceFile> {
    // console.log(
    //     "Renaming nodes:",
    //     Object.fromEntries( Object.keys( renameMap ).map( key => [ [ key ], renameMap[ key ][ 1 ] ] ) )
    // )

    return context => {
        const visit: ts.Visitor = node => {
            if ( !ts.isTypeAliasDeclaration( node ) )
                return ts.visitEachChild( node, visit, context )

            const nodeName = node.name.text
            if ( !( nodeName in renameMap ) )
                return ts.visitEachChild( node, visit, context )


            // Create a new identifier with the new name
            const [ originalNode, newName ] = renameMap[ nodeName ]
            if ( originalNode === node || originalNode.name.text === nodeName ) {
                // console.log( "Renaming:", node.name.text, newName )

                const newIdentifier = ts.factory.createIdentifier( newName )
                // Create a new TypeAliasDeclaration with the new name
                return ts.factory.updateTypeAliasDeclaration(
                    node,
                    node.modifiers,
                    newIdentifier,
                    node.typeParameters,
                    node.type
                )
            }

            // Continue visiting other nodes
            return ts.visitEachChild( node, visit, context )
        }
        return node => ts.visitNode( node, visit ) as ts.SourceFile
    }
}

/**
 * Transformer for `ts.transform` that removes nodes
 * @param targetNodes - The nodes to remove, keyed by their name or other unique identifier
 * @returns
 */
function removeNodes( targetNodes: Record<string, ts.Node | ts.TypeAliasDeclaration> ): ts.TransformerFactory<ts.SourceFile> {
    // console.log( "Removing nodes:", Object.keys( targetNodes ) )
    return ( context: ts.TransformationContext ) => {
        const nodes = Object.values( targetNodes ).map( ( node, _key ) => node )
        // const nodesKeys = Object.keys( targetNodes )

        const logDelete = ( ..._args: unknown[] ) => {
            // console.log( "Removing node:", ..._args )
        }

        const visit: ts.Visitor = ( node: ts.Node ) => {
            if ( !nodes.includes( node ) )
                return ts.visitEachChild( node, visit, context )

            let updatedNode = "other_node"

            // Remove type annotations from type alias declarations
            if ( ts.isTypeAliasDeclaration( node ) )
                updatedNode = "type_alias"

            // Remove node by returning undefined
            logDelete( updatedNode )
            return undefined
        }
        return node => ts.visitNode( node, visit ) as ts.SourceFile
    }
}


/** Used by {@link getImports} */
interface TypeImport {
    node?: ts.ImportDeclaration;
    moduleSpecifier: string;
    importNames: string[];
}

/**
 * Get import declarations and metadata from a `ts.SourceFile`
 * @param sourceFile - The source file to get the import declarations from
 */
function getImports( sourceFile: ts.SourceFile ): Record<string, TypeImport> {
    const typeImports: Record<string, TypeImport> = {}

    function visit( node: ts.Node ) {
        if ( ts.isImportDeclaration( node ) ) {
            const importClause = node.importClause
            if ( importClause ) {
                const moduleSpecifier = ( node.moduleSpecifier as ts.StringLiteral ).text
                let importNames: string[] = []

                if ( importClause.isTypeOnly ) {
                    // If the entire import clause is type-only, collect all import names
                    if ( importClause.namedBindings && ts.isNamedImports( importClause.namedBindings ) ) {
                        importNames = importClause.namedBindings.elements.map( element => element.name.text )
                    } else if ( importClause.name ) {
                        importNames.push( importClause.name.text )
                    }
                } else if ( importClause.namedBindings && ts.isNamedImports( importClause.namedBindings ) ) {
                    // Check individual named imports for the type-only flag
                    importNames = importClause.namedBindings.elements
                        // .filter( element => element.isTypeOnly )
                        .map( element => element.name.text )
                }

                if ( importNames.length > 0 ) {
                    typeImports[ moduleSpecifier ] = { moduleSpecifier, importNames }
                }
            }
        }
        ts.forEachChild( node, visit )
    }

    visit( sourceFile )
    return typeImports
}

/**
 * Change any TypeReference nodes name identifier to point to new name
 * @param aliasMap - Keys are the typeName of the target node, values are the typeName to change it too
 */
function changeTypeReference( aliasMap: Record<string, string> ): ts.TransformerFactory<ts.SourceFile> {
    // console.log( "Changing type alias:", aliasMap )

    return ( context: ts.TransformationContext ) => {
        const visitor: ts.Visitor = ( node: ts.Node ): ts.Node => {
            if ( ts.isTypeReferenceNode( node ) ) {
                const typeName = node.typeName
                if ( ts.isIdentifier( typeName ) && aliasMap[ typeName.text ] ) {
                    const newAlias = aliasMap[ typeName.text ]
                    if ( newAlias ) {
                        return ts.factory.updateTypeReferenceNode(
                            node,
                            ts.factory.createIdentifier( newAlias ),
                            node.typeArguments
                        )
                    }
                }
            }
            return ts.visitEachChild( node, visitor, context )
        }

        return ( sourceFile: ts.SourceFile ) => ts.visitNode( sourceFile, visitor ) as ts.SourceFile
    }
}


export { removeNodes, renameNodes, getImports, changeTypeReference }
