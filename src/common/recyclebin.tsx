import { useState } from 'react'
import { ChevronDown, ChevronUp, Undo2, Trash2 } from 'lucide-react'
import type { SoftDeletable } from './softdeletetypes'

type RecycleBinRow = { id: string } & SoftDeletable

interface RecycleBinProps<T extends RecycleBinRow> {
    deletedRows: T[]
    getLabel: (row: T) => string
    onRestore: (id: string) => void
}

const formatDeletedDate = (iso: string): string => {
    const d = new Date(iso)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMin = Math.floor(diffMs / 60000)
    if (diffMin < 1) return 'hace un momento'
    if (diffMin < 60) return `hace ${diffMin} min`
    const diffHrs = Math.floor(diffMin / 60)
    if (diffHrs < 24) return `hace ${diffHrs}h`
    const diffDays = Math.floor(diffHrs / 24)
    if (diffDays < 7) return `hace ${diffDays}d`
    return d.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })
}

function RecycleBin<T extends RecycleBinRow>({ deletedRows, getLabel, onRestore }: RecycleBinProps<T>) {
    const [expanded, setExpanded] = useState(false)

    if (deletedRows.length === 0) return null

    return (
        <div className="border-t border-gray-200 bg-gray-50/50">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full px-4 py-2 flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 transition-colors"
            >
                <Trash2 size={12} />
                <span>
                    {deletedRows.length} eliminado{deletedRows.length !== 1 ? 's' : ''}
                </span>
                {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {expanded && (
                <div className="px-4 pb-2 space-y-1">
                    {deletedRows.map(row => (
                        <div key={row.id} className="flex items-center gap-2 py-1 opacity-75">
                            <button
                                onClick={() => onRestore(row.id)}
                                className="shrink-0 p-1 rounded text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                                title="Restaurar"
                            >
                                <Undo2 size={13} />
                            </button>
                            <div className="min-w-0 flex-1">
                                <span
                                    className="text-xs font-medium line-through text-gray-400 truncate block"
                                    title={getLabel(row)}
                                >
                                    {getLabel(row)}
                                </span>
                                {row.deletedAt && (
                                    <span className="text-[10px] text-gray-400 truncate block" title={row.deletionReason}>
                                        {formatDeletedDate(row.deletedAt)}
                                        {row.deletionReason && ` · ${row.deletionReason}`}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default RecycleBin
