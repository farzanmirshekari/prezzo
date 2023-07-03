import React from 'react'

interface Props {
    body: string
    classes?: string
}

function Body({ body, classes }: Props) {
    return (
        <div className={classes ? classes : 'text-center text-2xl'}>
            <span
                style={{
                    fontSize: '1em',
                }}
            >
                {body}
            </span>
        </div>
    )
}

export default Body
