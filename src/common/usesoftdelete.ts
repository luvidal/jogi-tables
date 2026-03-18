import { useState, useMemo, useCallback } from 'react'
import type { SoftDeletable } from './softdeletetypes'

type SoftDeletableRow = { id: string } & SoftDeletable

export function useSoftDelete<T extends SoftDeletableRow>(
    rows: T[],
    onRowsChange: (rows: T[]) => void,
) {
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

    const activeRows = useMemo(() => rows.filter(r => !r.deletedAt), [rows])
    const deletedRows = useMemo(() => rows.filter(r => !!r.deletedAt), [rows])

    const requestDelete = useCallback((id: string) => {
        setDeleteTargetId(id)
    }, [])

    const confirmDelete = useCallback((reason: string) => {
        if (!deleteTargetId) return
        const now = new Date().toISOString()
        onRowsChange(rows.map(r =>
            r.id === deleteTargetId
                ? { ...r, deletedAt: now, deletionReason: reason || undefined }
                : r
        ))
        setDeleteTargetId(null)
    }, [deleteTargetId, rows, onRowsChange])

    const cancelDelete = useCallback(() => {
        setDeleteTargetId(null)
    }, [])

    const restoreRow = useCallback((id: string) => {
        onRowsChange(rows.map(r => {
            if (r.id !== id) return r
            const { deletedAt: _, deletionReason: __, ...rest } = r
            return rest as T
        }))
    }, [rows, onRowsChange])

    return { activeRows, deletedRows, deleteTargetId, requestDelete, confirmDelete, cancelDelete, restoreRow }
}
