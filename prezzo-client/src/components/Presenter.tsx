import React, { KeyboardEvent } from 'react'
import { Presentation_Slide } from '../interfaces/interface-models'
import Slide from './Slide'

interface Props {
    handle_presentation_mode_user_actions: (
        e: KeyboardEvent<HTMLDivElement>
    ) => void
    presentation_slides: Presentation_Slide[]
    current_slide_index: number
}

function Presenter({
    presentation_slides,
    current_slide_index,
    handle_presentation_mode_user_actions,
}: Props) {
    return (
        <div
            className="relative w-screen overflow-hidden flex justify-center items-center presenter"
            onKeyDown={handle_presentation_mode_user_actions}
            tabIndex={-1}
        >
            {
                // eslint-disable-next-line array-callback-return
                presentation_slides.map((slide, index) => {
                    if (index === current_slide_index) {
                        return (
                            <Slide
                                header={slide.header}
                                key={index}
                                body={slide.body}
                                image={slide.image}
                                styles={slide.styles}
                                presentation_mode={true}
                            />
                        )
                    }
                })
            }
        </div>
    )
}

export default Presenter
