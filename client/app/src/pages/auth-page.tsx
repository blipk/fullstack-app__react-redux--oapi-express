/**
 * This page is the element for the login and register routes
 * @module
 */

import React, { useEffect } from "react"

import { useLocation, useNavigate } from "react-router-dom"

import { useAppSelector, type RootState } from "../store/store.ts"
import { SliceStatus, type ApiErrorsTypeIntersection } from "../store/storeTypes.ts"

import { errorsElement, loader } from "../components/common.tsx"
import Login from "../components/auth/Login.tsx"
import Register from "../components/auth/Register.tsx"


const AuthPage: React.FC = () => {

    const navigate = useNavigate()
    const location = useLocation()

    const isLogin = location.pathname.toLowerCase() === "/login"
    const isRegister = location.pathname.toLowerCase() === "/join"

    const searchParams = Object.fromEntries( new URLSearchParams( location.search ).entries() )


    const { data: _registerResponse, status, errors, messages, extraState } = useAppSelector( ( state: RootState ) => state.auth )

    const accessToken = extraState.jwtResponse?.access_token
    const currentUser = extraState.jwtResponse?.user

    const recentFailureMessages = messages.filter(
        ( message ) => message.fromThunkState === "rejected" && ( new Date().getTime() - message.createdAt < 900 )
    )
    const displayFailureMessage = recentFailureMessages[ recentFailureMessages.length - 1 ]?.message

    useEffect( () => {
        if ( accessToken && !Object.keys( searchParams ).length )
            navigate( "/", { replace: true } )
    }, [ navigate, extraState, currentUser ] )

    if ( accessToken ) return <></>

    const componentContent =
    isRegister
        ? <Register/>
        : <Login/>

    return (
        <>
            {status === SliceStatus.Loading ? loader : null}
            {
                status === SliceStatus.Failed && displayFailureMessage && errors
                    ? errorsElement( displayFailureMessage, errors as ApiErrorsTypeIntersection[] )
                    : null
            }

            {componentContent}
        </>
    )
}

export default AuthPage