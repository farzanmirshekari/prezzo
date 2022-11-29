import React from 'react'
import { Slide_Styles } from '../interfaces/interface-models'

interface Props {
    header: string
    body: string
    styles: Slide_Styles
}

function Slide({ header, body, styles }: Props) {
    return (
        <div className="relative w-full aspect-video slide">
            <div 
                className="absolute w-full h-full flex flex-col justify-center"
                style={{
                    backgroundColor: styles.background_color,
                    color: styles.text_color,
                }}
            >
                <h1 className="text-5xl text-center">{header}</h1>
                <p className="text-2xl text-center">{body}</p>
            </div>
        </div>
    )
}

export default Slide
