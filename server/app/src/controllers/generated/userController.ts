/**
 * This file contains the TSOA controller for operations with UserModel
 * @module
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Controller, Tags, Route, // Controller
    Get, Post, Delete, Patch, // Methods
    Body, BodyProp, Path, Res, Query, // Method arguments
    Request, Response, SuccessResponse,
    Security, Middlewares,
    type TsoaResponse
} from "tsoa"

import { DataTypes, Model, Op, type NormalizedAttributeOptions, type OrderItem, type VirtualOptions } from "@sequelize/core"

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
    type ValidationErrorMessageT,
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
} from "../../responders/controllerResponders.ts"

import { ClassValidationError, QueryValidationError, validator } from "../../responders/validationResponders.ts"

import { AuthError, AuthErrorDetails, AuthErrorTypes } from "../../responders/authResponders.ts"
import { securityScopeGroups, SecurityTypes } from "../../auth/authTypes.ts"

import { defaultOrdering, orderByFieldValuesNames, type OrderByFieldValues } from "../controllerTypes.ts"

import { provideSingleton, inject } from "../ioc/inversifyProvider.ts"

import { AuthService } from "../../auth/authService.ts"
import { authMiddleware, authValidators, authValidatorsWithArgs, routeSecurityFunctions } from "../../auth/authMiddleware.ts"

import { UserModel } from "../../data/models/models.ts"
import { UserModelDTO } from "../../data/models/validationModels.ts"
/* eslint-enable @typescript-eslint/no-unused-vars */



const routerModelTypeName = "User"
const routerModel = UserModel
const routerDTO = UserModelDTO

// I'd prefer to use this than the using the DTO in the generics below usage below, but TSOA errors about duplicate models
// It also errors if I try InstanceType<typeof routerDTO> with "no matching model found"
// type routerDTOType = UserModelDTO
type routerDTOKeyType = keyof UserModelDTO // It's fine with this though - I guess it doesnt make a model for it


/** (Responses) These are keys for properties ignored by class-validator validation */
const responseIgnoredKeys: Record<string, routerDTOKeyType[]> = {
    READ   : [ "password", ...readResponseContentOmittedKeys ],
    CREATE : [ "password", ...createResponseContentOmittedKeys ],
    UPDATE : [ "password", ...updateResponseContentOmittedKeys ],
}

/** (Responses) These are keys for properties that are deleted from objects after class-validator validation */
const responseDeletedKeys: Record<string, routerDTOKeyType[]> = {
    READ   : [ "password", ...readResponseContentOmittedKeys ],
    CREATE : [ "password", ...createResponseContentOmittedKeys ],
    UPDATE : [ "password", ...updateResponseContentOmittedKeys ],
}

/** (Requests) These are keys for properties ignored by class-validator validation */
const requestIgnoredKeys: Record<string, routerDTOKeyType[]> = {
    CREATE : [ "profileText", "isAdmin", "isStaff", "fullName", ...createRequestBodyOmittedKeys ],
    UPDATE : [ "profileText", "isAdmin", "isStaff", "fullName", ...updateRequestBodyOmittedKeys ]
}

/** (Requests) These are keys for properties that are deleted from objects after class-validator validation */
const requestDeletedKeys: Record<string, routerDTOKeyType[]> = {
    CREATE : [ "isAdmin", "isStaff", "fullName", ],
    UPDATE : [ "isAdmin", "isStaff", "fullName", ]
}

/** Response type for this controllers object not found response */
type UserNotFoundResponseBody = NotFoundResponseBody
// type UserNotFoundResponseBody = NotFoundResponseBody<typeof routerModelTypeName>

// READ
/** Possible responses for {@link UserController.getUser} */
type UserReadResponse =
    // ReadResponseBody<routerDTO, typeof routerModelTypeName, typeof responseIgnoredKeys.READ[number]> // tsoa hates this
    DataResponseBody<
        ReadResponseContent<UserModelDTO, "password", never>,
        "User",
        FoundResponseMessageT
    >


/** Possible responses for {@link UserController.getAllUsers} */
type UserReadManyResponse =
    DataResponseBody<
        Array<ReadResponseContent<UserModelDTO, "password", never>>,
        "User",
        FoundResponseMessageT
    >

