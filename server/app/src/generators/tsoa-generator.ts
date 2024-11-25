/**
 * This file uses TSOA to generate the OpenAPI/Swagger spec, as well as the TSOA routes from the class controllers.
 *
 * @module
 */
import fs from "fs"
import path from "path"

import { ESLint } from "eslint"
import * as ts from "typescript"

import type {
    ExtendedRoutesConfig,
    ExtendedSpecConfig,
    Config
} from "tsoa"
import {
    generateRoutes,
    generateSpec
} from "tsoa"


import { getAppRoot } from "../utils/utils.ts"
import { ensureDevMode } from "../config/config.ts"

ensureDevMode()


const appRoot = getAppRoot( import.meta.dirname )

// https://github.com/lukeautry/tsoa/issues/868#issuecomment-1445941911
// This probably isn't necessary in this applications case, but may save some trouble in the future
const tsConfigFileName = path.join( appRoot, "tsconfig.json" )
const tsConfigFile = ts.readConfigFile( tsConfigFileName, ( path, encoding?: string ) => ts.sys.readFile( path, encoding ) )
const tsConfigContent = ts.parseJsonConfigFileContent( tsConfigFile.config, ts.sys, appRoot )
const tsCompilerOptions = tsConfigContent.options

// Import the config from `tsoa.json` - this makes it so options remain the same if we use the CLI or this function
const tsoaConfigFileName = path.join( appRoot, "tsoa.json" )
const tsoaConfigFileContent = fs.readFileSync( tsoaConfigFileName, "utf8" )
const tsoaConfig: Config = JSON.parse( tsoaConfigFileContent ) as Config


const specOptions = { ...tsoaConfig.spec, ...tsoaConfig } as ExtendedSpecConfig
const routeOptions = { ...tsoaConfig.routes, ...tsoaConfig } as ExtendedRoutesConfig


/**
 * This function programatically generates the TSOA spec file and routes file.
 * This is so the routes and spec can always be updated before launching the server.
 */
const generateTSOA = async (): Promise<void> => {
    console.log( "Generating tsoa spec..." )
    await generateSpec( specOptions, tsCompilerOptions, tsoaConfig.ignore )

    console.log( "Generating tsoa routes..." )
    await generateRoutes( routeOptions, tsCompilerOptions, tsoaConfig.ignore )


    const routesFile = path.join( tsoaConfig.routes.routesDir, "routes.ts" )
    if ( tsCompilerOptions.verbatimModuleSyntax && fs.existsSync( routesFile ) ) {
        console.log( "Fixing routes imports..." )
        const routesFileContents = fs.readFileSync( routesFile, "utf8" )

        // Should we add these back in after linting?
        const newContents = routesFileContents
            .replace( "/* tslint:disable */", "" )
            .replace( "/* eslint-disable */", "" )

        fs.writeFileSync( routesFile, newContents )

        // This is using eslint.config.mjos - might need to add plugins if it doesnt in some case
        const eslintOptions: ESLint.Options = {
            overrideConfig: {
                rules: {
                    "@typescript-eslint/consistent-type-imports": [ "error", { "prefer": "type-imports", "fixStyle": "separate-type-imports" } ],
                },
            },
            fix    : true,
            ignore : false,
        }
        const eslint = new ESLint( eslintOptions )
        const results = await eslint.lintFiles( [ `${routeOptions.routesDir}/*.ts` ] )
        await ESLint.outputFixes( results )

        // const formatter = await eslint.loadFormatter( "stylish" )
        // const resultText = formatter.format( results, {} )
        // console.log( resultText )
    }

    console.log( "TSOA Generation complete." )
}

// Check if the current script is being run directly
const isRunDirectly = import.meta.filename.includes( process.argv[ 1 ] )
if ( isRunDirectly )
    await generateTSOA()


export default generateTSOA
