/**
 * This file contains a DI service for authentication actions
 * @module
 */

import type { Request } from "express"

import { provideSingleton } from "../controllers/ioc/inversifyProvider.ts"

import { validator, type ValidationError } from "../responders/validationResponders.ts"
import { createRequestBodyOmittedKeys, type UpdateRequestBody } from "../responders/controllerResponders.ts"

import type { MakeOptional } from "../utils/typeUtils.ts"

import { AuthHelper } from "./authHelper.ts"
import { RoleModel, UserModel } from "../data/models/authModels.ts"
import { UserModelDTO } from "../data/models/validationModels.ts"
import { AuthError, AuthErrorDetails, AuthErrorTypes } from "../responders/authResponders.ts"


import type { AuthRegisterRequestBody } from "../controllers/authController.ts"


/** Request body format for {@link controllers/authController.AuthController}'s `user` body parameter */
type AuthCreateRequestBody = MakeOptional<AuthRegisterRequestBody, "profileImageURL">

/** Request body format for {@link controllers/generated/userController.UserController}'s `update` method's `user` body parameter */
type AuthUpdateRequestBody = UpdateRequestBody<UserModelDTO>


/** This class is injected as a dependency into controllers to help with authentication actions */
@provideSingleton( AuthService )
class AuthService {

    /**
     * Validates a plain object can be converted to a {@link UserModelDTO} and thus a {@link UserModel}
     * @param user - The plain object
     * @returns A tuple with 2 items: array of validation errors (if any), and a UserModelDTO instance if one was created
     */
    public async validateUserObject( user: AuthCreateRequestBody ): Promise<[
        ValidationError[],
        UserModelDTO
    ]> {

        const [ validationErrors, _usersPlainObjects, userInstances ] = await validator(
            user,
            UserModelDTO,
            [ ...createRequestBodyOmittedKeys ],
            []
        )

        //const _userPlainObject = _usersPlainObjects[ 0 ] // This should be the same as the input param
        const userInstance = userInstances[ 0 ]

        return [ validationErrors, userInstance ]
    }

    /**
     * Creates a user by first hashing their password
     * @param user - A plain object representing the creation properties of a User
     * @returns - A created seqeulize UserModelDTO
     */
    public async createUser( user: AuthCreateRequestBody ): Promise<UserModel> {

        // Check password security requirements
        const [
            allSecurityRequirementsMet,
            securityRequirmentsChecked
        ] = AuthHelper.checkPassword( user.password )

        if ( !allSecurityRequirementsMet )
            throw new AuthError(
                AuthErrorTypes.SECURITY_FAILURE,
                AuthErrorDetails.PASSWORD_STRENGTH,
                { showDetails: true },
                AuthHelper.checkedPasswordMessages( securityRequirmentsChecked )
            )

        // Hash the users password
        user.password = await AuthHelper.hashPassword( user.password )

        // Create the User
        const createdUser = await UserModel.create( user )

        return createdUser
    }

    /**
     * Creates a user by first hashing their password
     * @param user - The existing {@link UserModel} of the user to update
     * @param updatedUserData - A plain object representing the creation properties of a User
     * @returns - A created seqeulize UserModelDTO
     */
    public async updateUser( user: UserModel, updatedUserData: AuthUpdateRequestBody ): Promise<UserModel> {

        if ( !updatedUserData.password )
            return await user.update( updatedUserData )

        // Check password security requirements
        const [
            allSecurityRequirementsMet,
            securityRequirmentsChecked
        ] = AuthHelper.checkPassword( updatedUserData.password )

        if ( !allSecurityRequirementsMet )
            throw new AuthError(
                AuthErrorTypes.SECURITY_FAILURE,
                AuthErrorDetails.PASSWORD_STRENGTH,
                { showDetails: true },
                AuthHelper.checkedPasswordMessages( securityRequirmentsChecked )
            )

        // Hash the users password
        updatedUserData.password = await AuthHelper.hashPassword( updatedUserData.password )

        // Create the User
        const updatedUser = await user.update( updatedUserData )

        return updatedUser
    }

    /**
     * Creates a series of {@link RoleModel}'s
     * @param roleNames - the name of the roles to create
     * @returns The created roles
     */
    public async createRoles( roleNames: string[] ): Promise<RoleModel[]> {
        const roles = roleNames.map( roleName => ( { name: roleName } ) )

        const createdRoles = await RoleModel.bulkCreate( roles )

        return createdRoles
    }


    /**
     * Gets the current user by searching an Express Request object for an access token,
     * then vlidating it and getting the user object for us
     *
     * @param request - the express request
     */
    public async getCurrentUser( request: Request ): Promise<UserModel | null | undefined> {
        try {
            const token = AuthHelper.getEncodedJWT( request )

            const decodedJwtPayload = await AuthHelper.verifyJWT( token )

            const foundUserId = decodedJwtPayload?.user?.id

            const currentUser = foundUserId && await UserModel.findByPk( foundUserId )

            return currentUser
        } catch ( e: unknown ) {
            if ( !( e instanceof AuthError ) )
                throw e
        }
    }


}

export { AuthService }
export type { AuthCreateRequestBody, AuthUpdateRequestBody }