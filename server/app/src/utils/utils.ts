/**
 * This file contains various utility functions
 * @module
 */

import fs from "fs"
import path from "path"


/**
 * Pause the application process
 *
 * @param seconds - how many seconds to pause for
 */
const sleep = async ( seconds: number ): Promise<void> => new Promise( ( resolve ) => setTimeout( resolve, seconds * 1000 ) )

/**
 * Tries to find the application root directory by traversing from the current directory upwards until `package.json` is found
 *
 * @param searchFrom - Search starting from this directory - defaults to `import.meta.dirname`
 * @param maxSearchDepth - Search up to this - default value is 10
 *
 * @returns The path of the app root if it was found, or undefined
 * @throws An error if the appRoot could not be found as this is generally a critical function
 */
const getAppRoot = (
    searchFrom?: string,
    maxSearchDepth = 10
): string => {

    searchFrom ??= import.meta.dirname || __dirname

    let appRoot
    for ( let currentDepth = 0; currentDepth < maxSearchDepth + 0; currentDepth++ ) {
        const parentLevels = "../".repeat( currentDepth )
        appRoot = path.join( searchFrom, parentLevels )
        const currentSearchPath = path.join( appRoot, "package.json" )
        const packageJsonFound = fs.existsSync( currentSearchPath )
        // console.log( currentDepth, appRoot, packageJsonFound )
        if ( packageJsonFound ) break
    }

    if ( !appRoot )
        throw new Error(
            `Could not find application root directory containing \`package.json\` - searched ${maxSearchDepth} levles from ${searchFrom}`
        )

    return appRoot
}

/**
 * Gets the call stack with various filtering options
 *
 * @param onlyInApp - if true then only calls within the application are included
 * @param includeCallbacks - whether to include callback functions
 * @param includeAnonymous - whether to include anonymous functions
 * @returns an array of the call stack levels
 */
const getAppCallStack = (
    onlyInApp = true,
    includeCallbacks = true,
    includeAnonymous = true,
): string[] | undefined => {
    const appRoot = getAppRoot()

    const error = new Error()
    const stack = error.stack?.split( "\n" )
        .filter( s =>
            s.includes( " at " ) // some lines arent stack lines
            && ( !s.includes( "getAppCallStack" ) )
            && ( includeCallbacks || !s.includes( "Object.callback" ) )
            && ( includeAnonymous || !s.includes( "<anonymous>" ) )
            && (
                !onlyInApp || ( s.includes( appRoot ) && !s.includes( "node_modules" ) )
            )
        )
        .map( s => s.trim() )

    return stack
}

/**
 * Recursively copies a directory and files
 * @param src - the source directory to copy
 * @param dest - the destination to copy it too
 */
const copyDirectory = ( src: string, dest: string ): void => {
    // Ensure the destination directory exists
    fs.mkdirSync( dest, { recursive: true } )

    // Get the entries (files and directories) in the source directory
    const entries = fs.readdirSync( src, { withFileTypes: true } )

    for ( const entry of entries ) {
        const srcPath = path.join( src, entry.name )
        const destPath = path.join( dest, entry.name )

        if ( entry.isDirectory() )
            copyDirectory( srcPath, destPath )
        else
            fs.copyFileSync( srcPath, destPath )
    }

}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const AsyncFunction = ( async () => {} ).constructor

/**
 * Determines if a function is async or not
 * @remarks - There is a node builtin for this, but like the constructor.name check, it can fail in minification
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const isAsyncFunction = ( fn: Function ): boolean =>
    fn.constructor.name === "AsyncFunction" || fn instanceof AsyncFunction

/** Wrapper around array.every to use await in the predicate */
const asyncEvery = async <T>( arr: T[], predicate: ( value: T ) => Promise<boolean> ): Promise<boolean> => {
    const results = await Promise.all( arr.map( predicate ) )
    return results.every( result => result )
}

/** Type for Class constructors - used by {@link getMethodNames} */
type ClassConstructor<T = unknown> = new ( ...args: unknown[] ) => T;

/**
 * Given a class, return the names of both its instance and static methods
 * @param cls - The class to get the method names for
 */
function getMethodNames<T>( cls: ClassConstructor<T> ): { instanceMethods: string[], staticMethods: string[] } {
    // Get instance methods
    const prototypePropertyNames = Object.getOwnPropertyNames( cls.prototype )
    const instanceMethods = prototypePropertyNames.filter( name => {
        const descriptor = Object.getOwnPropertyDescriptor( cls.prototype, name )
        return descriptor && typeof descriptor.value === "function" && name !== "constructor"
    } )

    // Get static methods
    const staticPropertyNames = Object.getOwnPropertyNames( cls )
    const staticMethods = staticPropertyNames.filter( name => {
        const descriptor = Object.getOwnPropertyDescriptor( cls, name )
        return descriptor && typeof descriptor.value === "function"
    } )

    return { instanceMethods, staticMethods }
}

export { getAppRoot, getAppCallStack, sleep, copyDirectory, isAsyncFunction, asyncEvery, getMethodNames }