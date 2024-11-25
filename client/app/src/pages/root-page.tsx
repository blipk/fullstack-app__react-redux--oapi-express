/**
 * This file contains the applications root page element for the react-router-dom router
 * @module
 */

import React from "react"

import { Outlet } from "react-router-dom"

import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"

import "../css/app.css"
import "../components/utility.scss"
import "../components/components-style.scss"



import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"


const RootPage: React.FC = () => {

    // CONSIDER any usage of React.memo() and useMemo() - check component hierarchy with Date.now()
    // https://www.freecodecamp.org/news/react-compiler-complete-guide-react-19/

    return (
        <>
            <Header />
            <div id="content">
                <div className="flex-grow">
                    <Outlet />
                </div>
                <Footer/>
            </div>
        </>
    )
}

export default RootPage
