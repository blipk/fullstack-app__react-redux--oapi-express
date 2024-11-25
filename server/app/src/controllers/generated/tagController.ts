/**
 * This file contains the TSOA controller for operations with TagModel
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

import { TagModel } from "../../data/models/models.ts"
import { TagModelDTO } from "../../data/models/validationModels.ts"
/* eslint-enable @typescript-eslint/no-unused-vars */



const routerModelTypeName = "Tag"
const routerModel = TagModel
const routerDTO = TagModelDTO

// I'd prefer to use this than the using the DTO in the generics below usage below, but TSOA errors about duplicate models
// It also errors if I try InstanceType<typeof routerDTO> with "no matching model found"
// type routerDTOType = TagModelDTO
type routerDTOKeyType = keyof TagModelDTO // It's fine with this though - I guess it doesnt make a model for it


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
type TagNotFoundResponseBody = NotFoundResponseBody
// type TagNotFoundResponseBody = NotFoundResponseBody<typeof routerModelTypeName>

// READ
/** Possible responses for {@link TagController.getTag} */
type TagReadResponse =
    // ReadResponseBody<routerDTO, typeof routerModelTypeName, typeof responseIgnoredKeys.READ[number]> // tsoa hates this
    DataResponseBody<
        ReadResponseContent<TagModelDTO, never, never>,
        "Tag",
        FoundResponseMessageT
    >


/** Possible responses for {@link TagController.getAllTags} */
type TagReadManyResponse =
    DataResponseBody<
        Array<ReadResponseContent<TagModelDTO, never, never>>,
        "Tag",
        FoundResponseMessageT
    >

// CREATE
/** Request body format for {@link TagController.createTag}'s `tag` body parameter */
type TagCreateRequest = CreateRequestBody<TagModelDTO, never, never>

/** Possible responses for {@link TagController.createTag} */
type TagCreateResponse =
    DataResponseBody<
        CreateResponseContent<TagModelDTO, never, never>,
        "Tag",
        CreatedResponseMessageT
    >

// UPDATE
/** Request body format for {@link TagController.updateTag}'s `tag` body parameter */
type TagUpdateRequest = UpdateRequestBody<TagModelDTO, never, never>

/** Possible responses for {@link TagController.updateTag} */
type TagUpdateResponse =
    DataResponseBody<
        UpdateResponseContent<TagModelDTO, never, never>,
        "Tag",
        UpdatedResponseMessageT
    >


// DELETE
/** Possible responses for {@link TagController.deleteTag} */
type TagDeleteResponse = DeleteResponseBody<"Tag">


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
 * Route controller for {@link TagModel} and {@link TagModelDTO}
 */
@provideSingleton( TagController )
@Response<AuthErrorResponseBody>( 401, AuthErrorTypes.NOT_AUTHENTICATED )
@Response<AuthErrorResponseBody>( 403, AuthErrorTypes.NOT_AUTHORIZED )
@Response<ValidationErrorResponseBody>( 422, ValidationErrorResponder.validationMessage )
@Route( "tags" )
@Tags( "Tag" )
export class TagController extends Controller {
    private readonly authService: AuthService

    constructor(
        @inject( AuthService ) authService: AuthService
    ) {
        super()
        this.authService = authService
    }

