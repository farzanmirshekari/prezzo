import React from 'react'

interface Props {
    input_type: string
    accepted_file_types?: string
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
        <input
            className="relative w-1/4 h-2/3 input"
            type={input_type}
            accept={accepted_file_types}
            placeholder={input_placeholder}
            onChange={input_function}
        />
    )
}

export default Input
