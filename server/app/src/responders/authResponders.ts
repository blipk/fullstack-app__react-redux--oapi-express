/**
 * This file contains typing and classes that generate the APIs authentication error responses
 * @module
 */


import type { UserModelDTO } from "../data/models/validationModels.ts"
import type { ReadResponseContent } from "./controllerResponders.ts"
import { ErrorResponder, type ErrorResponseBody } from "./errorResponders.ts"
import type { SignOptionsWithExpiresIn } from "../auth/authTypes.ts"

/** The response body for an {@link AuthError} */
type AuthErrorResponseBody = ErrorResponseBody<AuthErrorResponseContent, AuthErrorBodyMessageT>

/** This is the content of an {@link AuthErrorResponseBody.errors} */
interface AuthErrorResponseContent {
    message: AuthErrorTypes;
    details?: string;
}

/** Constant literal type for {@link AuthErrorResponseBody.message}  */
type AuthErrorBodyMessageT = "Auth Error"


/** The types of auth errors that can occur, this is used for {@link AuthErrorResponseContent.message} */
enum AuthErrorTypes {
    NOT_AUTHENTICATED = "Not Authenticated",
    NOT_AUTHORIZED = "Not Authorized",

    SECURITY_FAILURE = "Security Failure",
}

/** Details for specific cases of {@link AuthErrorTypes} */
enum AuthErrorDetails {
    // NOT_AUTHENTICATED
    NO_API_KEY,
    INVALID_API_KEY,
    NO_TOKEN,
    TOKEN_FAILURE,

    // NOT_AUTHORIZED
    MISSING_SCOPE,
    INSUFFICIENT_PERMISSION,

    // General
    AUTH_FAILURE,

    // SECURITY_FAILURE
    PASSWORD_STRENGTH,

    // AUTH_FAILURE
    INCORRECT_PASSWORD,
    NON_EXISTING_USER
}

/** Mapping between {@link AuthErrorDetails} and their corresponding message */
const authErrorDetailsMessages: Record<AuthErrorDetails, string> = {
    // NOT_AUTHENTICATED
    [ AuthErrorDetails.NO_API_KEY ]      : "No API Key Provided",
    [ AuthErrorDetails.INVALID_API_KEY ] : "Invalid API Key",
    [ AuthErrorDetails.NO_TOKEN    ]     : "No Token Provided",
    [ AuthErrorDetails.TOKEN_FAILURE ]   : "JWT Validation Failure",

    // NOT_AUTHORIZED
    [ AuthErrorDetails.MISSING_SCOPE ]           : "JWT Missing Required Scope",
    [ AuthErrorDetails.INSUFFICIENT_PERMISSION ] : "Missing Required Permission",

    // General
    [ AuthErrorDetails.AUTH_FAILURE ]: "Authentication Failure",

    // SECURITY_FAILURE
    [ AuthErrorDetails.PASSWORD_STRENGTH ]  : "Password not strong enough",
    [ AuthErrorDetails.INCORRECT_PASSWORD ] : "Invalid login attempt",
    [ AuthErrorDetails.NON_EXISTING_USER ]  : "Invalid login attempt",
}


/** Status codes for the different {@link AuthErrorTypes} */
type AuthErrorStatusCodes = 401 | 403 | 400


/** Mapping between {@link AuthErrorTypes} and their corresponding {@link AuthErrorStatusCodes} */
const authErrorTypesToStatusCodes: Record<AuthErrorTypes, AuthErrorStatusCodes> = {
    [ AuthErrorTypes.NOT_AUTHENTICATED ] : 401,
    [ AuthErrorTypes.NOT_AUTHORIZED ]    : 403,
    [ AuthErrorTypes.SECURITY_FAILURE ]  : 400
}

/**
 * Options for an {@link AuthError}
 * @param showDetails - Whether to include the {@link AuthErrorDetails} in the response generated from the {@link AuthError}
 */
interface AuthErrorOptions extends ErrorOptions {
    showDetails?: boolean
}

