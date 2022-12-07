import React from 'react'
import { Slide_Styles } from '../interfaces/interface-models'
import Body from './micro-components/Body'
import Header from './micro-components/Header'
import Image from './micro-components/Image'

interface Props {
    header: string
    body: string
    image: string
    styles: Slide_Styles
}

function Slide({ header, body, image, styles }: Props) {
    return (
        <div className="relative w-full aspect-video slide">
            <div
                className="absolute w-full h-full flex flex-row justify-center"
                style={{
                    backgroundColor: styles.background_color,
                    color: styles.text_color,
                }}
            >
                {image && header && body && (
                    <>
                        <div className='relative w-3/5 h-full flex flex-col justify-start'>
                            <Header header={header} classes='relative w-3/5 text-left text-6xl'/>
                            <Body body={body} classes='relative w-3/5 text-left text-2xl'/>
                        </div>
                        <div className='relative w-2/5 h-full flex justify-end items-center'>
                            <Image image_source={image} image_alt='Image Alt..'
                             classes='relative w-full'/>
                        </div>
                    </>
                )}
                {!image && (
                    <>
                        <Header header={header} classes='relative w-2/5 text-left text-6xl'/>
                        <Body body={body}/>
                    </>
                )}
                {image && !header && !body && (
                    <>
                        <Image image_source={image} image_alt='Image Alt..' classes='relative w-full h-auto'/>
                    </>
                )}
            </div>
        </div>
    )
}

export default Slide
