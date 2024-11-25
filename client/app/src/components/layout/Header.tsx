/**
 * This file contains the component for the application pages header
 * @module
 */
import React from "react"

import { useLocation, Link } from "react-router-dom"
import { navLinks, adminNavLinks, accountNavLinksGroups } from "../../router/navigation"
import { useAppSelector, type RootState } from "../../store/store"


const Header: React.FC = () => {

    const location = useLocation()

    const { extraState } = useAppSelector( ( state: RootState ) => state.auth )

    const accessToken = extraState.jwtResponse?.access_token
    const currentUser = extraState.jwtResponse?.user
    const currentUserIsAdmin = accessToken && Boolean( currentUser?.isAdmin )

    const accountNavLinks = currentUser ? accountNavLinksGroups.user : accountNavLinksGroups.noUser

    // useEffect( () => {
    // }, [ currentUser ] )


    return (
        <nav id="header" className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">

                <Link to="/#" className="navbar-brand" >Bobs Garage</Link>

                <button className="navbar-toggler" type="button"
                    data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
                    aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        {
                            navLinks.map( navLink => {
                                const isCurrentPage = navLink.path === location.pathname
                                return (
                                    <Link to={navLink.path}
                                        key={navLink.path}
                                        className={`nav-link ${isCurrentPage && "active"}`}
                                        aria-current={isCurrentPage ? "page" : undefined}
                                    >{navLink.text}</Link>
                                )
                            } )
                        }
                    </div>
                </div>

                <div className="navbar-nav ms-auto">
                    {currentUserIsAdmin &&
                    <li className="nav-item dropdown">
                        <a href="#" className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Admin
                        </a>
                        <ul className="dropdown-menu">
                            {/* <li><hr className="dropdown-divider"/></li> */}
                            {
                                adminNavLinks.map( navLink => {
                                    const isCurrentPage = navLink.path.toString() === location.pathname
                                    return (
                                        <Link to={navLink.path}
                                            key={navLink.path}
                                            className={`dropdown-item ${isCurrentPage ? "active" : ""}`}
                                            aria-current={isCurrentPage ? "page" : undefined}
                                        >{navLink.text}</Link>
                                    )
                                } )
                            }
                        </ul>
                    </li>
                    }

                    <div className="navbar-nav">
                        {
                            accountNavLinks.map( navLink => {
                                const isCurrentPage = navLink.path === location.pathname
                                return (
                                    <Link to={navLink.path}
                                        key={navLink.path}
                                        className={`nav-link ${isCurrentPage && "active"}`}
                                        aria-current={isCurrentPage ? "page" : undefined}
                                    >{navLink.text}</Link>
                                )
                            } )
                        }
                    </div>
                </div>

            </div>
        </nav>
    )
}


export default Header