/** Union type of the numerical literals allowed for {@link AuthError} response codes - the same values as in {@link AuthErrorStatusCodes} */
type AuthErrorStatusCodesT = 400 | 401 | 403

/**
 * This class represents an error in the applications auth flow
 */
class AuthError extends Error {
    public readonly type: AuthErrorTypes
    public readonly details: AuthErrorDetails
    public readonly typeAndDetails: string
    public readonly options: AuthErrorOptions
    public readonly status: AuthErrorStatusCodesT

    public readonly expandedDetails?: object

    /**
     *
     * @param type - The type of the auth error - used as the error response message
     * @param details - The details for the auth error - only shown in the response if {@link AuthErrorOptions.showDetails} is true
     * @param options - The options for the auth error
     */
    constructor(
        type: AuthErrorTypes,
        details: AuthErrorDetails,
        options?: AuthErrorOptions,
        expandedDetails?: object
    ) {
        const defaultOptions = { "showDetails": false }
        const defaultedOptions = { ...defaultOptions, ...options }
        const typeAndDetails = `${type} - ${authErrorDetailsMessages[ details ]}`
        const message = defaultedOptions.showDetails ? typeAndDetails : type

        super( message, defaultedOptions )
        this.type = type
        this.details = details
        this.typeAndDetails = typeAndDetails
        this.options = defaultedOptions
        this.status = authErrorTypesToStatusCodes[ type ]

        this.expandedDetails = expandedDetails
    }

    /** Gets the message for the details type */
    get detailsMessage(): string {
        return authErrorDetailsMessages[ this.details ]
    }

    /** Generator for the {@link AuthErrorResponseBody} */
    Response( ): AuthErrorResponseBody {
        const response = ErrorResponder.Response(
            this.ResponseContent(),
            "Auth Error" as AuthErrorBodyMessageT
        )
        return response
    }

    /** Generator for the {@link AuthErrorResponseBody.errors} */
    ResponseContent( ): AuthErrorResponseContent[] {
        const errorsContent = [
            {
                message : this.type,
                details : this.options.showDetails ? this.detailsMessage : undefined
            }
        ]
        return errorsContent
    }

}

/** OAuth2 Response Body compliant with RFC6749 = https://www.rfc-editor.org/rfc/rfc6749#section-4.2.2 */
interface OAuth2TokenResponseBody {
    access_token: string,
    token_type: "Bearer" | "bearer" //| "mac" | "MAC", // https://www.rfc-editor.org/rfc/rfc6749#section-7.1
    expires_in: string | number,
    // refresh_token: string // not implemented

    // Extra parameters
    user: ReadResponseContent<UserModelDTO, "password">
}


/** This class is used for constructing auth success responses */
class AuthSuccessResponder {
    static readonly status: 200 = 200 as const

    /**
     * Generates a {@link responders/dataResponders.DataResponseBody} for auth success - used by {@link controllers/authController.AuthController}
     *
     * @param accessToken - The JSON Web Token value for {@link OAuth2TokenResponseBody.access_token}
     * @param jwtSignOptions - The options the JWT was signed with
     * @param user - The user the JWT belongs to
     * @returns A HTTP response body in the {@link OAuth2TokenResponseBody} format
     */
    static OAuth2TokenResponse(
        accessToken: string,
        jwtSignOptions: SignOptionsWithExpiresIn,
        user: ReadResponseContent<UserModelDTO, "password">,
    ): OAuth2TokenResponseBody {
        return {
            "access_token" : accessToken,
            "token_type"   : "Bearer",
            "expires_in"   : jwtSignOptions.expiresIn,
            user           : user,
        }
    }

}


export type {
    OAuth2TokenResponseBody,

    AuthErrorBodyMessageT,
    AuthErrorResponseBody,
    AuthErrorResponseContent,

    AuthErrorStatusCodesT,
    AuthErrorOptions,
}

export {
    AuthError,
    AuthErrorTypes,
    AuthErrorDetails,
    authErrorDetailsMessages,

    type AuthErrorStatusCodes,
    authErrorTypesToStatusCodes,

    AuthSuccessResponder
}