export type VehiculoRow = {
  id: string
  marca: string
  modelo: string
  monto: number | null
  anio: number | null
}

export interface VehiculosTableProps {
  rows: VehiculoRow[]
  onRowsChange: (rows: VehiculoRow[]) => void
  formatCurrency?: (value: number | null | undefined) => string
  headerBg?: string
  headerText?: string
  emptyMessage?: string
  addLabel?: string
}
