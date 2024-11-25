/**
 * This file contains the TSOA controller for operations with BookingModel
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

import { BookingModel } from "../../data/models/models.ts"
import { BookingModelDTO } from "../../data/models/validationModels.ts"
/* eslint-enable @typescript-eslint/no-unused-vars */



const routerModelTypeName = "Booking"
const routerModel = BookingModel
const routerDTO = BookingModelDTO

// I'd prefer to use this than the using the DTO in the generics below usage below, but TSOA errors about duplicate models
// It also errors if I try InstanceType<typeof routerDTO> with "no matching model found"
// type routerDTOType = BookingModelDTO
type routerDTOKeyType = keyof BookingModelDTO // It's fine with this though - I guess it doesnt make a model for it


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
    CREATE : [ "bookingType", ...createRequestBodyOmittedKeys ],
    UPDATE : [ "bookingType", ...updateRequestBodyOmittedKeys ]
}

/** (Requests) These are keys for properties that are deleted from objects after class-validator validation */
const requestDeletedKeys: Record<string, routerDTOKeyType[]> = {
    CREATE : [ "bookingType", ],
    UPDATE : [ "bookingType", ]
}

/** Response type for this controllers object not found response */
type BookingNotFoundResponseBody = NotFoundResponseBody
// type BookingNotFoundResponseBody = NotFoundResponseBody<typeof routerModelTypeName>

// READ
/** Possible responses for {@link BookingController.getBooking} */
type BookingReadResponse =
    // ReadResponseBody<routerDTO, typeof routerModelTypeName, typeof responseIgnoredKeys.READ[number]> // tsoa hates this
    DataResponseBody<
        ReadResponseContent<BookingModelDTO, never, never>,
        "Booking",
        FoundResponseMessageT
    >


/** Possible responses for {@link BookingController.getAllBookings} */
type BookingReadManyResponse =
    DataResponseBody<
        Array<ReadResponseContent<BookingModelDTO, never, never>>,
        "Booking",
        FoundResponseMessageT
    >

// CREATE
/** Request body format for {@link BookingController.createBooking}'s `booking` body parameter */
type BookingCreateRequest = CreateRequestBody<BookingModelDTO, "bookingType", never>

/** Possible responses for {@link BookingController.createBooking} */
type BookingCreateResponse =
    DataResponseBody<
        CreateResponseContent<BookingModelDTO, never, never>,
        "Booking",
        CreatedResponseMessageT
    >

// UPDATE
/** Request body format for {@link BookingController.updateBooking}'s `booking` body parameter */
type BookingUpdateRequest = UpdateRequestBody<BookingModelDTO, "bookingType", never>

/** Possible responses for {@link BookingController.updateBooking} */
type BookingUpdateResponse =
    DataResponseBody<
        UpdateResponseContent<BookingModelDTO, never, never>,
        "Booking",
        UpdatedResponseMessageT
    >


// DELETE
/** Possible responses for {@link BookingController.deleteBooking} */
type BookingDeleteResponse = DeleteResponseBody<"Booking">


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
 * Route controller for {@link BookingModel} and {@link BookingModelDTO}
 */
@provideSingleton( BookingController )
@Response<AuthErrorResponseBody>( 401, AuthErrorTypes.NOT_AUTHENTICATED )
@Response<AuthErrorResponseBody>( 403, AuthErrorTypes.NOT_AUTHORIZED )
@Response<ValidationErrorResponseBody>( 422, ValidationErrorResponder.validationMessage )
@Route( "bookings" )
@Tags( "Booking" )
export class BookingController extends Controller {
    private readonly authService: AuthService

    constructor(
        @inject( AuthService ) authService: AuthService
    ) {
        super()
        this.authService = authService
    }

