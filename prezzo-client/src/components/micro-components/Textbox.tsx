import React from 'react'

interface Props {
    presentation_markdown: string
    set_presentation_markdown: (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => void
}

function Textbox({ presentation_markdown, set_presentation_markdown }: Props) {
    return (
        <textarea
            className="w-full h-full resize-none outline-0 text-justify"
            value={presentation_markdown}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                set_presentation_markdown(e)
            }
        />
    )
}

export default Textbox
