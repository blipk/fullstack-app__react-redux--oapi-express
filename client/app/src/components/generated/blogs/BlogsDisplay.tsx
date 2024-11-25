/**
 * This file contains a component for displaying blogs in a nice view for the public
 * @module
 */
import React from "react"

import BlogsDisplayItem from "./BlogsDisplayItem"
import type { BlogsItemType } from "../../../store/reducers/generated/blogSlice"

/* start:component-unique-imports */
import { useState } from "react"
/* end:component-unique-imports */


interface BlogsDisplayProps {
    blogs: BlogsItemType[]
}

enum SortOrders {
    ASCENDING = "ASCENDING",
    DESCENDING = "DESCENDING"
}

const BlogsDisplay: React.FC<BlogsDisplayProps> = ( { blogs } ) => {

    /* start:component-unique-content */
    const [ localBlogs, setLocalBlogs ] = useState<typeof blogs>( blogs )

    const onSelectChange = ( e: React.ChangeEvent<HTMLSelectElement> ) => {
        const target = e.target as HTMLSelectElement
        const sortOrder = SortOrders[ target.value as keyof typeof SortOrders ]

        const sortedBlogs = blogs.toSorted( ( a, b ) => {
            const sortDateA = new Date( a.publishedDate || a.updatedAt || a.createdAt ).getTime()
            const sortDateB = new Date( b.publishedDate || b.updatedAt || b.createdAt ).getTime()

            const sort = sortOrder === SortOrders.ASCENDING
                ? sortDateA - sortDateB
                : sortDateB - sortDateA
            return Number( sort )
        } )
        setLocalBlogs( sortedBlogs )
        console.log( sortedBlogs )
    }
    /* end:component-unique-content */

    return (
        <>

            {/* start:component-unique-jsx */}
            <div className="page-header flex-row flex-gap-10">
                <h1>Community News</h1>

                <div className="sort-controls">
                    <select onChange={onSelectChange}>
                        <option value="ASCENDING">Newest First</option>
                        <option value="DESCENDING">Oldest First</option>
                    </select>
                </div>
            </div>


            <div className="blogs-display">
                {
                    localBlogs.map( blog => (
                        <BlogsDisplayItem key={blog.id} blog={blog} />
                    ) )
                }
            </div>
            {/* end:component-unique-jsx */}

        </>
    )

}

export default BlogsDisplay