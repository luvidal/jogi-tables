import type { SoftDeletable } from '../common/softdeletetypes'

export type VehiculoRow = {
  id: string
  marca: string
  modelo: string
  monto: number | null
  anio: number | null
} & SoftDeletable

export interface VehiculosTableProps {
  rows: VehiculoRow[]
  onRowsChange: (rows: VehiculoRow[]) => void
  formatCurrency?: (value: number | null | undefined) => string
  headerBg?: string
  headerText?: string
  title?: React.ReactNode
}
