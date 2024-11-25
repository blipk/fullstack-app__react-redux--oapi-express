/**
 * This file contains a component for creating or editing a Role item
 *
 * @module
 */

import React, { useEffect, useRef, useState } from "react"

import { useForm, type SubmitErrorHandler, type SubmitHandler } from "react-hook-form"
import { Form, useActionData, useLocation, useNavigate } from "react-router-dom"

import { useAppSelector } from "../../../store/store"

import type { RolesItemType } from "../../../store/reducers/generated/roleSlice"
import type { RoleCreateRequest } from "../../../api-client/types.gen"
import { recentMessagesErrorsToFormErrors } from "../../common"
import { camelToHyphenCase } from "../../../utils/stringUtils"

import Barcode from "../../Barcode.tsx"

/* start:component-unique-imports */
/* end:component-unique-imports */


interface RoleAddEditProps {
    role?: RolesItemType
}

interface ActionData {
    error?: string;
    success?: boolean;
}

type ThisFormData = RoleCreateRequest

const RoleAddEdit: React.FC<RoleAddEditProps> = ( { role } ) => {

    /* start:component-unique-content-pre */
    /* end:component-unique-content-pre */

    const isEdit = Boolean( role )

    const location = useLocation()
    const navigate = useNavigate()

    const { messages } = useAppSelector( ( state ) => state.roles )
    const serverFormErrors = recentMessagesErrorsToFormErrors( messages )

    const formRef = useRef<HTMLFormElement>( null )

    const { register, handleSubmit, formState } = useForm<ThisFormData>()
    const { errors: formStateErrors } = formState
    const formErrors = { ...formStateErrors, ...serverFormErrors }

    const actionData: ActionData | undefined = useActionData() as ActionData | undefined
    useEffect( () => {
        console.log( "Role Form Action", actionData )
    }, [ actionData, navigate ] )


    const defaultRole = {
        name: undefined,
    }

    const [ editableRole, setEditableRole ] = useState<Partial<RolesItemType>>( role || defaultRole )
    const { name, updatedAt, id, createdAt, } = editableRole


    const onFormStateChange = ( e: React.ChangeEvent ) =>{
        const target = e.target as HTMLInputElement
        const newValue =
            target.valueAsDate
            || target.valueAsNumber
            || ( target.type === "checkbox" ? target.checked : target.value )

        setEditableRole(
            { ...editableRole, [ target.name ]: newValue }
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
        Object.keys( editableRole ).map(
            key => [ `data-role-${camelToHyphenCase( key )}`, editableRole[ key as keyof typeof editableRole ] ]
        )
    )

    /* start:component-unique-content */
    /* end:component-unique-content */

    return (
        <>
            <div className="form-wrapper add-edit-form">
                {/* This form will validate using `react-hook-form` from the button below,
                    then when `requestSubmit()` is called in `onValidSubmit()`, it will send
                    the FormData to the action set up in the `react-router-dom` router,
                    which will then dispatch it to the correct Redux thunk. */}

                <Form method="post" id="roleAddEditForm" className="form-container" ref={formRef}
                    action={location.pathname}
                    data-role-name={name}
                    data-role-updated-at={updatedAt}
                    data-role-id={id}
                    data-role-created-at={createdAt}
                    {...formDataAttrs}
                >

                    <div style={{ display: "none" }}>

                    </div>

                    <div className="form-grid">

                        <div style={{ alignSelf: "center" }}></div>
                        <div className="form-header">
                            <h1 className="page-header" style={{ justifySelf: "flex-start" }}>
                                {role ? "Update Role" : "New Role"}
                            </h1>
                            <Barcode value="ROLE"/>
                        </div>

                        {/* start:component-unique-jsx */}
                        {/* end:component-unique-jsx */}

                        <label>
                            Name:
                            {formErrors.name && <div className="form-errors"><small>{formErrors.name.message}</small></div>}
                        </label>
                        <input
                            type="text"
                            value={name || ""}
                            aria-invalid={formErrors.name ? "true" : "false"}
                            required

                            {...register( "name", {
                                onChange : onFormStateChange,
                                required : "Name is required"
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

export default RoleAddEdit