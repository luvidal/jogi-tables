// RentaTable
export { default } from './renta'
export type { Month, RowData, RowType, RentaTableProps, ReliquidacionBreakdown } from './renta/types'
export { generateLastNMonths } from './renta/helpers'

// DeudasTable
export { default as DeudasTable } from './deudas'
export type { DebtEntry, DeudasTableProps } from './deudas'

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

// DeudasConsumoTable
export { default as DeudasConsumoTable } from './deudasconsumo'
export type { DeudaConsumoRow, DeudasConsumoTableProps } from './deudasconsumo/types'

// PropiedadesTable
export { default as PropiedadesTable } from './propiedades'
export type { PropiedadRow, PropiedadesTableProps, HipotecarioOption } from './propiedades/types'

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
