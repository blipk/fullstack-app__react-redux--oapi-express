/**
 * This file makes and contains a Redux slice/reducer/state/thunks for the BookingTypeService from the generated API client
 *
 *
 * The slice state can be accessed like so:
 *   `const { data: bookingTypes, status, errors, messages, extraState } = useAppSelector( ( state: RootState ) => state.bookingTypes )`
 *
 *
 * The thunks can be dispatched like so:
 *
 * ```
 * const dispatch = useAppDispatch()
 *
 * dispatch(
 *   deleteBookingType( {
 *     path  : { id: id },
 *     query : { force: false },
 *   } )
 * )
 *   .unwrap()
 *   .then( response => {
 *     console.log( "BookingType deleted", response )
 *   } )
 *   .catch( ( err: unknown ) => {
 *     console.log( "Failed to delete bookingType", err )
 *   } )
 * ```
 *
 * @module
 */
import type {

    // Endpoint options
    GetBookingTypeData,
    GetAllBookingTypesData,
    CreateBookingTypeData,
    UpdateBookingTypeData,
    DeleteBookingTypeData,

    // Success responses
    GetBookingTypeResponse,
    GetAllBookingTypesResponse,
    CreateBookingTypeResponse,
    UpdateBookingTypeResponse,
    DeleteBookingTypeResponse,

    BookingTypeCreateRequest,
    BookingTypeUpdateRequest as _BookingTypeUpdateRequest, // This is just a Partial<BookingTypeCreateRequest>

    // Error responses
    GetBookingTypeError as _GetBookingTypeError,
    GetAllBookingTypesError as _GetAllBookingTypesError,
    CreateBookingTypeError as _CreateBookingTypeError,
    UpdateBookingTypeError as _UpdateBookingTypeError,
    DeleteBookingTypeError as _DeleteBookingTypeError,

    AuthErrorResponseBody as _AuthErrorResponseBody,
    AuthErrorResponseContent as _AuthErrorResponseContent,

    ValidationErrorResponseBody as _ValidationErrorResponseBody,
    ValidationErrorResponseContent as _ValidationErrorResponseContent,

    NotFoundResponseBody as _NotFoundResponseBody,
    NotFoundResponseContent as _NotFoundResponseContent,

} from "../../../api-client/types.gen.ts"
import { BookingTypeService } from "../../../api-client/services.gen.ts"
import { sliceFactory } from "../../storeUtils.ts"
import type { NonUndefined } from "../../../utils/typeUtils.ts"


/** The response body type from this services getOne endpoint - should be the most complete model */
type GetBookingTypeServiceReturnType =
    Awaited<ReturnType<typeof BookingTypeService.getBookingType>>["data"]

/** The partialised ItemType to store in the reducers state */
type PartialBookingTypesItemTypeWithID = { id: number } & Partial<NonUndefined<GetBookingTypeServiceReturnType>["data"]>;

/** The non partialised version of {@link PartialBookingTypesItemTypeWithID} */
type BookingTypesItemType = NonUndefined<GetBookingTypeServiceReturnType>["data"];

/** The request body type from this services create endpoint - contains the CreationAttributes of BookingTypeModel */
type CreateBookingTypeItemType = BookingTypeCreateRequest


const [ slice, thunkMakers, _untypedThunks ] = sliceFactory<BookingTypesItemType, BookingTypeService, "BookingType">(
    "bookingType", BookingTypeService
)

const { clearState, updateExtraState } = slice.actions

const {
    getBookingType: getBookingTypeThunkMaker,
    getAllBookingTypes: getAllBookingTypesThunkMaker,
    createBookingType: createBookingTypeThunkMaker,
    updateBookingType: updateBookingTypeThunkMaker,
    deleteBookingType: deleteBookingTypeThunkMaker,
} = thunkMakers


const getBookingType = ( opts: GetBookingTypeData ): ReturnType<ReturnType<typeof getBookingTypeThunkMaker<GetBookingTypeData>>> =>
    getBookingTypeThunkMaker<GetBookingTypeData, GetBookingTypeResponse>( )( opts )

const getAllBookingTypes = ( opts: GetAllBookingTypesData ): ReturnType<ReturnType<typeof getAllBookingTypesThunkMaker<GetAllBookingTypesData>>> =>
    getAllBookingTypesThunkMaker<GetAllBookingTypesData, GetAllBookingTypesResponse>( )( opts )

const createBookingType = ( opts: CreateBookingTypeData ): ReturnType<ReturnType<typeof createBookingTypeThunkMaker<CreateBookingTypeData>>> =>
    createBookingTypeThunkMaker<CreateBookingTypeData, CreateBookingTypeResponse>( )( opts )

const updateBookingType = ( opts: UpdateBookingTypeData ): ReturnType<ReturnType<typeof updateBookingTypeThunkMaker<UpdateBookingTypeData>>> =>
    updateBookingTypeThunkMaker<UpdateBookingTypeData, UpdateBookingTypeResponse>( )( opts )

const deleteBookingType = ( opts: DeleteBookingTypeData ): ReturnType<ReturnType<typeof deleteBookingTypeThunkMaker<DeleteBookingTypeData>>> =>
    deleteBookingTypeThunkMaker<DeleteBookingTypeData, DeleteBookingTypeResponse>( )( opts )


const bookingTypeThunks = { getBookingType, getAllBookingTypes, createBookingType, updateBookingType, deleteBookingType }
const bookingTypesSlice = slice


const localStorageKey = "bookingTypeStateStorage"


export {
    bookingTypesSlice,
    bookingTypeThunks,
    getBookingType, getAllBookingTypes, createBookingType, updateBookingType, deleteBookingType,

    getBookingTypeThunkMaker,
    getAllBookingTypesThunkMaker,
    createBookingTypeThunkMaker,
    updateBookingTypeThunkMaker,
    deleteBookingTypeThunkMaker,

    clearState,
    updateExtraState,

    localStorageKey
}
export type {
    BookingTypesItemType,
    PartialBookingTypesItemTypeWithID as PartialBookingTypesItemType,
    CreateBookingTypeItemType
}
export default bookingTypesSlice.reducer