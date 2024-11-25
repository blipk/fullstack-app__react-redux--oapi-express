import React from "react"

import { useAppSelector, type RootState } from "../store/store"
import BookingTypesDisplayItem from "../components/generated/bookingtypes/BookingTypesDisplayItem"
import FeedbacksDisplayItem from "../components/generated/feedbacks/FeedbacksDisplayItem"
import BlogsDisplayItem from "../components/generated/blogs/BlogsDisplayItem"
import Carousel from "../components/Carousel/Carousel"

import "../components/generated/feedbacks/feedbacks-style.scss"
import "../components/generated/blogs/blogs-style.scss"



const MainPage: React.FC = () => {

    const { data: blogs } = useAppSelector( ( state: RootState ) => state.blogs )
    const { data: feedbacks } = useAppSelector( ( state: RootState ) => state.feedbacks )
    const { data: bookingTypes } = useAppSelector( ( state: RootState ) => state.bookingTypes )

    const feedbacksSlides = feedbacks.map(
        ( feedback, i ) => ( {
            id      : i,
            content : <FeedbacksDisplayItem key={feedback.id} feedback={feedback} />
        } )
    )

    const blogsSlides = blogs.map(
        ( blog, i ) => ( {
            id      : i,
            content : <BlogsDisplayItem key={blog.id} blog={blog} />
        } )
    )


    return (
        <>
            <h1 className="page-header">Welcome to Bobs Garage</h1>

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

            <div>
                <h2 style={{ marginBottom: "10px" }}>Book With Us Today</h2>
                <div className="bookings-display">
                    {
                        bookingTypes.map( bookingType => (
                            <BookingTypesDisplayItem key={bookingType.id} bookingType={bookingType} />
                        ) )
                    }
                </div>
            </div>

            <div>
                <h2>Community Feedback</h2>
                <Carousel slides={feedbacksSlides} />
            </div>

            <div>
                <h2>Community News</h2>
                <Carousel slides={blogsSlides} />
            </div>

        </>
    )
}


export default MainPage