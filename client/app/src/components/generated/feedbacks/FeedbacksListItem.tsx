/**
 * This file contains a component for displaying a single feedback as a list item with actions.
 * Used by {@link components/generated/feedbacks/FeedbacksList}
 *
 * @module
 */
import React from "react"

import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "../../../store/store"
import { AdminRouteBases, linkBuilder } from "../../../router/navigation"

import { deleteFeedback, type FeedbacksItemType } from "../../../store/reducers/generated/feedbackSlice"

/* start:component-unique-imports */
import { Link } from "react-router-dom"
import { GrFormView, GrFormEdit, GrFormClose } from "react-icons/gr"
/* end:component-unique-imports */


interface FeedbacksListItemProps {
    feedback: FeedbacksItemType
}

const FeedbacksListItem: React.FC<FeedbacksListItemProps> = ( { feedback } ) => {

    /* start:component-unique-content-pre */
    /* end:component-unique-content-pre */

    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const onDelete = ( id: number ) => {

        const confirm = window.confirm( "Are you sure?" )

        if ( !confirm ) return

        dispatch(
            deleteFeedback( {
                path  : { id: id },
                query : { force: false },
            } )
        )
            .unwrap()
            .then( response => {
                console.log( "Feedback deleted", response )
            } )
            .catch( ( err: unknown ) => {
                console.log( "Failed to delete feedback", err )
            } )

        navigate( "/admin/feedbacks" )

    }

    const { updatedAt, id, createdAt, authorName, title, content, isPublic, userId, user, } = feedback

    // There's a brief render cycle here after onDelete before the navigate()
    if ( Object.keys( feedback ).length === 1 && feedback.id )
        return

    /* start:component-unique-content */
    const displayUser = user?.firstName || authorName

    const imageURL = ( user?.profileImageURL || "" )

    const trimmedContent = `${content.slice( 0, 1000 )}...`

    const displayWhichDate = updatedAt || createdAt
    const displayDate = new Date( displayWhichDate )
    /* end:component-unique-content */

    return (
        <>
            <div className="feedbacks-list-item-container card border border-primary"
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
                <div className="feedbacks-list-item card-body">
                    <div className="flex-grow">

                        <div className="feedbacks-list-item-header">

                            <div className="flex-row flex-gap-10">
                                {imageURL && <img src={imageURL} className="img-fluid rounded" width="48" height="48"/>}
                                <div>
                                    <h1><Link to={`${location.pathname}/${id}`}>{title}</Link></h1>
                                    <small>{displayUser && `By ${displayUser} on `}{displayDate.toLocaleString()}</small>
                                </div>
                            </div>
                            {
                                !isPublic &&
                                <div className="flex-column justify-content-center ms-2">
                                    <p className="badge bg-warning text-dark">unpublished</p>
                                </div>
                            }
                        </div>

                        <div className="flex-row feedback-content">
                            <div className="flex-grow">

                                {trimmedContent}

                            </div>
                        </div>

                    </div>

                    <div className="feedback-list-item-actions flex-top flex-column">
                        <Link to={linkBuilder( AdminRouteBases.Feedbacks, [ id ] )}>
                            <GrFormView className="app-icon"/>
                        </Link>
                        <Link to={linkBuilder( AdminRouteBases.Feedbacks, [ "edit", id ] )}>
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

export default FeedbacksListItem