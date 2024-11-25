/**
 * This file contains a component for displaying a single bookingType preview within a larger view.
 * Used by {@link components/generated/bookingTypes/BookingTypesDisplay}
 *
 * @module
 */
import React from "react"

import { type BookingTypesItemType } from "../../../store/reducers/generated/bookingTypeSlice"

/* start:component-unique-imports */
import { useNavigate } from "react-router-dom"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeSanitize from "rehype-sanitize"
/* end:component-unique-imports */


interface BookingTypesDisplayItemProps {
    bookingType: BookingTypesItemType
}

const BookingTypesDisplayItem: React.FC<BookingTypesDisplayItemProps> = ( { bookingType } ) => {

    /* start:component-unique-content-pre */
    const navigate = useNavigate()
    /* end:component-unique-content-pre */

    const { name, updatedAt, id, createdAt, description, price, } = bookingType

    /* start:component-unique-content */
    function onBookNowClick( _event: React.MouseEvent, packageId: number ): void {
        navigate( `add?p=${packageId}` )
    }
    /* end:component-unique-content */

    return (
        <>
            <div className="bookingTypes-display-item card"
                data-booking-type-name={name}
                data-booking-type-updated-at={updatedAt}
                data-booking-type-id={id}
                data-booking-type-created-at={createdAt}
                data-booking-type-description={description}
                data-booking-type-price={price}
            >

                {/* start:component-unique-jsx */}
                <div className="bookingTypes-display-item-body card-body pt-2 flex-column flex-grow">

                    <div className="bookingType-display-item-header page-header">

                        <h1>{name} ${price}</h1>
                        <div>
                        </div>

                    </div>

                    <div className="bookingType-content-container flex-row flex-grow">
                        <div className="bookingType-content flex-grow">

                            <Markdown className="bookingType-markdown"
                                remarkPlugins={[ [ remarkGfm, { singleTilde: false } ] ]}
                                rehypePlugins={[ rehypeSanitize ]}
                            >
                                {description}
                            </Markdown>

                        </div>
                    </div>

                    <button type="button" onClick={e => { onBookNowClick( e, id ) }}>
                        Book Now
                    </button>

                </div>
                {/* end:component-unique-jsx */}

            </div>
        </>
    )
}

export default BookingTypesDisplayItem