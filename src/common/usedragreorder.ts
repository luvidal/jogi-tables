import { useState, useCallback } from 'react'

interface UseDragReorderReturn {
    dragRowId: string | null
    dropTargetId: string | null
    dropPosition: 'above' | 'below' | null
    handleDragStart: (rowId: string) => (e: React.DragEvent) => void
    handleDragOver: (rowId: string) => (e: React.DragEvent) => void
    handleDragLeave: () => void
    handleDrop: <T extends { id: string }>(rows: T[], onRowsChange: (rows: T[]) => void) => (e: React.DragEvent) => void
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
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
        const midY = rect.top + rect.height / 2
        setDropTargetId(rowId)
        setDropPosition(e.clientY < midY ? 'above' : 'below')
    }, [dragRowId])

    const handleDrop = useCallback(<T extends { id: string }>(rows: T[], onRowsChange: (rows: T[]) => void) => (e: React.DragEvent) => {
        e.preventDefault()
        const sourceId = e.dataTransfer.getData('text/plain')
        if (!sourceId || !dropTargetId || sourceId === dropTargetId) {
            resetState()
            return
        }

        const sourceIdx = rows.findIndex(r => r.id === sourceId)
        const targetIdx = rows.findIndex(r => r.id === dropTargetId)
        if (sourceIdx === -1 || targetIdx === -1) {
            resetState()
            return
        }

        const result = rows.filter(r => r.id !== sourceId)
        const insertIdx = dropPosition === 'below'
            ? result.findIndex(r => r.id === dropTargetId) + 1
            : result.findIndex(r => r.id === dropTargetId)
        result.splice(insertIdx, 0, rows[sourceIdx])

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
        handleDragLeave: useCallback(() => { setDropTargetId(null); setDropPosition(null) }, []),
        handleDrop,
        handleDragEnd,
    }
}
