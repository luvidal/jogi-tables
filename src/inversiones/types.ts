import type { SoftDeletable } from '../common/softdeletetypes'

export type InversionRow = {
  id: string
  institucion: string
  tipo: string
  monto: number | null
  fecha: string
} & SoftDeletable

export interface InversionesTableProps {
  rows: InversionRow[]
  onRowsChange: (rows: InversionRow[]) => void
  formatCurrency?: (value: number | null | undefined) => string
  colorScheme?: import('../common/colors').ColorScheme
  /** @deprecated Use colorScheme instead */
  headerBg?: string
  /** @deprecated Use colorScheme instead */
  headerText?: string
  title?: React.ReactNode
}
