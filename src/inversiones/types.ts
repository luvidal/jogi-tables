export type InversionRow = {
  id: string
  institucion: string
  tipo: string
  monto: number | null
  fecha: string
}

export interface InversionesTableProps {
  rows: InversionRow[]
  onRowsChange: (rows: InversionRow[]) => void
  formatCurrency?: (value: number | null | undefined) => string
  headerBg?: string
  headerText?: string
  emptyMessage?: string
  addLabel?: string
}
