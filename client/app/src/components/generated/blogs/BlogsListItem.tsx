/**
 * This file contains a component for displaying a single blog as a list item with actions.
 * Used by {@link components/generated/blogs/BlogsList}
 *
 * @module
 */
import React from "react"

import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "../../../store/store"
import { AdminRouteBases, linkBuilder } from "../../../router/navigation"

import { deleteBlog, type BlogsItemType } from "../../../store/reducers/generated/blogSlice"

/* start:component-unique-imports */
import { Link } from "react-router-dom"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeSanitize from "rehype-sanitize"
import { GrFormView, GrFormEdit, GrFormClose } from "react-icons/gr"
/* end:component-unique-imports */


interface BlogsListItemProps {
    blog: BlogsItemType
}

const BlogsListItem: React.FC<BlogsListItemProps> = ( { blog } ) => {

    /* start:component-unique-content-pre */
    /* end:component-unique-content-pre */

    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const onDelete = ( id: number ) => {

        const confirm = window.confirm( "Are you sure?" )

        if ( !confirm ) return

        dispatch(
            deleteBlog( {
                path  : { id: id },
                query : { force: false },
            } )
        )
            .unwrap()
            .then( response => {
                console.log( "Blog deleted", response )
            } )
            .catch( ( err: unknown ) => {
                console.log( "Failed to delete blog", err )
            } )

        navigate( "/admin/blogs" )

    }

    const { updatedAt, id, createdAt, title, content, userId, user, imageURL, publishedDate, isPublished, tags, } = blog

    // There's a brief render cycle here after onDelete before the navigate()
    if ( Object.keys( blog ).length === 1 && blog.id )
        return

    /* start:component-unique-content */
    const displayUser = user?.firstName

    const trimmedContent = `${content.slice( 0, 1000 )}...`

    const displayWhichDate = publishedDate || updatedAt || createdAt
    const displayDate = new Date( displayWhichDate )

    const displayTags = tags?.map(
        tag => <div key={tag.name} className="badge ms-2" style={{ backgroundColor: tag.cssColour }}>{tag.name}</div>
    )
    /* end:component-unique-content */

    return (
        <>
            <div className="blogs-list-item-container card border border-primary"
                data-blog-updated-at={updatedAt}
                data-blog-id={id}
                data-blog-created-at={createdAt}
                data-blog-title={title}
                data-blog-content={content}
                data-blog-user-id={userId}
                data-blog-user={user}
                data-blog-image-url={imageURL}
                data-blog-published-date={publishedDate}
                data-blog-is-published={isPublished}
                data-blog-tags={tags}
            >

                {/* start:component-unique-jsx */}
                <div className="blogs-list-item card-body flex-row">
                    <div className="flex-grow">

                        <div className="blogs-list-item-header">

                            <div className="flex-row">
                                <h1>{title}</h1>
                                {
                                    !isPublished &&
                                    <div className="flex-column justify-content-center ms-2">
                                        <p className="badge bg-warning text-dark">unpublished</p>
                                    </div>
                                }
                            </div>
                            <small>{displayUser && `By ${displayUser} on `}{displayDate.toLocaleString()}</small>
                            <div>{displayTags}</div>
                        </div>

                        <div className="flex-row blog-content">
                            <div className="flex-grow">

                                {imageURL && <img src={imageURL}
                                    alt="Blog Post Image"
                                    className="float-left blog-image-preview"/>}
                                <Markdown className="blog-markdown"
                                    remarkPlugins={[ [ remarkGfm, { singleTilde: false } ] ]}
                                    rehypePlugins={[ rehypeSanitize ]}
                                >
                                    {trimmedContent}
                                </Markdown>

                            </div>
                        </div>

                    </div>

                    <div className="blog-list-item-actions flex-top flex-column">
                        <Link to={linkBuilder( AdminRouteBases.Blogs, [ id ] )}>
                            <GrFormView className="app-icon"/>
                        </Link>
                        <Link to={linkBuilder( AdminRouteBases.Blogs, [ "edit", id ] )}>
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

export default BlogsListItem