import React, { useState } from 'react'
import { Eye, ChevronUp, ChevronDown } from 'lucide-react'
import { displayCurrencyCompact } from '../common/utils'
import { T } from '../common/styles'

// ============================================================================
// Types
// ============================================================================

export type TributarioEntry = {
    id: string
    source: 'carpeta-tributaria' | 'balance-anual'
    label: string
    // Carpeta tributaria fields
    rut?: string
    nombre?: string
    actividades?: string[]
    // Balance anual fields
    empresa?: string
    year?: string
    ingresos?: number | null
    egresos?: number | null
    sourceFileId?: string
}

export interface TributarioTableProps {
    title: string
    entries: TributarioEntry[]
    headerBg?: string
    headerText?: string
    defaultCollapsed?: boolean
    forceExpanded?: boolean
    sourceFileIds?: string[]
    onViewSource?: (fileIds: string[]) => void
}

// ============================================================================
// Helpers
// ============================================================================

const formatCurrency = (value: number | null | undefined): string => {
    return displayCurrencyCompact(value)
}

// ============================================================================
// Component
// ============================================================================

const TributarioTable = ({
    title,
    entries,
    headerBg = 'bg-amber-50',
    headerText = 'text-amber-700',
    defaultCollapsed = true,
    forceExpanded = false,
    sourceFileIds,
    onViewSource,
}: TributarioTableProps) => {
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
    const [hoveredRow, setHoveredRow] = useState<string | null>(null)

    const isExpanded = forceExpanded || !isCollapsed

    const balanceEntries = entries.filter(e => e.source === 'balance-anual')
    const carpetaEntries = entries.filter(e => e.source === 'carpeta-tributaria')

    // Calculate totals from balance entries
    const totalIngresos = balanceEntries.reduce((sum, e) => sum + (e.ingresos || 0), 0)
    const totalEgresos = balanceEntries.reduce((sum, e) => sum + (e.egresos || 0), 0)

    return (
        <div className={`rounded-xl overflow-hidden ${!isExpanded ? '' : 'border border-gray-200'}`}>
            {/* Accordion Header */}
            <button
                onClick={() => !forceExpanded && setIsCollapsed(!isCollapsed)}
                className={`w-full ${headerBg} hover:brightness-95 transition-all ${forceExpanded ? 'cursor-default' : 'cursor-pointer'} ${!isExpanded ? 'rounded-xl' : 'rounded-t-xl'}`}
            >
                <div className="overflow-x-auto">
                    <table className={T.table} style={{ tableLayout: 'fixed' }}>
                        <tbody>
                            <tr>
                                <td className="px-4 py-3 text-left" style={{ width: '200px' }}>
                                    <div className="flex items-center gap-2">
                                        <span className={`${headerText} ${T.headerTitle}`}>
                                            {title}
                                        </span>
                                        {sourceFileIds && sourceFileIds.length > 0 && onViewSource && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    onViewSource(sourceFileIds)
                                                }}
                                                className="p-1 rounded hover:bg-white/50 transition-colors"
                                                title="Ver documento fuente"
                                            >
                                                <Eye size={14} className={headerText} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                                <td className="px-3 py-3 text-right" style={{ width: '120px' }}>
                                    <span className={`${headerText} ${T.headerCount}`}>
                                        {entries.length} {entries.length === 1 ? 'documento' : 'documentos'}
                                    </span>
                                </td>
                                {balanceEntries.length > 0 && (
                                    <>
                                        <td className="px-3 py-3 text-right" style={{ width: '140px' }}>
                                            <span className={`${headerText} ${T.headerStatLabel}`}>Ingresos: </span>
                                            <span className={`${T.headerStat} ${totalIngresos > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>
                                                {totalIngresos > 0 ? formatCurrency(totalIngresos) : '—'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3 text-right" style={{ width: '140px' }}>
                                            <span className={`${headerText} ${T.headerStatLabel}`}>Egresos: </span>
                                            <span className={`${T.headerStat} ${totalEgresos > 0 ? headerText : 'text-gray-400'}`}>
                                                {totalEgresos > 0 ? formatCurrency(totalEgresos) : '—'}
                                            </span>
                                        </td>
                                    </>
                                )}
                                {balanceEntries.length === 0 && (
                                    <>
                                        <td className="px-3 py-3 text-right" style={{ width: '140px' }}></td>
                                        <td className="px-3 py-3 text-right" style={{ width: '140px' }}></td>
                                    </>
                                )}
                                <td className="px-2 py-3 text-right" style={{ width: '40px' }}>
                                    {!forceExpanded && (
                                        isExpanded ? <ChevronUp size={20} className={headerText} /> : <ChevronDown size={20} className={headerText} />
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </button>

            {/* Collapsible Content */}
            <div className={`bg-white ${!isExpanded ? 'hidden print:block' : ''}`}>
                <div className="overflow-x-auto">
                    <table className={T.table} style={{ tableLayout: 'fixed' }}>
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50/50">
                                <th className={`px-4 py-2 text-left ${T.th}`} style={{ width: '200px' }}>Documento</th>
                                <th className={`px-2 py-2 text-left ${T.th}`} style={{ width: '120px' }}>Detalle</th>
                                <th className={`px-3 py-2 text-right ${T.th}`} style={{ width: '140px' }}>Ingresos</th>
                                <th className={`px-3 py-2 text-right ${T.th}`} style={{ width: '140px' }}>Egresos</th>
                                <th style={{ width: '40px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Balance Anual entries */}
                            {balanceEntries.map(entry => (
                                <tr
                                    key={entry.id}
                                    className="border-b border-gray-100 bg-amber-50/30 hover:bg-amber-100/50 group"
                                    onMouseEnter={() => setHoveredRow(entry.id)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                >
                                    <td className={`px-4 py-2.5 text-gray-700 ${T.cellLabel}`} style={{ width: '200px' }}>
                                        <div className="flex items-center gap-1 min-w-0">
                                            <span className="font-medium text-xs truncate" title={entry.empresa || entry.label}>{entry.empresa || entry.label}</span>
                                            {entry.sourceFileId && onViewSource && (
                                                <button
                                                    onClick={() => onViewSource([entry.sourceFileId!])}
                                                    className={`p-1 rounded transition-all shrink-0 ${hoveredRow === entry.id ? 'opacity-100 text-gray-400 hover:text-gray-600 hover:bg-gray-100' : 'opacity-0'}`}
                                                    title="Ver documento fuente"
                                                >
                                                    <Eye size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td className={`px-2 py-2.5 ${T.muted}`} style={{ width: '120px' }}>
                                        {entry.year ? `Año ${entry.year}` : '—'}
                                    </td>
                                    <td className="px-3 py-2.5 text-right text-emerald-700 font-medium" style={{ width: '140px' }}>
                                        {formatCurrency(entry.ingresos)}
                                    </td>
                                    <td className="px-3 py-2.5 text-right text-amber-700 font-medium" style={{ width: '140px' }}>
                                        {formatCurrency(entry.egresos)}
                                    </td>
                                    <td style={{ width: '40px' }}></td>
                                </tr>
                            ))}
                            {/* Carpeta Tributaria entries */}
                            {carpetaEntries.map(entry => (
                                <tr
                                    key={entry.id}
                                    className="border-b border-gray-100 bg-amber-50/30 hover:bg-amber-100/50 group"
                                    onMouseEnter={() => setHoveredRow(entry.id)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                >
                                    <td className={`px-4 py-2.5 text-gray-700 ${T.cellLabel}`} style={{ width: '200px' }}>
                                        <div className="flex items-center gap-1 min-w-0">
                                            <span className="font-medium text-xs truncate">Carpeta Tributaria</span>
                                            {entry.sourceFileId && onViewSource && (
                                                <button
                                                    onClick={() => onViewSource([entry.sourceFileId!])}
                                                    className={`p-1 rounded transition-all shrink-0 ${hoveredRow === entry.id ? 'opacity-100 text-gray-400 hover:text-gray-600 hover:bg-gray-100' : 'opacity-0'}`}
                                                    title="Ver documento fuente"
                                                >
                                                    <Eye size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td className={`px-2 py-2.5 ${T.muted}`} colSpan={3} style={{ width: '400px' }}>
                                        {entry.actividades && entry.actividades.length > 0
                                            ? entry.actividades.join(', ')
                                            : '—'}
                                    </td>
                                    <td style={{ width: '40px' }}></td>
                                </tr>
                            ))}
                            {/* Empty state */}
                            {entries.length === 0 && (
                                <tr className="border-b border-gray-100">
                                    <td className={`px-4 py-3 ${T.empty}`} colSpan={5}>
                                        Sin información tributaria
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default TributarioTable
