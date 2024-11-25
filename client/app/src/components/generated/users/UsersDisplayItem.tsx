/**
 * This file contains a component for displaying a single user preview within a larger view.
 * Used by {@link components/generated/users/UsersDisplay}
 *
 * @module
 */
import React from "react"

import { type UsersItemType } from "../../../store/reducers/generated/userSlice"

/* start:component-unique-imports */
import { Link } from "react-router-dom"
/* end:component-unique-imports */


interface UsersDisplayItemProps {
    user: UsersItemType
}

const UsersDisplayItem: React.FC<UsersDisplayItemProps> = ( { user } ) => {

    /* start:component-unique-content-pre */
    /* end:component-unique-content-pre */

    const { updatedAt, firstName, lastName, email, profileImageURL, profileText, fullName, isAdmin, isStaff, id, createdAt, } = user

    /* start:component-unique-content */
    const imageURL = ( profileImageURL || "" )

    /* end:component-unique-content */

    return (
        <>
            <div className="users-display-item card"
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
                <div className="users-display-item-body card-body pt-2 flex-column flex-grow">

                    <div className="user-display-item-header">

                        <h1><Link to={`${location.pathname}/${id}`}>{fullName}</Link></h1>

                    </div>

                    <div className="user-content-container flex-row flex-grow">
                        <div className="user-content flex-grow">

                            <div className="flex-column">
                                <img src={imageURL} className="img-fluid rounded" width="384" height="288"/>

                                {profileText}
                            </div>

                        </div>
                    </div>

                </div>
                {/* end:component-unique-jsx */}

            </div>
        </>
    )
}

export default UsersDisplayItem