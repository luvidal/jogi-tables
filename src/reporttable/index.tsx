import type { ReactNode } from 'react'

export interface Column {
    label: string
    align?: 'left' | 'right' | 'center'
}

export interface ReportTableProps<T> {
    columns: Column[]
    items: T[]
    renderRow: (item: T, index: number) => ReactNode
    emptyMessage: string
    totalLabel: string
    totalValue: ReactNode
    totalBg: string
    totalText: string
}

function ReportTable<T>({ columns, items, renderRow, emptyMessage, totalLabel, totalValue, totalBg, totalText }: ReportTableProps<T>) {
    return (
        <table className='w-full text-sm'>
            <thead>
                <tr className='bg-gray-50 text-xs'>
                    {columns.map((col, i) => (
                        <th
                            key={i}
                            className={`py-2 px-3 font-semibold text-gray-600 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                        >
                            {col.label}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {items.length > 0 ? items.map(renderRow) : (
                    <tr className='border-b border-gray-100'>
                        <td colSpan={columns.length} className='py-3 px-3 text-center text-gray-400 italic'>
                            {emptyMessage}
                        </td>
                    </tr>
                )}
                <tr className={totalBg}>
                    <td colSpan={columns.length - 1} className={`py-2 px-3 font-semibold ${totalText}`}>{totalLabel}</td>
                    <td className={`py-2 px-3 text-right font-bold ${totalText}`}>{totalValue}</td>
                </tr>
            </tbody>
        </table>
    )
}

export default ReportTable
