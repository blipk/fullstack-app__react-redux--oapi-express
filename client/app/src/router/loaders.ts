/**
 * This file contains loaders for the routes made for `react-router-dom` in {@link router/router}
 * @module
 */
import { redirect, type LoaderFunctionArgs } from "react-router-dom"
import type { Options } from "@hey-api/client-axios"

import { store } from "../store/store"
import type { appAsyncThunk } from "../store/storeUtils"

import { clearState } from "../store/reducers/authSlice"

import { getAllBlogs, getBlog } from "../store/reducers/generated/blogSlice"
import { getAllBookings, getBooking } from "../store/reducers/generated/bookingSlice"
import { getAllFeedbacks, getFeedback } from "../store/reducers/generated/feedbackSlice"
import { getAllRoles, getRole } from "../store/reducers/generated/roleSlice"
import { getAllTags, getTag } from "../store/reducers/generated/tagSlice"
import { getAllUsers, getUser } from "../store/reducers/generated/userSlice"
import { getAllBookingTypes, getBookingType } from "../store/reducers/generated/bookingTypeSlice"


/** A `react-router-dom` loader for the /logout route that deletes the auth state */
const logoutAuthUnLoader = (): Response => {
    console.log( "logoutAuthUnLoader" )
    try {
        store.dispatch( clearState() )

        return redirect( "/" )
    } catch ( err: unknown ) {
        console.error( "Logout Action Error:", err )
        return redirect( "/" )
    }
}

/** A `react-router-dom` loader for the /account page that gets the users details and bookings */
const accountDispatcherLoader = async (): Promise<Response | null> => {
    console.log( "accountDispatcherLoader" )

    const { extraState } = store.getState().auth

    const currentUser = extraState.jwtResponse?.user
    if ( !currentUser )
        throw new Error( "Action not permitted without user" )

    try {
        await store.dispatch( getUser( { path: { id: currentUser.id } } ) )
    } catch ( err: unknown ) {
        console.error( "Account Action Error:", err )
        return redirect( "/" )
    }

    // try {
    //     await store.dispatch( getAllBookings( { query: { filters: `{userId: ${currentUser.id}}` } } ) )
    // } catch ( err: unknown ) {
    //     console.error( "Account Action Error:", err )
    //     return redirect( "/" )
    // }

    return null
}

/**
 * A maker/factory function that makes loaders for `react-router-dom` that dispatches a ThunkAction to the Redux store
 *
 * @param loaderThunk - The thunk to dispatch to the store
 * @param thunkOptions - The arguments to pass to the thunk, the options for the generated api client service method
 */
const dispatchLoaderMaker = (
    loaderThunk: ReturnType<typeof appAsyncThunk>,
    thunkOptions?: Options //Parameters<typeof appAsyncThunk>["0"] &
): ( loaderFuncArgs: LoaderFunctionArgs ) => Promise<null> => {
    return async ( { request: _request, params }: LoaderFunctionArgs ) => {

        // If theres a param with an id, extract it and pass it to the thunk/servicemethod args
        const paramsWithIdKeys = Object.keys( params ).filter( key => key.toLowerCase().startsWith( "id" ) )

        if ( paramsWithIdKeys.length > 1 )
            throw new Error( "Params error" )

        const paramWithIdKey = paramsWithIdKeys[ 0 ]
        const idFromParam = Number( params[ paramWithIdKey ] )

        thunkOptions ??= paramWithIdKey ? {} : { query: { limit: 10 } }

        if ( paramWithIdKey )
            thunkOptions = { ...thunkOptions, ...{ path: { id: idFromParam } } }

        console.log( "Dispatching thunk on page loader ", loaderThunk, _request, idFromParam, thunkOptions )

        if ( paramWithIdKey && Number.isNaN( idFromParam ) ) {
            console.log( "Recieved NaN ID - aborting" )
            return null
        }

        await store.dispatch(
            loaderThunk( thunkOptions )
        ).unwrap()

        return null
    }
}


