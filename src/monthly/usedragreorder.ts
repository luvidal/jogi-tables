import { useState, useCallback } from 'react'
import type { RowData } from './types'
import { autoUngroup } from './helpers'

interface UseDragReorderReturn {
    /** The row currently being dragged */
    dragRowId: string | null
    /** The row being hovered over (drop target) */
    dropTargetId: string | null
    /** Drop position: 'above' or 'below' the target */
    dropPosition: 'above' | 'below' | null
    /** Attach to draggable row's drag handle */
    handleDragStart: (rowId: string) => (e: React.DragEvent) => void
    /** Attach to each row's onDragOver */
    handleDragOver: (rowId: string) => (e: React.DragEvent) => void
    /** Attach to each row's onDragLeave */
    handleDragLeave: () => void
    /** Attach to each row's onDrop */
    handleDrop: (rows: RowData[], onRowsChange: (rows: RowData[]) => void) => (e: React.DragEvent) => void
    /** Attach to drag handle's onDragEnd */
    handleDragEnd: () => void
}

export const useDragReorder = (): UseDragReorderReturn => {
    const [dragRowId, setDragRowId] = useState<string | null>(null)
    const [dropTargetId, setDropTargetId] = useState<string | null>(null)
    const [dropPosition, setDropPosition] = useState<'above' | 'below' | null>(null)

    const handleDragStart = useCallback((rowId: string) => (e: React.DragEvent) => {
        setDragRowId(rowId)
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', rowId)
    }, [])

    const handleDragOver = useCallback((rowId: string) => (e: React.DragEvent) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        if (rowId === dragRowId) return

        // Determine above/below based on cursor position within the row
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
        const midY = rect.top + rect.height / 2
        const pos = e.clientY < midY ? 'above' : 'below'

        setDropTargetId(rowId)
        setDropPosition(pos)
    }, [dragRowId])

    const handleDragLeave = useCallback(() => {
        setDropTargetId(null)
        setDropPosition(null)
    }, [])

    const handleDrop = useCallback((rows: RowData[], onRowsChange: (rows: RowData[]) => void) => (e: React.DragEvent) => {
        e.preventDefault()
        const sourceId = e.dataTransfer.getData('text/plain')
        if (!sourceId || !dropTargetId || sourceId === dropTargetId) {
            resetState()
            return
        }

        const sourceRow = rows.find(r => r.id === sourceId)
        const targetRow = rows.find(r => r.id === dropTargetId)
        if (!sourceRow || !targetRow) {
            resetState()
            return
        }

        // Only reorder within the same type family
        if (!isSameFamily(sourceRow, targetRow)) {
            resetState()
            return
        }

        // Match source row's group membership to the target's
        // Group headers own the group (children point to header's id), so use header's id as the group
        const targetGroupId = targetRow.isGroup ? targetRow.id : (targetRow.groupId ?? null)
        const sourceGroupId = sourceRow.groupId ?? null
        let workingRows = rows
        if (targetGroupId !== sourceGroupId) {
            workingRows = workingRows.map(r => {
                if (r.id !== sourceId) return r
                return targetGroupId !== null ? { ...r, groupId: targetGroupId } : { ...r, groupId: undefined }
            })
            workingRows = autoUngroup(workingRows)
        }

        // If dragging a group, move the group header and all its children
        const idsToMove = new Set<string>()
        idsToMove.add(sourceId)
        if (sourceRow.isGroup) {
            workingRows.filter(r => r.groupId === sourceId).forEach(r => idsToMove.add(r.id))
        }

        // Remove source rows from array
        const withoutSource = workingRows.filter(r => !idsToMove.has(r.id))
        const sourceRows = workingRows.filter(r => idsToMove.has(r.id))

        // Find target index in the filtered array
        const targetIdx = withoutSource.findIndex(r => r.id === dropTargetId)
        if (targetIdx === -1) {
            resetState()
            return
        }

        const insertIdx = dropPosition === 'below' ? targetIdx + 1 : targetIdx

        // Insert source rows at the new position
        const result = [...withoutSource]
        result.splice(insertIdx, 0, ...sourceRows)

        // Reassign order values sequentially
        result.forEach((r, i) => { r.order = i })

        onRowsChange(result)
        resetState()
    }, [dropTargetId, dropPosition])

    const handleDragEnd = useCallback(() => {
        resetState()
    }, [])

    function resetState() {
        setDragRowId(null)
        setDropTargetId(null)
        setDropPosition(null)
    }

    return {
        dragRowId,
        dropTargetId,
        dropPosition,
        handleDragStart,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleDragEnd,
    }
}

/** Check if two rows are in the same type family (add/income vs subtract/deduction/debt) */
function isSameFamily(a: RowData, b: RowData): boolean {
    const isAdd = (t: string) => t === 'add' || t === 'income'
    return isAdd(a.type) === isAdd(b.type)
}
