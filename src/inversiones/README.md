# InversionesTable

Thin wrapper around `AssetTable` for investment assets.

## Columns

| Key | Label | Type |
|-----|-------|------|
| `institucion` | Institución | text (label) |
| `tipo` | Tipo Inversión | text |
| `monto` | Monto $ | currency |
| `fecha` | Fecha | text |

## Props

```ts
interface InversionesTableProps {
    rows: InversionRow[]
    onRowsChange: (rows: InversionRow[]) => void
    formatCurrency?: (value: number | null | undefined) => string
    headerBg?: string     // default: 'bg-emerald-50'
    headerText?: string   // default: 'text-emerald-700'
    title?: React.ReactNode
}
```

## Dependencies

- `../assets/assettable` — `AssetTable` generic CRUD table
