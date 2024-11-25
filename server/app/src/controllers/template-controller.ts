/**
 * This file contains the TSOA controller for operations with BlogModel
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
} from "../responders/controllerResponders.ts"

import { ClassValidationError, QueryValidationError, validator } from "../responders/validationResponders.ts"

import { AuthError, AuthErrorDetails, AuthErrorTypes } from "../responders/authResponders.ts"
import { securityScopeGroups, SecurityTypes } from "../auth/authTypes.ts"

import { defaultOrdering, orderByFieldValuesNames, type OrderByFieldValues } from "./controllerTypes.ts"

import { provideSingleton, inject } from "./ioc/inversifyProvider.ts"

import { AuthService } from "../auth/authService.ts"
import { authMiddleware, authValidators, authValidatorsWithArgs, routeSecurityFunctions } from "../auth/authMiddleware.ts"

import { BlogModel } from "../data/models/models.ts"
import { BlogModelDTO } from "../data/models/validationModels.ts"
/* eslint-enable @typescript-eslint/no-unused-vars */



const routerModelTypeName = "Blog"
const routerModel = BlogModel
const routerDTO = BlogModelDTO

// I'd prefer to use this than the using the DTO in the generics below usage below, but TSOA errors about duplicate models
// It also errors if I try InstanceType<typeof routerDTO> with "no matching model found"
// type routerDTOType = BlogModelDTO
type routerDTOKeyType = keyof BlogModelDTO // It's fine with this though - I guess it doesnt make a model for it


/** (Responses) These are keys for properties ignored by class-validator validation */
const responseIgnoredKeys: Record<string, routerDTOKeyType[]> = {
    READ   : [/*RESPONSE_IGNORED_READ*/ ...readResponseContentOmittedKeys ],
    CREATE : [/*RESPONSE_IGNORED_CREATE*/ ...createResponseContentOmittedKeys ],
    UPDATE : [/*RESPONSE_IGNORED_UPDATE*/ ...updateResponseContentOmittedKeys ],
}

/** (Responses) These are keys for properties that are deleted from objects after class-validator validation */
const responseDeletedKeys: Record<string, routerDTOKeyType[]> = {
    READ   : [/*RESPONSE_DELETED_READ*/ ...readResponseContentOmittedKeys ],
    CREATE : [/*RESPONSE_DELETED_CREATE*/ ...createResponseContentOmittedKeys ],
    UPDATE : [/*RESPONSE_DELETED_UPDATE*/ ...updateResponseContentOmittedKeys ],
}

/** (Requests) These are keys for properties ignored by class-validator validation */
const requestIgnoredKeys: Record<string, routerDTOKeyType[]> = {
    CREATE : [/*REQUEST_IGNORED_CREATE*/ ...createRequestBodyOmittedKeys ],
    UPDATE : [/*REQUEST_IGNORED_UPDATE*/ ...updateRequestBodyOmittedKeys ]
}

/** (Requests) These are keys for properties that are deleted from objects after class-validator validation */
const requestDeletedKeys: Record<string, routerDTOKeyType[]> = {
    CREATE : [/*REQUEST_DELETED_CREATE*/ ],
    UPDATE : [/*REQUEST_DELETED_UPDATE*/ ]
}

/** Response type for this controllers object not found response */
type BlogNotFoundResponseBody = NotFoundResponseBody
// type BlogNotFoundResponseBody = NotFoundResponseBody<typeof routerModelTypeName>

/* types-start: getOne */
// READ
/** Possible responses for {@link BlogController.getBlog} */
type BlogReadResponse =
    // ReadResponseBody<routerDTO, typeof routerModelTypeName, typeof responseIgnoredKeys.READ[number]> // tsoa hates this
    DataResponseBody<
        ReadResponseContent<BlogModelDTO/*RESPONSE_DELETED_READ_LITERAL*//*RESPONSE_OPTIONAL_READ_LITERAL*/>,
        "Blog",
        FoundResponseMessageT
    >

/* types-end: getOne */

/* types-start: getMany */
/** Possible responses for {@link BlogController.getAllBlogs} */
type BlogReadManyResponse =
    DataResponseBody<
        Array<ReadResponseContent<BlogModelDTO/*RESPONSE_DELETED_READ_LITERAL*//*RESPONSE_OPTIONAL_READ_LITERAL*/>>,
        "Blog",
        FoundResponseMessageT
    >
