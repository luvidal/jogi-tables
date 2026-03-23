import React, { useMemo } from 'react'
import EditableCell from '../common/editablecell'
import DeleteRowButton from '../common/deletebutton'
import EmptyStateRow from '../common/emptystaterow'
import { T } from '../common/styles'
import { useFieldUpdate } from '../common/usefieldupdate'
import { useRowHover } from '../common/userowhover'
import { useGridKeyboard } from '../common/usegridkeyboard'
import { defaultFormatCurrency } from '../common/utils'
import { useSoftDelete } from '../common/usesoftdelete'
import DeleteDialog from '../common/deletedialog'
import RecycleBin from '../common/recyclebin'
import type { VehiculoRow, VehiculosTableProps } from './types'

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
    headerBg = 'bg-slate-50',
    headerText = 'text-slate-700',
    emptyMessage = 'Sin vehículos registrados',
    addLabel = '+ Agregar vehículo',
    title,
}: VehiculosTableProps) => {
    const { getHoverProps, isHovered } = useRowHover()
    const { updateField } = useFieldUpdate(rows, onRowsChange)
    const { activeRows, deletedRows, deleteTargetId, requestDelete, confirmDelete, cancelDelete, restoreRow } = useSoftDelete(rows, onRowsChange)
    const visibleRowIds = useMemo(() => activeRows.map(r => r.id), [activeRows])
    const keyboard = useGridKeyboard({ visibleRowIds, colCount: 2 })

    const addRow = () => {
        const row: VehiculoRow = {
            id: `vh_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            marca: '',
            modelo: '',
            monto: null,
            anio: null,
        }
        onRowsChange([...rows, row])
    }

    const totalMonto = activeRows.reduce((s, r) => s + (r.monto || 0), 0)

    return (<>
        <div className="overflow-x-auto" onKeyDown={keyboard.handleContainerKeyDown} tabIndex={0}>
            <table className={T.table} style={{ tableLayout: 'fixed' }}>
                <thead>
                    <tr className={`${headerBg} border-t border-slate-200 ${headerText}`}>
                        <th className={`px-2 py-1.5 text-left ${T.th} ${headerText}`} style={{ width: '160px' }}>{title || 'Marca'}</th>
                        <th className={`px-2 py-1.5 text-left ${T.th} ${headerText}`} style={{ width: '140px' }}>Modelo</th>
                        <th className={`px-2 py-1.5 text-right ${T.th} ${headerText}`} style={{ width: '120px' }}>Monto $</th>
                        <th className={`px-2 py-1.5 text-center ${T.th} ${headerText}`} style={{ width: '80px' }}>Año</th>
                        <th style={{ width: '40px' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {activeRows.map(row => {
                        const hovered = isHovered(row.id)
                        return (
                            <tr
                                key={row.id}
                                className="border-b border-gray-100 hover:bg-gray-50"
                                {...getHoverProps(row.id)}
                            >
                                <td className={`px-2 py-2.5 ${T.cellLabel}`} style={{ width: '160px' }}>
                                    <div className="flex items-center gap-1 min-w-0">
                                        <DeleteRowButton onClick={() => requestDelete(row.id)} isVisible={hovered} />
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
                                    focused={keyboard.isFocused(row.id, 0)}
                                    onCellFocus={() => keyboard.focus(row.id, 0)}
                                    onNavigate={keyboard.navigate}
                                    requestEdit={keyboard.isFocused(row.id, 0) ? keyboard.editTrigger : 0}
                                    requestClear={keyboard.isFocused(row.id, 0) ? keyboard.clearTrigger : 0}
                                    editInitialValue={keyboard.isFocused(row.id, 0) ? keyboard.editInitialValue : undefined}
                                />
                                <EditableCell
                                    value={row.anio}
                                    onChange={v => updateField(row.id, 'anio', v as number | null)}
                                    type="number"
                                    hasData={row.anio !== null}
                                    width="80px"
                                    align="center"
                                    focused={keyboard.isFocused(row.id, 1)}
                                    onCellFocus={() => keyboard.focus(row.id, 1)}
                                    onNavigate={keyboard.navigate}
                                    requestEdit={keyboard.isFocused(row.id, 1) ? keyboard.editTrigger : 0}
                                    requestClear={keyboard.isFocused(row.id, 1) ? keyboard.clearTrigger : 0}
                                    editInitialValue={keyboard.isFocused(row.id, 1) ? keyboard.editInitialValue : undefined}
                                />
                                <td style={{ width: '40px' }}></td>
                            </tr>
                        )
                    })}

                    <EmptyStateRow show={activeRows.length === 0} colSpan={5} message={emptyMessage} />

                    {/* Add row */}
                    <tr className="border-b border-dashed border-slate-100 bg-slate-50/20">
                        <td colSpan={5} className="px-4 py-2.5 text-center">
                            <button
                                className="text-xs text-slate-600 hover:text-slate-700"
                                onClick={addRow}
                            >
                                {addLabel}
                            </button>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr className={`${headerBg} font-semibold text-xs border-b border-slate-200`}>
                        <td colSpan={2} className={`px-2 py-1.5 ${headerText} ${T.totalLabel}`}>TOTAL</td>
                        <td className={`px-2 py-1.5 text-right ${headerText} ${T.totalValue}`}>
                            {totalMonto ? formatCurrency(totalMonto) : '—'}
                        </td>
                        <td colSpan={2}></td>
                    </tr>
                </tfoot>
            </table>
            <RecycleBin deletedRows={deletedRows} getLabel={(r) => r.marca} onRestore={restoreRow} />
        </div>
        {deleteTargetId && <DeleteDialog count={1} onConfirm={confirmDelete} onCancel={cancelDelete} />}
    </>
    )
}

export default VehiculosTable
