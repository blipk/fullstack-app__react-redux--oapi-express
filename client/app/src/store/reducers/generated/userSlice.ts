/**
 * This file makes and contains a Redux slice/reducer/state/thunks for the UserService from the generated API client
 *
 *
 * The slice state can be accessed like so:
 *   `const { data: users, status, errors, messages, extraState } = useAppSelector( ( state: RootState ) => state.users )`
 *
 *
 * The thunks can be dispatched like so:
 *
 * ```
 * const dispatch = useAppDispatch()
 *
 * dispatch(
 *   deleteUser( {
 *     path  : { id: id },
 *     query : { force: false },
 *   } )
 * )
 *   .unwrap()
 *   .then( response => {
 *     console.log( "User deleted", response )
 *   } )
 *   .catch( ( err: unknown ) => {
 *     console.log( "Failed to delete user", err )
 *   } )
 * ```
 *
 * @module
 */
import type {

    // Endpoint options
    GetUserData,
    GetAllUsersData,
    CreateUserData,
    UpdateUserData,
    DeleteUserData,

    // Success responses
    GetUserResponse,
    GetAllUsersResponse,
    CreateUserResponse,
    UpdateUserResponse,
    DeleteUserResponse,

    UserCreateRequest,
    UserUpdateRequest as _UserUpdateRequest, // This is just a Partial<UserCreateRequest>

    // Error responses
    GetUserError as _GetUserError,
    GetAllUsersError as _GetAllUsersError,
    CreateUserError as _CreateUserError,
    UpdateUserError as _UpdateUserError,
    DeleteUserError as _DeleteUserError,

    AuthErrorResponseBody as _AuthErrorResponseBody,
    AuthErrorResponseContent as _AuthErrorResponseContent,

    ValidationErrorResponseBody as _ValidationErrorResponseBody,
    ValidationErrorResponseContent as _ValidationErrorResponseContent,

    NotFoundResponseBody as _NotFoundResponseBody,
    NotFoundResponseContent as _NotFoundResponseContent,

} from "../../../api-client/types.gen.ts"
import { UserService } from "../../../api-client/services.gen.ts"
import { sliceFactory } from "../../storeUtils.ts"
import type { NonUndefined } from "../../../utils/typeUtils.ts"


/** The response body type from this services getOne endpoint - should be the most complete model */
type GetUserServiceReturnType =
    Awaited<ReturnType<typeof UserService.getUser>>["data"]

/** The partialised ItemType to store in the reducers state */
type PartialUsersItemTypeWithID = { id: number } & Partial<NonUndefined<GetUserServiceReturnType>["data"]>;

/** The non partialised version of {@link PartialUsersItemTypeWithID} */
type UsersItemType = NonUndefined<GetUserServiceReturnType>["data"];

/** The request body type from this services create endpoint - contains the CreationAttributes of UserModel */
type CreateUserItemType = UserCreateRequest


const [ slice, thunkMakers, _untypedThunks ] = sliceFactory<UsersItemType, UserService, "User">(
    "user", UserService
)

const { clearState, updateExtraState } = slice.actions

const {
    getUser: getUserThunkMaker,
    getAllUsers: getAllUsersThunkMaker,
    createUser: createUserThunkMaker,
    updateUser: updateUserThunkMaker,
    deleteUser: deleteUserThunkMaker,
} = thunkMakers


const getUser = ( opts: GetUserData ): ReturnType<ReturnType<typeof getUserThunkMaker<GetUserData>>> =>
    getUserThunkMaker<GetUserData, GetUserResponse>( )( opts )

const getAllUsers = ( opts: GetAllUsersData ): ReturnType<ReturnType<typeof getAllUsersThunkMaker<GetAllUsersData>>> =>
    getAllUsersThunkMaker<GetAllUsersData, GetAllUsersResponse>( )( opts )

const createUser = ( opts: CreateUserData ): ReturnType<ReturnType<typeof createUserThunkMaker<CreateUserData>>> =>
    createUserThunkMaker<CreateUserData, CreateUserResponse>( )( opts )

const updateUser = ( opts: UpdateUserData ): ReturnType<ReturnType<typeof updateUserThunkMaker<UpdateUserData>>> =>
    updateUserThunkMaker<UpdateUserData, UpdateUserResponse>( )( opts )

const deleteUser = ( opts: DeleteUserData ): ReturnType<ReturnType<typeof deleteUserThunkMaker<DeleteUserData>>> =>
    deleteUserThunkMaker<DeleteUserData, DeleteUserResponse>( )( opts )


const userThunks = { getUser, getAllUsers, createUser, updateUser, deleteUser }
const usersSlice = slice


const localStorageKey = "userStateStorage"


export {
    usersSlice,
    userThunks,
    getUser, getAllUsers, createUser, updateUser, deleteUser,

    getUserThunkMaker,
    getAllUsersThunkMaker,
    createUserThunkMaker,
    updateUserThunkMaker,
    deleteUserThunkMaker,

    clearState,
    updateExtraState,

    localStorageKey
}
export type {
    UsersItemType,
    PartialUsersItemTypeWithID as PartialUsersItemType,
    CreateUserItemType
}
export default usersSlice.reducer