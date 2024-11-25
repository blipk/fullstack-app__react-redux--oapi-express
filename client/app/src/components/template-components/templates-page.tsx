/**
 * This page is the element for the various public routes for Blog's.
 * It handles redux store errors and sets up the correct component to display for CRUD actions.
 *
 * Data loading is handled via redux dispatch in the route loader in {@link router/loader}
 * Data posting is handled via redux dispatch in the route action in {@link router/action}
 *
 * @module
 */
import React from "react"

import { useLocation, useParams } from "react-router-dom"

import { useAppSelector, type RootState } from "../../store/store"
import { SliceStatus, type ApiErrorsTypeIntersection } from "../../store/storeTypes"

import { errorsElement, loader } from "../common"

import "./blogs-style.scss"
import TemplatesDisplay from "./TemplatesDisplay"
import TemplateView from "./TemplateView"
import TemplateAddEdit from "./TemplateAddEdit"


const BlogsPage: React.FC = () => {

    const params = useParams()
    const location = useLocation()
    const { idView, idEdit, idAdd } = params

    const { data: blogs, status, errors, messages } = useAppSelector( ( state: RootState ) => state.blogs )

    const recentFailureMessages = messages.filter(
        ( message ) => message.fromThunkState === "rejected" && ( new Date().getTime() - message.createdAt < 900 )
    )
    const displayFailureMessage = recentFailureMessages[ recentFailureMessages.length - 1 ]?.message

    const targetBlog = blogs.find( b => [ idView, idEdit, idAdd ].includes( String( b.id ) ) ) || blogs[ 0 ]

    const isView = idView && idView !== "add"
    const isAdd = idAdd || idView === "add" || location.pathname.endsWith( "/add" )
    const isEdit = idEdit !== undefined

    /* start:component-unique-content */
    const showComponent = ( isAdd ? true : Boolean( status === SliceStatus.Succeeded ) && blogs.length )
    /* end:component-unique-content */

    const componentContent = isView
        ? <TemplateView blog={targetBlog}/>
        : isEdit
            ? Boolean( blogs.length ) && <TemplateAddEdit blog={targetBlog}/>
            : isAdd
                ? <TemplateAddEdit/>
                : <TemplatesDisplay blogs={blogs}/>

    return (
        <>
            {status === SliceStatus.Loading ? loader : null}
            {
                status === SliceStatus.Failed && displayFailureMessage && errors
                    ? errorsElement( displayFailureMessage, errors as ApiErrorsTypeIntersection[] )
                    : null
            }

            {showComponent && componentContent}
        </>
    )
}

export default BlogsPage
