/**
 * This file contains a component for displaying a single user in a full page view for the public
 * @module
 */
import React from "react"

import { type UsersItemType } from "../../../store/reducers/generated/userSlice"

/* start:component-unique-imports */
import { useNavigate } from "react-router-dom"

import { GrLinkPrevious } from "react-icons/gr"
/* end:component-unique-imports */


interface UserViewProps {
    user: UsersItemType
}

const UserView: React.FC<UserViewProps> = ( { user } ) => {

    /* start:component-unique-content-pre */
    const navigate = useNavigate()
    /* end:component-unique-content-pre */

    const { updatedAt, firstName, lastName, email, profileImageURL, profileText, fullName, isAdmin, isStaff, id, createdAt, } = user

    /* start:component-unique-content */
    const imageURL = ( profileImageURL || "" )
    /* end:component-unique-content */

    return (
        <>
            <div className="user-view"
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
                <div className="user-view-header">
                    <div className="user-view-navigation">
                        <button onClick={() => {navigate( -1 )}}><GrLinkPrevious/></button>
                    </div>
                    <h1>{fullName}</h1>

                </div>
                <div className="flex-column user-content">
                    <div className="flex-grow">

                        <div className="flex-column">
                            <img src={imageURL} width="384" height="288"/>

                            {profileText}
                        </div>

                    </div>
                </div>
                {/* end:component-unique-jsx */}

            </div>
        </>
    )
}

export default UserView