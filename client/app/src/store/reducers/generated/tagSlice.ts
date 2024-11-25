/**
 * This file makes and contains a Redux slice/reducer/state/thunks for the TagService from the generated API client
 *
 *
 * The slice state can be accessed like so:
 *   `const { data: tags, status, errors, messages, extraState } = useAppSelector( ( state: RootState ) => state.tags )`
 *
 *
 * The thunks can be dispatched like so:
 *
 * ```
 * const dispatch = useAppDispatch()
 *
 * dispatch(
 *   deleteTag( {
 *     path  : { id: id },
 *     query : { force: false },
 *   } )
 * )
 *   .unwrap()
 *   .then( response => {
 *     console.log( "Tag deleted", response )
 *   } )
 *   .catch( ( err: unknown ) => {
 *     console.log( "Failed to delete tag", err )
 *   } )
 * ```
 *
 * @module
 */
import type {

    // Endpoint options
    GetTagData,
    GetAllTagsData,
    CreateTagData,
    UpdateTagData,
    DeleteTagData,

    // Success responses
    GetTagResponse,
    GetAllTagsResponse,
    CreateTagResponse,
    UpdateTagResponse,
    DeleteTagResponse,

    TagCreateRequest,
    TagUpdateRequest as _TagUpdateRequest, // This is just a Partial<TagCreateRequest>

    // Error responses
    GetTagError as _GetTagError,
    GetAllTagsError as _GetAllTagsError,
    CreateTagError as _CreateTagError,
    UpdateTagError as _UpdateTagError,
    DeleteTagError as _DeleteTagError,

    AuthErrorResponseBody as _AuthErrorResponseBody,
    AuthErrorResponseContent as _AuthErrorResponseContent,

    ValidationErrorResponseBody as _ValidationErrorResponseBody,
    ValidationErrorResponseContent as _ValidationErrorResponseContent,

    NotFoundResponseBody as _NotFoundResponseBody,
    NotFoundResponseContent as _NotFoundResponseContent,

} from "../../../api-client/types.gen.ts"
import { TagService } from "../../../api-client/services.gen.ts"
import { sliceFactory } from "../../storeUtils.ts"
import type { NonUndefined } from "../../../utils/typeUtils.ts"


/** The response body type from this services getOne endpoint - should be the most complete model */
type GetTagServiceReturnType =
    Awaited<ReturnType<typeof TagService.getTag>>["data"]

/** The partialised ItemType to store in the reducers state */
type PartialTagsItemTypeWithID = { id: number } & Partial<NonUndefined<GetTagServiceReturnType>["data"]>;

/** The non partialised version of {@link PartialTagsItemTypeWithID} */
type TagsItemType = NonUndefined<GetTagServiceReturnType>["data"];

/** The request body type from this services create endpoint - contains the CreationAttributes of TagModel */
type CreateTagItemType = TagCreateRequest


const [ slice, thunkMakers, _untypedThunks ] = sliceFactory<TagsItemType, TagService, "Tag">(
    "tag", TagService
)

const { clearState, updateExtraState } = slice.actions

const {
    getTag: getTagThunkMaker,
    getAllTags: getAllTagsThunkMaker,
    createTag: createTagThunkMaker,
    updateTag: updateTagThunkMaker,
    deleteTag: deleteTagThunkMaker,
} = thunkMakers


const getTag = ( opts: GetTagData ): ReturnType<ReturnType<typeof getTagThunkMaker<GetTagData>>> =>
    getTagThunkMaker<GetTagData, GetTagResponse>( )( opts )

const getAllTags = ( opts: GetAllTagsData ): ReturnType<ReturnType<typeof getAllTagsThunkMaker<GetAllTagsData>>> =>
    getAllTagsThunkMaker<GetAllTagsData, GetAllTagsResponse>( )( opts )

const createTag = ( opts: CreateTagData ): ReturnType<ReturnType<typeof createTagThunkMaker<CreateTagData>>> =>
    createTagThunkMaker<CreateTagData, CreateTagResponse>( )( opts )

const updateTag = ( opts: UpdateTagData ): ReturnType<ReturnType<typeof updateTagThunkMaker<UpdateTagData>>> =>
    updateTagThunkMaker<UpdateTagData, UpdateTagResponse>( )( opts )

const deleteTag = ( opts: DeleteTagData ): ReturnType<ReturnType<typeof deleteTagThunkMaker<DeleteTagData>>> =>
    deleteTagThunkMaker<DeleteTagData, DeleteTagResponse>( )( opts )


const tagThunks = { getTag, getAllTags, createTag, updateTag, deleteTag }
const tagsSlice = slice


const localStorageKey = "tagStateStorage"


export {
    tagsSlice,
    tagThunks,
    getTag, getAllTags, createTag, updateTag, deleteTag,

    getTagThunkMaker,
    getAllTagsThunkMaker,
    createTagThunkMaker,
    updateTagThunkMaker,
    deleteTagThunkMaker,

    clearState,
    updateExtraState,

    localStorageKey
}
export type {
    TagsItemType,
    PartialTagsItemTypeWithID as PartialTagsItemType,
    CreateTagItemType
}
export default tagsSlice.reducer