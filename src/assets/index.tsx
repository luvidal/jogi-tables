import { useState } from 'react'
import EditableCell from '../common/editablecell'
import DeleteRowButton from '../common/deletebutton'
import { T } from '../common/styles'
import { useFieldUpdate } from '../common/usefieldupdate'
import { useRowHover } from '../common/userowhover'
import { useSoftDelete } from '../common/usesoftdelete'
import DeleteDialog from '../common/deletedialog'
import RecycleBin from '../common/recyclebin'
import type { SoftDeletable } from '../common/softdeletetypes'

export type AssetRowData = {
    id: string
    label: string
    type: 'asset'
    value: number | null
    description?: string
} & SoftDeletable

export interface AssetTableProps {
    rows: AssetRowData[]
    onRowsChange: (rows: AssetRowData[]) => void
    formatCurrency: (value: number | null | undefined) => string
    placeholder?: string
    onViewSource?: (fileIds: string[]) => void
}

const AssetTable = ({
    rows,
    onRowsChange,
    formatCurrency,
    placeholder = 'Agregar activo...',
    onViewSource
}: AssetTableProps) => {
    const { getHoverProps, isHovered } = useRowHover()
    const [newAssetLabel, setNewAssetLabel] = useState('')

    const { updateField } = useFieldUpdate(rows, onRowsChange)
    const { activeRows, deletedRows, deleteTargetId, requestDelete, confirmDelete, cancelDelete, restoreRow } = useSoftDelete(rows, onRowsChange)

    const addRow = (label: string) => {
        if (!label.trim()) return
        const newRow: AssetRowData = {
            id: `row_asset_${Date.now()}`,
            label: label.trim(),
            type: 'asset',
            value: null
        }
        setNewAssetLabel('')
        onRowsChange([...rows, newRow])
    }

    const addRowWithValue = (value: number | null) => {
        if (value === null) return
        const pendingLabel = newAssetLabel.trim()
        const defaultLabel = 'Nuevo activo'
        const newRow: AssetRowData = {
            id: `row_asset_${Date.now()}`,
            label: pendingLabel || defaultLabel,
            type: 'asset',
            value
        }
        setNewAssetLabel('')
        onRowsChange([...rows, newRow])
    }

    const totalAssets = activeRows.reduce((sum, row) => sum + (row.value || 0), 0)

    const renderRow = (row: AssetRowData) => {
        const hovered = isHovered(row.id)

        return (
            <tr
                key={row.id}
                className="border-b border-gray-100 bg-blue-50/50 hover:bg-blue-100/50 group"
                {...getHoverProps(row.id)}
            >
                <td className={`px-2 py-2.5 text-gray-700 ${T.cellLabel}`} style={{ width: '200px' }}>
                    <div className="flex items-center gap-1 min-w-0">
                        <DeleteRowButton onClick={() => requestDelete(row.id)} isVisible={hovered} size="default" title="Eliminar fila" />
                        <input
                            type="text"
                            value={row.label}
                            onChange={(e) => updateField(row.id, 'label', e.target.value)}
                            className={`flex-1 min-w-0 ${T.inputLabel} pl-1`}
                            title={row.label}
                        />
                    </div>
                </td>
                <td className="px-2 py-2.5 text-gray-600" style={{ width: '200px' }}>
                    <input
                        type="text"
                        value={row.description || ''}
                        onChange={(e) => updateField(row.id, 'description', e.target.value)}
                        placeholder="Descripción..."
                        className={`w-full ${T.input} placeholder-gray-400`}
                    />
                </td>
                <EditableCell
                    value={row.value}
                    onChange={(v) => updateField(row.id, 'value', v as number | null)}
                    isDeduction={false}
                    hasData={row.value !== null}
                    width="140px"
                    type="currency"
                    className="text-blue-700 font-medium"
                />
            </tr>
        )
    }

    const renderAddRow = () => {
        return (
            <tr className="border-b border-dashed bg-blue-50/30 border-blue-100">
                <td className="px-4 py-2.5" style={{ width: '200px' }}>
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={newAssetLabel}
                        onChange={(e) => setNewAssetLabel(e.target.value)}
                        className={`w-full ${T.inputPlaceholder}`}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && newAssetLabel.trim()) {
                                addRow(newAssetLabel)
                            }
                        }}
                    />
                </td>
                <td className="px-2 py-2.5" style={{ width: '200px' }}>
                    <span className={T.empty}>—</span>
                </td>
                <EditableCell
                    value={null}
                    onChange={(v) => addRowWithValue(v as number | null)}
                    isDeduction={false}
                    hasData={false}
                    width="140px"
                    type="currency"
                />
            </tr>
        )
    }

    return (<>
        <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
            <div className="overflow-x-auto">
                <table className={T.table} style={{ tableLayout: 'fixed' }}>
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-blue-50 border-b border-blue-100">
                            <th className={`px-4 py-2 text-left text-blue-700 font-medium text-xs`} style={{ width: '200px' }}>
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                    </svg>
                                    Activo
                                </div>
                            </th>
                            <th className={`px-3 py-2 text-left font-medium text-blue-600 text-xs`} style={{ width: '200px' }}>
                                Descripción
                            </th>
                            <th className={`px-3 py-2 text-right font-medium text-blue-600 text-xs`} style={{ width: '140px' }}>
                                Valor Estimado
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeRows.map(row => renderRow(row))}
                        {renderAddRow()}

                        {/* Total Row */}
                        <tr className="border-t-2 border-blue-200 bg-blue-100/50">
                            <td className={`px-4 py-3 text-blue-800 ${T.footerLabel}`} style={{ width: '200px' }}>TOTAL ACTIVOS</td>
                            <td className="px-3 py-3" style={{ width: '200px' }}></td>
                            <td className={`px-3 py-3 text-right ${T.footerValue} text-blue-800`} style={{ width: '140px' }}>
                                {totalAssets > 0 ? formatCurrency(totalAssets) : '—'}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <RecycleBin deletedRows={deletedRows} getLabel={(r) => r.label} onRestore={restoreRow} />
        </div>
        {deleteTargetId && <DeleteDialog count={1} onConfirm={confirmDelete} onCancel={cancelDelete} />}
    </>
    )
}

export default AssetTable
