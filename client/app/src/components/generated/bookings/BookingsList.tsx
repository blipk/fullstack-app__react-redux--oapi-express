/**
 * This file contains a component for displaying a list of bookings with actions, used on the admin pages
 * @module
 */
import React from "react"

import { GrAdd } from "react-icons/gr"

import BookingsListItem from "./BookingsListItem"
import type { BookingsItemType } from "../../../store/reducers/generated/bookingSlice"
import { useLocation, useNavigate } from "react-router-dom"

/* start:component-unique-imports */
/* end:component-unique-imports */


interface BookingsListProps {
    bookings: BookingsItemType[]
}

const BookingsList: React.FC<BookingsListProps> = ( { bookings } ) => {

    const location = useLocation()
    const navigate = useNavigate()

    /* start:component-unique-content */
    /* end:component-unique-content */

    const addRoute = location.pathname.includes( "booking" ) ? `${location.pathname}/add` : "/booking/add"

    return (
        <>
            <div className="bookings-list-wrapper">
                <div className="flex-row page-header flex-gap-10">
                    <h1>Bookings List</h1>
                    <button type="button" className="flex-row" onClick={() => { navigate( addRoute ) }}><GrAdd/>New</button>
                </div>

                <div className="bookings-list">
                    {
                        bookings.length
                            ? bookings.map( booking => (
                                <BookingsListItem key={booking.id} booking={booking} />
                            ) )
                            : <p>There are no bookings</p>
                    }
                </div>
            </div>
        </>
    )

}

export default BookingsList