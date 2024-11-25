/**
 * This file contains interfaces and types for the applications Redux store's (slices, thunks and reducers) and its integration with the API service
 * @module
 */
import type { Action, AsyncThunkAction, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit"
import type { Options } from "@hey-api/client-axios"


// import type { RootState } from "./store"
import type { AtLeastOne } from "../utils/typeUtils"
import type { BaseInputOptions } from "./storeUtils"
import type { AuthErrorResponseContent, NotFoundResponseContent, ValidationErrorResponseContent } from "../api-client/types.gen"


/** API **/

/** The type for API error response content */
type ApiErrorsTypeUnion = Partial<AuthErrorResponseContent | ValidationErrorResponseContent | NotFoundResponseContent>

/** The type for API error response content */
type ApiErrorsTypeIntersection = Partial<AuthErrorResponseContent & ValidationErrorResponseContent & NotFoundResponseContent>


/** This is ErrorResponseBody from API  */
interface AppThunkErrors {
    message: string,
    errors: ApiErrorsTypeUnion[]
}

/** This is for Payload on Fulfilled only - `PayloadAction` `P` generic - Same as `DataResponseBody` from API  */
type MetaData = Record<string, unknown> & {dataType: string}

/** This is for the succesful DataResponseBody responses from the API */
interface ApiDataResponseBody<DataType extends Record<string, unknown>> {
    data: AtLeastOne<DataType> | Array<AtLeastOne<DataType>>;
    message: string;
    metadata?: MetaData
}



/** Redux **/

// https://redux-toolkit.js.org/usage/usage-with-typescript
interface AsyncThunkConfig {
    state?: unknown;
    dispatch?: ThunkDispatch<unknown, unknown, UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}

type AppAsyncThunkAction =
    AsyncThunkAction<Record<string | number, unknown>, Options<unknown, false> | BaseInputOptions<false>, AppAsyncThunkConfig> & Action

/** Typing interface for the applications Redux AsyncThunkConfig */
interface AppAsyncThunkConfig extends AsyncThunkConfig {
    /** return type for `thunkApi.getState` */
    state?: unknown; // unknown
    /** type for `thunkApi.dispatch` */
    // dispatch?: ThunkDispatch<RootState, unknown, AppAsyncThunkAction>; // This leads to circular refs
    dispatch?: ThunkDispatch<unknown, unknown, AppAsyncThunkAction>;
    /** type of the `extra` argument for the thunk middleware, which will be passed in as `thunkApi.extra` */
    extra?: unknown;
    /** type to be passed into `rejectWithValue`'s first argument that will end up on `rejectedAction.payload` */
    rejectValue: AppThunkErrors;
    /** return type of the `serializeError` option callback */
    serializedErrorType?: unknown;
    /** type to be returned from the `getPendingMeta` option callback & merged into `pendingAction.meta` */
    pendingMeta: unknown;
    /** type to be passed into the second argument of `fulfillWithValue` to finally be merged into `fulfilledAction.meta` */
    fulfilledMeta: unknown;
    /** type to be passed into the second argument of `rejectWithValue` to finally be merged into `rejectedAction.meta` */
    rejectedMeta: unknown;
}

/** Enum for the status of a redux slice's currently dispatched AsyncThunkAction */
enum SliceStatus {
    Idle, Loading, Succeeded, Failed
}

/** Interface for {@link AppSliceState.messages} */
interface SliceStateMessage {
    thunkTypePrefix: string,
    fromThunkState: "pending" | "fulfilled" | "rejected"
    message: string,
    errors?: ApiErrorsTypeUnion[]

    createdAt: number,
}

/** Generic interface for slice state that fits the API schema */
interface AppSliceState<ItemsType, ExtraStateType extends Record<string, unknown> = Record<string, unknown>> {
    // These are from our API

    // This is from `DataResponseBody`
    data: ItemsType[], //Array<Partial<ItemsType>>
    dataMetadata?: MetaData,

    // This is from `ErrorResponseBody`
    errors?: ApiErrorsTypeUnion[],

    // Messages for each AsyncThunk/Action
    messages: SliceStateMessage[]


    // These are from Redux PayloadAction
    meta?: unknown
    type?: string
    status: SliceStatus,

    // Utility Functions
    // selectByIdFunc?: ( id: number ) => ItemsType | undefined

    extraState: ExtraStateType
}


export { SliceStatus }
export type {
    AsyncThunkConfig,
    AppAsyncThunkConfig,
    AppAsyncThunkAction,

    ApiDataResponseBody,
    MetaData,

    ApiErrorsTypeUnion,
    ApiErrorsTypeIntersection,
    AppThunkErrors,

    AppSliceState,
    SliceStateMessage,
}