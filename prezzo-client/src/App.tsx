import React, { useEffect, useState, KeyboardEvent } from 'react'
import Editor from './components/Editor'
import './App.css'
import Deck from './components/Deck'
import {
    Presentation_State,
    User_Interface_State,
} from './interfaces/interface-models'
import axios from 'axios'
import { v4 as uuidv4, validate } from 'uuid'
import Presenter from './components/Presenter'
import { IMessageEvent, w3cwebsocket as W3CWebSocket } from 'websocket'

function App() {
    const [presentation_state, set_presentation_state] =
        useState<Presentation_State>({
            websocket: new W3CWebSocket(
                'ws://127.0.0.1:8080/presentation_content'
            ),
            presentation_uuid: uuidv4(),
            existing_presentation_uuid: '',
            presenatation_markdown: '',
            presentation_slides: [],
        })
    const [user_interface_state, set_user_interface_state] =
        useState<User_Interface_State>({
            presenter: {
                presentation_mode: false,
                current_slide_index: 0,
            },
            should_take_in_existing_presentation_uuid: false,
        })

    useEffect(() => {
        presentation_state.websocket.onmessage = (event: IMessageEvent) => {
            set_presentation_state((presentation_state) => ({
                ...presentation_state,
                presentation_slides: JSON.parse(event.data.toString()),
            }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (presentation_state.websocket.readyState === 1) {
            presentation_state.websocket.send(
                JSON.stringify({
                    presentation_uuid: presentation_state.presentation_uuid,
                    text_content: presentation_state.presenatation_markdown,
                })
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [presentation_state.presenatation_markdown])

    useEffect(() => {
        if (validate(presentation_state.existing_presentation_uuid)) {
            axios
                .get(
                    `http://localhost:8080/existing_presentation?presentation_uuid=${presentation_state.existing_presentation_uuid}`
                )
                .then((response) => {
                    if (response.status === 200) {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [presentation_state.existing_presentation_uuid])

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

    const handle_presentation_mode_user_actions = (
        e: KeyboardEvent<HTMLDivElement>
    ) => {
        if (
            (e.key === 'ArrowRight' || e.key === ' ') &&
            user_interface_state.presenter.current_slide_index <
                presentation_state.presentation_slides.length - 1
        ) {
            set_user_interface_state({
                ...user_interface_state,
                presenter: {
                    ...user_interface_state.presenter,
                    current_slide_index:
                        user_interface_state.presenter.current_slide_index + 1,
                },
            })
        } else if (
            e.key === 'ArrowLeft' &&
            user_interface_state.presenter.current_slide_index > 0
        ) {
            set_user_interface_state({
                ...user_interface_state,
                presenter: {
                    ...user_interface_state.presenter,
                    current_slide_index:
                        user_interface_state.presenter.current_slide_index - 1,
                },
            })
        } else if (e.key === 'Escape') {
            set_user_interface_state({
                ...user_interface_state,
                presenter: {
                    ...user_interface_state.presenter,
                    presentation_mode: false,
                },
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

    const set_existing_presentation_uuid = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        set_presentation_state({
            ...presentation_state,
            existing_presentation_uuid: e.target.value,
        })
    }

    const set_presentation_mode = () => {
        set_user_interface_state({
            ...user_interface_state,
            presenter: {
                ...user_interface_state.presenter,
                presentation_mode:
                    !user_interface_state.presenter.presentation_mode,
                    current_slide_index: 0,
            },
        })
    }

    const toggle_should_take_in_existing_presentation_uuid = () => {
        set_user_interface_state({
            ...user_interface_state,
            should_take_in_existing_presentation_uuid:
                !user_interface_state.should_take_in_existing_presentation_uuid,
        })
    }

    return (
        <div className="absolute w-full h-full flex flex-row justify-start">
            {!user_interface_state.presenter.presentation_mode && (
                <>
                    <Deck
                        presentation_slides={
                            presentation_state.presentation_slides
                        }
                    />
                    <Editor
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
                        start_presentation={set_presentation_mode}
                        set_existing_presentation_uuid={
                            set_existing_presentation_uuid
                        }
                        toggle_should_take_in_existing_presentation_uuid={
                            toggle_should_take_in_existing_presentation_uuid
                        }
                    />
                </>
            )}
            {user_interface_state.presenter.presentation_mode && (
                <>
                    <Presenter
                        presentation_slides={
                            presentation_state.presentation_slides
                        }
                        current_slide_index={
                            user_interface_state.presenter.current_slide_index
                        }
                        handle_presentation_mode_user_actions={
                            handle_presentation_mode_user_actions
                        }
                    />
                </>
            )}
        </div>
    )
}

export default App
