/**
 * This file contains a component for creating or editing a Tag item
 *
 * @module
 */

import React, { useEffect, useRef, useState } from "react"

import { useForm, type SubmitErrorHandler, type SubmitHandler } from "react-hook-form"
import { Form, useActionData, useLocation, useNavigate } from "react-router-dom"

import { useAppSelector } from "../../../store/store"

import type { TagsItemType } from "../../../store/reducers/generated/tagSlice"
import type { TagCreateRequest } from "../../../api-client/types.gen"
import { recentMessagesErrorsToFormErrors } from "../../common"
import { camelToHyphenCase } from "../../../utils/stringUtils"

import Barcode from "../../Barcode.tsx"

/* start:component-unique-imports */
/* end:component-unique-imports */


interface TagAddEditProps {
    tag?: TagsItemType
}

interface ActionData {
    error?: string;
    success?: boolean;
}

type ThisFormData = TagCreateRequest

const TagAddEdit: React.FC<TagAddEditProps> = ( { tag } ) => {

    /* start:component-unique-content-pre */
    /* end:component-unique-content-pre */

    const isEdit = Boolean( tag )

    const location = useLocation()
    const navigate = useNavigate()

    const { messages } = useAppSelector( ( state ) => state.tags )
    const serverFormErrors = recentMessagesErrorsToFormErrors( messages )

    const formRef = useRef<HTMLFormElement>( null )

    const { register, handleSubmit, formState } = useForm<ThisFormData>()
    const { errors: formStateErrors } = formState
    const formErrors = { ...formStateErrors, ...serverFormErrors }

    const actionData: ActionData | undefined = useActionData() as ActionData | undefined
    useEffect( () => {
        console.log( "Tag Form Action", actionData )
    }, [ actionData, navigate ] )


    const defaultTag = {
        name      : undefined,
        cssColour : undefined,
    }

    const [ editableTag, setEditableTag ] = useState<Partial<TagsItemType>>( tag || defaultTag )
    const { name, updatedAt, id, createdAt, cssColour, } = editableTag


    const onFormStateChange = ( e: React.ChangeEvent ) =>{
        const target = e.target as HTMLInputElement
        const newValue =
            target.valueAsDate
            || target.valueAsNumber
            || ( target.type === "checkbox" ? target.checked : target.value )

        setEditableTag(
            { ...editableTag, [ target.name ]: newValue }
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
        Object.keys( editableTag ).map(
            key => [ `data-tag-${camelToHyphenCase( key )}`, editableTag[ key as keyof typeof editableTag ] ]
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

                <Form method="post" id="tagAddEditForm" className="form-container" ref={formRef}
                    action={location.pathname}
                    data-tag-name={name}
                    data-tag-updated-at={updatedAt}
                    data-tag-id={id}
                    data-tag-created-at={createdAt}
                    data-tag-css-colour={cssColour}
                    {...formDataAttrs}
                >

                    <div style={{ display: "none" }}>

                    </div>

                    <div className="form-grid">

                        <div style={{ alignSelf: "center" }}></div>
                        <div className="form-header">
                            <h1 className="page-header" style={{ justifySelf: "flex-start" }}>
                                {tag ? "Update Tag" : "New Tag"}
                            </h1>
                            <Barcode value="TAG"/>
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

                        <label>
                            Css Colour:
                            {formErrors.cssColour && <div className="form-errors"><small>{formErrors.cssColour.message}</small></div>}
                        </label>
                        <input
                            type="color"
                            value={cssColour || ""}
                            aria-invalid={formErrors.cssColour ? "true" : "false"}
                            required

                            {...register( "cssColour", {
                                onChange : onFormStateChange,
                                required : "Css Colour is required"
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

export default TagAddEdit