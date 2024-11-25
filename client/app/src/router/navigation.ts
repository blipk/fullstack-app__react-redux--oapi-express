/**
 * This file contains functions and generated variables for the application navigation in {@link components/layout/Header}
 * @module
 */



/** The Application admin routes base paths  */
enum AdminRouteBases {
    Blogs = "/admin/blogs",
    Bookings = "/admin/bookings",
    Feedbacks = "/admin/feedbacks",
    Roles = "/admin/roles",
    Tags = "/admin/tags",
    Users = "/admin/users",
    BookingTypes = "/admin/bookingTypes"
}

/** Represents a union of literals for the keys of {@link AdminRouteBases} */
type AdminRouteBasesLiterals = keyof typeof AdminRouteBases;

/** Represents {@link AdminRouteBases} values */
const adminRouteBasesNames = Object.keys( AdminRouteBases ).filter( ( v ) => isNaN( Number( v ) ) ) as AdminRouteBasesLiterals[]

/** The Application public routes base paths  */
enum PublicRouteBases {
    Blogs = "/blog",
    Bookings = "/booking",
    Feedbacks = "/feedback",
    Roles = "/role",
    Tags = "/tag",
    Users = "/user",
}

/** Represents a union of literals for the keys of {@link PublicRouteBases} */
type PublicRouteBasesLiterals = keyof typeof PublicRouteBases;

/** Represents {@link PublicRouteBases} values */
const publicRouteBasesNames = Object.keys( PublicRouteBases ).filter( ( v ) => isNaN( Number( v ) ) ) as PublicRouteBasesLiterals[]


/** Function for building links to sub routes based on {@link PublicRouteBases} and {@link AdminRouteBases} */
const linkBuilder = ( routeBase: AdminRouteBases | PublicRouteBases, routePath: Array<string | number> ): string =>
    `${routeBase}/${routePath.join( "/" )}`


/** The navigation links for the admin dropdown menu in {@link components/layout/Header} */
const adminNavLinks = adminRouteBasesNames.map( adminRouteBasesName => (
    {
        path : AdminRouteBases[ adminRouteBasesName ],
        text : adminRouteBasesName
    }
) )

/** The navigation links for the account section of the application menu in {@link components/layout/Header} */
const accountNavLinksGroups = {
    user: [
        { path: "/account", "text": "Account" },
        { path: "/logout", "text": "Logout" }
    ],
    noUser: [
        { path: "/login", "text": "Login" },
        { path: "/join", "text": "Join" },
    ]
}

/** The navigation links for the application menu in {@link components/layout/Header} */
const navLinks = [
    { path: "/booking", "text": "Book a Service" },
    { path: "/about", "text": "Our Shop" },
    { path: "/feedback", "text": "Feedback" },
    { path: "/blog", "text": "Blog" },
]


export {
    AdminRouteBases,
    PublicRouteBases,
    adminRouteBasesNames,
    publicRouteBasesNames,

    navLinks,
    adminNavLinks,
    accountNavLinksGroups,
    linkBuilder,
}
export type {
    AdminRouteBasesLiterals,
    PublicRouteBasesLiterals,
}