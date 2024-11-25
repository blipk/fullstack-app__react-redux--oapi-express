/**
 * This file contains the interfaces for the application configuration schema.
 *
 * This includes config for the app, for the express server and for the sequelize ORM.
 *
 * @module
 */

import type { Logging } from "@sequelize/core"


/**
 * Schema for the application configuration.
 *
 * Environment variables in CAPS_CASE are converted to these snakeCase properties.
 * e.g. devMode is DEV_MODE in .env
 *
 * @param devMode - Enables the API documentation endpoint at `/docs` and allows running development scripts
 * @param debugMode - Enables debug level logging and error responses
 * @param devInitDb - Runs the database deletion and reinitialization function on startup
 *
 * @param port - The port to run the api server on; defaults to `3000`
 *
 * @param oapiSpecFilePath - Generated field from application directory and tsoa.json
 *
 * @param db - See {@link DBConfig}
 * @param auth - See {@link AuthConfig}
 *
 */
interface Config {

    devMode: boolean
    debugMode: boolean
    devInitDb: boolean

    /** @defaultValue 3000 */
    port: number
    oapiSpecFilePath: string // Generated

    db: DBConfig

    auth: AuthConfig

}


/**
 * Schema for application authentication and authorization config
 *
 * Environment variables in CAPS_CASE are converted to these snakeCase properties.
 * e.g. jwtSecret is AUTH_JWT_SECRET in .env
 *
 * @param jwtSecret - The secret or signing key to create auth JWTs
 * @param jwtIssuer - The issuer name to use and validating against with JWTs
 */
interface AuthConfig {
    jwtSecret: string
    jwtIssuer: string
}


/** Allowed log levels for the sequelize database connection */
enum DBLogLevels {
    NO_LOG = 0,
    STANDARD = 1,
    VERBOSE = 2,
}

/** The default logging function for {@link DBLogLevels} level 1 */
const defaultDbLogFunction = console.log

/** The verbose logging function for {@link DBLogLevels} level 2 */
const verboseDbLogFunction = ( ...msg: unknown[] ): void => { console.log( msg ) }

/** Mapping of log functions for each {@link DBLogLevels} */
const dbLogFunctions: Record<DBLogLevels, DbLogFunctionType> = {
    [ DBLogLevels.NO_LOG ]   : () => null,
    [ DBLogLevels.STANDARD ] : defaultDbLogFunction,
    [ DBLogLevels.VERBOSE ]  : verboseDbLogFunction
}


/** The type of the logging functions for Sequelize instances logging option */
type DbLogFunctionType = Logging["logging"]

/**
 * Schema for application database configuration through sequelize. (only the sqlite dialect is currently supported)
 *
 * Environment variables in CAPS_CASE are converted to these snakeCase properties -
 * and prefixed from their level in {@link Config}
 * e.g. logLevel is DB_LOG_LEVEL in .env
 *
 * @param logLevel - The database/sequelize log level - one of {@link DBLogLevels}; `0` disables logging, defaults to `1`,
 * @param logFunction - Generated from {@link logLevel} and {@link dbLogFunctions} - the log function passed to the sequelize constructor
 *
 * @param storageName - The name to name the db file `${DB_STORAGE_NAME}.sqlite`, :memory: for an in memory sqlite database. defaults to `app-storage`
 * @param storageDir - Generated from the server root directory and `./storage`
 * @param storagePath - Genereated from {@link storageDir} and {@link storageName} joined
 *
 * @param password - Passed to Sequelize constructor - the "PRAGMA KEY" password to use for the connection, if using plugins like sqlcipher
 *
 * @param connectionTimeout - Seconds to wait to connecting to the db before timing out; default `5`
 * @param connectionMaxAttempts - Maximum number of attempts to try connecting to the database after timeouts; default `3`
 * @param connectionRetryInterval - Seconds to wait in between database connection attempts; default `2`
 */
interface DBConfig {
    logLevel: DBLogLevels,
    logFunction: DbLogFunctionType,

    storageName: string
    storageDir: string
    storagePath: string

    password: string

    connectionTimeout: number
    connectionMaxAttempts: number
    connectionRetryInterval: number
}

export type {
    Config,

    DBConfig,
    DbLogFunctionType,

    AuthConfig
}

export {
    DBLogLevels,

    dbLogFunctions,
    defaultDbLogFunction,
    verboseDbLogFunction
}