// CREATE
/** Request body format for {@link UserController.createUser}'s `user` body parameter */
type UserCreateRequest = CreateRequestBody<UserModelDTO, "isAdmin" | "isStaff" | "fullName", "profileImageURL">

/** Possible responses for {@link UserController.createUser} */
type UserCreateResponse =
    DataResponseBody<
        CreateResponseContent<UserModelDTO, "password", never>,
        "User",
        CreatedResponseMessageT
    >

// UPDATE
/** Request body format for {@link UserController.updateUser}'s `user` body parameter */
type UserUpdateRequest = UpdateRequestBody<UserModelDTO, "isAdmin" | "isStaff" | "fullName", "profileText">

/** Possible responses for {@link UserController.updateUser} */
type UserUpdateResponse =
    DataResponseBody<
        UpdateResponseContent<UserModelDTO, "password", never>,
        "User",
        UpdatedResponseMessageT
    >


// DELETE
/** Possible responses for {@link UserController.deleteUser} */
type UserDeleteResponse = DeleteResponseBody<"User">


/** The security functions to use within each route */
const securityFunctions = {
    getAll: ( authService: AuthService, request: ExpressRequest | undefined ) =>
        routeSecurityFunctions.adminOrFilters( authService, request, { isStaff: true } ),
    getOne: async ( authService: AuthService, request: ExpressRequest | undefined, modelObject: Model | object ) => {
        await routeSecurityFunctions.adminOrHasProperty( authService, request, modelObject, { isStaff: true } )?.catch(
            async ( e: unknown ) => {
                if ( e instanceof AuthError )
                    await routeSecurityFunctions.userIsAdminOrOwnsResource( authService, request, modelObject )
                else throw e
            }
        )
    },
    create : routeSecurityFunctions.userIsAdminOrOwnsResource,
    update : routeSecurityFunctions.userIsAdminOrOwnsResource,
    delete : routeSecurityFunctions.userIsAdminOrOwnsResource
}


// TSOA Complains if we use a variable as first param on controller @Response, but is fine on route e.g
// @Response<ValidationErrorResponseBody>( ValidationErrorResponder.status, ValidationErrorResponder.validationMessage )
// ValidationErrorResponse occurs on all routes EXCEPT delete, but it's simpler to keep it here and makes the typing in the generated client better
/**
 * Route controller for {@link UserModel} and {@link UserModelDTO}
 */
@provideSingleton( UserController )
@Response<AuthErrorResponseBody>( 401, AuthErrorTypes.NOT_AUTHENTICATED )
@Response<AuthErrorResponseBody>( 403, AuthErrorTypes.NOT_AUTHORIZED )
@Response<ValidationErrorResponseBody>( 422, ValidationErrorResponder.validationMessage )
@Route( "users" )
@Tags( "User" )
export class UserController extends Controller {
    private readonly authService: AuthService

    constructor(
        @inject( AuthService ) authService: AuthService
    ) {
        super()
        this.authService = authService
    }

