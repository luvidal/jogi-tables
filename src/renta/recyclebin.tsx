import { useState } from 'react'
import { ChevronDown, ChevronUp, Undo2, Trash2 } from 'lucide-react'
import { isSubtractType } from './helpers'
import { T } from '../common/styles'
import type { RowData, Month } from './types'

interface RecycleBinProps {
    deletedRows: RowData[]
    months: Month[]
    onRestore: (id: string) => void
    formatValue: (value: number | null | undefined) => string
    showVariableColumn?: boolean
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

const RecycleBin = ({ deletedRows, months, onRestore, formatValue, showVariableColumn = false }: RecycleBinProps) => {
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
                    <table className={T.table} style={{ tableLayout: 'fixed' }}>
                        <tbody>
                            {deletedRows.map(row => {
                                const subtract = isSubtractType(row.type)

                                return (
                                    <tr key={row.id} className="border-b border-gray-100 opacity-75 group">
                                        <td className={`pl-1 pr-2 py-1.5 text-gray-500 ${T.cellLabel}`} style={{ width: '180px' }}>
                                            <div className="flex items-center gap-1 min-w-0">
                                                <button
                                                    onClick={() => onRestore(row.id)}
                                                    className="shrink-0 p-1 rounded text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                                                    title="Restaurar"
                                                >
                                                    <Undo2 size={13} />
                                                </button>
                                                <div className="min-w-0 flex-1">
                                                    <span
                                                        className={`${T.rowLabel} line-through text-gray-400 truncate block`}
                                                        title={row.label}
                                                    >
                                                        {row.label}
                                                    </span>
                                                    {row.deletedAt && (
                                                        <span className="text-[10px] text-gray-400 truncate block" title={row.deletionReason}>
                                                            {formatDeletedDate(row.deletedAt)}
                                                            {row.deletionReason && ` · ${row.deletionReason}`}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        {months.map(m => {
                                            const v = row.values[m.id]
                                            const hasValue = v != null
                                            return (
                                                <td
                                                    key={m.id}
                                                    className="px-2 py-1.5 text-right tabular-nums"
                                                    style={{ width: '110px' }}
                                                >
                                                    <span className={`${T.totalValue} ${hasValue ? (subtract ? 'text-rose-300' : 'text-gray-400') : 'text-gray-200'}`}>
                                                        {hasValue ? formatValue(v) : '—'}
                                                    </span>
                                                </td>
                                            )
                                        })}
                                        <td style={{ width: '40px' }} />
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
            )}
        </div>
    )
}

export default RecycleBin
