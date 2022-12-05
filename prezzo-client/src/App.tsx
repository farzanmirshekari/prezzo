import React, { useEffect, useState } from 'react'
import Editor from './components/Editor'
import './App.css'
import Deck from './components/Deck'
import { State } from './interfaces/interface-models'
import axios from 'axios'
import {  v5 as uuidv5 } from 'uuid'

function App() {
    const [state, set_state] = useState<State>({
        presenatation_markdown: '',
        presentation_slides: [],
        presentation_uuid: uuidv5('prezzo', uuidv5.URL)
    })

    const set_presentation_markdown = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        set_state({
            ...state,
            presenatation_markdown: e.target.value,
        })
    }

    useEffect(() => {
        axios
            .post('http://localhost:8080/presentation_content', {
                text_content: state.presenatation_markdown,
            })
            .then((response) => {
                set_state({
                    ...state,
                    presentation_slides: response.data,
                })
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.presenatation_markdown])

    const upload_image = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0]
        const form_data = new FormData()
        form_data.append('image', file)
        axios
            .post('http://localhost:8080/image_upload', form_data)
            .then((response) => {
                if (response.status !== 200) alert('Error uploading image..')
            })
    }

    return (
        <div className="absolute w-full h-full flex flex-row justify-start">
            <Deck presentation_slides={state.presentation_slides} />
            <Editor
                presentation_markdown={state.presenatation_markdown}
                set_presentation_markdown={set_presentation_markdown}
                upload_image={upload_image}
            />
        </div>
    )
}

export default App
