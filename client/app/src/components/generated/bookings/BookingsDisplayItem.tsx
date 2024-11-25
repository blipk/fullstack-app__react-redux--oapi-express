/**
 * This file contains a component for displaying a single booking preview within a larger view.
 * Used by {@link components/generated/bookings/BookingsDisplay}
 *
 * @module
 */
import React from "react"

import { type BookingsItemType } from "../../../store/reducers/generated/bookingSlice"

/* start:component-unique-imports */
/* end:component-unique-imports */


interface BookingsDisplayItemProps {
    booking: BookingsItemType
}

const BookingsDisplayItem: React.FC<BookingsDisplayItemProps> = ( { booking } ) => {

    /* start:component-unique-content-pre */
    /* end:component-unique-content-pre */

    const { updatedAt, id, createdAt, userId, user, bookingDate, bookingNotes, bookingTypeId, bookingType, } = booking

    /* start:component-unique-content */
    /* end:component-unique-content */

    return (
        <>
            <div className="bookings-display-item card"
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
                {/* end:component-unique-jsx */}

            </div>
        </>
    )
}

export default BookingsDisplayItem