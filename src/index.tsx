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
