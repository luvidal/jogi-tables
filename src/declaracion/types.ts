import type { ColorScheme } from '../common/colors'

export interface DeclaracionColumn {
  key: string
  label: string
}

export interface DeclaracionRow {
  key: string
  label: string
  /** Whether this row should be included in the sum total */
  summed?: boolean
}

export interface DeclaracionTableProps {
  columns: DeclaracionColumn[]
  rows: DeclaracionRow[]
  /** Row data: rows × columns matrix. data[rowKey][colKey] = value */
  data: Record<string, Record<string, number | null>>
  /** Total row config. When provided, shows a sum row at the bottom using only `summed` rows. */
  totalLabel?: string
  formatCurrency: (value: number) => string
  colorScheme?: ColorScheme
  sourceFileIds?: string[]
  onViewSource?: (fileIds: string[]) => void
}
