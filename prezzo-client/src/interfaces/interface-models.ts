export interface Slide_Styles {
    background_color: string
    text_color: string
    font_face: string
}

export interface Presentation_Slide {
    header: string
    body: string
    image: string
    styles: Slide_Styles
}

export interface Presentation_State {
    presentation_uuid: string
    existing_presentation_uuid: string
    presenatation_markdown: string
    presentation_slides: Presentation_Slide[]
}

export interface User_Interface_State {
    should_take_in_existing_presentation_uuid: boolean
}
