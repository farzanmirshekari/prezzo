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
    presentation_mode: boolean
}

function Slide({ header, body, image, styles, presentation_mode }: Props) {
    return (
        <div className="relative w-full aspect-video slide overflow-hidden">
            <div
                className="relative w-full h-full flex flex-row justify-start"
                style={{
                    backgroundColor: styles.background_color,
                    color: styles.text_color,
                }}
            >
                {header && !body && !image && (
                    <div
                        className="relative w-full h-full flex justify-start items-start"
                        style={{
                            top: presentation_mode ? '3em' : '2em',
                            left: presentation_mode ? '4em' : `${8/3}em`,
                        }}
                    >
                        <Header
                            header={header}
                            classes="relative w-4/5 h-min text-8xl"
                            presentation_mode={presentation_mode}
                        />
                    </div>
                )}
                {header && body && !image && (
                    <div className="relative w-full h-full flex justify-start items-start">
                        <div
                            className="relative w-5/12 h-auto"
                            style={{
                                top: presentation_mode ? '3em' : '2em',
                                left: presentation_mode ? '3em' : '2em',
                            }}
                        >
                            <Header
                                header={header}
                                classes="relative w-auto h-auto text-8xl"
                                presentation_mode={presentation_mode}
                            />
                        </div>
                        <div id="filler" className="relative w-1/12"></div>
                        <div
                            className="relative w-5/12 h-auto"
                            style={{
                                top: presentation_mode ? '5em' : `${10/3}em`,
                                left: presentation_mode ? '7em' : `${14/3}em`,
                            }}
                        >
                            <Body
                                body={body}
                                classes="relative w-full h-auto text-4xl"
                                presentation_mode={presentation_mode}
                            />
                        </div>
                    </div>
                )}
                {header && !body && image && (
                    <>
                        <Header
                            header={header}
                            classes="relative w-4/12 text-8xl top-6 left-10"
                            presentation_mode={presentation_mode}
                        />
                        <div id="filler" className="relative w-3/12"></div>
                        <Image
                            image_source={image}
                            image_alt="Image Alt.."
                            classes="relative w-5/12 object-cover"
                        />
                    </>
                )}
                {!header && body && !image && (
                    <div
                        className="relative w-full h-full flex justify-center items-start"
                        style={{
                            top: presentation_mode ? '2em' : `${4/3}em`,
                        }}
                    >
                        <Body
                            body={body}
                            classes="relative w-auto w-10/12 text-5xl leading-15"
                            presentation_mode={presentation_mode}
                        />
                    </div>
                )}
                {!header && body && image && (
                    <>
                        <Body
                            body={body}
                            classes="relative w-5/12 text-4xl top-8 left-12 leading-12"
                            presentation_mode={presentation_mode}
                        />
                        <div id="filler" className="relative w-2/12"></div>
                        <Image
                            image_source={image}
                            image_alt="Image Alt.."
                            classes="relative w-1/2 object-cover"
                        />
                    </>
                )}
                {header && body && image && (
                    <>
                        <div className="relative w-2/5 h-full flex flex-col justify-start gap-16">
                            <Header
                                header={header}
                                classes="relative w-full left-8 top-6 text-left text-6xl"
                                presentation_mode={presentation_mode}
                            />
                            <Body
                                body={body}
                                classes="relative w-full left-8 text-left text-2xl"
                                presentation_mode={presentation_mode}
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
