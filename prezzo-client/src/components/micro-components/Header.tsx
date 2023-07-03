import React from 'react'

interface Props {
    header: string
    classes?: string
}

function Header({ header, classes }: Props) {
    return (
        <div className={classes ? classes : 'text-center text-6xl'}>
            <span
                style={{
                    fontSize: '1em',
                }}
            >
                {header}
            </span>
        </div>
    )
}

export default Header
