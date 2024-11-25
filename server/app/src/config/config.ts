/**
 * This file contains the functions that parse, validate and load the application configuration from the environment variables.
 *
 * @module
 */
import fs from "fs"
import path from "node:path"
import dotenv from "dotenv"
dotenv.config()

import type { Config as TsoaConfig } from "tsoa"

import type { Config } from "./configTypes.ts"
import { dbLogFunctions, DBLogLevels } from "./configTypes.ts"
import { integerRangeValidator, numberRangeValidator, validateConfigField } from "./configHelpers.ts"

import { getAppRoot } from "../utils/utils.ts"


// Get the config from the process environment or the .env file we loaded above
const {
    // Dev settings
    DEV_MODE = false,
    DEBUG_MODE = false,
    DEV_INIT_DB = false,

    // App settings
    PORT = 3000,

    // DB settings
    DB_LOG_LEVEL = 1, // 0 to disable sequelize database logging
    DB_STORAGE_NAME = "app-storage", // This will be used for the sequelize `storage` option i.e. the database filename
    DB_PASSWORD = "!", // This is only used if we use an encryption plugin i.e. sqlcipher

    // DB connection options
    DB_CONNECTION_TIMEOUT = 5,
    DB_CONNECTION_MAX_ATTEMPTS = 3,
    DB_CONNECTION_RETRY_INTERVAL = 2,

    // Auth settings
    AUTH_JWT_SECRET = "",
    AUTH_JWT_ISSUER = ""
} = process.env


// Parsing/Validating of config options that require it
const port = Number( PORT )

validateConfigField(
    port,
    ( v ) => integerRangeValidator( v, 1, 65535 ),
    `Config option 'PORT' must be a positive integer less than 65535 - Received value '${PORT}'.`
)

const minDbLogLevel: DBLogLevels = 0
const maxDbLogLevel: DBLogLevels = 2
const dbLogLevelNumber = Number( DB_LOG_LEVEL )

validateConfigField(
    dbLogLevelNumber,
    ( v ) => integerRangeValidator( v, minDbLogLevel, maxDbLogLevel ),
    `Config option 'DB_LOG_LEVEL' must be a value from ${minDbLogLevel} to ${maxDbLogLevel} - Received value '${DB_LOG_LEVEL}'.`
)

const dbLogLevel = DBLogLevels[ dbLogLevelNumber ] || DBLogLevels.STANDARD
const dbLogFunction = dbLogFunctions[ dbLogLevel as DBLogLevels ]

const dbConnectionTimeout = Number ( DB_CONNECTION_TIMEOUT )
const connectionMaxAttempts = Number ( DB_CONNECTION_MAX_ATTEMPTS )
const dbConnectionRetryInterval = Number ( DB_CONNECTION_RETRY_INTERVAL )

validateConfigField(
    dbConnectionTimeout,
    ( v ) => numberRangeValidator( v, 0, Number.POSITIVE_INFINITY ),
    `Config option 'DB_CONNECTION_TIMEOUT' must be a positive number (including Infinity) - Received value '${DB_CONNECTION_TIMEOUT}'.`
)

validateConfigField(
    dbConnectionTimeout,
    ( v ) => Number.isFinite( v ) || v === 0,
    `Warning: Config option 'DB_CONNECTION_TIMEOUT' is '${DB_CONNECTION_TIMEOUT}' - make sure this is correct.`,
    true
)

validateConfigField(
    dbConnectionRetryInterval,
    ( v ) => numberRangeValidator( v, 0, Number.MAX_VALUE ),
    `Config option 'DB_CONNECTION_RETRY_INTERVAL' must be a valid positive number or 0 - Received value '${DB_CONNECTION_RETRY_INTERVAL}'.`
)

validateConfigField(
    dbConnectionRetryInterval,
    ( v ) => v as number < 1000,
    `Warning: Config option 'DB_CONNECTION_RETRY_INTERVAL' is '${DB_CONNECTION_RETRY_INTERVAL}' - make sure this is correct.`,
    true
)

