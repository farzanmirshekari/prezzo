import React from 'react'
import Button from './Button'
import Input from './Input'

interface Props {
    upload_image: (e: React.ChangeEvent<HTMLInputElement>) => void
    button_function: () => void
}

function Pane({ upload_image, button_function }: Props) {
    return (
        <div className="relative w-full h-12 flex flex-row items-center justify-end pane">
            <Input
                input_type="file"
                accepted_file_types="image/*"
                input_placeholder="Upload Image"
                input_function={upload_image}
            />
            <Button button_text="Present" button_function={button_function} />
        </div>
    )
}

export default Pane
