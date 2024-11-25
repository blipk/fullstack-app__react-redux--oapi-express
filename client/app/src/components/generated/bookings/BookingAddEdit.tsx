/**
 * This file contains a component for creating or editing a Booking item
 *
 * @module
 */

import React, { useEffect, useRef, useState } from "react"

import { useForm, type SubmitErrorHandler, type SubmitHandler } from "react-hook-form"
import { Form, useActionData, useLocation, useNavigate } from "react-router-dom"

import { useAppSelector } from "../../../store/store"

import type { BookingsItemType } from "../../../store/reducers/generated/bookingSlice"
import type { BookingCreateRequest } from "../../../api-client/types.gen"
import { recentMessagesErrorsToFormErrors } from "../../common"
import { camelToHyphenCase } from "../../../utils/stringUtils"

import Barcode from "../../Barcode.tsx"

/* start:component-unique-imports */
import { convertISOToDateInputValue } from "../../../utils/timeUtils.ts"
import { useAppDispatch } from "../../../store/store"
import { getAllBookingTypes } from "../../../store/reducers/generated/bookingTypeSlice.ts"
/* end:component-unique-imports */


interface BookingAddEditProps {
    booking?: BookingsItemType
}

interface ActionData {
    error?: string;
    success?: boolean;
}

type ThisFormData = BookingCreateRequest

