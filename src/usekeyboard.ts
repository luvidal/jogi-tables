import { useState, useCallback } from 'react'

export interface FocusedCell {
    rowId: string
    monthIndex: number // index into months array
}

interface UseKeyboardProps {
    /** Ordered list of visible row IDs (accounting for collapsed groups) */
    visibleRowIds: string[]
    monthCount: number
}

export const useKeyboard = ({ visibleRowIds, monthCount }: UseKeyboardProps) => {
    const [focusedCell, setFocusedCell] = useState<FocusedCell | null>(null)
    // Counter that increments to trigger edit on the focused cell
    const [editTrigger, setEditTrigger] = useState(0)

    const isFocused = useCallback((rowId: string, monthIndex: number) => {
        return focusedCell?.rowId === rowId && focusedCell?.monthIndex === monthIndex
    }, [focusedCell])

    const focus = useCallback((rowId: string, monthIndex: number) => {
        setFocusedCell({ rowId, monthIndex })
    }, [])

    const clearFocus = useCallback(() => setFocusedCell(null), [])

    /** Move focus in a direction, wrapping at row boundaries */
    const navigate = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
        setFocusedCell(prev => {
            if (!prev) return null
            const rowIdx = visibleRowIds.indexOf(prev.rowId)
            if (rowIdx === -1) return null

            let newRow = rowIdx
            let newCol = prev.monthIndex

            switch (direction) {
                case 'right':
                    if (newCol < monthCount - 1) {
                        newCol++
                    } else if (newRow < visibleRowIds.length - 1) {
                        newRow++
                        newCol = 0
                    }
                    break
                case 'left':
                    if (newCol > 0) {
                        newCol--
                    } else if (newRow > 0) {
                        newRow--
                        newCol = monthCount - 1
                    }
                    break
                case 'down':
                    if (newRow < visibleRowIds.length - 1) newRow++
                    break
                case 'up':
                    if (newRow > 0) newRow--
                    break
            }

            return { rowId: visibleRowIds[newRow], monthIndex: newCol }
        })
    }, [visibleRowIds, monthCount])

    /** Navigate and immediately trigger edit on the destination cell */
    const navigateAndEdit = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
        navigate(direction)
        // Use setTimeout to ensure the focusedCell state updates before triggering edit
        setTimeout(() => setEditTrigger(prev => prev + 1), 0)
    }, [navigate])

    /** Handle keydown on the table container (for arrow keys when not editing) */
    const handleContainerKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (!focusedCell) return

        // Only handle navigation keys when the target is the container itself
        // (not when focus is inside an input/editing cell)
        const target = e.target as HTMLElement
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return

        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault()
                navigate('up')
                break
            case 'ArrowDown':
                e.preventDefault()
                navigate('down')
                break
            case 'ArrowLeft':
                e.preventDefault()
                navigate('left')
                break
            case 'ArrowRight':
                e.preventDefault()
                navigate('right')
                break
            case 'Tab':
                e.preventDefault()
                navigate(e.shiftKey ? 'left' : 'right')
                break
            case 'Enter':
                e.preventDefault()
                setEditTrigger(prev => prev + 1)
                break
            case 'Escape':
                e.preventDefault()
                clearFocus()
                break
        }
    }, [focusedCell, navigate, clearFocus])

    return {
        focusedCell,
        editTrigger,
        isFocused,
        focus,
        clearFocus,
        navigate,
        navigateAndEdit,
        handleContainerKeyDown,
    }
}
