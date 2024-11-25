/**
 * This file contains a component for displaying a list of feedbacks with actions, used on the admin pages
 * @module
 */
import React from "react"

import { GrAdd } from "react-icons/gr"

import FeedbacksListItem from "./FeedbacksListItem"
import type { FeedbacksItemType } from "../../../store/reducers/generated/feedbackSlice"
import { useLocation, useNavigate } from "react-router-dom"

/* start:component-unique-imports */
/* end:component-unique-imports */


interface FeedbacksListProps {
    feedbacks: FeedbacksItemType[]
}

const FeedbacksList: React.FC<FeedbacksListProps> = ( { feedbacks } ) => {

    const location = useLocation()
    const navigate = useNavigate()

    /* start:component-unique-content */
    /* end:component-unique-content */

    const addRoute = location.pathname.includes( "feedback" ) ? `${location.pathname}/add` : "/feedback/add"

    return (
        <>
            <div className="feedbacks-list-wrapper">
                <div className="flex-row page-header flex-gap-10">
                    <h1>Feedbacks List</h1>
                    <button type="button" className="flex-row" onClick={() => { navigate( addRoute ) }}><GrAdd/>New</button>
                </div>

                <div className="feedbacks-list">
                    {
                        feedbacks.length
                            ? feedbacks.map( feedback => (
                                <FeedbacksListItem key={feedback.id} feedback={feedback} />
                            ) )
                            : <p>There are no feedbacks</p>
                    }
                </div>
            </div>
        </>
    )

}

export default FeedbacksList