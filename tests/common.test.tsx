import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { useRowHover } from '../src/common/userowhover'
import { useFieldUpdate } from '../src/common/usefieldupdate'
import { useGridKeyboard } from '../src/common/usegridkeyboard'
import DeleteRowButton from '../src/common/deletebutton'
import ViewSourceButton from '../src/common/viewsourcebutton'
import EmptyStateRow from '../src/common/emptystaterow'

// ============================================================================
// useGridKeyboard
// ============================================================================

describe('useGridKeyboard', () => {
    const rowIds = ['r1', 'r2', 'r3']

    it('starts with no focused cell', () => {
        const { result } = renderHook(() => useGridKeyboard({ visibleRowIds: rowIds, colCount: 3 }))
        expect(result.current.focusedCell).toBeNull()
        expect(result.current.isFocused('r1', 0)).toBe(false)
    })

    it('focus sets the focused cell', () => {
        const { result } = renderHook(() => useGridKeyboard({ visibleRowIds: rowIds, colCount: 3 }))
        act(() => result.current.focus('r2', 1))
        expect(result.current.focusedCell).toEqual({ rowId: 'r2', colIndex: 1 })
        expect(result.current.isFocused('r2', 1)).toBe(true)
        expect(result.current.isFocused('r1', 0)).toBe(false)
    })

    it('clearFocus clears', () => {
        const { result } = renderHook(() => useGridKeyboard({ visibleRowIds: rowIds, colCount: 3 }))
        act(() => result.current.focus('r1', 0))
        act(() => result.current.clearFocus())
        expect(result.current.focusedCell).toBeNull()
    })

    it('navigate right moves column', () => {
        const { result } = renderHook(() => useGridKeyboard({ visibleRowIds: rowIds, colCount: 3 }))
        act(() => result.current.focus('r1', 0))
        act(() => result.current.navigate('right'))
        expect(result.current.focusedCell).toEqual({ rowId: 'r1', colIndex: 1 })
    })

    it('navigate right wraps to next row', () => {
        const { result } = renderHook(() => useGridKeyboard({ visibleRowIds: rowIds, colCount: 3 }))
        act(() => result.current.focus('r1', 2))
        act(() => result.current.navigate('right'))
        expect(result.current.focusedCell).toEqual({ rowId: 'r2', colIndex: 0 })
    })

    it('navigate right at last cell stays put', () => {
        const { result } = renderHook(() => useGridKeyboard({ visibleRowIds: rowIds, colCount: 3 }))
        act(() => result.current.focus('r3', 2))
        act(() => result.current.navigate('right'))
        expect(result.current.focusedCell).toEqual({ rowId: 'r3', colIndex: 2 })
    })

    it('navigate left moves column', () => {
        const { result } = renderHook(() => useGridKeyboard({ visibleRowIds: rowIds, colCount: 3 }))
        act(() => result.current.focus('r2', 1))
        act(() => result.current.navigate('left'))
        expect(result.current.focusedCell).toEqual({ rowId: 'r2', colIndex: 0 })
    })

    it('navigate left wraps to previous row', () => {
        const { result } = renderHook(() => useGridKeyboard({ visibleRowIds: rowIds, colCount: 3 }))
        act(() => result.current.focus('r2', 0))
        act(() => result.current.navigate('left'))
        expect(result.current.focusedCell).toEqual({ rowId: 'r1', colIndex: 2 })
    })

    it('navigate left at first cell stays put', () => {
        const { result } = renderHook(() => useGridKeyboard({ visibleRowIds: rowIds, colCount: 3 }))
        act(() => result.current.focus('r1', 0))
        act(() => result.current.navigate('left'))
        expect(result.current.focusedCell).toEqual({ rowId: 'r1', colIndex: 0 })
    })

    it('navigate down moves row', () => {
        const { result } = renderHook(() => useGridKeyboard({ visibleRowIds: rowIds, colCount: 3 }))
        act(() => result.current.focus('r1', 1))
        act(() => result.current.navigate('down'))
        expect(result.current.focusedCell).toEqual({ rowId: 'r2', colIndex: 1 })
    })

    it('navigate up moves row', () => {
        const { result } = renderHook(() => useGridKeyboard({ visibleRowIds: rowIds, colCount: 3 }))
        act(() => result.current.focus('r2', 1))
        act(() => result.current.navigate('up'))
        expect(result.current.focusedCell).toEqual({ rowId: 'r1', colIndex: 1 })
    })

    it('navigate down at last row stays put', () => {
        const { result } = renderHook(() => useGridKeyboard({ visibleRowIds: rowIds, colCount: 3 }))
        act(() => result.current.focus('r3', 0))
        act(() => result.current.navigate('down'))
        expect(result.current.focusedCell).toEqual({ rowId: 'r3', colIndex: 0 })
    })

    it('navigate up at first row stays put', () => {
        const { result } = renderHook(() => useGridKeyboard({ visibleRowIds: rowIds, colCount: 3 }))
        act(() => result.current.focus('r1', 0))
        act(() => result.current.navigate('up'))
        expect(result.current.focusedCell).toEqual({ rowId: 'r1', colIndex: 0 })
    })

    it('navigate with no focus does nothing', () => {
        const { result } = renderHook(() => useGridKeyboard({ visibleRowIds: rowIds, colCount: 3 }))
        act(() => result.current.navigate('right'))
        expect(result.current.focusedCell).toBeNull()
    })

    it('navigate returns null if rowId not in visibleRowIds', () => {
        const { result } = renderHook(() => useGridKeyboard({ visibleRowIds: rowIds, colCount: 3 }))
        act(() => result.current.focus('unknown', 0))
        act(() => result.current.navigate('right'))
        expect(result.current.focusedCell).toBeNull()
    })

    it('single column navigation moves only up/down', () => {
        const { result } = renderHook(() => useGridKeyboard({ visibleRowIds: rowIds, colCount: 1 }))
        act(() => result.current.focus('r1', 0))
        act(() => result.current.navigate('right'))
        // Right wraps to next row col 0
        expect(result.current.focusedCell).toEqual({ rowId: 'r2', colIndex: 0 })
    })

    it('clearTrigger starts at 0', () => {
        const { result } = renderHook(() => useGridKeyboard({ visibleRowIds: rowIds, colCount: 3 }))
        expect(result.current.clearTrigger).toBe(0)
    })

    it('editInitialValue starts as null', () => {
        const { result } = renderHook(() => useGridKeyboard({ visibleRowIds: rowIds, colCount: 3 }))
        expect(result.current.editInitialValue).toBeNull()
    })
})

