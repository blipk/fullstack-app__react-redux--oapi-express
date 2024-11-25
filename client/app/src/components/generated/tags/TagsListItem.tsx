/**
 * This file contains a component for displaying a single tag as a list item with actions.
 * Used by {@link components/generated/tags/TagsList}
 *
 * @module
 */
import React from "react"

import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "../../../store/store"
import { AdminRouteBases, linkBuilder } from "../../../router/navigation"

import { deleteTag, type TagsItemType } from "../../../store/reducers/generated/tagSlice"

/* start:component-unique-imports */
import { Link } from "react-router-dom"
import { GrFormView, GrFormEdit, GrFormClose } from "react-icons/gr"
/* end:component-unique-imports */


interface TagsListItemProps {
    tag: TagsItemType
}

const TagsListItem: React.FC<TagsListItemProps> = ( { tag } ) => {

    /* start:component-unique-content-pre */
    /* end:component-unique-content-pre */

    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const onDelete = ( id: number ) => {

        const confirm = window.confirm( "Are you sure?" )

        if ( !confirm ) return

        dispatch(
            deleteTag( {
                path  : { id: id },
                query : { force: false },
            } )
        )
            .unwrap()
            .then( response => {
                console.log( "Tag deleted", response )
            } )
            .catch( ( err: unknown ) => {
                console.log( "Failed to delete tag", err )
            } )

        navigate( "/admin/tags" )

    }

    const { name, updatedAt, id, createdAt, cssColour, } = tag

    // There's a brief render cycle here after onDelete before the navigate()
    if ( Object.keys( tag ).length === 1 && tag.id )
        return

    /* start:component-unique-content */
    /* end:component-unique-content */

    return (
        <>
            <div className="tags-list-item-container card border border-primary"
                data-tag-name={name}
                data-tag-updated-at={updatedAt}
                data-tag-id={id}
                data-tag-created-at={createdAt}
                data-tag-css-colour={cssColour}
            >

                {/* start:component-unique-jsx */}
                <div className="tags-list-item-container card-body flex-row">
                    <div className="flex-grow">

                        <div className="tags-list-item-header">

                            <h1>{name}</h1>

                        </div>

                        <div className="flex-row tag-content">
                            <div className="flex-grow flex-row">

                                <div style={{ backgroundColor: cssColour, borderRadius: "10px", padding: "10px" }}>
                                    {cssColour}
                                </div>

                            </div>
                        </div>

                    </div>

                    <div className="tag-list-item-actions flex-top flex-column">
                        <Link to={linkBuilder( AdminRouteBases.Tags, [ id ] )}>
                            <GrFormView className="app-icon"/>
                        </Link>
                        <Link to={linkBuilder( AdminRouteBases.Tags, [ "edit", id ] )}>
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

export default TagsListItem