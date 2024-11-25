/**
 * This file contains the TSOA controller for operations with BookingTypeModel
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

import { BookingTypeModel } from "../../data/models/models.ts"
import { BookingTypeModelDTO } from "../../data/models/validationModels.ts"
/* eslint-enable @typescript-eslint/no-unused-vars */



const routerModelTypeName = "BookingType"
const routerModel = BookingTypeModel
const routerDTO = BookingTypeModelDTO

// I'd prefer to use this than the using the DTO in the generics below usage below, but TSOA errors about duplicate models
// It also errors if I try InstanceType<typeof routerDTO> with "no matching model found"
// type routerDTOType = BookingTypeModelDTO
type routerDTOKeyType = keyof BookingTypeModelDTO // It's fine with this though - I guess it doesnt make a model for it


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
type BookingTypeNotFoundResponseBody = NotFoundResponseBody
// type BookingTypeNotFoundResponseBody = NotFoundResponseBody<typeof routerModelTypeName>

// READ
/** Possible responses for {@link BookingTypeController.getBookingType} */
type BookingTypeReadResponse =
    // ReadResponseBody<routerDTO, typeof routerModelTypeName, typeof responseIgnoredKeys.READ[number]> // tsoa hates this
    DataResponseBody<
        ReadResponseContent<BookingTypeModelDTO, never, never>,
        "BookingType",
        FoundResponseMessageT
    >


/** Possible responses for {@link BookingTypeController.getAllBookingTypes} */
type BookingTypeReadManyResponse =
    DataResponseBody<
        Array<ReadResponseContent<BookingTypeModelDTO, never, never>>,
        "BookingType",
        FoundResponseMessageT
    >

// CREATE
/** Request body format for {@link BookingTypeController.createBookingType}'s `bookingType` body parameter */
type BookingTypeCreateRequest = CreateRequestBody<BookingTypeModelDTO, never, never>

/** Possible responses for {@link BookingTypeController.createBookingType} */
type BookingTypeCreateResponse =
    DataResponseBody<
        CreateResponseContent<BookingTypeModelDTO, never, never>,
        "BookingType",
        CreatedResponseMessageT
    >

// UPDATE
/** Request body format for {@link BookingTypeController.updateBookingType}'s `bookingType` body parameter */
type BookingTypeUpdateRequest = UpdateRequestBody<BookingTypeModelDTO, never, never>

/** Possible responses for {@link BookingTypeController.updateBookingType} */
type BookingTypeUpdateResponse =
    DataResponseBody<
        UpdateResponseContent<BookingTypeModelDTO, never, never>,
        "BookingType",
        UpdatedResponseMessageT
    >


// DELETE
/** Possible responses for {@link BookingTypeController.deleteBookingType} */
type BookingTypeDeleteResponse = DeleteResponseBody<"BookingType">


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
 * Route controller for {@link BookingTypeModel} and {@link BookingTypeModelDTO}
 */
@provideSingleton( BookingTypeController )
@Response<AuthErrorResponseBody>( 401, AuthErrorTypes.NOT_AUTHENTICATED )
@Response<AuthErrorResponseBody>( 403, AuthErrorTypes.NOT_AUTHORIZED )
@Response<ValidationErrorResponseBody>( 422, ValidationErrorResponder.validationMessage )
@Route( "bookingTypes" )
@Tags( "BookingType" )
export class BookingTypeController extends Controller {
    private readonly authService: AuthService

    constructor(
        @inject( AuthService ) authService: AuthService
    ) {
        super()
        this.authService = authService
    }

