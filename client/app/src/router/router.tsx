/**
 * This file contains the router instance for react-router-dom
 * @module
 */

import type React from "react"
import { createBrowserRouter, type ActionFunction, type LoaderFunction, type RouteObject } from "react-router-dom"

import RootPage from "../pages/root-page.tsx"
import ErrorPage from "../pages/error-page.tsx"

import MainPage from "../pages/main-page.tsx"

import AuthPage from "../pages/auth-page.tsx"
import AdminPage from "../pages/admin-page.tsx"
import AccountPage from "../pages/account-page.tsx"

import BlogsAdminPage from "../components/generated/blogs/blogs-admin-page.tsx"
import BookingsAdminPage from "../components/generated/bookings/bookings-admin-page.tsx"
import FeedbacksAdminPage from "../components/generated/feedbacks/feedbacks-admin-page.tsx"
import RolesAdminPage from "../components/generated/roles/roles-admin-page.tsx"
import TagsAdminPage from "../components/generated/tags/tags-admin-page.tsx"
import UsersAdminPage from "../components/generated/users/users-admin-page.tsx"
import BookingTypesAdminPage from "../components/generated/bookingtypes/bookingTypes-admin-page.tsx"


import BlogsPage from "../components/generated/blogs/blogs-page.tsx"
import BookingsPage from "../components/generated/bookings/bookings-page.tsx"
import FeedbacksPage from "../components/generated/feedbacks/feedbacks-page.tsx"
import RolesPage from "../components/generated/roles/roles-page.tsx"
import TagsPage from "../components/generated/tags/tags-page.tsx"
import UsersPage from "../components/generated/users/users-page.tsx"

import {
    logoutAuthUnLoader,
    accountDispatcherLoader,
    mainPageLoader,

    blogDispatchLoader,
    blogsDispatchLoaderAdmin,
    blogsDispatchLoader,
    bookingDispatchLoader,
    bookingsDispatchLoaderAdmin,
    bookingsDispatchLoader,
    feedbackDispatchLoader,
    feedbacksDispatchLoaderAdmin,
    feedbacksDispatchLoader,
    roleDispatchLoader,
    rolesDispatchLoaderAdmin,
    rolesDispatchLoader,
    tagDispatchLoader,
    tagsDispatchLoaderAdmin,
    tagsDispatchLoader,
    userDispatchLoader,
    usersDispatchLoaderAdmin,
    usersDispatchLoader,
    bookingTypesDispatchLoaderAdmin,
    bookingTypeDispatchLoader,
    bookingTypesDispatchLoader,
} from "./loaders.ts"
import {
    loginAuthDispatcherAction,
    registerAuthDispatcherAction,

    blogsCreateDispatcherAction,
    blogsUpdateDispatcherAction,
    bookingsCreateDispatcherAction,
    bookingsUpdateDispatcherAction,
    feedbacksCreateDispatcherAction,
    feedbacksUpdateDispatcherAction,
    rolesCreateDispatcherAction,
    rolesUpdateDispatcherAction,
    tagsCreateDispatcherAction,
    tagsUpdateDispatcherAction,
    usersCreateDispatcherAction,
    usersUpdateDispatcherAction,
    bookingTypesCreateDispatcherAction,
    bookingTypesUpdateDispatcherAction,
} from "./actions.ts"


/**
 * The name to give the named aprameters for each of the page types
 *
 * @param view - Param for the view page, default is `:idView`
 * @param add - Param for the add page, default is `:idAdd`
 * @param edit - Param for the edit page, default is `:idEdit`
 */
interface ParamNamesOptions {
    view?: string
    add?: string,
    edit?: string
}

/**
 * Options for {@link routeMapper}
 *
 * @param includeEdit - If true, include a /edit/ route from the path base
 * @param includeEdit - If true, include a /add/ route from the path base
 * @param includeView - If true, include the /:idView route from the path base
 * @param paramNames - The name for the named route parameter for each of the pages - see {@link ParamNamesOptions}
 */
interface RouteMapperOptions {
    includeView?: boolean
    includeEdit?: boolean
    includeAdd?: boolean
    paramNames?: ParamNamesOptions
}

/** Default options for {@link routeMapper} */
const routeMapperDefaultOptions: RouteMapperOptions = {
    includeView : true,
    includeEdit : false,
    includeAdd  : false,
    paramNames  : {
        "view" : "idView",
        "add"  : "idAdd",
        "edit" : "idEdit"
    }
}

/**
 * Function that maps page components to the required `RouteObject`'s
 *
 * @param pagePathBase - The base path for the page
 * @param PageComponent - The page component that handles the routes
 * @param loaderOne - The loader function that loads a single item
 * @param loaderAll - The loader function that loads multiple items
 * @param options - Options for this function
 * @returns
 */
