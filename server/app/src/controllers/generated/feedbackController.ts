/**
 * This file contains the TSOA controller for operations with FeedbackModel
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

import { FeedbackModel } from "../../data/models/models.ts"
import { FeedbackModelDTO } from "../../data/models/validationModels.ts"
/* eslint-enable @typescript-eslint/no-unused-vars */



const routerModelTypeName = "Feedback"
const routerModel = FeedbackModel
const routerDTO = FeedbackModelDTO

// I'd prefer to use this than the using the DTO in the generics below usage below, but TSOA errors about duplicate models
// It also errors if I try InstanceType<typeof routerDTO> with "no matching model found"
// type routerDTOType = FeedbackModelDTO
type routerDTOKeyType = keyof FeedbackModelDTO // It's fine with this though - I guess it doesnt make a model for it


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
    CREATE : [ "userId", ...createRequestBodyOmittedKeys ],
    UPDATE : [ "userId", ...updateRequestBodyOmittedKeys ]
}

/** (Requests) These are keys for properties that are deleted from objects after class-validator validation */
const requestDeletedKeys: Record<string, routerDTOKeyType[]> = {
    CREATE : [ ],
    UPDATE : [ ]
}

/** Response type for this controllers object not found response */
type FeedbackNotFoundResponseBody = NotFoundResponseBody
// type FeedbackNotFoundResponseBody = NotFoundResponseBody<typeof routerModelTypeName>

// READ
/** Possible responses for {@link FeedbackController.getFeedback} */
type FeedbackReadResponse =
    // ReadResponseBody<routerDTO, typeof routerModelTypeName, typeof responseIgnoredKeys.READ[number]> // tsoa hates this
    DataResponseBody<
        ReadResponseContent<FeedbackModelDTO, never, never>,
        "Feedback",
        FoundResponseMessageT
    >


/** Possible responses for {@link FeedbackController.getAllFeedbacks} */
type FeedbackReadManyResponse =
    DataResponseBody<
        Array<ReadResponseContent<FeedbackModelDTO, never, never>>,
        "Feedback",
        FoundResponseMessageT
    >

// CREATE
/** Request body format for {@link FeedbackController.createFeedback}'s `feedback` body parameter */
type FeedbackCreateRequest = CreateRequestBody<FeedbackModelDTO, never, "isPublic" | "userId">

/** Possible responses for {@link FeedbackController.createFeedback} */
type FeedbackCreateResponse =
    DataResponseBody<
        CreateResponseContent<FeedbackModelDTO, never, never>,
        "Feedback",
        CreatedResponseMessageT
    >

// UPDATE
/** Request body format for {@link FeedbackController.updateFeedback}'s `feedback` body parameter */
type FeedbackUpdateRequest = UpdateRequestBody<FeedbackModelDTO, never, never>

/** Possible responses for {@link FeedbackController.updateFeedback} */
type FeedbackUpdateResponse =
    DataResponseBody<
        UpdateResponseContent<FeedbackModelDTO, never, never>,
        "Feedback",
        UpdatedResponseMessageT
    >


// DELETE
/** Possible responses for {@link FeedbackController.deleteFeedback} */
type FeedbackDeleteResponse = DeleteResponseBody<"Feedback">


/** The security functions to use within each route */
const securityFunctions = {
    getAll: ( authService: AuthService, request: ExpressRequest | undefined ) =>
        routeSecurityFunctions.adminOrFilters( authService, request, { isPublic: true } ),
    getOne: async ( authService: AuthService, request: ExpressRequest | undefined, modelObject: Model | object ) => {
        try {
            // Public feedback
            await routeSecurityFunctions.adminOrHasProperty( authService, request, modelObject, { isPublic: true } )
        } catch ( e: unknown ) {
            if ( !( e instanceof AuthError ) ) throw e
            try {
                // Allow viewing anonymous feedback after creation
                await routeSecurityFunctions.adminOrHasProperty( authService, request, modelObject, { userId: null } )
            } catch ( e: unknown ) {
                if ( !( e instanceof AuthError ) ) throw e
                // Users own unapproved feedback
                await routeSecurityFunctions.userIsAdminOrOwnsResource( authService, request, modelObject )
            }
        }
    },
    create : routeSecurityFunctions.alwaysAllow,
    update : routeSecurityFunctions.userIsAdminOrOwnsResource,
    delete : routeSecurityFunctions.userIsAdminOrOwnsResource
}


// TSOA Complains if we use a variable as first param on controller @Response, but is fine on route e.g
// @Response<ValidationErrorResponseBody>( ValidationErrorResponder.status, ValidationErrorResponder.validationMessage )
// ValidationErrorResponse occurs on all routes EXCEPT delete, but it's simpler to keep it here and makes the typing in the generated client better
/**
 * Route controller for {@link FeedbackModel} and {@link FeedbackModelDTO}
 */
@provideSingleton( FeedbackController )
@Response<AuthErrorResponseBody>( 401, AuthErrorTypes.NOT_AUTHENTICATED )
@Response<AuthErrorResponseBody>( 403, AuthErrorTypes.NOT_AUTHORIZED )
@Response<ValidationErrorResponseBody>( 422, ValidationErrorResponder.validationMessage )
@Route( "feedbacks" )
@Tags( "Feedback" )
export class FeedbackController extends Controller {
    private readonly authService: AuthService

