/**
 * This file contains a component for displaying a single user as a list item with actions.
 * Used by {@link components/generated/users/UsersList}
 *
 * @module
 */
import React from "react"

import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "../../../store/store"
import { AdminRouteBases, linkBuilder } from "../../../router/navigation"

import { deleteUser, type UsersItemType } from "../../../store/reducers/generated/userSlice"

/* start:component-unique-imports */
import { Link } from "react-router-dom"
import { GrFormView, GrFormEdit, GrFormClose } from "react-icons/gr"
/* end:component-unique-imports */


interface UsersListItemProps {
    user: UsersItemType
}

const UsersListItem: React.FC<UsersListItemProps> = ( { user } ) => {

    /* start:component-unique-content-pre */
    /* end:component-unique-content-pre */

    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const onDelete = ( id: number ) => {

        const confirm = window.confirm( "Are you sure?" )

        if ( !confirm ) return

        dispatch(
            deleteUser( {
                path  : { id: id },
                query : { force: false },
            } )
        )
            .unwrap()
            .then( response => {
                console.log( "User deleted", response )
            } )
            .catch( ( err: unknown ) => {
                console.log( "Failed to delete user", err )
            } )

        navigate( "/admin/users" )

    }

    const { updatedAt, firstName, lastName, email, profileImageURL, profileText, fullName, isAdmin, isStaff, id, createdAt, } = user

    // There's a brief render cycle here after onDelete before the navigate()
    if ( Object.keys( user ).length === 1 && user.id )
        return

    /* start:component-unique-content */
    const imageURL = ( profileImageURL || "" )
    /* end:component-unique-content */

    return (
        <>
            <div className="users-list-item-container card border border-primary"
                data-user-updated-at={updatedAt}
                data-user-first-name={firstName}
                data-user-last-name={lastName}
                data-user-email={email}
                data-user-profile-image-url={profileImageURL}
                data-user-profile-text={profileText}
                data-user-full-name={fullName}
                data-user-is-admin={isAdmin}
                data-user-is-staff={isStaff}
                data-user-id={id}
                data-user-created-at={createdAt}
            >

                {/* start:component-unique-jsx */}
                <div className="users-list-item-container card-body flex-row">
                    <div className="flex-grow">

                        <div className="users-list-item-header">

                            <h1><Link to={`${location.pathname}/${id}`}>{fullName}</Link></h1>

                        </div>

                        <div className="flex-row user-content">
                            <div className="flex-grow">

                                <div className="flex-column">
                                    <img src={imageURL} width="384" height="288"/>

                                    {profileText}
                                </div>

                            </div>
                        </div>

                    </div>

                    <div className="user-list-item-actions flex-top flex-column">
                        <Link to={linkBuilder( AdminRouteBases.Users, [ id ] )}>
                            <GrFormView className="app-icon"/>
                        </Link>
                        <Link to={linkBuilder( AdminRouteBases.Users, [ "edit", id ] )}>
                            <GrFormEdit className="app-icon"/>
                        </Link>
                        <GrFormClose
                            onClick={_ => { onDelete( id ) }}
                            className="app-icon" style={{ color: "red" }}
                        />
                    </div>

                </div>
                {/* end:component-unique-jsx */}

            </div>
        </>
    )
}

export default UsersListItem