# Common

Shared components, hooks, and utilities used across all table components. Everything in this folder is designed to ensure visual and behavioral consistency across tables.

## Files

| File | Description |
|------|-------------|
| `styles.ts` | `T` object with Tailwind class tokens for consistent table styling (incl. `rowBorder`, `rowHover`) |
| `utils.ts` | Currency formatting (`displayCurrency`, `displayCurrencyCompact`, `defaultFormatCurrency`), `generateId`, `formatDeletedDate`, `MONTH_LABELS` |
| `editablecell.tsx` | Inline-editable table cell with currency, number, text, and percent modes |
| `currencytoggle.tsx` | `CurrencyToggle` — UF/$ toggle button used by AssetTable when UF columns exist |
| `tableshell.tsx` | `TableShell` accordion wrapper + `SourceIcon` for collapsible table sections |
| `deletebutton.tsx` | `DeleteRowButton` — red X button with opacity-on-hover transition |
| `viewsourcebutton.tsx` | `ViewSourceButton` — row-level eye icon for source file viewing |
| `userowhover.ts` | `useRowHover()` — hover state tracking for table rows (accepts string or number IDs) |
| `usefieldupdate.ts` | `useFieldUpdate()` — generic row field update + remove logic |
| `usegridkeyboard.ts` | `useGridKeyboard()` — grid keyboard navigation (arrow keys, Tab, Enter, Escape) for EditableCell grids |
| `usemobile.ts` | `useIsMobile()` media query hook (max-width: 639px) |
| `usesoftdelete.ts` | `useSoftDelete()` — generic soft-delete hook with confirm/cancel/restore state management |
| `softdeletetypes.ts` | `SoftDeletable` type — `{ deletedAt?: string; deletionReason?: string }` mixin for row types |
| `deletedialog.tsx` | `DeleteDialog` — confirmation modal with reason textarea (portal to body) |
| `recyclebin.tsx` | `RecycleBin` — table-based collapsible footer showing soft-deleted rows with restore button. Optional `renderCells` callback for extra columns (e.g., monthly values in RentaTable) |

## Usage

All tables import shared resources from this folder:

```ts
import { T } from '../common/styles'
import EditableCell from '../common/editablecell'
import DeleteRowButton from '../common/deletebutton'
import ViewSourceButton from '../common/viewsourcebutton'
import EmptyStateRow from '../common/emptystaterow'
import TableShell, { SourceIcon } from '../common/tableshell'
import { useRowHover } from '../common/userowhover'
import { useFieldUpdate } from '../common/usefieldupdate'
import { useGridKeyboard } from '../common/usegridkeyboard'
import { useSoftDelete } from '../common/usesoftdelete'
import DeleteDialog from '../common/deletedialog'
import RecycleBin from '../common/recyclebin'
import { defaultFormatCurrency, displayCurrencyCompact, generateId, formatDeletedDate, MONTH_LABELS } from '../common/utils'
import CurrencyToggle from '../common/currencytoggle'
```

### TableShell

Shared accordion wrapper that manages collapse state, header click behavior, keyboard accessibility, and content show/hide for all collapsible table sections. Accepts a `renderHeader` render prop for custom header content and optional `renderAfterContent` for footers (e.g., recycle bin, dialogs).

Key props:
- `headerBg` — header background color class
- `defaultCollapsed`, `forceExpanded` — collapse behavior
- `disableToggle` — prevents toggle (e.g., during row selection in MonthlyTable)
- `contentClassName`, `contentProps` — extra attributes on the content wrapper

### SourceIcon

Small reusable eye icon button for source file viewing. Renders nothing if no `fileIds` or `onViewSource` provided. Used in table headers and row hover states.

## Adding a New Table

Every collapsible table follows the same pattern. Use `TableShell` for the accordion wrapper and provide your own header content + body.

### Minimal template

