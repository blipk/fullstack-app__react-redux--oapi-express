/**
 * This file contains the component for the auth register form
 * @module
 */
import React, { useEffect, useRef, useState } from "react"

import { useForm, type SubmitErrorHandler, type SubmitHandler } from "react-hook-form"
import { Form, useActionData, useNavigate } from "react-router-dom"
import type { AuthRegisterRequestBody } from "../../api-client/types.gen"
import { recentMessagesErrorsToFormErrors } from "../common"
import { useAppSelector } from "../../store/store"


interface ActionData {
    error?: string;
    success?: boolean;
}

type ThisFormData = AuthRegisterRequestBody & {
    confirmPassword: string;
};


const Register: React.FC = ( ) => {

    const { messages } = useAppSelector( ( state ) => state.auth )
    const serverFormErrors = recentMessagesErrorsToFormErrors( messages )


    const formRef = useRef<HTMLFormElement>( null )
    const defaultFormData: ThisFormData = {
        password        : "",
        confirmPassword : "",
        firstName       : "",
        lastName        : "",
        email           : "",
        profileImageURL : ""
    }

    const [ editableFormData, setEditableFormData ] = useState<ThisFormData>( defaultFormData )
    const { firstName, lastName, email, password, confirmPassword, profileImageURL: _profileImageURL } = editableFormData

    const { register, handleSubmit, formState } = useForm<ThisFormData>()
    const { errors: formStateErrors } = formState
    const formErrors = { ...formStateErrors, ...serverFormErrors }

    const actionData: ActionData | undefined = useActionData() as ActionData | undefined


    const onValidSubmit: SubmitHandler<ThisFormData> = ( data, event? ): void => {
        console.log( "onValidSubmit", data, event )

        // Request submission on the form to pass to the action set up in the route in `react-router-dom`
        formRef.current?.requestSubmit()
    }

    const onInvalidSubmit: SubmitErrorHandler<ThisFormData> = ( errors, event? ): void => {
        console.log( "onInvalidSubmit", errors, event )
    }

    const navigate = useNavigate()
    useEffect( () => {
        if ( actionData?.success )
            console.log( "SUCCESS" )

    }, [ actionData, navigate ] )

    const onFormStateChange = ( e: React.ChangeEvent ) =>{
        const target = e.target as HTMLInputElement
        setEditableFormData(
            { ...editableFormData, [ target.name ]: target.value }
        )
    }

    return (
        <>

            <h1 className="page-header">Join</h1>

            <div className="form-wrapper">
                {/* This form will validate using `react-hook-form` from the button below,
                    then when `requestSubmit()` is called in `onValidSubmit()`, it will send
                    the FormData to the action set up in the `react-router-dom` router,
                    which will then dispatch it to the correct Redux thunk. */}
                <Form method="post" id="loginForm" className="form-container" ref={formRef}>
                    <div className="form-grid">

                        <label>
                            Email:
                            {formErrors.email && <div className="form-errors"><small>{formErrors.email.message}</small></div>}
                        </label>
                        <input
                            type="email"
                            value={email}
                            required
                            aria-invalid={formErrors.email ? "true" : "false"}
                            {...register( "email", {
                                onChange : onFormStateChange,
                                required : "Email is required",
                                pattern  : {
                                    value   : /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                    message : "Invalid email address",
                                }
                            } )}
                        />

                        <label>
                            Password:
                            {formErrors.password && <div className="form-errors"><small>{formErrors.password.message}</small></div>}
                        </label>
                        <input
                            type="password"
                            value={password}
                            required
                            aria-invalid={formErrors.password ? "true" : "false"}
                            {...register( "password", {
                                onChange : onFormStateChange,
                                required : "Password is required"
                            } )}
                        />

                        <label>
                            Confirm Password:
                            {formErrors.confirmPassword && <div className="form-errors"><small>{formErrors.confirmPassword.message}</small></div>}
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            required
                            aria-invalid={formErrors.confirmPassword ? "true" : "false"}
                            {...register( "confirmPassword", {
                                onChange : onFormStateChange,
                                required : "Please confirm your password",
                                validate : ( value ) => value === password || "Passwords do not match",
                            } )}
                        />

                        <label>
                            First Name:
                            {formErrors.firstName && <div className="form-errors"><small>{formErrors.firstName.message}</small></div>}
                        </label>
                        <input
                            type="text"
                            value={firstName}
                            required
                            aria-invalid={formErrors.firstName ? "true" : "false"}
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
                            value={lastName}
                            required
                            aria-invalid={formErrors.lastName ? "true" : "false"}
                            {...register( "lastName", {
                                onChange : onFormStateChange,
                                required : "Last Name is required"
                            } )}
                        />
                    </div>

                    {actionData?.error && <span>{actionData.error}</span>}

                    {/* We use the react-hook-form validator onClick here to avoid submitting the form */}
                    {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                    <button type="submit" onClick={handleSubmit( onValidSubmit, onInvalidSubmit )}>
                        Join
                    </button>

                </Form>
            </div>
        </>
    )

}

export default Register