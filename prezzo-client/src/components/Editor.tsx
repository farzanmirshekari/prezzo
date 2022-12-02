import React from 'react'
import Pane from './micro-components/Pane'
import Textbox from './micro-components/Textbox'

interface Props {
    presentation_markdown: string
    set_presentation_markdown: (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => void
}

function Editor({ presentation_markdown, set_presentation_markdown }: Props) {
    return (
        <div className="relative w-4/12 h-full overflow-y-hidden">
            <Pane />
            <Textbox
                presentation_markdown={presentation_markdown}
                set_presentation_markdown={set_presentation_markdown}
            />
        </div>
    )
}

export default Editor
