import React from 'react'

interface Props {
    header: string
    classes?: string
}

function Header({ header, classes }: Props) {
    return (
        <span className={classes ? classes : 'text-center text-6xl'}>
            {header}
        </span>
    )
}

export default Header
