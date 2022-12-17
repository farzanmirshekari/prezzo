import React from 'react'
import { Presentation_Slide } from '../interfaces/interface-models'
import Slide from './Slide'

interface Props {
    presentation_slides: Presentation_Slide[]
    presentation_mode: boolean
}

function Deck({ presentation_slides, presentation_mode }: Props) {
    return (
        <div className="relative w-8/12 h-full overflow-y-scroll slide_deck">
            {presentation_slides.map((slide, index) => {
                return (
                    <Slide
                        key={index}
                        header={slide.header}
                        body={slide.body}
                        image={slide.image}
                        styles={slide.styles}
                        presentation_mode={presentation_mode}
                    />
                )
            })}
        </div>
    )
}

export default Deck
