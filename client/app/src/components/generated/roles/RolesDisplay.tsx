/**
 * This file contains a component for displaying roles in a nice view for the public
 * @module
 */
import React from "react"

import RolesDisplayItem from "./RolesDisplayItem"
import type { RolesItemType } from "../../../store/reducers/generated/roleSlice"

/* start:component-unique-imports */
/* end:component-unique-imports */


interface RolesDisplayProps {
    roles: RolesItemType[]
}

const RolesDisplay: React.FC<RolesDisplayProps> = ( { roles } ) => {

    /* start:component-unique-content */
    /* end:component-unique-content */

    return (
        <>

            {/* start:component-unique-jsx */}
            <h1 className="page-header">Users</h1>

            <div className="roles-display">
                {
                    roles.map( role => (
                        <RolesDisplayItem key={role.id} role={role} />
                    ) )
                }
            </div>
            {/* end:component-unique-jsx */}

        </>
    )

}

export default RolesDisplay