/**
 * This file contains a component for displaying blogs in a nice view for the public
 * @module
 */
import React from "react"

import TemplatesDisplayItem from "./TemplatesDisplayItem"
import type { BlogsItemType } from "../../store/reducers/generated/blogSlice"

/* start:component-unique-imports */
/* end:component-unique-imports */


interface TemplatesDisplayProps {
    blogs: BlogsItemType[]
}

const TemplatesDisplay: React.FC<TemplatesDisplayProps> = ( { blogs } ) => {

    /* start:component-unique-content */
    /* end:component-unique-content */

    return (
        <>

            {/* start:component-unique-jsx */}
            <h1 className="page-header">Community News</h1>

            <div className="blogs-display">
                {
                    blogs.map( blog => (
                        <TemplatesDisplayItem key={blog.id} blog={blog} />
                    ) )
                }
            </div>
            {/* end:component-unique-jsx */}

        </>
    )

}

export default TemplatesDisplay