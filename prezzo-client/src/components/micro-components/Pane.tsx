import React from 'react'
import image_icon from '../../assets/icon-image.svg'
import Input from './Input'

interface Props {
    upload_image: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function Pane({ upload_image }: Props) {
    return (
        <div className="relative w-full h-12 flex flex-row items-center justify-end pane">
            <Input
                input_type="file"
                accepted_file_types="image/*"
                input_placeholder="Upload Image"
                input_icon={image_icon}
                input_function={upload_image}
            />
        </div>
    )
}

export default Pane
