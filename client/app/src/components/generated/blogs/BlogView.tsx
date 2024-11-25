/**
 * This file contains a component for displaying a single blog in a full page view for the public
 * @module
 */
import React from "react"

import { type BlogsItemType } from "../../../store/reducers/generated/blogSlice"

/* start:component-unique-imports */
import { useNavigate } from "react-router-dom"

import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeSanitize from "rehype-sanitize"
import { GrLinkPrevious } from "react-icons/gr"
/* end:component-unique-imports */


interface BlogViewProps {
    blog: BlogsItemType
}

const BlogView: React.FC<BlogViewProps> = ( { blog } ) => {

    /* start:component-unique-content-pre */
    const navigate = useNavigate()
    /* end:component-unique-content-pre */

    const { updatedAt, id, createdAt, title, content, userId, user, imageURL, publishedDate, isPublished, tags, } = blog

    /* start:component-unique-content */
    const displayWhichDate = publishedDate || updatedAt || createdAt
    const displayDate = new Date( displayWhichDate )

    const displayUser = user?.firstName

    const displayTags = tags?.map(
        tag => <div key={tag.name} className="badge ms-2" style={{ backgroundColor: tag.cssColour }}>{tag.name}</div>
    )
    /* end:component-unique-content */

    return (
        <>
            <div className="blog-view"
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
                <div className="blog-view-header">
                    <div className="blog-view-navigation">
                        <button onClick={() => {navigate( -1 )}}><GrLinkPrevious/></button>
                    </div>
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
                <div className="flex-column blog-content">

                    <div className="flex-grow">
                        {imageURL && <img src={imageURL}
                            alt="Blog Post Image"
                            className="float-left blog-image"/>}
                        <Markdown className="blog-markdown"
                            remarkPlugins={[ [ remarkGfm, { singleTilde: false } ] ]}
                            rehypePlugins={[ rehypeSanitize ]}
                        >
                            {content}
                        </Markdown>
                    </div>
                </div>
                {/* end:component-unique-jsx */}

            </div>
        </>
    )
}

export default BlogView