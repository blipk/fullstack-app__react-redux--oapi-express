/**
 * This file contains the TSOA controller for operations with RoleModel
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

import { RoleModel } from "../../data/models/models.ts"
import { RoleModelDTO } from "../../data/models/validationModels.ts"
/* eslint-enable @typescript-eslint/no-unused-vars */



const routerModelTypeName = "Role"
const routerModel = RoleModel
const routerDTO = RoleModelDTO

// I'd prefer to use this than the using the DTO in the generics below usage below, but TSOA errors about duplicate models
// It also errors if I try InstanceType<typeof routerDTO> with "no matching model found"
// type routerDTOType = RoleModelDTO
type routerDTOKeyType = keyof RoleModelDTO // It's fine with this though - I guess it doesnt make a model for it


/** (Responses) These are keys for properties ignored by class-validator validation */
const responseIgnoredKeys: Record<string, routerDTOKeyType[]> = {
    READ   : [ ...readResponseContentOmittedKeys ],
    CREATE : [ ...createResponseContentOmittedKeys ],
    UPDATE : [ ...updateResponseContentOmittedKeys ],
}

/** (Responses) These are keys for properties that are deleted from objects after class-validator validation */
const responseDeletedKeys: Record<string, routerDTOKeyType[]> = {
    READ   : [ ...readResponseContentOmittedKeys ],
    CREATE : [ ...createResponseContentOmittedKeys ],
    UPDATE : [ ...updateResponseContentOmittedKeys ],
}

/** (Requests) These are keys for properties ignored by class-validator validation */
const requestIgnoredKeys: Record<string, routerDTOKeyType[]> = {
    CREATE : [ ...createRequestBodyOmittedKeys ],
    UPDATE : [ ...updateRequestBodyOmittedKeys ]
}

/** (Requests) These are keys for properties that are deleted from objects after class-validator validation */
const requestDeletedKeys: Record<string, routerDTOKeyType[]> = {
    CREATE : [ ],
    UPDATE : [ ]
}

/** Response type for this controllers object not found response */
type RoleNotFoundResponseBody = NotFoundResponseBody
// type RoleNotFoundResponseBody = NotFoundResponseBody<typeof routerModelTypeName>

// READ
/** Possible responses for {@link RoleController.getRole} */
type RoleReadResponse =
    // ReadResponseBody<routerDTO, typeof routerModelTypeName, typeof responseIgnoredKeys.READ[number]> // tsoa hates this
    DataResponseBody<
        ReadResponseContent<RoleModelDTO, never, never>,
        "Role",
        FoundResponseMessageT
    >


/** Possible responses for {@link RoleController.getAllRoles} */
type RoleReadManyResponse =
    DataResponseBody<
        Array<ReadResponseContent<RoleModelDTO, never, never>>,
        "Role",
        FoundResponseMessageT
    >

// CREATE
/** Request body format for {@link RoleController.createRole}'s `role` body parameter */
type RoleCreateRequest = CreateRequestBody<RoleModelDTO, never, never>

/** Possible responses for {@link RoleController.createRole} */
type RoleCreateResponse =
    DataResponseBody<
        CreateResponseContent<RoleModelDTO, never, never>,
        "Role",
        CreatedResponseMessageT
    >

// UPDATE
/** Request body format for {@link RoleController.updateRole}'s `role` body parameter */
type RoleUpdateRequest = UpdateRequestBody<RoleModelDTO, never, never>

/** Possible responses for {@link RoleController.updateRole} */
type RoleUpdateResponse =
    DataResponseBody<
        UpdateResponseContent<RoleModelDTO, never, never>,
        "Role",
        UpdatedResponseMessageT
    >


// DELETE
/** Possible responses for {@link RoleController.deleteRole} */
type RoleDeleteResponse = DeleteResponseBody<"Role">


/** The security functions to use within each route */
const securityFunctions = {
    getAll : routeSecurityFunctions.userIsAdminOrOwnsResourceFilters,
    getOne : routeSecurityFunctions.userIsAdminOrOwnsResource,
    create : routeSecurityFunctions.userIsAdminOrOwnsResource,
    update : routeSecurityFunctions.userIsAdminOrOwnsResource,
    delete : routeSecurityFunctions.userIsAdminOrOwnsResource
}


// TSOA Complains if we use a variable as first param on controller @Response, but is fine on route e.g
// @Response<ValidationErrorResponseBody>( ValidationErrorResponder.status, ValidationErrorResponder.validationMessage )
// ValidationErrorResponse occurs on all routes EXCEPT delete, but it's simpler to keep it here and makes the typing in the generated client better
/**
 * Route controller for {@link RoleModel} and {@link RoleModelDTO}
 */
@provideSingleton( RoleController )
@Response<AuthErrorResponseBody>( 401, AuthErrorTypes.NOT_AUTHENTICATED )
@Response<AuthErrorResponseBody>( 403, AuthErrorTypes.NOT_AUTHORIZED )
@Response<ValidationErrorResponseBody>( 422, ValidationErrorResponder.validationMessage )
@Route( "roles" )
@Tags( "Role" )
export class RoleController extends Controller {
    private readonly authService: AuthService

