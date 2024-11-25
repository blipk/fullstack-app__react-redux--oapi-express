/**
 * This file contains a class with static methods for helping with authentication actions
 * @module
 */


import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import type { Request } from "express"

import config from "../config/config.ts"
import { AuthError, AuthErrorDetails, AuthErrorTypes } from "../responders/authResponders.ts"

import type { UserModel } from "../data/models/authModels.ts"
import { SecurityScope, type AppJWTPayload, type EncodedJWTWithDetails, type SignOptionsWithExpiresIn } from "./authTypes.ts"


/** The function type for checking security requirements */
type SecurityRequirementCheckerFunction = ( password: string ) => boolean

/** The type for security requirement checkers - `result` and `processed` should always be `false` on initialization */
interface SecurityRequirementChecker {
    name: string,
    checkFunction: SecurityRequirementCheckerFunction,
    message: string,
    processed: boolean,
    result: boolean
}


/** Default {@link SecurityRequirementChecker}'s - `result` and `processed` should always be `false` on initialization */
const defaultSecurityRequirementCheckers: SecurityRequirementChecker[] = [
    {
        name          : "passwordLength",
        checkFunction : ( p ) => p.length >= 8,
        message       : "Password must be atleast 8 characters long",
        result        : false,
        processed     : false,
    }
]


/** The default options used for signing a JWT with {@link AuthHelper.createJWT} */
const defaultJWTSignOptions: SignOptionsWithExpiresIn = {
    expiresIn : "7d",
    algorithm : "HS512"
}



/**
 *  This is a static helper class to help with auth actions
 * It is used in {@link auth/authService} as well as the tsoa authentication middleware {@link auth/authMiddleware.expressAuthentication}
 */
class AuthHelper {


    /**
     * Takes an array of {@link SecurityRequirementChecker}'s and constructs a message from all that have failed
     * @param securityRequirementCheckers - The {@link SecurityRequirementChecker}
     * @returns an array of strings with the message for each failed checker
     */
    public static checkedPasswordMessages( securityRequirementCheckers: SecurityRequirementChecker[] ): string[] {
        return securityRequirementCheckers
            .filter( checker => checker.processed && !checker.result )
            .map( checker => checker.message )
    }

    /**
     * Checks the strength of a password against security requirements
     * @param plainPassword - the plaintext password to check
     * @returns A tuple where the first value is a boolean indicating all security requirements are met,
     *  the second value is the array of {@link SecurityRequirementChecker}'s with their results set from running their checkFunction
     */
    public static checkPassword(
        plainPassword: string,
        securityRequirementCheckers?: SecurityRequirementChecker[]
    ): [boolean, SecurityRequirementChecker[]] {

        securityRequirementCheckers ??= defaultSecurityRequirementCheckers

        const checkedSecurityRequirmentsCheckers =
            securityRequirementCheckers
                .map(
                    ( checker ) => (
                        {
                            ...checker,
                            result    : checker.checkFunction( plainPassword ),
                            processed : true
                        }
                    )
                )


        const allSecurityRequirementsMet = checkedSecurityRequirmentsCheckers.every( v => v.result )

        return [ allSecurityRequirementsMet, checkedSecurityRequirmentsCheckers ]
    }

    /**
     * Salts and hashes a password using bcrypt
     * @param plainPassword - the plaintext password to hash
     * @returns the salted and hashed password in bcrypt string format
     */
    public static async hashPassword( plainPassword: string ): Promise<string> {

        const salt = await bcrypt.genSalt( 10 )
        const hashedPassword = await bcrypt.hash( plainPassword, salt )

        return hashedPassword
    }

    /**
     * Verifies a plaintext password against a bcrypt format hashed password
     * @param plainPassword - The plaintext password
     * @param hashedPassword - The hashed password to compare it against
     * @returns A boolean indicating whether the plain password matches the hash
     */
    public static async verifyPassword( plainPassword: string, hashedPassword: string ): Promise<boolean> {

        const isMatch = await bcrypt.compare( plainPassword, hashedPassword )

        return isMatch

    }


    /**
     * Creates a JWT for a user, using scopes from their database roles, or providing them seperately
     *
     * @param user - The user to create the JWT for
     * @param jwtSignOptions - The options to sign the jwt with, uses {@link defaultJWTSignOptions} as a base
     * @param overrideScopes - If provided the JWT will be created with these scopes instead of those from the users roles in the database
     *
     * @returns An promise that resolves to a {@link EncodedJWTWithDetails}
     */
    public static async createJWT(
        user: UserModel,
        jwtSignOptions?: SignOptionsWithExpiresIn,
        overrideScopes?: string[]
    ): Promise<EncodedJWTWithDetails> {

        const plainUser = await user.toJSONAsync()
        const usersRoles = await user.getRoles()
        const scopes = overrideScopes
            || usersRoles.map(
                role => SecurityScope[ ( role.name.toUpperCase() as keyof typeof SecurityScope ) ]
            )

        const payload: AppJWTPayload = {
            user   : plainUser,
            scopes : scopes as SecurityScope[]
        }

        jwtSignOptions ??= defaultJWTSignOptions
        jwtSignOptions = { ...defaultJWTSignOptions, ...jwtSignOptions }
        jwtSignOptions.issuer = config.auth.jwtIssuer

        return new Promise( ( resolve, reject ) => {

            const signCallback = ( err: Error | null, token: string | undefined ) => {
                if ( err || !token ) {
                    reject(
                        new AuthError(
                            AuthErrorTypes.NOT_AUTHENTICATED,
                            AuthErrorDetails.AUTH_FAILURE,
                        )
                    )
                    return
                }

                resolve( {
                    jwt            : token,
                    jwtSignOptions : jwtSignOptions
                } )
            }

            jwt.sign(
                payload,
                config.auth.jwtSecret,
                jwtSignOptions,
                signCallback
            )
        } )
    }

