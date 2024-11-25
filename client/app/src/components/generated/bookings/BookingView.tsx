/**
 * This file contains a component for displaying a single booking in a full page view for the public
 * @module
 */
import React from "react"

import { type BookingsItemType } from "../../../store/reducers/generated/bookingSlice"

/* start:component-unique-imports */
import { deleteBooking } from "../../../store/reducers/generated/bookingSlice"

import { Link, useNavigate } from "react-router-dom"
import { GrFormEdit, GrFormClose } from "react-icons/gr"
import { useAppDispatch } from "../../../store/store"
/* end:component-unique-imports */


interface BookingViewProps {
    booking: BookingsItemType
}

const BookingView: React.FC<BookingViewProps> = ( { booking } ) => {

    /* start:component-unique-content-pre */
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const onDelete = ( id: number ) => {

        const confirm = window.confirm( "Are you sure you want to cancel this booking?" )

        if ( !confirm ) return

        dispatch(
            deleteBooking( {
                path  : { id: id },
                query : { force: false },
            } )
        )
            .unwrap()
            .then( response => {
                console.log( "Booking deleted", response )
            } )
            .catch( ( err: unknown ) => {
                console.log( "Failed to delete booking", err )
            } )

        navigate( "/" )
    }
    /* end:component-unique-content-pre */

    const { updatedAt, id, createdAt, userId, user, bookingDate, bookingNotes, bookingTypeId, bookingType, } = booking

    /* start:component-unique-content */
    const displayWhichDate = bookingDate
    const displayDate = new Date( displayWhichDate )

    const displayUser = user?.firstName
    /* end:component-unique-content */

    return (
        <>
            <div className="booking-view"
                data-booking-updated-at={updatedAt}
                data-booking-id={id}
                data-booking-created-at={createdAt}
                data-booking-user-id={userId}
                data-booking-user={user}
                data-booking-booking-date={bookingDate}
                data-booking-booking-notes={bookingNotes}
                data-booking-booking-type-id={bookingTypeId}
                data-booking-booking-type={bookingType}
            >

                {/* start:component-unique-jsx */}
                <div className="booking-view-header">
                    <div className="booking-view-navigation">
                    </div>
                    <div className="flex-row flex-gap-10">
                        <h1>{bookingType?.name}</h1>

                        <div className="booking-list-item-actions flex-top flex-row">
                            <Link to={`/booking/edit/${id}`}>
                                <GrFormEdit className="app-icon"/>
                            </Link>
                            <GrFormClose
                                onClick={_ => { onDelete( id ) }}
                                className="app-icon" style={{ color: "red" }}
                            />
                        </div>

                    </div>
                    <small>{`For ${displayUser} on `}{displayDate.toLocaleString()}</small>
                </div>
                <div className="flex-column booking-content">

                    <div className="flex-grow booking-columns">
                        <div>Notes:</div>
                        <div>{bookingNotes || "<no notes>"}</div>
                    </div>
                </div>
                {/* end:component-unique-jsx */}

            </div>
        </>
    )
}

export default BookingView