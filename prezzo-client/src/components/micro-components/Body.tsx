import React from 'react'

interface Props {
    body: string
    classes?: string
}

function Body({ body, classes }: Props) {
    return <p className={classes ? classes : 'text-center text-2xl'}>{body}</p>
}

export default Body
