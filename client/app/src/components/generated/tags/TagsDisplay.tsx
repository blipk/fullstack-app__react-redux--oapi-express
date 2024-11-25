/**
 * This file contains a component for displaying tags in a nice view for the public
 * @module
 */
import React from "react"

import TagsDisplayItem from "./TagsDisplayItem"
import type { TagsItemType } from "../../../store/reducers/generated/tagSlice"

/* start:component-unique-imports */
/* end:component-unique-imports */


interface TagsDisplayProps {
    tags: TagsItemType[]
}

const TagsDisplay: React.FC<TagsDisplayProps> = ( { tags } ) => {

    /* start:component-unique-content */
    /* end:component-unique-content */

    return (
        <>

            {/* start:component-unique-jsx */}
            <h1 className="page-header">Tags</h1>

            <div className="tags-display">
                {
                    tags.map( tag => (
                        <TagsDisplayItem key={tag.id} tag={tag} />
                    ) )
                }
            </div>
            {/* end:component-unique-jsx */}

        </>
    )

}

export default TagsDisplay