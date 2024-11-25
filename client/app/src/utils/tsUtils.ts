/**
 * This file contains utilities for working with the typescript compiler API
 * @module
 */
import * as ts from "typescript"
import { isObjectType, isStructuredType } from "./ts-typing"


const progFromSourcePath = (
    sourceFilesPaths: string[], targetSourceFilePath?: string, compilerOptions?: ts.CompilerOptions
): {program: ts.Program, typeChecker: ts.TypeChecker, programSourceFiles: readonly ts.SourceFile[], targetSourceFile: ts.SourceFile | undefined} => {
    compilerOptions ??= {}
    const program = ts.createProgram( sourceFilesPaths , compilerOptions )
    const typeChecker = program.getTypeChecker()
    const programSourceFiles = program.getSourceFiles()
    const targetSourceFile = programSourceFiles.find( sf => sf.fileName === targetSourceFilePath ) as ts.SourceFile
    return { program, typeChecker, programSourceFiles, targetSourceFile }
}


/** Helper function to print nodes (for debugging) */
const printNode = ( node: ts.Node, sourceFile: ts.SourceFile ): string => {
    const { line, character } = sourceFile.getLineAndCharacterOfPosition( node.getStart( sourceFile ) )
    return `${ts.SyntaxKind[ node.kind ]} (${line + 1},${character + 1})`
}



const findTypeDeclaration = ( sourceFile: ts.SourceFile, name: string ): ts.TypeAliasDeclaration | undefined => {
    function visit( node: ts.Node ): ts.TypeAliasDeclaration | undefined {
        if ( ts.isTypeAliasDeclaration( node ) && node.name.text === name )
            return node
        return ts.forEachChild( node, visit )
    }

    return visit( sourceFile )
}

interface TypeDeclarationInfo {
    name: string
    node?: ts.TypeAliasDeclaration
    propertiesInfo: TypeDeclPropertiesInfo[] | undefined
}

const getTypeDeclarationsWithInfo = (
    typeChecker: ts.TypeChecker, sourceFile: ts.SourceFile, includeNodes = false
): Record<string, TypeDeclarationInfo> => {
    const typeDeclarations: Record<string, ts.TypeAliasDeclaration> = getTypeDeclarations( sourceFile )

    const typeDeclarationsWithInfo: Record<string, TypeDeclarationInfo> = Object.fromEntries(
        Object.entries( typeDeclarations ).map(
            ( [ nodeName, typeDeclaratioNode ] ) => {

                return [
                    nodeName,
                    {
                        name           : typeDeclaratioNode.name.text,
                        node           : includeNodes ? typeDeclaratioNode : undefined,
                        propertiesInfo : getTypeDeclPropertiesInfoFromNode( typeChecker, typeDeclaratioNode )[ 1 ]
                    }
                ]

            }
        )
    )

    return typeDeclarationsWithInfo
}

const propertiesInfoToRecord = (
    propertiesInfo: TypeDeclPropertiesInfo[]
): Record<string, string> => {
    const remapped: Record<string, string> = Object.fromEntries(
        propertiesInfo.map( propertiesInfo => {
            return [
                propertiesInfo.name,
                propertiesInfo.optional
                    ? `${propertiesInfo.typeName} | undefined`
                    : propertiesInfo.typeName || "unknown"
            ]
        } )
    )
    return remapped
}

const getTypeDeclarations = ( sourceFile: ts.SourceFile ): Record<string, ts.TypeAliasDeclaration> => {
    const typeDeclarations: Record<string, ts.TypeAliasDeclaration> = {}

    function visit( node: ts.Node ): void {
        if ( ts.isTypeAliasDeclaration( node ) )
            typeDeclarations[ node.name.text ] = node
        ts.forEachChild( node, visit )
    }

    visit( sourceFile )
    return typeDeclarations
}

interface TypeDeclPropertiesInfo {
    name: string,
    typeName?: string
    optional: boolean
    propertyValueName: string
    propSymbol?: ts.Symbol
    valuePropertiesInfo?: TypeDeclPropertiesInfo[]
}

const getTypeDeclPropertiesInfoFromNode = (
    typeChecker: ts.TypeChecker, node: ts.Node, includePropertySymbol = false
): [string, TypeDeclPropertiesInfo[]] | [undefined, undefined] => {
    const type = typeChecker.getTypeAtLocation( node )
    return getTypeDeclPropertiesInfo( typeChecker, type, includePropertySymbol )
}

