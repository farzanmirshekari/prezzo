import React from 'react'
import Pane from './micro-components/Pane'
import Textbox from './micro-components/Textbox'

interface Props {
    presentation_uuid: string
    presentation_markdown: string
    existing_presentation_uuid: string
    should_take_in_existing_presentation_uuid: boolean
    set_presentation_markdown: (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => void
    upload_image: (e: React.ChangeEvent<HTMLInputElement>) => void
    handle_existing_presentation_uuid: (
        e: React.ChangeEvent<HTMLInputElement>
    ) => void
    toggle_should_take_in_existing_presentation_uuid: () => void
}

function Editor({
    presentation_uuid,
    presentation_markdown,
    existing_presentation_uuid,
    should_take_in_existing_presentation_uuid,
    set_presentation_markdown,
    upload_image,
    handle_existing_presentation_uuid,
    toggle_should_take_in_existing_presentation_uuid,
}: Props) {
    return (
        <div className="relative w-4/12 h-full overflow-y-hidden">
            <Pane
                upload_image={upload_image}
                toggle_should_take_in_existing_presentation_uuid={
                    toggle_should_take_in_existing_presentation_uuid
                }
            />
            <Textbox
                presentation_uuid={presentation_uuid}
                presentation_markdown={presentation_markdown}
                existing_presentation_uuid={existing_presentation_uuid}
                should_take_in_existing_presentation_uuid={
                    should_take_in_existing_presentation_uuid
                }
                set_presentation_markdown={set_presentation_markdown}
                handle_existing_presentation_uuid={
                    handle_existing_presentation_uuid
                }
            />
        </div>
    )
}

export default Editor
