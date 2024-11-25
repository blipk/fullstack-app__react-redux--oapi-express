/**
 * This file contains the component for the auth login form
 * @module
 */
import React, { useEffect, useRef, useState } from "react"

import { useForm, type SubmitErrorHandler, type SubmitHandler } from "react-hook-form"
import { Form, Link, useActionData, useLocation, useNavigate } from "react-router-dom"

import { useAppSelector } from "../../store/store"
import { recentMessagesErrorsToFormErrors } from "../common"


interface ActionData {
    error?: string;
    success?: boolean;
}

interface ThisFormData extends Record<string, string> {
    username: string;
    password: string;
}

const Login: React.FC = ( ) => {

    const location = useLocation()
    const searchParams = Object.fromEntries( new URLSearchParams( location.search ).entries() )
    const referralSource = searchParams.s

    const { messages } = useAppSelector( ( state ) => state.auth )
    const serverFormErrors = recentMessagesErrorsToFormErrors( messages )


    const formRef = useRef<HTMLFormElement>( null )
    const defaultFormData: ThisFormData = {
        username : "",
        password : "",
    }

    const [ editableFormData, setEditableFormData ] = useState<ThisFormData>( defaultFormData )
    const { username, password } = editableFormData

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

    const bookingReferralbanner = <div className="flex-row">
        <div className="alert alert-primary info-box">Please Login or <Link to="/join">Join</Link> to make a booking with us.</div>
    </div>

    const displayNewSignupBanner = searchParams.s === "new"
    const newSignupBanner = <div className="flex-row">
        <div className="alert alert-primary info-box">Thanks for registering, you can now login.</div>
    </div>

    return (
        <>
            <h1 className="page-header">Login</h1>

            {referralSource === "booking" && bookingReferralbanner}

            {displayNewSignupBanner && newSignupBanner}


            <div className="form-wrapper">
                {/* This form will validate using `react-hook-form` from the button below,
                    then when `requestSubmit()` is called in `onValidSubmit()`, it will send
                    the FormData to the action set up in the `react-router-dom` router,
                    which will then dispatch it to the correct Redux thunk. */}
                <Form method="post" id="loginForm" className="form-container" ref={formRef}>

                    <div className="form-grid">
                        <label>
                            Email:
                            {formErrors.username && <div className="form-errors"><small>{formErrors.username.message}</small></div>}
                        </label>
                        <input
                            type="email"
                            value={username}
                            required
                            aria-invalid={formErrors.username ? "true" : "false"}
                            {...register( "username", {
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
                            aria-invalid={formErrors.password ? "true" : "false"}
                            required
                            {...register( "password", {
                                onChange : onFormStateChange,
                                required : "Password is required"
                            } )}
                        />
                    </div>

                    {actionData?.error && <span>{actionData.error}</span>}

                    {/* We use the react-hook-form validator onClick here to avoid submitting the form */}
                    {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                    <button type="submit" onClick={handleSubmit( onValidSubmit, onInvalidSubmit )}>
                        Login
                    </button>

                </Form>
            </div>
        </>
    )

}

export default Login