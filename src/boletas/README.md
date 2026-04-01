# BoletasTable

Boletas de honorarios table with monthly breakdown (read-only display).

## Features

- **Header**: Colored bar with per-month liquido totals
- **Monthly breakdown**: Rows per metric (Honor. Bruto, Retención, Boletas Vig.)
- **Excludable months**: Columns can be dimmed/toggled via `excludedMonths` + `onToggleMonth`
- **Read-only**: No inline editing (display only)
- **Source file viewing**: Eye icon for traceability

## Files

| File | Description |
|------|-------------|
| `index.tsx` | BoletasTable component with `BoletaMonth` and `BoletasTableProps` types |

## Dependencies

- `../common/tableshell` — `TableShell` single-table wrapper + `SourceIcon`
- `../common/utils` — `displayCurrencyCompact` for currency formatting
- `../common/styles` — `T` object for Tailwind classes

## Props

```ts
interface BoletasTableProps {
    title: string
    months: BoletaMonth[]
    colorScheme?: ColorScheme
    sourceFileIds?: string[]
    onViewSource?: (fileIds: string[]) => void
    excludedMonths?: string[]
    onToggleMonth?: (periodo: string) => void
}
```
