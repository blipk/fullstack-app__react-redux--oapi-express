/**
 * This file contains a component for displaying bookingTypes in a nice view for the public
 * @module
 */
import React from "react"

import BookingTypesDisplayItem from "./BookingTypesDisplayItem"
import type { BookingTypesItemType } from "../../../store/reducers/generated/bookingTypeSlice"

/* start:component-unique-imports */
/* end:component-unique-imports */


interface BookingTypesDisplayProps {
    bookingTypes: BookingTypesItemType[]
}

const BookingTypesDisplay: React.FC<BookingTypesDisplayProps> = ( { bookingTypes } ) => {

    /* start:component-unique-content */
    /* end:component-unique-content */

    return (
        <>

            {/* start:component-unique-jsx */}
            {/* end:component-unique-jsx */}

        </>
    )

}

export default BookingTypesDisplay