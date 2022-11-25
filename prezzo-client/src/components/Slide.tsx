import React from 'react'

interface Props {
    header: string,
    body: string,
}

function Slide({ header, body }: Props) {
    return (
        <div className="relative w-full aspect-video">
            <div className="absolute w-full h-full flex flex-col justify-center bg-slate-500">
                <h1 className="text-5xl text-center">{header}</h1>
                <p className="text-2xl text-center">{body}</p>
            </div>
        </div>
    )
}

export default Slide