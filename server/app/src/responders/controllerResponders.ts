/**
 * This file contains typings and generator classes for the TSOA controller responses
 * @module
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Response, SuccessResponse, Route, Tags, Body, Path, Res, Security } from "tsoa"

import type { AuthErrorResponseBody } from "./authResponders.ts"
import { ValidationErrorResponder, type ValidationErrorMessageT, type ValidationErrorResponseBody } from "./validationResponders.ts"
import {
    DataResponder,
    type DataResponseBody,
    type MetaData,
} from "./dataResponders.ts"
import {
    ErrorResponder,
    type ErrorResponseBody,
} from "./errorResponders.ts"

import type { AppModelIdT } from "../data/models/appModel.ts"
import type { AppModelDTO } from "../data/models/validationModels.ts"

import type { TransformKeys } from "../utils/typeUtils.ts"

/* eslint-enable @typescript-eslint/no-unused-vars */

// Common application response body formats

// Validation Responders
// TSOA can't handle this - https://github.com/lukeautry/tsoa/issues/1569
/*
type NotFoundMessageT<O extends string> = `${O} Not Found`;

interface NotFoundResponseContent<O extends string> {
    detailedMessage: NotFoundMessageT<O>
}

type NotFoundResponseBody<O extends string> = ErrorResponseBody<NotFoundResponseContent<O>>

//NotFoundMessageT<typeof objectName>
//NotFoundResponseContent<typeof objectName>
//NotFoundResponseBody<typeof objectName>
*/

/** The {@link ErrorResponseBody.message} for not found responses */
type NotFoundMessageT = "Not Found"

/** The type of {@link NotFoundErrorsType.message} for not found responses */
type NotFoundDetailedMessageT = string

/** The type of {@link ErrorResponseBody.errors} for not found responses */
interface NotFoundResponseContent {
    message: NotFoundDetailedMessageT
}

/** The type of {@link ErrorResponseBody} for not found responses */
type NotFoundResponseBody = ErrorResponseBody<NotFoundResponseContent, NotFoundMessageT>

/** This class is used for constructing not found responses from controller routes */
class NotFoundResponder {
    static readonly status = 404 as const
    static readonly message: NotFoundMessageT = "Not Found"

    static DetailedMessage = ( objectName: string ): NotFoundDetailedMessageT => `${objectName} Not Found`
    static ResponseContent = ( objectName: string ): NotFoundResponseContent[] =>
        [ { message: this.DetailedMessage( objectName ) } ]

    static Response = (
        objectName: string
    ): NotFoundResponseBody =>
        ErrorResponder.Response<NotFoundResponseContent, NotFoundMessageT>(
            this.ResponseContent( objectName ),
            this.message
        )
}


// Responders for controller routes

/** Represents union of possible values for {@link DataResponseBody.message} for controller success responses */
type ControllerSuccessResponseMessagesT =
    CreatedResponseMessageT
    | FoundResponseMessageT
    | UpdatedResponseMessageT
    | DeletedResponseMessageT

/** Represents interesection of possible values for {@link DataResponseBody.message} for controller success responses */
type ControllerSuccessResponseMessagesReturnType =
    CreatedResponseMessageT
    & FoundResponseMessageT
    & UpdatedResponseMessageT
    & DeletedResponseMessageT


/** This class is used for constructing success responses from controller routes */
class ControllerSuccessResponder {
    protected static readonly message: ControllerSuccessResponseMessagesT
    static readonly status: 200 | 201 = 200 as const

    /**
     * Generates a {@link DataResponseBody} for controller routes
     * @param responseData - The value for {@link DataResponseBody.data}
     * @param responseDataTypeName - The value for {@link MetaData.dataType}
     * @param responseExtraMetaData - Any extra values for {@link DataResponseBody.metadata}
     * @returns
     */
    static Response <
        DataType extends object,
        DataTypeName extends string,
    >(
        responseData: DataType,
        responseDataTypeName: DataTypeName,
        responseExtraMetaData?: Record<string, unknown>,
    ): DataResponseBody<DataType, DataTypeName, ControllerSuccessResponseMessagesReturnType> {
        return DataResponder.Response<DataType, DataTypeName, ControllerSuccessResponseMessagesReturnType>(
            responseData,
            this.message as ControllerSuccessResponseMessagesReturnType,
            {
                ...responseExtraMetaData,
                ...{ dataType: responseDataTypeName }
            }
        )
    }

}

/** The value of {@link DataResponseBody.message} for `create` route success */
type CreatedResponseMessageT = "Created"

/** Extension of {@link ControllerSuccessResponder} for `create` routes */
class CreatedResponder extends ControllerSuccessResponder {
    static override readonly status = 201 as const
    static override readonly message: CreatedResponseMessageT = "Created"
}

/** The value of {@link DataResponseBody.message} for `get` and `getAll` route success */
type FoundResponseMessageT = "Found"