/* types-end: getMany */

/* types-start: create */
// CREATE
/** Request body format for {@link BlogController.createBlog}'s `blog` body parameter */
type BlogCreateRequest = CreateRequestBody<BlogModelDTO/*REQUEST_DELETED_CREATE_LITERAL*//*REQUEST_OPTIONAL_CREATE_LITERAL*/>

/** Possible responses for {@link BlogController.createBlog} */
type BlogCreateResponse =
    DataResponseBody<
        CreateResponseContent<BlogModelDTO/*RESPONSE_DELETED_CREATE_LITERAL*//*RESPONSE_OPTIONAL_CREATE_LITERAL*/>,
        "Blog",
        CreatedResponseMessageT
    >
/* types-end: create */

/* types-start: update */
// UPDATE
/** Request body format for {@link BlogController.updateBlog}'s `blog` body parameter */
type BlogUpdateRequest = UpdateRequestBody<BlogModelDTO/*REQUEST_DELETED_UPDATE_LITERAL*//*REQUEST_OPTIONAL_UPDATE_LITERAL*/>

/** Possible responses for {@link BlogController.updateBlog} */
type BlogUpdateResponse =
    DataResponseBody<
        UpdateResponseContent<BlogModelDTO/*RESPONSE_DELETED_UPDATE_LITERAL*//*RESPONSE_OPTIONAL_UPDATE_LITERAL*/>,
        "Blog",
        UpdatedResponseMessageT
    >

/* types-end: update */

/* types-start: delete */
// DELETE
/** Possible responses for {@link BlogController.deleteBlog} */
type BlogDeleteResponse = DeleteResponseBody<"Blog">
/* types-start: end */


/** The security functions to use within each route */
const securityFunctions = {
    getAll : routeSecurityFunctions.userIsAdminOrOwnsResourceFilters,
    getOne : routeSecurityFunctions.userIsAdminOrOwnsResource,
    create : routeSecurityFunctions.userIsAdminOrOwnsResource,
    update : routeSecurityFunctions.userIsAdminOrOwnsResource,
    delete : routeSecurityFunctions.userIsAdminOrOwnsResource,
}


// TSOA Complains if we use a variable as first param on controller @Response, but is fine on route e.g
// @Response<ValidationErrorResponseBody>( ValidationErrorResponder.status, ValidationErrorResponder.validationMessage )
// ValidationErrorResponse occurs on all routes EXCEPT delete, but it's simpler to keep it here and makes the typing in the generated client better
/**
 * Route controller for {@link BlogModel} and {@link BlogModelDTO}
 */
@provideSingleton( BlogController )
@Response<AuthErrorResponseBody>( 401, AuthErrorTypes.NOT_AUTHENTICATED )
@Response<AuthErrorResponseBody>( 403, AuthErrorTypes.NOT_AUTHORIZED )
@Response<ValidationErrorResponseBody>( 422, ValidationErrorResponder.validationMessage )
@Route( "blogs" )
@Tags( "Blog" )
export class BlogController extends Controller {
    private readonly authService: AuthService

    constructor(
        @inject( AuthService ) authService: AuthService
    ) {
        super()
        this.authService = authService
    }

