import React from 'react'

interface Props {
    body: string
    classes?: string
    presentation_mode: boolean
}

function Body({ body, classes, presentation_mode }: Props) {
    return (
        <div className={classes ? classes : 'text-center text-2xl'}>
            <span
                style={{
                    fontSize: presentation_mode ? '1.5em' : '1em',
                }}
            >
                {body}
            </span>
        </div>
    )
}

export default Body
