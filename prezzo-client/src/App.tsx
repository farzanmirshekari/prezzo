import React, { useState } from 'react'
import Editor from './components/Editor'
import './App.css'
import Deck from './components/Deck'
import { State} from './interfaces/interface-models'

function App() {
    const [state, set_state] = useState<State>({
        presenatation_markdown: '',
        presentation_slides: {
            slides: []
        }
    })

    const set_presentation_markdown = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        set_state({
            ...state,
            presenatation_markdown: e.target.value
        })
    }

    return (
        <div className="absolute w-full h-full flex flex-row justify-start">
            <Deck />
            <Editor
                presentation_markdown={state.presenatation_markdown}
                set_presentation_markdown={set_presentation_markdown}
            />
        </div>
    )
}

export default App
