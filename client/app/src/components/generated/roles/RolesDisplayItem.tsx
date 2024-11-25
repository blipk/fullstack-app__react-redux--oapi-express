/**
 * This file contains a component for displaying a single role preview within a larger view.
 * Used by {@link components/generated/roles/RolesDisplay}
 *
 * @module
 */
import React from "react"

import { type RolesItemType } from "../../../store/reducers/generated/roleSlice"

/* start:component-unique-imports */
/* end:component-unique-imports */


interface RolesDisplayItemProps {
    role: RolesItemType
}

const RolesDisplayItem: React.FC<RolesDisplayItemProps> = ( { role } ) => {

    /* start:component-unique-content-pre */
    /* end:component-unique-content-pre */

    const { name, updatedAt, id, createdAt, } = role

    /* start:component-unique-content */
    /* end:component-unique-content */

    return (
        <>
            <div className="roles-display-item card"
                data-role-name={name}
                data-role-updated-at={updatedAt}
                data-role-id={id}
                data-role-created-at={createdAt}
            >

                {/* start:component-unique-jsx */}
                {/* end:component-unique-jsx */}

            </div>
        </>
    )
}

export default RolesDisplayItem