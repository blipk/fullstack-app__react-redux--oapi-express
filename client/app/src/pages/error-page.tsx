import React from "react"
import { useRouteError } from "react-router-dom"
import { errorsElement } from "../components/common"
import type { ApiErrorsTypeIntersection } from "../store/storeTypes"

// Define the type for the error object
interface RouteError {
    statusText?: string;
    message?: string;
    errors?: ApiErrorsTypeIntersection[]

    status?: number
    data?: unknown
}

const ErrorPage: React.FC = () => {
    const error = useRouteError() as RouteError
    console.error( "ErrorPage:", error )

    const hasStatusCode = error.status
    const message = hasStatusCode
        ? `${error.status} - ${error.statusText || error.message}`
        : error.statusText || error.message
    const errorMessage = message || `Error ${error.status}`

    return (
        <div id="error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>

            {error.errors
                ? <i>{errorsElement( errorMessage, error.errors )}</i>
                : <p>
                    <i>{errorMessage}</i>
                </p>
            }
        </div>
    )
}

export default ErrorPage