    /**
    * Retrieves a list of all users, matching the query parameters if provided.
    *
    * @param offset - Retrieve records starting from this offset
    * @param limit - Retrieve up to this many records
    * @param orderBy - Order records by this attribute
    * @param filters - Stringified JSON where the keys represent a property of a user and values represent a text based filter for the property
    */
    @Get( )
    public async getAllUsers(
        @Query() offset?: number,
        @Query() limit?: number,
        @Query() orderBy?: OrderByFieldValues,
        @Query() filters?: string,
        @Res() notFoundResponse?: TsoaResponse<typeof NotFoundResponder.status, UserNotFoundResponseBody>,
        @Request() request?: ExpressRequest,
    ): Promise<UserReadManyResponse | undefined> {
        this.setStatus( FoundResponder.status )

        // Set up query filtering
        offset ??= 0
        limit ??= 100
        orderBy ??= defaultOrdering
        filters ??= "{}"

        if ( limit > 100 )
            limit = 100

        const orderBySplit = orderBy.split( "-" )

        if ( orderBySplit.length > 2 )
            throw new QueryValidationError( "orderBy", orderBy )

        if ( orderBySplit.length === 2 && orderBySplit[ 0 ] !== "" )
            throw new QueryValidationError( "orderBy", orderBy )

        const orderByFieldName = orderBySplit.length === 1 ? orderBySplit[ 0 ] : orderBySplit[ 1 ]
        const orderByDirection = orderBySplit.length === 1 ? "ASC" : "DESC"

        if ( !orderByFieldValuesNames.includes( orderByFieldName as OrderByFieldValues ) )
            throw new QueryValidationError( "orderBy", orderBy, `Must be one of: ${orderByFieldValuesNames.join( ", " )}` )


        let parsedFilters: Record<routerDTOKeyType, string>
        try {
            parsedFilters = JSON.parse( filters ) as Record<routerDTOKeyType, string>
        } catch ( e: unknown ) {
            throw new QueryValidationError( "filters", filters, ( e as Error ).message )
        }

        const modelAttributes = Object.fromEntries( routerModel.modelDefinition.attributes.entries() )
        const modelAttributeNames = [ ...routerModel.modelDefinition.attributes.keys() ]
        const parsedFiltersEntries = Object.entries( parsedFilters )

        const allFilterKeysExist = parsedFiltersEntries.every( ( [ key, _value ] ) => modelAttributeNames.includes( key ) )
        const notExistingFilterKeys = parsedFiltersEntries
            .filter( ( [ key, _value ] ) => !modelAttributeNames.includes( key ) )
            .map( ( [ key, _value ] ) => key )
        if ( !allFilterKeysExist )
            throw new QueryValidationError( "filters", filters, `properties [${notExistingFilterKeys.join( ", " )}] do not exist on entity` )

        const virtualAttributeFilters: Record<string, [unknown, NormalizedAttributeOptions]> = {}
        const extraWhereFilters = await securityFunctions.getAll( this.authService, request )
        const whereFiltersEntries =
        [ ...parsedFiltersEntries, ...Object.entries( extraWhereFilters as [string, string | number | boolean] ) ]
            .filter( ( [ key, _value ] ) => modelAttributeNames.includes( key ) )
            .map( ( [ key, value ] ) => {
                const thisModelAttribute = modelAttributes[ key ]
                const attrTypeName = thisModelAttribute.type.constructor.name
                const isVirtual = attrTypeName === "VIRTUAL"

                type VirtualDataTypeAttributeOptions = typeof DataTypes.VIRTUAL & {options: VirtualOptions}

                const unwrappedAttrTypeName =  isVirtual
                    ? ( thisModelAttribute.type as unknown as VirtualDataTypeAttributeOptions ).options.returnType?.constructor.name
                        || attrTypeName
                    : attrTypeName

                if ( isVirtual ) {
                    virtualAttributeFilters[ key ] = [ value, thisModelAttribute ]
                    return undefined
                }

                if ( unwrappedAttrTypeName === "BOOLEAN" )
                    return [ key, value ]

                return [
                    `${key}::text`,
                    { [ Op.like ]: `%${value}%` }
                ]
            } )
            .filter( f => f !== undefined )

        const whereFilters = Object.fromEntries( whereFiltersEntries ) as Record<string, object>

        const queryOptions = {
            order  : [ [ orderByFieldName, orderByDirection ] as OrderItem ],
            offset : offset,
            limit  : limit,
            where  : whereFilters,
            // attributes : { exclude: [ responseDeletedKeys.READ ] } // this is handled by the validator()
        }

        // Look for the Users
        const { rows: sqUsers, count } = await routerModel.findAndCountAll( queryOptions )
        // Apply virtual attribute filters
        const filteredSqUsers = []
        sqUsersLoop:
        for ( const sqUser of sqUsers ) {
            for ( const [ key, [ value, _attribute ] ] of Object.entries( virtualAttributeFilters ) ) {
                const sqUserValue = await sqUser.get( key )
                if ( sqUserValue !== value )
                    continue sqUsersLoop
            }
            filteredSqUsers.push( sqUser )
        }

        // Convert final data to JSON
        const sqUsersData = await Promise.all( filteredSqUsers.map( async sqUser => await sqUser.toJSONAsync() ) )
        const remainingCount = count - sqUsers.length - ( sqUsers.length - filteredSqUsers.length )

        if ( !filteredSqUsers.length ) {
            notFoundResponse?.( NotFoundResponder.status, NotFoundResponder.Response( "User" ) ) as UserNotFoundResponseBody
            return
        }

        // Convert Sequelize Model to Response DTO and Validate
        const [ responseErrors, responseUsersDTOs, _responseUsersDTOInstances ] = await validator(
            sqUsersData,
            routerDTO,
            responseIgnoredKeys.READ,
            responseDeletedKeys.READ
        )
        if ( responseErrors.length > 0 )
            throw new ClassValidationError( responseErrors )

        // Construct and send response
        const extraMetaData =
            {
                resultsCount     : filteredSqUsers.length,
                resultsRemaining : remainingCount || undefined,
                totalRecords     : count === filteredSqUsers.length ? undefined : count,
            }
        const response = FoundResponder.Response(
            responseUsersDTOs,
            routerModelTypeName,
            extraMetaData
        )

        return response
    }

