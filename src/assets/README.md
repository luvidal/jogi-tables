# AssetTable

Generic column-driven CRUD table used by VehiculosTable, InversionesTable, and PropiedadesTable.

## Usage

```tsx
import AssetTable from '../assets/assettable'
import type { ColumnDef } from '../assets/types'

const columns: ColumnDef[] = [
    { key: 'name', label: 'Name', type: 'text', width: '160px', isLabel: true },
    { key: 'amount', label: 'Amount', type: 'currency', width: '120px' },
]

<AssetTable columns={columns} rows={rows} onRowsChange={setRows} idPrefix="item" />
```

## Column Definition

| Property | Type | Description |
|----------|------|-------------|
| `key` | `string` | Field key on the row object |
| `label` | `string` | Column header text |
| `type` | `'text' \| 'currency' \| 'number'` | Determines cell rendering |
| `width` | `string` | CSS width |
| `align` | `'left' \| 'right' \| 'center'` | Cell alignment (default: left for text, right for currency/number) |
| `placeholder` | `string` | Input placeholder text |
| `isLabel` | `boolean` | First column with delete button |
| `ufPair` | `string` | Key of paired UF/CLP field (enables toggle) |
| `autoComputedClass` | `(row) => string` | CSS class for auto-computed values |

## UF/$ Toggle

When `ufValue` is provided and at least one column has `ufPair`, a CurrencyToggle appears in the top-right corner. In CLP mode, columns with `ufPair` switch to show the paired field with `type: 'currency'`.

## Features

- Soft-delete with recycle bin (shows deleted row values)
- Grid keyboard navigation (arrow keys, Tab, Enter, Escape)
- Add row with Enter key or value entry
- Auto-conversion and auto-compute rules (for UF/CLP)
- Footer totals for all numeric columns
