export interface Presentation_Slide {
    title: string;
    body: string;
}

export interface Presentation_Slides {
    slides: Presentation_Slide[];
}

export interface State {
    presenatation_markdown: string;
    presentation_slides: Presentation_Slides;
}