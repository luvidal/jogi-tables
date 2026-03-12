import React, { useState } from 'react'
import { X } from 'lucide-react'
import EditableCell from '../common/editablecell'
import { T } from '../common/styles'
import type { InversionRow, InversionesTableProps } from './types'

const defaultFormatCurrency = (value: number | null | undefined): string => {
    if (value === undefined || value === null) return '—'
    return `$ ${value.toLocaleString('es-CL')}`
}

const InversionesTable = ({
    rows,
    onRowsChange,
    formatCurrency = defaultFormatCurrency,
    headerBg = 'bg-indigo-50',
    headerText = 'text-indigo-700',
    emptyMessage = 'Sin inversiones registradas',
    addLabel = '+ Agregar inversión',
}: InversionesTableProps) => {
    const [hoveredRow, setHoveredRow] = useState<string | null>(null)
    const [newRow, setNewRow] = useState({ institucion: '', tipo: '' })

    const updateField = (id: string, field: keyof InversionRow, value: string | number | null) => {
        onRowsChange(rows.map(r => r.id === id ? { ...r, [field]: value } : r))
    }

    const removeRow = (id: string) => {
        onRowsChange(rows.filter(r => r.id !== id))
    }

    const addRow = () => {
        if (!newRow.institucion.trim()) return
        const row: InversionRow = {
            id: `inv_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            institucion: newRow.institucion.trim(),
            tipo: newRow.tipo.trim(),
            monto: null,
            fecha: '',
        }
        setNewRow({ institucion: '', tipo: '' })
        onRowsChange([...rows, row])
    }

    const addRowWithValue = (field: 'monto', value: number | null) => {
        if (value === null) return
        const row: InversionRow = {
            id: `inv_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            institucion: newRow.institucion.trim() || 'Nueva inversión',
            tipo: newRow.tipo.trim(),
            monto: value,
            fecha: '',
        }
        setNewRow({ institucion: '', tipo: '' })
        onRowsChange([...rows, row])
    }

    const totalMonto = rows.reduce((s, r) => s + (r.monto || 0), 0)

    return (
        <div className="overflow-x-auto">
            <table className={T.table} style={{ tableLayout: 'fixed' }}>
                <thead>
                    <tr className={`${headerBg} border-b border-indigo-200 ${headerText}`}>
                        <th className={`px-2 py-1.5 text-left ${T.th} ${headerText}`} style={{ width: '160px' }}>Institución</th>
                        <th className={`px-2 py-1.5 text-left ${T.th} ${headerText}`} style={{ width: '140px' }}>Tipo Inversión</th>
                        <th className={`px-2 py-1.5 text-right ${T.th} ${headerText}`} style={{ width: '120px' }}>Monto $</th>
                        <th className={`px-2 py-1.5 text-left ${T.th} ${headerText}`} style={{ width: '100px' }}>Fecha</th>
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
                                <td className="px-2 py-2.5" style={{ width: '140px' }}>
                                    <input
                                        type="text"
                                        value={row.tipo}
                                        onChange={e => updateField(row.id, 'tipo', e.target.value)}
                                        className={`w-full ${T.input} pl-1`}
                                        placeholder="Tipo"
                                    />
                                </td>
                                <EditableCell
                                    value={row.monto}
                                    onChange={v => updateField(row.id, 'monto', v as number | null)}
                                    type="currency"
                                    hasData={row.monto !== null}
                                    width="120px"
                                />
                                <td className="px-2 py-2.5" style={{ width: '100px' }}>
                                    <input
                                        type="text"
                                        value={row.fecha}
                                        onChange={e => updateField(row.id, 'fecha', e.target.value)}
                                        className={`w-full ${T.input} pl-1`}
                                        placeholder="Fecha"
                                    />
                                </td>
                                <td style={{ width: '40px' }}></td>
                            </tr>
                        )
                    })}

                    {/* Add row */}
                    <tr className="border-b border-dashed border-indigo-100 bg-indigo-50/20">
                        <td className="px-4 py-2.5" style={{ width: '160px' }}>
                            <input
                                type="text"
                                placeholder="Agregar inversión..."
                                value={newRow.institucion}
                                onChange={e => setNewRow(prev => ({ ...prev, institucion: e.target.value }))}
                                className={`w-full ${T.inputPlaceholder}`}
                                onKeyDown={e => { if (e.key === 'Enter' && newRow.institucion.trim()) addRow() }}
                            />
                        </td>
                        <td className="px-2 py-2.5" style={{ width: '140px' }}>
                            <input
                                type="text"
                                placeholder="Tipo"
                                value={newRow.tipo}
                                onChange={e => setNewRow(prev => ({ ...prev, tipo: e.target.value }))}
                                className={`w-full ${T.inputPlaceholder}`}
                            />
                        </td>
                        <EditableCell
                            value={null}
                            onChange={v => addRowWithValue('monto', v as number | null)}
                            hasData={false}
                            width="120px"
                            type="currency"
                        />
                        <td className="px-2 py-2.5" style={{ width: '100px' }}></td>
                        <td style={{ width: '40px' }}></td>
                    </tr>

                    {rows.length === 0 && (
                        <tr>
                            <td colSpan={5} className={`px-2 py-3 text-center ${T.empty}`}>{emptyMessage}</td>
                        </tr>
                    )}
                </tbody>
                <tfoot>
                    <tr className={`${headerBg} font-semibold text-xs border-t border-indigo-200`}>
                        <td colSpan={2} className={`px-2 py-1.5 ${headerText} ${T.totalLabel}`}>TOTAL</td>
                        <td className={`px-2 py-1.5 text-right ${headerText} ${T.totalValue}`}>
                            {totalMonto ? formatCurrency(totalMonto) : '—'}
                        </td>
                        <td colSpan={2}></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}

export default InversionesTable
