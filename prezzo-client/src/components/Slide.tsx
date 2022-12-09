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
                className="absolute w-full h-full flex flex-row justify-start"
                style={{
                    backgroundColor: styles.background_color,
                    color: styles.text_color,
                }}
            >
                {header && !body && !image && (
                    <>
                        <Header
                            header={header}
                            classes="relative w-4/5 h-full left-20 top-20 text-8xl"
                        />
                    </>
                )}
                {header && body && !image && (
                    <>
                        <Header
                            header={header}
                            classes="relative w-5/12 text-7xl top-10 left-16"
                        />
                        <div id="filler" className="relative w-2/12"></div>
                        <Body
                            body={body}
                            classes="relative w-5/12 text-4xl top-14 right-8"
                        />
                    </>
                )}
                {header && !body && image && (
                    <>
                        <Header header={header} classes="relative w-4/12 text-8xl top-6 left-10"/>
                        <div id="filler" className="relative w-3/12"></div>
                        <Image image_source={image} image_alt="Image Alt.." classes="relative w-5/12 object-cover"/>
                    </>
                )}
                {!header && body && !image && (
                    <div className='relative w-full h-full flex justify-center items-start'>
                        <Body body={body} classes="relative w-10/12 text-4xl top-12 leading-15"/>
                    </div>
                )}
                {!header && body && image && (
                    <>
                        <Body body={body} classes="relative w-5/12 text-4xl top-8 left-12 leading-12"/>
                        <div id="filler" className="relative w-2/12"></div>
                        <Image image_source={image} image_alt="Image Alt.." classes="relative w-1/2 object-cover"/>
                    </>
                )}
                {header && body && image && (
                    <>
                        <div className="relative w-2/5 h-full flex flex-col justify-start gap-16">
                            <Header
                                header={header}
                                classes="relative w-full left-8 top-6 text-left text-6xl"
                            />
                            <Body
                                body={body}
                                classes="relative w-full left-8 text-left text-2xl"
                            />
                        </div>
                        <div className="relative w-3/5 h-full flex justify-end items-center">
                            <Image
                                image_source={image}
                                image_alt="Image Alt.."
                                classes="relative h-full object-cover"
                            />
                        </div>
                    </>
                )}
                {!header && !body && image && (
                    <>
                        <Image
                            image_source={image}
                            image_alt="Image Alt.."
                            classes="relative w-full object-cover"
                        />
                    </>
                )}
            </div>
        </div>
    )
}

export default Slide
