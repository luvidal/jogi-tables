import React from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { displayCurrencyCompact } from '../common/utils'
import { T } from '../common/styles'
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
    headerBg?: string
    headerText?: string
    defaultCollapsed?: boolean
    forceExpanded?: boolean
    sourceFileIds?: string[]
    onViewSource?: (fileIds: string[]) => void
}

// ============================================================================
// Helpers
// ============================================================================

const formatCurrency = (value: number | null | undefined): string => {
    return displayCurrencyCompact(value)
}

const MONTH_LABELS: Record<string, string> = {
    enero: 'Enero', febrero: 'Febrero', marzo: 'Marzo', abril: 'Abril',
    mayo: 'Mayo', junio: 'Junio', julio: 'Julio', agosto: 'Agosto',
    septiembre: 'Septiembre', octubre: 'Octubre', noviembre: 'Noviembre', diciembre: 'Diciembre',
}

// ============================================================================
// Component
// ============================================================================

const BoletasTable = ({
    title,
    months,
    totales,
    headerBg = 'bg-emerald-50',
    headerText = 'text-emerald-700',
    defaultCollapsed = false,
    forceExpanded = false,
    sourceFileIds,
    onViewSource,
}: BoletasTableProps) => {
    const monthsWithData = months.filter(m => m.hasData)
    const totalLiquido = totales?.total_liquido ?? monthsWithData.reduce((s, m) => s + (m.liquido || 0), 0)
    const totalBoletas = totales?.boletas_vigentes ?? monthsWithData.reduce((s, m) => s + (m.boletas || 0), 0)
    const promedioMensual = monthsWithData.length > 0 ? totalLiquido / monthsWithData.length : 0

    return (
        <TableShell
            headerBg={headerBg}
            headerText={headerText}
            defaultCollapsed={defaultCollapsed}
            forceExpanded={forceExpanded}
            renderHeader={({ isExpanded }) => (
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                        <span className={`${headerText} ${T.headerTitle}`}>
                            {title}
                        </span>
                        <SourceIcon fileIds={sourceFileIds} onViewSource={onViewSource} className={headerText} />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 text-xs">
                            <span className={headerText}>
                                <span className={`${T.headerStatLabel}`}>Boletas: </span>
                                <span className={T.headerStat}>{totalBoletas}</span>
                            </span>
                            <span className={headerText}>
                                <span className={`${T.headerStatLabel}`}>Líquido: </span>
                                <span className={T.headerStat}>{formatCurrency(totalLiquido)}</span>
                            </span>
                            <span className={headerText}>
                                <span className={`${T.headerStatLabel}`}>Promedio: </span>
                                <span className={T.headerStat}>{formatCurrency(Math.round(promedioMensual))}</span>
                            </span>
                        </div>
                        {!forceExpanded && (
                            isExpanded ? <ChevronUp size={20} className={headerText} /> : <ChevronDown size={20} className={headerText} />
                        )}
                    </div>
                </div>
            )}
        >
            <div className="overflow-x-auto">
                <table className={T.table} style={{ tableLayout: 'fixed' }}>
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50/50">
                            <th className={`px-4 py-2 text-left ${T.th}`} style={{ width: '140px' }}>Mes</th>
                            <th className={`px-3 py-2 text-center ${T.th}`} style={{ width: '80px' }}>Boletas</th>
                            <th className={`px-3 py-2 text-right ${T.th}`} style={{ width: '130px' }}>Bruto</th>
                            <th className={`px-3 py-2 text-right ${T.th}`} style={{ width: '130px' }}>Retención</th>
                            <th className={`px-4 py-2 text-right ${T.th}`} style={{ width: '130px' }}>Líquido</th>
                        </tr>
                    </thead>
                    <tbody>
                        {months.map((m, i) => (
                            <tr key={i} className={`border-b border-gray-100 ${m.hasData ? 'hover:bg-emerald-50/30' : ''}`}>
                                <td className={`px-4 py-2.5 font-medium ${T.cellLabel} ${m.hasData ? 'text-gray-700' : 'text-gray-300'}`} style={{ width: '140px' }}>
                                    <span className="truncate block">{MONTH_LABELS[m.mes] || m.mes}</span>
                                </td>
                                <td className="px-3 py-2.5 text-center text-gray-800" style={{ width: '80px' }}>
                                    {m.hasData ? (m.boletas ?? '') : ''}
                                </td>
                                <td className="px-3 py-2.5 text-right text-gray-800" style={{ width: '130px' }}>
                                    {m.hasData ? formatCurrency(m.bruto) : ''}
                                </td>
                                <td className="px-3 py-2.5 text-right text-red-700" style={{ width: '130px' }}>
                                    {m.hasData ? formatCurrency(m.retencion) : ''}
                                </td>
                                <td className="px-4 py-2.5 text-right font-medium text-emerald-700" style={{ width: '130px' }}>
                                    {m.hasData ? formatCurrency(m.liquido) : ''}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="border-t-2 border-emerald-200 bg-emerald-50/50">
                            <td className={`px-4 py-3 ${T.footerLabel} text-emerald-700`} style={{ width: '140px' }}>TOTALES</td>
                            <td className={`px-3 py-3 text-center ${T.footerValue} text-emerald-700`} style={{ width: '80px' }}>
                                {totalBoletas}
                            </td>
                            <td className={`px-3 py-3 text-right ${T.footerValue} text-emerald-700`} style={{ width: '130px' }}>
                                {formatCurrency(totales?.honorario_bruto ?? monthsWithData.reduce((s, m) => s + (m.bruto || 0), 0))}
                            </td>
                            <td className={`px-3 py-3 text-right ${T.footerValue} text-red-700`} style={{ width: '130px' }}>
                                {formatCurrency(
                                    (totales?.retencion_terceros ?? 0) + (totales?.retencion_contribuyente ?? 0)
                                    || monthsWithData.reduce((s, m) => s + (m.retencion || 0), 0)
                                )}
                            </td>
                            <td className={`px-4 py-3 text-right ${T.footerValue} text-emerald-700`} style={{ width: '130px' }}>
                                {formatCurrency(totalLiquido)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </TableShell>
    )
}

export default BoletasTable
