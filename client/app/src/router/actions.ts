/**
 * This file contains actions for the routes made for `react-router-dom` in {@link router/router}
 * @module
 */
import { redirect, type ActionFunctionArgs } from "react-router-dom"
import type { Options } from "@hey-api/client-axios"

import { store } from "../store/store"
import type { appAsyncThunk } from "../store/storeUtils"

import { loginAuth, registerAuth } from "../store/reducers/authSlice"
import type { LoginData, RegisterData } from "../api-client"

import { createBlog, updateBlog } from "../store/reducers/generated/blogSlice"
import { createBooking, updateBooking } from "../store/reducers/generated/bookingSlice"
import { createFeedback, updateFeedback } from "../store/reducers/generated/feedbackSlice"
import { createRole, updateRole } from "../store/reducers/generated/roleSlice"
import { createTag, updateTag } from "../store/reducers/generated/tagSlice"
import { createUser, updateUser } from "../store/reducers/generated/userSlice"
import { createBookingType, updateBookingType } from "../store/reducers/generated/bookingTypeSlice"



/** A `react-router-dom` action for the /login POST */
const loginAuthDispatcherAction = async ( { request, params: _params }: ActionFunctionArgs ): Promise<Response> => {
    const formData = await request.formData()
    const updates: LoginData["body"] = Object.fromEntries( formData ) as LoginData["body"]
    const currentURL = new URL( request.url )
    const searchParams = Object.fromEntries( currentURL.searchParams )


    try {
        await store.dispatch(
            loginAuth( { body: updates } )
        ).unwrap()


        const redirectUrl = searchParams.s === "booking"
            ? `/booking/add?p=${searchParams.p || ""}`
            : "/"
        console.log( "authComplete", searchParams, searchParams.s === "booking", redirectUrl )


        return redirect( redirectUrl )
    } catch ( err: unknown ) {
        console.error( "Login Action Error:", err )
        return redirect( "/login" )
    }
}

/** A `react-router-dom` action for the /register POST */
const registerAuthDispatcherAction = async ( { request, params: _params }: ActionFunctionArgs ): Promise<Response> => {
    const formData = await request.formData()
    const updates = Object.fromEntries( formData ) as RegisterData["body"] & { confirmPassword?: string }

    delete updates.confirmPassword

    try {
        await store.dispatch(
            registerAuth( { body: updates } )
        ).unwrap()

        return redirect( "/login?s=new" )
    } catch ( err: unknown ) {
        console.error( "Register Action Error:", err )
        return redirect( "/join" )
    }
}


/**
 * A maker/factory function that makes actions for `react-router-dom` that dispatches a ThunkAction to the Redux store
 *
 * @param actionThunk - The thunk to dispatch to the store
 * @param thunkExtraOptions - The arguments to pass to the thunk, the options for the generated api client service method
 */
