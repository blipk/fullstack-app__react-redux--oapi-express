/**
 * This file makes and contains a Redux slice/reducer/state/thunks for the FeedbackService from the generated API client
 *
 *
 * The slice state can be accessed like so:
 *   `const { data: feedbacks, status, errors, messages, extraState } = useAppSelector( ( state: RootState ) => state.feedbacks )`
 *
 *
 * The thunks can be dispatched like so:
 *
 * ```
 * const dispatch = useAppDispatch()
 *
 * dispatch(
 *   deleteFeedback( {
 *     path  : { id: id },
 *     query : { force: false },
 *   } )
 * )
 *   .unwrap()
 *   .then( response => {
 *     console.log( "Feedback deleted", response )
 *   } )
 *   .catch( ( err: unknown ) => {
 *     console.log( "Failed to delete feedback", err )
 *   } )
 * ```
 *
 * @module
 */
import type {

    // Endpoint options
    GetFeedbackData,
    GetAllFeedbacksData,
    CreateFeedbackData,
    UpdateFeedbackData,
    DeleteFeedbackData,

    // Success responses
    GetFeedbackResponse,
    GetAllFeedbacksResponse,
    CreateFeedbackResponse,
    UpdateFeedbackResponse,
    DeleteFeedbackResponse,

    FeedbackCreateRequest,
    FeedbackUpdateRequest as _FeedbackUpdateRequest, // This is just a Partial<FeedbackCreateRequest>

    // Error responses
    GetFeedbackError as _GetFeedbackError,
    GetAllFeedbacksError as _GetAllFeedbacksError,
    CreateFeedbackError as _CreateFeedbackError,
    UpdateFeedbackError as _UpdateFeedbackError,
    DeleteFeedbackError as _DeleteFeedbackError,

    AuthErrorResponseBody as _AuthErrorResponseBody,
    AuthErrorResponseContent as _AuthErrorResponseContent,

    ValidationErrorResponseBody as _ValidationErrorResponseBody,
    ValidationErrorResponseContent as _ValidationErrorResponseContent,

    NotFoundResponseBody as _NotFoundResponseBody,
    NotFoundResponseContent as _NotFoundResponseContent,

} from "../../../api-client/types.gen.ts"
import { FeedbackService } from "../../../api-client/services.gen.ts"
import { sliceFactory } from "../../storeUtils.ts"
import type { NonUndefined } from "../../../utils/typeUtils.ts"


/** The response body type from this services getOne endpoint - should be the most complete model */
type GetFeedbackServiceReturnType =
    Awaited<ReturnType<typeof FeedbackService.getFeedback>>["data"]

/** The partialised ItemType to store in the reducers state */
type PartialFeedbacksItemTypeWithID = { id: number } & Partial<NonUndefined<GetFeedbackServiceReturnType>["data"]>;

/** The non partialised version of {@link PartialFeedbacksItemTypeWithID} */
type FeedbacksItemType = NonUndefined<GetFeedbackServiceReturnType>["data"];

/** The request body type from this services create endpoint - contains the CreationAttributes of FeedbackModel */
type CreateFeedbackItemType = FeedbackCreateRequest


const [ slice, thunkMakers, _untypedThunks ] = sliceFactory<FeedbacksItemType, FeedbackService, "Feedback">(
    "feedback", FeedbackService
)

const { clearState, updateExtraState } = slice.actions

const {
    getFeedback: getFeedbackThunkMaker,
    getAllFeedbacks: getAllFeedbacksThunkMaker,
    createFeedback: createFeedbackThunkMaker,
    updateFeedback: updateFeedbackThunkMaker,
    deleteFeedback: deleteFeedbackThunkMaker,
} = thunkMakers


const getFeedback = ( opts: GetFeedbackData ): ReturnType<ReturnType<typeof getFeedbackThunkMaker<GetFeedbackData>>> =>
    getFeedbackThunkMaker<GetFeedbackData, GetFeedbackResponse>( )( opts )

const getAllFeedbacks = ( opts: GetAllFeedbacksData ): ReturnType<ReturnType<typeof getAllFeedbacksThunkMaker<GetAllFeedbacksData>>> =>
    getAllFeedbacksThunkMaker<GetAllFeedbacksData, GetAllFeedbacksResponse>( )( opts )

const createFeedback = ( opts: CreateFeedbackData ): ReturnType<ReturnType<typeof createFeedbackThunkMaker<CreateFeedbackData>>> =>
    createFeedbackThunkMaker<CreateFeedbackData, CreateFeedbackResponse>( )( opts )

const updateFeedback = ( opts: UpdateFeedbackData ): ReturnType<ReturnType<typeof updateFeedbackThunkMaker<UpdateFeedbackData>>> =>
    updateFeedbackThunkMaker<UpdateFeedbackData, UpdateFeedbackResponse>( )( opts )

const deleteFeedback = ( opts: DeleteFeedbackData ): ReturnType<ReturnType<typeof deleteFeedbackThunkMaker<DeleteFeedbackData>>> =>
    deleteFeedbackThunkMaker<DeleteFeedbackData, DeleteFeedbackResponse>( )( opts )


const feedbackThunks = { getFeedback, getAllFeedbacks, createFeedback, updateFeedback, deleteFeedback }
const feedbacksSlice = slice


const localStorageKey = "feedbackStateStorage"


export {
    feedbacksSlice,
    feedbackThunks,
    getFeedback, getAllFeedbacks, createFeedback, updateFeedback, deleteFeedback,

    getFeedbackThunkMaker,
    getAllFeedbacksThunkMaker,
    createFeedbackThunkMaker,
    updateFeedbackThunkMaker,
    deleteFeedbackThunkMaker,

    clearState,
    updateExtraState,

    localStorageKey
}
export type {
    FeedbacksItemType,
    PartialFeedbacksItemTypeWithID as PartialFeedbacksItemType,
    CreateFeedbackItemType
}
export default feedbacksSlice.reducer