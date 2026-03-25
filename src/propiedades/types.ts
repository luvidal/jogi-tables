import type { SoftDeletable } from '../common/softdeletetypes'

export type PropiedadRow = {
  id: string
  direccion: string
  comuna: string
  valor_uf: number | null
  valor_pesos: number | null
  arriendo_real: number | null
  arriendo_futuro: number | null
  institucion: string
  tipo_deuda: string
  saldo_deuda_uf: number | null
  saldo_deuda_pesos: number | null
  monto_cuota: number | null
  cuotas_pagadas: number | null
  cuotas_total: number | null
  sourceFileId?: string
} & SoftDeletable

export interface HipotecarioOption {
  entidad: string
  saldo_pesos: number | null
  saldo_uf: number | null
  monto_cuota: number | null
}

export interface PropiedadesTableProps {
  rows: PropiedadRow[]
  onRowsChange: (rows: PropiedadRow[]) => void
  formatCurrency?: (value: number | null | undefined) => string
  ufValue?: number | null
  capRate?: number
  factorDescuento?: number
  headerBg?: string
  headerText?: string
  onViewSource?: (fileIds: string[]) => void
  title?: React.ReactNode
  /** CMF hipotecario entries available for matching to properties via dropdown */
  hipotecarioOptions?: HipotecarioOption[]
}
