/**
 * This page is the element for the various admin routes for Blog's.
 * It handles redux store errors and sets up the correct component to display for CRUD actions.
 *
 * Data loading is handled via redux dispatch in the route loader in {@link routes/loader.ts}
 * Data posting is handled via redux dispatch in the route action in {@link routes/action.ts}
 *
 * @module
 */
import React, { useEffect } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"

import { useAppSelector } from "../store/store"
import type { RootState } from "../store/store"


const AdminPage: React.FC = () => {

    const navigate = useNavigate()
    const location = useLocation()

    const isDashboard = location.pathname === "/admin" || location.pathname === "/admin/"

    const { extraState } = useAppSelector( ( state: RootState ) => state.auth )

    const isAuthorized = extraState.jwtResponse?.access_token && ( extraState.jwtResponse.user.isAdmin || extraState.jwtResponse.user.isStaff )

    useEffect( () => {

        const isAuthorized = extraState.jwtResponse?.access_token && ( extraState.jwtResponse.user.isAdmin || extraState.jwtResponse.user.isStaff )
        if ( !isAuthorized ) navigate( "/" )

    }, [ navigate, extraState ] )

    if ( !isAuthorized ) return <></>

    return (
        <>
            {isDashboard && <p>TODO: Admin Dashboard - use header navlinks</p>}
            {!isDashboard && <Outlet />}
        </>
    )
}

export default AdminPage