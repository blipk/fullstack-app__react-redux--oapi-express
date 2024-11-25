/**
  * This is the server root file, it configures and runs the server.
  * @module
 */
import fs from "fs"

import express from "express"
import type { Express, NextFunction, Request, Response } from "express"

import cors from "cors"
import helmet from "helmet"

import swaggerUi, { type JsonObject } from "swagger-ui-express"

import config from "./config/config.ts"
import { connectDB, shutdownDB } from "./data/connector.ts"
import { dbInitializer } from "./data/initializer.ts"

import { errorHandler } from "./server/errorHandler.ts"

import { RegisterRoutes } from "./tsoa-build/routes.ts"


if ( config.devMode && config.devInitDb )
    await dbInitializer( undefined, false )


// Express server initialization and configuration
const app: Express = express()

// Use middleware parsers for expected request body types
// app.use( express.text() )
app.use( express.json( { strict: false } ) )
app.use( express.urlencoded( { extended: false } ) )


// Use CORS middleware, configured to allow our frontend from localhost
type StaticOrigin = boolean | string | RegExp | Array<boolean | string | RegExp>
type CorsCallback = ( err: Error | null, origin?: StaticOrigin ) => void

const corsOptions: cors.CorsOptions = {
    origin: ( requestOrigin: string | undefined, callback: CorsCallback ) => {
        const allowedOrigins = [
            "http://localhost",
            "https://localhost",
            "http://localhost:5173",
            "http://localhost:3000",
            "http://192.168.1.104",
            "https://192.168.1.104",
            "http://192.168.1.104:5173",
            "https://192.168.1.104:5173",
        ]

        if ( !requestOrigin || allowedOrigins.includes( requestOrigin ) ) {
            callback( null, allowedOrigins )
        } else {
            callback( new Error( "Not allowed by CORS" ) )
        }
    }
}
app.use( cors( corsOptions ) )


// Use helmet middleware for more HTTP response header security
app.use( helmet() )


// Use middleware to adjust base path when running behind relocated nginx reverse proxy
app.use( ( req: Request, _res: Response, next: NextFunction ) => {
    if ( req.url.startsWith( "/api" ) )
        req.url = req.url.slice( 4 )
    next()
} )

// Use routes to serve the OpenAPI spec and swagger-ui in development mode
if ( config.devMode ) {
    console.warn( "Server is running in development mode" )
    const specFileContent = fs.readFileSync( config.oapiSpecFilePath, "utf-8" )
    const swaggerDocument = JSON.parse( specFileContent ) as JsonObject
    app.use( "/openapi.json", express.static( config.oapiSpecFilePath ) )
    app.use( "/docs", swaggerUi.serve, swaggerUi.setup( swaggerDocument, { explorer: true } ) )
    console.log( "API docs available at /docs" )
}

if ( config.debugMode )
    console.warn ( "Server is running in debug mode" )

// Use TSOA for our Route handling, this is generated with the `gen-tsoa` script in package.json
RegisterRoutes( app )


// Use default end route for managed not-found (404)
app.use( ( _req: Request, res: Response ) => {
    res.status( 404 ).send( {
        message: "Not Found",
    } )
} )


// Use a global error handler middleware - This must be registered after all other routes and app.use() calls
app.use( errorHandler )


// Bring our sequelize db connection alive
await connectDB()


// Listen and serve the express server
const server = app.listen( config.port, () => {
    console.log( `[server]: Server is running at http://localhost:${config.port}` )
} )

let isServerRunning = true

server.on( "close", () => {
    isServerRunning = false
} )


// Clean up the express and then sequelize connections on user interrupt or process termination
const shutdownHandler = ( ) => {
    console.log( "Attempting graceful shutdown..." )
    if ( isServerRunning ) {
        server.close( err => {
            if ( err ) {
                console.log( "Error closing the server:", err )
                process.exit( 1 )
            }

            console.log( "Server closed gracefully." )

            // process.on and server.close both expect a sync funtion but sequelize close method is async...
            void ( async () => {
                const result = await shutdownDB()
                if ( !result )
                    process.exit( 1 )
            } )()
        } )
    } else {
        void ( async () => {
            const result = await shutdownDB()
            if ( !result )
                process.exit( 1 )
        } )()
    }
}

process.on( "SIGINT", shutdownHandler )
process.on( "SIGTERM", shutdownHandler )
