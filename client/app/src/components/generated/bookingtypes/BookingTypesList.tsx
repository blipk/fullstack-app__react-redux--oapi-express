/**
 * This file contains a component for displaying a list of bookingTypes with actions, used on the admin pages
 * @module
 */
import React from "react"

import { GrAdd } from "react-icons/gr"

import BookingTypesListItem from "./BookingTypesListItem"
import type { BookingTypesItemType } from "../../../store/reducers/generated/bookingTypeSlice"
import { useLocation, useNavigate } from "react-router-dom"

/* start:component-unique-imports */
/* end:component-unique-imports */


interface BookingTypesListProps {
    bookingTypes: BookingTypesItemType[]
}

const BookingTypesList: React.FC<BookingTypesListProps> = ( { bookingTypes } ) => {

    const location = useLocation()
    const navigate = useNavigate()

    /* start:component-unique-content */
    /* end:component-unique-content */

    const addRoute = location.pathname.includes( "bookingType" ) ? `${location.pathname}/add` : "/bookingType/add"

    return (
        <>
            <div className="bookingTypes-list-wrapper">
                <div className="flex-row page-header flex-gap-10">
                    <h1>BookingTypes List</h1>
                    <button type="button" className="flex-row" onClick={() => { navigate( addRoute ) }}><GrAdd/>New</button>
                </div>

                <div className="bookingTypes-list">
                    {
                        bookingTypes.length
                            ? bookingTypes.map( bookingType => (
                                <BookingTypesListItem key={bookingType.id} bookingType={bookingType} />
                            ) )
                            : <p>There are no bookingTypes</p>
                    }
                </div>
            </div>
        </>
    )

}

export default BookingTypesList