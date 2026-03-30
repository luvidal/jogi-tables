import { T } from '../common/styles'
import { resolveColors } from '../common/colors'
import { SourceIcon } from '../common/tableshell'
import type { DeclaracionTableProps } from './types'

const DeclaracionTable = ({
    columns,
    rows,
    data,
    totalLabel = 'Suma Total',
    formatCurrency,
    colorScheme: colorSchemeProp,
    sourceFileIds,
    onViewSource,
}: DeclaracionTableProps) => {
    const { text: headerText, border: borderColor } = resolveColors(colorSchemeProp)

    return (
        <div className="p-3">
            <div className="overflow-x-auto">
                <table className={T.table}>
                    <thead>
                        <tr className={`border-b ${borderColor}`}>
                            <th className={`text-left ${T.cell} font-medium ${headerText}`}>
                                <div className="flex items-center gap-1.5">
                                    Concepto
                                    <SourceIcon fileIds={sourceFileIds} onViewSource={onViewSource} className={headerText} />
                                </div>
                            </th>
                            {columns.map(col => (
                                <th key={col.key} className={`text-right ${T.cell} font-medium ${headerText}`}>
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(row => (
                            <tr key={row.key} className={T.row}>
                                <td className={`${T.cell} text-gray-700`}>{row.label}</td>
                                {columns.map(col => {
                                    const value = data[row.key]?.[col.key]
                                    return (
                                        <td key={col.key} className={`${T.cellValue} ${value != null ? 'text-gray-900' : 'text-gray-400'}`}>
                                            {value != null ? formatCurrency(value) : '—'}
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                        {totalLabel && (
                            <tr className={`border-t-2 ${borderColor} font-semibold`}>
                                <td className={`${T.cell} text-gray-800`}>{totalLabel}</td>
                                {columns.map(col => {
                                    const summedRows = rows.filter(r => r.summed)
                                    const hasAny = summedRows.some(r => data[r.key]?.[col.key] != null)
                                    const sum = summedRows.reduce((acc, r) => acc + (data[r.key]?.[col.key] ?? 0), 0)
                                    return (
                                        <td key={col.key} className={`${T.cellValue} text-gray-900`}>
                                            {hasAny ? formatCurrency(sum) : '—'}
                                        </td>
                                    )
                                })}
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default DeclaracionTable
