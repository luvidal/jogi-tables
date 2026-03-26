import type { SoftDeletable } from '../common/softdeletetypes'

export type DeudaConsumoRow = {
  id: string
  institucion: string
  tipo_deuda: string
  saldo_deuda_uf: number | null
  saldo_deuda_pesos: number | null
  monto_cuota: number | null
  cuota_estimated?: boolean
  castigo_pct?: number
  cuota_source_file_id?: string
  cuotas_pagadas: number | null
  cuotas_total: number | null
  sourceFileId?: string
} & SoftDeletable

export interface DeudasConsumoTableProps {
  rows: DeudaConsumoRow[]
  onRowsChange: (rows: DeudaConsumoRow[]) => void
  formatCurrency?: (value: number | null | undefined) => string
  ufValue?: number | null
  castigo?: number
  headerBg?: string
  headerText?: string
  onViewSource?: (fileIds: string[]) => void
}
