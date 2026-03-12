import React, { useState } from 'react'
import { X } from 'lucide-react'
import EditableCell from '../common/editablecell'
import { T } from '../common/styles'
import { applyAutoConversions, applyAutoCompute } from '../common/autoconvert'
import type { AutoConvertRule, AutoComputeRule } from '../common/autoconvert'
import type { BienRaizRow, BienesRaicesTableProps } from './types'

const defaultFormatCurrency = (value: number | null | undefined): string => {
    if (value === undefined || value === null) return '—'
    return `$ ${value.toLocaleString('es-CL')}`
}

const BienesRaicesTable = ({
    rows,
    onRowsChange,
    formatCurrency = defaultFormatCurrency,
    ufValue,
    capRate = 0.05,
    factorDescuento = 0.10,
    headerBg = 'bg-teal-50',
    headerText = 'text-teal-700',
}: BienesRaicesTableProps) => {
    const [hoveredRow, setHoveredRow] = useState<string | null>(null)

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

    const removeRow = (id: string) => {
        onRowsChange(rows.filter(r => r.id !== id))
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

    const totalValorPesos = rows.reduce((s, r) => s + (r.valor_pesos || 0), 0)
    const totalArriendoReal = rows.reduce((s, r) => s + (r.arriendo_real || 0), 0)
    const totalArriendoFuturo = rows.reduce((s, r) => s + (r.arriendo_futuro || 0), 0)
    const totalSaldoDeudaPesos = rows.reduce((s, r) => s + (r.saldo_deuda_pesos || 0), 0)
    const totalMontoCuota = rows.reduce((s, r) => s + (r.monto_cuota || 0), 0)

    const isAutoComputed = (row: BienRaizRow, field: string): boolean => {
        if (!ufValue) return false
        if (field === 'valor_pesos' && row.valor_uf != null) return true
        if (field === 'saldo_deuda_pesos' && row.saldo_deuda_uf != null) return true
        if (field === 'arriendo_futuro' && row.valor_uf != null) return true
        return false
    }

    return (
        <div className="overflow-x-auto">
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
                    {rows.map(row => {
                        const isHovered = hoveredRow === row.id
                        return (
                            <tr
                                key={row.id}
                                className="border-b border-gray-100 hover:bg-gray-50"
                                onMouseEnter={() => setHoveredRow(row.id)}
                                onMouseLeave={() => setHoveredRow(null)}
                            >
                                {/* Propiedad columns */}
                                <td className={`px-2 py-2.5 ${T.cellLabel}`} style={{ width: '140px' }}>
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
                                />
                                <EditableCell
                                    value={row.valor_pesos}
                                    onChange={v => updateField(row.id, 'valor_pesos', v as number | null)}
                                    type="currency"
                                    hasData={row.valor_pesos !== null}
                                    width="110px"
                                    className={isAutoComputed(row, 'valor_pesos') ? 'italic text-teal-500' : ''}
                                />
                                <EditableCell
                                    value={row.arriendo_real}
                                    onChange={v => updateField(row.id, 'arriendo_real', v as number | null)}
                                    type="currency"
                                    hasData={row.arriendo_real !== null}
                                    width="100px"
                                />
                                <EditableCell
                                    value={row.arriendo_futuro}
                                    onChange={v => updateField(row.id, 'arriendo_futuro', v as number | null)}
                                    type="currency"
                                    hasData={row.arriendo_futuro !== null}
                                    width="100px"
                                    className={`border-r border-teal-200 ${isAutoComputed(row, 'arriendo_futuro') ? 'italic text-teal-500' : ''}`}
                                />
                                {/* Deuda Hipotecaria columns */}
                                <td className="px-2 py-2.5" style={{ width: '120px' }}>
                                    <input
                                        type="text"
                                        value={row.institucion}
                                        onChange={e => updateField(row.id, 'institucion', e.target.value)}
                                        className={`w-full ${T.input} pl-1`}
                                        placeholder="Institución"
                                    />
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
                                />
                                <EditableCell
                                    value={row.saldo_deuda_pesos}
                                    onChange={v => updateField(row.id, 'saldo_deuda_pesos', v as number | null)}
                                    type="currency"
                                    hasData={row.saldo_deuda_pesos !== null}
                                    width="110px"
                                    className={isAutoComputed(row, 'saldo_deuda_pesos') ? 'italic text-teal-500' : ''}
                                />
                                <EditableCell
                                    value={row.monto_cuota}
                                    onChange={v => updateField(row.id, 'monto_cuota', v as number | null)}
                                    type="currency"
                                    hasData={row.monto_cuota !== null}
                                    width="100px"
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
                                        />
                                    </div>
                                </td>
                                <td style={{ width: '40px' }}></td>
                            </tr>
                        )
                    })}

                    {rows.length === 0 && (
                        <tr>
                            <td colSpan={13} className={`px-2 py-3 text-center ${T.empty}`}>Sin bienes raíces registrados</td>
                        </tr>
                    )}
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
        </div>
    )
}

export default BienesRaicesTable
