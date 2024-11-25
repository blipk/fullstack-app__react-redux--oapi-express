/**
 * This file contains a component for displaying a single feedback in a full page view for the public
 * @module
 */
import React from "react"

import { type FeedbacksItemType } from "../../../store/reducers/generated/feedbackSlice"

/* start:component-unique-imports */
import { useNavigate } from "react-router-dom"
import { GrLinkPrevious } from "react-icons/gr"
/* end:component-unique-imports */


interface FeedbackViewProps {
    feedback: FeedbacksItemType
}

const FeedbackView: React.FC<FeedbackViewProps> = ( { feedback } ) => {

    /* start:component-unique-content-pre */
    const navigate = useNavigate()
    /* end:component-unique-content-pre */

    const { updatedAt, id, createdAt, authorName, title, content, isPublic, userId, user, } = feedback

    /* start:component-unique-content */
    const displayUser = user?.firstName || authorName

    const imageURL = ( user?.profileImageURL || "" )

    const displayWhichDate = updatedAt || createdAt
    const displayDate = new Date( displayWhichDate )
    /* end:component-unique-content */

    return (
        <>
            <div className="feedback-view"
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
                <div className="feedback-view-header">
                    <div className="feedback-view-navigation">
                        <button onClick={() => {navigate( -1 )}}><GrLinkPrevious/></button>
                    </div>

                    <div className="flex-row flex-gap-10">
                        {imageURL && <img src={imageURL} className="img-fluid rounded" width="48" height="48"/>}
                        <div>
                            <div className="flex-row justify-content-start flex-gap-10">
                                <h1>{title}</h1>
                                {!isPublic && <p className="badge bg-warning text-dark">Pending Review</p>}
                            </div>
                            <small>{displayUser && `By ${displayUser} on `}{displayDate.toLocaleString()}</small>
                        </div>
                    </div>
                </div>
                <div className="flex-column feedback-content">
                    <div className="flex-grow">

                        {content}

                    </div>
                </div>
                {/* end:component-unique-jsx */}

            </div>
        </>
    )
}

export default FeedbackView