validateConfigField(
    connectionMaxAttempts,
    ( v ) => numberRangeValidator( v, 1, Infinity ),
    `Config option 'DB_CONNECTION_MAX_ATTEMPTS' must be a valid positive number or 0 - Received value '${DB_CONNECTION_MAX_ATTEMPTS}'.`
)

validateConfigField(
    connectionMaxAttempts,
    ( v ) => Number.isFinite( v ),
    `Warning: Config option 'DB_CONNECTION_MAX_ATTEMPTS' is '${DB_CONNECTION_MAX_ATTEMPTS}' - make sure this is correct.`,
    true
)

const authJwtSecret = AUTH_JWT_SECRET
const authJwtIssuer = AUTH_JWT_ISSUER

validateConfigField(
    authJwtSecret,
    ( v ) => Boolean( v ),
    `Config option 'AUTH_JWT_SECRET' must be a valid non-empty string - Received value '${AUTH_JWT_SECRET}'.`
)

validateConfigField(
    authJwtIssuer,
    ( v ) => Boolean( v ),
    `Config option 'AUTH_JWT_ISSUER' must be a valid non-empty string - Received value '${AUTH_JWT_ISSUER}'.`
)


// Generate the path to store the database file
// This is set here to prevent confusion when setting to a relevant path,
// as `gen-database` script runs in a different cwd to the server
const appRootDir = getAppRoot()
const projectRootDir = path.join( appRootDir, "../" )

const dbStorageDir = path.join( projectRootDir, "storage" )
const generatedStoragePath =
    DB_STORAGE_NAME === ":memory:"
        ? DB_STORAGE_NAME
        : path.join( dbStorageDir, `${DB_STORAGE_NAME}.sqlite` )


// Extract spec file location from tsoa.json
const tsoaConfigFileName = path.join( appRootDir, "tsoa.json" )
const tsoaConfigFileContent = fs.readFileSync( tsoaConfigFileName, "utf8" )
const tsoaConfig: TsoaConfig = JSON.parse( tsoaConfigFileContent ) as TsoaConfig

const specExtension = tsoaConfig.spec.yaml ? "yml" : "json"
const specFileDefaultBaseName = "swagger"
const specFileBaseName = tsoaConfig.spec.specFileBaseName ?? specFileDefaultBaseName
const specFileName = `${specFileBaseName}.${specExtension}`
const tsoaBuildDir = path.join( appRootDir, tsoaConfig.spec.outputDirectory )
const generatedOapiSpecPath = path.join( tsoaBuildDir, specFileName )



/** Global generated configuration instance for the application */
const config: Config = {
    devMode          : Boolean( DEV_MODE ),
    debugMode        : Boolean( DEBUG_MODE ),
    devInitDb        : Boolean( DEV_INIT_DB ),
    oapiSpecFilePath : generatedOapiSpecPath,
    port             : port,
    db               : {
        logLevel                : dbLogLevel as DBLogLevels,
        logFunction             : dbLogFunction,
        storageDir              : dbStorageDir,
        storageName             : DB_STORAGE_NAME,
        storagePath             : generatedStoragePath,
        password                : DB_PASSWORD,
        connectionTimeout       : dbConnectionTimeout,
        connectionMaxAttempts   : connectionMaxAttempts,
        connectionRetryInterval : dbConnectionRetryInterval
    },

    auth: {
        jwtSecret : authJwtSecret,
        jwtIssuer : authJwtIssuer
    }
}


/**
* Some application functions should only be used when development mode is enabled,
* this function should be called in those places to ensure that it is.
*/
const ensureDevMode = (): void => {
    if ( config.devMode )
        return

    console.error( Error( "Database generation routines should only be used in development mode" ) )
    process.exit( 1 )
}



export { ensureDevMode }
export default config