const dispatchActionMaker = (
    actionThunk: ReturnType<typeof appAsyncThunk>,
    thunkExtraOptions?: Options
): ( loaderFuncArgs: ActionFunctionArgs ) => Promise<Response> => {
    return async ( { request, params }: ActionFunctionArgs ) => {
        const formData = await request.formData()
        const updates = Object.fromEntries(
            Object.entries( Object.fromEntries( formData ) )
                .map( ( [ key, value ] ) => {
                    // Patch empty string values to undefined
                    if ( key.includes( "Id" ) && value === "" )
                        return [ key, undefined ]
                    if ( key.includes( "Date" ) && value === "" )
                        return [ key, undefined ]
                    if ( key.endsWith( "URL" ) && value === "" )
                        return [ key, undefined ]

                    return [ key, value ]
                } )
        )

        const paramsKeys = Object.keys( params )
        const paramsWithIdKeys = paramsKeys.filter( key => key.toLowerCase().startsWith( "id" ) )

        const paramWithIdKey = paramsWithIdKeys[ 0 ]
        const idFromParam = params[ paramWithIdKey ]

        const idFromBody = updates.id
        const updateId = Number( idFromBody || idFromParam )

        const successURL = updates.successURL

        const currentURL = new URL( request.url )
        const currentPath = currentURL.pathname
        const currentPathSplit = currentPath.split( "/" )

        const successURLMaker = ( redirectId?: string | number ): string => {
            const redirectURL = currentPathSplit.filter(
                ( _, i ) => ( i < currentPathSplit.length - 1 - paramsKeys.length )
            ).join( "/" )

            return String( successURL || `${redirectURL}/${redirectId}?s=new` )
        }


        delete updates.id
        delete updates.successURL

        const thunkOptions = {
            ...thunkExtraOptions,
            ...{ path: { id: updateId }, body: updates }
        }

        console.log( "Dispatching thunk on page action ", actionThunk, updateId, updates, request )

        try {
            type PossiblyWithDataAndId = ( {data?: {id?: number}} & object ) | undefined

            const result = await store.dispatch(
                actionThunk( thunkOptions )
            ).unwrap() as PossiblyWithDataAndId

            const redirectId = result?.data?.id || updateId

            return redirect( successURLMaker( redirectId ) )
        } catch ( err: unknown ) {
            console.error( "dispatchActionMaker Error:", err )
            return redirect( currentPath )
        }
    }
}


const blogsCreateDispatcherAction = dispatchActionMaker( createBlog as ReturnType<typeof appAsyncThunk> )
const blogsUpdateDispatcherAction = dispatchActionMaker( updateBlog as ReturnType<typeof appAsyncThunk> )

const bookingsCreateDispatcherAction = dispatchActionMaker( createBooking as ReturnType<typeof appAsyncThunk> )
const bookingsUpdateDispatcherAction = dispatchActionMaker( updateBooking as ReturnType<typeof appAsyncThunk> )

const feedbacksCreateDispatcherAction = dispatchActionMaker( createFeedback as ReturnType<typeof appAsyncThunk> )
const feedbacksUpdateDispatcherAction = dispatchActionMaker( updateFeedback as ReturnType<typeof appAsyncThunk> )

const rolesCreateDispatcherAction = dispatchActionMaker( createRole as ReturnType<typeof appAsyncThunk> )
const rolesUpdateDispatcherAction = dispatchActionMaker( updateRole as ReturnType<typeof appAsyncThunk> )

const tagsCreateDispatcherAction = dispatchActionMaker( createTag as ReturnType<typeof appAsyncThunk> )
const tagsUpdateDispatcherAction = dispatchActionMaker( updateTag as ReturnType<typeof appAsyncThunk> )

const usersCreateDispatcherAction = dispatchActionMaker( createUser as ReturnType<typeof appAsyncThunk> )
const usersUpdateDispatcherAction = dispatchActionMaker( updateUser as ReturnType<typeof appAsyncThunk> )

const bookingTypesCreateDispatcherAction = dispatchActionMaker( createBookingType as ReturnType<typeof appAsyncThunk> )
const bookingTypesUpdateDispatcherAction = dispatchActionMaker( updateBookingType as ReturnType<typeof appAsyncThunk> )


export {
    loginAuthDispatcherAction,
    registerAuthDispatcherAction,

    dispatchActionMaker,

    blogsCreateDispatcherAction,
    blogsUpdateDispatcherAction,

    bookingsCreateDispatcherAction,
    bookingsUpdateDispatcherAction,

    feedbacksCreateDispatcherAction,
    feedbacksUpdateDispatcherAction,

    rolesCreateDispatcherAction,
    rolesUpdateDispatcherAction,

    tagsCreateDispatcherAction,
    tagsUpdateDispatcherAction,

    usersCreateDispatcherAction,
    usersUpdateDispatcherAction,

    bookingTypesCreateDispatcherAction,
    bookingTypesUpdateDispatcherAction
}