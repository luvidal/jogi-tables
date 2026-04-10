// RentaTable
export { default } from './renta'
export type { Month, RowData, RowType, RentaTableProps, ReliquidacionBreakdown } from './renta/types'
export { generateLastNMonths } from './renta/helpers'

// BoletasTable
export { default as BoletasTable } from './boletas'
export type { BoletaMonth, BoletasTableProps } from './boletas'

// FinalResultsCompact
export { default as FinalResultsCompact } from './finalresults'
export type { FinalResultsCompactProps, FinalResultsValues, CodeudorIncomeInfo, PromptOptions } from './finalresults'

// CrudTable (generic column-driven CRUD table — universal engine for all asset-type tables)
export { default as CrudTable } from './assets/assettable'
// AssetTable (alias for CrudTable — backward compatibility)
export { default as AssetTable } from './assets/assettable'
export type { ColumnDef, AssetTableProps, AssetRow, TablePreset } from './assets/types'

// ActivosSummary
export { default as ActivosSummary } from './activossummary'
export type { ActivosSummaryItem, ActivosSummaryProps } from './activossummary'

// SummaryTable
export { default as SummaryTable } from './summary'
export type { SummaryRow, SummaryRowType, SummaryRowFormat, SummaryTableProps } from './summary/types'

// DeclaracionTable
export { default as DeclaracionTable } from './declaracion'
export type { DeclaracionColumn, DeclaracionRow, DeclaracionTableProps } from './declaracion/types'

// BalanceTable
export { default as BalanceTable } from './balance'
export type { BalanceRow, BalanceTableProps } from './balance/types'

// ColorScheme
export { DEFAULT_SCHEME, resolveColors } from './common/colors'
export type { ColorScheme } from './common/colors'

// Cell origin
export { ORIGIN_CLASSES } from './common/cellorigin'
export type { CellOrigin } from './common/cellorigin'

// Common
export { default as EditableCell } from './common/editablecell'
export { default as EditableField } from './common/editablefield'
export { default as DeleteDialog } from './common/deletedialog'
export { default as RecycleBin } from './common/recyclebin'
export { useSoftDelete } from './common/usesoftdelete'
export type { SoftDeletable } from './common/softdeletetypes'
export { default as TableShell, SourceIcon } from './common/tableshell'
export type { TableShellProps } from './common/tableshell'
export { applyAutoConversions, applyAutoCompute, buildUfPair } from './common/autoconvert'
export type { AutoConvertRule, AutoComputeRule, SideEffect } from './common/autoconvert'
export { defaultFormatCurrency, displayCurrency, displayCurrencyCompact, generateId, formatDeletedDate, MONTH_LABELS } from './common/utils'
export { default as ClickableHeader } from './common/clickableheader'
export { default as CollapsibleSection } from './common/collapsiblesection'
export type { CollapsibleSectionProps } from './common/collapsiblesection'
export { useCollapsedState } from './common/usecollapsedstate'
