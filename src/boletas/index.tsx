import React from 'react'
import { displayCurrencyCompact } from '../common/utils'
import { T } from '../common/styles'
import { resolveColors } from '../common/colors'
import TableShell, { SourceIcon } from '../common/tableshell'

// ============================================================================
// Types
// ============================================================================

export type BoletaMonth = {
    periodo: string       // "2025-01"
    mes: string           // "enero"
    hasData: boolean
    boletas: number | null
    bruto: number | null
    retencion: number | null
    liquido: number | null
}

export interface BoletasTableProps {
    title: string
    months: BoletaMonth[]
    totales?: {
        boletas_vigentes?: number
        honorario_bruto?: number
        retencion_terceros?: number
        retencion_contribuyente?: number
        total_liquido?: number
    }
    colorScheme?: import('../common/colors').ColorScheme
    /** @deprecated Use colorScheme instead */
    headerBg?: string
    /** @deprecated Use colorScheme instead */
    headerText?: string
    sourceFileIds?: string[]
    onViewSource?: (fileIds: string[]) => void
    onRemoveMonth?: (periodo: string) => void
    /** Periodos excluded from summary calculations — columns are dimmed and clickable to toggle */
    excludedMonths?: string[]
    onToggleMonth?: (periodo: string) => void
}

// ============================================================================
// Short month labels for column headers
// ============================================================================

const SHORT_MONTHS: Record<string, string> = {
    enero: 'ENE', febrero: 'FEB', marzo: 'MAR', abril: 'ABR',
    mayo: 'MAY', junio: 'JUN', julio: 'JUL', agosto: 'AGO',
    septiembre: 'SEP', octubre: 'OCT', noviembre: 'NOV', diciembre: 'DIC',
}

// ============================================================================
// Detail rows (collapsible body)
// ============================================================================

type MetricKey = 'boletas' | 'bruto' | 'retencion'

const METRICS: { key: MetricKey; label: string; color: string; format: (v: number | null) => string }[] = [
    { key: 'bruto',     label: 'Honor. Bruto', color: 'text-gray-800',  format: v => displayCurrencyCompact(v) },
    { key: 'retencion', label: 'Retención',    color: 'text-red-700',   format: v => displayCurrencyCompact(v) },
    { key: 'boletas',   label: 'Boletas Vig.', color: 'text-gray-800',  format: v => v != null ? String(v) : '—' },
]

// ============================================================================
// Component
// ============================================================================

const BoletasTable = ({
    title,
    months,
    colorScheme: colorSchemeProp,
    headerBg: headerBgProp,
    headerText: headerTextProp,
    sourceFileIds,
    onViewSource,
    excludedMonths,
    onToggleMonth,
}: BoletasTableProps) => {
    const { bg: headerBg, text: headerText, border: borderColor } = resolveColors(colorSchemeProp, headerBgProp, headerTextProp)
    const excluded = excludedMonths ?? []

    return (
        <TableShell
            headerBg={headerBg}
            renderHeader={() => (
                <>
                    <td className={`${T.headerAccordion} text-left ${T.vline}`}>
                        <div className="flex items-center gap-2">
                            <span className={`${headerText} ${T.headerTitle}`}>{title}</span>
                            <SourceIcon fileIds={sourceFileIds} onViewSource={onViewSource} className={headerText} />
                        </div>
                    </td>
                    {months.map(m => {
                        const isExcluded = excluded.includes(m.periodo)
                        const canToggle = !!onToggleMonth
                        const hasValue = m.hasData && m.liquido != null
                        const label = SHORT_MONTHS[m.mes] || m.mes.slice(0, 3).toUpperCase()
                        return (
                            <td
                                key={m.periodo}
                                className={`${T.headerAccordionStat} ${isExcluded ? 'opacity-35 line-through' : ''}`}
                            >
                                <span
                                    className={`whitespace-nowrap ${canToggle ? `cursor-pointer select-none inline-flex items-center rounded-full border ${borderColor} px-2 py-0.5 -mx-2 -my-0.5` : ''}`}
                                    onClick={canToggle ? (e) => { e.stopPropagation(); onToggleMonth!(m.periodo) } : undefined}
                                >
                                    <span className={`${headerText} ${T.headerStatLabel}`}>{label}: </span>
                                    <span className={`${T.headerStat} ${hasValue ? headerText : 'text-gray-400'}`}>
                                        {hasValue ? displayCurrencyCompact(m.liquido) : '—'}
                                    </span>
                                </span>
                            </td>
                        )
                    })}
                </>
            )}
        >
            {METRICS.map(metric => (
                <tr key={metric.key} className={T.rowBorder}>
                    <td className={`${T.cell} font-medium ${T.cellLabel} text-gray-600 ${T.vline}`}>
                        {metric.label}
                    </td>
                    {months.map(m => {
                        const isExcluded = excluded.includes(m.periodo)
                        return (
                            <td
                                key={m.periodo}
                                className={`${T.cell} text-right ${m.hasData ? metric.color : 'text-gray-300'} ${isExcluded ? 'opacity-35' : ''}`}
                            >
                                {m.hasData ? metric.format(m[metric.key]) : '—'}
                            </td>
                        )
                    })}
                </tr>
            ))}
        </TableShell>
    )
}

export default BoletasTable