const blogDispatchLoader = dispatchLoaderMaker( getBlog as ReturnType<typeof appAsyncThunk> )
const blogsDispatchLoaderAdmin = dispatchLoaderMaker( getAllBlogs as ReturnType<typeof appAsyncThunk> )
const blogsDispatchLoader = dispatchLoaderMaker(
    getAllBlogs as ReturnType<typeof appAsyncThunk>,
    {
        query: {
            filters: "{\"isPublished\": true}"
        }
    }
)

const bookingDispatchLoader = dispatchLoaderMaker( getBooking as ReturnType<typeof appAsyncThunk> )
const bookingsDispatchLoaderAdmin = dispatchLoaderMaker( getAllBookings as ReturnType<typeof appAsyncThunk> )
const bookingsDispatchLoader = dispatchLoaderMaker( getAllBookings as ReturnType<typeof appAsyncThunk> )

const feedbackDispatchLoader = dispatchLoaderMaker( getFeedback as ReturnType<typeof appAsyncThunk> )
const feedbacksDispatchLoaderAdmin = dispatchLoaderMaker( getAllFeedbacks as ReturnType<typeof appAsyncThunk> )
const feedbacksDispatchLoader = dispatchLoaderMaker(
    getAllFeedbacks as ReturnType<typeof appAsyncThunk>,
    {
        query: {
            filters: "{\"isPublic\": true}"
        }
    }
)

const roleDispatchLoader = dispatchLoaderMaker( getRole as ReturnType<typeof appAsyncThunk> )
const rolesDispatchLoaderAdmin = dispatchLoaderMaker( getAllRoles as ReturnType<typeof appAsyncThunk> )
const rolesDispatchLoader = dispatchLoaderMaker( getAllRoles as ReturnType<typeof appAsyncThunk> )

const tagDispatchLoader = dispatchLoaderMaker( getTag as ReturnType<typeof appAsyncThunk> )
const tagsDispatchLoaderAdmin = dispatchLoaderMaker( getAllTags as ReturnType<typeof appAsyncThunk> )
const tagsDispatchLoader = dispatchLoaderMaker( getAllTags as ReturnType<typeof appAsyncThunk> )

const userDispatchLoader = dispatchLoaderMaker( getUser as ReturnType<typeof appAsyncThunk> )
const usersDispatchLoaderAdmin = dispatchLoaderMaker( getAllUsers as ReturnType<typeof appAsyncThunk> )
const usersDispatchLoader = dispatchLoaderMaker(
    getAllUsers as ReturnType<typeof appAsyncThunk>,
    {
        query: {
            filters: "{\"isStaff\": true}"
        }
    }
)

const bookingTypeDispatchLoader = dispatchLoaderMaker( getBookingType as ReturnType<typeof appAsyncThunk> )
const bookingTypesDispatchLoaderAdmin = dispatchLoaderMaker( getAllBookingTypes as ReturnType<typeof appAsyncThunk> )
const bookingTypesDispatchLoader = dispatchLoaderMaker( getAllBookingTypes as ReturnType<typeof appAsyncThunk> )


const mainPageLoader = async ( loaderFuncArgs: LoaderFunctionArgs ): Promise<null[]> => {
    const results = await Promise.all(
        [ bookingTypesDispatchLoader( loaderFuncArgs ), feedbacksDispatchLoader( loaderFuncArgs ), blogsDispatchLoader( loaderFuncArgs ) ]
    )
    return results
}


export {
    logoutAuthUnLoader,
    accountDispatcherLoader,
    mainPageLoader,

    dispatchLoaderMaker,

    blogDispatchLoader,
    blogsDispatchLoaderAdmin,
    blogsDispatchLoader,

    bookingDispatchLoader,
    bookingsDispatchLoaderAdmin,
    bookingsDispatchLoader,

    feedbackDispatchLoader,
    feedbacksDispatchLoaderAdmin,
    feedbacksDispatchLoader,

    roleDispatchLoader,
    rolesDispatchLoaderAdmin,
    rolesDispatchLoader,

    tagDispatchLoader,
    tagsDispatchLoaderAdmin,
    tagsDispatchLoader,

    userDispatchLoader,
    usersDispatchLoaderAdmin,
    usersDispatchLoader,

    bookingTypeDispatchLoader,
    bookingTypesDispatchLoaderAdmin,
    bookingTypesDispatchLoader,
}