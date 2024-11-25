/**
 * This file contains typing and classes that generate the APIs error responses
 *
 * @module
 */

import type { AuthErrorBodyMessageT, AuthErrorResponseBody, AuthErrorResponseContent } from "./authResponders.ts"
import type { ValidationErrorMessageT, ValidationErrorResponseBody, ValidationErrorResponseContent } from "./validationResponders.ts"


/** Represents the base type for {@link ErrorResponseBody.errors}  */
interface ErrorsTypeBase<ErrorDetailsType extends object> {
    message: string
    details?: ErrorDetailsType | string
}


/** Represents the response body of an error response */
interface ErrorResponseBody<ErrorsType extends ErrorsTypeBase<object>, MessageType extends string> {
    errors: ErrorsType[],
    message: MessageType
}


/** {@link ErrorResponseBody.message} for internal server errors */
type InternalServerErrorMessageT = "Internal Server Error"

/** {@link ErrorResponseBody.errors} for internal server errors */
interface InternalServerErrorResponseContent {
    message: string
}

/** {@link ErrorResponseBody} for internal server errors */
type InternalServerErrorResponeBody = ErrorResponseBody<InternalServerErrorResponseContent, InternalServerErrorMessageT>


/**
 * This class is used for constructing the response body of the applications error responses
 */
class ErrorResponder {
    static readonly internalErrorStatus = 500 as const

    static InternalServerErrorResponse(
        errorMessage?: string
    ): InternalServerErrorResponeBody {
        errorMessage ??= "Internal Server Error"
        return {
            message : "Internal Server Error",
            errors  : [ { message: errorMessage } ],
        }
    }

    static Response<ErrorsType extends ErrorsTypeBase<object>, MessageType extends string >(
        errors: ErrorsType[],
        message: MessageType,
    ): ErrorResponseBody<ErrorsType, MessageType> {
        return {
            errors  : errors,
            message : message,
        }
    }

}



/** This is the message constant for {@link SyntaxErrorResponseBody.message} */
type SyntaxErrorMessageT = "Unparseable Input"

/** This is the message constant for {@link SyntaxErrorResponseBody.errors} */
interface SyntaxErrorResponseContent {
    message: string
    details?: string,
}

/** This represents a syntax error when parsing JSON content */
type SyntaxErrorResponseBody = ErrorResponseBody<SyntaxErrorResponseContent, SyntaxErrorMessageT>


/**
 * Represents the options for {@link ServerError}
 * @param status - The HTTP status code to be returned
 */
interface ServerErrorOptions {
    status: number
}

/**
 * Used for raising arbitrary errors with a specific error code - handled by the global error handler in {@link index}
 */
class ServerError extends Error {
    status: number

    constructor( message: string, serverErrorOptions?: ServerErrorOptions, options?: ErrorOptions ) {
        super( message, options )

        const { status = 500 } = serverErrorOptions || {}
        this.status = status
    }
}


/** Represents all possible types for {@link ErrorResponseBody.errors} */
type AllErrorsResponseContentTypes = ValidationErrorResponseContent | AuthErrorResponseContent | SyntaxErrorResponseContent

/** Represents all possible types for {@link ErrorResponseBody.message} */
type AllErrorResponseBodyMessageTypes = ValidationErrorMessageT | AuthErrorBodyMessageT | SyntaxErrorMessageT | InternalServerErrorMessageT

/** Represents all possible types of {@link ErrorResponseBody} */
// type AllErrorsResponseBodyTypes = ErrorResponseBody<AllErrorsResponseContentTypes, AllErrorResponseBodyMessageTypes>

/** Represents all possible types of {@link ErrorResponseBody} */
type AllErrorsResponseBodyTypes = ValidationErrorResponseBody | AuthErrorResponseBody | SyntaxErrorResponseBody | InternalServerErrorResponeBody


export {
    ErrorResponder,
    ServerError
}

export type {
    ErrorsTypeBase,
    ErrorResponseBody,
    ServerErrorOptions,


    SyntaxErrorResponseBody, SyntaxErrorResponseContent, SyntaxErrorMessageT,
    InternalServerErrorResponeBody, InternalServerErrorResponseContent, InternalServerErrorMessageT,

    AllErrorsResponseBodyTypes, AllErrorsResponseContentTypes, AllErrorResponseBodyMessageTypes
}