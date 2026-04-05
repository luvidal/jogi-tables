/**
 * BalanceTable — Vertical layout (fields as rows, companies as columns)
 *
 * Each company is a column; each financial metric is a row.
 * Currency fields are editable via EditableCell with full keyboard navigation.
 * Text fields (RUT, Período) are read-only display.
 */

import { useMemo } from 'react'
import { Eye } from 'lucide-react'
import { T } from '../common/styles'
import { resolveColors } from '../common/colors'
import TableShell from '../common/tableshell'
import EditableCell from '../common/editablecell'
import { useGridKeyboard } from '../common/usegridkeyboard'
import { useRowHover } from '../common/userowhover'
import type { BalanceRow, BalanceFieldDef, BalanceTableProps } from './types'

const FIELD_ROWS: BalanceFieldDef[] = [
    { key: 'rut', label: 'RUT', type: 'text' },
    { key: 'periodo', label: 'Período', type: 'text' },
    { key: 'total_activos', label: 'Activos', type: 'currency' },
    { key: 'total_pasivos', label: 'Pasivos', type: 'currency' },
    { key: 'patrimonio', label: 'Patrimonio', type: 'currency' },
    { key: 'total_ingresos', label: 'Ingresos', type: 'currency' },
    { key: 'total_gastos', label: 'Gastos', type: 'currency' },
    { key: 'resultado', label: 'Resultado', type: 'currency' },
]

const CURRENCY_FIELDS = FIELD_ROWS.filter(f => f.type === 'currency')

const BalanceTable = ({
    rows,
    onRowsChange,
    colorScheme: colorSchemeProp,
    onViewSource,
}: BalanceTableProps) => {
    const { bg: headerBg, text: headerText, border: borderColor } = resolveColors(colorSchemeProp)
    const { getHoverProps, isHovered: isRowHovered } = useRowHover()

    // Grid keyboard: rows = currency fields, columns = companies
    const fieldIds = useMemo(() => CURRENCY_FIELDS.map(f => f.key), [])
    const keyboard = useGridKeyboard({ visibleRowIds: fieldIds, colCount: rows.length })

    const handleCellChange = (rowIdx: number, key: keyof BalanceRow, value: number | string | null) => {
        const updated = [...rows]
        updated[rowIdx] = { ...updated[rowIdx], [key]: value }
        onRowsChange(updated)
    }

    if (rows.length === 0) return null

    return (
        <div onKeyDown={keyboard.handleContainerKeyDown} tabIndex={0} className="outline-none">
            <TableShell
                headerBg={headerBg}
                headerClassName={`border-b ${borderColor} ${headerText}`}
                rowCount={rows.length}
                renderHeader={() => (
                    <>
                        <th className={`${T.headerCell} ${T.vline} w-28`} />
                        {rows.map((row, i) => (
                            <th key={row.id} className={`text-center ${T.headerCell} font-semibold ${headerText} min-w-[140px] ${i < rows.length - 1 ? T.vline : ''}`}>
                                <div className="flex items-center justify-center gap-1">
                                    {row.empresa || `Empresa ${i + 1}`}
                                    {row.sourceFileId && onViewSource && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onViewSource([row.sourceFileId!]) }}
                                            className="p-0.5 rounded hover:bg-white/50 transition-all opacity-0 group-hover/header:opacity-100 cursor-pointer"
                                            title="Ver documento fuente"
                                        >
                                            <Eye size={14} className={headerText} />
                                        </button>
                                    )}
                                </div>
                            </th>
                        ))}
                    </>
                )}
            >
                {FIELD_ROWS.map((field) => {
                    const isText = field.type === 'text'
                    const isResultado = field.key === 'resultado'
                    const isPatrimonio = field.key === 'patrimonio'
                    const isSectionBreak = field.key === 'total_activos' || field.key === 'total_ingresos'

                    return (
                        <tr
                            key={field.key}
                            className={`${T.rowBorder} ${!isText ? T.rowHover : ''} ${isSectionBreak ? 'border-t border-gray-200' : ''} ${isPatrimonio || isResultado ? 'bg-gray-50/60' : ''}`}
                            {...(!isText ? getHoverProps(field.key) : {})}
                        >
                            <td className={`${T.cell} text-left text-gray-500 font-medium whitespace-nowrap ${T.vline} ${isPatrimonio || isResultado ? 'font-semibold text-gray-600' : ''}`}>
                                {field.label}
                            </td>
                            {rows.map((row, colIdx) => {
                                const val = row[field.key]
                                const vline = colIdx < rows.length - 1 ? T.vline : ''

                                if (isText) {
                                    return (
                                        <td key={row.id} className={`${T.cellValue} ${val ? 'text-gray-700' : 'text-gray-400'} ${vline}`}>
                                            {(val as string) || '—'}
                                        </td>
                                    )
                                }

                                const numVal = val as number | null
                                const isNegative = typeof numVal === 'number' && numVal < 0
                                const colorClass = isNegative ? 'text-red-600' : ''
                                const weightClass = isPatrimonio || isResultado ? 'font-semibold' : ''

                                return (
                                    <EditableCell
                                        key={row.id}
                                        value={numVal}
                                        onChange={(v) => handleCellChange(colIdx, field.key, v)}
                                        type="currency"
                                        hasData={numVal != null}
                                        className={`${vline} ${colorClass} ${weightClass}`}
                                        focused={keyboard.isFocused(field.key, colIdx)}
                                        onCellFocus={() => keyboard.focus(field.key, colIdx)}
                                        onNavigate={keyboard.navigate}
                                        requestEdit={keyboard.isFocused(field.key, colIdx) ? keyboard.editTrigger : 0}
                                        requestClear={keyboard.isFocused(field.key, colIdx) ? keyboard.clearTrigger : 0}
                                        editInitialValue={keyboard.isFocused(field.key, colIdx) ? keyboard.editInitialValue : undefined}
                                    />
                                )
                            })}
                        </tr>
                    )
                })}
            </TableShell>
        </div>
    )
}

export default BalanceTable
