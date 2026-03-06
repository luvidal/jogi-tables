# AssetTable

Editable asset table with description column and total calculation.

## Features

- **Editable cells**: Inline editing for label, description, and value
- **Add/delete rows**: Add new assets, remove existing ones
- **Total row**: Calculated sum of all asset values
- **Hover interactions**: Delete button appears on row hover

## Files

| File | Description |
|------|-------------|
| `index.tsx` | AssetTable component with `AssetRowData` and `AssetTableProps` types |

## Dependencies

- `../common/editablecell` — inline-editable cells for values
- `../common/styles` — `T` object for Tailwind classes

## Props

```ts
interface AssetTableProps {
    rows: AssetRowData[]
    onRowsChange: (rows: AssetRowData[]) => void
    formatCurrency: (value: number | null | undefined) => string
    placeholder?: string         // Add row placeholder (default: 'Agregar activo...')
    onViewSource?: (fileIds: string[]) => void
}
```
