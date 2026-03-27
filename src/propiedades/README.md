# PropiedadesTable

Thin wrapper around `AssetTable` for property assets with UF/$ toggle.

## Columns

| Key | Label | Type | Notes |
|-----|-------|------|-------|
| `direccion` | Dirección | text (label) | |
| `comuna` | Comuna | text | |
| `valor_uf` | Valor UF | number | Paired with `valor_pesos` via UF toggle |
| `arriendo_real` | Arr. Real $ | currency | |
| `arriendo_futuro` | Arr. Fut $ | currency | Auto-computed from `valor_uf * capRate / 12 * (1 - factorDescuento) * ufValue` |

## UF/$ Toggle

When `ufValue` is provided, a CurrencyToggle button appears. Switching to CLP mode replaces `valor_uf` with `valor_pesos` (auto-converted). Auto-computed values render in italic amber.

## Props

```ts
interface PropiedadesTableProps {
    rows: PropiedadRow[]
    onRowsChange: (rows: PropiedadRow[]) => void
    formatCurrency?: (value: number | null | undefined) => string
    ufValue?: number | null    // enables UF/$ toggle + auto-conversions
    capRate?: number           // default: 0.05
    factorDescuento?: number   // default: 0.10
    headerBg?: string          // default: 'bg-amber-50'
    headerText?: string        // default: 'text-amber-700'
    title?: React.ReactNode
}
```

## Dependencies

- `../assets/assettable` — `AssetTable` generic CRUD table
- `../common/autoconvert` — `applyAutoConversions`, `applyAutoCompute` for UF↔CLP
