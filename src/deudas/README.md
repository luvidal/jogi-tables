# DeudasTable

Debt tracking table with UF auto-conversion, castigo (penalty) auto-compute, row selection, and drag reorder.

## Features

- **Auto-conversion**: UF↔CLP bidirectional when `ufValue` is provided
- **Castigo auto-compute**: `monto_cuota` auto-calculated for líneas/TC rows as `saldo_deuda_pesos * castigo`
- **Row selection**: Cmd/Ctrl+click for multi-select, bulk delete
- **Drag reorder**: GripVertical handle for manual ordering
- **Soft-delete**: Recycle bin with restore

## Columns

| Key | Label | Type |
|-----|-------|------|
| `institucion` | Institución | text (label) |
| `tipo_deuda` | Tipo Deuda | text |
| `saldo_deuda_uf` | Saldo UF | number |
| `saldo_deuda_pesos` | Saldo $ | currency (auto-converted from UF) |
| `monto_cuota` | Cuota $ | currency (auto-computed for líneas/TC) |
| `castigo_pct` | % | number (editable penalty rate) |
| `cuotas_pagadas/cuotas_total` | Cuotas | number pair |

## Props

```ts
interface DeudasTableProps {
    rows: DeudaRow[]
    onRowsChange: (rows: DeudaRow[]) => void
    formatCurrency?: (value: number | null | undefined) => string
    ufValue?: number | null
    castigo?: number           // default: 0.05
    headerBg?: string          // default: 'bg-rose-50'
    headerText?: string        // default: 'text-rose-700'
    onViewSource?: (fileIds: string[]) => void
}
```

## Dependencies

- `../common/styles` — `T` object for Tailwind classes
- `../common/editablecell` — inline-editable cells
- `../common/userowhover` — `useRowHover()` for row hover state
- `../common/usegridkeyboard` — keyboard navigation
- `../common/autoconvert` — `applyAutoConversions`, `applyAutoCompute`
- `../common/usesoftdelete` — soft-delete state management
- `../common/recyclebin` — `RecycleBin` footer
- `../common/deletedialog` — `DeleteDialog` confirmation modal
- `../common/usedragreorder` — drag-and-drop reorder