    constructor(
        @inject( AuthService ) authService: AuthService
    ) {
        super()
        this.authService = authService
    }

    /**
    * Retrieves a list of all roles, matching the query parameters if provided.
    *
    * @param offset - Retrieve records starting from this offset
    * @param limit - Retrieve up to this many records
    * @param orderBy - Order records by this attribute
    * @param filters - Stringified JSON where the keys represent a property of a role and values represent a text based filter for the property
    */
    @Security( SecurityTypes.API_KEY )
    @Security( SecurityTypes.OAuth2, securityScopeGroups.ADMIN )
    @Get( )
    public async getAllRoles(
        @Query() offset?: number,
        @Query() limit?: number,
        @Query() orderBy?: OrderByFieldValues,
        @Query() filters?: string,
        @Res() notFoundResponse?: TsoaResponse<typeof NotFoundResponder.status, RoleNotFoundResponseBody>,
        @Request() request?: ExpressRequest,
    ): Promise<RoleReadManyResponse | undefined> {
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

        // Look for the Roles
        const { rows: sqRoles, count } = await routerModel.findAndCountAll( queryOptions )
        // Apply virtual attribute filters
        const filteredSqRoles = []
        sqRolesLoop:
        for ( const sqRole of sqRoles ) {
            for ( const [ key, [ value, _attribute ] ] of Object.entries( virtualAttributeFilters ) ) {
                const sqRoleValue = await sqRole.get( key )
                if ( sqRoleValue !== value )
                    continue sqRolesLoop
            }
            filteredSqRoles.push( sqRole )
        }

        // Convert final data to JSON
        const sqRolesData = await Promise.all( filteredSqRoles.map( async sqRole => await sqRole.toJSONAsync() ) )
        const remainingCount = count - sqRoles.length - ( sqRoles.length - filteredSqRoles.length )

        if ( !filteredSqRoles.length ) {
            notFoundResponse?.( NotFoundResponder.status, NotFoundResponder.Response( "Role" ) ) as RoleNotFoundResponseBody
            return
        }

        // Convert Sequelize Model to Response DTO and Validate
        const [ responseErrors, responseRolesDTOs, _responseRolesDTOInstances ] = await validator(
            sqRolesData,
            routerDTO,
            responseIgnoredKeys.READ,
            responseDeletedKeys.READ
        )
        if ( responseErrors.length > 0 )
            throw new ClassValidationError( responseErrors )

        // Construct and send response
        const extraMetaData =
            {
                resultsCount     : filteredSqRoles.length,
                resultsRemaining : remainingCount || undefined,
                totalRecords     : count === filteredSqRoles.length ? undefined : count,
            }
        const response = FoundResponder.Response(
            responseRolesDTOs,
            routerModelTypeName,
            extraMetaData
        )

        return response
    }

    /**
    * Retrieves the details of an existing role with a matching id
    *
    * @param id - The identifier of the role to get
    */
    @Security( SecurityTypes.API_KEY )
    @Security( SecurityTypes.OAuth2, securityScopeGroups.ADMIN )
    
    @Get( "{id}" )
    public async getRole(
        @Path() id: AppModelIdT,
        @Res() notFoundResponse: TsoaResponse<typeof NotFoundResponder.status, RoleNotFoundResponseBody>,
        @Request() request?: ExpressRequest,
    ): Promise<RoleReadResponse | undefined> {
        this.setStatus( FoundResponder.status )

        // Look for the Role
        const sqRole = await routerModel.findByPk( id )

        if ( !sqRole ) {
            notFoundResponse( NotFoundResponder.status, NotFoundResponder.Response( "Role" ) ) as RoleNotFoundResponseBody
            return
        }

        await securityFunctions.getOne( this.authService, request, sqRole )

        const sqRoleData = await sqRole.toJSONAsync()

        // Convert Sequelize Model to Response DTO and Validate
        const [ responseErrors, responseRolesDTOs, _responseRolesDTOInstances ] = await validator(
            sqRoleData,
            routerDTO,
            responseIgnoredKeys.READ,
            responseDeletedKeys.READ
        )
        if ( responseErrors.length > 0 )
            throw new ClassValidationError( responseErrors )

        // Construct and send response
        const responseRoleDTO = responseRolesDTOs[ 0 ]
        const response = FoundResponder.Response(
            responseRoleDTO, routerModelTypeName
        )

        return response
    }

