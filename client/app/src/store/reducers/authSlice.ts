/**
 * This file generates and contains a Redux slice for the AuthService from the generated API client
 *
 * @module
 */
import type {

    // Endpoint options
    LoginData,
    RegisterData,

    // Success responses
    LoginResponse as _LoginResponse,
    RegisterResponse,

    // Error responses
    RegisterError as _RegisterError,
    LoginError as _LoginError,

    AuthErrorResponseBody as _AuthErrorResponseBody,
    AuthErrorResponseContent as _AuthErrorResponseContent,

    ValidationErrorResponseBody as _ValidationErrorResponseBody,
    ValidationErrorResponseContent as _ValidationErrorResponseContent,

    NotFoundResponseBody as _NotFoundResponseBody,
    NotFoundResponseContent as _NotFoundResponseContent,

} from "../../api-client/types.gen.ts"
import { AuthService } from "../../api-client/services.gen.ts"
import { sliceFactory } from "../storeUtils.ts"
import type { NonUndefined } from "../../utils/typeUtils.ts"
import type { OAuth2TokenResponseBody } from "../../api-client/types.gen.ts.bak.ts"


/** The response body type from this services main endpoint - should be the most complete model */
type AuthServiceReturnType =
    Awaited<ReturnType<typeof AuthService.register>>["data"]

/** The ItemType to store in the reducers state */
type AuthItemsType = { id: number } & Partial<NonUndefined<AuthServiceReturnType>["data"]>;

/** The interface for extra state for the auth slice, holds the JWT token response - any user is held in the `data` from the sliceFactory */
interface AuthExtraState extends Record<string, unknown> {
    jwtResponse: OAuth2TokenResponseBody | undefined
}

/** The default extra state for the auth slice, holds the JWT token response - any user is held in the `data` from the sliceFactory */
const authExtraState: AuthExtraState = {
    jwtResponse: undefined,
}

/** This tells the slice factory to store the login thunk result into state.extraState.jwtResponse rather than state.data */
const authThunkStateTargets = {
    "auth/login": "jwtResponse"
}

const [ slice, thunkMakers, _untypedThunks ] = sliceFactory<AuthItemsType, AuthService, "Auth", "login" | "register", AuthExtraState>(
    "auth", AuthService, authExtraState, authThunkStateTargets
)

const { clearState, updateExtraState } = slice.actions

const {
    loginAuth: loginAuthThunkMaker,
    registerAuth: registerAuthThunkMaker,
} = thunkMakers


const loginAuth = ( opts: LoginData ): ReturnType<ReturnType<typeof loginAuthThunkMaker<LoginData>>> =>
    loginAuthThunkMaker<LoginData>( )( opts )

const registerAuth = ( opts: RegisterData ): ReturnType<ReturnType<typeof registerAuthThunkMaker<RegisterData>>> =>
    registerAuthThunkMaker<RegisterData, RegisterResponse>( )( opts )


const authThunks = { loginAuth, registerAuth }
const authSlice = slice


const localStorageKey = "authStateStorage"


export {
    authSlice,
    authThunks,
    loginAuth,
    registerAuth,

    loginAuthThunkMaker,
    registerAuthThunkMaker,

    clearState,
    updateExtraState,

    localStorageKey
}
export type { AuthItemsType, AuthExtraState }
export default authSlice.reducer