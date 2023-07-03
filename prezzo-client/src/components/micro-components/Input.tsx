import React from 'react'

interface Props {
    input_type: string
    accepted_file_types: string
    input_placeholder: string
    input_function: (event: React.ChangeEvent<HTMLInputElement>) => void
}

function Input({
    input_type,
    accepted_file_types,
    input_placeholder,
    input_function,
}: Props) {
    return (
        <label className="relative w-1/2 h-full flex flex-row justify-center items-center text-center text-base input">
            <input
                className="hidden"
                type={input_type}
                accept={accepted_file_types}
                onChange={input_function}
            />
            {input_placeholder}
        </label>
    )
}

export default Input
