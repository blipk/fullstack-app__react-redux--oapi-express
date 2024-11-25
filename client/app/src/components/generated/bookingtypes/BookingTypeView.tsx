/**
 * This file contains a component for displaying a single bookingType in a full page view for the public
 * @module
 */
import React from "react"

import { type BookingTypesItemType } from "../../../store/reducers/generated/bookingTypeSlice"

/* start:component-unique-imports */
/* end:component-unique-imports */


interface BookingTypeViewProps {
    bookingType: BookingTypesItemType
}

const BookingTypeView: React.FC<BookingTypeViewProps> = ( { bookingType } ) => {

    /* start:component-unique-content-pre */
    /* end:component-unique-content-pre */

    const { name, updatedAt, id, createdAt, description, price, } = bookingType

    /* start:component-unique-content */
    /* end:component-unique-content */

    return (
        <>
            <div className="bookingType-view"
                data-booking-type-name={name}
                data-booking-type-updated-at={updatedAt}
                data-booking-type-id={id}
                data-booking-type-created-at={createdAt}
                data-booking-type-description={description}
                data-booking-type-price={price}
            >

                {/* start:component-unique-jsx */}
                {/* end:component-unique-jsx */}

            </div>
        </>
    )
}

export default BookingTypeView