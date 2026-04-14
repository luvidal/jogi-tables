import React from 'react'

/** Pill-styled clickable wrapper for header content. When `onClick` is provided,
 *  renders as an interactive pill with border + cursor. Otherwise renders children plain. */
const ClickableHeader = ({ onClick, borderColor, className, children }: {
    onClick?: () => void
    borderColor?: string
    className?: string
    children: React.ReactNode
}) => (
    <span
        className={`whitespace-nowrap ${onClick ? `cursor-pointer select-none inline-flex items-center gap-1 rounded-full border ${borderColor || 'border-edge-subtle/30'} px-2 py-0.5 -mx-2 -my-0.5 transition-colors` : ''} ${className || ''}`}
        onClick={onClick ? (e) => { e.stopPropagation(); onClick() } : undefined}
    >
        {children}
    </span>
)

export default ClickableHeader
