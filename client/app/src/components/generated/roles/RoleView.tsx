/**
 * This file contains a component for displaying a single role in a full page view for the public
 * @module
 */
import React from "react"

import { type RolesItemType } from "../../../store/reducers/generated/roleSlice"

/* start:component-unique-imports */
import { useNavigate } from "react-router-dom"
import { GrLinkPrevious } from "react-icons/gr"
/* end:component-unique-imports */


interface RoleViewProps {
    role: RolesItemType
}

const RoleView: React.FC<RoleViewProps> = ( { role } ) => {

    /* start:component-unique-content-pre */
    /* end:component-unique-content-pre */

    const { name, updatedAt, id, createdAt, } = role

    /* start:component-unique-content */
    const navigate = useNavigate()
    /* end:component-unique-content */

    return (
        <>
            <div className="role-view"
                data-role-name={name}
                data-role-updated-at={updatedAt}
                data-role-id={id}
                data-role-created-at={createdAt}
            >

                {/* start:component-unique-jsx */}
                <div className="role-view-header">
                    <div className="role-view-navigation">
                        <button onClick={() => {navigate( -1 )}}><GrLinkPrevious/></button>
                    </div>
                    <h1>{name}</h1>

                </div>
                <div className="flex-column role-content">
                    <div className="flex-grow">

                    </div>
                </div>
                {/* end:component-unique-jsx */}

            </div>
        </>
    )
}

export default RoleView