// ============================================================================
// useRowHover
// ============================================================================

describe('useRowHover', () => {
    it('starts with no hovered row', () => {
        const { result } = renderHook(() => useRowHover())
        expect(result.current.hoveredRow).toBeNull()
        expect(result.current.isHovered('any')).toBe(false)
    })

    it('sets hovered row on mouseEnter', () => {
        const { result } = renderHook(() => useRowHover())
        act(() => result.current.getHoverProps('row-1').onMouseEnter())
        expect(result.current.isHovered('row-1')).toBe(true)
        expect(result.current.isHovered('row-2')).toBe(false)
    })

    it('clears hovered row on mouseLeave', () => {
        const { result } = renderHook(() => useRowHover())
        act(() => result.current.getHoverProps('row-1').onMouseEnter())
        act(() => result.current.getHoverProps('row-1').onMouseLeave())
        expect(result.current.isHovered('row-1')).toBe(false)
    })
})

// ============================================================================
// useFieldUpdate
// ============================================================================

describe('useFieldUpdate', () => {
    type Row = { id: string; name: string; value: number }

    it('updates a specific field on a row', () => {
        const onChange = vi.fn()
        const rows: Row[] = [
            { id: '1', name: 'A', value: 10 },
            { id: '2', name: 'B', value: 20 },
        ]
        const { result } = renderHook(() => useFieldUpdate(rows, onChange))

        act(() => result.current.updateField('1', 'name', 'Updated' as any))
        expect(onChange).toHaveBeenCalledWith([
            { id: '1', name: 'Updated', value: 10 },
            { id: '2', name: 'B', value: 20 },
        ])
    })

    it('removes a row by id', () => {
        const onChange = vi.fn()
        const rows: Row[] = [
            { id: '1', name: 'A', value: 10 },
            { id: '2', name: 'B', value: 20 },
        ]
        const { result } = renderHook(() => useFieldUpdate(rows, onChange))

        act(() => result.current.removeRow('1'))
        expect(onChange).toHaveBeenCalledWith([
            { id: '2', name: 'B', value: 20 },
        ])
    })

    it('does not mutate the original array', () => {
        const onChange = vi.fn()
        const rows: Row[] = [{ id: '1', name: 'A', value: 10 }]
        const { result } = renderHook(() => useFieldUpdate(rows, onChange))

        act(() => result.current.updateField('1', 'value', 99 as any))
        expect(rows[0].value).toBe(10)
    })
})

