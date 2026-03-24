import { useGridKeyboard } from '../common/usegridkeyboard'
import type { GridFocusedCell } from '../common/usegridkeyboard'

export type FocusedCell = GridFocusedCell & { monthIndex: number }

interface UseKeyboardProps {
    visibleRowIds: string[]
    monthCount: number
}

export const useKeyboard = ({ visibleRowIds, monthCount }: UseKeyboardProps) => {
    const grid = useGridKeyboard({ visibleRowIds, colCount: monthCount })

    return {
        ...grid,
        // Alias colIndex as monthIndex for RentaTable compatibility
        get focusedCell() {
            if (!grid.focusedCell) return null
            return { ...grid.focusedCell, monthIndex: grid.focusedCell.colIndex }
        },
        isFocused: (rowId: string, monthIndex: number) => grid.isFocused(rowId, monthIndex),
        focus: (rowId: string, monthIndex: number) => grid.focus(rowId, monthIndex),
    }
}
