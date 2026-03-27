import type { SoftDeletable } from '../common/softdeletetypes'

export type PropiedadRow = {
  id: string
  direccion: string
  comuna: string
  valor_uf: number | null
  valor_pesos: number | null
  arriendo_real: number | null
  arriendo_futuro: number | null
} & SoftDeletable

export interface PropiedadesTableProps {
  rows: PropiedadRow[]
  onRowsChange: (rows: PropiedadRow[]) => void
  formatCurrency?: (value: number | null | undefined) => string
  ufValue?: number | null
  capRate?: number
  factorDescuento?: number
  headerBg?: string
  headerText?: string
  title?: React.ReactNode
}
