/**
 * This file contains the component for the users account page
 * @module
 */


import React from "react"
import AccountUserAddEdit from "../components/account/AccountUserAddEdit"
import { useAppSelector, type RootState } from "../store/store"
import BookingsList from "../components/generated/bookings/BookingsList"
import { SliceStatus, type ApiErrorsTypeIntersection } from "../store/storeTypes"
import { errorsElement, loader } from "../components/common"


const AccountPage: React.FC = () => {

    const { data: users, status, errors, messages } = useAppSelector( ( state: RootState ) => state.users )
    const { data: bookings } = useAppSelector( ( state: RootState ) => state.bookings )

    const recentFailureMessages = messages.filter(
        ( message ) => message.fromThunkState === "rejected" && ( new Date().getTime() - message.createdAt < 900 )
    )
    const displayFailureMessage = recentFailureMessages[ recentFailureMessages.length - 1 ]?.message


    const { extraState } = useAppSelector( ( state: RootState ) => state.auth )

    const currentUser = extraState.jwtResponse?.user
    if ( !currentUser )
        throw new Error( "Action not permitted without user" )


    const targetUser = users.find( b => b.id === currentUser.id )

    return (
        <>
            {status === SliceStatus.Loading ? loader : null}
            {
                displayFailureMessage && errors
                    ? errorsElement( displayFailureMessage, errors as ApiErrorsTypeIntersection[] )
                    : null
            }

            <div className="flex-column flex-gap-50">
                <div>
                    <AccountUserAddEdit user={targetUser}/>
                </div>

                <div>
                    <BookingsList bookings={bookings}/>
                </div>
            </div>
        </>
    )
}

export default AccountPage