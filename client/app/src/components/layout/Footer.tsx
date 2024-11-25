/**
 * This file contains the component for the application pages footer
 * @module
 */
import React from "react"


const Footer: React.FC = () => {
    const date = new Date()
    return (
        <div id="footer">
            <p className="text-end me-4">
                {String.fromCharCode( 169 )} {" " + date.getFullYear().toString()} A.D.
            </p>
        </div>
    )
}


export default Footer