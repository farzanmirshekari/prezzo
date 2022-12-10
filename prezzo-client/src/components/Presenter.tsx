import React from 'react'
import { Presentation_Slide } from '../interfaces/interface-models'

interface Props {
    presentation_slides: Presentation_Slide[]
}

function Presenter({ presentation_slides }: Props) {
    return <div className="relative w-full h-full"></div>
}

export default Presenter
