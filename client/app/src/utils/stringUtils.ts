/**
 * This file contains functions for manipulating strings
 *
 * @module
 */

const camelToHyphenCase = ( input: string ): string =>
    input.replace( /([a-z])([A-Z])/g, "$1-$2" ).toLowerCase()


const camelToCapitalCase = ( input: string ): string =>
    input
        .replace( /([a-z])([A-Z])/g, "$1 $2" )
        .replace( /^./, ( str ) => str.toUpperCase() )

export { camelToHyphenCase, camelToCapitalCase }