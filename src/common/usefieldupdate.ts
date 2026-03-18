import { useCallback } from 'react'

type HasId = { id: string }

export function useFieldUpdate<T extends HasId>(
    rows: T[],
    onRowsChange: (rows: T[]) => void,
) {
    const updateField = useCallback(
        (id: string, field: keyof T, value: T[keyof T]) => {
            onRowsChange(rows.map(r => r.id === id ? { ...r, [field]: value } : r))
        },
        [rows, onRowsChange],
    )

    const removeRow = useCallback(
        (id: string) => {
            onRowsChange(rows.filter(r => r.id !== id))
        },
        [rows, onRowsChange],
    )

    return { updateField, removeRow }
}
