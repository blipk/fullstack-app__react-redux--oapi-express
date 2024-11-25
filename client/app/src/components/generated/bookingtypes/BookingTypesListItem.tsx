/**
 * This file contains a component for displaying a single bookingType as a list item with actions.
 * Used by {@link components/generated/bookingTypes/BookingTypesList}
 *
 * @module
 */
import React from "react"

import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "../../../store/store"
import { AdminRouteBases, linkBuilder } from "../../../router/navigation"

import { deleteBookingType, type BookingTypesItemType } from "../../../store/reducers/generated/bookingTypeSlice"

/* start:component-unique-imports */
import { Link } from "react-router-dom"
import { GrFormView, GrFormEdit, GrFormClose } from "react-icons/gr"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeSanitize from "rehype-sanitize"
/* end:component-unique-imports */


interface BookingTypesListItemProps {
    bookingType: BookingTypesItemType
}

const BookingTypesListItem: React.FC<BookingTypesListItemProps> = ( { bookingType } ) => {

    /* start:component-unique-content-pre */
    /* end:component-unique-content-pre */

    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const onDelete = ( id: number ) => {

        const confirm = window.confirm( "Are you sure?" )

        if ( !confirm ) return

        dispatch(
            deleteBookingType( {
                path  : { id: id },
                query : { force: false },
            } )
        )
            .unwrap()
            .then( response => {
                console.log( "BookingType deleted", response )
            } )
            .catch( ( err: unknown ) => {
                console.log( "Failed to delete bookingType", err )
            } )

        navigate( "/admin/bookingTypes" )

    }

    const { name, updatedAt, id, createdAt, description, price, } = bookingType

    // There's a brief render cycle here after onDelete before the navigate()
    if ( Object.keys( bookingType ).length === 1 && bookingType.id )
        return

    /* start:component-unique-content */
    /* end:component-unique-content */

    return (
        <>
            <div className="bookingTypes-list-item-container card border border-primary"
                data-booking-type-name={name}
                data-booking-type-updated-at={updatedAt}
                data-booking-type-id={id}
                data-booking-type-created-at={createdAt}
                data-booking-type-description={description}
                data-booking-type-price={price}
            >

                {/* start:component-unique-jsx */}
                <div className="bookingTypes-list-item-container card-body flex-row">
                    <div className="flex-grow">

                        <div className="bookingTypes-list-item-header">

                            <h1>{name} ${price}</h1>

                        </div>

                        <div className="flex-row bookingType-content">
                            <div className="flex-grow flex-row mt-2">

                                <Markdown className="bookingType-markdown"
                                    remarkPlugins={[ [ remarkGfm, { singleTilde: false } ] ]}
                                    rehypePlugins={[ rehypeSanitize ]}
                                >
                                    {description}
                                </Markdown>

                            </div>
                        </div>

                    </div>

                    <div className="bookingType-list-item-actions flex-top flex-column">
                        <Link to={linkBuilder( AdminRouteBases.BookingTypes, [ id ] )}>
                            <GrFormView className="app-icon"/>
                        </Link>
                        <Link to={linkBuilder( AdminRouteBases.BookingTypes, [ "edit", id ] )}>
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

export default BookingTypesListItem