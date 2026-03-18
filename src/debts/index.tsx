import React, { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import EditableCell from '../common/editablecell'
import DeleteRowButton from '../common/deletebutton'
import ViewSourceButton from '../common/viewsourcebutton'
import { T } from '../common/styles'
import TableShell, { SourceIcon } from '../common/tableshell'
import { useFieldUpdate } from '../common/usefieldupdate'
import { useRowHover } from '../common/userowhover'
import { useGridKeyboard } from '../common/usegridkeyboard'
import { defaultFormatCurrency } from '../common/utils'
import { useSoftDelete } from '../common/usesoftdelete'
import DeleteDialog from '../common/deletedialog'
import RecycleBin from '../common/recyclebin'
import type { SoftDeletable } from '../common/softdeletetypes'

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
} & SoftDeletable

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
    flush?: boolean

    // Formatting
    formatCurrency?: (value: number | null | undefined) => string

    // Source file viewing
    sourceFileIds?: string[]  // Source files for the whole table (shown in header)
    onViewSource?: (fileIds: string[]) => void
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
    defaultCollapsed = false,
    forceExpanded = false,
    flush = false,
    formatCurrency = defaultFormatCurrency,
    sourceFileIds,
    onViewSource,
}: DebtsTableProps) => {
    const { getHoverProps, isHovered: isRowHovered } = useRowHover()
    const [newEntry, setNewEntry] = useState({ entidad: '', tipo: '' })
    const { activeRows, deletedRows, deleteTargetId, requestDelete, confirmDelete, cancelDelete, restoreRow } = useSoftDelete(entries, onEntriesChange)
    const visibleRowIds = useMemo(() => activeRows.map(e => e.id), [activeRows])
    const keyboard = useGridKeyboard({ visibleRowIds, colCount: 2 })

    // ========================================================================
    // Entry Management
    // ========================================================================

    const { updateField: updateEntry } = useFieldUpdate(entries, onEntriesChange)

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

    const totalDeuda = activeRows.reduce((sum, e) => sum + (e.deuda_total || 0), 0)
    const totalVigente = activeRows.reduce((sum, e) => sum + (e.vigente || 0), 0)
    const totalAtraso = activeRows.reduce((sum, e) => {
        return sum + (e.atraso_30_59 || 0) + (e.atraso_60_89 || 0) + (e.atraso_90_mas || 0)
    }, 0)

    // Check if any entry has late payments
    const hasLatePayments = activeRows.some(e =>
        (e.atraso_30_59 && e.atraso_30_59 > 0) ||
        (e.atraso_60_89 && e.atraso_60_89 > 0) ||
        (e.atraso_90_mas && e.atraso_90_mas > 0)
    )

    // ========================================================================
    // Render Helpers
    // ========================================================================

    const renderDataRow = (entry: DebtEntry) => {
        const isHovered = isRowHovered(entry.id)
        const hasAtraso = (entry.atraso_30_59 && entry.atraso_30_59 > 0) ||
            (entry.atraso_60_89 && entry.atraso_60_89 > 0) ||
            (entry.atraso_90_mas && entry.atraso_90_mas > 0)

        return (
            <tr
                key={entry.id}
                className={`border-b border-gray-100 ${hasAtraso ? 'bg-red-50/50 hover:bg-red-100/50' : 'bg-rose-50/30 hover:bg-rose-100/50'} group`}
                {...getHoverProps(entry.id)}
            >
                {/* Entity */}
                <td className={`px-2 py-2.5 text-gray-700 ${T.cellLabel}`} style={{ width: '180px' }}>
                    <div className="flex items-center gap-1 min-w-0">
                        <DeleteRowButton onClick={() => requestDelete(entry.id)} isVisible={isHovered} size="default" title="Eliminar fila" />
                        <input
                            type="text"
                            value={entry.entidad}
                            onChange={(e) => updateEntry(entry.id, 'entidad', e.target.value)}
                            className={`flex-1 min-w-0 ${T.inputLabel} pl-1`}
                            placeholder="Entidad"
                            title={entry.entidad}
                        />
                        <ViewSourceButton sourceFileId={entry.sourceFileId} onViewSource={onViewSource} isVisible={isHovered} size="default" />
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
                    focused={keyboard.isFocused(entry.id, 0)}
                    onCellFocus={() => keyboard.focus(entry.id, 0)}
                    onNavigate={keyboard.navigate}
                    requestEdit={keyboard.isFocused(entry.id, 0) ? keyboard.editTrigger : 0}
                    requestClear={keyboard.isFocused(entry.id, 0) ? keyboard.clearTrigger : 0}
                    editInitialValue={keyboard.isFocused(entry.id, 0) ? keyboard.editInitialValue : undefined}
                />
                {/* Vigente */}
                <EditableCell
                    value={entry.vigente}
                    onChange={(v) => updateEntry(entry.id, 'vigente', v as number | null)}
                    isDeduction={false}
                    hasData={entry.vigente !== null}
                    width="120px"
                    type="currency"
                    focused={keyboard.isFocused(entry.id, 1)}
                    onCellFocus={() => keyboard.focus(entry.id, 1)}
                    onNavigate={keyboard.navigate}
                    requestEdit={keyboard.isFocused(entry.id, 1) ? keyboard.editTrigger : 0}
                    requestClear={keyboard.isFocused(entry.id, 1) ? keyboard.clearTrigger : 0}
                    editInitialValue={keyboard.isFocused(entry.id, 1) ? keyboard.editInitialValue : undefined}
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

    return (<>
        <TableShell
            headerBg={headerBg}
            defaultCollapsed={defaultCollapsed}
            forceExpanded={forceExpanded}
            flush={flush}
            renderHeader={({ isExpanded }) => (
                    <table className={T.table} style={{ tableLayout: 'fixed' }}>
                        <tbody>
                            <tr>
                                <td className="px-4 py-3 text-left" style={{ width: '180px' }}>
                                    <div className="flex items-center gap-2">
                                        <span className={`${headerText} ${T.headerTitle}`}>
                                            {title}
                                        </span>
                                        <SourceIcon fileIds={sourceFileIds} onViewSource={onViewSource} className={headerText} />
                                    </div>
                                </td>
                                <td className="px-3 py-3 text-right" style={{ width: '100px' }}>
                                    <span className={`${headerText} ${T.headerCount}`}>
                                        {activeRows.length} {activeRows.length === 1 ? 'deuda' : 'deudas'}
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
            )}
            contentProps={{ onKeyDown: keyboard.handleContainerKeyDown, tabIndex: 0 }}
        >
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
                        {activeRows.map(entry => renderDataRow(entry))}
                        {renderAddRow()}
                    </tbody>
                </table>
            <RecycleBin deletedRows={deletedRows} getLabel={(r) => r.entidad} onRestore={restoreRow} />
        </TableShell>
        {deleteTargetId && <DeleteDialog count={1} onConfirm={confirmDelete} onCancel={cancelDelete} />}
    </>
    )
}

export default DebtsTable
