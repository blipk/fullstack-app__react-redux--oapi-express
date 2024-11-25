/**
 * This file contains a component for displaying a single tag in a full page view for the public
 * @module
 */
import React from "react"

import { type TagsItemType } from "../../../store/reducers/generated/tagSlice"

/* start:component-unique-imports */
import { useNavigate } from "react-router-dom"
import { GrLinkPrevious } from "react-icons/gr"
/* end:component-unique-imports */


interface TagViewProps {
    tag: TagsItemType
}

const TagView: React.FC<TagViewProps> = ( { tag } ) => {

    /* start:component-unique-content-pre */
    const navigate = useNavigate()
    /* end:component-unique-content-pre */

    const { name, updatedAt, id, createdAt, cssColour, } = tag

    /* start:component-unique-content */
    /* end:component-unique-content */

    return (
        <>
            <div className="tag-view"
                data-tag-name={name}
                data-tag-updated-at={updatedAt}
                data-tag-id={id}
                data-tag-created-at={createdAt}
                data-tag-css-colour={cssColour}
            >

                {/* start:component-unique-jsx */}
                <div className="tag-view-header">
                    <div className="tag-view-navigation">
                        <button onClick={() => {navigate( -1 )}}><GrLinkPrevious/></button>
                    </div>
                    <h1>{name}</h1>
                </div>
                <div className="flex-column tag-content">

                    <div className="flex-grow">
                        <div style={{ backgroundColor: cssColour, borderRadius: "10px", padding: "10px" }}>
                            {cssColour}
                        </div>
                    </div>

                </div>
                {/* end:component-unique-jsx */}

            </div>
        </>
    )
}

export default TagView