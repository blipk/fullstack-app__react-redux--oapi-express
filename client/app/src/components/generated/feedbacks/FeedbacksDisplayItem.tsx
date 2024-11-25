/**
 * This file contains a component for displaying a single feedback preview within a larger view.
 * Used by {@link components/generated/feedbacks/FeedbacksDisplay}
 *
 * @module
 */
import React from "react"

import { type FeedbacksItemType } from "../../../store/reducers/generated/feedbackSlice"

/* start:component-unique-imports */
import { Link } from "react-router-dom"
/* end:component-unique-imports */


interface FeedbacksDisplayItemProps {
    feedback: FeedbacksItemType
}

const FeedbacksDisplayItem: React.FC<FeedbacksDisplayItemProps> = ( { feedback } ) => {

    /* start:component-unique-content-pre */
    /* end:component-unique-content-pre */

    const { updatedAt, id, createdAt, authorName, title, content, isPublic, userId, user, } = feedback

    /* start:component-unique-content */
    const displayUser = user?.firstName || authorName

    const imageURL = ( user?.profileImageURL || "" )

    const trimmedContent = `${content.slice( 0, 100 )}${content.length > 100 ? "..." : ""}`

    const displayWhichDate = updatedAt || createdAt
    const displayDate = new Date( displayWhichDate )
    /* end:component-unique-content */

    return (
        <>
            <div className="feedbacks-display-item card"
                data-feedback-updated-at={updatedAt}
                data-feedback-id={id}
                data-feedback-created-at={createdAt}
                data-feedback-author-name={authorName}
                data-feedback-title={title}
                data-feedback-content={content}
                data-feedback-is-public={isPublic}
                data-feedback-user-id={userId}
                data-feedback-user={user}
            >

                {/* start:component-unique-jsx */}
                <div className="feedbacks-display-item-body card-body pt-2 flex-column flex-grow">

                    <div className="feedback-display-item-header">

                        <div className="flex-row flex-gap-10">
                            {imageURL && <img src={imageURL} width="48" height="48"/>}
                            <div>
                                <h1><Link to={`${location.pathname}/${id}`}>{title}</Link></h1>
                                <small>{displayUser && `By ${displayUser} on `}{displayDate.toLocaleString()}</small>
                            </div>
                        </div>

                    </div>

                    <div className="feedback-content-container flex-row flex-grow">
                        <div className="feedback-content flex-grow">

                            {trimmedContent}

                        </div>
                    </div>

                </div>
                {/* end:component-unique-jsx */}

            </div>
        </>
    )
}

export default FeedbacksDisplayItem