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
        <div
            className="relative w-full aspect-video slide overflow-hidden"
            style={{
                aspectRatio: 297 / 210,
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
                        className="relative w-full h-min flex justify-center items-start"
                        style={{
                            top: '6%',
                        }}
                    >
                        <Header
                            header={header}
                            classes="relative w-11/12 h-auto text-8xl"
                        />
                    </div>
                )}
                {header && body && !image && (
                    <div className="relative w-full h-full flex flex-col justify-between items-start">
                        <div
                            className="relative flex w-full h-auto justify-center"
                            style={{
                                top: '6%',
                            }}
                        >
                            <Header
                                header={header}
                                classes="relative w-11/12 h-auto text-8xl"
                            />
                        </div>
                        <div
                            className="relative flex w-full h-auto justify-center"
                            style={{
                                bottom: '9%',
                            }}
                        >
                            <Body
                                body={body}
                                classes="relative w-11/12 h-auto text-4xl"
                            />
                        </div>
                    </div>
                )}
                {header && !body && image && (
                    <div className="relative w-full h-full flex justify-center items-start">
                        <div
                            className="relative flex w-1/2 h-auto justify-center items-center"
                            style={{
                                top: '6%',
                            }}
                        >
                            <Header
                                header={header}
                                classes="relative w-11/12 ml-5 h-auto text-7xl"
                            />
                        </div>
                        <Image
                            image_source={image}
                            image_alt="Image Alt.."
                            classes="relative w-1/2 h-full object-cover"
                        />
                    </div>
                )}
                {!header && body && !image && (
                    <div
                        className="relative w-full h-full flex justify-center leading-10"
                        style={{
                            top: '10%',
                        }}
                    >
                        <Body body={body} classes="relative w-11/12 text-5xl" />
                    </div>
                )}
                {!header && body && image && (
                    <div className="relative w-full h-full flex justify-between items-start">
                        <div
                            className="relative flex w-1/2 h-auto justify-center"
                            style={{
                                top: '7%',
                            }}
                        >
                            <Body
                                body={body}
                                classes="relative w-10/12 h-auto text-5xl"
                            />
                        </div>
                        <Image
                            image_source={image}
                            image_alt="Image Alt.."
                            classes="relative w-1/2 h-full object-cover"
                        />
                    </div>
                )}
                {header && body && image && (
                    <div className="relative w-full h-full flex justify-center items-start">
                        <div
                            className="relative w-7/12 h-auto flex flex-col gap-10 items-center"
                            style={{
                                top: '6%',
                            }}
                        >
                            <Header
                                header={header}
                                classes="relative w-11/12 h-auto text-7xl"
                            />
                            <Body
                                body={body}
                                classes="relative w-11/12 h-auto text-3xl"
                            />
                        </div>
                        <div className="relative w-5/12 h-full flex justify-end items-center">
                            <Image
                                image_source={image}
                                image_alt="Image Alt.."
                                classes="relative h-full object-cover"
                            />
                        </div>
                    </div>
                )}
                {!header && !body && image && (
                    <Image
                        image_source={image}
                        image_alt="Image Alt.."
                        classes="relative w-full object-cover"
                    />
                )}
            </div>
        </div>
    )
}

export default Slide
