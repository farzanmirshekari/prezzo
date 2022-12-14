import React from 'react'

interface Props {
    presentation_markdown: string,
    existing_presentation_uuid: string,
    should_take_in_existing_presentation_uuid: boolean,
    set_presentation_markdown: (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => void
    handle_existing_presentation_load: () => void
}

function Textbox({ presentation_markdown, existing_presentation_uuid, should_take_in_existing_presentation_uuid, set_presentation_markdown, handle_existing_presentation_load }: Props) {
    return (
        <div className="relative w-full h-full justify-center items-start textbox_container">
            {
                should_take_in_existing_presentation_uuid && (
                    <div className="relative w-full h-min flex flex-row items-center existing_presentation">
                        <span className="relative w-min whitespace-nowrap h-full flex items-center pt-2 pb-2 pl-4 pr-4 bg-transparent">
                            Presentation UUID:
                        </span>
                        <input
                            type="text"
                            value={existing_presentation_uuid}
                            className="relative w-full h-full pt-2 pb-2 outline-0 bg-transparent"
                        />
                    </div>
                )
            }
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