    constructor(
        @inject( AuthService ) authService: AuthService
    ) {
        super()
        this.authService = authService
    }

    /**
    * Retrieves a list of all feedbacks, matching the query parameters if provided.
    *
    * @param offset - Retrieve records starting from this offset
    * @param limit - Retrieve up to this many records
    * @param orderBy - Order records by this attribute
    * @param filters - Stringified JSON where the keys represent a property of a feedback and values represent a text based filter for the property
    */
    @Get( )
    public async getAllFeedbacks(
        @Query() offset?: number,
        @Query() limit?: number,
        @Query() orderBy?: OrderByFieldValues,
        @Query() filters?: string,
        @Res() notFoundResponse?: TsoaResponse<typeof NotFoundResponder.status, FeedbackNotFoundResponseBody>,
        @Request() request?: ExpressRequest,
    ): Promise<FeedbackReadManyResponse | undefined> {
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

        // Look for the Feedbacks
        const { rows: sqFeedbacks, count } = await routerModel.findAndCountAll( queryOptions )
        // Apply virtual attribute filters
        const filteredSqFeedbacks = []
        sqFeedbacksLoop:
        for ( const sqFeedback of sqFeedbacks ) {
            for ( const [ key, [ value, _attribute ] ] of Object.entries( virtualAttributeFilters ) ) {
                const sqFeedbackValue = await sqFeedback.get( key )
                if ( sqFeedbackValue !== value )
                    continue sqFeedbacksLoop
            }
            filteredSqFeedbacks.push( sqFeedback )
        }

        // Convert final data to JSON
        const sqFeedbacksData = await Promise.all( filteredSqFeedbacks.map( async sqFeedback => await sqFeedback.toJSONAsync() ) )
        const remainingCount = count - sqFeedbacks.length - ( sqFeedbacks.length - filteredSqFeedbacks.length )

        if ( !filteredSqFeedbacks.length ) {
            notFoundResponse?.( NotFoundResponder.status, NotFoundResponder.Response( "Feedback" ) ) as FeedbackNotFoundResponseBody
            return
        }

        // Convert Sequelize Model to Response DTO and Validate
        const [ responseErrors, responseFeedbacksDTOs, _responseFeedbacksDTOInstances ] = await validator(
            sqFeedbacksData,
            routerDTO,
            responseIgnoredKeys.READ,
            responseDeletedKeys.READ
        )
        if ( responseErrors.length > 0 )
            throw new ClassValidationError( responseErrors )

        // Construct and send response
        const extraMetaData =
            {
                resultsCount     : filteredSqFeedbacks.length,
                resultsRemaining : remainingCount || undefined,
                totalRecords     : count === filteredSqFeedbacks.length ? undefined : count,
            }
        const response = FoundResponder.Response(
            responseFeedbacksDTOs,
            routerModelTypeName,
            extraMetaData
        )

        return response
    }

    /**
    * Retrieves the details of an existing feedback with a matching id
    *
    * @param id - The identifier of the feedback to get
    */
    @Get( "{id}" )
    public async getFeedback(
        @Path() id: AppModelIdT,
        @Res() notFoundResponse: TsoaResponse<typeof NotFoundResponder.status, FeedbackNotFoundResponseBody>,
        @Request() request?: ExpressRequest,
    ): Promise<FeedbackReadResponse | undefined> {
        this.setStatus( FoundResponder.status )

        // Look for the Feedback
        const sqFeedback = await routerModel.findByPk( id )

        if ( !sqFeedback ) {
            notFoundResponse( NotFoundResponder.status, NotFoundResponder.Response( "Feedback" ) ) as FeedbackNotFoundResponseBody
            return
        }

        await securityFunctions.getOne( this.authService, request, sqFeedback )

        const sqFeedbackData = await sqFeedback.toJSONAsync()

        // Convert Sequelize Model to Response DTO and Validate
        const [ responseErrors, responseFeedbacksDTOs, _responseFeedbacksDTOInstances ] = await validator(
            sqFeedbackData,
            routerDTO,
            responseIgnoredKeys.READ,
            responseDeletedKeys.READ
        )
        if ( responseErrors.length > 0 )
            throw new ClassValidationError( responseErrors )

        // Construct and send response
        const responseFeedbackDTO = responseFeedbacksDTOs[ 0 ]
        const response = FoundResponder.Response(
            responseFeedbackDTO, routerModelTypeName
        )

        return response
    }

