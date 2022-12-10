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

export interface State {
    presentation_uuid: string
    presentation_mode: boolean
    presenatation_markdown: string
    presentation_slides: Presentation_Slide[]
}
