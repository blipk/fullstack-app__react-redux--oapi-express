/**
 * This file contains a component for displaying a single blog preview within a larger view.
 * Used by {@link components/generated/blogs/BlogsDisplay}
 *
 * @module
 */
import React from "react"

import { type BlogsItemType } from "../../store/reducers/generated/blogSlice"

/* start:component-unique-imports */
import { Link, useLocation } from "react-router-dom"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeSanitize from "rehype-sanitize"
/* end:component-unique-imports */


interface TemplatesDisplayItemProps {
    blog: BlogsItemType
}

const TemplatesDisplayItem: React.FC<TemplatesDisplayItemProps> = ( { blog } ) => {

    /* start:component-unique-content-pre */
    const location = useLocation()
    /* end:component-unique-content-pre */

    /* start:props-item-type-destructuring */
    const { id, createdAt, updatedAt, title, content, imageURL, isPublished, publishedDate, tags, userId, user } = blog
    /* end:props-item-type-destructuring */

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
            <div className="blogs-display-item card"
                /* start:element-data-attributes */
                data-blog-id={id}
                data-blog-created-at={createdAt}
                data-blog-updated-at={updatedAt}
                data-blog-title={title}
                data-blog-content={content}
                data-blog-user-id={userId}
                data-blog-user={String( user )}
                data-blog-image-url={imageURL}
                data-blog-is-published={isPublished}
                data-blog-published-date={publishedDate}
                data-blog-tags={String( tags )}
                /* end:element-data-attributes */
            >

                {/* start:component-unique-jsx */}
                <div className="blogs-display-item-body card-body pt-2 flex-column flex-grow">

                    <div className="blog-display-item-header">

                        <h1><Link to={`${location.pathname}/${id}`}>{title}</Link></h1>
                        <div>
                            <small>{displayUser && `By ${displayUser} on `}{displayDate.toLocaleString()}</small>
                            <div className="flex-row">{displayTags}</div>
                        </div>

                    </div>

                    <div className="blog-content-container flex-row flex-grow">
                        <div className="blog-content flex-grow">

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
                {/* end:component-unique-jsx */}

            </div>
        </>
    )
}

export default TemplatesDisplayItem