/**
 * This file generates a client for the frontend based on the OpenAPI schema which tsoa generates.
 * @module
 */

import path from "path"

import { createClient, type UserConfig } from "@hey-api/openapi-ts"

import config, { ensureDevMode } from "../config/config.ts"
import { getAppRoot } from "../utils/utils.ts"
import { formatApiClient } from "./api-client-transform.ts"

ensureDevMode()

/**
 * Use `@hey-api/openapi-ts` to generate the `@hey-api/client-axios` client for the frontend,
 * and apply some post-processing.
 */
const generateClient = async (): Promise<void> => {
    console.log( "Generating api client..." )

    const appRoot = getAppRoot( import.meta.dirname )

    const outputPath = path.join( appRoot, "../../" , "/client/app/src/api-client/" )

    const createClientOptions: UserConfig = {
        client: {
            name: "@hey-api/client-axios"
        },
        input  : config.oapiSpecFilePath,
        output : {
            lint : "eslint",
            path : outputPath
        },
        services: {
            asClass : true,
            export  : true
        },
        types: {
            export : true,
            enums  : "typescript",
            dates  : "types+transform"
        },
        schemas: {
            export: false,
            // type   : "form",
        }
    }

    const client = await createClient( createClientOptions )

    // See https://heyapi.vercel.app/openapi-ts/clients/axios.html for client usage

    console.log( client.length )
    console.log( `Axios client for server API generated and saved to ${outputPath}` )

    // Copy the models
    // const modelsDir = path.join( appRoot, "src", "data", "models" )
    // const modelsDestDir = path.join( outputPath, "models" )
    // copyDirectory( modelsDir, modelsDestDir )
    // console.log( `App models copied to ${modelsDestDir}` )

    formatApiClient( outputPath )

    console.log( "Client generation complete." )
}

const isRunDirectly = import.meta.filename.includes( process.argv[ 1 ] )
if ( isRunDirectly )
    await generateClient()


export { generateClient }
