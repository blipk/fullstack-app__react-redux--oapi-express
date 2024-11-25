/**
 * This file contains the applications Redux store and associated typing and functions
 * @module
 */
// https://redux-toolkit.js.org/tutorials/quick-start

import { configureStore } from "@reduxjs/toolkit"
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux"

import authReducer, { localStorageKey, type AuthExtraState, type AuthItemsType } from "./reducers/authSlice.ts"

import blogsReducer from "./reducers/generated/blogSlice.ts"
import bookingsReducer from "./reducers/generated/bookingSlice.ts"
import feedbacksReducer from "./reducers/generated/feedbackSlice.ts"
import rolesReducer from "./reducers/generated/roleSlice.ts"
import tagsReducer from "./reducers/generated/tagSlice.ts"
import usersReducer from "./reducers/generated/userSlice.ts"
import bookingTypesReducer from "./reducers/generated/bookingTypeSlice.ts"

import { client } from "../api-client/services.gen.ts"
import config from "../config/config.ts"
import { loadState, saveState } from "./helpers.ts"
import type { AppSliceState } from "./storeTypes.ts"


/** State we have saved into localStorage to persist past page refresh */
const persistedAuthState = loadState<AppSliceState<AuthItemsType, AuthExtraState>>( localStorageKey )

/** Extra options to pass to `configureStore` - used for passing persisted state when available */
const storeExtraOptions = persistedAuthState
    ? { preloadedState: {
        auth: persistedAuthState
    } }
    : {}

/** The applications main Redux store */
const store = configureStore( {
    reducer: {
        auth         : authReducer,
        blogs        : blogsReducer,
        bookings     : bookingsReducer,
        feedbacks    : feedbacksReducer,
        roles        : rolesReducer,
        tags         : tagsReducer,
        users        : usersReducer,
        bookingTypes : bookingTypesReducer,
    },
    ...storeExtraOptions
} )

/** Add a listener that persist state to local storage */
store.subscribe( () => {
    saveState( localStorageKey, store.getState().auth )
} )


/** Infer the `RootState` type from the store itself */
type RootState = ReturnType<typeof store.getState>

/** Infer the `AppDispatch` type from the store itself */
type AppDispatch = typeof store.dispatch

/** Set up a typed dispatcher for components to use - could also use `useDispatch<AppDispatch>()` */
const useAppDispatch = useDispatch.withTypes<AppDispatch>()

/** Set up a typed selector for components to use  */
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector


/** Configures the API client with any user access tokens from the auth store */
const checkAndSetAccessToken = (): void => {
    const accessToken = store.getState().auth.extraState.jwtResponse?.access_token
    // console.log( "Found access token:", accessToken )
    const headers = accessToken
        ? {
            Authorization: `Bearer ${accessToken}`
        }
        : {}
    client.setConfig( {
        baseURL : config.apiURL,
        headers : headers
    } )
}
checkAndSetAccessToken()


export { store, useAppDispatch, useAppSelector, checkAndSetAccessToken }
export type { RootState, AppDispatch }