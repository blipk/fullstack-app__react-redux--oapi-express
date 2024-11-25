/**
 * This file contains a component for displaying a list of users with actions, used on the admin pages
 * @module
 */
import React from "react"

import { GrAdd } from "react-icons/gr"

import UsersListItem from "./UsersListItem"
import type { UsersItemType } from "../../../store/reducers/generated/userSlice"
import { useLocation, useNavigate } from "react-router-dom"

/* start:component-unique-imports */
/* end:component-unique-imports */


interface UsersListProps {
    users: UsersItemType[]
}

const UsersList: React.FC<UsersListProps> = ( { users } ) => {

    const location = useLocation()
    const navigate = useNavigate()

    /* start:component-unique-content */
    /* end:component-unique-content */

    const addRoute = location.pathname.includes( "user" ) ? `${location.pathname}/add` : "/user/add"

    return (
        <>
            <div className="users-list-wrapper">
                <div className="flex-row page-header flex-gap-10">
                    <h1>Users List</h1>
                    <button type="button" className="flex-row" onClick={() => { navigate( addRoute ) }}><GrAdd/>New</button>
                </div>

                <div className="users-list">
                    {
                        users.length
                            ? users.map( user => (
                                <UsersListItem key={user.id} user={user} />
                            ) )
                            : <p>There are no users</p>
                    }
                </div>
            </div>
        </>
    )

}

export default UsersList