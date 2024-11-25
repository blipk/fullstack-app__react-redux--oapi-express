/**
 * This file configures and initializes the connection to the database
 * using sequelize and our application configuration.
 *
 * It also contains the basic functions for connecting to and syncronising the database.
 *
 * @module
 */

import { Sequelize } from "@sequelize/core"
import { SqliteDialect } from "@sequelize/sqlite3"
import type { ModelStatic, Options, QueryOptions, RetryOptions, SyncOptions } from "@sequelize/core"

import { sleep } from "../utils/utils.ts"

import config, { ensureDevMode } from "../config/config.ts"
import { allModels } from "./models/models.ts"


/** These are pool options that need to be set if we want to use an in memory sqlite database */
const extraOptions = config.db.storagePath === ":memory:"
    ? {
        pool: {
            max  : 1,
            idle : Infinity,
        }
    }
    : {}


/** The default options for the Sequelize db instance */
const defaultDbOptions: Options<SqliteDialect> = {
    dialect: SqliteDialect,

    storage  : config.db.storagePath,
    password : config.db.password, //The "PRAGMA KEY" password to use for the connection, if using plugins like sqlcipher.

    logging: config.db.logFunction,

    models: allModels,

    // Table/Model creation options
    // define: {
    //     underscored: true,
    // },

    ...extraOptions
}

/**
 * Makes a Sequelize db instance with {@link defaultDbOptions}
 * @param overrideOptions - Extra options to override {@link defaultDbOptions}
 */
const dbMaker = ( overrideOptions: Partial<Options<SqliteDialect>> = {} ): Sequelize<SqliteDialect> =>
    new Sequelize<SqliteDialect>( { ...defaultDbOptions, ...overrideOptions } )

/**
 * This is the applications main Sequelize instance
 */
const defaultDb = dbMaker( )


/** Establish any scopes we've defined on the model classes */
const establishDBModelScopes = (): void => {
    console.log( "Establishing model scopes" )
    allModels.forEach( ( model ) => {
        Object.entries( model.establishScopes || {} ).forEach( ( [ scopeName, findOptions ] ) => {
            ;( model as ModelStatic ).addScope( scopeName, findOptions, { override: true } )
        } )
    } )
}
establishDBModelScopes()

/** Set up any hooks */
const establishDBHooks = (): void => {
    defaultDb.hooks.addListener( "beforeBulkSync", ( syncOptions: SyncOptions ) => {
        console.log( "Calling sequelize.sync()...", syncOptions )
    } )

    defaultDb.hooks.addListener( "afterBulkSync", ( syncOptions: SyncOptions ) => {
        console.log( "Completed sequelize.sync()", syncOptions )
    } )
}
establishDBHooks()


/**
 * Checks the connection to the database via the Sequelize.authenticate() method
 *
 * @param timeoutSeconds - The connection fails if the connection time exceeds this
 * @param db - The Sequelize db instance to check, defaults to {@link defaultDb}
 */
const checkDB = async (
    timeoutSeconds: number = defaultRetryOptions.timeoutSeconds,
    db = defaultDb
): Promise<void> => {
    return new Promise( ( resolve, reject ) => {

        // These don't really work how you would expect: https://github.com/sequelize/sequelize/issues/17459
        // Timeout doesn's apply per retry but overall, hence our wrapper function connectDB() to handle retries
        const retryOptions: RetryOptions = {
            name    : "checkDB",
            max     : 1,
            timeout : timeoutSeconds * 1000,
            // backoffBase     : retryIntervalSeconds * 1000,
            // backoffExponent : 1
            // reporter : console.log
        }
        const options: QueryOptions = { retry: retryOptions }

        db
            .authenticate( options )
            .then( ( ) => {
                console.log( "Connection to database has been established successfully.", )
                resolve( undefined )
            } )
            .catch( ( e: unknown ) => {
                console.error( "Unable to connect to the database:", ( e as Error ).message )
                reject( e as Error )
                return
            } )
    } )
}


/**
 * Retry options for when connecting to the database
 *
 * @param timeoutSeconds - The connection fails if the connection time exceeds this
 * @param maxAttempts - Maximum mumber of attempts to retry connecting to the database
 * @param retryIntervalSeconds - Waits for this long between retrying failed connections
 */
interface DbRetryOptions {
    timeoutSeconds: number
    maxAttempts: number
    retryIntervalSeconds: number
}

/**
 * Options for {@link connectDB} - includes {@link DbRetryOptions}
 *
 * @param sync - Whether to call sequelize.sync() before sequelize.authenticate() - defaults to true, should be false in development methods
 */
interface DbConnectOptions extends DbRetryOptions {
    sync?: boolean,
}

/** Default {@link DbConnectOptions} for {@link DbRetryOptions} */
const defaultRetryOptions: DbRetryOptions = {
    timeoutSeconds       : config.db.connectionTimeout,
    maxAttempts          : config.db.connectionMaxAttempts,
    retryIntervalSeconds : config.db.connectionRetryInterval
}

/** Default for {@link connectDB} */
const defaultDbConnectOptions: DbConnectOptions = {
    sync: true,
    ...defaultRetryOptions
}

/**
 * Syncs a Sequelize db instance, and attempts to test the connection to the database
 *
 * This needs to be run to initialize models.
 *
 * @param dbConnectOptions - The retry and connection options
 */