    /**
    * Retrieves a list of all bookings, matching the query parameters if provided.
    *
    * @param offset - Retrieve records starting from this offset
    * @param limit - Retrieve up to this many records
    * @param orderBy - Order records by this attribute
    * @param filters - Stringified JSON where the keys represent a property of a booking and values represent a text based filter for the property
    */
    @Security( SecurityTypes.API_KEY )
    @Security( SecurityTypes.OAuth2, securityScopeGroups.USER )
    @Get( )
    public async getAllBookings(
        @Query() offset?: number,
        @Query() limit?: number,
        @Query() orderBy?: OrderByFieldValues,
        @Query() filters?: string,
        @Res() notFoundResponse?: TsoaResponse<typeof NotFoundResponder.status, BookingNotFoundResponseBody>,
        @Request() request?: ExpressRequest,
    ): Promise<BookingReadManyResponse | undefined> {
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

        // Look for the Bookings
        const { rows: sqBookings, count } = await routerModel.findAndCountAll( queryOptions )
        // Apply virtual attribute filters
        const filteredSqBookings = []
        sqBookingsLoop:
        for ( const sqBooking of sqBookings ) {
            for ( const [ key, [ value, _attribute ] ] of Object.entries( virtualAttributeFilters ) ) {
                const sqBookingValue = await sqBooking.get( key )
                if ( sqBookingValue !== value )
                    continue sqBookingsLoop
            }
            filteredSqBookings.push( sqBooking )
        }

        // Convert final data to JSON
        const sqBookingsData = await Promise.all( filteredSqBookings.map( async sqBooking => await sqBooking.toJSONAsync() ) )
        const remainingCount = count - sqBookings.length - ( sqBookings.length - filteredSqBookings.length )

        if ( !filteredSqBookings.length ) {
            notFoundResponse?.( NotFoundResponder.status, NotFoundResponder.Response( "Booking" ) ) as BookingNotFoundResponseBody
            return
        }

        // Convert Sequelize Model to Response DTO and Validate
        const [ responseErrors, responseBookingsDTOs, _responseBookingsDTOInstances ] = await validator(
            sqBookingsData,
            routerDTO,
            responseIgnoredKeys.READ,
            responseDeletedKeys.READ
        )
        if ( responseErrors.length > 0 )
            throw new ClassValidationError( responseErrors )

        // Construct and send response
        const extraMetaData =
            {
                resultsCount     : filteredSqBookings.length,
                resultsRemaining : remainingCount || undefined,
                totalRecords     : count === filteredSqBookings.length ? undefined : count,
            }
        const response = FoundResponder.Response(
            responseBookingsDTOs,
            routerModelTypeName,
            extraMetaData
        )

        return response
    }

    /**
    * Retrieves the details of an existing booking with a matching id
    *
    * @param id - The identifier of the booking to get
    */
    @Security( SecurityTypes.API_KEY )
    @Security( SecurityTypes.OAuth2, securityScopeGroups.USER )
    @Get( "{id}" )
    public async getBooking(
        @Path() id: AppModelIdT,
        @Res() notFoundResponse: TsoaResponse<typeof NotFoundResponder.status, BookingNotFoundResponseBody>,
        @Request() request?: ExpressRequest,
    ): Promise<BookingReadResponse | undefined> {
        this.setStatus( FoundResponder.status )

        // Look for the Booking
        const sqBooking = await routerModel.findByPk( id )

        if ( !sqBooking ) {
            notFoundResponse( NotFoundResponder.status, NotFoundResponder.Response( "Booking" ) ) as BookingNotFoundResponseBody
            return
        }

        await securityFunctions.getOne( this.authService, request, sqBooking )

        const sqBookingData = await sqBooking.toJSONAsync()

        // Convert Sequelize Model to Response DTO and Validate
        const [ responseErrors, responseBookingsDTOs, _responseBookingsDTOInstances ] = await validator(
            sqBookingData,
            routerDTO,
            responseIgnoredKeys.READ,
            responseDeletedKeys.READ
        )
        if ( responseErrors.length > 0 )
            throw new ClassValidationError( responseErrors )

        // Construct and send response
        const responseBookingDTO = responseBookingsDTOs[ 0 ]
        const response = FoundResponder.Response(
            responseBookingDTO, routerModelTypeName
        )

        return response
    }

    /**
    * Creates a new booking
    *
    * @param booking - The posted body object, containing the creation attributes of BookingModel
    */
    @Security( SecurityTypes.API_KEY )
    @Security( SecurityTypes.OAuth2, securityScopeGroups.USER )
    @Post()
    public async createBooking(
        @Body() booking: BookingCreateRequest,
        @Request() request?: ExpressRequest,
    ): Promise<BookingCreateResponse> {
        this.setStatus( CreatedResponder.status )

        await securityFunctions.create( this.authService, request, booking )

        // Convert and Validate the request body
        const [ requestErrors, _requestBookingsObjects, _requestBookingsDTOInstances ] = await validator(
            booking,
            routerDTO,
            requestIgnoredKeys.CREATE,
            requestDeletedKeys.CREATE
        )
        if ( requestErrors.length > 0 )
            throw new ClassValidationError( requestErrors )

        // Create the Booking
        const createdBooking = await routerModel.create( booking )
        const createdBookingData = await createdBooking.toJSONAsync()

        // TODO: Update assocations

        // Convert Sequelize Model to Response DTO and Validate
        const [ responseErrors, responseBookingsDTOs, _responseBookingsDTOInstances ] = await validator(
            createdBookingData,
            routerDTO,
            responseIgnoredKeys.CREATE,
            responseIgnoredKeys.CREATE
        )
        if ( responseErrors.length > 0 )
            throw new ClassValidationError( responseErrors )

        // Construct and send response
        const responseBookingDTO = responseBookingsDTOs[ 0 ]
        const response = CreatedResponder.Response(
            responseBookingDTO, routerModelTypeName
        )

        return response
    }