    /* route-start: getMany */
    /**
    * Retrieves a list of all blogs, matching the query parameters if provided.
    *
    * @param offset - Retrieve records starting from this offset
    * @param limit - Retrieve up to this many records
    * @param orderBy - Order records by this attribute
    * @param filters - Stringified JSON where the keys represent a property of a blog and values represent a text based filter for the property
    */
    /* route-securities: getMany */
    /* route-authorizations: getMany */
    @Get( )
    public async getAllBlogs(
        @Query() offset?: number,
        @Query() limit?: number,
        @Query() orderBy?: OrderByFieldValues,
        @Query() filters?: string,
        @Res() notFoundResponse?: TsoaResponse<typeof NotFoundResponder.status, BlogNotFoundResponseBody>,
        @Request() request?: ExpressRequest,
    ): Promise<BlogReadManyResponse | undefined> {
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

        // Look for the Blogs
        const { rows: sqBlogs, count } = await routerModel.findAndCountAll( queryOptions )
        // Apply virtual attribute filters
        const filteredSqBlogs = []
        sqBlogsLoop:
        for ( const sqBlog of sqBlogs ) {
            for ( const [ key, [ value, _attribute ] ] of Object.entries( virtualAttributeFilters ) ) {
                const sqBlogValue = await sqBlog.get( key )
                if ( sqBlogValue !== value )
                    continue sqBlogsLoop
            }
            filteredSqBlogs.push( sqBlog )
        }

        // Convert final data to JSON
        const sqBlogsData = await Promise.all( filteredSqBlogs.map( async sqBlog => await sqBlog.toJSONAsync() ) )
        const remainingCount = count - sqBlogs.length - ( sqBlogs.length - filteredSqBlogs.length )

        if ( !filteredSqBlogs.length ) {
            notFoundResponse?.( NotFoundResponder.status, NotFoundResponder.Response( "Blog" ) ) as BlogNotFoundResponseBody
            return
        }

        // Convert Sequelize Model to Response DTO and Validate
        const [ responseErrors, responseBlogsDTOs, _responseBlogsDTOInstances ] = await validator(
            sqBlogsData,
            routerDTO,
            responseIgnoredKeys.READ,
            responseDeletedKeys.READ
        )
        if ( responseErrors.length > 0 )
            throw new ClassValidationError( responseErrors )

        // Construct and send response
        const extraMetaData =
            {
                resultsCount     : filteredSqBlogs.length,
                resultsRemaining : remainingCount || undefined,
                totalRecords     : count === filteredSqBlogs.length ? undefined : count,
            }
        const response = FoundResponder.Response(
            responseBlogsDTOs,
            routerModelTypeName,
            extraMetaData
        )

        return response
    }
    /* route-end: getMany */

    /* route-start: getOne */
    /**
    * Retrieves the details of an existing blog with a matching id
    *
    * @param id - The identifier of the blog to get
    */
    /* route-securities: getOne */
    /* route-authorizations: getOne */
    @Get( "{id}" )
    public async getBlog(
        @Path() id: AppModelIdT,
        @Res() notFoundResponse: TsoaResponse<typeof NotFoundResponder.status, BlogNotFoundResponseBody>,
        @Request() request?: ExpressRequest,
    ): Promise<BlogReadResponse | undefined> {
        this.setStatus( FoundResponder.status )

        // Look for the Blog
        const sqBlog = await routerModel.findByPk( id )

        if ( !sqBlog ) {
            notFoundResponse( NotFoundResponder.status, NotFoundResponder.Response( "Blog" ) ) as BlogNotFoundResponseBody
            return
        }

        await securityFunctions.getOne( this.authService, request, sqBlog )

        const sqBlogData = await sqBlog.toJSONAsync()

        // Convert Sequelize Model to Response DTO and Validate
        const [ responseErrors, responseBlogsDTOs, _responseBlogsDTOInstances ] = await validator(
            sqBlogData,
            routerDTO,
            responseIgnoredKeys.READ,
            responseDeletedKeys.READ
        )
        if ( responseErrors.length > 0 )
            throw new ClassValidationError( responseErrors )

        // Construct and send response
        const responseBlogDTO = responseBlogsDTOs[ 0 ]
        const response = FoundResponder.Response(
            responseBlogDTO, routerModelTypeName
        )

        return response
    }
    /* route-end: getOne */

    /* route-start: create */
    /**
    * Creates a new blog
    *
    * @param blog - The posted body object, containing the creation attributes of BlogModel
    */
    /* route-securities: create */
    /* route-authorizations: create */
    @Post()
    public async createBlog(
        @Body() blog: BlogCreateRequest,
        @Request() request?: ExpressRequest,
    ): Promise<BlogCreateResponse> {
        this.setStatus( CreatedResponder.status )

        await securityFunctions.create( this.authService, request, blog )

        // Convert and Validate the request body
        const [ requestErrors, _requestBlogsObjects, _requestBlogsDTOInstances ] = await validator(
            blog,
            routerDTO,
            requestIgnoredKeys.CREATE,
            requestDeletedKeys.CREATE
        )
        if ( requestErrors.length > 0 )
            throw new ClassValidationError( requestErrors )

        // Create the Blog
        const createdBlog = await routerModel.create( blog )
        const createdBlogData = await createdBlog.toJSONAsync()

        // TODO: Update assocations

        // Convert Sequelize Model to Response DTO and Validate
        const [ responseErrors, responseBlogsDTOs, _responseBlogsDTOInstances ] = await validator(
            createdBlogData,
            routerDTO,
            responseIgnoredKeys.CREATE,
            responseIgnoredKeys.CREATE
        )
        if ( responseErrors.length > 0 )
            throw new ClassValidationError( responseErrors )

        // Construct and send response
        const responseBlogDTO = responseBlogsDTOs[ 0 ]
        const response = CreatedResponder.Response(
            responseBlogDTO, routerModelTypeName
        )

        return response
    }
    /* route-end: create */

