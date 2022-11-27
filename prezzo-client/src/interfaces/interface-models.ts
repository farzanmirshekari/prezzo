export interface Presentation_Slide {
    header: string
    body: string
}

export interface State {
    presenatation_markdown: string
    presentation_slides: Presentation_Slide[]
}
