import { useState, useCallback } from 'react'

export interface GridFocusedCell {
    rowId: string
    colIndex: number
}

interface UseGridKeyboardProps {
    /** Ordered list of visible row IDs */
    visibleRowIds: string[]
    /** Number of navigable columns */
    colCount: number
}

export const useGridKeyboard = ({ visibleRowIds, colCount }: UseGridKeyboardProps) => {
    const [focusedCell, setFocusedCell] = useState<GridFocusedCell | null>(null)
    const [editTrigger, setEditTrigger] = useState(0)
    const [clearTrigger, setClearTrigger] = useState(0)
    const [editInitialValue, setEditInitialValue] = useState<string | null>(null)

    const isFocused = useCallback((rowId: string, colIndex: number) => {
        return focusedCell?.rowId === rowId && focusedCell?.colIndex === colIndex
    }, [focusedCell])

    const focus = useCallback((rowId: string, colIndex: number) => {
        setFocusedCell({ rowId, colIndex })
    }, [])

    const clearFocus = useCallback(() => setFocusedCell(null), [])

    /** Move focus in a direction, wrapping at row boundaries */
    const navigate = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
        setFocusedCell(prev => {
            if (!prev) return null
            const rowIdx = visibleRowIds.indexOf(prev.rowId)
            if (rowIdx === -1) return null

            let newRow = rowIdx
            let newCol = prev.colIndex

            switch (direction) {
                case 'right':
                    if (newCol < colCount - 1) {
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
                        newCol = colCount - 1
                    }
                    break
                case 'down':
                    if (newRow < visibleRowIds.length - 1) newRow++
                    break
                case 'up':
                    if (newRow > 0) newRow--
                    break
            }

            return { rowId: visibleRowIds[newRow], colIndex: newCol }
        })
    }, [visibleRowIds, colCount])

    /** Navigate and immediately trigger edit on the destination cell */
    const navigateAndEdit = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
        navigate(direction)
        setEditInitialValue(null)
        setTimeout(() => setEditTrigger(prev => prev + 1), 0)
    }, [navigate])

    /** Handle keydown on the table container (for arrow keys when not editing) */
    const handleContainerKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (!focusedCell) return

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
            case 'F2':
                e.preventDefault()
                setEditInitialValue(null)
                setEditTrigger(prev => prev + 1)
                break
            case 'Delete':
            case 'Backspace':
                e.preventDefault()
                setClearTrigger(prev => prev + 1)
                break
            case 'Escape':
                e.preventDefault()
                clearFocus()
                break
            default:
                // Type-to-edit: single printable character starts editing with that char
                if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                    e.preventDefault()
                    setEditInitialValue(e.key)
                    setEditTrigger(prev => prev + 1)
                }
                break
        }
    }, [focusedCell, navigate, clearFocus])

    return {
        focusedCell,
        editTrigger,
        clearTrigger,
        editInitialValue,
        isFocused,
        focus,
        clearFocus,
        navigate,
        navigateAndEdit,
        handleContainerKeyDown,
    }
}