```tsx
import React from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { T } from '../common/styles'
import TableShell, { SourceIcon } from '../common/tableshell'

interface MyTableProps {
    title: string
    // ... your data props
    headerBg?: string
    headerText?: string
    defaultCollapsed?: boolean
    forceExpanded?: boolean
    sourceFileIds?: string[]
    onViewSource?: (fileIds: string[]) => void
}

const MyTable = ({
    title,
    headerBg = 'bg-gray-100',
    headerText = 'text-gray-700',
    defaultCollapsed = false,
    forceExpanded = false,
    sourceFileIds,
    onViewSource,
}: MyTableProps) => {
    return (
        <TableShell
            headerBg={headerBg}
            headerText={headerText}
            defaultCollapsed={defaultCollapsed}
            forceExpanded={forceExpanded}
            renderHeader={({ isExpanded }) => (
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                        <span className={`${headerText} ${T.headerTitle}`}>{title}</span>
                        <SourceIcon fileIds={sourceFileIds} onViewSource={onViewSource} className={headerText} />
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Your header stats here */}
                        {!forceExpanded && (
                            isExpanded
                                ? <ChevronUp size={20} className={headerText} />
                                : <ChevronDown size={20} className={headerText} />
                        )}
                    </div>
                </div>
            )}
        >
            {/* Your table content here */}
            <div className="overflow-x-auto">
                <table className={T.table} style={{ tableLayout: 'fixed' }}>
                    <thead>...</thead>
                    <tbody>...</tbody>
                </table>
            </div>
        </TableShell>
    )
}
```

### Checklist

1. **Use `TableShell`** — never hand-roll the accordion wrapper. It handles collapse state, keyboard accessibility (Enter/Space), cursor styling, and `print:block`.
2. **Use `SourceIcon`** — for the header eye icon. It handles null checks internally.
3. **Use `T` styles** — for typography classes (`T.headerTitle`, `T.th`, `T.cellLabel`, etc.).
4. **Use `EditableCell`** — for any editable numeric cells. Supports `currency`, `number`, `text`, `percent` modes.
5. **Use `DeleteRowButton`** — for row delete buttons. Handles opacity transition, icon sizing (`sm`/`default`).
6. **Use `ViewSourceButton`** — for row-level source file viewing. Returns null when no source/handler.
7. **Use `EmptyStateRow`** — for empty table states. Pass `show`, `colSpan`, and `message`.
8. **Use `useRowHover()`** — for row hover state. Returns `getHoverProps(id)` (spread on `<tr>`) and `isHovered(id)`.
9. **Use `useFieldUpdate()`** — for generic row update/remove. Returns `updateField(id, field, value)` and `removeRow(id)`.
10. **Use `useGridKeyboard()`** — for keyboard navigation between EditableCell instances. Pass `visibleRowIds` and `colCount`. Wire `handleContainerKeyDown` + `tabIndex={0}` on the scroll container, and `focused`/`onCellFocus`/`onNavigate`/`requestEdit` on each EditableCell.
11. **Chevron placement** — each table controls where the chevron goes in its header. Always guard with `!forceExpanded`.
6. **Header layout** — use flexbox (`div.flex`) for simple headers, or `<table>` layout for column-aligned headers that match the body.
7. **`renderAfterContent`** — use this for content that sits after the collapsible area but inside the outer wrapper (e.g., MonthlyTable's recycle bin and dialogs).
8. **`disableToggle`** — set to `true` when the header has interactive elements that should prevent collapse (e.g., selection bar).
9. **Export from `index.tsx`** — add your component + types to the root `src/index.tsx`.
10. **Add a README** — create `src/mytable/README.md` documenting features, dependencies, and props.

### Reference implementations

- **Simple read-only**: `boletas/index.tsx` — flexbox header, no editing, no row state
- **Editable with CRUD**: `deudas/index.tsx` — table-layout header, editable cells, add/remove rows
- **Complex with extras**: `renta/index.tsx` — `disableToggle`, `contentProps`, `renderAfterContent`
- **Column-driven CRUD**: `assets/assettable.tsx` — generic `AssetTable`, no accordion (always expanded). Used by `vehiculos/`, `inversiones/`, `propiedades/` as thin config wrappers

## Consumers

- **styles.ts** — used by all tables (renta, deudas, boletas, tributario, assets)
- **editablecell.tsx** — used by renta (datarow, addrow), deudas, assets
- **tableshell.tsx** — used by renta, boletas, tributario
- **utils.ts** — used by renta (helpers), boletas, tributario, finalresults, assets, deudas, recyclebin
- **currencytoggle.tsx** — used by assets (when UF columns present)
- **recyclebin.tsx** — used by renta (with `renderCells` for month values), deudas, assets
- **userowhover.ts** — used by boletas, tributario, deudas, renta, assets
- **usemobile.ts** — used by editablecell