const connectDB = async (
    dbConnectOptions?: Partial<DbConnectOptions>,
    db = defaultDb,
): Promise<void> => {
    const {
        sync,
        timeoutSeconds,
        maxAttempts,
        retryIntervalSeconds
    } = { ...defaultDbConnectOptions, ...dbConnectOptions }

    if ( sync ) await db.sync()


    const loopAttempts = maxAttempts === Infinity ? Number.MAX_SAFE_INTEGER : maxAttempts

    for ( let i = 0; i < loopAttempts; i++ ) {
        try {
            await checkDB( timeoutSeconds, db )
            return
        } catch ( e: unknown ) {
            const getPrecision = ( n: number, maxPrecision = 20 ) =>
                n.toFixed( maxPrecision ).replace( /0+$/, "" ).split( "." )[ 1 ]?.length ?? 0
            const fixToPrecision = ( n: number ) => n.toFixed( getPrecision( n ) )
            const timeoutMessage = `Connection timeout after ${fixToPrecision( timeoutSeconds )} seconds`
            const wrappedError = new Error( timeoutMessage, { cause: e } )
            console.warn(
                `Database connection attempt ${i+1} failed, will retry after ${retryIntervalSeconds} seconds...`,
                wrappedError.message
            )
            await db.close()
            await sleep( retryIntervalSeconds )
        }
    }
    throw new Error( `Failed to connect to the database after ${maxAttempts} attempts.` )
}

/**
 * Syncronises the database using the sequelize sync function,
 * Which creates, recreates or updates tables depending on the options provded.
 *
 * If the `models` argument is not provided then all models from the Sequalize initializer will be used.
 *
 * This function is only usable if development mode is enabled in configuration
 *
 * @remarks
 * Three helper functions are provided below which wrap this with some SyncOptions defaults:
 * initializeDB, updateDB, and recreateDB.
 *
 * This function and the wrappers should only be used in development,
 * it will error if development mode is not enabled.
 *
 *
 * @param options - The SyncOptions from sequelize to use with the sync() function
 * @param models - An optional list of models to initialize. All models will be initialized if not provided.
 * @param db - The Sequelize db instance to sync, defaults to {@link defaultDb}
 */
const syncDB = async (
    options: SyncOptions,
    models?: ModelStatic[],
    db = defaultDb
): Promise<void> => {

    ensureDevMode()

    await connectDB( { sync: false }, db )

    if ( models ) {
        for ( const model of models ) {
            model
                .sync( options )
                .then( ( _ ) => {
                    console.log( "Database models syncd successfully." )
                } )
                .catch( ( e: unknown ) => {
                    console.log( "Error while syncing database models:", e )
                    throw e
                } )
        }
    } else {
        await db
            .sync( options )
            .then( ( _ ) => {
                console.log( "Database models syncd successfully." )
            } )
            .catch( ( e: unknown ) => {
                console.log( "Error while syncing database models:", e )
                throw e
            } )
    }
}


/** Wrapper for {@link syncDB} with no options */
const initializeDB = async ( models?: ModelStatic[], db = defaultDb ): Promise<void> => syncDB( { }, models, db )

/** Wrapper for {@link syncDB} with options `{ alter: true }` */
const updateDB = async ( models?: ModelStatic[], db = defaultDb ): Promise<void> => syncDB( { alter: true }, models, db )

/** Wrapper for {@link syncDB} with options `{ force: true }` */
const recreateDB = async ( models?: ModelStatic[], db = defaultDb ): Promise<void> => {
    ensureDevMode()
    return syncDB( { force: true }, models, db )
}

/**
 * Attempts to gracefully close the sequelize database connection.
 *
 * Used on application shutdown.
 *
 * @returns A boolean value indicating whether the shutdown was performed gracefully
 */
const shutdownDB = async ( db = defaultDb ): Promise<boolean> => {
    console.log( "Shutting down db connection..." )
    return await db
        .close()
        .then( _ => {
            console.log( "Database connection closed gracefully." )
            return true
        } ).catch ( ( e: unknown ) => {
            console.error( "Error closing the database connection:", e )
            return false
        } )
}


/**
 * This removes all indexes from the database.
 *
 * Should only be used in development mode when recreating and seeding the database
 *
 * @param raiseOnError - if true then errors will be raised if encountered
 * @param db - The Sequelize db instance to remove all indexes from, defaults to {@link defaultDb}
 */
const removeAllIndexes = async( raiseOnError = false, db = defaultDb ): Promise<void> => {
    ensureDevMode()

    try {
        await connectDB( { sync: false }, db )
        await db.queryRaw( "PRAGMA foreign_keys = OFF;" )

        // Get all tables
        const tables = await db.queryInterface.listTables()

        for ( const tableNameWithSchema of tables ) {
            const tableName = tableNameWithSchema.tableName
            const indexes = await db.queryInterface.showIndex( tableName )

            for ( const index of indexes ) {
                const options = {
                    // concurrently : true,
                    // ifExists     : true,
                    // cascade      : true,
                }
                await db.queryInterface.removeIndex( tableName, index.name, options )
                console.log( `Removed index ${index.name} from table ${tableName}` )
            }
        }

        console.log( "All indexes removed successfully." )
    } catch ( e ) {
        console.error( "Error removing indexes:", e )
        if ( raiseOnError ) throw e
    } finally {
        await db.queryRaw( "PRAGMA foreign_keys = ON;" )
    }
}


export {
    dbMaker,
    establishDBModelScopes,
    establishDBHooks,
    checkDB, connectDB, shutdownDB,
    syncDB, initializeDB, updateDB, recreateDB,
    removeAllIndexes,
    defaultRetryOptions, defaultDbConnectOptions
}

export type { DbRetryOptions, DbConnectOptions }

export default defaultDb