/**
 * This file contains a component for displaying a list of roles with actions, used on the admin pages
 * @module
 */
import React from "react"

import { GrAdd } from "react-icons/gr"

import RolesListItem from "./RolesListItem"
import type { RolesItemType } from "../../../store/reducers/generated/roleSlice"
import { useLocation, useNavigate } from "react-router-dom"

/* start:component-unique-imports */
/* end:component-unique-imports */


interface RolesListProps {
    roles: RolesItemType[]
}

const RolesList: React.FC<RolesListProps> = ( { roles } ) => {

    const location = useLocation()
    const navigate = useNavigate()

    /* start:component-unique-content */
    /* end:component-unique-content */

    const addRoute = location.pathname.includes( "role" ) ? `${location.pathname}/add` : "/role/add"

    return (
        <>
            <div className="roles-list-wrapper">
                <div className="flex-row page-header flex-gap-10">
                    <h1>Roles List</h1>
                    <button type="button" className="flex-row" onClick={() => { navigate( addRoute ) }}><GrAdd/>New</button>
                </div>

                <div className="roles-list">
                    {
                        roles.length
                            ? roles.map( role => (
                                <RolesListItem key={role.id} role={role} />
                            ) )
                            : <p>There are no roles</p>
                    }
                </div>
            </div>
        </>
    )

}

export default RolesList