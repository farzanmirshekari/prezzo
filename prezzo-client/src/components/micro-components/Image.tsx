import React from 'react'

interface Props {
    image_source: string
    image_alt: string
    classes?: string
}

function Image({ image_source, image_alt, classes }: Props) {
    return (
        <img
            className={classes ? classes : 'w-full h-full'}
            src={image_source}
            alt={image_alt}
        />
    )
}

export default Image