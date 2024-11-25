/**
 * This file contains a component for displaying a single role as a list item with actions.
 * Used by {@link components/generated/roles/RolesList}
 *
 * @module
 */
import React from "react"

import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "../../../store/store"
import { AdminRouteBases, linkBuilder } from "../../../router/navigation"

import { deleteRole, type RolesItemType } from "../../../store/reducers/generated/roleSlice"

/* start:component-unique-imports */
import { Link } from "react-router-dom"
import { GrFormView, GrFormEdit, GrFormClose } from "react-icons/gr"
/* end:component-unique-imports */


interface RolesListItemProps {
    role: RolesItemType
}

const RolesListItem: React.FC<RolesListItemProps> = ( { role } ) => {

    /* start:component-unique-content-pre */
    /* end:component-unique-content-pre */

    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const onDelete = ( id: number ) => {

        const confirm = window.confirm( "Are you sure?" )

        if ( !confirm ) return

        dispatch(
            deleteRole( {
                path  : { id: id },
                query : { force: false },
            } )
        )
            .unwrap()
            .then( response => {
                console.log( "Role deleted", response )
            } )
            .catch( ( err: unknown ) => {
                console.log( "Failed to delete role", err )
            } )

        navigate( "/admin/roles" )

    }

    const { name, updatedAt, id, createdAt, } = role

    // There's a brief render cycle here after onDelete before the navigate()
    if ( Object.keys( role ).length === 1 && role.id )
        return

    /* start:component-unique-content */
    /* end:component-unique-content */

    return (
        <>
            <div className="roles-list-item-container card border border-primary"
                data-role-name={name}
                data-role-updated-at={updatedAt}
                data-role-id={id}
                data-role-created-at={createdAt}
            >

                {/* start:component-unique-jsx */}
                <div className="roles-list-item-container card-body flex-row">
                    <div className="flex-grow">

                        <div className="roles-list-item-header">

                            <h1>{name}</h1>

                        </div>

                        <div className="flex-row role-content">
                            <div className="flex-grow">

                            </div>
                        </div>

                    </div>

                    <div className="role-list-item-actions flex-top flex-column">
                        <Link to={linkBuilder( AdminRouteBases.Roles, [ id ] )}>
                            <GrFormView className="app-icon"/>
                        </Link>
                        <Link to={linkBuilder( AdminRouteBases.Roles, [ "edit", id ] )}>
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

export default RolesListItem