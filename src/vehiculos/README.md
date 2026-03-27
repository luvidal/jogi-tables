# VehiculosTable

Thin wrapper around `AssetTable` for vehicle assets.

## Columns

| Key | Label | Type |
|-----|-------|------|
| `marca` | Marca | text (label) |
| `modelo` | Modelo | text |
| `monto` | Monto $ | currency |
| `anio` | Año | number (center) |

## Props

```ts
interface VehiculosTableProps {
    rows: VehiculoRow[]
    onRowsChange: (rows: VehiculoRow[]) => void
    formatCurrency?: (value: number | null | undefined) => string
    headerBg?: string     // default: 'bg-slate-50'
    headerText?: string   // default: 'text-slate-700'
    title?: React.ReactNode
}
```

## Dependencies

- `../assets/assettable` — `AssetTable` generic CRUD table
