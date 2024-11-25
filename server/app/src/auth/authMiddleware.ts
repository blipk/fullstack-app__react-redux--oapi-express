/**
 * This module provides middleware related to authentication and authorization.
 *
 * There are three layers:
 * 1. {@link expressAuthentication} is a middleware used via `tsoa`'s `@Security` decorator that handles OAuth2.0 ROPC Authentication
 *      and scope based Authorization - the scopes as based on the `RoleModel`'s associated with a `UserModel`.
 *      It's a modified version from the tsoa guide here: https://tsoa-community.github.io/docs/authentication.html
 * 2. {@link authMiddleware}  is a middleware evaluated before controller routes that takes a series of validator functions that can validate
 *      against the Express Request/Response objects or the User object found in a JWT access token
 * 3. {@link routeSecurityFunctions} these are used within the controller routes and  provide additional authorization
 *      based on the current user and attributes of the model entity they are trying to access
 *
 *
 * @module
 */
import type { Request, Response, NextFunction } from "express"
import { Model } from "@sequelize/core"
import type jwt from "jsonwebtoken"

import { SecurityTypes, type AppJWTPayload, type SecurityScope } from "./authTypes.ts"
import { AuthError, AuthErrorDetails, AuthErrorTypes } from "../responders/authResponders.ts"
import { AuthHelper } from "./authHelper.ts"

import config from "../config/config.ts"
import { UserModel } from "../data/models/authModels.ts"
import { asyncEvery } from "../utils/utils.ts"
import { errorHandler, type HandledServerErrorTypes } from "../server/errorHandler.ts"
import type { AuthService } from "./authService.ts"


/** Function to validate api keys for the api_key security - currently not implemented */
const validateApiKey = ( apiKey?: string ) => {
    if ( config.devMode )
        return apiKey === "abc123456"
    else
        return false
}

/**
 * This is the function that handles authentication via the `tsoa` `@Security` decorator. it is configured in `tsoa.json`
 *
 * @param request  - The express request
 * @param securityName - The name of the security - must match `securityDefinitions` in `tsoa.json`
 * @param requiredScopes - Array of required scopes used for the OAuth2 security type that match `securityDefinitions.oauth2.scopes` in `tsoa.json`
 *    Prefer to use {@link auth/authTypes.securityScopeGroups} rather than providing scopes directly.
 *
 * @returns - A promise resolving to a jwt.JwtPayload for {@link SecurityTypes.OAuth2}, or an empty object for {@link SecurityTypes.API_KEY}
 */
