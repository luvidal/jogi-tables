# Code Deduplication & Consistency Plan

## Priority 1 — Bug fix

### 1a. `boletas/index.tsx` uses inline `useState` for hover instead of `useRowHover()`
- boletas tracks `hoveredRow` with `useState<number | null>(null)` and manual `onMouseEnter`/`onMouseLeave`
- Should use `useRowHover()` from `common/userowhover.ts` like vehiculos, inversiones, propiedades, tributario do
- **Effort**: low. **Impact**: consistency + less code.

### 1b. `deudas/index.tsx` uses inline `useState` for hover instead of `useRowHover()`
- Same issue. Uses `useState<string | null>(null)` for `hoveredRow`.
- **Effort**: low. **Impact**: consistency.

### 1c. `renta/index.tsx` uses inline `useState` for hover instead of `useRowHover()`
- Same pattern. `useState<string | null>(null)`.
- Renta passes `isHovered` as a prop to DataRow/GroupRow — need to verify `useRowHover` API fits (it uses `isHovered(id)` which works).
- **Effort**: low-medium (need to thread through child components).

---

## Priority 2 — Eliminate duplicated `formatCurrency` wrappers

Four files define an identical local wrapper:
```ts
const formatCurrency = (value: number | null | undefined): string => {
    return displayCurrencyCompact(value)
}
```
- `boletas/index.tsx:46-47`
- `tributario/index.tsx:45-46`
- `finalresults/index.tsx:43-44`

**Fix**: Export `formatCurrency` as a named alias from `common/utils.ts` (it's already exported as `defaultFormatCurrency` — but these wrappers call `displayCurrencyCompact` directly with no extra logic, so they're literally the same function). Replace all local wrappers with the import.

- **Effort**: very low. **Impact**: ~12 LOC removed, single source of truth.

---

## Priority 3 — Extract ID generation utility

Four files duplicate the same ID generation pattern:
```ts
id: `prefix_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
```
- `vehiculos/index.tsx:31` (prefix `vh`)
- `inversiones/index.tsx:31` (prefix `inv`)
- `propiedades/index.tsx:83` (prefix `br`)
- `deudas/index.tsx:99` (prefix `dc`)

**Fix**: Add to `common/utils.ts`:
```ts
export const generateId = (prefix: string) =>
    `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
```

- **Effort**: very low. **Impact**: ~4 LOC saved, single pattern, testable.

---

## Priority 4 — `formatDeletedDate` duplicated between recycle bins

`common/recyclebin.tsx:13-25` and `renta/recyclebin.tsx:15-27` have the **exact same** `formatDeletedDate` function.

**Fix**: Export from `common/utils.ts`, import in both files.

- **Effort**: very low. **Impact**: removes 13 LOC of duplication, single formatting rule.

---

## Priority 5 — `MONTH_LABELS` in boletas should move to common

`boletas/index.tsx:50-53` defines a `MONTH_LABELS` mapping (enero→Enero, etc.). `renta/helpers.ts:8` has `MONTH_NAMES` (abbreviated: ENE, FEB...) for a different purpose.

These are different things (full names vs 3-letter abbreviations), so no merge. But `MONTH_LABELS` should move to `common/utils.ts` since it could be reused by any component that receives month names in lowercase Spanish.

- **Effort**: very low. **Impact**: reusable month formatting.

---

## Priority 6 — Renta RecycleBin should extend common RecycleBin

The renta version adds:
- Monthly value columns alongside deleted rows
- Color-coded values (rose for subtract types)
- Table-based layout instead of simple div list

**Approach**: Add an optional `renderExtra` or `columns` slot to the common RecycleBin, so renta can inject its month columns without duplicating the entire component (toggle button, header, restore button, deleted-date formatting).

**Uncertain**: The layout difference (common uses `<div>` list, renta uses `<table>`) makes a simple slot approach harder. Two options:
1. Make common RecycleBin table-based always (with an optional `renderCells` callback for extra `<td>`s)
2. Keep two implementations but extract shared logic (`formatDeletedDate`, toggle button, restore button) into smaller primitives

Leaning toward option 1 since the table layout is more flexible.

- **Effort**: medium. **Impact**: eliminates the largest duplicated component (~50 LOC shared between the two).

---

## Priority 7 — `vehiculos` and `inversiones` are near-identical

These two components share ~90% structure:
- Same imports, same hook setup
- Same `addRow` pattern (just different field names)
- Same table layout (header → rows → add row → footer)
- Same footer total pattern
- Same RecycleBin + DeleteDialog wiring

**Approach options**:
1. **Config-driven generic table**: Create a `SimpleAssetTable` that accepts column definitions. Both vehiculos and inversiones become thin config wrappers.
2. **Keep separate but extract shared row/footer rendering**: Less ambitious but still reduces duplication.

Leaning toward option 1 — the tables are so similar that a column-config approach would work cleanly.

**Uncertain**: Would this create a component too generic to be maintainable? Need to check if propiedades (which is more complex with UF conversions) could also use it, or if it stays specialized.

- **Effort**: high. **Impact**: major LOC reduction (~130 lines each → ~30 lines of config each + ~100 shared).

---

## Priority 8 — Hardcoded border/hover classes → T tokens

Several tables hardcode:
- `border-b border-gray-100` / `border-b border-gray-200`
- `hover:bg-gray-50` / `hover:bg-emerald-50/30`

These should be T tokens: `T.rowBorder`, `T.rowHover`, etc.

- **Effort**: low. **Impact**: consistency, single place to change table row styling.

---

## Not doing (uncertain / low ROI)

- **Merging renta `usedragreorder` with common**: Renta's version has complex group/family logic specific to the monthly table. The common version is simpler and serves a different use case. Merging adds complexity without clear benefit.
- **Merging renta `usekeyboard` with common**: It's a thin 5-line wrapper aliasing `colIndex → monthIndex`. Not worth abstracting.
- **Unifying header stat components across boletas/tributario**: These have different enough layouts (flexbox vs table-layout) that a shared component would be over-engineered for 2 consumers.
- **Selection/bulk operations abstraction**: Only deudas uses this. No second consumer to justify extraction.

---

## Execution order

1. P1a-c: useRowHover adoption (boletas, deudas, renta)
2. P2: formatCurrency wrapper elimination
3. P3: generateId extraction
4. P4: formatDeletedDate extraction
5. P5: MONTH_LABELS to common
6. P8: T token additions for borders/hover
7. P6: RecycleBin unification
8. P7: vehiculos/inversiones genericization (if approved)

Steps 1-6 are safe, incremental, and independent. Steps 7-8 are larger refactors that benefit from the earlier cleanup.