    /**
    * Retrieves the details of an existing user with a matching id
    *
    * @param id - The identifier of the user to get
    */
    @Get( "{id}" )
    public async getUser(
        @Path() id: AppModelIdT,
        @Res() notFoundResponse: TsoaResponse<typeof NotFoundResponder.status, UserNotFoundResponseBody>,
        @Request() request?: ExpressRequest,
    ): Promise<UserReadResponse | undefined> {
        this.setStatus( FoundResponder.status )

        // Look for the User
        const sqUser = await routerModel.findByPk( id )

        if ( !sqUser ) {
            notFoundResponse( NotFoundResponder.status, NotFoundResponder.Response( "User" ) ) as UserNotFoundResponseBody
            return
        }

        await securityFunctions.getOne( this.authService, request, sqUser )

        const sqUserData = await sqUser.toJSONAsync()

        // Convert Sequelize Model to Response DTO and Validate
        const [ responseErrors, responseUsersDTOs, _responseUsersDTOInstances ] = await validator(
            sqUserData,
            routerDTO,
            responseIgnoredKeys.READ,
            responseDeletedKeys.READ
        )
        if ( responseErrors.length > 0 )
            throw new ClassValidationError( responseErrors )

        // Construct and send response
        const responseUserDTO = responseUsersDTOs[ 0 ]
        const response = FoundResponder.Response(
            responseUserDTO, routerModelTypeName
        )

        return response
    }

    /**
    * Creates a new user
    *
    * @param user - The posted body object, containing the creation attributes of UserModel
    */
    @Security( SecurityTypes.API_KEY )
    @Security( SecurityTypes.OAuth2, securityScopeGroups.ADMIN )
    @Middlewares( authMiddleware( [
        authValidators.userIsAdmin
    ] ) )
    @Post()
    public async createUser(
        @Body() user: UserCreateRequest,
        @Request() request?: ExpressRequest,
    ): Promise<UserCreateResponse> {
        this.setStatus( CreatedResponder.status )

        await securityFunctions.create( this.authService, request, user )

        // Convert and Validate the request body
        const [ requestErrors, _requestUsersObjects, _requestUsersDTOInstances ] = await validator(
            user,
            routerDTO,
            requestIgnoredKeys.CREATE,
            requestDeletedKeys.CREATE
        )
        if ( requestErrors.length > 0 )
            throw new ClassValidationError( requestErrors )

        // Create the User
        const createdUser = await routerModel.create( user )
        const createdUserData = await createdUser.toJSONAsync()

        // TODO: Update assocations

        // Convert Sequelize Model to Response DTO and Validate
        const [ responseErrors, responseUsersDTOs, _responseUsersDTOInstances ] = await validator(
            createdUserData,
            routerDTO,
            responseIgnoredKeys.CREATE,
            responseIgnoredKeys.CREATE
        )
        if ( responseErrors.length > 0 )
            throw new ClassValidationError( responseErrors )

        // Construct and send response
        const responseUserDTO = responseUsersDTOs[ 0 ]
        const response = CreatedResponder.Response(
            responseUserDTO, routerModelTypeName
        )

        return response
    }

