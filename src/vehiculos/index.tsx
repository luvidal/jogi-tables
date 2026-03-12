import React, { useState } from 'react'
import { X } from 'lucide-react'
import EditableCell from '../common/editablecell'
import { T } from '../common/styles'
import type { VehiculoRow, VehiculosTableProps } from './types'

const defaultFormatCurrency = (value: number | null | undefined): string => {
    if (value === undefined || value === null) return '—'
    return `$ ${value.toLocaleString('es-CL')}`
}

const emptyRow = (): VehiculoRow => ({
    id: `vh_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    marca: '',
    modelo: '',
    monto: null,
    anio: null,
})

const VehiculosTable = ({
    rows,
    onRowsChange,
    formatCurrency = defaultFormatCurrency,
    headerBg = 'bg-blue-50',
    headerText = 'text-blue-700',
    emptyMessage = 'Sin vehículos registrados',
    addLabel = '+ Agregar vehículo',
}: VehiculosTableProps) => {
    const [hoveredRow, setHoveredRow] = useState<string | null>(null)
    const [newRow, setNewRow] = useState({ marca: '', modelo: '' })

    const updateField = (id: string, field: keyof VehiculoRow, value: string | number | null) => {
        onRowsChange(rows.map(r => r.id === id ? { ...r, [field]: value } : r))
    }

    const removeRow = (id: string) => {
        onRowsChange(rows.filter(r => r.id !== id))
    }

    const addRow = () => {
        if (!newRow.marca.trim()) return
        const row: VehiculoRow = {
            id: `vh_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            marca: newRow.marca.trim(),
            modelo: newRow.modelo.trim(),
            monto: null,
            anio: null,
        }
        setNewRow({ marca: '', modelo: '' })
        onRowsChange([...rows, row])
    }

    const addRowWithValue = (field: 'monto' | 'anio', value: number | null) => {
        if (value === null) return
        const row: VehiculoRow = {
            id: `vh_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            marca: newRow.marca.trim() || 'Nuevo vehículo',
            modelo: newRow.modelo.trim(),
            monto: field === 'monto' ? value : null,
            anio: field === 'anio' ? value : null,
        }
        setNewRow({ marca: '', modelo: '' })
        onRowsChange([...rows, row])
    }

    const totalMonto = rows.reduce((s, r) => s + (r.monto || 0), 0)

    return (
        <div className="overflow-x-auto">
            <table className={T.table} style={{ tableLayout: 'fixed' }}>
                <thead>
                    <tr className={`${headerBg} border-b border-blue-200 ${headerText}`}>
                        <th className={`px-2 py-1.5 text-left ${T.th} ${headerText}`} style={{ width: '160px' }}>Marca</th>
                        <th className={`px-2 py-1.5 text-left ${T.th} ${headerText}`} style={{ width: '140px' }}>Modelo</th>
                        <th className={`px-2 py-1.5 text-right ${T.th} ${headerText}`} style={{ width: '120px' }}>Monto $</th>
                        <th className={`px-2 py-1.5 text-center ${T.th} ${headerText}`} style={{ width: '80px' }}>Año</th>
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
                                            value={row.marca}
                                            onChange={e => updateField(row.id, 'marca', e.target.value)}
                                            className={`flex-1 min-w-0 ${T.inputLabel} pl-1`}
                                            placeholder="Marca"
                                        />
                                    </div>
                                </td>
                                <td className="px-2 py-2.5" style={{ width: '140px' }}>
                                    <input
                                        type="text"
                                        value={row.modelo}
                                        onChange={e => updateField(row.id, 'modelo', e.target.value)}
                                        className={`w-full ${T.input} pl-1`}
                                        placeholder="Modelo"
                                    />
                                </td>
                                <EditableCell
                                    value={row.monto}
                                    onChange={v => updateField(row.id, 'monto', v as number | null)}
                                    type="currency"
                                    hasData={row.monto !== null}
                                    width="120px"
                                />
                                <EditableCell
                                    value={row.anio}
                                    onChange={v => updateField(row.id, 'anio', v as number | null)}
                                    type="number"
                                    hasData={row.anio !== null}
                                    width="80px"
                                    align="center"
                                />
                                <td style={{ width: '40px' }}></td>
                            </tr>
                        )
                    })}

                    {/* Add row */}
                    <tr className="border-b border-dashed border-blue-100 bg-blue-50/20">
                        <td className="px-4 py-2.5" style={{ width: '160px' }}>
                            <input
                                type="text"
                                placeholder="Agregar vehículo..."
                                value={newRow.marca}
                                onChange={e => setNewRow(prev => ({ ...prev, marca: e.target.value }))}
                                className={`w-full ${T.inputPlaceholder}`}
                                onKeyDown={e => { if (e.key === 'Enter' && newRow.marca.trim()) addRow() }}
                            />
                        </td>
                        <td className="px-2 py-2.5" style={{ width: '140px' }}>
                            <input
                                type="text"
                                placeholder="Modelo"
                                value={newRow.modelo}
                                onChange={e => setNewRow(prev => ({ ...prev, modelo: e.target.value }))}
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
                        <EditableCell
                            value={null}
                            onChange={v => addRowWithValue('anio', v as number | null)}
                            hasData={false}
                            width="80px"
                            type="number"
                            align="center"
                        />
                        <td style={{ width: '40px' }}></td>
                    </tr>

                    {rows.length === 0 && (
                        <tr>
                            <td colSpan={5} className={`px-2 py-3 text-center ${T.empty}`}>{emptyMessage}</td>
                        </tr>
                    )}
                </tbody>
                <tfoot>
                    <tr className={`${headerBg} font-semibold text-xs border-t border-blue-200`}>
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

export default VehiculosTable
