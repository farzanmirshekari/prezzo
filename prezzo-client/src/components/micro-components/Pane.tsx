import React from 'react'
import Button from './Button'
import Input from './Input'

interface Props {
    upload_image: (e: React.ChangeEvent<HTMLInputElement>) => void
    start_presentation: () => void
    toggle_should_take_in_existing_presentation_uuid: () => void
}

function Pane({ upload_image, start_presentation, toggle_should_take_in_existing_presentation_uuid }: Props) {
    return (
        <div className="relative w-full h-12 flex flex-row items-center pane">
            <Button button_function={toggle_should_take_in_existing_presentation_uuid} button_text="Open Existing" />
            <Input
                input_type="file"
                accepted_file_types="image/*"
                input_placeholder="Upload Image"
                input_function={upload_image}
            />
            <Button button_text="Present" button_function={start_presentation} />
        </div>
    )
}

export default Pane
