import type { SoftDeletable } from '../common/softdeletetypes'

export type BienRaizRow = {
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

export interface BienesRaicesTableProps {
  rows: BienRaizRow[]
  onRowsChange: (rows: BienRaizRow[]) => void
  formatCurrency?: (value: number | null | undefined) => string
  ufValue?: number | null
  capRate?: number
  factorDescuento?: number
  headerBg?: string
  headerText?: string
  onViewSource?: (fileIds: string[]) => void
  title?: React.ReactNode
}
