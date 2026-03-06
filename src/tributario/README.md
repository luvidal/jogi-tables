# TributarioTable

Tributario info table displaying carpeta tributaria and balance anual entries (read-only with accordion layout).

## Features

- **Accordion**: Collapsible header
- **Two source types**: Carpeta tributaria (RUT, nombre, actividades) and balance anual (empresa, year, ingresos, egresos)
- **Read-only**: No inline editing (display only)
- **Source file viewing**: Eye icon per entry for traceability

## Files

| File | Description |
|------|-------------|
| `index.tsx` | TributarioTable component with `TributarioEntry` and `TributarioTableProps` types |

## Dependencies

- `../common/utils` — `displayCurrencyCompact` for currency formatting
- `../common/styles` — `T` object for Tailwind classes

## Props

```ts
interface TributarioTableProps {
    title: string
    entries: TributarioEntry[]
    headerBg?: string
    headerText?: string
    defaultCollapsed?: boolean
    forceExpanded?: boolean
    sourceFileIds?: string[]
    onViewSource?: (fileIds: string[]) => void
}
```
