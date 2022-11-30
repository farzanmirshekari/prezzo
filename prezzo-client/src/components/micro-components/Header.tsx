import React from 'react'

interface Props {
    header: string
}

function Header({ header }: Props) {
    return <span className="text-center text-6xl">{header}</span>
}

export default Header