    /**
    * Creates a new feedback
    *
    * @param feedback - The posted body object, containing the creation attributes of FeedbackModel
    */
    @Post()
    public async createFeedback(
        @Body() feedback: FeedbackCreateRequest,
        @Request() request?: ExpressRequest,
    ): Promise<FeedbackCreateResponse> {
        this.setStatus( CreatedResponder.status )

        await securityFunctions.create( this.authService, request, feedback )

        // Convert and Validate the request body
        const [ requestErrors, _requestFeedbacksObjects, _requestFeedbacksDTOInstances ] = await validator(
            feedback,
            routerDTO,
            requestIgnoredKeys.CREATE,
            requestDeletedKeys.CREATE
        )
        if ( requestErrors.length > 0 )
            throw new ClassValidationError( requestErrors )

        // Create the Feedback
        const createdFeedback = await routerModel.create( feedback )
        const createdFeedbackData = await createdFeedback.toJSONAsync()

        // TODO: Update assocations

        // Convert Sequelize Model to Response DTO and Validate
        const [ responseErrors, responseFeedbacksDTOs, _responseFeedbacksDTOInstances ] = await validator(
            createdFeedbackData,
            routerDTO,
            responseIgnoredKeys.CREATE,
            responseIgnoredKeys.CREATE
        )
        if ( responseErrors.length > 0 )
            throw new ClassValidationError( responseErrors )

        // Construct and send response
        const responseFeedbackDTO = responseFeedbacksDTOs[ 0 ]
        const response = CreatedResponder.Response(
            responseFeedbackDTO, routerModelTypeName
        )

        return response
    }

    /**
    * Update a feedback with a matching id
    *
    * @param id - The identifier of the feedback to update
    * @param feedback - The posted body object, containing some or all modifiable attributes of FeedbackModel
    */
    @Patch( "{id}" )
    public async updateFeedback(
        @Path() id: AppModelIdT,
        @Body() feedback: FeedbackUpdateRequest,
        @Res() notFoundResponse: TsoaResponse<typeof NotFoundResponder.status, FeedbackNotFoundResponseBody>,
        @Request() _request: ExpressRequest,
    ): Promise<FeedbackUpdateResponse | undefined> {
        this.setStatus( UpdatedResponder.status )

        // Convert and Validate the request body
        const [ requestErrors, _requestFeedbacksObjects, _requestFeedbacksDTOInstances ] = await validator(
            feedback,
            routerDTO,
            requestIgnoredKeys.UPDATE,
            requestDeletedKeys.UPDATE,
            { skipMissingProperties: true }
        )
        if ( requestErrors.length > 0 )
            throw new ClassValidationError( requestErrors )

        // Look for the Feedback
        const sqFeedback = await routerModel.findByPk( id )

        if ( !sqFeedback ) {
            notFoundResponse( NotFoundResponder.status, NotFoundResponder.Response( "Feedback" ) ) as FeedbackNotFoundResponseBody
            return
        }

        await securityFunctions.update( this.authService, _request, sqFeedback )

        // Update the Feedback
        const updatedFeedback = await sqFeedback.update( feedback )
        const updatedFeedbackData = await updatedFeedback.toJSONAsync()

        // Convert Sequelize Model to Response DTO and Validate
        const [ responseErrors, responseFeedbacksDTOs, _responseFeedbacksDTOInstances ] = await validator(
            updatedFeedbackData,
            routerDTO,
            responseIgnoredKeys.UPDATE,
            responseDeletedKeys.UPDATE
        )
        if ( responseErrors.length > 0 )
            throw new ClassValidationError( responseErrors )

        // Construct and send response
        const responseFeedbackDTO = responseFeedbacksDTOs[ 0 ]
        const response = UpdatedResponder.Response(
            responseFeedbackDTO, routerModelTypeName
        )

        return response
    }

    /**
    * Delete the feedback with the matching id
    *
    * @param id - The identifier of the feedback to delete
    * @param force - If true the feedback will actually be deleted from the database rather than a soft delete (handled by sequelize)
    */
    @Security( SecurityTypes.API_KEY )
    @Security( SecurityTypes.OAuth2, securityScopeGroups.ADMIN )
    @Delete( "{id}" )
    public async deleteFeedback(
        @Path() id: AppModelIdT,
        @Query() force?: boolean,
        @Res() notFoundResponse?: TsoaResponse<typeof NotFoundResponder.status, FeedbackNotFoundResponseBody>,
        @Request() request?: ExpressRequest,
    ): Promise<FeedbackDeleteResponse | undefined> {
        this.setStatus( DeletedResponder.status )

        // Look for the Feedback
        const sqFeedback = await routerModel.findByPk( id )

        if ( !sqFeedback ) {
            notFoundResponse?.( NotFoundResponder.status, NotFoundResponder.Response( "Feedback" ) ) as FeedbackNotFoundResponseBody
            return
        }

        await securityFunctions.delete( this.authService, request, sqFeedback )

        // Delete the feedback
        const destroyOptions = force ? { force: true } : { }
        await sqFeedback.destroy( destroyOptions )

        return DeletedResponder.Response( sqFeedback, routerModelTypeName )
    }

}


export type {
    routerDTOKeyType,
    FeedbackNotFoundResponseBody,

    FeedbackReadResponse,
    FeedbackReadManyResponse,

    FeedbackCreateRequest,
    FeedbackCreateResponse,

    FeedbackUpdateRequest,
    FeedbackUpdateResponse,

    FeedbackDeleteResponse
}
export { responseIgnoredKeys, responseDeletedKeys, requestIgnoredKeys, requestDeletedKeys }