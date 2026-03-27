import { useState, useCallback } from 'react'

export function useRowHover() {
    const [hoveredRow, setHoveredRow] = useState<string | number | null>(null)

    const getHoverProps = useCallback((id: string | number) => ({
        onMouseEnter: () => setHoveredRow(id),
        onMouseLeave: () => setHoveredRow(null),
    }), [])

    const isHovered = useCallback((id: string | number) => hoveredRow === id, [hoveredRow])

    return { hoveredRow, getHoverProps, isHovered }
}
