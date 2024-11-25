/**
 * This file searches for the homepage of all the packages in package.json and prints them in a list
 *
 * @module
 */
import * as fs from "fs"
import * as path from "path"

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

async function fetchPackageHomepage( packageName: string ): Promise<string> {
    try {
        const response = await fetch( `https://registry.npmjs.org/${packageName}` )
        if ( !response.ok ) {
            throw new Error( `Failed to fetch data for package: ${packageName}` )
        }
        const packageData = await response.json() as object
        return "homepage" in packageData ? packageData.homepage as string : `https://www.npmjs.com/package/${packageName}`
    } catch ( error ) {
        console.error( error )
        return `https://www.npmjs.com/package/${packageName}`
    }
}

async function findWebsitesForDependencies( packageJsonPath: string ) {
    const packageJsonFullPath = path.resolve( packageJsonPath )
    if ( !fs.existsSync( packageJsonFullPath ) ) {
        console.error( `File not found: ${packageJsonFullPath}` )
        return
    }

    const packageJsonContent = fs.readFileSync( packageJsonFullPath, "utf-8" )
    const packageJson: PackageJson = JSON.parse( packageJsonContent ) as PackageJson

    const allDependencies = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
    }

    for ( const packageName of Object.keys( allDependencies ) ) {
        const homepage = await fetchPackageHomepage( packageName )
        console.log( `${packageName}: ${homepage}` )
    }
}

// Change './package.json' to the path of your package.json file if necessary
findWebsitesForDependencies( "./package.json" ).catch( ( e: unknown ) => { console.error( e ) } )