import { T } from '../common/styles'
import { displayCurrencyCompact, displayCurrency } from '../common/utils'
import type { SummaryRow, SummaryRowFormat, SummaryTableProps } from './types'

function formatCell(v: number | null, format: SummaryRowFormat): { display: string; title: string | undefined } {
  if (v == null) return { display: '—', title: undefined }

  switch (format) {
    case 'percent': {
      const pct = v * 100
      const display = pct.toFixed(2).replace('.', ',') + ' %'
      const full = pct.toFixed(4).replace('.', ',') + ' %'
      return { display, title: full !== display ? full : undefined }
    }
    case 'integer':
      return { display: String(Math.round(v)), title: undefined }
    default:
      return { display: displayCurrencyCompact(v), title: displayCurrency(v) || undefined }
  }
}

const SummaryTable = ({ columnHeaders, rows, extraColumn, renderLabelSuffix, columnWidth = 'w-[120px]' }: SummaryTableProps) => {
  const extraW = extraColumn?.width ?? 'w-[80px]'

  return (
    <div className="overflow-x-auto">
      <table className={`${T.table} text-sm border-collapse`}>
        <tbody>
          {rows.map((row, idx) => {
            if (row.type === 'subheader') {
              return (
                <tr key={idx} className="border-b-2 border-gray-300">
                  <td className={`${T.cell} ${T.th} font-bold text-gray-800 tracking-wider`}>{row.label}</td>
                  {extraColumn && (
                    <td className={`${T.cell} ${T.th} text-right font-bold text-gray-600 ${extraW}`}>{extraColumn.header}</td>
                  )}
                  {columnHeaders.map((col, i) => (
                    <td key={i} className={`${T.cell} ${T.th} text-right font-bold text-gray-600 ${columnWidth}`}>{col}</td>
                  ))}
                </tr>
              )
            }

            const isTotal = row.type === 'total'
            const isFinal = row.type === 'grandtotal'
            const bold = isTotal || isFinal
            const fmt = row.format ?? 'currency'
            const rowClass = isFinal ? T.rowGrandtotal : isTotal ? T.rowTotal : T.row

            return (
              <tr key={idx} className={rowClass}>
                <td className={`${T.cell} ${bold ? T.footerLabel + ' text-gray-800' : T.muted + ' pl-5'}`}>
                  {row.label}
                  {renderLabelSuffix?.(row, idx)}
                </td>
                {extraColumn && (
                  <td className={`${T.cell} ${extraW}`}>
                    {extraColumn.render(row, idx)}
                  </td>
                )}
                {row.values.map((v, i) => {
                  const { display, title } = formatCell(v, fmt)
                  return (
                    <td
                      key={i}
                      title={title}
                      className={`${T.cellValue} ${columnWidth} ${bold ? T.footerValue + ' text-gray-800' : 'text-gray-700'}${title ? ' cursor-default' : ''}`}
                    >
                      {display}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default SummaryTable