/** Extension of {@link ControllerSuccessResponder} for `get` and `getAll` routes */
class FoundResponder extends ControllerSuccessResponder {
    static override readonly message: FoundResponseMessageT = "Found"
}

/** The value of {@link DataResponseBody.message} for `update` route success */
type UpdatedResponseMessageT = "Updated"

/** Extension of {@link ControllerSuccessResponder} for `update` routes */
class UpdatedResponder extends ControllerSuccessResponder {
    static override readonly message: UpdatedResponseMessageT = "Updated"
}

/** The value of {@link DataResponseBody.message} for `delete` route success */
type DeletedResponseMessageT = "Deleted"

/** Extension of {@link ControllerSuccessResponder} for `delete` routes */
class DeletedResponder extends ControllerSuccessResponder {
    static readonly status = 200 as const
    static readonly message = "Deleted"

    /** Override of the {@link ControllerSuccessResponder.Response} that only returns the deleted entities id */
    static override Response <
        DataType extends object,
        DataTypeName extends string,
    >(
        responseData: DataType,
        responseDataTypeName: DataTypeName,
        responseExtraMetaData?: Record<string, unknown>,
    ): DataResponseBody<DataType, DataTypeName, ControllerSuccessResponseMessagesReturnType> {
        return super.Response<DataType, DataTypeName>(
            { id: ( responseData as & { id: number } ).id } as DataType,
            this.message as ControllerSuccessResponseMessagesReturnType,
            {
                ...responseExtraMetaData,
                ...{ dataType: responseDataTypeName }
            }
        )
    }
}


// Wrappers for generating the applicaitons common OpenAPI reponse types via TSOA decoraters
// These don't actually work see: https://github.com/lukeautry/tsoa/issues/1672
const CreatedReponse = (): MethodDecorator =>
    SuccessResponse( CreatedResponder.status, CreatedResponder.message ) as MethodDecorator

const FoundResponse = (): MethodDecorator =>
    SuccessResponse( FoundResponder.status, FoundResponder.message ) as MethodDecorator

const UpdatedResponse = (): MethodDecorator =>
    SuccessResponse( UpdatedResponder.status, UpdatedResponder.message ) as MethodDecorator

const DeletedResponse = (): MethodDecorator =>
    SuccessResponse( DeletedResponder.status, DeletedResponder.message ) as MethodDecorator

const NotFoundResponse = ( objectName: string ): MethodDecorator =>
    Response<NotFoundResponseBody>( NotFoundResponder.status, `${objectName} Not Found` ) as MethodDecorator

const ValidationErrorResponse = (): MethodDecorator =>
    Response<ValidationErrorResponseBody>( ValidationErrorResponder.status, "Validation Failed" ) as MethodDecorator


// Type wrappers to infer response/request data content types for sequelize models
// TSOA has trouble unwrapping the these types so we have to use their actual values in our controller

type DTOKeys = "setShouldValidate"
// CREATE
const createRequestBodyOmittedKeys: Array<keyof AppModelDTO> = [ "id", "createdAt", "updatedAt", "deletedAt" ]
type CreateRequestBodyOmittedKeysT = "id" | "createdAt" | "updatedAt" | "deletedAt" | DTOKeys
type CreateRequestBody<
    M,
    OmitKeys extends keyof M = never,
    OptionalKeys extends keyof M = never,
    RequiredKeys extends keyof M = never
> =
    TransformKeys<
        M,
        Extract<OmitKeys | CreateRequestBodyOmittedKeysT, keyof M>,
        OptionalKeys,
        RequiredKeys
    >
// Omit<M, OmitKeys | CreateRequestBodyOmittedKeysT>


const createResponseContentOmittedKeys: Array<keyof AppModelDTO> = [ "deletedAt", "updatedAt" ]
type CreateResponseContentOmittedKeysT = "deletedAt" | "updatedAt" | DTOKeys
type CreateResponseContentOptionalKeysT = "updatedAt"
type CreateResponseContent<
    M,
    OmitKeys extends keyof M = never,
    OptionalKeys extends keyof M = never,
    RequiredKeys extends keyof M = never
> =
    TransformKeys<
        M,
        Extract<OmitKeys | CreateResponseContentOmittedKeysT, keyof M>,
        Extract<OptionalKeys | CreateResponseContentOptionalKeysT, keyof M>,
        RequiredKeys
    >

/** Represents the {@link DataResponseBody} for a successful `create` route response */
type CreateResponseBody<M, MTypeName extends string, OmitKeys extends keyof M = never> =
    DataResponseBody<CreateResponseContent<M, OmitKeys>, MTypeName, CreatedResponseMessageT>

// READ
const readResponseContentOmittedKeys: Array<keyof AppModelDTO> = [ "deletedAt" ]
type ReadResponseContentOmittedKeysT = "deletedAt" | DTOKeys
type ReadResponseContentOptionalKeysT = "updatedAt"
type ReadResponseContent<
    M,
    OmitKeys extends keyof M = never,
    OptionalKeys extends keyof M = never,
    RequiredKeys extends keyof M = never
