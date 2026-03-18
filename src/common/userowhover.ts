import { useState, useCallback } from 'react'

export function useRowHover() {
    const [hoveredRow, setHoveredRow] = useState<string | null>(null)

    const getHoverProps = useCallback((id: string) => ({
        onMouseEnter: () => setHoveredRow(id),
        onMouseLeave: () => setHoveredRow(null),
    }), [])

    const isHovered = useCallback((id: string) => hoveredRow === id, [hoveredRow])

    return { hoveredRow, getHoverProps, isHovered }
}
