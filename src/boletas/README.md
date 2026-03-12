# BoletasTable

Boletas de honorarios table with monthly breakdown (read-only display with accordion layout).

## Features

- **Accordion**: Collapsible header with totals summary
- **Monthly breakdown**: Rows per month with boletas count, bruto, retencion, liquido
- **Totals row**: Summary of all months at the bottom
- **Read-only**: No inline editing (display only)
- **Source file viewing**: Eye icon for traceability

## Files

| File | Description |
|------|-------------|
| `index.tsx` | BoletasTable component with `BoletaMonth` and `BoletasTableProps` types |

## Dependencies

- `../common/tableshell` — `TableShell` accordion wrapper + `SourceIcon` (see [Adding a New Table](#adding-a-new-table))
- `../common/utils` — `displayCurrencyCompact` for currency formatting
- `../common/styles` — `T` object for Tailwind classes

## Props

```ts
interface BoletasTableProps {
    title: string
    months: BoletaMonth[]
    totales?: {
        boletas_vigentes?: number
        honorario_bruto?: number
        retencion_terceros?: number
        retencion_contribuyente?: number
        total_liquido?: number
    }
    headerBg?: string
    headerText?: string
    defaultCollapsed?: boolean
    forceExpanded?: boolean
    sourceFileIds?: string[]
    onViewSource?: (fileIds: string[]) => void
}
```
