/**
 * This file contains a component for creating or editing a User item
 *
 * @module
 */

import React, { useEffect, useRef, useState } from "react"

import { useForm, type SubmitErrorHandler, type SubmitHandler } from "react-hook-form"
import { Form, useActionData, useLocation, useNavigate } from "react-router-dom"

import { useAppSelector } from "../../store/store"

import type { UsersItemType } from "../../store/reducers/generated/userSlice"
import type { UserCreateRequest } from "../../api-client/types.gen"
import { recentMessagesErrorsToFormErrors } from "../common"
import { camelToHyphenCase } from "../../utils/stringUtils"

import Barcode from "../Barcode.tsx"

/* start:component-unique-imports */
/* end:component-unique-imports */


interface UserAddEditProps {
    user?: UsersItemType
}

interface ActionData {
    error?: string;
    success?: boolean;
}

type ThisFormData = UserCreateRequest

const AccountUserAddEdit: React.FC<UserAddEditProps> = ( { user } ) => {

    const isEdit = Boolean( user )

    const location = useLocation()
    const navigate = useNavigate()

    const searchParams = Object.fromEntries( new URLSearchParams( location.search ).entries() )
    const referralSource = searchParams.s

    const { messages } = useAppSelector( ( state ) => state.users )
    const serverFormErrors = recentMessagesErrorsToFormErrors( messages )

    const formRef = useRef<HTMLFormElement>( null )

    const { register, handleSubmit, formState } = useForm<ThisFormData>()
    const { errors: formStateErrors } = formState
    const formErrors = { ...formStateErrors, ...serverFormErrors }

    const actionData: ActionData | undefined = useActionData() as ActionData | undefined
    useEffect( () => {
        console.log( "User Form Action", actionData )
    }, [ actionData, navigate ] )


    const defaultUser = {
        password        : undefined,
        firstName       : undefined,
        lastName        : undefined,
        email           : undefined,
        profileImageURL : undefined,
        profileText     : undefined,
    }

    const [ editableUser, setEditableUser ] = useState<Partial<UsersItemType>>( user || defaultUser )
    const { updatedAt, firstName, lastName, email, profileImageURL, profileText, fullName, isAdmin, isStaff, id, createdAt, } = editableUser


    const onFormStateChange = ( e: React.ChangeEvent ) =>{
        const target = e.target as HTMLInputElement
        const newValue =
            target.valueAsDate
            || target.valueAsNumber
            || ( target.type === "checkbox" ? target.checked : target.value )

        setEditableUser(
            { ...editableUser, [ target.name ]: newValue }
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
        Object.keys( editableUser ).map(
            key => [ `data-user-${camelToHyphenCase( key )}`, editableUser[ key as keyof typeof editableUser ] ]
        )
    )

    const updatedBanner = <div className="flex-row">
        <div className="alert alert-primary info-box">Details updated.</div>
    </div>

    return (
        <>

            {referralSource === "updated" && updatedBanner}
            <div className="form-wrapper">
                {/* This form will validate using `react-hook-form` from the button below,
                    then when `requestSubmit()` is called in `onValidSubmit()`, it will send
                    the FormData to the action set up in the `react-router-dom` router,
                    which will then dispatch it to the correct Redux thunk. */}

                <Form method="post" id="userAddEditForm" className="form-container" ref={formRef}
                    action={location.pathname}
                    data-user-updated-at={String( updatedAt )}
                    data-user-first-name={firstName}
                    data-user-last-name={lastName}
                    data-user-email={email}
                    data-user-profile-image-url={String( profileImageURL )}
                    data-user-profile-text={String( profileText )}
                    data-user-full-name={String( fullName )}
                    data-user-is-admin={String( isAdmin )}
                    data-user-is-staff={String( isStaff )}
                    data-user-id={String( id )}
                    data-user-created-at={createdAt}
                    {...formDataAttrs}
                >


                    <div className="form-grid">

                        <div style={{ alignSelf: "center" }}></div>
                        <div className="form-header">
                            <h1 className="page-header" style={{ justifySelf: "flex-start" }}>{user ? "Update User" : "New User"}</h1>
                            <Barcode value="USER"/>
                        </div>


                        <div style={{ display: "none" }}>
                            <input type="hidden" id="id" name="id" value={String( id )}/>
                            <input type="hidden" id="successURL" name="successURL" value="/account?s=updated" readOnly/>
                        </div>


                        <label>
                            First Name:
                            {formErrors.firstName && <div className="form-errors"><small>{formErrors.firstName.message}</small></div>}
                        </label>
                        <input
                            type="text"
                            value={firstName || ""}
                            aria-invalid={formErrors.firstName ? "true" : "false"}
                            required

                            {...register( "firstName", {
                                onChange : onFormStateChange,
                                required : "First Name is required"
                            } )}
                        />

                        <label>
                            Last Name:
                            {formErrors.lastName && <div className="form-errors"><small>{formErrors.lastName.message}</small></div>}
                        </label>
                        <input
                            type="text"
                            value={lastName || ""}
                            aria-invalid={formErrors.lastName ? "true" : "false"}
                            required

                            {...register( "lastName", {
                                onChange : onFormStateChange,
                                required : "Last Name is required"
                            } )}
                        />

                        <label>
                            Email:
                            {formErrors.email && <div className="form-errors"><small>{formErrors.email.message}</small></div>}
                        </label>
                        <input
                            type="text"
                            value={email || ""}
                            aria-invalid={formErrors.email ? "true" : "false"}
                            required

                            {...register( "email", {
                                onChange : onFormStateChange,
                                required : "Email is required"
                            } )}
                        />

                        <label>
                            Profile Image URL:
                            {formErrors.profileImageURL && <div className="form-errors"><small>{formErrors.profileImageURL.message}</small></div>}
                        </label>
                        <input
                            type="text"
                            value={profileImageURL || ""}
                            aria-invalid={formErrors.profileImageURL ? "true" : "false"}

                            {...register( "profileImageURL", {
                                onChange: onFormStateChange,
                            } )}
                        />

                        <label>
                            Profile Text:
                            {formErrors.profileText && <div className="form-errors"><small>{formErrors.profileText.message}</small></div>}
                        </label>
                        <input
                            type="text"
                            value={profileText || ""}
                            aria-invalid={formErrors.profileText ? "true" : "false"}

                            {...register( "profileText", {
                                onChange: onFormStateChange,
                            } )}
                        />

                    </div>

                    {actionData?.error && <span>{actionData.error}</span>}

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

export default AccountUserAddEdit