function expressAuthentication(
    request: Request,
    securityName: SecurityTypes,
    requiredScopes?: SecurityScope[]
): Promise<jwt.JwtPayload | Record<never, never> | undefined> {

    if ( securityName === SecurityTypes.API_KEY ) {

        const apiKey = request.query.api_key

        if ( !apiKey )
            return Promise.reject( new AuthError( AuthErrorTypes.NOT_AUTHENTICATED, AuthErrorDetails.NO_API_KEY ) )

        if ( validateApiKey( apiKey as string ) )
            return Promise.resolve( {} )

        return Promise.reject( new AuthError( AuthErrorTypes.NOT_AUTHENTICATED, AuthErrorDetails.INVALID_API_KEY ) )

    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if ( securityName === SecurityTypes.OAuth2 ) {

        const token = AuthHelper.getEncodedJWT( request )

        if ( !token )
            return Promise.reject( new AuthError( AuthErrorTypes.NOT_AUTHENTICATED, AuthErrorDetails.NO_TOKEN ) )

        return AuthHelper.verifyJWT( token, requiredScopes )

    }

    return Promise.reject(
        new AuthError( AuthErrorTypes.NOT_AUTHENTICATED, AuthErrorDetails.AUTH_FAILURE )
    )
}



/**
 * An express request validator function used by {@link authMiddleware} -
 *
 * Receieves the express request and any available decoded authentication tokens.
 * It should check params, body etc for requirements and return a boolean.
 *
 * @returns A boolean indicating whether the authorization middleware is passed
 */
type AuthMiddlewareValidator = ( request: Request, decodedJwtPayload?: AppJWTPayload ) =>
    AuthMiddlewareValidatorReturnT | Promise<AuthMiddlewareValidatorReturnT>

/** Return type of {@link AuthMiddlewareValidator} - allow undefined as they should be checked to avoid security implications */
type AuthMiddlewareValidatorReturnT = boolean | undefined

/** Higher order function to wrap a {@link AuthMiddlewareValidator} */
type AuthMiddlewareValidatorHOF = ( ...args: any[] ) => AuthMiddlewareValidator


/** {@link authMiddleware} Validator to validate a userId request parameter matches the authenticated user */
const userIsResourceAuthValidator = ( request: Request, decodedJwtPayload?: AppJWTPayload ): boolean =>
    request.params.id === decodedJwtPayload?.user?.id.toString()

/**
 * {@link authMiddleware} Validator that authorizes a user as an admin
 *
 * @remarks We're using HMAC/HS512 to sign JWTs so this should be secure enough as they are not just signed but encrypted
 */
const userIsAdminAuthValidator = async ( _request: Request, decodedJwtPayload?: AppJWTPayload ): Promise<boolean> => {
    const usersId = decodedJwtPayload?.user?.id

    if ( !usersId )
        return false

    const sqUser = await UserModel.findByPk( usersId )

    return Boolean( await sqUser?.isAdmin )
}

/** {@link authMiddleware} Validator that authorizes a user has all of the required roles */
const userHasRolesAuthValidator: AuthMiddlewareValidatorHOF = ( requiredRoles?: string[] ) => {
    return async ( _request: Request, decodedJwtPayload?: AppJWTPayload ) => {
        const usersId = decodedJwtPayload?.user?.id

        if ( !usersId )
            return false

        const sqUser = await UserModel.findByPk( usersId )
        const usersRoles = await sqUser?.getRoles()
        const usersRolesNames = usersRoles?.map( role => role.name )

        // const userHasRequiredRoles = requiredRoles.every( requiredRole => usersRolesNames?.includes( requiredRole ) )
        // This is more efficient - O(1) vs O(N)
        const usersRolesNamesSet = new Set( usersRolesNames )
        const userHasRequiredRoles = requiredRoles?.every( requiredRole => usersRolesNamesSet.has( requiredRole ) )
        return userHasRequiredRoles
    }
}

/** HOF validator that checks if the user has requried roles, then continues to other validators if they aren't  */
const rolesOrEveryOther = ( requiredRoles: string[], validators: AuthMiddlewareValidator[] ) =>
    async ( request: Request, payload?: AppJWTPayload ): Promise<AuthMiddlewareValidatorReturnT> =>
        await userHasRolesAuthValidator( requiredRoles )( request, payload )
        || await asyncEvery( validators, async validator => await validator( request, payload ) === true )

/** HOF validator that checks if the user is an admin, then continues to other validators if they aren't */
const adminOrEveryOther = ( validators: AuthMiddlewareValidator[] ) =>
    async ( request: Request, payload?: AppJWTPayload ): Promise<AuthMiddlewareValidatorReturnT> =>
        await userIsAdminAuthValidator( request, payload )
        || await asyncEvery( validators, async validator => await validator( request, payload ) === true )


/** Wrapper for auth validators that support custom arguments */
const authValidatorsWithArgs: Record<string, AuthMiddlewareValidatorHOF> = {
    "userHasRoles" : userHasRolesAuthValidator,
    "rolesOr"      : rolesOrEveryOther,
    "adminOr"      : adminOrEveryOther,
}

/** Wrapper for any auth validators so they can be used by a single import */
const authValidators: Record<string, AuthMiddlewareValidator> = {
    "userIsAdmin"    : userIsAdminAuthValidator,
    "userIsResource" : userIsResourceAuthValidator
}


/**
 * This middleware handles more fine grained user access control that OAuth2 scopes aren't adequate for
 * as `tsoa`'s `@Middleware` decorator does not support any parameter passing - so we use a higher order function to do so
 *
 * @param validators - The {@link AuthMiddlewareValidator}'s functions that all must return true to pass the middleware
 *
 * @remarks
 * If using an api_token instead of OAuth2 then `getEncodedJWT` will raise an error and this function will always fail.
 * Requires further implementation.
*/
function authMiddleware( validators: AuthMiddlewareValidator[] ) {
    return async ( request: Request, response: Response, next: NextFunction ): Promise<void> => {
        try {
            const token = AuthHelper.getEncodedJWT( request )

            const decodedJwtPayload = await AuthHelper.verifyJWT( token )

            const isAuthorized = await asyncEvery(
                validators,
                async validator => await validator( request, decodedJwtPayload ) === true
            )

            if ( !isAuthorized )
                throw new AuthError(
                    AuthErrorTypes.NOT_AUTHORIZED,
                    AuthErrorDetails.INSUFFICIENT_PERMISSION,
                    { showDetails: true }
                )

            next()
        } catch ( e: unknown ) {
            // tsoa's @Middleware seem to run before the global error handling middleware we set up
            errorHandler( e as HandledServerErrorTypes, request, response, next )
        }
    }
}

/** The names of the implemented security functions */
const securityFunctionNames = [
    "alwaysAllow",
    "userIsAdminOrOwnsResourceFilters",
    "userIsAdminOrOwnsResource",
    "adminOrFilters",
    "adminOrHasProperty"
]

/** Valid keys for {@link routeSecurityFunctions} */
type RouteSecurityFunctionNames = typeof securityFunctionNames[number]

/** Possible return signature for {@link routeSecurityFunctions} */
type RouteSecurityFunction = ( authService: AuthService, request: Request | undefined, option?: Model | object, extraOption?: object )
    => Promise<object> | Promise<void> | undefined

/** Security functions used inside the controllers routes - evaluated after other authorization middleware against route entities */
const routeSecurityFunctions: Record<RouteSecurityFunctionNames, RouteSecurityFunction> = {

    alwaysAllow: ( _authService: AuthService, _request: Request | undefined ) => undefined,

    userIsAdminOrOwnsResourceFilters: async ( authService: AuthService, request: Request | undefined ) => {
        if ( !request ) throw new Error( "Could not find request" )

        const currentUser = await authService.getCurrentUser( request )
        const isAdmin = await currentUser?.isAdmin

        const notAuthenticated = !currentUser
        const notAuthorized = notAuthenticated || !isAdmin

        const extraWhereFilters = !isAdmin && ( currentUser && notAuthorized )
            ? { userId: currentUser.id || -1 }
            : {}

        return extraWhereFilters
    },

    userIsAdminOrOwnsResource: async ( authService: AuthService, request: Request | undefined, modelObject?: Model | object ) => {
        if ( !request ) throw new Error( "Could not find request" )
        if ( !modelObject ) throw new Error( "modelObject is required" )

        const currentUser = await authService.getCurrentUser( request )
        const isAdmin = await currentUser?.isAdmin

        if ( isAdmin ) return

        if (
            !currentUser ||
             ( "userId" in modelObject && modelObject.userId !== currentUser.id )
        )
            throw new AuthError( AuthErrorTypes.NOT_AUTHORIZED, AuthErrorDetails.INSUFFICIENT_PERMISSION )
    },

    adminOrFilters: async ( authService: AuthService, request: Request | undefined, filters?: object ) => {
        if ( !request ) throw new Error( "Could not find request" )
        if ( !filters ) throw new Error( "Filters not provided" )

        const currentUser = await authService.getCurrentUser( request )
        const isAdmin = await currentUser?.isAdmin

        const extraWhereFilters = !isAdmin
            ? filters
            : {}

        return extraWhereFilters
    },

    adminOrHasProperty: async ( authService: AuthService, request: Request | undefined, modelObject?: Model | object, filters?: object ) => {
        if ( !request ) throw new Error( "Could not find request" )
        if ( !modelObject ) throw new Error( "modelObject not provided" )
        if ( !filters ) throw new Error( "Filters not provided" )

        const currentUser = await authService.getCurrentUser( request )
        const isAdmin = await currentUser?.isAdmin

        if ( isAdmin ) return

        for ( const [ filterPropKey, filterPropValue ] of Object.entries( filters ) ) {
            const modelPropValue = modelObject instanceof Model
                ? await modelObject.get( filterPropKey )
                : modelObject[ filterPropKey as keyof typeof modelObject ]
            if ( !( filterPropKey in modelObject && modelPropValue === filterPropValue ) )
                throw new AuthError( AuthErrorTypes.NOT_AUTHORIZED, AuthErrorDetails.INSUFFICIENT_PERMISSION )
        }
        await Promise.resolve()
    },

}

export {
    expressAuthentication,

    authMiddleware,

    authValidators,
    userIsAdminAuthValidator,
    userIsResourceAuthValidator,

    authValidatorsWithArgs,
    userHasRolesAuthValidator,

    securityFunctionNames,
    routeSecurityFunctions,
}

export type {
    AuthMiddlewareValidator,
    AuthMiddlewareValidatorReturnT,
    AuthMiddlewareValidatorHOF,

    RouteSecurityFunctionNames,
    RouteSecurityFunction,
}