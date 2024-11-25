/**
 * This file contains a component for displaying a single blog preview within a larger view.
 * Used by {@link components/generated/blogs/BlogsDisplay}
 *
 * @module
 */
import React from "react"

import { type BlogsItemType } from "../../../store/reducers/generated/blogSlice"

/* start:component-unique-imports */
import { useRef, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeSanitize from "rehype-sanitize"
/* end:component-unique-imports */


interface BlogsDisplayItemProps {
    blog: BlogsItemType
}

const BlogsDisplayItem: React.FC<BlogsDisplayItemProps> = ( { blog } ) => {

    /* start:component-unique-content-pre */
    const location = useLocation()
    /* end:component-unique-content-pre */

    const { updatedAt, id, createdAt, title, content, userId, user, imageURL, publishedDate, isPublished, tags, } = blog

    /* start:component-unique-content */

    const displayUser = user?.firstName

    const trimmedContent = `${content.slice( 0, 800 )}...`

    const displayWhichDate = publishedDate || updatedAt || createdAt
    const displayDate = new Date( displayWhichDate )

    const displayTags = tags?.map(
        tag => <div key={tag.name} className="badge ms-2" style={{ backgroundColor: tag.cssColour }}>{tag.name}</div>
    )



    const markdownContainerRef = useRef<HTMLDivElement>( null )
    useEffect( () => {
        if ( !markdownContainerRef.current )
            return

        const paragraphs = markdownContainerRef.current.querySelectorAll( "p" )
        let lastVisibleIndex = -1

        const containerRect = markdownContainerRef.current.getBoundingClientRect()

        paragraphs.forEach( ( paragraph, index ) => {
            const paragraphRect = paragraph.getBoundingClientRect()

            // Compare the paragraph's position with the container's position
            console.log( paragraph, paragraphRect.top, containerRect.bottom )
            if (
                paragraphRect.top < containerRect.bottom - 150
                // && paragraphRect.bottom > containerRect.top
            ) {
                lastVisibleIndex = index
            }
        } )

        paragraphs.forEach( ( p, index ) => {
            p.style.display = "" // Reset styles
            if ( index === lastVisibleIndex )
                p.classList.add( "ellipsized" )
            else
                p.classList.remove( "ellipsized" )
        } )

    }, [ trimmedContent ] )
    /* end:component-unique-content */

    return (
        <>
            <div className="blogs-display-item card"
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
                <div className="blogs-display-item-body card-body pt-2 flex-column flex-grow">

                    <div className="blog-display-item-header">

                        <h1><Link to={`${location.pathname}/${id}`}>{title}</Link></h1>
                        <div>
                            <small>{displayUser && `By ${displayUser} on `}{displayDate.toLocaleString()}</small>
                            <div className="flex-row">{displayTags}</div>
                        </div>

                    </div>

                    <div className="blog-content-container flex-row flex-grow">
                        <div ref={markdownContainerRef} className="blog-content flex-grow">

                            {imageURL && <img src={imageURL}
                                alt="Blog Post Image"
                                className="float-left blog-image-preview"/>}
                            <Markdown
                                className="blog-markdown"
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

export default BlogsDisplayItem