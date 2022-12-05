import React from 'react'

interface Props {
    button_text: string
    button_icon: string
    button_function: () => void
}

function Button({ button_text, button_icon, button_function }: Props) {
    return (
        <button
            className="relative flex flex-row justify-center items-center w-1/3 h-full button"
            onClick={button_function}
        >
            <img
                className="w-1/3 h-2/3 icon"
                alt={button_text.toLowerCase()}
                src={button_icon}
            />
            {button_text}
        </button>
    )
}

export default Button