    /* route-start: update */
    /**
    * Update a blog with a matching id
    *
    * @param id - The identifier of the blog to update
    * @param blog - The posted body object, containing some or all modifiable attributes of BlogModel
    */
    /* route-securities: update */
    /* route-authorizations: update */
    @Patch( "{id}" )
    public async updateBlog(
        @Path() id: AppModelIdT,
        @Body() blog: BlogUpdateRequest,
        @Res() notFoundResponse: TsoaResponse<typeof NotFoundResponder.status, BlogNotFoundResponseBody>,
        @Request() _request: ExpressRequest,
    ): Promise<BlogUpdateResponse | undefined> {
        this.setStatus( UpdatedResponder.status )

        // Convert and Validate the request body
        const [ requestErrors, _requestBlogsObjects, _requestBlogsDTOInstances ] = await validator(
            blog,
            routerDTO,
            requestIgnoredKeys.UPDATE,
            requestDeletedKeys.UPDATE,
            { skipMissingProperties: true }
        )
        if ( requestErrors.length > 0 )
            throw new ClassValidationError( requestErrors )

        // Look for the Blog
        const sqBlog = await routerModel.findByPk( id )

        if ( !sqBlog ) {
            notFoundResponse( NotFoundResponder.status, NotFoundResponder.Response( "Blog" ) ) as BlogNotFoundResponseBody
            return
        }

        await securityFunctions.update( this.authService, _request, sqBlog )

        // Update the Blog
        const updatedBlog = await sqBlog.update( blog )
        const updatedBlogData = await updatedBlog.toJSONAsync()

        // Convert Sequelize Model to Response DTO and Validate
        const [ responseErrors, responseBlogsDTOs, _responseBlogsDTOInstances ] = await validator(
            updatedBlogData,
            routerDTO,
            responseIgnoredKeys.UPDATE,
            responseDeletedKeys.UPDATE
        )
        if ( responseErrors.length > 0 )
            throw new ClassValidationError( responseErrors )

        // Construct and send response
        const responseBlogDTO = responseBlogsDTOs[ 0 ]
        const response = UpdatedResponder.Response(
            responseBlogDTO, routerModelTypeName
        )

        return response
    }
    /* route-end: update */

    /* route-start: delete */
    /**
    * Delete the blog with the matching id
    *
    * @param id - The identifier of the blog to delete
    * @param force - If true the blog will actually be deleted from the database rather than a soft delete (handled by sequelize)
    */
    /* route-securities: delete */
    /* route-authorizations: delete */
    @Delete( "{id}" )
    public async deleteBlog(
        @Path() id: AppModelIdT,
        @Query() force?: boolean,
        @Res() notFoundResponse?: TsoaResponse<typeof NotFoundResponder.status, BlogNotFoundResponseBody>,
        @Request() request?: ExpressRequest,
    ): Promise<BlogDeleteResponse | undefined> {
        this.setStatus( DeletedResponder.status )

        // Look for the Blog
        const sqBlog = await routerModel.findByPk( id )

        if ( !sqBlog ) {
            notFoundResponse?.( NotFoundResponder.status, NotFoundResponder.Response( "Blog" ) ) as BlogNotFoundResponseBody
            return
        }

        await securityFunctions.delete( this.authService, request, sqBlog )

        // Delete the blog
        const destroyOptions = force ? { force: true } : { }
        await sqBlog.destroy( destroyOptions )

        return DeletedResponder.Response( sqBlog, routerModelTypeName )
    }
    /* route-end: delete */

}


export type {
    routerDTOKeyType,
    BlogNotFoundResponseBody,

    BlogReadResponse,
    BlogReadManyResponse,

    BlogCreateRequest,
    BlogCreateResponse,

    BlogUpdateRequest,
    BlogUpdateResponse,

    BlogDeleteResponse
}
export { responseIgnoredKeys, responseDeletedKeys, requestIgnoredKeys, requestDeletedKeys }