> =
    TransformKeys<
        M,
        Extract<OmitKeys | ReadResponseContentOmittedKeysT, keyof M>,
        Extract<OptionalKeys | ReadResponseContentOptionalKeysT, keyof M>,
        RequiredKeys
    >

/** Represents the {@link DataResponseBody} for a successful `get` route response */
type ReadResponseBody<M, MTypeName extends string, OmitKeys extends keyof M = never> =
    DataResponseBody<ReadResponseContent<M, OmitKeys>, MTypeName, FoundResponseMessageT>

// READ Multiple
type ReadResponseContentArray<M, OmitKeys extends keyof M = never> =
    Array<ReadResponseContent<M, OmitKeys>>

/** Represents the {@link DataResponseBody} for a successful `getAll` route response */
type ReadResponseBodyArray<M, MTypeName extends string, OmitKeys extends keyof M = never> =
    DataResponseBody<ReadResponseContentArray<M, OmitKeys>, MTypeName, FoundResponseMessageT>


// UPDATE
const updateRequestBodyOmittedKeys: Array<keyof AppModelDTO> = [ "createdAt", "updatedAt", "deletedAt", "id" ]
type UpdateRequestBodyOmittedKeysT = "createdAt" | "updatedAt" | "deletedAt" | "id" | DTOKeys
/** Represents the {@link DataResponseBody} for a successful `update` route response */
type UpdateRequestBody<
    M,
    OmitKeys extends keyof M = never,
    OptionalKeys extends keyof M = never,
    RequiredKeys extends keyof M = never
> =
    // Partial<Omit<M, OmitKeys | UpdateRequestBodyOmittedKeysT>>
    TransformKeys<
        Partial<M>,
        Extract<OmitKeys | UpdateRequestBodyOmittedKeysT, keyof M>,
        OptionalKeys,
        RequiredKeys
    >

const updateResponseContentOmittedKeys: Array<keyof AppModelDTO> = [ "deletedAt" ]
type UpdateResponseContentOmittedKeysT = "deletedAt"
type UpdateResponseContent<
    M,
    OmitKeys extends keyof M = never,
    OptionalKeys extends keyof M = never,
    RequiredKeys extends keyof M = never
> =
    TransformKeys<
        M,
        Extract<OmitKeys | UpdateResponseContentOmittedKeysT, keyof M>,
        OptionalKeys,
        RequiredKeys
    >

type UpdateResponseBody<M, MTypeName extends string, OmitKeys extends keyof M = never> =
    DataResponseBody<UpdateResponseContent<M, OmitKeys>, MTypeName, UpdatedResponseMessageT>


// DELETE
/** Represents the {@link DataResponseBody} for a successful `delete` route response */
type DeleteResponseBody<MTypeName extends string> =
    DataResponseBody<DeletedResponseContent, MTypeName, DeletedResponseMessageT>

/** Represents {@link DeleteResponseBody.data} */
interface DeletedResponseContent {
    id: number
}

// interface DeleteResponseBody<DataTypeName extends string> {
//     message: DeletedResponseMessageT
//     data: DataResponseContent<DeletedDataType, DataTypeName>
// }

export {
    FoundResponse, FoundResponder,
    CreatedReponse, CreatedResponder,
    UpdatedResponse, UpdatedResponder,
    DeletedResponse, DeletedResponder,
    NotFoundResponse, NotFoundResponder,
    ValidationErrorResponse, ValidationErrorResponder,

    createRequestBodyOmittedKeys, createResponseContentOmittedKeys,
    readResponseContentOmittedKeys,
    updateRequestBodyOmittedKeys, updateResponseContentOmittedKeys
}

export type {
    ReadResponseBody, ReadResponseContent,
    ReadResponseBodyArray, ReadResponseContentArray,

    CreateRequestBody,
    CreateResponseBody, CreateResponseContent,
    UpdateRequestBody,
    UpdateResponseBody, UpdateResponseContent,

    DeleteResponseBody, DeletedResponseContent,

    NotFoundMessageT,
    NotFoundResponseBody, NotFoundResponseContent,

    ControllerSuccessResponseMessagesT,
    CreatedResponseMessageT,
    FoundResponseMessageT,
    UpdatedResponseMessageT,
    DeletedResponseMessageT,

    DTOKeys,
    ReadResponseContentOmittedKeysT,
    ReadResponseContentOptionalKeysT,

    CreateRequestBodyOmittedKeysT,
    CreateResponseContentOmittedKeysT,
    CreateResponseContentOptionalKeysT,

    UpdateRequestBodyOmittedKeysT,
    UpdateResponseContentOmittedKeysT,

    // Re-exported
    DataResponseBody,
    ErrorResponseBody,
    ValidationErrorMessageT,
    ValidationErrorResponseBody,
    AuthErrorResponseBody,
    AppModelIdT,
}