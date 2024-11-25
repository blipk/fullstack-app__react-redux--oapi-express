/**
 * This file contains a component for displaying a list of blogs with actions, used on the admin pages
 * @module
 */
import React from "react"

import { GrAdd } from "react-icons/gr"

import BlogsListItem from "./BlogsListItem"
import type { BlogsItemType } from "../../../store/reducers/generated/blogSlice"
import { useLocation, useNavigate } from "react-router-dom"

/* start:component-unique-imports */
/* end:component-unique-imports */


interface BlogsListProps {
    blogs: BlogsItemType[]
}

const BlogsList: React.FC<BlogsListProps> = ( { blogs } ) => {

    const location = useLocation()
    const navigate = useNavigate()

    /* start:component-unique-content */
    /* end:component-unique-content */

    const addRoute = location.pathname.includes( "blog" ) ? `${location.pathname}/add` : "/blog/add"

    return (
        <>
            <div className="blogs-list-wrapper">
                <div className="flex-row page-header flex-gap-10">
                    <h1>Blogs List</h1>
                    <button type="button" className="flex-row" onClick={() => { navigate( addRoute ) }}><GrAdd/>New</button>
                </div>

                <div className="blogs-list">
                    {
                        blogs.length
                            ? blogs.map( blog => (
                                <BlogsListItem key={blog.id} blog={blog} />
                            ) )
                            : <p>There are no blogs</p>
                    }
                </div>
            </div>
        </>
    )

}

export default BlogsList