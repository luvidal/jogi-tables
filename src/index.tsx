// RentaTable
export { default } from './renta'
export type { Month, RowData, RowType, RentaTableProps, ReliquidacionBreakdown } from './renta/types'
export { generateLastNMonths } from './renta/helpers'

// DeudasTable
export { default as DeudasTable } from './deudas'
export type { DeudaRow, DeudasTableProps } from './deudas/types'

// BoletasTable
export { default as BoletasTable } from './boletas'
export type { BoletaMonth, BoletasTableProps } from './boletas'

// TributarioTable
export { default as TributarioTable } from './tributario'
export type { TributarioEntry, TributarioTableProps } from './tributario'

// FinalResultsCompact
export { default as FinalResultsCompact } from './finalresults'
export type { FinalResultsCompactProps, FinalResultsValues, CodeudorIncomeInfo, PromptOptions } from './finalresults'

// VehiculosTable
export { default as VehiculosTable } from './vehiculos'
export type { VehiculoRow, VehiculosTableProps } from './vehiculos/types'

// InversionesTable
export { default as InversionesTable } from './inversiones'
export type { InversionRow, InversionesTableProps } from './inversiones/types'

// PropiedadesTable
export { default as PropiedadesTable } from './propiedades'
export type { PropiedadRow, PropiedadesTableProps } from './propiedades/types'

// AssetTable (generic column-driven CRUD table used by vehiculos, inversiones, propiedades)
export { default as AssetTable } from './assets/assettable'
export type { ColumnDef, AssetTableProps } from './assets/types'

// ActivosSummary
export { default as ActivosSummary } from './activossummary'
export type { ActivosSummaryItem, ActivosSummaryProps } from './activossummary'

// SummaryTable
export { default as SummaryTable } from './summary'
export type { SummaryRow, SummaryRowType, SummaryRowFormat, SummaryTableProps } from './summary/types'

// Common
export { default as EditableCell } from './common/editablecell'
export { default as DeleteDialog } from './common/deletedialog'
export { default as RecycleBin } from './common/recyclebin'
export { useSoftDelete } from './common/usesoftdelete'
export type { SoftDeletable } from './common/softdeletetypes'
export { default as TableShell, SourceIcon } from './common/tableshell'
export type { TableShellProps } from './common/tableshell'
export { applyAutoConversions, applyAutoCompute } from './common/autoconvert'
export type { AutoConvertRule, AutoComputeRule } from './common/autoconvert'
export { defaultFormatCurrency, displayCurrency, displayCurrencyCompact, generateId, formatDeletedDate, MONTH_LABELS } from './common/utils'
export { default as CurrencyToggle } from './common/currencytoggle'
