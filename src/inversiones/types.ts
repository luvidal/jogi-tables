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
  headerBg?: string
  headerText?: string
  title?: React.ReactNode
}
