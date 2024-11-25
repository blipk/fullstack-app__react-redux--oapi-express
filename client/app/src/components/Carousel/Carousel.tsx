/**
 * This is a Carousel component to display elements in a rotateable carousel.
 *
 * @module
 */
import React, { useState } from "react"
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr"

import "./Carousel.scss"


interface Slide {
    id: number;
    content: JSX.Element;
}

interface CarouselProps {
    slides: Slide[]
}

const Carousel: React.FC<CarouselProps> = ( { slides } ) => {

    const [ currentSlide, setCurrentSlide ] = useState<number>( 0 )

    const nextSlide = (): void => {
        setCurrentSlide( ( prev ) => ( prev === slides.length - 1 ? 0 : prev + 1 ) )
    }

    const prevSlide = (): void => {
        setCurrentSlide( ( prev ) => ( prev === 0 ? slides.length - 1 : prev - 1 ) )
    }

    const transformValue = -currentSlide * 100

    return (
        <div className="carousel-container">
            <div
                className="carousel-wrapper"
                style={{ transform: `translateX(${transformValue}%)` }}
            >
                {slides.map( ( slide ) => (
                    <div key={slide.id} className="carousel-slide">
                        <h3>{slide.content}</h3>
                    </div>
                ) )}
            </div>
            <div className="carousel-controls">
                <div>
                    <button onClick={prevSlide} className="carousel-button carousel-button-prev"><GrLinkPrevious/></button>
                </div>
                <div>
                    <button onClick={nextSlide} className="carousel-button carousel-button-next"><GrLinkNext/></button>
                </div>
            </div>
        </div>
    )
}

export default Carousel