import type { SoftDeletable } from '../common/softdeletetypes'
import type { AutoConvertRule, AutoComputeRule } from '../common/autoconvert'

export type AssetRow = { id: string } & SoftDeletable & Record<string, unknown>

export interface ColumnDef {
    key: string
    label: string
    type: 'text' | 'currency' | 'number'
    align?: 'left' | 'right' | 'center'
    placeholder?: string
    isLabel?: boolean
    /** Key of the paired UF/CLP field shown when currency toggle switches */
    ufPair?: string
    /** Return class to apply when cell value is auto-computed */
    autoComputedClass?: (row: Record<string, unknown>) => string
}

export interface AssetTableProps<T extends AssetRow = AssetRow> {
    columns: ColumnDef[]
    rows: T[]
    onRowsChange: (rows: T[]) => void
    idPrefix: string
    addPlaceholder?: string
    formatCurrency?: (value: number | null | undefined) => string
    colorScheme?: import('../common/colors').ColorScheme
    /** @deprecated Use colorScheme instead */
    headerBg?: string
    /** @deprecated Use colorScheme instead */
    headerText?: string
    title?: React.ReactNode
    /** UF value — enables UF/$ toggle when columns have ufPair */
    ufValue?: number | null
    /** Auto-conversion rules (UF↔CLP) */
    conversionRules?: AutoConvertRule[]
    /** Auto-compute rules */
    computeRules?: AutoComputeRule[]
}