    /**
    * Retrieves a list of all tags, matching the query parameters if provided.
    *
    * @param offset - Retrieve records starting from this offset
    * @param limit - Retrieve up to this many records
    * @param orderBy - Order records by this attribute
    * @param filters - Stringified JSON where the keys represent a property of a tag and values represent a text based filter for the property
    */
    @Security( SecurityTypes.API_KEY )
    @Security( SecurityTypes.OAuth2, securityScopeGroups.STAFF )
    @Get( )
    public async getAllTags(
        @Query() offset?: number,
        @Query() limit?: number,
        @Query() orderBy?: OrderByFieldValues,
        @Query() filters?: string,
        @Res() notFoundResponse?: TsoaResponse<typeof NotFoundResponder.status, TagNotFoundResponseBody>,
        @Request() request?: ExpressRequest,
    ): Promise<TagReadManyResponse | undefined> {
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

        // Look for the Tags
        const { rows: sqTags, count } = await routerModel.findAndCountAll( queryOptions )
        // Apply virtual attribute filters
        const filteredSqTags = []
        sqTagsLoop:
        for ( const sqTag of sqTags ) {
            for ( const [ key, [ value, _attribute ] ] of Object.entries( virtualAttributeFilters ) ) {
                const sqTagValue = await sqTag.get( key )
                if ( sqTagValue !== value )
                    continue sqTagsLoop
            }
            filteredSqTags.push( sqTag )
        }

        // Convert final data to JSON
        const sqTagsData = await Promise.all( filteredSqTags.map( async sqTag => await sqTag.toJSONAsync() ) )
        const remainingCount = count - sqTags.length - ( sqTags.length - filteredSqTags.length )

        if ( !filteredSqTags.length ) {
            notFoundResponse?.( NotFoundResponder.status, NotFoundResponder.Response( "Tag" ) ) as TagNotFoundResponseBody
            return
        }

        // Convert Sequelize Model to Response DTO and Validate
        const [ responseErrors, responseTagsDTOs, _responseTagsDTOInstances ] = await validator(
            sqTagsData,
            routerDTO,
            responseIgnoredKeys.READ,
            responseDeletedKeys.READ
        )
        if ( responseErrors.length > 0 )
            throw new ClassValidationError( responseErrors )

        // Construct and send response
        const extraMetaData =
            {
                resultsCount     : filteredSqTags.length,
                resultsRemaining : remainingCount || undefined,
                totalRecords     : count === filteredSqTags.length ? undefined : count,
            }
        const response = FoundResponder.Response(
            responseTagsDTOs,
            routerModelTypeName,
            extraMetaData
        )

        return response
    }

    /**
    * Retrieves the details of an existing tag with a matching id
    *
    * @param id - The identifier of the tag to get
    */
    @Security( SecurityTypes.API_KEY )
    @Security( SecurityTypes.OAuth2, securityScopeGroups.STAFF )
    @Get( "{id}" )
    public async getTag(
        @Path() id: AppModelIdT,
        @Res() notFoundResponse: TsoaResponse<typeof NotFoundResponder.status, TagNotFoundResponseBody>,
        @Request() request?: ExpressRequest,
    ): Promise<TagReadResponse | undefined> {
        this.setStatus( FoundResponder.status )

        // Look for the Tag
        const sqTag = await routerModel.findByPk( id )

        if ( !sqTag ) {
            notFoundResponse( NotFoundResponder.status, NotFoundResponder.Response( "Tag" ) ) as TagNotFoundResponseBody
            return
        }

        await securityFunctions.getOne( this.authService, request, sqTag )

        const sqTagData = await sqTag.toJSONAsync()

        // Convert Sequelize Model to Response DTO and Validate
        const [ responseErrors, responseTagsDTOs, _responseTagsDTOInstances ] = await validator(
            sqTagData,
            routerDTO,
            responseIgnoredKeys.READ,
            responseDeletedKeys.READ
        )
        if ( responseErrors.length > 0 )
            throw new ClassValidationError( responseErrors )

        // Construct and send response
        const responseTagDTO = responseTagsDTOs[ 0 ]
        const response = FoundResponder.Response(
            responseTagDTO, routerModelTypeName
        )

        return response
    }

    /**
    * Creates a new tag
    *
    * @param tag - The posted body object, containing the creation attributes of TagModel
    */
    @Security( SecurityTypes.API_KEY )
    @Security( SecurityTypes.OAuth2, securityScopeGroups.STAFF )
    @Post()
    public async createTag(
        @Body() tag: TagCreateRequest,
        @Request() request?: ExpressRequest,
    ): Promise<TagCreateResponse> {
        this.setStatus( CreatedResponder.status )

        await securityFunctions.create( this.authService, request, tag )

        // Convert and Validate the request body
        const [ requestErrors, _requestTagsObjects, _requestTagsDTOInstances ] = await validator(
            tag,
            routerDTO,
            requestIgnoredKeys.CREATE,
            requestDeletedKeys.CREATE
        )
        if ( requestErrors.length > 0 )
            throw new ClassValidationError( requestErrors )

        // Create the Tag
        const createdTag = await routerModel.create( tag )
        const createdTagData = await createdTag.toJSONAsync()

        // TODO: Update assocations

        // Convert Sequelize Model to Response DTO and Validate
        const [ responseErrors, responseTagsDTOs, _responseTagsDTOInstances ] = await validator(
            createdTagData,
            routerDTO,
            responseIgnoredKeys.CREATE,
            responseIgnoredKeys.CREATE
        )
        if ( responseErrors.length > 0 )
            throw new ClassValidationError( responseErrors )

        // Construct and send response
        const responseTagDTO = responseTagsDTOs[ 0 ]
        const response = CreatedResponder.Response(
            responseTagDTO, routerModelTypeName
        )

        return response
    }