// ============================================================================
// DeleteRowButton
// ============================================================================

describe('DeleteRowButton', () => {
    it('calls onClick when clicked', () => {
        const onClick = vi.fn()
        render(<DeleteRowButton onClick={onClick} isVisible={true} />)
        fireEvent.click(screen.getByTitle('Eliminar'))
        expect(onClick).toHaveBeenCalledOnce()
    })

    it('is invisible when isVisible=false', () => {
        const { container } = render(<DeleteRowButton onClick={() => {}} isVisible={false} />)
        const btn = container.querySelector('button')!
        expect(btn.className).toContain('opacity-0')
    })

    it('is visible when isVisible=true', () => {
        const { container } = render(<DeleteRowButton onClick={() => {}} isVisible={true} />)
        const btn = container.querySelector('button')!
        expect(btn.className).toContain('opacity-100')
    })
})

// ============================================================================
// ViewSourceButton
// ============================================================================

describe('ViewSourceButton', () => {
    it('renders nothing without sourceFileId', () => {
        const { container } = render(
            <ViewSourceButton onViewSource={() => {}} isVisible={true} />
        )
        expect(container.innerHTML).toBe('')
    })

    it('renders nothing without onViewSource', () => {
        const { container } = render(
            <ViewSourceButton sourceFileId="f1" isVisible={true} />
        )
        expect(container.innerHTML).toBe('')
    })

    it('calls onViewSource with array-wrapped id', () => {
        const onViewSource = vi.fn()
        render(
            <ViewSourceButton sourceFileId="f1" onViewSource={onViewSource} isVisible={true} />
        )
        fireEvent.click(screen.getByTitle('Ver documento fuente'))
        expect(onViewSource).toHaveBeenCalledWith(['f1'])
    })
})

// ============================================================================
// EmptyStateRow
// ============================================================================

describe('EmptyStateRow', () => {
    const renderInTable = (ui: React.ReactNode) =>
        render(<table><tbody>{ui}</tbody></table>)

    it('renders nothing when show=false', () => {
        const { container } = renderInTable(
            <EmptyStateRow show={false} colSpan={5} message="Empty" />
        )
        expect(container.querySelectorAll('tr')).toHaveLength(0)
    })

    it('renders message when show=true', () => {
        renderInTable(
            <EmptyStateRow show={true} colSpan={5} message="Sin datos" />
        )
        expect(screen.getByText('Sin datos')).toBeDefined()
    })

    it('sets correct colSpan', () => {
        const { container } = renderInTable(
            <EmptyStateRow show={true} colSpan={7} message="Empty" />
        )
        const td = container.querySelector('td')
        expect(td?.getAttribute('colspan')).toBe('7')
    })
})
