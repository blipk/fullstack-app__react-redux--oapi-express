/**
 * This file contains a component for displaying users in a nice view for the public
 * @module
 */
import React from "react"

import UsersDisplayItem from "./UsersDisplayItem"
import type { UsersItemType } from "../../../store/reducers/generated/userSlice"

/* start:component-unique-imports */
/* end:component-unique-imports */


interface UsersDisplayProps {
    users: UsersItemType[]
}

const UsersDisplay: React.FC<UsersDisplayProps> = ( { users } ) => {

    /* start:component-unique-content */
    /* end:component-unique-content */

    return (
        <>

            {/* start:component-unique-jsx */}
            <h1 className="page-header">Bob's Garage</h1>

            <div>
                <p>
                    Welcome to Bob's Garage, your trusted partner in automotive care and repair.
                </p>
                <p>
                    Nestled in the heart of our community,
                    Bob's Garage has been dedicated to keeping you and your vehicle safe on the road since 1991.
                </p>
                <p>We take pride in offering top-notch service with a personal touch, ensuring every customer feels like part of our family.</p>
            </div>

            <div className="history-display">
                <h2>Our History</h2>
                <p>
                    Bob's Garage was founded by Bob Bobbington,
                    a passionate car enthusiast with a dream of creating a space where quality craftsmanship meets exceptional customer service.
                </p>
                <p>
                    Over the years, Bob's vision has grown into a thriving business, known for its honesty, reliability, and commitment to excellence.
                </p>

            </div>


            <div className="users-display">

                <h2>Our Team</h2>
                <div className="users-display-grid">
                    {
                        users.map( user => (
                            <UsersDisplayItem key={user.id} user={user} />
                        ) )
                    }
                </div>

            </div>
            {/* end:component-unique-jsx */}

        </>
    )

}

export default UsersDisplay