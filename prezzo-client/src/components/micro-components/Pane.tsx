import React from 'react'
import Button from './Button'

function Pane() {
    return (
        <div className="relative w-full h-12 flex flex-row items-center justify-end pane">
            <Button button_text='Image Upload' button_function={() => {}} />
        </div>
    )
}

export default Pane
