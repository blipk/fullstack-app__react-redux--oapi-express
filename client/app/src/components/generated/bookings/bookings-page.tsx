/**
 * This page is the element for the various public routes for Booking's.
 * It handles redux store errors and sets up the correct component to display for CRUD actions.
 *
 * Data loading is handled via redux dispatch in the route loader in {@link router/loader}
 * Data posting is handled via redux dispatch in the route action in {@link router/action}
 *
 * @module
 */
import React from "react"

import { useLocation, useParams } from "react-router-dom"

import { useAppSelector, type RootState } from "../../../store/store"
import { SliceStatus, type ApiErrorsTypeIntersection } from "../../../store/storeTypes"

import { errorsElement, loader } from "../../common"

import "./bookings-style.scss"
import BookingsDisplay from "./BookingsDisplay"
import BookingView from "./BookingView"
import BookingAddEdit from "./BookingAddEdit"


const BookingsPage: React.FC = () => {

    const params = useParams()
    const location = useLocation()
    const { idView, idEdit, idAdd } = params

    const { data: bookings, status, errors, messages } = useAppSelector( ( state: RootState ) => state.bookings )

    const recentFailureMessages = messages.filter(
        ( message ) => message.fromThunkState === "rejected" && ( new Date().getTime() - message.createdAt < 900 )
    )
    const displayFailureMessage = recentFailureMessages[ recentFailureMessages.length - 1 ]?.message

    const targetBooking = bookings.find( b => [ idView, idEdit, idAdd ].includes( String( b.id ) ) ) || bookings[ 0 ]

    const isView = idView && idView !== "add"
    const isAdd = idAdd || idView === "add" || location.pathname.endsWith( "/add" )
    const isEdit = idEdit !== undefined

    /* start:component-unique-content */
    const {
        data: bookingTypes,
        status: bookingTypeStatus,
        // errors: bookingTypeErrors,
        // messages: bookingTypeMessages
    } = useAppSelector( ( state: RootState ) => state.bookingTypes )

    const showComponent = isAdd
        ? true
        : !isView && !isAdd && !isEdit
            ? Boolean( bookingTypeStatus === SliceStatus.Succeeded ) && bookingTypes.length
            : Boolean( status === SliceStatus.Succeeded ) && bookings.length
    /* end:component-unique-content */

    const componentContent = isView
        ? <BookingView booking={targetBooking}/>
        : isEdit
            ? Boolean( bookings.length ) && <BookingAddEdit booking={targetBooking}/>
            : isAdd
                ? <BookingAddEdit/>
                : <BookingsDisplay bookings={bookings}/>

    return (
        <>
            {status === SliceStatus.Loading ? loader : null}
            {
                status === SliceStatus.Failed && displayFailureMessage && errors
                    ? errorsElement( displayFailureMessage, errors as ApiErrorsTypeIntersection[] )
                    : null
            }

            {showComponent && componentContent}
        </>
    )
}

export default BookingsPage
