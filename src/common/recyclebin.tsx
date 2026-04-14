import { useState } from 'react'
import { ChevronDown, ChevronUp, Undo2, Trash2 } from 'lucide-react'
import { formatDeletedDate } from './utils'
import { T } from './styles'
import type { SoftDeletable } from './softdeletetypes'

type RecycleBinRow = { id: string } & SoftDeletable

interface RecycleBinProps<T extends RecycleBinRow> {
    deletedRows: T[]
    getLabel: (row: T) => string
    onRestore: (id: string) => void
    renderCells?: (row: T) => React.ReactNode
}

function RecycleBin<T extends RecycleBinRow>({ deletedRows, getLabel, onRestore, renderCells }: RecycleBinProps<T>) {
    const [expanded, setExpanded] = useState(false)

    if (deletedRows.length === 0) return null

    return (
        <div className="border-t border-edge-subtle/10 bg-surface-1/50">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full px-4 py-2 flex items-center gap-2 text-xs text-ink-tertiary hover:text-ink-secondary hover:bg-surface-1 transition-colors"
            >
                <Trash2 size={12} />
                <span>
                    {deletedRows.length} eliminado{deletedRows.length !== 1 ? 's' : ''}
                </span>
                {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {expanded && (
                <table className={T.table}>
                    <tbody>
                        {deletedRows.map(row => (
                            <tr key={row.id} className={`${T.rowBorder} opacity-75`}>
                                <td className={`${T.cellEditLabel} text-ink-tertiary ${T.cellLabel}`}>
                                    <div className="flex items-center gap-1 min-w-0">
                                        <button
                                            onClick={() => onRestore(row.id)}
                                            className="shrink-0 p-1 rounded text-ink-tertiary hover:text-status-ok hover:bg-status-ok/10 transition-colors"
                                            title="Restaurar"
                                        >
                                            <Undo2 size={13} />
                                        </button>
                                        <div className="min-w-0 flex-1">
                                            <span
                                                className={`${T.rowLabel} line-through text-ink-tertiary truncate block`}
                                                title={getLabel(row)}
                                            >
                                                {getLabel(row)}
                                            </span>
                                            {row.deletedAt && (
                                                <span className="text-[10px] text-ink-tertiary truncate block" title={row.deletionReason}>
                                                    {formatDeletedDate(row.deletedAt)}
                                                    {row.deletionReason && ` · ${row.deletionReason}`}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                {renderCells && renderCells(row)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default RecycleBin
