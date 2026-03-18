// MonthlyTable
export { default } from './monthly'
export type { Month, RowData, RowType, MonthlyTableProps } from './monthly/types'
export { generateLastNMonths } from './monthly/helpers'

// DebtsTable
export { default as DebtsTable } from './debts'
export type { DebtEntry, DebtsTableProps } from './debts'

// BoletasTable
export { default as BoletasTable } from './boletas'
export type { BoletaMonth, BoletasTableProps } from './boletas'

// TributarioTable
export { default as TributarioTable } from './tributario'
export type { TributarioEntry, TributarioTableProps } from './tributario'

// AssetTable
export { default as AssetTable } from './assets'
export type { AssetRowData, AssetTableProps } from './assets'

// ReportTable
export { default as ReportTable } from './reporttable'
export type { ReportTableProps, Column } from './reporttable'

// FinalResultsCompact
export { default as FinalResultsCompact } from './finalresults'
export type { FinalResultsCompactProps, FinalResultsValues, CodeudorIncomeInfo, PromptOptions } from './finalresults'

// VehiculosTable
export { default as VehiculosTable } from './vehiculos'
export type { VehiculoRow, VehiculosTableProps } from './vehiculos/types'

// InversionesTable
export { default as InversionesTable } from './inversiones'
export type { InversionRow, InversionesTableProps } from './inversiones/types'

// DeudasConsumoTable
export { default as DeudasConsumoTable } from './deudasconsumo'
export type { DeudaConsumoRow, DeudasConsumoTableProps } from './deudasconsumo/types'

// BienesRaicesTable
export { default as BienesRaicesTable } from './bienesraices'
export type { BienRaizRow, BienesRaicesTableProps } from './bienesraices/types'

// ActivosSummary
export { default as ActivosSummary } from './activossummary'
export type { ActivosSummaryItem, ActivosSummaryProps } from './activossummary'

// Common
export { default as DeleteDialog } from './common/deletedialog'
export { default as RecycleBin } from './common/recyclebin'
export { useSoftDelete } from './common/usesoftdelete'
export type { SoftDeletable } from './common/softdeletetypes'
export { default as TableShell, SourceIcon } from './common/tableshell'
export type { TableShellProps } from './common/tableshell'
export { applyAutoConversions, applyAutoCompute } from './common/autoconvert'
export type { AutoConvertRule, AutoComputeRule } from './common/autoconvert'
export { defaultFormatCurrency, displayCurrency, displayCurrencyCompact } from './common/utils'
