export interface Presentation_Slide {
    title: string
    body: string
}

export interface State {
    presenatation_markdown: string
    presentation_slides: Presentation_Slide[]
}
