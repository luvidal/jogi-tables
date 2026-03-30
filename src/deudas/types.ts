import type { SoftDeletable } from '../common/softdeletetypes'

export type DeudaRow = {
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

export interface DeudasTableProps {
  rows: DeudaRow[]
  onRowsChange: (rows: DeudaRow[]) => void
  formatCurrency?: (value: number | null | undefined) => string
  ufValue?: number | null
  castigo?: number
  colorScheme?: import('../common/colors').ColorScheme
  /** @deprecated Use colorScheme instead */
  headerBg?: string
  /** @deprecated Use colorScheme instead */
  headerText?: string
  onViewSource?: (fileIds: string[]) => void
}
