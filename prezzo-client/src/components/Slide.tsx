import React from 'react'
import { Slide_Styles } from '../interfaces/interface-models'
import Body from './micro-components/Body'
import Header from './micro-components/Header'

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
                <Header header={header} />
                <Body body={body} />
            </div>
        </div>
    )
}

export default Slide
