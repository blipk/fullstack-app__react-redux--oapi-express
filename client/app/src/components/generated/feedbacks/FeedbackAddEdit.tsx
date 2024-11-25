/**
 * This file contains a component for creating or editing a Feedback item
 *
 * @module
 */

import React, { useEffect, useRef, useState } from "react"

import { useForm, type SubmitErrorHandler, type SubmitHandler } from "react-hook-form"
import { Form, useActionData, useLocation, useNavigate } from "react-router-dom"

import { useAppSelector } from "../../../store/store"

import type { FeedbacksItemType } from "../../../store/reducers/generated/feedbackSlice"
import type { FeedbackCreateRequest } from "../../../api-client/types.gen"
import { recentMessagesErrorsToFormErrors } from "../../common"
import { camelToHyphenCase } from "../../../utils/stringUtils"

import Barcode from "../../Barcode.tsx"

/* start:component-unique-imports */
/* end:component-unique-imports */


interface FeedbackAddEditProps {
    feedback?: FeedbacksItemType
}

interface ActionData {
    error?: string;
    success?: boolean;
}

type ThisFormData = FeedbackCreateRequest

const FeedbackAddEdit: React.FC<FeedbackAddEditProps> = ( { feedback } ) => {

    /* start:component-unique-content-pre */
    //TEST
    /* end:component-unique-content-pre */

    const isEdit = Boolean( feedback )

    const location = useLocation()
    const navigate = useNavigate()

    const { messages } = useAppSelector( ( state ) => state.feedbacks )
    const serverFormErrors = recentMessagesErrorsToFormErrors( messages )

    const formRef = useRef<HTMLFormElement>( null )

    const { register, handleSubmit, formState } = useForm<ThisFormData>()
    const { errors: formStateErrors } = formState
    const formErrors = { ...formStateErrors, ...serverFormErrors }

    const actionData: ActionData | undefined = useActionData() as ActionData | undefined
    useEffect( () => {
        console.log( "Feedback Form Action", actionData )
    }, [ actionData, navigate ] )


    const { extraState: authExtraState } = useAppSelector( ( state ) => state.auth )

    const defaultFeedback = {
        authorName : undefined,
        title      : undefined,
        content    : undefined,
        isPublic   : undefined,
        userId     : authExtraState.jwtResponse?.user.id,
        user       : undefined,
    }

    const [ editableFeedback, setEditableFeedback ] = useState<Partial<FeedbacksItemType>>( feedback || defaultFeedback )
    const { updatedAt, id, createdAt, authorName, title, content, isPublic, userId, user, } = editableFeedback


    const onFormStateChange = ( e: React.ChangeEvent ) =>{
        const target = e.target as HTMLInputElement
        const newValue =
            target.valueAsDate
            || target.valueAsNumber
            || ( target.type === "checkbox" ? target.checked : target.value )

        setEditableFeedback(
            { ...editableFeedback, [ target.name ]: newValue }
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
        Object.keys( editableFeedback ).map(
            key => [ `data-feedback-${camelToHyphenCase( key )}`, editableFeedback[ key as keyof typeof editableFeedback ] ]
        )
    )

    /* start:component-unique-content */
    const currentUser = authExtraState.jwtResponse?.user
    /* end:component-unique-content */

    return (
        <>
            <div className="form-wrapper add-edit-form">
                {/* This form will validate using `react-hook-form` from the button below,
                    then when `requestSubmit()` is called in `onValidSubmit()`, it will send
                    the FormData to the action set up in the `react-router-dom` router,
                    which will then dispatch it to the correct Redux thunk. */}

                <Form method="post" id="feedbackAddEditForm" className="form-container" ref={formRef}
                    action={location.pathname}
                    data-feedback-updated-at={updatedAt}
                    data-feedback-id={id}
                    data-feedback-created-at={createdAt}
                    data-feedback-author-name={authorName}
                    data-feedback-title={title}
                    data-feedback-content={content}
                    data-feedback-is-public={isPublic}
                    data-feedback-user-id={userId}
                    data-feedback-user={user}
                    {...formDataAttrs}
                >

                    <div style={{ display: "none" }}>
                        <input type="hidden" id="userId" name="userId" value={ userId || undefined }/>
                    </div>

                    <div className="form-grid">

                        <div style={{ alignSelf: "center" }}></div>
                        <div className="form-header">
                            <h1 className="page-header" style={{ justifySelf: "flex-start" }}>
                                {feedback ? "Update Feedback" : "New Feedback"}
                            </h1>
                            <Barcode value="FEEDBACK"/>
                        </div>

                        {/* start:component-unique-jsx */}
                        {currentUser?.isAdmin
                            ? <>
                                <label>
                                    Is Public:
                                    {formErrors.isPublic && <div className="form-errors"><small>{formErrors.isPublic.message}</small></div>}
                                </label>
                                <input
                                    type="checkbox"
                                    checked={isPublic}
                                    value={Boolean( isPublic ).toString() || ""}
                                    aria-invalid={formErrors.isPublic ? "true" : "false"}

                                    {...register( "isPublic", {
                                        onChange: onFormStateChange,
                                    } )}
                                />
                            </>
                            : <>
                                <input type="hidden" id="isPublic" name="isPublic" value={"false"}/>
                            </>
                        }
                        {!currentUser &&
                            <>
                                <label>
                                    Your Name:
                                    {formErrors.authorName && <div className="form-errors"><small>{formErrors.authorName.message}</small></div>}
                                </label>
                                <input
                                    type="text"
                                    value={authorName || ""}
                                    aria-invalid={formErrors.authorName ? "true" : "false"}
                                    required

                                    {...register( "authorName", {
                                        onChange : onFormStateChange,
                                        required : "Author Name is required"
                                    } )}
                                />
                            </>
                        }
                        {/* end:component-unique-jsx */}

                        <label>
                            Title:
                            {formErrors.title && <div className="form-errors"><small>{formErrors.title.message}</small></div>}
                        </label>
                        <input
                            type="text"
                            value={title || ""}
                            aria-invalid={formErrors.title ? "true" : "false"}
                            required

                            {...register( "title", {
                                onChange : onFormStateChange,
                                required : "Title is required"
                            } )}
                        />

                        <label>
                            Content:
                            {formErrors.content && <div className="form-errors"><small>{formErrors.content.message}</small></div>}
                        </label>
                        <textarea
                            value={content || ""}
                            aria-invalid={formErrors.content ? "true" : "false"}
                            required

                            {...register( "content", {
                                onChange : onFormStateChange,
                                required : "Content is required"
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

export default FeedbackAddEdit