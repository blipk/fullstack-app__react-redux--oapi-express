/**
 * This file contains some functions and variables common to many components
 * @module
 */

import type { ApiErrorsTypeIntersection, ApiErrorsTypeUnion, SliceStateMessage } from "../store/storeTypes"

const loader = <p>🌀 Loading...</p>

const errorsElement = ( message: string, errors: ApiErrorsTypeIntersection[] ): JSX.Element =>
    <div>
        {message} - {errors.map(
            ( err, i ) =>
                <div key={i}>
                    <p>{err.message}{err.details ? " - " + err.details : ""}</p>
                    <code>{err.expandedDetails && JSON.stringify( err.expandedDetails, undefined, "\n" )}</code>
                </div>
        )}
    </div>

/** Gets the errors from recently rejected thunk messages and converts them to form errors with {@link serverErrorsToFormErrors} */
const recentMessagesErrorsToFormErrors = (
    messages: SliceStateMessage[]
): Record<string, Array<{message: string}>> | undefined => {

    const recentFailureMessages = messages.filter(
        ( message ) => message.fromThunkState === "rejected" && ( new Date().getTime() - message.createdAt < 900 )
    )

    const serverFormErrors = serverErrorsToFormErrors( recentFailureMessages[ recentFailureMessages.length - 1 ]?.errors )
    return serverFormErrors
}

/** Convert the `expandedDetails` property from the servers `class-validator` error responses into a format usable by app forms  */
const serverErrorsToFormErrors = (
    errors?: ApiErrorsTypeIntersection[] | ApiErrorsTypeUnion[]
): Record<string, Array<{message: string}>> | undefined => {

    const serverFormErrorsWithModelName = errors && errors.length && ( errors[ 0 ] as ApiErrorsTypeIntersection ).expandedDetails
        ? ( errors[ 0 ] as ApiErrorsTypeIntersection ).expandedDetails
        : undefined

    const serverFormErrors = serverFormErrorsWithModelName
        && Object.fromEntries(
            Object.entries( serverFormErrorsWithModelName ).map(
                ( ( [ modelAndFieldname, messages ] ) => {
                    const split = modelAndFieldname.split( "." )
                    return [ split[ split.length-1 ], messages ]
                } )
            )
        )

    return serverFormErrors
}

export {
    loader,
    errorsElement,

    serverErrorsToFormErrors,
    recentMessagesErrorsToFormErrors,
}