    /**
    * Retrieves a list of all bookingTypes, matching the query parameters if provided.
    *
    * @param offset - Retrieve records starting from this offset
    * @param limit - Retrieve up to this many records
    * @param orderBy - Order records by this attribute
    * @param filters - Stringified JSON where the keys represent a property of a bookingType and values represent a text based filter for the property
    */
    @Get( )
    public async getAllBookingTypes(
        @Query() offset?: number,
        @Query() limit?: number,
        @Query() orderBy?: OrderByFieldValues,
        @Query() filters?: string,
        @Res() notFoundResponse?: TsoaResponse<typeof NotFoundResponder.status, BookingTypeNotFoundResponseBody>,
        @Request() request?: ExpressRequest,
    ): Promise<BookingTypeReadManyResponse | undefined> {
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

        // Look for the BookingTypes
        const { rows: sqBookingTypes, count } = await routerModel.findAndCountAll( queryOptions )
        // Apply virtual attribute filters
        const filteredSqBookingTypes = []
        sqBookingTypesLoop:
        for ( const sqBookingType of sqBookingTypes ) {
            for ( const [ key, [ value, _attribute ] ] of Object.entries( virtualAttributeFilters ) ) {
                const sqBookingTypeValue = await sqBookingType.get( key )
                if ( sqBookingTypeValue !== value )
                    continue sqBookingTypesLoop
            }
            filteredSqBookingTypes.push( sqBookingType )
        }

        // Convert final data to JSON
        const sqBookingTypesData = await Promise.all( filteredSqBookingTypes.map( async sqBookingType => await sqBookingType.toJSONAsync() ) )
        const remainingCount = count - sqBookingTypes.length - ( sqBookingTypes.length - filteredSqBookingTypes.length )

        if ( !filteredSqBookingTypes.length ) {
            notFoundResponse?.( NotFoundResponder.status, NotFoundResponder.Response( "BookingType" ) ) as BookingTypeNotFoundResponseBody
            return
        }

        // Convert Sequelize Model to Response DTO and Validate
        const [ responseErrors, responseBookingTypesDTOs, _responseBookingTypesDTOInstances ] = await validator(
            sqBookingTypesData,
            routerDTO,
            responseIgnoredKeys.READ,
            responseDeletedKeys.READ
        )
        if ( responseErrors.length > 0 )
            throw new ClassValidationError( responseErrors )

        // Construct and send response
        const extraMetaData =
            {
                resultsCount     : filteredSqBookingTypes.length,
                resultsRemaining : remainingCount || undefined,
                totalRecords     : count === filteredSqBookingTypes.length ? undefined : count,
            }
        const response = FoundResponder.Response(
            responseBookingTypesDTOs,
            routerModelTypeName,
            extraMetaData
        )

        return response
    }

    /**
    * Retrieves the details of an existing bookingType with a matching id
    *
    * @param id - The identifier of the bookingType to get
    */
    @Get( "{id}" )
    public async getBookingType(
        @Path() id: AppModelIdT,
        @Res() notFoundResponse: TsoaResponse<typeof NotFoundResponder.status, BookingTypeNotFoundResponseBody>,
        @Request() request?: ExpressRequest,
    ): Promise<BookingTypeReadResponse | undefined> {
        this.setStatus( FoundResponder.status )

        // Look for the BookingType
        const sqBookingType = await routerModel.findByPk( id )

        if ( !sqBookingType ) {
            notFoundResponse( NotFoundResponder.status, NotFoundResponder.Response( "BookingType" ) ) as BookingTypeNotFoundResponseBody
            return
        }

        await securityFunctions.getOne( this.authService, request, sqBookingType )

        const sqBookingTypeData = await sqBookingType.toJSONAsync()

        // Convert Sequelize Model to Response DTO and Validate
        const [ responseErrors, responseBookingTypesDTOs, _responseBookingTypesDTOInstances ] = await validator(
            sqBookingTypeData,
            routerDTO,
            responseIgnoredKeys.READ,
            responseDeletedKeys.READ
        )
        if ( responseErrors.length > 0 )
            throw new ClassValidationError( responseErrors )

        // Construct and send response
        const responseBookingTypeDTO = responseBookingTypesDTOs[ 0 ]
        const response = FoundResponder.Response(
            responseBookingTypeDTO, routerModelTypeName
        )

        return response
    }

    /**
    * Creates a new bookingType
    *
    * @param bookingType - The posted body object, containing the creation attributes of BookingTypeModel
    */
    @Security( SecurityTypes.API_KEY )
    @Security( SecurityTypes.OAuth2, securityScopeGroups.USER )
    @Post()
    public async createBookingType(
        @Body() bookingType: BookingTypeCreateRequest,
        @Request() request?: ExpressRequest,
    ): Promise<BookingTypeCreateResponse> {
        this.setStatus( CreatedResponder.status )

        await securityFunctions.create( this.authService, request, bookingType )

        // Convert and Validate the request body
        const [ requestErrors, _requestBookingTypesObjects, _requestBookingTypesDTOInstances ] = await validator(
            bookingType,
            routerDTO,
            requestIgnoredKeys.CREATE,
            requestDeletedKeys.CREATE
        )
        if ( requestErrors.length > 0 )
            throw new ClassValidationError( requestErrors )

        // Create the BookingType
        const createdBookingType = await routerModel.create( bookingType )
        const createdBookingTypeData = await createdBookingType.toJSONAsync()

        // TODO: Update assocations

        // Convert Sequelize Model to Response DTO and Validate
        const [ responseErrors, responseBookingTypesDTOs, _responseBookingTypesDTOInstances ] = await validator(
            createdBookingTypeData,
            routerDTO,
            responseIgnoredKeys.CREATE,
            responseIgnoredKeys.CREATE
        )
        if ( responseErrors.length > 0 )
            throw new ClassValidationError( responseErrors )

        // Construct and send response
        const responseBookingTypeDTO = responseBookingTypesDTOs[ 0 ]
        const response = CreatedResponder.Response(
            responseBookingTypeDTO, routerModelTypeName
        )

        return response
    }

