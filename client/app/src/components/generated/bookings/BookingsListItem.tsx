/**
 * This file contains a component for displaying a single booking as a list item with actions.
 * Used by {@link components/generated/bookings/BookingsList}
 *
 * @module
 */
import React from "react"

import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "../../../store/store"
import { AdminRouteBases, linkBuilder } from "../../../router/navigation"

import { deleteBooking, type BookingsItemType } from "../../../store/reducers/generated/bookingSlice"

/* start:component-unique-imports */
import { Link } from "react-router-dom"
import { GrFormView, GrFormEdit, GrFormClose } from "react-icons/gr"
/* end:component-unique-imports */


interface BookingsListItemProps {
    booking: BookingsItemType
}

const BookingsListItem: React.FC<BookingsListItemProps> = ( { booking } ) => {

    /* start:component-unique-content-pre */
    /* end:component-unique-content-pre */

    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const onDelete = ( id: number ) => {

        const confirm = window.confirm( "Are you sure?" )

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

        navigate( "/admin/bookings" )

    }

    const { updatedAt, id, createdAt, userId, user, bookingDate, bookingNotes, bookingTypeId, bookingType, } = booking

    // There's a brief render cycle here after onDelete before the navigate()
    if ( Object.keys( booking ).length === 1 && booking.id )
        return

    /* start:component-unique-content */
    const displayUser = user?.firstName

    const displayWhichDate = bookingDate
    const displayDate = new Date( displayWhichDate )
    /* end:component-unique-content */

    return (
        <>
            <div className="bookings-list-item-container card border border-primary"
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
                <div className="bookings-list-item-container card-body flex-row">
                    <div className="flex-grow">

                        <div className="bookings-list-item-header">
                            <div>
                                Service Booking
                            </div>
                            <small>{`For ${displayUser} on `}{displayDate.toLocaleString()}</small>

                        </div>

                        <div className="flex-row booking-content">
                            <div className="flex-grow">

                                {bookingNotes}

                            </div>
                        </div>

                    </div>

                    <div className="booking-list-item-actions flex-top flex-column">
                        <Link to={linkBuilder( AdminRouteBases.Bookings, [ id ] )}>
                            <GrFormView className="app-icon"/>
                        </Link>
                        <Link to={linkBuilder( AdminRouteBases.Bookings, [ "edit", id ] )}>
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

export default BookingsListItem