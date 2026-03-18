import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSoftDelete } from '../src/common/usesoftdelete'

type TestRow = { id: string; label: string; deletedAt?: string; deletionReason?: string }

describe('useSoftDelete', () => {
    const makeRows = (): TestRow[] => [
        { id: '1', label: 'Row 1' },
        { id: '2', label: 'Row 2' },
        { id: '3', label: 'Row 3' },
    ]

    let onChange: ReturnType<typeof vi.fn>

    beforeEach(() => {
        onChange = vi.fn()
    })

    it('initially all rows are active, none deleted', () => {
        const rows = makeRows()
        const { result } = renderHook(() => useSoftDelete(rows, onChange))

        expect(result.current.activeRows).toHaveLength(3)
        expect(result.current.deletedRows).toHaveLength(0)
        expect(result.current.deleteTargetId).toBeNull()
    })

    it('requestDelete sets deleteTargetId', () => {
        const rows = makeRows()
        const { result } = renderHook(() => useSoftDelete(rows, onChange))

        act(() => result.current.requestDelete('2'))

        expect(result.current.deleteTargetId).toBe('2')
    })

    it('cancelDelete clears deleteTargetId without modifying rows', () => {
        const rows = makeRows()
        const { result } = renderHook(() => useSoftDelete(rows, onChange))

        act(() => result.current.requestDelete('2'))
        act(() => result.current.cancelDelete())

        expect(result.current.deleteTargetId).toBeNull()
        expect(onChange).not.toHaveBeenCalled()
    })

    it('confirmDelete sets deletedAt and deletionReason on the target row', () => {
        const rows = makeRows()
        const { result } = renderHook(() => useSoftDelete(rows, onChange))

        act(() => result.current.requestDelete('2'))
        act(() => result.current.confirmDelete('test reason'))

        expect(onChange).toHaveBeenCalledOnce()
        const updatedRows = onChange.mock.calls[0][0] as TestRow[]
        expect(updatedRows).toHaveLength(3) // row not removed
        const deletedRow = updatedRows.find(r => r.id === '2')!
        expect(deletedRow.deletedAt).toBeDefined()
        expect(deletedRow.deletionReason).toBe('test reason')

        // Other rows untouched
        expect(updatedRows.find(r => r.id === '1')!.deletedAt).toBeUndefined()
        expect(updatedRows.find(r => r.id === '3')!.deletedAt).toBeUndefined()

        // deleteTargetId is cleared
        expect(result.current.deleteTargetId).toBeNull()
    })

    it('confirmDelete with empty reason sets deletionReason to undefined', () => {
        const rows = makeRows()
        const { result } = renderHook(() => useSoftDelete(rows, onChange))

        act(() => result.current.requestDelete('1'))
        act(() => result.current.confirmDelete(''))

        const updatedRows = onChange.mock.calls[0][0] as TestRow[]
        const deletedRow = updatedRows.find(r => r.id === '1')!
        expect(deletedRow.deletedAt).toBeDefined()
        expect(deletedRow.deletionReason).toBeUndefined()
    })

    it('activeRows excludes soft-deleted rows, deletedRows includes them', () => {
        const rows: TestRow[] = [
            { id: '1', label: 'Active' },
            { id: '2', label: 'Deleted', deletedAt: '2025-01-01T00:00:00.000Z', deletionReason: 'old' },
            { id: '3', label: 'Also active' },
        ]
        const { result } = renderHook(() => useSoftDelete(rows, onChange))

        expect(result.current.activeRows).toHaveLength(2)
        expect(result.current.activeRows.map(r => r.id)).toEqual(['1', '3'])
        expect(result.current.deletedRows).toHaveLength(1)
        expect(result.current.deletedRows[0].id).toBe('2')
    })

    it('restoreRow removes deletedAt and deletionReason', () => {
        const rows: TestRow[] = [
            { id: '1', label: 'Active' },
            { id: '2', label: 'Deleted', deletedAt: '2025-01-01T00:00:00.000Z', deletionReason: 'gone' },
        ]
        const { result } = renderHook(() => useSoftDelete(rows, onChange))

        act(() => result.current.restoreRow('2'))

        expect(onChange).toHaveBeenCalledOnce()
        const updatedRows = onChange.mock.calls[0][0] as TestRow[]
        const restoredRow = updatedRows.find(r => r.id === '2')!
        expect(restoredRow.deletedAt).toBeUndefined()
        expect(restoredRow.deletionReason).toBeUndefined()
        expect(restoredRow.label).toBe('Deleted')
    })

    it('confirmDelete does nothing if no deleteTargetId', () => {
        const rows = makeRows()
        const { result } = renderHook(() => useSoftDelete(rows, onChange))

        act(() => result.current.confirmDelete('reason'))

        expect(onChange).not.toHaveBeenCalled()
    })
})
