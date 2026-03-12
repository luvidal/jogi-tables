import React, { useState } from 'react'
import { X } from 'lucide-react'
import EditableCell from '../common/editablecell'
import { T } from '../common/styles'
import { applyAutoConversions, applyAutoCompute } from '../common/autoconvert'
import type { AutoConvertRule, AutoComputeRule } from '../common/autoconvert'
import type { DeudaConsumoRow, DeudasConsumoTableProps } from './types'

const defaultFormatCurrency = (value: number | null | undefined): string => {
    if (value === undefined || value === null) return '—'
    return `$ ${value.toLocaleString('es-CL')}`
}

const LINEAS_TC_PATTERN = /l[ií]nea|tarjeta|tc/i

const DeudasConsumoTable = ({
    rows,
    onRowsChange,
    formatCurrency = defaultFormatCurrency,
    ufValue,
    castigo = 0.05,
    headerBg = 'bg-rose-50',
    headerText = 'text-rose-700',
}: DeudasConsumoTableProps) => {
    const [hoveredRow, setHoveredRow] = useState<string | null>(null)
    const [newRow, setNewRow] = useState({ institucion: '', tipo_deuda: '' })

    // Auto-conversion rules: UF↔CLP
    const conversionRules: AutoConvertRule[] = ufValue ? [
        { source: 'saldo_deuda_uf', target: 'saldo_deuda_pesos', formula: (v) => v * ufValue, precision: 0 },
        { source: 'saldo_deuda_pesos', target: 'saldo_deuda_uf', formula: (v) => v / ufValue, precision: 2 },
    ] : []

    // Auto-compute: 5% castigo for líneas/TC
    const computeRules: AutoComputeRule[] = [
        {
            target: 'monto_cuota',
            depends: ['saldo_deuda_uf', 'saldo_deuda_pesos', 'tipo_deuda'],
            condition: (row) => LINEAS_TC_PATTERN.test(row.tipo_deuda) && row.saldo_deuda_pesos != null,
            formula: (row) => Math.round((row.saldo_deuda_pesos ?? 0) * castigo),
        },
    ]

    const updateField = (id: string, field: keyof DeudaConsumoRow, value: string | number | null) => {
        onRowsChange(rows.map(r => {
            if (r.id !== id) return r
            let next = applyAutoConversions(r, field, value, conversionRules, {})
            next = applyAutoCompute(next, field, computeRules, {})
            return next
        }))
    }

    const removeRow = (id: string) => {
        onRowsChange(rows.filter(r => r.id !== id))
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

    const totalSaldoPesos = rows.reduce((s, r) => s + (r.saldo_deuda_pesos || 0), 0)
    const totalMontoCuota = rows.reduce((s, r) => s + (r.monto_cuota || 0), 0)

    const isAutoComputed = (row: DeudaConsumoRow, field: string): boolean => {
        if (field === 'saldo_deuda_pesos' && row.saldo_deuda_uf != null && ufValue) return true
        if (field === 'monto_cuota' && LINEAS_TC_PATTERN.test(row.tipo_deuda) && row.saldo_deuda_pesos != null) return true
        return false
    }

    return (
        <div className="overflow-x-auto">
            {castigo > 0 && (
                <div className={`text-xs text-gray-500 mb-1`}>Castigo Líneas y TC: {(castigo * 100).toFixed(0)}% del saldo</div>
            )}
            <table className={T.table} style={{ tableLayout: 'fixed' }}>
                <thead>
                    <tr className={`${headerBg} border-b border-rose-200 ${headerText}`}>
                        <th className={`px-2 py-1.5 text-left ${T.th} ${headerText}`} style={{ width: '160px' }}>Institución</th>
                        <th className={`px-2 py-1.5 text-left ${T.th} ${headerText}`} style={{ width: '120px' }}>Tipo Deuda</th>
                        <th className={`px-2 py-1.5 text-right ${T.th} ${headerText}`} style={{ width: '100px' }}>Saldo UF</th>
                        <th className={`px-2 py-1.5 text-right ${T.th} ${headerText}`} style={{ width: '120px' }}>Saldo $</th>
                        <th className={`px-2 py-1.5 text-right ${T.th} ${headerText}`} style={{ width: '110px' }}>Cuota $</th>
                        <th className={`px-2 py-1.5 text-center ${T.th} ${headerText}`} style={{ width: '90px' }}>Cuotas</th>
                        <th style={{ width: '40px' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(row => {
                        const isHovered = hoveredRow === row.id
                        return (
                            <tr
                                key={row.id}
                                className="border-b border-gray-100 hover:bg-gray-50"
                                onMouseEnter={() => setHoveredRow(row.id)}
                                onMouseLeave={() => setHoveredRow(null)}
                            >
                                <td className={`px-2 py-2.5 ${T.cellLabel}`} style={{ width: '160px' }}>
                                    <div className="flex items-center gap-1 min-w-0">
                                        <button
                                            onClick={() => removeRow(row.id)}
                                            className={`p-0.5 rounded transition-all shrink-0 ${isHovered ? 'opacity-100 text-red-400 hover:text-red-600 hover:bg-red-100' : 'opacity-0'}`}
                                            title="Eliminar"
                                        >
                                            <X size={14} />
                                        </button>
                                        <input
                                            type="text"
                                            value={row.institucion}
                                            onChange={e => updateField(row.id, 'institucion', e.target.value)}
                                            className={`flex-1 min-w-0 ${T.inputLabel} pl-1`}
                                            placeholder="Institución"
                                        />
                                    </div>
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
                                />
                                <EditableCell
                                    value={row.saldo_deuda_pesos}
                                    onChange={v => updateField(row.id, 'saldo_deuda_pesos', v as number | null)}
                                    type="currency"
                                    hasData={row.saldo_deuda_pesos !== null}
                                    width="120px"
                                    className={isAutoComputed(row, 'saldo_deuda_pesos') ? 'italic text-rose-400' : ''}
                                />
                                <EditableCell
                                    value={row.monto_cuota}
                                    onChange={v => updateField(row.id, 'monto_cuota', v as number | null)}
                                    type="currency"
                                    hasData={row.monto_cuota !== null}
                                    width="110px"
                                    className={isAutoComputed(row, 'monto_cuota') ? 'italic text-rose-400' : ''}
                                />
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
                                        />
                                    </div>
                                </td>
                                <td style={{ width: '40px' }}></td>
                            </tr>
                        )
                    })}

                    {/* Add row */}
                    <tr className="border-b border-dashed border-rose-100 bg-rose-50/20">
                        <td className="px-4 py-2.5" style={{ width: '160px' }}>
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
                        <td style={{ width: '90px' }}></td>
                        <td style={{ width: '40px' }}></td>
                    </tr>

                    {rows.length === 0 && (
                        <tr>
                            <td colSpan={7} className={`px-2 py-3 text-center ${T.empty}`}>Sin deudas de consumo registradas</td>
                        </tr>
                    )}
                </tbody>
                <tfoot>
                    <tr className={`${headerBg} font-semibold text-xs border-t border-rose-200`}>
                        <td colSpan={3} className={`px-2 py-1.5 ${headerText} ${T.totalLabel}`}>TOTAL</td>
                        <td className={`px-2 py-1.5 text-right ${headerText} ${T.totalValue}`}>
                            {totalSaldoPesos ? formatCurrency(totalSaldoPesos) : '—'}
                        </td>
                        <td className={`px-2 py-1.5 text-right ${headerText} ${T.totalValue}`}>
                            {totalMontoCuota ? formatCurrency(totalMontoCuota) : '—'}
                        </td>
                        <td colSpan={2}></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}

export default DeudasConsumoTable
