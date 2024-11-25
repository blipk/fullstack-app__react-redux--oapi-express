/**
 * This file contains a component for displaying a list of tags with actions, used on the admin pages
 * @module
 */
import React from "react"

import { GrAdd } from "react-icons/gr"

import TagsListItem from "./TagsListItem"
import type { TagsItemType } from "../../../store/reducers/generated/tagSlice"
import { useLocation, useNavigate } from "react-router-dom"

/* start:component-unique-imports */
/* end:component-unique-imports */


interface TagsListProps {
    tags: TagsItemType[]
}

const TagsList: React.FC<TagsListProps> = ( { tags } ) => {

    const location = useLocation()
    const navigate = useNavigate()

    /* start:component-unique-content */
    /* end:component-unique-content */

    const addRoute = location.pathname.includes( "tag" ) ? `${location.pathname}/add` : "/tag/add"

    return (
        <>
            <div className="tags-list-wrapper">
                <div className="flex-row page-header flex-gap-10">
                    <h1>Tags List</h1>
                    <button type="button" className="flex-row" onClick={() => { navigate( addRoute ) }}><GrAdd/>New</button>
                </div>

                <div className="tags-list">
                    {
                        tags.length
                            ? tags.map( tag => (
                                <TagsListItem key={tag.id} tag={tag} />
                            ) )
                            : <p>There are no tags</p>
                    }
                </div>
            </div>
        </>
    )

}

export default TagsList