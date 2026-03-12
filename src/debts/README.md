# DebtsTable

Financial debt entries table with accordion layout, editable cells, and late payment tracking.

## Features

- **Accordion**: Collapsible header with total debt summary
- **Editable cells**: Inline editing for numerical columns (total, current, late payments)
- **Late payment columns**: Optional 30-59, 60-89, 90+ day columns (shown only when data exists)
- **Add/delete rows**: Add new debt entries, remove existing ones
- **Summary header**: Displays RUT, nombre, total debt, and report date

## Files

| File | Description |
|------|-------------|
| `index.tsx` | DebtsTable component with `DebtEntry` and `DebtsTableProps` types |

## Dependencies

- `../common/tableshell` — `TableShell` accordion wrapper + `SourceIcon` (see [Adding a New Table](#adding-a-new-table))
- `../common/editablecell` — inline-editable cells for numerical values
- `../common/styles` — `T` object for Tailwind classes

## Props

```ts
interface DebtsTableProps {
    title: string
    entries: DebtEntry[]
    onEntriesChange: (entries: DebtEntry[]) => void
    summary?: { rut?: string; nombre?: string; deuda_total?: number; fecha_informe?: string }
    headerBg?: string
    headerText?: string
    defaultCollapsed?: boolean
    forceExpanded?: boolean
    formatCurrency?: (value: number | null | undefined) => string
    sourceFileIds?: string[]
    onViewSource?: (fileIds: string[]) => void
}
```
