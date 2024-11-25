/**
 * This file contains a component for displaying feedbacks in a nice view for the public
 * @module
 */
import React from "react"

import FeedbacksDisplayItem from "./FeedbacksDisplayItem"
import type { FeedbacksItemType } from "../../../store/reducers/generated/feedbackSlice"

/* start:component-unique-imports */
import { useNavigate } from "react-router-dom"
import { GrAdd } from "react-icons/gr"
/* end:component-unique-imports */


interface FeedbacksDisplayProps {
    feedbacks: FeedbacksItemType[]
}

const FeedbacksDisplay: React.FC<FeedbacksDisplayProps> = ( { feedbacks } ) => {

    /* start:component-unique-content */
    const column1Feedbacks = feedbacks.slice( 0, ( ( feedbacks.length - 1 ) / 2 ) + 1 )
    const column2Feedbacks = feedbacks.slice( ( ( feedbacks.length - 1 ) / 2 ) + 1 )

    const navigate = useNavigate()
    /* end:component-unique-content */

    return (
        <>

            {/* start:component-unique-jsx */}
            <div className="flex-row page-header flex-gap-10">
                <h1>Community Feedback</h1>
                <button type="button" className="flex-row" onClick={() => { navigate( `${location.pathname}/add` ) }}><GrAdd/>Add Yours</button>
            </div>

            <div className="feedbacks-display-container flex-row">

                <div className="feedbacks-display">
                    <div className="feedbacks-display-column">
                        {
                            column1Feedbacks.map( feedback => (
                                <FeedbacksDisplayItem key={feedback.id} feedback={feedback} />
                            ) )
                        }
                    </div>
                    <div className="feedbacks-display-column">
                        {
                            column2Feedbacks.map( feedback => (
                                <FeedbacksDisplayItem key={feedback.id} feedback={feedback} />
                            ) )
                        }
                    </div>
                </div>
            </div>
            {/* end:component-unique-jsx */}

        </>
    )

}

export default FeedbacksDisplay