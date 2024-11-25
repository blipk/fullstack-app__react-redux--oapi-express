/**
 * This file contains a component for displaying a single tag preview within a larger view.
 * Used by {@link components/generated/tags/TagsDisplay}
 *
 * @module
 */
import React from "react"

import { type TagsItemType } from "../../../store/reducers/generated/tagSlice"

/* start:component-unique-imports */
/* end:component-unique-imports */


interface TagsDisplayItemProps {
    tag: TagsItemType
}

const TagsDisplayItem: React.FC<TagsDisplayItemProps> = ( { tag } ) => {

    /* start:component-unique-content-pre */
    /* end:component-unique-content-pre */

    const { name, updatedAt, id, createdAt, cssColour, } = tag

    /* start:component-unique-content */
    /* end:component-unique-content */

    return (
        <>
            <div className="tags-display-item card"
                data-tag-name={name}
                data-tag-updated-at={updatedAt}
                data-tag-id={id}
                data-tag-created-at={createdAt}
                data-tag-css-colour={cssColour}
            >

                {/* start:component-unique-jsx */}
                {/* end:component-unique-jsx */}

            </div>
        </>
    )
}

export default TagsDisplayItem