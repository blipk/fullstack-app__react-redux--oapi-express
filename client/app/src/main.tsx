/**
 * This is the main entry point for the frontend - it loads react, react-router and the redux provider
 * @module
 */
import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"

import { Provider } from "react-redux"
import { store } from "./store/store.ts"
import { router } from "./router/router.tsx"

import "./css/index.css"


const rootElement = document.getElementById( "root" ) ?? document.body.appendChild( document.createElement( "div", {} ) )
rootElement.setAttribute( "id", "root" )
const root = ReactDOM.createRoot( rootElement )

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </React.StrictMode>,
)