/**
 * This file contains a component for displaying bookings in a nice view for the public
 * @module
 */
import React from "react"

import BookingsDisplayItem from "./BookingsDisplayItem"
import type { BookingsItemType } from "../../../store/reducers/generated/bookingSlice"

/* start:component-unique-imports */
import { useAppSelector, type RootState } from "../../../store/store"
import BookingTypesDisplayItem from "../bookingtypes/BookingTypesDisplayItem"
/* end:component-unique-imports */


interface BookingsDisplayProps {
    bookings: BookingsItemType[]
}

const BookingsDisplay: React.FC<BookingsDisplayProps> = ( { bookings } ) => {

    /* start:component-unique-content */
    const { data: bookingTypes } = useAppSelector( ( state: RootState ) => state.bookingTypes )
    /* end:component-unique-content */

    return (
        <>

            {/* start:component-unique-jsx */}
            <h1 className="page-header">Our Service Packages</h1>

            <div className="bookings-display">
                {
                    bookingTypes.map( bookingType => (
                        <BookingTypesDisplayItem key={bookingType.id} bookingType={bookingType} />
                    ) )
                }
            </div>
            {/* end:component-unique-jsx */}

        </>
    )

}

export default BookingsDisplay