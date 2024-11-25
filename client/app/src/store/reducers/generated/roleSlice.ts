/**
 * This file makes and contains a Redux slice/reducer/state/thunks for the RoleService from the generated API client
 *
 *
 * The slice state can be accessed like so:
 *   `const { data: roles, status, errors, messages, extraState } = useAppSelector( ( state: RootState ) => state.roles )`
 *
 *
 * The thunks can be dispatched like so:
 *
 * ```
 * const dispatch = useAppDispatch()
 *
 * dispatch(
 *   deleteRole( {
 *     path  : { id: id },
 *     query : { force: false },
 *   } )
 * )
 *   .unwrap()
 *   .then( response => {
 *     console.log( "Role deleted", response )
 *   } )
 *   .catch( ( err: unknown ) => {
 *     console.log( "Failed to delete role", err )
 *   } )
 * ```
 *
 * @module
 */
import type {

    // Endpoint options
    GetRoleData,
    GetAllRolesData,
    CreateRoleData,
    UpdateRoleData,
    DeleteRoleData,

    // Success responses
    GetRoleResponse,
    GetAllRolesResponse,
    CreateRoleResponse,
    UpdateRoleResponse,
    DeleteRoleResponse,

    RoleCreateRequest,
    RoleUpdateRequest as _RoleUpdateRequest, // This is just a Partial<RoleCreateRequest>

    // Error responses
    GetRoleError as _GetRoleError,
    GetAllRolesError as _GetAllRolesError,
    CreateRoleError as _CreateRoleError,
    UpdateRoleError as _UpdateRoleError,
    DeleteRoleError as _DeleteRoleError,

    AuthErrorResponseBody as _AuthErrorResponseBody,
    AuthErrorResponseContent as _AuthErrorResponseContent,

    ValidationErrorResponseBody as _ValidationErrorResponseBody,
    ValidationErrorResponseContent as _ValidationErrorResponseContent,

    NotFoundResponseBody as _NotFoundResponseBody,
    NotFoundResponseContent as _NotFoundResponseContent,

} from "../../../api-client/types.gen.ts"
import { RoleService } from "../../../api-client/services.gen.ts"
import { sliceFactory } from "../../storeUtils.ts"
import type { NonUndefined } from "../../../utils/typeUtils.ts"


/** The response body type from this services getOne endpoint - should be the most complete model */
type GetRoleServiceReturnType =
    Awaited<ReturnType<typeof RoleService.getRole>>["data"]

/** The partialised ItemType to store in the reducers state */
type PartialRolesItemTypeWithID = { id: number } & Partial<NonUndefined<GetRoleServiceReturnType>["data"]>;

/** The non partialised version of {@link PartialRolesItemTypeWithID} */
type RolesItemType = NonUndefined<GetRoleServiceReturnType>["data"];

/** The request body type from this services create endpoint - contains the CreationAttributes of RoleModel */
type CreateRoleItemType = RoleCreateRequest


const [ slice, thunkMakers, _untypedThunks ] = sliceFactory<RolesItemType, RoleService, "Role">(
    "role", RoleService
)

const { clearState, updateExtraState } = slice.actions

const {
    getRole: getRoleThunkMaker,
    getAllRoles: getAllRolesThunkMaker,
    createRole: createRoleThunkMaker,
    updateRole: updateRoleThunkMaker,
    deleteRole: deleteRoleThunkMaker,
} = thunkMakers


const getRole = ( opts: GetRoleData ): ReturnType<ReturnType<typeof getRoleThunkMaker<GetRoleData>>> =>
    getRoleThunkMaker<GetRoleData, GetRoleResponse>( )( opts )

const getAllRoles = ( opts: GetAllRolesData ): ReturnType<ReturnType<typeof getAllRolesThunkMaker<GetAllRolesData>>> =>
    getAllRolesThunkMaker<GetAllRolesData, GetAllRolesResponse>( )( opts )

const createRole = ( opts: CreateRoleData ): ReturnType<ReturnType<typeof createRoleThunkMaker<CreateRoleData>>> =>
    createRoleThunkMaker<CreateRoleData, CreateRoleResponse>( )( opts )

const updateRole = ( opts: UpdateRoleData ): ReturnType<ReturnType<typeof updateRoleThunkMaker<UpdateRoleData>>> =>
    updateRoleThunkMaker<UpdateRoleData, UpdateRoleResponse>( )( opts )

const deleteRole = ( opts: DeleteRoleData ): ReturnType<ReturnType<typeof deleteRoleThunkMaker<DeleteRoleData>>> =>
    deleteRoleThunkMaker<DeleteRoleData, DeleteRoleResponse>( )( opts )


const roleThunks = { getRole, getAllRoles, createRole, updateRole, deleteRole }
const rolesSlice = slice


const localStorageKey = "roleStateStorage"


export {
    rolesSlice,
    roleThunks,
    getRole, getAllRoles, createRole, updateRole, deleteRole,

    getRoleThunkMaker,
    getAllRolesThunkMaker,
    createRoleThunkMaker,
    updateRoleThunkMaker,
    deleteRoleThunkMaker,

    clearState,
    updateExtraState,

    localStorageKey
}
export type {
    RolesItemType,
    PartialRolesItemTypeWithID as PartialRolesItemType,
    CreateRoleItemType
}
export default rolesSlice.reducer