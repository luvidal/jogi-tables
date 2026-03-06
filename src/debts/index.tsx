import React, { useState } from 'react'
import { X, Eye, ChevronUp, ChevronDown } from 'lucide-react'
import EditableCell from '../common/editablecell'
import { T } from '../common/styles'

// ============================================================================
// Types
// ============================================================================

export type DebtEntry = {
    id: string
    entidad: string           // Bank/institution name
    tipo: string              // Debt type (Consumo, Vivienda, Comercial, etc.)
    deuda_total: number | null    // Total debt amount (Total del crédito)
    vigente: number | null        // Current/on-time amount
    atraso_30_59?: number | null  // 30-59 days late
    atraso_60_89?: number | null  // 60-89 days late
    atraso_90_mas?: number | null // 90+ days late
    sourceFileId?: string     // Source file for traceability
}

export interface DebtsTableProps {
    // Header
    title: string                    // "Deudas Financieras"

    // Data
    entries: DebtEntry[]
    onEntriesChange: (entries: DebtEntry[]) => void

    // Summary data from informe-deuda header
    summary?: {
        rut?: string
        nombre?: string
        deuda_total?: number
        fecha_informe?: string
    }

    // Appearance - matches accordion section colors
    headerBg?: string       // e.g., 'bg-rose-50' from section colors
    headerText?: string     // e.g., 'text-rose-700' from section colors

    // Behavior
    defaultCollapsed?: boolean
    forceExpanded?: boolean

    // Formatting
    formatCurrency?: (value: number | null | undefined) => string

    // Source file viewing
    sourceFileIds?: string[]  // Source files for the whole table (shown in header)
    onViewSource?: (fileIds: string[]) => void
}

// ============================================================================
// Helpers
// ============================================================================

const defaultFormatCurrency = (value: number | null | undefined): string => {
    if (value === undefined || value === null) return '—'
    return `$ ${value.toLocaleString('es-CL')}`
}

// ============================================================================
// Component
// ============================================================================

