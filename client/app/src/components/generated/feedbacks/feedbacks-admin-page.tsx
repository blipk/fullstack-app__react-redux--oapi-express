/**
 * This page is the element for the various admin routes for Feedback's.
 * It handles redux store errors and sets up the correct component to display for CRUD actions.
 *
 * Data loading is handled via redux dispatch in the route loader in {@link router/loader}
 * Data posting is handled via redux dispatch in the route action in {@link router/action}
 *
 * @module
 */
import React from "react"

import { useParams, useLocation } from "react-router-dom"

import { useAppSelector, type RootState } from "../../../store/store"
import { SliceStatus, type ApiErrorsTypeIntersection } from "../../../store/storeTypes"

import { errorsElement, loader } from "../../common"

import "./feedbacks-style.scss"
import FeedbacksList from "./FeedbacksList"
import FeedbackView from "./FeedbackView"
import FeedbackAddEdit from "./FeedbackAddEdit"


const FeedbacksAdminPage: React.FC = () => {

    const params = useParams()
    const location = useLocation()
    const { idView, idEdit, idAdd } = params

    if ( idView && idEdit )
        throw new Error( "Impossible route error" )

    const { data: feedbacks, status, errors, messages } = useAppSelector( ( state: RootState ) => state.feedbacks )

    const recentFailureMessages = messages.filter(
        ( message ) => message.fromThunkState === "rejected" && ( new Date().getTime() - message.createdAt < 900 )
    )
    const displayFailureMessage = recentFailureMessages[ recentFailureMessages.length - 1 ]?.message

    const targetFeedback = feedbacks.find( b => [ idView, idEdit, idAdd ].includes( String( b.id ) ) ) || feedbacks[ 0 ]

    const isView = idView && idView !== "add"
    const isAdd = idAdd || idView === "add" || location.pathname.endsWith( "/add" )
    const isEdit = idEdit !== undefined

    const componentContent =
        isView
            ? Boolean( feedbacks.length ) && <FeedbackView feedback={targetFeedback}/>
            : isEdit
                ? Boolean( feedbacks.length ) && <FeedbackAddEdit feedback={targetFeedback}/>
                : isAdd
                    ? <FeedbackAddEdit/>
                    : Boolean( feedbacks.length ) && <FeedbacksList feedbacks={feedbacks}/>

    return (
        <>
            {status === SliceStatus.Loading ? loader : null}
            {
                displayFailureMessage && errors
                    ? errorsElement( displayFailureMessage, errors as ApiErrorsTypeIntersection[] )
                    : null
            }
            {componentContent}
        </>
    )
}

export default FeedbacksAdminPage
