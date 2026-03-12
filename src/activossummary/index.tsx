import React from 'react'
import { T } from '../common/styles'

export interface ActivosSummaryItem {
    label: string
    value: number | null
    count: number
}

export interface ActivosSummaryProps {
    items: ActivosSummaryItem[]
    totalLabel?: string
    formatCurrency?: (value: number | null | undefined) => string
    colorScheme?: {
        totalBg: string
        totalBorder: string
        totalText: string
        totalValueText: string
    }
}

const defaultFormatCurrency = (value: number | null | undefined): string => {
    if (value === undefined || value === null) return '—'
    return `$ ${value.toLocaleString('es-CL')}`
}

const defaultColorScheme = {
    totalBg: 'bg-cyan-50',
    totalBorder: 'border-cyan-200',
    totalText: 'text-cyan-700',
    totalValueText: 'text-cyan-800',
}

const ActivosSummary = ({
    items,
    totalLabel = 'Total Activos',
    formatCurrency = defaultFormatCurrency,
    colorScheme = defaultColorScheme,
}: ActivosSummaryProps) => {
    const grandTotal = items.reduce((sum, item) => sum + (item.value || 0), 0)

    return (
        <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
                {items.map((item, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-2.5">
                        <div className={`${T.cardLabel} text-gray-500`}>{item.label}</div>
                        <div className={`${T.cardValue} text-gray-800 mt-0.5`}>
                            {item.value ? formatCurrency(item.value) : '—'}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5">
                            {item.count} {item.count === 1 ? 'registro' : 'registros'}
                        </div>
                    </div>
                ))}
            </div>
            <div className={`${colorScheme.totalBg} border ${colorScheme.totalBorder} rounded-lg p-2.5 flex items-center justify-between`}>
                <span className={`${T.totalLabel} ${colorScheme.totalText}`}>{totalLabel}</span>
                <span className={`${T.totalValue} ${colorScheme.totalValueText}`}>
                    {grandTotal ? formatCurrency(grandTotal) : '—'}
                </span>
            </div>
        </div>
    )
}

export default ActivosSummary
