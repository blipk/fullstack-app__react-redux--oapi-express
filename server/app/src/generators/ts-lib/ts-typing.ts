/**
 * This file contains helpers for working with the ts compiler.
 * Specifically with `ts.TypeChecker` and the typenodes it gets from visited nodes - `getTypeAtLocation(ts.Node)`
 *
 * It also contains some general typeguards
 * @module
 */

import * as ts from "typescript"

const getTypeFlagNames = ( type: ts.Type ): string[] => {
    const flagNames: string[] = []

    // Iterate over all TypeFlags keys and values
    for ( const flagName in ts.TypeFlags ) {
        if ( Object.prototype.hasOwnProperty.call( ts.TypeFlags, flagName ) ) {
            const flagValue = ts.TypeFlags[ flagName ]
            if ( typeof flagValue === "number" && ( type.flags & flagValue ) !== 0 ) {
                flagNames.push( flagName )
            }
        }
    }

    return flagNames
}

const isObjectType = ( type: ts.Type ): boolean =>
    !!( type.flags & ts.TypeFlags.Object )

const isUnionType = ( type: ts.Type ): boolean =>
    !!( type.flags & ts.TypeFlags.Union )

const isStructuredType = ( type: ts.Type ): boolean =>
    ( type.flags & ts.TypeFlags.StructuredType ) !== 0

/** Checks if a type is an alias of another type - this will return true on both sides of a `getTypeAtLocation(TypeAliasDeclaration)` **/
const isAliasType = ( type: ts.Type, otherType: ts.Type ): boolean => {
    return type === otherType
}

/** Checks if a TypeDeclaration is an alias to another TypeDeclaration */
const isAliasOfType = ( typeAlias: ts.TypeAliasDeclaration, originalTypeAlias: ts.TypeAliasDeclaration ): boolean => {
    if ( ts.isTypeReferenceNode( typeAlias.type ) ) {
        const typeName = typeAlias.type.typeName
        return ts.isIdentifier( typeName ) && typeName.text === originalTypeAlias.name.text
    }
    return false
}

export { getTypeFlagNames, isAliasOfType, isAliasType, isObjectType, isStructuredType, isUnionType }