    /**
    * Update a bookingType with a matching id
    *
    * @param id - The identifier of the bookingType to update
    * @param bookingType - The posted body object, containing some or all modifiable attributes of BookingTypeModel
    */
    @Security( SecurityTypes.API_KEY )
    @Security( SecurityTypes.OAuth2, securityScopeGroups.USER )
    @Patch( "{id}" )
    public async updateBookingType(
        @Path() id: AppModelIdT,
        @Body() bookingType: BookingTypeUpdateRequest,
        @Res() notFoundResponse: TsoaResponse<typeof NotFoundResponder.status, BookingTypeNotFoundResponseBody>,
        @Request() _request: ExpressRequest,
    ): Promise<BookingTypeUpdateResponse | undefined> {
        this.setStatus( UpdatedResponder.status )

        // Convert and Validate the request body
        const [ requestErrors, _requestBookingTypesObjects, _requestBookingTypesDTOInstances ] = await validator(
            bookingType,
            routerDTO,
            requestIgnoredKeys.UPDATE,
            requestDeletedKeys.UPDATE,
            { skipMissingProperties: true }
        )
        if ( requestErrors.length > 0 )
            throw new ClassValidationError( requestErrors )

        // Look for the BookingType
        const sqBookingType = await routerModel.findByPk( id )

        if ( !sqBookingType ) {
            notFoundResponse( NotFoundResponder.status, NotFoundResponder.Response( "BookingType" ) ) as BookingTypeNotFoundResponseBody
            return
        }

        await securityFunctions.update( this.authService, _request, sqBookingType )

        // Update the BookingType
        const updatedBookingType = await sqBookingType.update( bookingType )
        const updatedBookingTypeData = await updatedBookingType.toJSONAsync()

        // Convert Sequelize Model to Response DTO and Validate
        const [ responseErrors, responseBookingTypesDTOs, _responseBookingTypesDTOInstances ] = await validator(
            updatedBookingTypeData,
            routerDTO,
            responseIgnoredKeys.UPDATE,
            responseDeletedKeys.UPDATE
        )
        if ( responseErrors.length > 0 )
            throw new ClassValidationError( responseErrors )

        // Construct and send response
        const responseBookingTypeDTO = responseBookingTypesDTOs[ 0 ]
        const response = UpdatedResponder.Response(
            responseBookingTypeDTO, routerModelTypeName
        )

        return response
    }

    /**
    * Delete the bookingType with the matching id
    *
    * @param id - The identifier of the bookingType to delete
    * @param force - If true the bookingType will actually be deleted from the database rather than a soft delete (handled by sequelize)
    */
    @Security( SecurityTypes.API_KEY )
    @Security( SecurityTypes.OAuth2, securityScopeGroups.USER )
    @Delete( "{id}" )
    public async deleteBookingType(
        @Path() id: AppModelIdT,
        @Query() force?: boolean,
        @Res() notFoundResponse?: TsoaResponse<typeof NotFoundResponder.status, BookingTypeNotFoundResponseBody>,
        @Request() request?: ExpressRequest,
    ): Promise<BookingTypeDeleteResponse | undefined> {
        this.setStatus( DeletedResponder.status )

        // Look for the BookingType
        const sqBookingType = await routerModel.findByPk( id )

        if ( !sqBookingType ) {
            notFoundResponse?.( NotFoundResponder.status, NotFoundResponder.Response( "BookingType" ) ) as BookingTypeNotFoundResponseBody
            return
        }

        await securityFunctions.delete( this.authService, request, sqBookingType )

        // Delete the bookingType
        const destroyOptions = force ? { force: true } : { }
        await sqBookingType.destroy( destroyOptions )

        return DeletedResponder.Response( sqBookingType, routerModelTypeName )
    }

}


export type {
    routerDTOKeyType,
    BookingTypeNotFoundResponseBody,

    BookingTypeReadResponse,
    BookingTypeReadManyResponse,

    BookingTypeCreateRequest,
    BookingTypeCreateResponse,

    BookingTypeUpdateRequest,
    BookingTypeUpdateResponse,

    BookingTypeDeleteResponse
}
export { responseIgnoredKeys, responseDeletedKeys, requestIgnoredKeys, requestDeletedKeys }