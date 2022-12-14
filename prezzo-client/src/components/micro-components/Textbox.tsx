import React from 'react'

interface Props {
    presentation_markdown: string
    set_presentation_markdown: (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => void
}

function Textbox({ presentation_markdown, set_presentation_markdown }: Props) {
    return (
        <div className="relative w-full h-full justify-center items-start">
            <div className="relative w-full h-min flex flex-row items-center existing_presentation">
                <span className="relative w-min whitespace-nowrap h-full flex items-center pt-2 pb-2 pl-4 pr-4 bg-transparent">
                    Presentation UUID:
                </span>
                <input
                    type="text"
                    className="relative w-full h-full pt-2 pb-2 outline-0 bg-transparent"
                />
            </div>
            <textarea
                className="w-full h-full resize-none outline-0 text-justify"
                value={presentation_markdown}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    set_presentation_markdown(e)
                }
            />
        </div>
    )
}

export default Textbox
