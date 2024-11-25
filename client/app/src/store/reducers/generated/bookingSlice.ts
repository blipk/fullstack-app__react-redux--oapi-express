/**
 * This file makes and contains a Redux slice/reducer/state/thunks for the BookingService from the generated API client
 *
 *
 * The slice state can be accessed like so:
 *   `const { data: bookings, status, errors, messages, extraState } = useAppSelector( ( state: RootState ) => state.bookings )`
 *
 *
 * The thunks can be dispatched like so:
 *
 * ```
 * const dispatch = useAppDispatch()
 *
 * dispatch(
 *   deleteBooking( {
 *     path  : { id: id },
 *     query : { force: false },
 *   } )
 * )
 *   .unwrap()
 *   .then( response => {
 *     console.log( "Booking deleted", response )
 *   } )
 *   .catch( ( err: unknown ) => {
 *     console.log( "Failed to delete booking", err )
 *   } )
 * ```
 *
 * @module
 */
import type {

    // Endpoint options
    GetBookingData,
    GetAllBookingsData,
    CreateBookingData,
    UpdateBookingData,
    DeleteBookingData,

    // Success responses
    GetBookingResponse,
    GetAllBookingsResponse,
    CreateBookingResponse,
    UpdateBookingResponse,
    DeleteBookingResponse,

    BookingCreateRequest,
    BookingUpdateRequest as _BookingUpdateRequest, // This is just a Partial<BookingCreateRequest>

    // Error responses
    GetBookingError as _GetBookingError,
    GetAllBookingsError as _GetAllBookingsError,
    CreateBookingError as _CreateBookingError,
    UpdateBookingError as _UpdateBookingError,
    DeleteBookingError as _DeleteBookingError,

    AuthErrorResponseBody as _AuthErrorResponseBody,
    AuthErrorResponseContent as _AuthErrorResponseContent,

    ValidationErrorResponseBody as _ValidationErrorResponseBody,
    ValidationErrorResponseContent as _ValidationErrorResponseContent,

    NotFoundResponseBody as _NotFoundResponseBody,
    NotFoundResponseContent as _NotFoundResponseContent,

} from "../../../api-client/types.gen.ts"
import { BookingService } from "../../../api-client/services.gen.ts"
import { sliceFactory } from "../../storeUtils.ts"
import type { NonUndefined } from "../../../utils/typeUtils.ts"


/** The response body type from this services getOne endpoint - should be the most complete model */
type GetBookingServiceReturnType =
    Awaited<ReturnType<typeof BookingService.getBooking>>["data"]

/** The partialised ItemType to store in the reducers state */
type PartialBookingsItemTypeWithID = { id: number } & Partial<NonUndefined<GetBookingServiceReturnType>["data"]>;

/** The non partialised version of {@link PartialBookingsItemTypeWithID} */
type BookingsItemType = NonUndefined<GetBookingServiceReturnType>["data"];

/** The request body type from this services create endpoint - contains the CreationAttributes of BookingModel */
type CreateBookingItemType = BookingCreateRequest


const [ slice, thunkMakers, _untypedThunks ] = sliceFactory<BookingsItemType, BookingService, "Booking">(
    "booking", BookingService
)

const { clearState, updateExtraState } = slice.actions

const {
    getBooking: getBookingThunkMaker,
    getAllBookings: getAllBookingsThunkMaker,
    createBooking: createBookingThunkMaker,
    updateBooking: updateBookingThunkMaker,
    deleteBooking: deleteBookingThunkMaker,
} = thunkMakers


const getBooking = ( opts: GetBookingData ): ReturnType<ReturnType<typeof getBookingThunkMaker<GetBookingData>>> =>
    getBookingThunkMaker<GetBookingData, GetBookingResponse>( )( opts )

const getAllBookings = ( opts: GetAllBookingsData ): ReturnType<ReturnType<typeof getAllBookingsThunkMaker<GetAllBookingsData>>> =>
    getAllBookingsThunkMaker<GetAllBookingsData, GetAllBookingsResponse>( )( opts )

const createBooking = ( opts: CreateBookingData ): ReturnType<ReturnType<typeof createBookingThunkMaker<CreateBookingData>>> =>
    createBookingThunkMaker<CreateBookingData, CreateBookingResponse>( )( opts )

const updateBooking = ( opts: UpdateBookingData ): ReturnType<ReturnType<typeof updateBookingThunkMaker<UpdateBookingData>>> =>
    updateBookingThunkMaker<UpdateBookingData, UpdateBookingResponse>( )( opts )

const deleteBooking = ( opts: DeleteBookingData ): ReturnType<ReturnType<typeof deleteBookingThunkMaker<DeleteBookingData>>> =>
    deleteBookingThunkMaker<DeleteBookingData, DeleteBookingResponse>( )( opts )


const bookingThunks = { getBooking, getAllBookings, createBooking, updateBooking, deleteBooking }
const bookingsSlice = slice


const localStorageKey = "bookingStateStorage"


export {
    bookingsSlice,
    bookingThunks,
    getBooking, getAllBookings, createBooking, updateBooking, deleteBooking,

    getBookingThunkMaker,
    getAllBookingsThunkMaker,
    createBookingThunkMaker,
    updateBookingThunkMaker,
    deleteBookingThunkMaker,

    clearState,
    updateExtraState,

    localStorageKey
}
export type {
    BookingsItemType,
    PartialBookingsItemTypeWithID as PartialBookingsItemType,
    CreateBookingItemType
}
export default bookingsSlice.reducer