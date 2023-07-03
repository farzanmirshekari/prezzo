import React, { useEffect, useState, KeyboardEvent, useRef } from 'react'
import Editor from './components/Editor'
import './App.css'
import Deck from './components/Deck'
import {
    Presentation_State,
    User_Interface_State,
} from './interfaces/interface-models'
import axios from 'axios'
import { v4 as uuidv4, validate } from 'uuid'
import { IMessageEvent, w3cwebsocket as W3CWebSocket } from 'websocket'

function App() {
    const [presentation_state, set_presentation_state] =
        useState<Presentation_State>({
            presentation_uuid: uuidv4(),
            existing_presentation_uuid: '',
            presenatation_markdown: '',
            presentation_slides: [],
        })
    const [user_interface_state, set_user_interface_state] =
        useState<User_Interface_State>({
            should_take_in_existing_presentation_uuid: false,
        })
    const websocket = useRef<W3CWebSocket>()

    useEffect(() => {
        websocket.current = new W3CWebSocket(
            'ws://localhost:8080/presentation_content'
        )
        websocket.current.onmessage = (event: IMessageEvent) => {
            set_presentation_state((presentation_state) => ({
                ...presentation_state,
                presentation_slides: JSON.parse(event.data.toString()),
            }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (websocket.current!.readyState === 1) {
            websocket.current!.send(
                JSON.stringify({
                    presentation_uuid: presentation_state.presentation_uuid,
                    text_content: presentation_state.presenatation_markdown,
                })
            )
        } else if (websocket.current!.readyState === 3) {
            websocket.current = new W3CWebSocket(
                'ws://localhost:8080/presentation_content'
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [presentation_state.presenatation_markdown])

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

    const handle_existing_presentation_uuid = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (validate(e.target.value)) {
            axios
                .get(
                    `http://localhost:8080/existing_presentation?presentation_uuid=${presentation_state.existing_presentation_uuid}`
                )
                .then((response) => {
                    if (
                        response.status === 200 &&
                        response.data.presentation.text_content &&
                        response.data.presentation.presentation_uuid
                    ) {
                        set_presentation_state({
                            ...presentation_state,
                            presenatation_markdown:
                                response.data.presentation.text_content,
                            presentation_uuid:
                                response.data.presentation.presentation_uuid,
                        })
                    }
                })
        }
    }

    const set_presentation_markdown = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        set_presentation_state({
            ...presentation_state,
            presenatation_markdown: e.target.value,
        })
    }

    const toggle_should_take_in_existing_presentation_uuid = () => {
        set_user_interface_state({
            ...user_interface_state,
            should_take_in_existing_presentation_uuid:
                !user_interface_state.should_take_in_existing_presentation_uuid,
        })
        set_presentation_state({
            ...presentation_state,
            existing_presentation_uuid: '',
        })
    }

    return (
        <div className="absolute w-full h-full flex flex-row justify-start">
            <Deck
                presentation_slides={presentation_state.presentation_slides}
            />
            <Editor
                presentation_uuid={presentation_state.presentation_uuid}
                presentation_markdown={
                    presentation_state.presenatation_markdown
                }
                existing_presentation_uuid={
                    presentation_state.existing_presentation_uuid
                }
                should_take_in_existing_presentation_uuid={
                    user_interface_state.should_take_in_existing_presentation_uuid
                }
                set_presentation_markdown={set_presentation_markdown}
                upload_image={upload_image}
                handle_existing_presentation_uuid={
                    handle_existing_presentation_uuid
                }
                toggle_should_take_in_existing_presentation_uuid={
                    toggle_should_take_in_existing_presentation_uuid
                }
            />
        </div>
    )
}

export default App