const BookingAddEdit: React.FC<BookingAddEditProps> = ( { booking } ) => {

    /* start:component-unique-content-pre */
    const dispatch = useAppDispatch()
    /* end:component-unique-content-pre */

    const isEdit = Boolean( booking )

    const location = useLocation()
    const navigate = useNavigate()

    const { messages } = useAppSelector( ( state ) => state.bookings )
    const serverFormErrors = recentMessagesErrorsToFormErrors( messages )

    const formRef = useRef<HTMLFormElement>( null )

    const { register, handleSubmit, formState } = useForm<ThisFormData>()
    const { errors: formStateErrors } = formState
    const formErrors = { ...formStateErrors, ...serverFormErrors }

    const actionData: ActionData | undefined = useActionData() as ActionData | undefined
    useEffect( () => {
        console.log( "Booking Form Action", actionData )
    }, [ actionData, navigate ] )


    const { extraState: authExtraState } = useAppSelector( ( state ) => state.auth )

    const defaultBooking = {
        userId        : authExtraState.jwtResponse?.user.id,
        user          : undefined,
        bookingDate   : undefined,
        bookingNotes  : undefined,
        bookingTypeId : undefined,
    }

    const [ editableBooking, setEditableBooking ] = useState<Partial<BookingsItemType>>( booking || defaultBooking )
    const { updatedAt, id, createdAt, userId, user, bookingDate, bookingNotes, bookingTypeId, bookingType, } = editableBooking


    const onFormStateChange = ( e: React.ChangeEvent ) =>{
        const target = e.target as HTMLInputElement
        const newValue =
            target.valueAsDate
            || target.valueAsNumber
            || ( target.type === "checkbox" ? target.checked : target.value )

        setEditableBooking(
            { ...editableBooking, [ target.name ]: newValue }
        )
    }

    const onValidSubmit: SubmitHandler<ThisFormData> = ( data, event? ): void => {
        console.log( "onValidSubmit", data, event )

        if ( !formRef.current )
            return

        // Update FormData for boolean checkbox values
        Object.entries( data ).forEach( ( [ key, value ] ) => {
            if ( !formRef.current )
                return

            const inputElements = formRef.current.querySelector( `input[name="${key}"]` )
                ? formRef.current.querySelectorAll( `input[name="${key}"]` )
                : formRef.current.querySelector( `select[name="${key}"]` )
                    ? formRef.current.querySelectorAll( `select[name="${key}"]` )
                    : formRef.current.querySelectorAll( `textarea[name="${key}"]` )

            if ( !inputElements.length )
                throw new Error( `Couldnt find input element: ${key}` )

            for ( const inputElement of inputElements )
                if ( ( inputElement as HTMLInputElement ).type === "checkbox" ) {
                    const newInputElement: HTMLInputElement =
                        formRef.current.querySelector( `input[name="${key}"][type="hidden"]` )
                        || document.createElement( "input" )
                    newInputElement.type = "hidden"
                    newInputElement.name = key
                    newInputElement.value = String( value )
                    formRef.current.appendChild( newInputElement )
                }

        } )

        // Request submission on the form to pass to the action set up in the route in `react-router-dom`
        formRef.current.requestSubmit()
    }

    const onInvalidSubmit: SubmitErrorHandler<ThisFormData> = ( errors, event? ): void => {
        console.log( "onInvalidSubmit", errors, event )
    }

    const formDataAttrs = Object.fromEntries(
        Object.keys( editableBooking ).map(
            key => [ `data-booking-${camelToHyphenCase( key )}`, editableBooking[ key as keyof typeof editableBooking ] ]
        )
    )

    /* start:component-unique-content */
    const searchParams = Object.fromEntries( new URLSearchParams( location.search ).entries() )
    const defaultBookingType = Number( searchParams.p )

    useEffect( () => {
        const currentUser = authExtraState.jwtResponse?.user
        if ( !currentUser )
            navigate( `/login?s=booking&p=${defaultBookingType}`, { replace: true } )

    }, [ navigate ] )


    const { data: bookingTypesData } = useAppSelector( ( state ) => state.bookingTypes )

    useEffect( () => {
        dispatch(
            getAllBookingTypes( {} )
        )
            .unwrap()
            .then( response => {
                console.log( "Loaded BookingTypes", response )
            } )
            .catch( ( err: unknown ) => {
                console.log( "Failed to load BookingTypes", err )
            } )
    }, [] )


    /* end:component-unique-content */

    return (
        <>
            <div className="form-wrapper add-edit-form">
                {/* This form will validate using `react-hook-form` from the button below,
                    then when `requestSubmit()` is called in `onValidSubmit()`, it will send
                    the FormData to the action set up in the `react-router-dom` router,
                    which will then dispatch it to the correct Redux thunk. */}

                <Form method="post" id="bookingAddEditForm" className="form-container" ref={formRef}
                    action={location.pathname}
                    data-booking-updated-at={updatedAt}
                    data-booking-id={id}
                    data-booking-created-at={createdAt}
                    data-booking-user-id={userId}
                    data-booking-user={user}
                    data-booking-booking-date={bookingDate}
                    data-booking-booking-notes={bookingNotes}
                    data-booking-booking-type-id={bookingTypeId}
                    data-booking-booking-type={bookingType}
                    {...formDataAttrs}
                >

                    <div style={{ display: "none" }}>
                        <input type="hidden" id="userId" name="userId" value={ userId || undefined }/>
                    </div>

                    <div className="form-grid">

                        <div style={{ alignSelf: "center" }}></div>
                        <div className="form-header">
                            <h1 className="page-header" style={{ justifySelf: "flex-start" }}>
                                {booking ? "Update Booking" : "New Booking"}
                            </h1>
                            <Barcode value="BOOKING"/>
                        </div>

                        {/* start:component-unique-jsx */}
                        <label>
                            Booking For:
                        </label>
                        <div>
                            {authExtraState.jwtResponse?.user.fullName}
                        </div>

                        <label>
                            Booking Type:
                            {/* {formErrors.bookingTypeId && <div className="form-errors"><small>{formErrors.bookingTypeId.message}</small></div>} */}
                        </label>
                        <select
                            aria-invalid={formErrors.bookingTypeId ? "true" : "false"}
                            value={defaultBookingType || String( bookingTypeId )}
                            required

                            {...register( "bookingTypeId", {
                                onChange : onFormStateChange,
                                required : "Booking Type is required"
                            } )}
                        >
                            {
                                bookingTypesData.map( bookingType =>
                                    <option key={bookingType.name} value={bookingType.id}>
                                        {bookingType.name} (${bookingType.price})
                                    </option>
                                )
                            }
                        </select>
                        {/* end:component-unique-jsx */}

                        <label>
                            Booking Date:
                            {formErrors.bookingDate && <div className="form-errors"><small>{formErrors.bookingDate.message}</small></div>}
                        </label>
                        <input
                            type="datetime-local"
                            value={convertISOToDateInputValue( bookingDate, true ) || ""}
                            aria-invalid={formErrors.bookingDate ? "true" : "false"}
                            required

                            {...register( "bookingDate", {
                                onChange : onFormStateChange,
                                required : "Booking Date is required"
                            } )}
                        />

                        <label>
                            Booking Notes:
                            {formErrors.bookingNotes && <div className="form-errors"><small>{formErrors.bookingNotes.message}</small></div>}
                        </label>
                        <input
                            type="text"
                            value={bookingNotes || ""}
                            aria-invalid={formErrors.bookingNotes ? "true" : "false"}

                            {...register( "bookingNotes", {
                                onChange: onFormStateChange,
                            } )}
                        />

                    </div>

                    {actionData?.error && <span>{actionData.error}</span>}

                    <button type="button" onClick={() => { navigate( -1 ) }}>Cancel</button>
                    {/* We use the react-hook-form validator onClick here to avoid submitting the form */}
                    {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                    <button type="submit" onClick={handleSubmit( onValidSubmit, onInvalidSubmit )}>
                        { isEdit ? "Update" : "Create" }
                    </button>

                </Form>
            </div>
        </>
    )

}

export default BookingAddEdit