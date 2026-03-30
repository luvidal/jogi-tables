import type { ReactNode } from 'react'

export type SummaryRowType = 'subheader' | 'data' | 'total' | 'grandtotal'
export type SummaryRowFormat = 'currency' | 'percent' | 'integer'

export interface SummaryRow {
  label: string
  values: (number | null)[]
  type: SummaryRowType
  format?: SummaryRowFormat
  fieldKey?: string
}

export interface SummaryTableProps {
  columnHeaders: string[]
  rows: SummaryRow[]
  colorScheme?: import('../common/colors').ColorScheme
  /** Extra column rendered before data columns (e.g., castigo input) */
  extraColumn?: {
    header: string
    width?: string
    render: (row: SummaryRow, index: number) => ReactNode
  }
  /** Rendered after the label text (e.g., warning icon) */
  renderLabelSuffix?: (row: SummaryRow, index: number) => ReactNode
  /** Column width for data columns */
  columnWidth?: string
}