    /**
    * Creates a new role
    *
    * @param role - The posted body object, containing the creation attributes of RoleModel
    */
    @Security( SecurityTypes.API_KEY )
    @Security( SecurityTypes.OAuth2, securityScopeGroups.ADMIN )
    @Post()
    public async createRole(
        @Body() role: RoleCreateRequest,
        @Request() request?: ExpressRequest,
    ): Promise<RoleCreateResponse> {
        this.setStatus( CreatedResponder.status )

        await securityFunctions.create( this.authService, request, role )

        // Convert and Validate the request body
        const [ requestErrors, _requestRolesObjects, _requestRolesDTOInstances ] = await validator(
            role,
            routerDTO,
            requestIgnoredKeys.CREATE,
            requestDeletedKeys.CREATE
        )
        if ( requestErrors.length > 0 )
            throw new ClassValidationError( requestErrors )

        // Create the Role
        const createdRole = await routerModel.create( role )
        const createdRoleData = await createdRole.toJSONAsync()

        // TODO: Update assocations

        // Convert Sequelize Model to Response DTO and Validate
        const [ responseErrors, responseRolesDTOs, _responseRolesDTOInstances ] = await validator(
            createdRoleData,
            routerDTO,
            responseIgnoredKeys.CREATE,
            responseIgnoredKeys.CREATE
        )
        if ( responseErrors.length > 0 )
            throw new ClassValidationError( responseErrors )

        // Construct and send response
        const responseRoleDTO = responseRolesDTOs[ 0 ]
        const response = CreatedResponder.Response(
            responseRoleDTO, routerModelTypeName
        )

        return response
    }

    /**
    * Update a role with a matching id
    *
    * @param id - The identifier of the role to update
    * @param role - The posted body object, containing some or all modifiable attributes of RoleModel
    */
    @Security( SecurityTypes.API_KEY )
    @Security( SecurityTypes.OAuth2, securityScopeGroups.ADMIN )
    @Patch( "{id}" )
    public async updateRole(
        @Path() id: AppModelIdT,
        @Body() role: RoleUpdateRequest,
        @Res() notFoundResponse: TsoaResponse<typeof NotFoundResponder.status, RoleNotFoundResponseBody>,
        @Request() _request: ExpressRequest,
    ): Promise<RoleUpdateResponse | undefined> {
        this.setStatus( UpdatedResponder.status )

        // Convert and Validate the request body
        const [ requestErrors, _requestRolesObjects, _requestRolesDTOInstances ] = await validator(
            role,
            routerDTO,
            requestIgnoredKeys.UPDATE,
            requestDeletedKeys.UPDATE,
            { skipMissingProperties: true }
        )
        if ( requestErrors.length > 0 )
            throw new ClassValidationError( requestErrors )

        // Look for the Role
        const sqRole = await routerModel.findByPk( id )

        if ( !sqRole ) {
            notFoundResponse( NotFoundResponder.status, NotFoundResponder.Response( "Role" ) ) as RoleNotFoundResponseBody
            return
        }

        await securityFunctions.update( this.authService, _request, sqRole )

        // Update the Role
        const updatedRole = await sqRole.update( role )
        const updatedRoleData = await updatedRole.toJSONAsync()

        // Convert Sequelize Model to Response DTO and Validate
        const [ responseErrors, responseRolesDTOs, _responseRolesDTOInstances ] = await validator(
            updatedRoleData,
            routerDTO,
            responseIgnoredKeys.UPDATE,
            responseDeletedKeys.UPDATE
        )
        if ( responseErrors.length > 0 )
            throw new ClassValidationError( responseErrors )

        // Construct and send response
        const responseRoleDTO = responseRolesDTOs[ 0 ]
        const response = UpdatedResponder.Response(
            responseRoleDTO, routerModelTypeName
        )

        return response
    }

    /**
    * Delete the role with the matching id
    *
    * @param id - The identifier of the role to delete
    * @param force - If true the role will actually be deleted from the database rather than a soft delete (handled by sequelize)
    */
    @Security( SecurityTypes.API_KEY )
    @Security( SecurityTypes.OAuth2, securityScopeGroups.ADMIN )
    @Delete( "{id}" )
    public async deleteRole(
        @Path() id: AppModelIdT,
        @Query() force?: boolean,
        @Res() notFoundResponse?: TsoaResponse<typeof NotFoundResponder.status, RoleNotFoundResponseBody>,
        @Request() request?: ExpressRequest,
    ): Promise<RoleDeleteResponse | undefined> {
        this.setStatus( DeletedResponder.status )

        // Look for the Role
        const sqRole = await routerModel.findByPk( id )

        if ( !sqRole ) {
            notFoundResponse?.( NotFoundResponder.status, NotFoundResponder.Response( "Role" ) ) as RoleNotFoundResponseBody
            return
        }

        await securityFunctions.delete( this.authService, request, sqRole )

        // Delete the role
        const destroyOptions = force ? { force: true } : { }
        await sqRole.destroy( destroyOptions )

        return DeletedResponder.Response( sqRole, routerModelTypeName )
    }

}


export type {
    routerDTOKeyType,
    RoleNotFoundResponseBody,

    RoleReadResponse,
    RoleReadManyResponse,

    RoleCreateRequest,
    RoleCreateResponse,

    RoleUpdateRequest,
    RoleUpdateResponse,

    RoleDeleteResponse
}
export { responseIgnoredKeys, responseDeletedKeys, requestIgnoredKeys, requestDeletedKeys }