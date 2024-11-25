/**
 * This page is the element for the various admin routes for User's.
 * It handles redux store errors and sets up the correct component to display for CRUD actions.
 *
 * Data loading is handled via redux dispatch in the route loader in {@link router/loader}
 * Data posting is handled via redux dispatch in the route action in {@link router/action}
 *
 * @module
 */
import React from "react"

import { useParams, useLocation } from "react-router-dom"

import { useAppSelector, type RootState } from "../../../store/store"
import { SliceStatus, type ApiErrorsTypeIntersection } from "../../../store/storeTypes"

import { errorsElement, loader } from "../../common"

import "./users-style.scss"
import UsersList from "./UsersList"
import UserView from "./UserView"
import UserAddEdit from "./UserAddEdit"


const UsersAdminPage: React.FC = () => {

    const params = useParams()
    const location = useLocation()
    const { idView, idEdit, idAdd } = params

    if ( idView && idEdit )
        throw new Error( "Impossible route error" )

    const { data: users, status, errors, messages } = useAppSelector( ( state: RootState ) => state.users )

    const recentFailureMessages = messages.filter(
        ( message ) => message.fromThunkState === "rejected" && ( new Date().getTime() - message.createdAt < 900 )
    )
    const displayFailureMessage = recentFailureMessages[ recentFailureMessages.length - 1 ]?.message

    const targetUser = users.find( b => [ idView, idEdit, idAdd ].includes( String( b.id ) ) ) || users[ 0 ]

    const isView = idView && idView !== "add"
    const isAdd = idAdd || idView === "add" || location.pathname.endsWith( "/add" )
    const isEdit = idEdit !== undefined

    const componentContent =
        isView
            ? Boolean( users.length ) && <UserView user={targetUser}/>
            : isEdit
                ? Boolean( users.length ) && <UserAddEdit user={targetUser}/>
                : isAdd
                    ? <UserAddEdit/>
                    : Boolean( users.length ) && <UsersList users={users}/>

    return (
        <>
            {status === SliceStatus.Loading ? loader : null}
            {
                displayFailureMessage && errors
                    ? errorsElement( displayFailureMessage, errors as ApiErrorsTypeIntersection[] )
                    : null
            }
            {componentContent}
        </>
    )
}

export default UsersAdminPage
