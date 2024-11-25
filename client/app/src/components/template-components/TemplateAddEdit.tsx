/**
 * This file contains a component for creating or editing a Blog item
 *
 * @module
 */

import React, { useEffect, useRef, useState } from "react"

import { useForm, type SubmitErrorHandler, type SubmitHandler } from "react-hook-form"
import { Form, useActionData, useLocation, useNavigate } from "react-router-dom"

import { useAppSelector } from "../../store/store"

import type { BlogsItemType } from "../../store/reducers/generated/blogSlice"
import type { BlogCreateRequest } from "../../api-client/types.gen"
import { recentMessagesErrorsToFormErrors } from "../common"
import { camelToHyphenCase } from "../../utils/stringUtils"

import Barcode from "../Barcode.tsx"

/* start:component-unique-imports */
import { convertISOToDateInputValue } from "../../utils/timeUtils.ts"
/* end:component-unique-imports */


interface TemplateAddEditProps {
    blog?: BlogsItemType
}

interface ActionData {
    error?: string;
    success?: boolean;
}

type ThisFormData = BlogCreateRequest

const TemplateAddEdit: React.FC<TemplateAddEditProps> = ( { blog } ) => {

    /* start:component-unique-content-pre */
    /* end:component-unique-content-pre */

    const isEdit = Boolean( blog )

    const location = useLocation()
    const navigate = useNavigate()

    const { messages } = useAppSelector( ( state ) => state.blogs )
    const serverFormErrors = recentMessagesErrorsToFormErrors( messages )

    const formRef = useRef<HTMLFormElement>( null )

    const { register, handleSubmit, formState } = useForm<ThisFormData>()
    const { errors: formStateErrors } = formState
    const formErrors = { ...formStateErrors, ...serverFormErrors }

    const actionData: ActionData | undefined = useActionData() as ActionData | undefined
    useEffect( () => {
        console.log( "Blog Form Action", actionData )
    }, [ actionData, navigate ] )


    /* start:form-default-item-type-destructuring */
    const { extraState: authExtraState } = useAppSelector( ( state ) => state.auth )

    const defaultBlog = {
        title         : undefined,
        content       : undefined,
        userId        : authExtraState.jwtResponse?.user.id,
        imageURL      : undefined,
        isPublished   : undefined,
        publishedDate : undefined,
    }
    /* end:form-default-item-type-destructuring */

    const [ editableBlog, setEditableBlog ] = useState<Partial<BlogsItemType>>( blog || defaultBlog )
    /* start:form-item-type-destructuring */
    const { id, createdAt, updatedAt, userId, title, content, imageURL, isPublished, publishedDate, tags, user } = editableBlog
    /* end:form-item-type-destructuring */


    const onFormStateChange = ( e: React.ChangeEvent ) =>{
        const target = e.target as HTMLInputElement
        const newValue =
            target.valueAsDate
            || target.valueAsNumber
            || ( target.type === "checkbox" ? target.checked : target.value )

        setEditableBlog(
            { ...editableBlog, [ target.name ]: newValue }
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
        Object.keys( editableBlog ).map(
            key => [ `data-blog-${camelToHyphenCase( key )}`, editableBlog[ key as keyof typeof editableBlog ] ]
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

                <Form method="post" id="blogAddEditForm" className="form-container" ref={formRef}
                    action={location.pathname}
                    /* start:element-data-attributes */
                    data-blog-id={id}
                    data-blog-created-at={createdAt}
                    data-blog-updated-at={updatedAt}
                    data-blog-title={title}
                    data-blog-content={content}
                    data-blog-user-id={userId}
                    data-blog-image-url={imageURL}
                    data-blog-is-published={isPublished}
                    data-blog-published-date={publishedDate}
                    data-blog-user={user}
                    data-blog-tags={tags}
                    /* end:element-data-attributes */
                    {...formDataAttrs}
                >

                    <div style={{ display: "none" }}>
                        {/* start:form-hidden-inputs */}
                        <input type="hidden" id="userId" name="userId" value={userId}/>
                        {/* end:form-hidden-inputs */}
                    </div>

                    <div className="form-grid">

                        <div style={{ alignSelf: "center" }}></div>
                        <div className="form-header">
                            <h1 className="page-header" style={{ justifySelf: "flex-start" }}>
                                {blog ? "Update Blog" : "New Blog"}
                            </h1>
                            <Barcode value="BLOG"/>
                        </div>

                        {/* start:component-unique-jsx */}
                        {/* end:component-unique-jsx */}


                        {/* start:addedit-form-items */}
                        <label>
                            Title:
                            {formErrors.title && <div className="form-errors"><small>{formErrors.title.message}</small></div>}
                        </label>
                        <input
                            type="text"
                            value={title}
                            required
                            aria-invalid={formErrors.title ? "true" : "false"}
                            {...register( "title", {
                                onChange : onFormStateChange,
                                required : "Title is required"
                            } )}
                        />

                        <label>
                            Image URL:
                            {formErrors.imageURL && <div className="form-errors"><small>{formErrors.imageURL.message}</small></div>}
                        </label>
                        <input
                            type="text"
                            value={imageURL || ""}
                            aria-invalid={formErrors.imageURL ? "true" : "false"}
                            {...register( "imageURL", {
                                onChange: onFormStateChange,
                            } )}
                        />

                        <label>
                            Content:
                            {formErrors.content && <div className="form-errors"><small>{formErrors.content.message}</small></div>}
                        </label>
                        <textarea
                            value={content}
                            required
                            aria-invalid={formErrors.content ? "true" : "false"}

                            {...register( "content", {
                                onChange : onFormStateChange,
                                required : "Content is required"
                            } )}
                        />

                        <label>
                            Published:
                            {formErrors.isPublished && <div className="form-errors"><small>{formErrors.isPublished.message}</small></div>}
                        </label>
                        <input
                            type="checkbox"
                            checked={isPublished}
                            aria-invalid={formErrors.isPublished ? "true" : "false"}
                            {...register( "isPublished", {
                                onChange: onFormStateChange,
                            } )}
                        />

                        <label>
                            Published Date:
                            {formErrors.publishedDate && <div className="form-errors"><small>{formErrors.publishedDate.message}</small></div>}
                        </label>
                        <input
                            type="datetime-local"
                            value={publishedDate && convertISOToDateInputValue( publishedDate, true )}
                            aria-invalid={formErrors.publishedDate ? "true" : "false"}
                            required

                            {...register( "publishedDate", {
                                onChange : onFormStateChange,
                                required : "Published Date is required"
                            } )}
                        />
                        {/* end:addedit-form-items */}

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

export default TemplateAddEdit