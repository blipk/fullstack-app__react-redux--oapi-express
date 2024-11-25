/**
 * This file contains the configuration schema and functions for the application.
 *
 * @module
 */
import dotenv from "dotenv"
import { integerRangeValidator, validateConfigField } from "./configHelpers.ts"

try {
    // This is only used in dev scripts
    dotenv.config()
} catch ( e: unknown ) {
    if ( !( e as Error ).message.includes( "process is not defined" ) )
        throw e
}


// Get the config from environment or the .env file we loaded above
const {
    // App settings
    VITE_DEV_MODE: DEV_MODE = false, // NOTE: any value in env vars will be passed as truthy
    VITE_DEBUG_MODE: DEBUG_MODE = false,

    VITE_API_HOST: API_HOST = "http://localhost/",
    VITE_API_PORT: API_PORT = 3000,
    VITE_API_PATH: API_PATH = "/",
} = import.meta.env as Record<string, string | number> | undefined || process.env



/**
 * Schema for the application configuration
 *
 * Environment variables in CAPS_CASE are converted to these snakeCase properties -
 * and prefixed with VITE_ as it requires
 * e.g. apiHost is VITE_API_HOST in .env
 *
 * @param devMode - Enables the API documentation endpoint at `/docs` and allows running development scripts
 * @param debugMode - Enables debug level logging and error responses
 *
 * @param apiHost - The hostname the api server is running on; defaults to `"http://localhost/"`
 * @param apiPort - The port the api server is running on; defaults to `3000`
 * @param apiPath - The path the api server is running under; defaults to `"/"`
 * @param apiURL - Generated from the other api config options
 *
 **/
interface Config {
    devMode: boolean
    debugMode: boolean

    apiHost: string
    apiPort: number
    apiPath: string
    apiURL: string
}


// Parsing/Validating of config options that require it
const apiPort = Number( API_PORT )

validateConfigField(
    API_PORT,
    ( v ) => integerRangeValidator( v, 1, 65535 ),
    `Config option 'API_PORT' must be a positive integer less than 65535 - Received value '${API_PORT}'.`
)


// Patch so we can still use this config with the package development scripts
// global.location = global.location || { protocol: "http:", hostname: "localhost" }
const currentHost = `${location.protocol}//${location.hostname}`

// Trim any trailing slashes
const apiHost = ( API_HOST as string || currentHost ).replace( new RegExp( "/+$" ), "" )
const apiPath = API_PATH as string

const urlPort = [ 80, 443 ].includes( apiPort ) ? "" : `:${apiPort}`
const apiURL = `${apiHost}${urlPort}/${apiPath}`


const urlValidator = ( v: string ) => {
    try {
        const url = new URL( v )
        return [ "http:", "https:" ].includes( url.protocol ) ? true : false
    } catch ( _: unknown ) {
        return false
    }
}

if ( apiHost )
    validateConfigField(
        apiURL,
        ( v ) => urlValidator( v as string ),
        `Config options 'API_HOST', 'API_PORT' and 'API_PATH' must form a valid http/s URL - Received value '${apiURL}'.`
    )


/** Global generated configuration instance for the application */
const config: Config = {
    devMode   : Boolean( DEV_MODE ),
    debugMode : Boolean( DEBUG_MODE ),

    apiHost : apiHost,
    apiPort : apiPort,
    apiPath : apiPath,
    apiURL  : apiURL
}



/**
* Some application functions should only be used when development mode is enabled,
* this function should be called in those places to ensure that it is.
*/
const ensureDevMode = (): void => {
    if ( config.devMode )
        return

    const e = new Error( "This routine should only be used in development mode" )
    console.error( e.message )
    throw e

}


export { ensureDevMode }
export type { Config }
export default config