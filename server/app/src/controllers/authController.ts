/**
 * This file contains the TSOA controller for operations with UserModel
 * @module
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Controller, Tags, Route, // Controller
    Get, Post, Delete, Patch, // Methods
    Request, Response, SuccessResponse, // Methods extra
    Body, BodyProp, Path, Res, Query, // Method arguments
    Security, Middlewares, Header,
    type TsoaResponse,
} from "tsoa"

import { type Request as ExpressRequest } from "express"

import {
    type AppModelIdT,

    type ReadResponseBody, type ReadResponseContent,
    type ReadResponseBodyArray, type ReadResponseContentArray,

    type CreateRequestBody,
    type CreateResponseBody, type CreateResponseContent,

    type UpdateRequestBody,
    type UpdateResponseBody, type UpdateResponseContent,

    type DeleteResponseBody,

    type NotFoundResponseBody,
    type ValidationErrorResponseBody,
    type AuthErrorResponseBody,

    type DataResponseBody,


    NotFoundResponder,
    ValidationErrorResponder,
    FoundResponder,
    CreatedResponder,
    UpdatedResponder,
    DeletedResponder,
    type FoundResponseMessageT,
    type CreatedResponseMessageT,
    type UpdatedResponseMessageT,

    createRequestBodyOmittedKeys, createResponseContentOmittedKeys,
    readResponseContentOmittedKeys,
    updateRequestBodyOmittedKeys, updateResponseContentOmittedKeys,
} from "../responders/controllerResponders.ts"

import { ClassValidationError, QueryValidationError, validator } from "../responders/validationResponders.ts"
/* eslint-enable @typescript-eslint/no-unused-vars */

import { UserModel } from "../data/models/models.ts"
import { UserModelDTO } from "../data/models/validationModels.ts"

import { provideSingleton, inject } from "./ioc/inversifyProvider.ts"
import { AuthService } from "../auth/authService.ts"
import { AuthErrorTypes, AuthError, AuthErrorDetails, AuthSuccessResponder, type OAuth2TokenResponseBody } from "../responders/authResponders.ts"
import { AuthHelper, type EncodedJWTWithDetails } from "../auth/authHelper.ts"
import { responseDeletedKeys, responseIgnoredKeys } from "./generated/userController.ts"



/** Possible responses for {@link AuthController.login} */
type AuthLoginResponse = OAuth2TokenResponseBody

/** Request body format for {@link AuthController.register}'s `blog` body parameter */
type AuthRegisterRequestBody = CreateRequestBody<UserModelDTO, "isAdmin" | "isStaff" | "fullName", "profileImageURL">

/** Possible responses for {@link AuthController.register} */
type AuthRegisterResponse =
    // ReadResponseBody<UserModelDTO, "User", "password"> // tsoa hates this
    DataResponseBody<
        ReadResponseContent<UserModelDTO, "password" | "updatedAt">,
        "User",
        FoundResponseMessageT
    >



/**
 * Route controller for authentication actions
 */
@provideSingleton( AuthController )
@Response<AuthErrorResponseBody>( 401, AuthErrorTypes.NOT_AUTHENTICATED )
@Response<AuthErrorResponseBody>( 403, AuthErrorTypes.NOT_AUTHORIZED )
@Response<ValidationErrorResponseBody>( 422, ValidationErrorResponder.validationMessage )
@Route( "auth" )
@Tags( "Auth" )
export class AuthController extends Controller {
    private readonly authService: AuthService

    constructor(
        @inject( AuthService ) authService: AuthService
    ) {
        super()
        this.authService = authService
    }

    /**
     * This route handles auth login attempts
     * @param username - the OAuth2 username to try log in with, which is the email in this application
     * @param password - the password to try log in with
     * @returns
     */
    @Post( "login" )
    public async login(
        @BodyProp() username: string,
        @BodyProp() password: string,
        @Request() _request?: ExpressRequest,
    ): Promise<AuthLoginResponse> {
        this.setStatus( AuthSuccessResponder.status )

        // Check if the user exists
        const sqUser = await UserModel.withScope( "withPassword" ).findOne( { where: { email: username } } )

        if ( !sqUser )
            throw new AuthError(
                AuthErrorTypes.SECURITY_FAILURE,
                AuthErrorDetails.NON_EXISTING_USER,
                { showDetails: true }
            )

        // Verify their password
        const isPasswordCorrect = await AuthHelper.verifyPassword( password, sqUser.password )

        if ( !isPasswordCorrect )
            throw new AuthError(
                AuthErrorTypes.SECURITY_FAILURE,
                AuthErrorDetails.INCORRECT_PASSWORD,
                { showDetails: true }
            )

        // Create a JWT and send a response
        const { jwt, jwtSignOptions }: EncodedJWTWithDetails = await AuthHelper.createJWT( sqUser )


        // Convert Sequelize Model to Response DTO and Validate
        const sqUserData = await sqUser.toJSONAsync()
        const [ responseErrors, responseUsersDTOs, _responseUsersDTOInstances ] = await validator(
            sqUserData,
            UserModelDTO,
            responseIgnoredKeys.READ,
            responseDeletedKeys.READ
        )
        if ( responseErrors.length > 0 )
            throw new ClassValidationError( responseErrors )

        const responseUserDTO = responseUsersDTOs[ 0 ]

        const response = AuthSuccessResponder.OAuth2TokenResponse( jwt, jwtSignOptions, responseUserDTO )

        this.setHeader( "Cache-Control", "no-store" )
        this.setHeader( "Pragma", "no-cache" )

        return response
    }

    /**
     * This route handles auth registration attempts
     * @param user - The posted body object, containing the creation attributes of UserModel
     * @returns
     */
    @Post( "register" )
    public async register(
        @Body() user: AuthRegisterRequestBody,
        @Request() _request?: ExpressRequest,
    ): Promise<AuthRegisterResponse> {
        this.setStatus( AuthSuccessResponder.status )

        // Convert and Validate the request body
        const [ requestErrors, _requestUsersDTOs, _requestUsersDTOInstances ] = await validator(
            user,
            UserModelDTO,
            [ ...createRequestBodyOmittedKeys ],
            []
        )
        if ( requestErrors.length > 0 )
            throw new ClassValidationError( requestErrors )

        // Create the User
        const createdUser = await this.authService.createUser( user )
        const createdUserData = await createdUser.toJSONAsync()

        // Convert Sequelize Model to Response DTO and Validate
        const [ responseErrors, responseUsersDTOs, _responseUsersDTOInstances ] = await validator(
            createdUserData,
            UserModelDTO,
            [ "password", ...createResponseContentOmittedKeys ],
            [ "password", ...createResponseContentOmittedKeys ]
        )
        if ( responseErrors.length > 0 )
            throw new ClassValidationError( responseErrors )

        // Construct and send response
        const responseUserDTO = responseUsersDTOs[ 0 ]
        const response = CreatedResponder.Response(
            responseUserDTO, "User"
        )

        return response
    }

    // TODO (MAYBE): Password recovery via email
    // GET /recovery?email=adsasd - stores a recovery code in db and saves it
    // POST /recovery WITH recoverycode+email+newpassword body - validates the code and updates the password

}


export type {
    AuthLoginResponse,
    AuthRegisterRequestBody,
    AuthRegisterResponse
}