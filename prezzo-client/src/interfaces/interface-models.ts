import { w3cwebsocket } from 'websocket'

export interface Slide_Styles {
    background_color: string
    text_color: string
}

export interface Presentation_Slide {
    header: string
    body: string
    image: string
    styles: Slide_Styles
}

export interface Presentation_State {
    websocket: w3cwebsocket
    presentation_uuid: string
    existing_presentation_uuid: string
    presenatation_markdown: string
    presentation_slides: Presentation_Slide[]
}

export interface User_Interface_State {
    presentation_mode: boolean
    should_take_in_existing_presentation_uuid: boolean
}