const getTypeDeclPropertiesInfo = (
    typeChecker: ts.TypeChecker, type: ts.Type, includePropertySymbol = false
): [string, TypeDeclPropertiesInfo[]] | [undefined, undefined] => {

    if ( !isObjectType( type ) || !isStructuredType( type ) )
        return [ undefined, undefined ]
        // throw new Error( "Unstructured or non-object type" )

    const properties = typeChecker.getPropertiesOfType( type )
    const propertyDetails =
        properties.map(
            prop => {

                const propertyType = prop.valueDeclaration && typeChecker.getTypeOfSymbolAtLocation( prop, prop.valueDeclaration )
                const typeName = propertyType && typeChecker.typeToString( propertyType )

                const propertyValueName = typeChecker.typeToString( typeChecker.getTypeOfSymbolAtLocation( prop, prop.valueDeclaration as ts.Node ) )

                const valueDeclarationType = prop.valueDeclaration && typeChecker.getTypeAtLocation( prop.valueDeclaration )

                function isSymbolOptional( typeChecker: ts.TypeChecker, symbol: ts.Symbol ): boolean {
                    if ( !symbol.valueDeclaration ) {
                        return false
                    }

                    // Check if the symbol is optional
                    if ( symbol.getFlags() & ts.SymbolFlags.Optional ) {
                        return true
                    }

                    const type = typeChecker.getTypeOfSymbolAtLocation( symbol, symbol.valueDeclaration )

                    // Check if the type includes null or undefined
                    return ( type.flags & ts.TypeFlags.Null ) !== 0 ||
                           ( type.flags & ts.TypeFlags.Undefined ) !== 0 ||
                           ( type.flags & ts.TypeFlags.Union ) !== 0 && ( type as ts.UnionType ).types.some( t =>
                               ( t.flags & ts.TypeFlags.Null ) !== 0 ||
                               ( t.flags & ts.TypeFlags.Undefined ) !== 0 )
                }

                return (
                    {
                        name                : prop.name,
                        propSymbol          : includePropertySymbol ? prop : undefined,
                        typeName            : typeName,
                        optional            : isSymbolOptional( typeChecker, prop ),
                        propertyValueName   : propertyValueName,
                        valuePropertiesInfo : valueDeclarationType && getTypeDeclPropertiesInfo( typeChecker, valueDeclarationType )[ 1 ]
                    } as TypeDeclPropertiesInfo
                )

            }
        )

    const propertyDetailsString = properties.map( prop =>
        `${prop.name}: ${typeChecker.typeToString( typeChecker.getTypeOfSymbolAtLocation( prop, prop.valueDeclaration as ts.Node ) )}`
    )
    const propertiesJSONString = `{ ${propertyDetailsString.join( ", " )} }`

    return [ propertiesJSONString, propertyDetails ]
}




interface GenericInfo {
    name: string
    typeProperties: string | undefined
}

interface PropertyInfo {
    name: string
    typeProperties: string | undefined
}

interface ParamInfo {
    name: string
    typeProperties: string | undefined
}

interface ClassInfo {
    name: string;

    isExported: boolean | undefined;

    methods: MethodInfo[];
    properties: PropertyInfo[];
    generics: GenericInfo[];
}

interface ReturnInfo {
    isMethod: boolean;
    returnType: string;
    methodInfo?: MethodInfo;
}

// Interface to represent method structure
interface MethodInfo {
    name: string;

    returnInfo: ReturnInfo
    parameters: ParamInfo[];
    generics: GenericInfo[];
}

const getMethodInfo = ( typeChecker: ts.TypeChecker, node: ts.MethodDeclaration ): MethodInfo => {
    const methodName = ( node.name as ts.Identifier ).text
    const methodInfo: MethodInfo = {
        name       : methodName,
        returnInfo : { isMethod: false, returnType: "" },
        parameters : [],
        generics   : []
    }

    if ( node.typeParameters ) {
        for ( const typeParam of node.typeParameters ) {
            if ( ts.isTypeParameterDeclaration( typeParam ) ) {
                methodInfo.generics.push( {
                    name           : typeParam.name.text,
                    typeProperties : getTypeDeclPropertiesInfoFromNode( typeChecker, typeParam )[ 0 ]
                } )
            }
        }
    }

    for ( const param of node.parameters ) {
        if ( ts.isIdentifier( param.name ) ) {
            methodInfo.parameters.push( {
                name           : param.name.text,
                typeProperties : getTypeDeclPropertiesInfoFromNode( typeChecker, param )[ 0 ]
            } )
        }
    }

    // const returnMethodDeclaration = findReturnedMethodDeclaration( sourceFile, node )
    // methodInfo.returnInfo.methodInfo = returnMethodDeclaration && getMethodInfo( sourceFile, typeChecker, returnMethodDeclaration )

    return methodInfo
}

const getClassInfo = ( sourceFilePath: string ): ClassInfo[] => {

    const { program: _, typeChecker, programSourceFiles } = progFromSourcePath( [ sourceFilePath ] )
    const sourceFile = programSourceFiles.find( sf => sf.fileName === sourceFilePath ) as ts.SourceFile

    const classInfoList: ClassInfo[] = []

    function visit( node: ts.Node ) {
        if ( ts.isClassDeclaration( node ) && node.name ) {
            const className = node.name.text
            const isExported = node.modifiers?.some( mod => mod.kind === ts.SyntaxKind.ExportKeyword )
            const classInfo: ClassInfo = {
                name       : className,
                methods    : [],
                generics   : [],
                properties : [],
                isExported : isExported
            }

            // Extract generics
            if ( node.typeParameters ) {
                for ( const typeParam of node.typeParameters ) {
                    if ( ts.isTypeParameterDeclaration( typeParam ) )
                        classInfo.generics.push( {
                            name           : typeParam.name.text,
                            typeProperties : getTypeDeclPropertiesInfoFromNode( typeChecker, typeParam )[ 0 ]
                        } )
                }
            }

            // Extract methods and their parameters
            for ( const member of node.members ) {
                if ( ts.isMethodDeclaration( member ) ) {
                    const methodInfo = getMethodInfo( typeChecker, member )
                    classInfo.methods.push( methodInfo )
                } else if ( ts.isPropertyDeclaration( member ) ) {
                    const propertyName = ( member.name as ts.Identifier ).text
                    classInfo.properties.push( {
                        name           : propertyName,
                        typeProperties : getTypeDeclPropertiesInfoFromNode( typeChecker, member )[ 0 ]
                    } )
                }
            }

            classInfoList.push( classInfo )
        }

        ts.forEachChild( node, visit )
    }

    visit( sourceFile )

    return classInfoList
}




export {
    progFromSourcePath,

    printNode,

    getTypeDeclPropertiesInfo,
    getTypeDeclPropertiesInfoFromNode,
    propertiesInfoToRecord,

    findTypeDeclaration,
    getTypeDeclarations,
    getTypeDeclarationsWithInfo,

    getClassInfo
}

export type {
    TypeDeclPropertiesInfo
}