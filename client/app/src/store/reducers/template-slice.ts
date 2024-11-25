/**
 * This file makes and contains a Redux slice/reducer/state/thunks for the BlogService from the generated API client
 *
 *
 * The slice state can be accessed like so:
 *   `const { data: blogs, status, errors, messages, extraState } = useAppSelector( ( state: RootState ) => state.blogs )`
 *
 *
 * The thunks can be dispatched like so:
 *
 * ```
 * const dispatch = useAppDispatch()
 *
 * dispatch(
 *   deleteBlog( {
 *     path  : { id: id },
 *     query : { force: false },
 *   } )
 * )
 *   .unwrap()
 *   .then( response => {
 *     console.log( "Blog deleted", response )
 *   } )
 *   .catch( ( err: unknown ) => {
 *     console.log( "Failed to delete blog", err )
 *   } )
 * ```
 *
 * @module
 */
import type {

    // Endpoint options
    GetBlogData,
    GetAllBlogsData,
    CreateBlogData,
    UpdateBlogData,
    DeleteBlogData,

    // Success responses
    GetBlogResponse,
    GetAllBlogsResponse,
    CreateBlogResponse,
    UpdateBlogResponse,
    DeleteBlogResponse,

    BlogCreateRequest,
    BlogUpdateRequest as _BlogUpdateRequest, // This is just a Partial<BlogCreateRequest>

    // Error responses
    GetBlogError as _GetBlogError,
    GetAllBlogsError as _GetAllBlogsError,
    CreateBlogError as _CreateBlogError,
    UpdateBlogError as _UpdateBlogError,
    DeleteBlogError as _DeleteBlogError,

    AuthErrorResponseBody as _AuthErrorResponseBody,
    AuthErrorResponseContent as _AuthErrorResponseContent,

    ValidationErrorResponseBody as _ValidationErrorResponseBody,
    ValidationErrorResponseContent as _ValidationErrorResponseContent,

    NotFoundResponseBody as _NotFoundResponseBody,
    NotFoundResponseContent as _NotFoundResponseContent,

} from "../../api-client/types.gen.ts"
import { BlogService } from "../../api-client/services.gen.ts"
import { sliceFactory } from "../storeUtils.ts"
import type { NonUndefined } from "../../utils/typeUtils.ts"


/** The response body type from this services getOne endpoint - should be the most complete model */
type GetBlogServiceReturnType =
    Awaited<ReturnType<typeof BlogService.getBlog>>["data"]

/** The partialised ItemType to store in the reducers state */
type PartialBlogsItemTypeWithID = { id: number } & Partial<NonUndefined<GetBlogServiceReturnType>["data"]>;

/** The non partialised version of {@link PartialBlogsItemTypeWithID} */
type BlogsItemType = NonUndefined<GetBlogServiceReturnType>["data"];

/** The request body type from this services create endpoint - contains the CreationAttributes of BlogModel */
type CreateBlogItemType = BlogCreateRequest


const [ slice, thunkMakers, _untypedThunks ] = sliceFactory<BlogsItemType, BlogService, "Blog">(
    "blog", BlogService
)

const { clearState, updateExtraState } = slice.actions

const {
    getBlog: getBlogThunkMaker,
    getAllBlogs: getAllBlogsThunkMaker,
    createBlog: createBlogThunkMaker,
    updateBlog: updateBlogThunkMaker,
    deleteBlog: deleteBlogThunkMaker,
} = thunkMakers


const getBlog = ( opts: GetBlogData ): ReturnType<ReturnType<typeof getBlogThunkMaker<GetBlogData>>> =>
    getBlogThunkMaker<GetBlogData, GetBlogResponse>( )( opts )

const getAllBlogs = ( opts: GetAllBlogsData ): ReturnType<ReturnType<typeof getAllBlogsThunkMaker<GetAllBlogsData>>> =>
    getAllBlogsThunkMaker<GetAllBlogsData, GetAllBlogsResponse>( )( opts )

const createBlog = ( opts: CreateBlogData ): ReturnType<ReturnType<typeof createBlogThunkMaker<CreateBlogData>>> =>
    createBlogThunkMaker<CreateBlogData, CreateBlogResponse>( )( opts )

const updateBlog = ( opts: UpdateBlogData ): ReturnType<ReturnType<typeof updateBlogThunkMaker<UpdateBlogData>>> =>
    updateBlogThunkMaker<UpdateBlogData, UpdateBlogResponse>( )( opts )

const deleteBlog = ( opts: DeleteBlogData ): ReturnType<ReturnType<typeof deleteBlogThunkMaker<DeleteBlogData>>> =>
    deleteBlogThunkMaker<DeleteBlogData, DeleteBlogResponse>( )( opts )


const blogThunks = { getBlog, getAllBlogs, createBlog, updateBlog, deleteBlog }
const blogsSlice = slice


const localStorageKey = "blogStateStorage"


export {
    blogsSlice,
    blogThunks,
    getBlog, getAllBlogs, createBlog, updateBlog, deleteBlog,

    getBlogThunkMaker,
    getAllBlogsThunkMaker,
    createBlogThunkMaker,
    updateBlogThunkMaker,
    deleteBlogThunkMaker,

    clearState,
    updateExtraState,

    localStorageKey
}
export type {
    BlogsItemType,
    PartialBlogsItemTypeWithID as PartialBlogsItemType,
    CreateBlogItemType
}
export default blogsSlice.reducer