import React from 'react'

interface Props {
    header: string
    classes?: string
    presentation_mode: boolean
}

function Header({ header, classes, presentation_mode }: Props) {
    return (
        <div className={classes ? classes : 'text-center text-6xl'}>
            <span style={{
                fontSize: presentation_mode ? '1.5em' : '1em'
            }}>
                {header}
            </span>
        </div>
    )
}

export default Header
