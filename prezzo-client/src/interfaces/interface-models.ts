export interface Slide_Styles {
    background_color: string
    text_color: string
}

export interface Presentation_Slide {
    header: string
    body: string
    styles: Slide_Styles
}

export interface State {
    presenatation_markdown: string
    presentation_slides: Presentation_Slide[]
}
