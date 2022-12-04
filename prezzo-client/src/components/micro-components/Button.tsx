import React from 'react'

interface Props {
    button_text: string,
    button_function: () => void
}

function Button({ button_text, button_function }: Props) {
    return (
        <button 
            className='relative w-1/4 h-2/3 button'
            onClick={button_function}
        >{button_text}</button>
    )   
}

export default Button