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
        <div
            className="relative w-full aspect-video slide overflow-hidden"
            style={{
                animationName: presentation_mode
                    ? [
                          'slide_up',
                          'slide_down',
                          'slide_right',
                          'slide_left',
                          'slide_diagonally_from_top_left',
                          'slide_diagonally_from_bottom_right',
                      ][~~(Math.random() * 6)]
                    : 'slide_right',
                animationDuration: '0.5s',
            }}
        >
            <div
                className="relative w-full h-full flex justify-start"
                style={{
                    backgroundColor: styles.background_color,
                    color: styles.text_color,
                    fontFamily: styles.font_face,
                }}
            >
                {header && !body && !image && (
                    <div
                        className="relative w-fit h-min flex justify-center items-start"
                        style={{
                            top: presentation_mode ? '2em' : `${4 / 3}em`,
                        }}
                    >
                        <Header
                            header={header}
                            classes="relative w-11/12 h-auto text-8xl"
                            presentation_mode={presentation_mode}
                        />
                    </div>
                )}
                {header && body && !image && (
                    <div className="relative w-full h-full flex flex-col justify-between items-start">
                        <div
                            className="relative flex w-full h-auto justify-center"
                            style={{
                                top: presentation_mode ? '2em' : `${4 / 3}em`,
                            }}
                        >
                            <Header
                                header={header}
                                classes="relative w-11/12 h-auto text-8xl"
                                presentation_mode={presentation_mode}
                            />
                        </div>
                        <div
                            className="relative flex w-full h-auto justify-center"
                            style={{
                                bottom: presentation_mode ? '4em' : `${8 / 3}em`,
                            }}
                        >
                            <Body
                                body={body}
                                classes="relative w-11/12 h-auto text-4xl"
                                presentation_mode={presentation_mode}
                            />
                        </div>
                    </div>
                )}
                {header && !body && image && (
                    <div className="relative w-full h-full flex justify-start items-start">
                        <div
                            className="relative w-fit h-auto"
                            style={{
                                top: presentation_mode ? '2em' : `${4 / 3}em`,
                                left: presentation_mode ? '3em' : '2em',
                            }}
                        >
                            <Header
                                header={header}
                                classes="relative w-fit h-auto text-7xl"
                                presentation_mode={presentation_mode}
                            />
                        </div>
                        <div id="filler" className="relative w-1/12"></div>
                        <Image
                            image_source={image}
                            image_alt="Image Alt.."
                            classes="relative w-1/2 h-full object-cover"
                        />
                    </div>
                )}
                {!header && body && !image && (
                    <div
                        className="relative w-full h-full flex justify-center items-start leading-10"
                        style={{
                            top: presentation_mode ? '2em' : `${4 / 3}em`,
                        }}
                    >
                        <Body
                            body={body}
                            classes="relative w-auto w-10/12 text-5xl"
                            presentation_mode={presentation_mode}
                        />
                    </div>
                )}
                {!header && body && image && (
                    <div className="relative w-full h-full flex justify-start items-start">
                        <div
                            className="relative w-5/12 h-auto"
                            style={{
                                top: presentation_mode ? '2em' : `${4 / 3}em`,
                                left: presentation_mode ? '3em' : '2em',
                            }}
                        >
                            <Body
                                body={body}
                                classes="relative w-fit h-auto text-5xl"
                                presentation_mode={presentation_mode}
                            />
                        </div>
                        <div id="filler" className="relative w-1/12"></div>
                        <Image
                            image_source={image}
                            image_alt="Image Alt.."
                            classes="relative w-1/2 h-full object-cover"
                        />
                    </div>
                )}
                {header && body && image && (
                    <div className="relative w-full h-full flex justify-start items-start">
                        <div
                            className="relative w-8/12 h-auto flex flex-col gap-6"
                            style={{
                                top: presentation_mode ? '2em' : `${4 / 3}em`,
                                left: presentation_mode ? '3em' : '2em',
                            }}
                        >
                            <Header
                                header={header}
                                classes="relative w-fit h-auto text-7xl"
                                presentation_mode={presentation_mode}
                            />
                            <Body
                                body={body}
                                classes="relative w-full h-auto text-4xl"
                                presentation_mode={presentation_mode}
                            />
                        </div>
                        <div id="filler" className="relative w-1/12"></div>
                        <div className="relative w-7/12 h-full flex justify-end items-center">
                            <Image
                                image_source={image}
                                image_alt="Image Alt.."
                                classes="relative h-full object-cover"
                            />
                        </div>
                    </div>
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