    /**
     * Looks for a JWT in an express request in compliance with RFC6750
     * @param request - The express request object
     * @returns the JWT if its found, or undefined
     */
    public static getEncodedJWT( request: Request ): string | undefined {
        // https://www.rfc-editor.org/rfc/rfc6750

        type BodyWithJWT = Record<string, unknown> & {access_token?: string}

        const authorizationHeader = request.headers.authorization
        const authorizationHeaderContainsBearer =
            authorizationHeader
            && authorizationHeader.startsWith( "Bearer" )
            && authorizationHeader.split( " " ).length === 2

        const authorizationHeaderToken = authorizationHeaderContainsBearer && authorizationHeader.split( " " )[ 1 ]

        const requestBodyIsFormEncoded = request.is( "application/x-www-form-urlencoded" ) && request.method === "GET"
        const authorizationUrlEncodedToken = requestBodyIsFormEncoded && ( request.body as BodyWithJWT ).access_token

        const queryParamToken = request.query.access_token as string

        const token: string | undefined = authorizationHeaderToken || authorizationUrlEncodedToken || queryParamToken

        return token
    }

    /**
     * Decodes a JWT and then verifies it against the key in configuration and any required scopes
     *
     * @param token - the encoded JWT to verify
     * @param requiredScopes - The scopes that are required for the verification request
     * @returns An application specific jwt payloud - {@link AppJWTPayload}
     */
    public static verifyJWT( token: string | undefined, requiredScopes?: SecurityScope[] ): Promise<AppJWTPayload | undefined> {

        // jwt.Verify will throw an error if no token or an invalid token is provided, so check that first
        const noTokenError =  new AuthError(
            AuthErrorTypes.NOT_AUTHENTICATED,
            AuthErrorDetails.TOKEN_FAILURE,
            { showDetails: true }
        )

        if ( !token )
            return Promise.reject( noTokenError )

        const decodeOptions: jwt.DecodeOptions = {}
        const decodedToken = jwt.decode( token, decodeOptions )

        if ( !decodedToken )
            return Promise.reject( noTokenError )

        return new Promise( ( resolve, reject ) => {

            const verifyCallback: jwt.VerifyCallback<jwt.Jwt> = ( err, decodedJwt?: jwt.Jwt ) => {

                if ( err || !decodedJwt || typeof decodedJwt !== "object" ) {
                    reject(
                        new AuthError(
                            AuthErrorTypes.NOT_AUTHENTICATED,
                            AuthErrorDetails.TOKEN_FAILURE,
                            { showDetails: true, cause: err }
                        )
                    )
                    return
                }

                const { payload, header, signature } = decodedJwt as jwt.Jwt & { payload: AppJWTPayload | string }

                if ( typeof payload !== "object" || typeof header !== "object" || !signature ) {
                    reject(
                        new AuthError(
                            AuthErrorTypes.NOT_AUTHENTICATED,
                            AuthErrorDetails.TOKEN_FAILURE,
                            { showDetails: true, cause: err }
                        )
                    )
                    return
                }

                // Check if JWT contains all required scopes
                if ( requiredScopes )
                    for ( const requiredScope of requiredScopes ) {
                        if ( !payload.scopes.includes( requiredScope ) ) {
                            reject(
                                new AuthError(
                                    AuthErrorTypes.NOT_AUTHORIZED,
                                    AuthErrorDetails.MISSING_SCOPE,
                                )
                            )
                            return
                        }


                    }

                resolve( payload )
            }

            // If `complete` is true then the callback is VerifyCallback<jwt.Jwt> otherwise it is VerifyCallback<JwtPayload | string>
            const verifyOptions: jwt.VerifyOptions & {complete: true} = {
                complete : true,
                issuer   : config.auth.jwtIssuer
            }
            jwt.verify( token, config.auth.jwtSecret, verifyOptions, verifyCallback )

        } )
    }

}

export { AuthHelper, defaultJWTSignOptions, defaultSecurityRequirementCheckers }
export type {
    SignOptionsWithExpiresIn, EncodedJWTWithDetails,
    SecurityRequirementChecker, SecurityRequirementCheckerFunction
}