    /**
    * Update a tag with a matching id
    *
    * @param id - The identifier of the tag to update
    * @param tag - The posted body object, containing some or all modifiable attributes of TagModel
    */
    @Security( SecurityTypes.API_KEY )
    @Security( SecurityTypes.OAuth2, securityScopeGroups.STAFF )
    @Patch( "{id}" )
    public async updateTag(
        @Path() id: AppModelIdT,
        @Body() tag: TagUpdateRequest,
        @Res() notFoundResponse: TsoaResponse<typeof NotFoundResponder.status, TagNotFoundResponseBody>,
        @Request() _request: ExpressRequest,
    ): Promise<TagUpdateResponse | undefined> {
        this.setStatus( UpdatedResponder.status )

        // Convert and Validate the request body
        const [ requestErrors, _requestTagsObjects, _requestTagsDTOInstances ] = await validator(
            tag,
            routerDTO,
            requestIgnoredKeys.UPDATE,
            requestDeletedKeys.UPDATE,
            { skipMissingProperties: true }
        )
        if ( requestErrors.length > 0 )
            throw new ClassValidationError( requestErrors )

        // Look for the Tag
        const sqTag = await routerModel.findByPk( id )

        if ( !sqTag ) {
            notFoundResponse( NotFoundResponder.status, NotFoundResponder.Response( "Tag" ) ) as TagNotFoundResponseBody
            return
        }

        await securityFunctions.update( this.authService, _request, sqTag )

        // Update the Tag
        const updatedTag = await sqTag.update( tag )
        const updatedTagData = await updatedTag.toJSONAsync()

        // Convert Sequelize Model to Response DTO and Validate
        const [ responseErrors, responseTagsDTOs, _responseTagsDTOInstances ] = await validator(
            updatedTagData,
            routerDTO,
            responseIgnoredKeys.UPDATE,
            responseDeletedKeys.UPDATE
        )
        if ( responseErrors.length > 0 )
            throw new ClassValidationError( responseErrors )

        // Construct and send response
        const responseTagDTO = responseTagsDTOs[ 0 ]
        const response = UpdatedResponder.Response(
            responseTagDTO, routerModelTypeName
        )

        return response
    }

    /**
    * Delete the tag with the matching id
    *
    * @param id - The identifier of the tag to delete
    * @param force - If true the tag will actually be deleted from the database rather than a soft delete (handled by sequelize)
    */
    @Security( SecurityTypes.API_KEY )
    @Security( SecurityTypes.OAuth2, securityScopeGroups.STAFF )
    @Delete( "{id}" )
    public async deleteTag(
        @Path() id: AppModelIdT,
        @Query() force?: boolean,
        @Res() notFoundResponse?: TsoaResponse<typeof NotFoundResponder.status, TagNotFoundResponseBody>,
        @Request() request?: ExpressRequest,
    ): Promise<TagDeleteResponse | undefined> {
        this.setStatus( DeletedResponder.status )

        // Look for the Tag
        const sqTag = await routerModel.findByPk( id )

        if ( !sqTag ) {
            notFoundResponse?.( NotFoundResponder.status, NotFoundResponder.Response( "Tag" ) ) as TagNotFoundResponseBody
            return
        }

        await securityFunctions.delete( this.authService, request, sqTag )

        // Delete the tag
        const destroyOptions = force ? { force: true } : { }
        await sqTag.destroy( destroyOptions )

        return DeletedResponder.Response( sqTag, routerModelTypeName )
    }

}


export type {
    routerDTOKeyType,
    TagNotFoundResponseBody,

    TagReadResponse,
    TagReadManyResponse,

    TagCreateRequest,
    TagCreateResponse,

    TagUpdateRequest,
    TagUpdateResponse,

    TagDeleteResponse
}
export { responseIgnoredKeys, responseDeletedKeys, requestIgnoredKeys, requestDeletedKeys }