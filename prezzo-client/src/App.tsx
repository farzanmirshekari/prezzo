import React, { useState } from 'react'
import Editor from './components/Editor'
import './App.css'
import Deck from './components/Deck'

function App() {
    const [state, set_state] = useState({
        presentation_markdown: '',
    })

    const set_presentation_markdown = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        set_state({
            ...state,
            presentation_markdown: e.target.value,
        })
    }

    return (
        <div className="absolute w-full h-full flex flex-row justify-start">
            <Deck />
            <Editor
                presentation_markdown={state.presentation_markdown}
                set_presentation_markdown={set_presentation_markdown}
            />
        </div>
    )
}

export default App