    /**
    * Update a booking with a matching id
    *
    * @param id - The identifier of the booking to update
    * @param booking - The posted body object, containing some or all modifiable attributes of BookingModel
    */
    @Security( SecurityTypes.API_KEY )
    @Security( SecurityTypes.OAuth2, securityScopeGroups.USER )
    @Patch( "{id}" )
    public async updateBooking(
        @Path() id: AppModelIdT,
        @Body() booking: BookingUpdateRequest,
        @Res() notFoundResponse: TsoaResponse<typeof NotFoundResponder.status, BookingNotFoundResponseBody>,
        @Request() _request: ExpressRequest,
    ): Promise<BookingUpdateResponse | undefined> {
        this.setStatus( UpdatedResponder.status )

        // Convert and Validate the request body
        const [ requestErrors, _requestBookingsObjects, _requestBookingsDTOInstances ] = await validator(
            booking,
            routerDTO,
            requestIgnoredKeys.UPDATE,
            requestDeletedKeys.UPDATE,
            { skipMissingProperties: true }
        )
        if ( requestErrors.length > 0 )
            throw new ClassValidationError( requestErrors )

        // Look for the Booking
        const sqBooking = await routerModel.findByPk( id )

        if ( !sqBooking ) {
            notFoundResponse( NotFoundResponder.status, NotFoundResponder.Response( "Booking" ) ) as BookingNotFoundResponseBody
            return
        }

        await securityFunctions.update( this.authService, _request, sqBooking )

        // Update the Booking
        const updatedBooking = await sqBooking.update( booking )
        const updatedBookingData = await updatedBooking.toJSONAsync()

        // Convert Sequelize Model to Response DTO and Validate
        const [ responseErrors, responseBookingsDTOs, _responseBookingsDTOInstances ] = await validator(
            updatedBookingData,
            routerDTO,
            responseIgnoredKeys.UPDATE,
            responseDeletedKeys.UPDATE
        )
        if ( responseErrors.length > 0 )
            throw new ClassValidationError( responseErrors )

        // Construct and send response
        const responseBookingDTO = responseBookingsDTOs[ 0 ]
        const response = UpdatedResponder.Response(
            responseBookingDTO, routerModelTypeName
        )

        return response
    }

    /**
    * Delete the booking with the matching id
    *
    * @param id - The identifier of the booking to delete
    * @param force - If true the booking will actually be deleted from the database rather than a soft delete (handled by sequelize)
    */
    @Security( SecurityTypes.API_KEY )
    @Security( SecurityTypes.OAuth2, securityScopeGroups.USER )
    @Delete( "{id}" )
    public async deleteBooking(
        @Path() id: AppModelIdT,
        @Query() force?: boolean,
        @Res() notFoundResponse?: TsoaResponse<typeof NotFoundResponder.status, BookingNotFoundResponseBody>,
        @Request() request?: ExpressRequest,
    ): Promise<BookingDeleteResponse | undefined> {
        this.setStatus( DeletedResponder.status )

        // Look for the Booking
        const sqBooking = await routerModel.findByPk( id )

        if ( !sqBooking ) {
            notFoundResponse?.( NotFoundResponder.status, NotFoundResponder.Response( "Booking" ) ) as BookingNotFoundResponseBody
            return
        }

        await securityFunctions.delete( this.authService, request, sqBooking )

        // Delete the booking
        const destroyOptions = force ? { force: true } : { }
        await sqBooking.destroy( destroyOptions )

        return DeletedResponder.Response( sqBooking, routerModelTypeName )
    }

}


export type {
    routerDTOKeyType,
    BookingNotFoundResponseBody,

    BookingReadResponse,
    BookingReadManyResponse,

    BookingCreateRequest,
    BookingCreateResponse,

    BookingUpdateRequest,
    BookingUpdateResponse,

    BookingDeleteResponse
}
export { responseIgnoredKeys, responseDeletedKeys, requestIgnoredKeys, requestDeletedKeys }