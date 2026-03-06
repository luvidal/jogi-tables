// Row types: 'add' adds to total, 'subtract' subtracts from total
// Aliases for backward compatibility: income=add, deduction=subtract, debt=subtract
export type RowType = 'add' | 'subtract' | 'income' | 'deduction' | 'debt'

export type RowData = {
    id: string
    label: string
    type: RowType
    values: Record<string, number | null>  // monthId -> value
    sourceFileId?: string  // Source file for this specific row
    isDefault?: boolean    // Just for initial suggestions, doesn't affect behavior
    // Grouping
    groupId?: string       // ID of parent group this row belongs to
    isGroup?: boolean      // true = group header (values are computed, not editable)
    collapsed?: boolean    // group headers only: whether children are hidden
    // Ordering
    order?: number         // explicit sort position within its type section
    // Soft-delete
    deletedAt?: string     // ISO timestamp — presence means row is in recycle bin
    deletionReason?: string // User-provided reason for deletion
}

export type Month = {
    id: string          // "2024-11" format
    label: string       // "NOV" formatted
    sourceFileId?: string  // For traceability per month
}

export interface MonthlyTableProps {
    // Header
    title: string                    // "Renta Líquida Titular", "Deudas Mensuales"

    // Months - either provide count (auto-generates last N months) or explicit array
    months?: number | Month[]        // Default: 3 (last 3 months)

    // Rows (data)
    rows: RowData[]
    onRowsChange: (rows: RowData[]) => void

    // Sections - allows grouping rows with different add placeholders
    // If not provided, will auto-detect from row types
    sections?: Array<{
        type: RowType
        placeholder: string
    }>

    // Appearance - matches accordion section colors
    headerBg?: string       // e.g., 'bg-emerald-50' from section colors
    headerText?: string     // e.g., 'text-emerald-700' from section colors

    // Behavior
    defaultCollapsed?: boolean
    forceExpanded?: boolean

    // Formatting
    formatValue?: (value: number | null | undefined) => string

    // Optional: Custom total calculation (default: sum add/income rows, subtract subtract/deduction/debt rows)
    calculateTotal?: (monthId: string, rows: RowData[]) => number

    // Source file viewing
    sourceFileIds?: string[]  // Source files for the whole table (shown in header)
    onViewSource?: (fileIds: string[]) => void
}

export type SectionDef = { type: RowType; placeholder: string }
