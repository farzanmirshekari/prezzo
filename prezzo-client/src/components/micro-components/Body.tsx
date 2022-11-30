import React from 'react'

interface Props {
    body: string
}

function Body({ body }: Props) {
    return <p className="text-2xl text-center">{body}</p>
}

export default Body
