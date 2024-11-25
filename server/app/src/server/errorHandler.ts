/**
 * This file contains the middleware for the express server that handles all application errors and exceptions
 * @module
 */

import type { Request, Response, NextFunction } from "express"

import { ValidateError } from "tsoa"
import { ValidationError } from "@sequelize/core"

import { AuthError } from "../responders/authResponders.ts"
import { ValidationErrorResponder } from "../responders/controllerResponders.ts"
import { ClassValidationError, QueryValidationError } from "../responders/validationResponders.ts"
import { ServerError, ErrorResponder, type AllErrorsResponseBodyTypes } from "../responders/errorResponders.ts"

import { type JsonifiedRequest } from "./serverTypes.ts"

import config from "../config/config.ts"
import * as jwt from "jsonwebtoken"
const { TokenExpiredError } = jwt


/** This is all the error types that {@link errorHandler} handles */
type HandledServerErrorTypes =
    ValidateError
    | ValidationError
    | ClassValidationError
    | QueryValidationError
    | AuthError
    | SyntaxError
    | ServerError
    | Error

/**
 * This is the express middleware that handles all errors for the server
 * @param err - The error raised by the server application
 * @param req - The express request where the error was raised
 * @param res - The express response
 * @param next - The next function
 */
const errorHandler = (
    err: HandledServerErrorTypes,
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    const jsonifiedRequest: JsonifiedRequest = {
        method      : req.method,
        url         : req.url,
        headers     : req.headers,
        query       : req.query,
        body        : req.body,
        params      : req.params,
        cookies     : req.cookies,
        ip          : req.ip,
        protocol    : req.protocol,
        originalUrl : req.originalUrl,
        hostname    : req.hostname,
        path        : req.path,
        secure      : req.secure,
        xhr         : req.xhr,
    }

    const debugReponses = config.devMode && config.debugMode
        ? { debug: { message: err.message, cause: err.cause, request: jsonifiedRequest } }
        : {}


    let response: AllErrorsResponseBodyTypes | undefined
    let responseExtra = {}
    let responseStatusCode: number = ValidationErrorResponder.status


    if ( err instanceof ValidateError ) {
        // TSOA Validation Errors
        console.warn( `Caught ValidateError (TSOA) for ${req.path}:`, err.fields )
        const fieldsMessages = Object.keys( err.fields )
            .map( fieldName => `${fieldName} - ${err.fields[ fieldName ].message}` )
        const contentMessage = fieldsMessages.join( "\n" )
        const expandedDetails = config.devMode ? err.fields : undefined
        response = ValidationErrorResponder.Response(
            err.message,
            contentMessage,
            expandedDetails,
        )
    } else if ( err instanceof ValidationError ) {
        // Sequelize Validation Errors
        console.warn( `Caught ValidationError (sequelize) for ${req.path}:`, err.message )
        const errMessages = err.errors.map( err => `${err.message} (${err.path})` )
        const contentMessage = errMessages.join( "\n" )
        const expandedDetails = config.devMode ? err.errors : undefined
        response = ValidationErrorResponder.Response(
            err.message,
            contentMessage,
            expandedDetails,
        )
    } else if ( err instanceof ClassValidationError ) {
        // `class-validator` Validation Errors
        console.warn( `Caught ClassValidationError (class-validator) for ${req.path}:`, err.classValidatorErrors )
        const expandedDetails = config.devMode ? err.classValidatorErrors : undefined
        response = ValidationErrorResponder.Response(
            err.message,
            err.contentMessage,
            expandedDetails,
        )
    } else if ( err instanceof QueryValidationError ) {
        // Errors in TSOA routes query parameters
        console.warn( `Caught QueryValidationError for ${req.path}:`, err.message )
        response = ValidationErrorResponder.Response(
            err.message,
            err.message
        )

    } else if ( err instanceof AuthError ) {
        // Auth errors
        console.error( "AuthError", err.typeAndDetails, err.cause )
        const debugAuthError = config.devMode ? { details: err.detailsMessage } : { }
        response = err.Response( )
        responseStatusCode = err.status
        responseExtra = { debugAuth: debugAuthError }


        // if ( err.cause instanceof TokenExpiredError )
        if ( err.message.includes( "Expired" ) )
            res.redirect( "/logout?s=expired" )

    } else if ( err instanceof SyntaxError ) {
        // JSON parsing errors
        console.error( `Express - ${err.name} -`, err )
        responseStatusCode = 400

        const responseContent = [ { message: err.message } ]
        response = ErrorResponder.Response(
            responseContent,
            "Unparseable Input"
        )

    } else if ( err instanceof ServerError ) {
        // Thrown ServerError with specific status code - currently unused
        console.error( `Express - ${err.name} -`, err )

        responseStatusCode = err.status
        response = ErrorResponder.InternalServerErrorResponse( err.message )
    } else if ( err instanceof Error ) {
        // All other errors
        console.error( `Express - ${err.name} -`, err )

        responseStatusCode = ErrorResponder.internalErrorStatus
        response = ErrorResponder.InternalServerErrorResponse()
    }

    res.status( responseStatusCode ).json( {
        ...response,
        ...responseExtra,
        ...debugReponses
    } )


    if ( !response )
        console.error( "Fatal: Unhandled Server Error", err )

    next()
}

export { errorHandler, type HandledServerErrorTypes }