const routeMapper = (
    pagePathBase: string,
    PageComponent: React.ComponentType,
    loaderOne: LoaderFunction | undefined,
    loaderAll: LoaderFunction | undefined,
    actionAdd?: ActionFunction,
    actionEdit?: ActionFunction,
    options?: RouteMapperOptions
): RouteObject[] => {
    options ??= { }
    options = { ...routeMapperDefaultOptions, ...options, }
    const paramNames = { ...routeMapperDefaultOptions.paramNames, ...options.paramNames }
    return [
        {
            path    : pagePathBase,
            element : <PageComponent />,
            loader  : loaderAll,
        },
        // I could put these as children and use <Outlet /> on the page but then the actions aren't alway called when using navigate(-1)
        // and it also offers less fine grained control over the component selection
        ...(
            options.includeView
                ? [
                    {
                        path    : `${pagePathBase}/:${paramNames.view}`,
                        element : <PageComponent />,
                        loader  : loaderOne,

                    },
                ]
                : []
        ),

        ...(
            options.includeEdit
                ? [
                    {
                        path    : `${pagePathBase}/edit/:${paramNames.edit}`,
                        element : <PageComponent />,
                        loader  : loaderOne,
                        action  : actionEdit,
                    }
                ]
                : []
        ),
        ...(
            options.includeAdd
                ? [
                    {
                        path    : `${pagePathBase}/add/:${paramNames.add}?`,
                        element : <PageComponent />,
                        action  : actionAdd,
                    }
                ]
                : []
        ),
    ]
}

const routes = [
    {
        path         : "/",
        element      : <RootPage />,
        errorElement : <ErrorPage />,
        // loader       : rootLoader,
        // action       : rootAction,
        children     : [
            {
                index   : true,
                element : <MainPage />,
                loader  : mainPageLoader,
            },

            /** Auth */
            {
                path    : "/login",
                element : <AuthPage />,
                action  : loginAuthDispatcherAction,
            },
            {
                path    : "/join",
                element : <AuthPage />,
                action  : registerAuthDispatcherAction,
            },
            {
                path    : "/logout",
                element : <AuthPage />,
                loader  : logoutAuthUnLoader,
            },
            {
                path    : "/account",
                element : <AccountPage />,
                action  : usersUpdateDispatcherAction,
                loader  : accountDispatcherLoader,
            },

            /** Admin */
            {
                path     : "/admin",
                element  : <AdminPage />,
                children : [
                    ...routeMapper(
                        "blogs",
                        BlogsAdminPage,
                        blogDispatchLoader,
                        blogsDispatchLoaderAdmin,
                        blogsCreateDispatcherAction,
                        blogsUpdateDispatcherAction,
                        { includeEdit: true, includeAdd: true }
                    ),
                    ...routeMapper(
                        "bookings", BookingsAdminPage,
                        bookingDispatchLoader, bookingsDispatchLoaderAdmin,
                        bookingsCreateDispatcherAction, bookingsUpdateDispatcherAction,
                        { includeEdit: true, includeAdd: true }
                    ),
                    ...routeMapper(
                        "feedbacks", FeedbacksAdminPage,
                        feedbackDispatchLoader, feedbacksDispatchLoaderAdmin,
                        feedbacksCreateDispatcherAction, feedbacksUpdateDispatcherAction,
                        { includeEdit: true, includeAdd: true }
                    ),
                    ...routeMapper(
                        "roles", RolesAdminPage,
                        roleDispatchLoader, rolesDispatchLoaderAdmin,
                        rolesCreateDispatcherAction, rolesUpdateDispatcherAction,
                        { includeEdit: true, includeAdd: true }
                    ),
                    ...routeMapper(
                        "tags", TagsAdminPage,
                        tagDispatchLoader, tagsDispatchLoaderAdmin,
                        tagsCreateDispatcherAction, tagsUpdateDispatcherAction,
                        { includeEdit: true, includeAdd: true }
                    ),
                    ...routeMapper(
                        "users", UsersAdminPage,
                        userDispatchLoader, usersDispatchLoaderAdmin,
                        usersCreateDispatcherAction, usersUpdateDispatcherAction,
                        { includeEdit: true, includeAdd: true }
                    ),
                    ...routeMapper(
                        "bookingTypes", BookingTypesAdminPage,
                        bookingTypeDispatchLoader, bookingTypesDispatchLoaderAdmin,
                        bookingTypesCreateDispatcherAction, bookingTypesUpdateDispatcherAction,
                        { includeEdit: true, includeAdd: true }
                    ),
                ]
            },

            /** Public */
            ...routeMapper(
                "blog", BlogsPage,
                blogDispatchLoader, blogsDispatchLoader,
                blogsCreateDispatcherAction, blogsUpdateDispatcherAction
            ),
            ...routeMapper(
                "booking", BookingsPage,
                bookingDispatchLoader, bookingTypesDispatchLoader,
                bookingsCreateDispatcherAction, bookingsUpdateDispatcherAction,
                { includeAdd: true, includeEdit: true }
            ),
            ...routeMapper(
                "feedback", FeedbacksPage,
                feedbackDispatchLoader, feedbacksDispatchLoader,
                feedbacksCreateDispatcherAction, feedbacksUpdateDispatcherAction,
                { includeAdd: true },
            ),
            ...routeMapper(
                "role", RolesPage,
                roleDispatchLoader, rolesDispatchLoader,
                rolesCreateDispatcherAction, rolesUpdateDispatcherAction
            ),
            ...routeMapper(
                "tag", TagsPage,
                tagDispatchLoader, tagsDispatchLoader,
                tagsCreateDispatcherAction, tagsUpdateDispatcherAction
            ),
            ...routeMapper(
                "about", UsersPage,
                userDispatchLoader, usersDispatchLoader,
                usersCreateDispatcherAction, usersUpdateDispatcherAction
            ),
        ],
    },
]

const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter( routes )


export { router }