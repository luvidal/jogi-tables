import React, { useState, useMemo } from 'react'
import EditableCell from '../common/editablecell'
import DeleteRowButton from '../common/deletebutton'
import { T } from '../common/styles'
import { resolveColors } from '../common/colors'
import { useRowHover } from '../common/userowhover'
import { useGridKeyboard } from '../common/usegridkeyboard'
import { applyAutoConversions, applyAutoCompute } from '../common/autoconvert'
import { defaultFormatCurrency, generateId } from '../common/utils'
import { useSoftDelete } from '../common/usesoftdelete'
import DeleteDialog from '../common/deletedialog'
import RecycleBin from '../common/recyclebin'
import CurrencyToggle from '../common/currencytoggle'
import type { AssetRow, AssetTableProps, ColumnDef } from './types'

function AssetTable<T extends AssetRow>({
    columns,
    rows,
    onRowsChange,
    idPrefix,
    addPlaceholder,
    formatCurrency = defaultFormatCurrency,
    colorScheme: colorSchemeProp,
    headerBg: headerBgProp,
    headerText: headerTextProp,
    title,
    ufValue,
    conversionRules = [],
    computeRules = [],
}: AssetTableProps<T>) {
    const { bg: headerBg, text: headerText, border: borderColor } = resolveColors(colorSchemeProp, headerBgProp, headerTextProp)
    const { getHoverProps, isHovered } = useRowHover()
    const [currency, setCurrency] = useState<'uf' | 'clp'>('uf')
    const { activeRows, deletedRows, deleteTargetId, requestDelete, confirmDelete, cancelDelete, restoreRow } = useSoftDelete(rows, onRowsChange)

    const hasUfToggle = ufValue != null && columns.some(c => c.ufPair)
    const isUf = currency === 'uf'

    // Resolve visible columns based on UF/CLP toggle
    const visibleColumns = useMemo(() => {
        if (!hasUfToggle) return columns
        const ufPairKeys = new Set(columns.filter(c => c.ufPair).map(c => c.ufPair!))
        return columns.filter(c => {
            // If this column is a ufPair target, hide it (it's shown when toggle flips)
            if (ufPairKeys.has(c.key)) return isUf  // show ufPair columns only in UF mode... wait
            // Actually, the logic: a column with ufPair shows in UF mode. Its pair shows in CLP mode.
            return true
        })
    }, [columns, hasUfToggle, isUf])

    // Actually, let me rethink. The column definition approach:
    // - Column with key='valor_uf', ufPair='valor_pesos': shown when isUf=true
    // - Column with key='valor_pesos' (no ufPair): shown when isUf=false
    // But we only define the primary column (with ufPair) and auto-switch.
    // The paired column doesn't exist in the columns array — it's implicit.
    // This means we need to compute which key and type to use per column at render time.

    const resolvedColumns = useMemo(() => {
        return columns.map(col => {
            if (col.ufPair && !isUf) {
                // Switch to the CLP pair
                return { ...col, key: col.ufPair, type: 'currency' as const, label: col.label.replace('UF', '$') }
            }
            return col
        })
    }, [columns, isUf])

    // EditableCell columns for keyboard nav
    const editableCols = useMemo(() =>
        resolvedColumns.filter(c => c.type !== 'text'),
    [resolvedColumns])

    const visibleRowIds = useMemo(() => activeRows.map(r => r.id), [activeRows])
    const keyboard = useGridKeyboard({ visibleRowIds, colCount: editableCols.length })

    // Text columns are the first N columns of type 'text'
    const textCols = resolvedColumns.filter(c => c.type === 'text')
    const labelCol = resolvedColumns.find(c => c.isLabel) || resolvedColumns[0]
    // New row state: one entry per text column
    const [newRowValues, setNewRowValues] = useState<Record<string, string>>({})

    const hasAutoConvert = conversionRules.length > 0 || computeRules.length > 0

    const updateField = (id: string, field: string, value: string | number | null) => {
        onRowsChange(rows.map(r => {
            if (r.id !== id) return r
            if (hasAutoConvert) {
                let next = applyAutoConversions(r, field, value, conversionRules, {})
                next = applyAutoCompute(next, field, computeRules, {})
                return next as T
            }
            return { ...r, [field]: value } as T
        }))
    }

    const addRow = (overrides?: Partial<T>) => {
        const base: Record<string, unknown> = { id: generateId(idPrefix) }
        for (const col of columns) {
            if (col.type === 'text') {
                base[col.key] = (newRowValues[col.key] || '').trim()
            } else {
                base[col.key] = null
            }
            if (col.ufPair) base[col.ufPair] = null
        }
        const row = { ...base, ...overrides } as T
        setNewRowValues({})
        onRowsChange([...rows, row])
    }

    // Compute totals for currency/number columns
    const totals = useMemo(() => {
        const result: Record<string, number> = {}
        for (const col of resolvedColumns) {
            if (col.type === 'currency' || col.type === 'number') {
                result[col.key] = activeRows.reduce((s, r) => s + ((r[col.key] as number) || 0), 0)
            }
        }
        return result
    }, [activeRows, resolvedColumns])

    // Map from editable column index to resolved column
    const editableColIndex = (col: ColumnDef): number => editableCols.indexOf(col)

    const renderEditableCell = (row: T, col: ColumnDef) => {
        const colIdx = editableColIndex(col)
        const value = row[col.key] as number | null
        const autoClass = col.autoComputedClass?.(row) || ''
        return (
            <EditableCell
                key={col.key}
                value={value}
                onChange={v => updateField(row.id, col.key, v as number | null)}
                type={col.type as 'currency' | 'number'}
                hasData={value !== null}
                width={col.width}
                align={col.align}
                className={autoClass}
                focused={keyboard.isFocused(row.id, colIdx)}
                onCellFocus={() => keyboard.focus(row.id, colIdx)}
                onNavigate={keyboard.navigate}
                requestEdit={keyboard.isFocused(row.id, colIdx) ? keyboard.editTrigger : 0}
                requestClear={keyboard.isFocused(row.id, colIdx) ? keyboard.clearTrigger : 0}
                editInitialValue={keyboard.isFocused(row.id, colIdx) ? keyboard.editInitialValue : undefined}
            />
        )
    }

    return (<>
        <div className="overflow-x-auto relative" onKeyDown={keyboard.handleContainerKeyDown} tabIndex={0}>
            {hasUfToggle && (
                <div className="absolute top-1 right-1 z-10">
                    <CurrencyToggle value={currency} onChange={setCurrency} />
                </div>
            )}
            <table className={T.table} style={{ tableLayout: 'fixed' }}>
                <thead>
                    <tr className={`${headerBg} border-t ${borderColor} ${headerText}`}>
                        {resolvedColumns.map(col => {
                            // Default alignment: currency/number right-align (matching EditableCell default), text left-aligns
                            const effectiveAlign = col.align ?? (col.type === 'currency' || col.type === 'number' ? 'right' : 'left')
                            return (
                            <th
                                key={col.key}
                                className={`${T.headerCell} ${effectiveAlign === 'right' ? 'text-right' : effectiveAlign === 'center' ? 'text-center' : 'text-left'} ${T.th} ${headerText}`}
                                style={col.isLabel ? undefined : { width: col.width }}
                            >
                                {col === labelCol && title ? title : col.label}
                            </th>
                        )})}
                        <th style={{ width: '40px' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {activeRows.map(row => {
                        const hovered = isHovered(row.id)
                        return (
                            <tr
                                key={row.id}
                                className={`${T.rowBorder} ${T.rowHover}`}
                                {...getHoverProps(row.id)}
                            >
                                {resolvedColumns.map(col => {
                                    if (col.isLabel) {
                                        return (
                                            <td key={col.key} className={`${T.cellEdit} ${T.cellLabel}`} style={{ width: col.width }}>
                                                <div className="flex items-center gap-1 min-w-0">
                                                    <DeleteRowButton onClick={() => requestDelete(row.id)} isVisible={hovered} />
                                                    <input
                                                        type="text"
                                                        value={(row[col.key] as string) || ''}
                                                        onChange={e => updateField(row.id, col.key, e.target.value)}
                                                        className={`flex-1 min-w-0 ${T.inputLabel} pl-1`}
                                                        placeholder={col.placeholder || col.label}
                                                    />
                                                </div>
                                            </td>
                                        )
                                    }
                                    if (col.type === 'text') {
                                        return (
                                            <td key={col.key} className={T.cellEdit} style={{ width: col.width }}>
                                                <input
                                                    type="text"
                                                    value={(row[col.key] as string) || ''}
                                                    onChange={e => updateField(row.id, col.key, e.target.value)}
                                                    className={`w-full ${T.input} pl-1`}
                                                    placeholder={col.placeholder || col.label}
                                                />
                                            </td>
                                        )
                                    }
                                    return renderEditableCell(row, col)
                                })}
                                <td style={{ width: '40px' }}></td>
                            </tr>
                        )
                    })}

                    {/* Add row */}
                    <tr className={`border-b border-dashed ${borderColor.replace('200', '100')} ${headerBg}/20`}>
                        {resolvedColumns.map((col, i) => {
                            if (col.isLabel) {
                                return (
                                    <td key={col.key} className={T.cellEdit} style={{ width: col.width }}>
                                        <input
                                            type="text"
                                            placeholder={addPlaceholder || `Agregar...`}
                                            value={newRowValues[col.key] || ''}
                                            onChange={e => setNewRowValues(prev => ({ ...prev, [col.key]: e.target.value }))}
                                            className={`w-full ${T.inputPlaceholder}`}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter' && (newRowValues[col.key] || '').trim()) addRow()
                                            }}
                                        />
                                    </td>
                                )
                            }
                            if (col.type === 'text') {
                                return (
                                    <td key={col.key} className={T.cellEdit} style={{ width: col.width }}>
                                        <input
                                            type="text"
                                            placeholder={col.placeholder || col.label}
                                            value={newRowValues[col.key] || ''}
                                            onChange={e => setNewRowValues(prev => ({ ...prev, [col.key]: e.target.value }))}
                                            className={`w-full ${T.inputPlaceholder}`}
                                        />
                                    </td>
                                )
                            }
                            // Editable cell in add row — triggers addRow on value entry
                            return (
                                <EditableCell
                                    key={col.key}
                                    value={null}
                                    onChange={v => addRow({ [col.key]: v } as Partial<T>)}
                                    type={col.type as 'currency' | 'number'}
                                    hasData={false}
                                    width={col.width}
                                    align={col.align}
                                />
                            )
                        })}
                        <td style={{ width: '40px' }}></td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr className={`${headerBg} font-semibold text-xs border-b ${borderColor}`}>
                        <td colSpan={textCols.length} className={`${T.totalCell} ${headerText} ${T.totalLabel}`}>TOTAL</td>
                        {editableCols.map(col => (
                            <td key={col.key} className={`${T.totalCell} ${col.align === 'center' ? 'text-center' : 'text-right'} ${headerText} ${T.totalValue}`}>
                                {totals[col.key] ? (
                                    col.type === 'number'
                                        ? totals[col.key].toLocaleString('es-CL', { maximumFractionDigits: 2 })
                                        : formatCurrency(totals[col.key])
                                ) : '—'}
                            </td>
                        ))}
                        <td></td>
                    </tr>
                </tfoot>
            </table>
            <RecycleBin
                deletedRows={deletedRows}
                getLabel={(r) => (r[labelCol.key] as string) || ''}
                onRestore={restoreRow}
                renderCells={(row) => (
                    <>
                        {editableCols.map(col => {
                            const v = row[col.key] as number | null
                            return (
                                <td key={col.key} className={`${T.totalCell} text-right tabular-nums`} style={{ width: col.width }}>
                                    <span className={`${T.totalValue} ${v != null ? 'text-gray-400' : 'text-gray-200'}`}>
                                        {v != null ? (col.type === 'number' ? String(v) : formatCurrency(v)) : '—'}
                                    </span>
                                </td>
                            )
                        })}
                        <td style={{ width: '40px' }} />
                    </>
                )}
            />
        </div>
        {deleteTargetId && <DeleteDialog count={1} onConfirm={confirmDelete} onCancel={cancelDelete} />}
    </>)
}

export default AssetTable
