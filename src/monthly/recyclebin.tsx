import { useState } from 'react'
import { ChevronDown, ChevronUp, Undo2, Trash2 } from 'lucide-react'
import type { RowData } from './types'

interface RecycleBinProps {
    deletedRows: RowData[]
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

const RecycleBin = ({ deletedRows, onRestore }: RecycleBinProps) => {
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
                <div className="px-4 pb-3">
                    {deletedRows.map(row => (
                        <div
                            key={row.id}
                            className="flex items-center gap-3 py-1.5 group"
                        >
                            <button
                                onClick={() => onRestore(row.id)}
                                className="shrink-0 p-1 rounded text-gray-300 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                                title="Restaurar"
                            >
                                <Undo2 size={13} />
                            </button>
                            <span className="text-xs text-gray-500 truncate min-w-0 flex-1">
                                {row.label}
                            </span>
                            {row.deletionReason && (
                                <span className="text-xs text-gray-400 italic truncate max-w-[160px]" title={row.deletionReason}>
                                    {row.deletionReason}
                                </span>
                            )}
                            {row.deletedAt && (
                                <span className="text-xs text-gray-300 shrink-0">
                                    {formatDeletedDate(row.deletedAt)}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default RecycleBin