    /**
    * Update a user with a matching id
    *
    * @param id - The identifier of the user to update
    * @param user - The posted body object, containing some or all modifiable attributes of UserModel
    */
    @Security( SecurityTypes.API_KEY )
    @Security( SecurityTypes.OAuth2, securityScopeGroups.USER )
    @Middlewares( authMiddleware( [
        authValidatorsWithArgs.adminOr( [ authValidators.userIsResource ] )
    ] ) )
    @Patch( "{id}" )
    public async updateUser(
        @Path() id: AppModelIdT,
        @Body() user: UserUpdateRequest,
        @Res() notFoundResponse: TsoaResponse<typeof NotFoundResponder.status, UserNotFoundResponseBody>,
        @Request() _request: ExpressRequest,
    ): Promise<UserUpdateResponse | undefined> {
        this.setStatus( UpdatedResponder.status )

        // Convert and Validate the request body
        const [ requestErrors, _requestUsersObjects, _requestUsersDTOInstances ] = await validator(
            user,
            routerDTO,
            requestIgnoredKeys.UPDATE,
            requestDeletedKeys.UPDATE,
            { skipMissingProperties: true }
        )
        if ( requestErrors.length > 0 )
            throw new ClassValidationError( requestErrors )

        // Look for the User
        const sqUser = await routerModel.findByPk( id )

        if ( !sqUser ) {
            notFoundResponse( NotFoundResponder.status, NotFoundResponder.Response( "User" ) ) as UserNotFoundResponseBody
            return
        }

        await securityFunctions.update( this.authService, _request, sqUser )

        // Update the User
        const updatedUser = await this.authService.updateUser( sqUser, user )
        const updatedUserData = await updatedUser.toJSONAsync()

        // Convert Sequelize Model to Response DTO and Validate
        const [ responseErrors, responseUsersDTOs, _responseUsersDTOInstances ] = await validator(
            updatedUserData,
            routerDTO,
            responseIgnoredKeys.UPDATE,
            responseDeletedKeys.UPDATE
        )
        if ( responseErrors.length > 0 )
            throw new ClassValidationError( responseErrors )

        // Construct and send response
        const responseUserDTO = responseUsersDTOs[ 0 ]
        const response = UpdatedResponder.Response(
            responseUserDTO, routerModelTypeName
        )

        return response
    }

    /**
    * Delete the user with the matching id
    *
    * @param id - The identifier of the user to delete
    * @param force - If true the user will actually be deleted from the database rather than a soft delete (handled by sequelize)
    */
    @Security( SecurityTypes.API_KEY )
    @Security( SecurityTypes.OAuth2, securityScopeGroups.ADMIN )
    @Delete( "{id}" )
    public async deleteUser(
        @Path() id: AppModelIdT,
        @Query() force?: boolean,
        @Res() notFoundResponse?: TsoaResponse<typeof NotFoundResponder.status, UserNotFoundResponseBody>,
        @Request() request?: ExpressRequest,
    ): Promise<UserDeleteResponse | undefined> {
        this.setStatus( DeletedResponder.status )

        // Look for the User
        const sqUser = await routerModel.findByPk( id )

        if ( !sqUser ) {
            notFoundResponse?.( NotFoundResponder.status, NotFoundResponder.Response( "User" ) ) as UserNotFoundResponseBody
            return
        }

        await securityFunctions.delete( this.authService, request, sqUser )

        // Delete the user
        const destroyOptions = force ? { force: true } : { }
        await sqUser.destroy( destroyOptions )

        return DeletedResponder.Response( sqUser, routerModelTypeName )
    }

}


export type {
    routerDTOKeyType,
    UserNotFoundResponseBody,

    UserReadResponse,
    UserReadManyResponse,

    UserCreateRequest,
    UserCreateResponse,

    UserUpdateRequest,
    UserUpdateResponse,

    UserDeleteResponse
}
export { responseIgnoredKeys, responseDeletedKeys, requestIgnoredKeys, requestDeletedKeys }