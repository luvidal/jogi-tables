import React, { useState, useMemo } from 'react'
import { Eye } from 'lucide-react'
import EditableCell from '../common/editablecell'
import DeleteRowButton from '../common/deletebutton'
import EmptyStateRow from '../common/emptystaterow'
import { T } from '../common/styles'
import { useRowHover } from '../common/userowhover'
import { useGridKeyboard } from '../common/usegridkeyboard'
import { applyAutoConversions, applyAutoCompute } from '../common/autoconvert'
import type { AutoConvertRule, AutoComputeRule } from '../common/autoconvert'
import { defaultFormatCurrency } from '../common/utils'
import { useSoftDelete } from '../common/usesoftdelete'
import DeleteDialog from '../common/deletedialog'
import RecycleBin from '../common/recyclebin'
import type { BienRaizRow, BienesRaicesTableProps } from './types'

const BienesRaicesTable = ({
    rows,
    onRowsChange,
    formatCurrency = defaultFormatCurrency,
    ufValue,
    capRate = 0.05,
    factorDescuento = 0.10,
    headerBg = 'bg-teal-50',
    headerText = 'text-teal-700',
    onViewSource,
}: BienesRaicesTableProps) => {
    const { getHoverProps, isHovered: isRowHovered } = useRowHover()
    const { activeRows, deletedRows, deleteTargetId, requestDelete, confirmDelete, cancelDelete, restoreRow } = useSoftDelete(rows, onRowsChange)
    const visibleRowIds = useMemo(() => activeRows.map(r => r.id), [activeRows])
    const keyboard = useGridKeyboard({ visibleRowIds, colCount: 9 })

    // Auto-conversion rules
    const conversionRules: AutoConvertRule[] = ufValue ? [
        { source: 'valor_uf', target: 'valor_pesos', formula: (v) => v * ufValue, precision: 0 },
        { source: 'valor_pesos', target: 'valor_uf', formula: (v) => v / ufValue, precision: 2 },
        { source: 'saldo_deuda_uf', target: 'saldo_deuda_pesos', formula: (v) => v * ufValue, precision: 0 },
        { source: 'saldo_deuda_pesos', target: 'saldo_deuda_uf', formula: (v) => v / ufValue, precision: 2 },
    ] : []

    // Auto-compute: arriendo_futuro from valor_uf (only if not manually set)
    const computeRules: AutoComputeRule[] = ufValue ? [
        {
            target: 'arriendo_futuro',
            depends: ['valor_uf', 'valor_pesos'],
            condition: (row) => row.arriendo_futuro == null,
            formula: (row) => {
                const valorUf = row.valor_uf
                if (!valorUf || !capRate) return null
                return Math.round(valorUf * capRate / 12 * (1 - factorDescuento) * ufValue)
            },
        },
    ] : []

    const updateField = (id: string, field: keyof BienRaizRow, value: string | number | null) => {
        onRowsChange(rows.map(r => {
            if (r.id !== id) return r
            let next = applyAutoConversions(r, field, value, conversionRules, {})
            next = applyAutoCompute(next, field, computeRules, {})
            return next
        }))
    }

    const addRow = () => {
        const row: BienRaizRow = {
            id: `br_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            direccion: '',
            comuna: '',
            valor_uf: null,
            valor_pesos: null,
            arriendo_real: null,
            arriendo_futuro: null,
            institucion: '',
            tipo_deuda: '',
            saldo_deuda_uf: null,
            saldo_deuda_pesos: null,
            monto_cuota: null,
            cuotas_pagadas: null,
            cuotas_total: null,
        }
        onRowsChange([...rows, row])
    }

    const totalValorPesos = activeRows.reduce((s, r) => s + (r.valor_pesos || 0), 0)
    const totalArriendoReal = activeRows.reduce((s, r) => s + (r.arriendo_real || 0), 0)
    const totalArriendoFuturo = activeRows.reduce((s, r) => s + (r.arriendo_futuro || 0), 0)
    const totalSaldoDeudaPesos = activeRows.reduce((s, r) => s + (r.saldo_deuda_pesos || 0), 0)
    const totalMontoCuota = activeRows.reduce((s, r) => s + (r.monto_cuota || 0), 0)

    const isAutoComputed = (row: BienRaizRow, field: string): boolean => {
        if (!ufValue) return false
        if (field === 'valor_pesos' && row.valor_uf != null) return true
        if (field === 'saldo_deuda_pesos' && row.saldo_deuda_uf != null) return true
        if (field === 'arriendo_futuro' && row.valor_uf != null) return true
        return false
    }

    return (<>
        <div className="overflow-x-auto" onKeyDown={keyboard.handleContainerKeyDown} tabIndex={0}>
            <table className={T.table} style={{ tableLayout: 'fixed' }}>
                <thead>
                    <tr className={`${headerBg} border-b border-teal-200`}>
                        <th colSpan={6} className={`px-2 py-1.5 text-left font-semibold ${headerText} border-r border-teal-200`}>Propiedad</th>
                        <th colSpan={6} className={`px-2 py-1.5 text-left font-semibold ${headerText}`}>Deuda Hipotecaria Asociada</th>
                        <th style={{ width: '40px' }}></th>
                    </tr>
                    <tr className={`${headerBg}/50 border-b border-teal-100 text-teal-600`}>
                        <th className={`px-2 py-1 text-left ${T.th} text-teal-600`} style={{ width: '140px' }}>Dirección</th>
                        <th className={`px-2 py-1 text-left ${T.th} text-teal-600`} style={{ width: '100px' }}>Comuna</th>
                        <th className={`px-2 py-1 text-right ${T.th} text-teal-600`} style={{ width: '90px' }}>Valor UF</th>
                        <th className={`px-2 py-1 text-right ${T.th} text-teal-600`} style={{ width: '110px' }}>Valor $</th>
                        <th className={`px-2 py-1 text-right ${T.th} text-teal-600`} style={{ width: '100px' }}>Arriendo Real $</th>
                        <th className={`px-2 py-1 text-right ${T.th} text-teal-600 border-r border-teal-200`} style={{ width: '100px' }}>Arriendo Fut $</th>
                        <th className={`px-2 py-1 text-left ${T.th} text-teal-600`} style={{ width: '120px' }}>Institución</th>
                        <th className={`px-2 py-1 text-left ${T.th} text-teal-600`} style={{ width: '90px' }}>Tipo</th>
                        <th className={`px-2 py-1 text-right ${T.th} text-teal-600`} style={{ width: '90px' }}>Saldo UF</th>
                        <th className={`px-2 py-1 text-right ${T.th} text-teal-600`} style={{ width: '110px' }}>Saldo $</th>
                        <th className={`px-2 py-1 text-right ${T.th} text-teal-600`} style={{ width: '100px' }}>Cuota $</th>
                        <th className={`px-2 py-1 text-center ${T.th} text-teal-600`} style={{ width: '80px' }}>Cuotas</th>
                        <th style={{ width: '40px' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {activeRows.map(row => {
                        const isHovered = isRowHovered(row.id)
                        return (
                            <tr
                                key={row.id}
                                className="border-b border-gray-100 hover:bg-gray-50"
                                {...getHoverProps(row.id)}
                            >
                                {/* Propiedad columns */}
                                <td className={`px-2 py-2.5 ${T.cellLabel}`} style={{ width: '140px' }}>
                                    <div className="flex items-center gap-1 min-w-0">
                                        <DeleteRowButton onClick={() => requestDelete(row.id)} isVisible={isHovered} />
                                        <input
                                            type="text"
                                            value={row.direccion}
                                            onChange={e => updateField(row.id, 'direccion', e.target.value)}
                                            className={`flex-1 min-w-0 ${T.inputLabel} pl-1`}
                                            placeholder="Dirección"
                                        />
                                    </div>
                                </td>
                                <td className="px-2 py-2.5" style={{ width: '100px' }}>
                                    <input
                                        type="text"
                                        value={row.comuna}
                                        onChange={e => updateField(row.id, 'comuna', e.target.value)}
                                        className={`w-full ${T.input} pl-1`}
                                        placeholder="Comuna"
                                    />
                                </td>
                                <EditableCell
                                    value={row.valor_uf}
                                    onChange={v => updateField(row.id, 'valor_uf', v as number | null)}
                                    type="number"
                                    hasData={row.valor_uf !== null}
                                    width="90px"
                                    focused={keyboard.isFocused(row.id, 0)}
                                    onCellFocus={() => keyboard.focus(row.id, 0)}
                                    onNavigate={keyboard.navigate}
                                    requestEdit={keyboard.isFocused(row.id, 0) ? keyboard.editTrigger : 0}
                                    requestClear={keyboard.isFocused(row.id, 0) ? keyboard.clearTrigger : 0}
                                    editInitialValue={keyboard.isFocused(row.id, 0) ? keyboard.editInitialValue : undefined}
                                />
                                <EditableCell
                                    value={row.valor_pesos}
                                    onChange={v => updateField(row.id, 'valor_pesos', v as number | null)}
                                    type="currency"
                                    hasData={row.valor_pesos !== null}
                                    width="110px"
                                    className={isAutoComputed(row, 'valor_pesos') ? 'italic text-teal-500' : ''}
                                    focused={keyboard.isFocused(row.id, 1)}
                                    onCellFocus={() => keyboard.focus(row.id, 1)}
                                    onNavigate={keyboard.navigate}
                                    requestEdit={keyboard.isFocused(row.id, 1) ? keyboard.editTrigger : 0}
                                    requestClear={keyboard.isFocused(row.id, 1) ? keyboard.clearTrigger : 0}
                                    editInitialValue={keyboard.isFocused(row.id, 1) ? keyboard.editInitialValue : undefined}
                                />
                                <EditableCell
                                    value={row.arriendo_real}
                                    onChange={v => updateField(row.id, 'arriendo_real', v as number | null)}
                                    type="currency"
                                    hasData={row.arriendo_real !== null}
                                    width="100px"
                                    focused={keyboard.isFocused(row.id, 2)}
                                    onCellFocus={() => keyboard.focus(row.id, 2)}
                                    onNavigate={keyboard.navigate}
                                    requestEdit={keyboard.isFocused(row.id, 2) ? keyboard.editTrigger : 0}
                                    requestClear={keyboard.isFocused(row.id, 2) ? keyboard.clearTrigger : 0}
                                    editInitialValue={keyboard.isFocused(row.id, 2) ? keyboard.editInitialValue : undefined}
                                />
                                <EditableCell
                                    value={row.arriendo_futuro}
                                    onChange={v => updateField(row.id, 'arriendo_futuro', v as number | null)}
                                    type="currency"
                                    hasData={row.arriendo_futuro !== null}
                                    width="100px"
                                    className={`border-r border-teal-200 ${isAutoComputed(row, 'arriendo_futuro') ? 'italic text-teal-500' : ''}`}
                                    focused={keyboard.isFocused(row.id, 3)}
                                    onCellFocus={() => keyboard.focus(row.id, 3)}
                                    onNavigate={keyboard.navigate}
                                    requestEdit={keyboard.isFocused(row.id, 3) ? keyboard.editTrigger : 0}
                                    requestClear={keyboard.isFocused(row.id, 3) ? keyboard.clearTrigger : 0}
                                    editInitialValue={keyboard.isFocused(row.id, 3) ? keyboard.editInitialValue : undefined}
                                />
                                {/* Deuda Hipotecaria columns */}
                                <td className="px-2 py-2.5" style={{ width: '120px' }}>
                                    <div className="flex items-center gap-1 min-w-0">
                                        {row.sourceFileId && onViewSource && (
                                            <button
                                                onClick={() => onViewSource([row.sourceFileId!])}
                                                className={`p-0.5 rounded transition-all shrink-0 ${isHovered ? 'opacity-100 text-teal-400 hover:text-teal-600 hover:bg-teal-100' : 'opacity-0'}`}
                                                title="Ver documento fuente"
                                            >
                                                <Eye size={14} />
                                            </button>
                                        )}
                                        <input
                                            type="text"
                                            value={row.institucion}
                                            onChange={e => updateField(row.id, 'institucion', e.target.value)}
                                            className={`flex-1 min-w-0 ${T.input} pl-1`}
                                            placeholder="Institución"
                                        />
                                    </div>
                                </td>
                                <td className="px-2 py-2.5" style={{ width: '90px' }}>
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
                                    width="90px"
                                    focused={keyboard.isFocused(row.id, 4)}
                                    onCellFocus={() => keyboard.focus(row.id, 4)}
                                    onNavigate={keyboard.navigate}
                                    requestEdit={keyboard.isFocused(row.id, 4) ? keyboard.editTrigger : 0}
                                    requestClear={keyboard.isFocused(row.id, 4) ? keyboard.clearTrigger : 0}
                                    editInitialValue={keyboard.isFocused(row.id, 4) ? keyboard.editInitialValue : undefined}
                                />
                                <EditableCell
                                    value={row.saldo_deuda_pesos}
                                    onChange={v => updateField(row.id, 'saldo_deuda_pesos', v as number | null)}
                                    type="currency"
                                    hasData={row.saldo_deuda_pesos !== null}
                                    width="110px"
                                    className={isAutoComputed(row, 'saldo_deuda_pesos') ? 'italic text-teal-500' : ''}
                                    focused={keyboard.isFocused(row.id, 5)}
                                    onCellFocus={() => keyboard.focus(row.id, 5)}
                                    onNavigate={keyboard.navigate}
                                    requestEdit={keyboard.isFocused(row.id, 5) ? keyboard.editTrigger : 0}
                                    requestClear={keyboard.isFocused(row.id, 5) ? keyboard.clearTrigger : 0}
                                    editInitialValue={keyboard.isFocused(row.id, 5) ? keyboard.editInitialValue : undefined}
                                />
                                <EditableCell
                                    value={row.monto_cuota}
                                    onChange={v => updateField(row.id, 'monto_cuota', v as number | null)}
                                    type="currency"
                                    hasData={row.monto_cuota !== null}
                                    width="100px"
                                    focused={keyboard.isFocused(row.id, 6)}
                                    onCellFocus={() => keyboard.focus(row.id, 6)}
                                    onNavigate={keyboard.navigate}
                                    requestEdit={keyboard.isFocused(row.id, 6) ? keyboard.editTrigger : 0}
                                    requestClear={keyboard.isFocused(row.id, 6) ? keyboard.clearTrigger : 0}
                                    editInitialValue={keyboard.isFocused(row.id, 6) ? keyboard.editInitialValue : undefined}
                                />
                                <td className="text-center text-xs text-gray-500" style={{ width: '80px' }}>
                                    <div className="flex items-center justify-center gap-0.5">
                                        <EditableCell
                                            value={row.cuotas_pagadas}
                                            onChange={v => updateField(row.id, 'cuotas_pagadas', v as number | null)}
                                            type="number"
                                            hasData={row.cuotas_pagadas !== null}
                                            width="30px"
                                            align="center"
                                            asDiv
                                            focused={keyboard.isFocused(row.id, 7)}
                                            onCellFocus={() => keyboard.focus(row.id, 7)}
                                            onNavigate={keyboard.navigate}
                                            requestEdit={keyboard.isFocused(row.id, 7) ? keyboard.editTrigger : 0}
                                    requestClear={keyboard.isFocused(row.id, 7) ? keyboard.clearTrigger : 0}
                                    editInitialValue={keyboard.isFocused(row.id, 7) ? keyboard.editInitialValue : undefined}
                                        />
                                        <span className="text-gray-400">/</span>
                                        <EditableCell
                                            value={row.cuotas_total}
                                            onChange={v => updateField(row.id, 'cuotas_total', v as number | null)}
                                            type="number"
                                            hasData={row.cuotas_total !== null}
                                            width="30px"
                                            align="center"
                                            asDiv
                                            focused={keyboard.isFocused(row.id, 8)}
                                            onCellFocus={() => keyboard.focus(row.id, 8)}
                                            onNavigate={keyboard.navigate}
                                            requestEdit={keyboard.isFocused(row.id, 8) ? keyboard.editTrigger : 0}
                                    requestClear={keyboard.isFocused(row.id, 8) ? keyboard.clearTrigger : 0}
                                    editInitialValue={keyboard.isFocused(row.id, 8) ? keyboard.editInitialValue : undefined}
                                        />
                                    </div>
                                </td>
                                <td style={{ width: '40px' }}></td>
                            </tr>
                        )
                    })}

                    <EmptyStateRow show={activeRows.length === 0} colSpan={13} message="Sin bienes raíces registrados" />
                </tbody>
                <tfoot>
                    <tr className={`${headerBg} font-semibold text-xs border-t border-teal-200`}>
                        <td colSpan={3} className={`px-2 py-1.5 ${headerText} ${T.totalLabel}`}>TOTAL</td>
                        <td className={`px-2 py-1.5 text-right ${headerText} ${T.totalValue}`}>
                            {totalValorPesos ? formatCurrency(totalValorPesos) : '—'}
                        </td>
                        <td className={`px-2 py-1.5 text-right ${headerText} ${T.totalValue}`}>
                            {totalArriendoReal ? formatCurrency(totalArriendoReal) : '—'}
                        </td>
                        <td className={`px-2 py-1.5 text-right ${headerText} ${T.totalValue} border-r border-teal-200`}>
                            {totalArriendoFuturo ? formatCurrency(totalArriendoFuturo) : '—'}
                        </td>
                        <td colSpan={3}></td>
                        <td className={`px-2 py-1.5 text-right ${headerText} ${T.totalValue}`}>
                            {totalSaldoDeudaPesos ? formatCurrency(totalSaldoDeudaPesos) : '—'}
                        </td>
                        <td className={`px-2 py-1.5 text-right ${headerText} ${T.totalValue}`}>
                            {totalMontoCuota ? formatCurrency(totalMontoCuota) : '—'}
                        </td>
                        <td colSpan={2}></td>
                    </tr>
                </tfoot>
            </table>
            <button
                className={`mt-2 px-3 py-1 text-xs text-teal-600 border border-dashed border-teal-300 rounded hover:bg-teal-50 w-full`}
                onClick={addRow}
            >
                + Agregar propiedad
            </button>
            <RecycleBin deletedRows={deletedRows} getLabel={(r) => r.direccion} onRestore={restoreRow} />
        </div>
        {deleteTargetId && <DeleteDialog count={1} onConfirm={confirmDelete} onCancel={cancelDelete} />}
    </>
    )
}

export default BienesRaicesTable