const DebtsTable = ({
    title,
    entries,
    onEntriesChange,
    summary,
    headerBg = 'bg-rose-50',
    headerText = 'text-rose-700',
    defaultCollapsed = true,
    forceExpanded = false,
    formatCurrency = defaultFormatCurrency,
    sourceFileIds,
    onViewSource,
}: DebtsTableProps) => {
    const [hoveredRow, setHoveredRow] = useState<string | null>(null)
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
    const [newEntry, setNewEntry] = useState({ entidad: '', tipo: '' })

    const isExpanded = forceExpanded || !isCollapsed

    // ========================================================================
    // Entry Management
    // ========================================================================

    const updateEntry = (id: string, field: keyof DebtEntry, value: string | number | null) => {
        onEntriesChange(entries.map(e => e.id === id ? { ...e, [field]: value } : e))
    }

    const removeEntry = (id: string) => {
        onEntriesChange(entries.filter(e => e.id !== id))
    }

    const addEntry = () => {
        if (!newEntry.entidad.trim()) return
        const entry: DebtEntry = {
            id: `debt_${Date.now()}`,
            entidad: newEntry.entidad.trim(),
            tipo: newEntry.tipo.trim() || 'Consumo',
            deuda_total: null,
            vigente: null,
        }
        setNewEntry({ entidad: '', tipo: '' })
        onEntriesChange([...entries, entry])
    }

    const addEntryWithValue = (field: 'deuda_total' | 'vigente', value: number | null) => {
        if (value === null) return
        const entry: DebtEntry = {
            id: `debt_${Date.now()}`,
            entidad: newEntry.entidad.trim() || 'Nueva deuda',
            tipo: newEntry.tipo.trim() || 'Consumo',
            deuda_total: field === 'deuda_total' ? value : null,
            vigente: field === 'vigente' ? value : null,
        }
        setNewEntry({ entidad: '', tipo: '' })
        onEntriesChange([...entries, entry])
    }

    // ========================================================================
    // Calculations
    // ========================================================================

    const totalDeuda = entries.reduce((sum, e) => sum + (e.deuda_total || 0), 0)
    const totalVigente = entries.reduce((sum, e) => sum + (e.vigente || 0), 0)
    const totalAtraso = entries.reduce((sum, e) => {
        return sum + (e.atraso_30_59 || 0) + (e.atraso_60_89 || 0) + (e.atraso_90_mas || 0)
    }, 0)

    // Check if any entry has late payments
    const hasLatePayments = entries.some(e =>
        (e.atraso_30_59 && e.atraso_30_59 > 0) ||
        (e.atraso_60_89 && e.atraso_60_89 > 0) ||
        (e.atraso_90_mas && e.atraso_90_mas > 0)
    )

    // ========================================================================
    // Render Helpers
    // ========================================================================

    const renderDataRow = (entry: DebtEntry) => {
        const isHovered = hoveredRow === entry.id
        const hasAtraso = (entry.atraso_30_59 && entry.atraso_30_59 > 0) ||
            (entry.atraso_60_89 && entry.atraso_60_89 > 0) ||
            (entry.atraso_90_mas && entry.atraso_90_mas > 0)

        return (
            <tr
                key={entry.id}
                className={`border-b border-gray-100 ${hasAtraso ? 'bg-red-50/50 hover:bg-red-100/50' : 'bg-rose-50/30 hover:bg-rose-100/50'} group`}
                onMouseEnter={() => setHoveredRow(entry.id)}
                onMouseLeave={() => setHoveredRow(null)}
            >
                {/* Entity */}
                <td className={`px-2 py-2.5 text-gray-700 ${T.cellLabel}`} style={{ width: '180px' }}>
                    <div className="flex items-center gap-1 min-w-0">
                        <button
                            onClick={() => removeEntry(entry.id)}
                            className={`p-1 rounded transition-all shrink-0 ${isHovered ? 'opacity-100 text-red-400 hover:text-red-600 hover:bg-red-100' : 'opacity-0'}`}
                            title="Eliminar fila"
                        >
                            <X size={16} />
                        </button>
                        <input
                            type="text"
                            value={entry.entidad}
                            onChange={(e) => updateEntry(entry.id, 'entidad', e.target.value)}
                            className={`flex-1 min-w-0 ${T.inputLabel} pl-1`}
                            placeholder="Entidad"
                            title={entry.entidad}
                        />
                        {entry.sourceFileId && onViewSource && (
                            <button
                                onClick={() => onViewSource([entry.sourceFileId!])}
                                className={`p-1 rounded transition-all shrink-0 ${isHovered ? 'opacity-100 text-gray-400 hover:text-gray-600 hover:bg-gray-100' : 'opacity-0'}`}
                                title="Ver documento fuente"
                            >
                                <Eye size={14} />
                            </button>
                        )}
                    </div>
                </td>
                {/* Type */}
                <td className="px-2 py-2.5 text-gray-600" style={{ width: '100px' }}>
                    <input
                        type="text"
                        value={entry.tipo}
                        onChange={(e) => updateEntry(entry.id, 'tipo', e.target.value)}
                        className={`w-full ${T.input} pl-1`}
                        placeholder="Tipo"
                    />
                </td>
                {/* Total Debt */}
                <EditableCell
                    value={entry.deuda_total}
                    onChange={(v) => updateEntry(entry.id, 'deuda_total', v as number | null)}
                    isDeduction={true}
                    hasData={entry.deuda_total !== null}
                    width="120px"
                    type="currency"
                />
                {/* Vigente */}
                <EditableCell
                    value={entry.vigente}
                    onChange={(v) => updateEntry(entry.id, 'vigente', v as number | null)}
                    isDeduction={false}
                    hasData={entry.vigente !== null}
                    width="120px"
                    type="currency"
                />
                {/* Atraso (combined display for simplicity) */}
                {hasLatePayments && (
                    <td className="px-3 py-2.5 text-right text-red-600 font-medium" style={{ width: '100px' }}>
                        {hasAtraso ? formatCurrency(
                            (entry.atraso_30_59 || 0) + (entry.atraso_60_89 || 0) + (entry.atraso_90_mas || 0)
                        ) : '—'}
                    </td>
                )}
                <td style={{ width: '40px' }}></td>
            </tr>
        )
    }

    const renderAddRow = () => {
        return (
            <tr className="border-b border-dashed bg-rose-50/20 border-rose-100">
                {/* Entity */}
                <td className="px-4 py-2.5" style={{ width: '180px' }}>
                    <input
                        type="text"
                        placeholder="Agregar deuda..."
                        value={newEntry.entidad}
                        onChange={(e) => setNewEntry(prev => ({ ...prev, entidad: e.target.value }))}
                        className={`w-full ${T.inputPlaceholder}`}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && newEntry.entidad.trim()) {
                                addEntry()
                            }
                        }}
                    />
                </td>
                {/* Type */}
                <td className="px-2 py-2.5" style={{ width: '100px' }}>
                    <input
                        type="text"
                        placeholder="Tipo"
                        value={newEntry.tipo}
                        onChange={(e) => setNewEntry(prev => ({ ...prev, tipo: e.target.value }))}
                        className={`w-full ${T.inputPlaceholder}`}
                    />
                </td>
                {/* Total Debt */}
                <EditableCell
                    value={null}
                    onChange={(v) => addEntryWithValue('deuda_total', v as number | null)}
                    isDeduction={true}
                    hasData={false}
                    width="120px"
                    type="currency"
                />
                {/* Vigente */}
                <EditableCell
                    value={null}
                    onChange={(v) => addEntryWithValue('vigente', v as number | null)}
                    isDeduction={false}
                    hasData={false}
                    width="120px"
                    type="currency"
                />
                {hasLatePayments && <td style={{ width: '100px' }}></td>}
                <td style={{ width: '40px' }}></td>
            </tr>
        )
    }

    // ========================================================================
    // Main Render
    // ========================================================================

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
                                <td className="px-4 py-3 text-left" style={{ width: '180px' }}>
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
                                <td className="px-3 py-3 text-right" style={{ width: '100px' }}>
                                    <span className={`${headerText} ${T.headerCount}`}>
                                        {entries.length} {entries.length === 1 ? 'deuda' : 'deudas'}
                                    </span>
                                </td>
                                <td className="px-3 py-3 text-right" style={{ width: '120px' }}>
                                    <span className={`${headerText} ${T.headerStatLabel}`}>Total: </span>
                                    <span className={`${T.headerStat} ${totalDeuda > 0 ? headerText : 'text-gray-400'}`}>
                                        {totalDeuda > 0 ? formatCurrency(totalDeuda) : '—'}
                                    </span>
                                </td>
                                <td className="px-3 py-3 text-right" style={{ width: '120px' }}>
                                    <span className={`${headerText} ${T.headerStatLabel}`}>Vigente: </span>
                                    <span className={`${T.headerStat} ${totalVigente > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>
                                        {totalVigente > 0 ? formatCurrency(totalVigente) : '—'}
                                    </span>
                                </td>
                                {hasLatePayments && (
                                    <td className="px-3 py-3 text-right" style={{ width: '100px' }}>
                                        <span className={`text-red-600 ${T.headerStatLabel}`}>Atraso: </span>
                                        <span className={`${T.headerStat} text-red-600`}>
                                            {formatCurrency(totalAtraso)}
                                        </span>
                                    </td>
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
                                <th className={`px-4 py-2 text-left ${T.th}`} style={{ width: '180px' }}>Institución</th>
                                <th className={`px-2 py-2 text-left ${T.th}`} style={{ width: '100px' }}>Tipo</th>
                                <th className={`px-3 py-2 text-right ${T.th}`} style={{ width: '120px' }}>Total Crédito</th>
                                <th className={`px-3 py-2 text-right ${T.th}`} style={{ width: '120px' }}>Vigente</th>
                                {hasLatePayments && (
                                    <th className={`px-3 py-2 text-right text-red-500 font-medium text-xs uppercase`} style={{ width: '100px' }}>Atraso</th>
                                )}
                                <th style={{ width: '40px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map(entry => renderDataRow(entry))}
                            {renderAddRow()}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default DebtsTable
