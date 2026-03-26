import React, { useState, useMemo, useCallback } from 'react'
import { GripVertical, X, Eye, Info, Trash2 } from 'lucide-react'
import EditableCell from '../common/editablecell'
import { T } from '../common/styles'
import { useGridKeyboard } from '../common/usegridkeyboard'
import { applyAutoConversions, applyAutoCompute } from '../common/autoconvert'
import type { AutoConvertRule, AutoComputeRule } from '../common/autoconvert'
import { defaultFormatCurrency } from '../common/utils'
import { useSoftDelete } from '../common/usesoftdelete'
import { useDragReorder } from '../common/usedragreorder'
import DeleteDialog from '../common/deletedialog'
import RecycleBin from '../common/recyclebin'
import type { DeudaConsumoRow, DeudasConsumoTableProps } from './types'

const LINEAS_TC_PATTERN = /l[ií]nea|tarjeta|tc/i

const DeudasConsumoTable = ({
    rows,
    onRowsChange,
    formatCurrency = defaultFormatCurrency,
    ufValue,
    castigo = 0.05,
    headerBg = 'bg-rose-50',
    headerText = 'text-rose-700',
    onViewSource,
}: DeudasConsumoTableProps) => {
    const [hoveredRow, setHoveredRow] = useState<string | null>(null)
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
    const [newRow, setNewRow] = useState({ institucion: '', tipo_deuda: '' })
    const { activeRows, deletedRows, deleteTargetId, requestDelete, confirmDelete, cancelDelete, restoreRow } = useSoftDelete(rows, onRowsChange)
    const visibleRowIds = useMemo(() => activeRows.map(r => r.id), [activeRows])
    const keyboard = useGridKeyboard({ visibleRowIds, colCount: 6 })
    const drag = useDragReorder()

    const anySelected = selectedRows.size > 0

    // Selection
    const toggleSelect = useCallback((rowId: string) => {
        setSelectedRows(prev => {
            const next = new Set(prev)
            if (next.has(rowId)) next.delete(rowId)
            else next.add(rowId)
            return next
        })
    }, [])

    const clearSelection = useCallback(() => setSelectedRows(new Set()), [])

    const requestDeleteSelected = useCallback(() => {
        for (const id of selectedRows) requestDelete(id)
        clearSelection()
    }, [selectedRows, requestDelete, clearSelection])

    const handleRowClick = useCallback((e: React.MouseEvent, rowId: string) => {
        if (!(e.metaKey || e.ctrlKey)) return
        const target = e.target as HTMLElement
        if (target.closest('input, button, [role="button"]')) return
        e.preventDefault()
        toggleSelect(rowId)
    }, [toggleSelect])

    // Auto-conversion rules: UF↔CLP
    const conversionRules: AutoConvertRule[] = ufValue ? [
        { source: 'saldo_deuda_uf', target: 'saldo_deuda_pesos', formula: (v) => v * ufValue, precision: 0 },
        { source: 'saldo_deuda_pesos', target: 'saldo_deuda_uf', formula: (v) => v / ufValue, precision: 2 },
    ] : []

    // Auto-compute: castigo for líneas/TC, and castigo fallback for estimated cuotas
    const computeRules: AutoComputeRule[] = [
        {
            target: 'monto_cuota',
            depends: ['saldo_deuda_uf', 'saldo_deuda_pesos', 'tipo_deuda', 'castigo_pct'],
            condition: (row) => LINEAS_TC_PATTERN.test(row.tipo_deuda) && row.saldo_deuda_pesos != null,
            formula: (row) => Math.round((row.saldo_deuda_pesos ?? 0) * (row.castigo_pct ?? castigo)),
        },
        {
            target: 'monto_cuota',
            depends: ['saldo_deuda_uf', 'saldo_deuda_pesos', 'castigo_pct'],
            condition: (row) => row.cuota_estimated === true && !LINEAS_TC_PATTERN.test(row.tipo_deuda) && row.saldo_deuda_pesos != null,
            formula: (row) => Math.round((row.saldo_deuda_pesos ?? 0) * (row.castigo_pct ?? castigo)),
        },
    ]

    const updateField = (id: string, field: keyof DeudaConsumoRow, value: string | number | null) => {
        onRowsChange(rows.map(r => {
            if (r.id !== id) return r
            let next = applyAutoConversions(r, field, value, conversionRules, {})
            next = applyAutoCompute(next, field, computeRules, {})
            // Clear estimated flag and castigo when user manually edits cuota
            if (field === 'monto_cuota') next = { ...next, cuota_estimated: false, castigo_pct: undefined }
            return next
        }))
    }

    const addRow = () => {
        if (!newRow.institucion.trim()) return
        const row: DeudaConsumoRow = {
            id: `dc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            institucion: newRow.institucion.trim(),
            tipo_deuda: newRow.tipo_deuda.trim(),
            saldo_deuda_uf: null,
            saldo_deuda_pesos: null,
            monto_cuota: null,
            cuotas_pagadas: null,
            cuotas_total: null,
        }
        setNewRow({ institucion: '', tipo_deuda: '' })
        onRowsChange([...rows, row])
    }

    const totalSaldoPesos = activeRows.reduce((s, r) => s + (r.saldo_deuda_pesos || 0), 0)
    const totalMontoCuota = activeRows.reduce((s, r) => s + (r.monto_cuota || 0), 0)

    const isAutoComputed = (row: DeudaConsumoRow, field: string): boolean => {
        if (field === 'saldo_deuda_pesos' && row.saldo_deuda_uf != null && ufValue) return true
        if (field === 'monto_cuota' && LINEAS_TC_PATTERN.test(row.tipo_deuda) && row.saldo_deuda_pesos != null) return true
        return false
    }

    /** Cuota className: rose for línea/TC auto-compute, gray for 5% fallback estimate */
    const cuotaClassName = (row: DeudaConsumoRow): string => {
        if (isAutoComputed(row, 'monto_cuota')) return 'italic text-rose-400'
        if (row.cuota_estimated) return 'italic text-gray-400'
        return ''
    }

    return (<>
        <div className="overflow-x-auto" onKeyDown={keyboard.handleContainerKeyDown} tabIndex={0}>
            <table className={T.table} style={{ tableLayout: 'fixed' }}>
                <thead>
                    <tr className={`${headerBg} border-t border-rose-200 ${headerText}`}>
                        {anySelected ? (
                            <th colSpan={8} className="px-4 py-1.5 text-left" onClick={e => e.stopPropagation()}>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-rose-600">
                                        {selectedRows.size} fila{selectedRows.size !== 1 ? 's' : ''}
                                    </span>
                                    <button
                                        onClick={requestDeleteSelected}
                                        className="text-xs px-3 py-1 rounded-full text-red-600 hover:bg-red-100 transition-colors flex items-center gap-1"
                                        title="Eliminar filas seleccionadas"
                                    >
                                        <Trash2 size={12} />
                                        Eliminar
                                    </button>
                                    <button
                                        onClick={clearSelection}
                                        className="text-xs px-2 py-1 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </th>
                        ) : (
                            <>
                                <th className={`px-2 py-1.5 text-left ${T.th} ${headerText}`} style={{ width: '160px' }}>Institución</th>
                                <th className={`px-2 py-1.5 text-left ${T.th} ${headerText}`} style={{ width: '120px' }}>Tipo Deuda</th>
                                <th className={`px-2 py-1.5 text-right ${T.th} ${headerText}`} style={{ width: '100px' }}>Saldo UF</th>
                                <th className={`px-2 py-1.5 text-right ${T.th} ${headerText}`} style={{ width: '120px' }}>Saldo $</th>
                                <th className={`px-2 py-1.5 text-right ${T.th} ${headerText}`} style={{ width: '110px' }}>Cuota $</th>
                                <th className={`px-2 py-1.5 text-center ${T.th} ${headerText}`} style={{ width: '50px' }}>%</th>
                                <th className={`px-2 py-1.5 text-center ${T.th} ${headerText}`} style={{ width: '90px' }}>Cuotas</th>
                                <th style={{ width: '40px' }}></th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {activeRows.map(row => {
                        const isHovered = hoveredRow === row.id
                        const selected = selectedRows.has(row.id)
                        const showCheckbox = anySelected || isHovered
                        const isDragging = drag.dragRowId === row.id
                        const dropBorder = drag.dropTargetId === row.id
                            ? drag.dropPosition === 'above' ? 'border-t-2 border-t-blue-400' : 'border-b-2 border-b-blue-400'
                            : ''
                        return (
                            <tr
                                key={row.id}
                                className={`border-b border-gray-100 ${selected ? 'bg-rose-50/60' : 'hover:bg-gray-50'} ${isDragging ? 'opacity-40' : ''} ${dropBorder}`}
                                onMouseEnter={() => setHoveredRow(row.id)}
                                onMouseLeave={() => setHoveredRow(null)}
                                onClick={e => handleRowClick(e, row.id)}
                                onDragOver={drag.handleDragOver(row.id)}
                                onDragLeave={drag.handleDragLeave}
                                onDrop={drag.handleDrop(rows, onRowsChange)}
                            >
                                <td className={`pl-1 pr-2 py-2.5 ${T.cellLabel} relative`} style={{ width: '160px' }}>
                                    <div className="flex items-center gap-0.5 min-w-0">
                                        {isHovered && !anySelected && (
                                            <span
                                                draggable
                                                onDragStart={drag.handleDragStart(row.id)}
                                                onDragEnd={drag.handleDragEnd}
                                                className="shrink-0 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500"
                                                title="Arrastrar para reordenar"
                                            >
                                                <GripVertical size={14} />
                                            </span>
                                        )}
                                        {showCheckbox ? (
                                            <input
                                                type="checkbox"
                                                checked={selected}
                                                onChange={() => toggleSelect(row.id)}
                                                className="shrink-0 w-3.5 h-3.5 rounded border-gray-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                                            />
                                        ) : null}
                                        <input
                                            type="text"
                                            value={row.institucion}
                                            onChange={e => updateField(row.id, 'institucion', e.target.value)}
                                            className={`flex-1 min-w-0 ${T.inputLabel} ${isHovered || showCheckbox ? '' : 'pl-1'}`}
                                            placeholder="Institución"
                                        />
                                    </div>
                                    {isHovered && row.sourceFileId && onViewSource && (
                                        <button
                                            onClick={() => onViewSource([row.sourceFileId!])}
                                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[2px] p-0.5 rounded text-rose-400 hover:text-rose-600 hover:bg-rose-100"
                                            title="Ver documento fuente"
                                        >
                                            <Eye size={14} />
                                        </button>
                                    )}
                                </td>
                                <td className="px-2 py-2.5" style={{ width: '120px' }}>
                                    <input
                                        type="text"
                                        value={row.tipo_deuda}
                                        onChange={e => updateField(row.id, 'tipo_deuda', e.target.value)}
                                        className={`w-full ${T.input} pl-1`}
                                        placeholder="Tipo"
                                    />
                                </td>
                                <EditableCell
                                    value={row.saldo_deuda_uf}
                                    onChange={v => updateField(row.id, 'saldo_deuda_uf', v as number | null)}
                                    type="number"
                                    hasData={row.saldo_deuda_uf !== null}
                                    width="100px"
                                    focused={keyboard.isFocused(row.id, 0)}
                                    onCellFocus={() => keyboard.focus(row.id, 0)}
                                    onNavigate={keyboard.navigate}
                                    requestEdit={keyboard.isFocused(row.id, 0) ? keyboard.editTrigger : 0}
                                    requestClear={keyboard.isFocused(row.id, 0) ? keyboard.clearTrigger : 0}
                                    editInitialValue={keyboard.isFocused(row.id, 0) ? keyboard.editInitialValue : undefined}
                                />
                                <EditableCell
                                    value={row.saldo_deuda_pesos}
                                    onChange={v => updateField(row.id, 'saldo_deuda_pesos', v as number | null)}
                                    type="currency"
                                    hasData={row.saldo_deuda_pesos !== null}
                                    width="120px"
                                    className={isAutoComputed(row, 'saldo_deuda_pesos') ? 'italic text-rose-400' : ''}
                                    focused={keyboard.isFocused(row.id, 1)}
                                    onCellFocus={() => keyboard.focus(row.id, 1)}
                                    onNavigate={keyboard.navigate}
                                    requestEdit={keyboard.isFocused(row.id, 1) ? keyboard.editTrigger : 0}
                                    requestClear={keyboard.isFocused(row.id, 1) ? keyboard.clearTrigger : 0}
                                    editInitialValue={keyboard.isFocused(row.id, 1) ? keyboard.editInitialValue : undefined}
                                />
                                <td className="relative" style={{ width: '110px' }}>
                                    <EditableCell
                                        value={row.monto_cuota}
                                        onChange={v => updateField(row.id, 'monto_cuota', v as number | null)}
                                        type="currency"
                                        hasData={row.monto_cuota !== null}
                                        width="110px"
                                        className={cuotaClassName(row)}
                                        focused={keyboard.isFocused(row.id, 2)}
                                        onCellFocus={() => keyboard.focus(row.id, 2)}
                                        onNavigate={keyboard.navigate}
                                        requestEdit={keyboard.isFocused(row.id, 2) ? keyboard.editTrigger : 0}
                                        requestClear={keyboard.isFocused(row.id, 2) ? keyboard.clearTrigger : 0}
                                        editInitialValue={keyboard.isFocused(row.id, 2) ? keyboard.editInitialValue : undefined}
                                        asDiv
                                    />
                                    {isHovered && row.cuota_estimated && row.saldo_deuda_pesos != null && !row.castigo_pct && (
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[2px] group/info">
                                            <button className="p-0.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                                                <Info size={13} />
                                            </button>
                                            <div className="hidden group-hover/info:block absolute bottom-full right-0 mb-1 px-2 py-1 rounded bg-gray-800 text-white text-[10px] whitespace-nowrap z-50 shadow-lg">
                                                Estimado: {Math.round((row.castigo_pct ?? castigo) * 100)}% de {formatCurrency(row.saldo_deuda_pesos)}
                                            </div>
                                        </div>
                                    )}
                                    {isHovered && row.cuota_source_file_id && onViewSource && (
                                        <button
                                            onClick={() => onViewSource([row.cuota_source_file_id!])}
                                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[2px] p-0.5 rounded text-rose-400 hover:text-rose-600 hover:bg-rose-100"
                                            title="Ver documento fuente"
                                        >
                                            <Eye size={13} />
                                        </button>
                                    )}
                                </td>
                                <td className="text-center" style={{ width: '50px' }}>
                                    {row.cuota_estimated ? (
                                        <EditableCell
                                            value={row.castigo_pct != null ? Math.round(row.castigo_pct * 100) : Math.round(castigo * 100)}
                                            onChange={v => updateField(row.id, 'castigo_pct', v != null ? (v as number) / 100 : castigo)}
                                            type="number"
                                            hasData={true}
                                            width="50px"
                                            align="center"
                                            className="italic text-gray-400"
                                            asDiv
                                            focused={keyboard.isFocused(row.id, 3)}
                                            onCellFocus={() => keyboard.focus(row.id, 3)}
                                            onNavigate={keyboard.navigate}
                                            requestEdit={keyboard.isFocused(row.id, 3) ? keyboard.editTrigger : 0}
                                            requestClear={keyboard.isFocused(row.id, 3) ? keyboard.clearTrigger : 0}
                                            editInitialValue={keyboard.isFocused(row.id, 3) ? keyboard.editInitialValue : undefined}
                                        />
                                    ) : (
                                        <span className="text-[11px] text-gray-300">—</span>
                                    )}
                                </td>
                                <td className="text-center text-xs text-gray-500" style={{ width: '90px' }}>
                                    <div className="flex items-center justify-center gap-0.5">
                                        <EditableCell
                                            value={row.cuotas_pagadas}
                                            onChange={v => updateField(row.id, 'cuotas_pagadas', v as number | null)}
                                            type="number"
                                            hasData={row.cuotas_pagadas !== null}
                                            width="35px"
                                            align="center"
                                            asDiv
                                            focused={keyboard.isFocused(row.id, 4)}
                                            onCellFocus={() => keyboard.focus(row.id, 4)}
                                            onNavigate={keyboard.navigate}
                                            requestEdit={keyboard.isFocused(row.id, 4) ? keyboard.editTrigger : 0}
                                            requestClear={keyboard.isFocused(row.id, 4) ? keyboard.clearTrigger : 0}
                                            editInitialValue={keyboard.isFocused(row.id, 4) ? keyboard.editInitialValue : undefined}
                                        />
                                        <span className="text-gray-400">/</span>
                                        <EditableCell
                                            value={row.cuotas_total}
                                            onChange={v => updateField(row.id, 'cuotas_total', v as number | null)}
                                            type="number"
                                            hasData={row.cuotas_total !== null}
                                            width="35px"
                                            align="center"
                                            asDiv
                                            focused={keyboard.isFocused(row.id, 5)}
                                            onCellFocus={() => keyboard.focus(row.id, 5)}
                                            onNavigate={keyboard.navigate}
                                            requestEdit={keyboard.isFocused(row.id, 5) ? keyboard.editTrigger : 0}
                                            requestClear={keyboard.isFocused(row.id, 5) ? keyboard.clearTrigger : 0}
                                            editInitialValue={keyboard.isFocused(row.id, 5) ? keyboard.editInitialValue : undefined}
                                        />
                                    </div>
                                </td>
                                <td style={{ width: '40px' }} className="text-center">
                                    {isHovered && !anySelected && (
                                        <button
                                            onClick={() => requestDelete(row.id)}
                                            className="p-0.5 rounded text-red-400 hover:text-red-600 hover:bg-red-100"
                                            title="Eliminar"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        )
                    })}

                    {/* Add row */}
                    <tr className="border-b border-dashed border-rose-100 bg-rose-50/20">
                        <td className="px-2 py-2.5" style={{ width: '160px' }}>
                            <input
                                type="text"
                                placeholder="Agregar deuda..."
                                value={newRow.institucion}
                                onChange={e => setNewRow(prev => ({ ...prev, institucion: e.target.value }))}
                                className={`w-full ${T.inputPlaceholder}`}
                                onKeyDown={e => { if (e.key === 'Enter' && newRow.institucion.trim()) addRow() }}
                            />
                        </td>
                        <td className="px-2 py-2.5" style={{ width: '120px' }}>
                            <input
                                type="text"
                                placeholder="Tipo"
                                value={newRow.tipo_deuda}
                                onChange={e => setNewRow(prev => ({ ...prev, tipo_deuda: e.target.value }))}
                                className={`w-full ${T.inputPlaceholder}`}
                            />
                        </td>
                        <td style={{ width: '100px' }}></td>
                        <td style={{ width: '120px' }}></td>
                        <td style={{ width: '110px' }}></td>
                        <td style={{ width: '50px' }}></td>
                        <td style={{ width: '90px' }}></td>
                        <td style={{ width: '40px' }}></td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr className={`${headerBg} font-semibold text-xs border-b border-rose-200`}>
                        <td colSpan={3} className={`px-2 py-1.5 ${headerText} ${T.totalLabel}`}>TOTAL</td>
                        <td className={`px-2 py-1.5 text-right ${headerText} ${T.totalValue}`}>
                            {totalSaldoPesos ? formatCurrency(totalSaldoPesos) : '—'}
                        </td>
                        <td className={`px-2 py-1.5 text-right ${headerText} ${T.totalValue}`}>
                            {totalMontoCuota ? formatCurrency(totalMontoCuota) : '—'}
                        </td>
                        <td colSpan={3}></td>
                    </tr>
                </tfoot>
            </table>
            <RecycleBin deletedRows={deletedRows} getLabel={(r) => r.institucion} onRestore={restoreRow} />
        </div>
        {deleteTargetId && <DeleteDialog count={1} onConfirm={confirmDelete} onCancel={cancelDelete} />}
    </>
    )
}

export default DeudasConsumoTable
