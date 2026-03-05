# FinanceTables

Financial table components extracted from [jogi](../jogi). Includes MonthlyTable (editable monthly spreadsheet with CRUD, grouping, drag-reorder, keyboard nav), DebtsTable, BoletasTable, TributarioTable, and AssetTable.

## Quick Reference

```bash
npm run build        # Build with tsup → dist/ (ESM + CJS + .d.ts)
npm run dev          # Build in watch mode
npm run preview      # Visual test page at http://localhost:5173
npm test             # Run unit tests
npm run test:watch   # Run tests in watch mode
```

## Tech Stack

- **TypeScript** + **React** (peer dep)
- **tsup** for bundling
- **Vite** for visual dev/test page
- **Vitest** + **happy-dom** for unit tests
- **Tailwind CSS** classes (consumer must include `dist/` in their tailwind content config)
- **lucide-react** for icons (peer dep)

## Project Structure

```
src/
├── index.tsx           # Main MonthlyTable component + re-exports of all tables
├── types.ts            # RowData, Month, MonthlyTableProps, RowType, SectionDef
├── helpers.ts          # Month generation, row type checks, grouping, totals
├── datarow.tsx         # Single editable data row
├── addrow.tsx          # "Add new row" input row
├── grouprow.tsx        # Collapsible group header row
├── floatingaction.tsx  # HeaderSelectionBar + ContextMenu (right-click)
├── usekeyboard.ts     # Grid keyboard navigation hook
├── usedragreorder.ts  # HTML5 drag-and-drop reorder hook
├── editablecell.tsx    # Inline-editable table cell (inlined from jogi)
├── styles.ts           # Tailwind class tokens (T object, inlined from jogi)
├── utils.ts            # Currency formatting (displayCurrencyCompact, displayCurrency)
├── usemobile.ts        # useIsMobile media query hook
├── debtstable.tsx      # Debt entries table (accordion, editable, late payment tracking)
├── boletastable.tsx    # Boletas de honorarios table (monthly breakdown, accordion)
├── tributariotable.tsx # Tributario info table (carpeta tributaria + balance anual)
└── assettable.tsx      # Asset table (editable rows, total calculation)

dev/
├── index.html          # Visual test page entry point
├── main.tsx            # Renders test scenarios with mock data
└── tailwind.css        # Tailwind base styles for dev page

tests/
├── helpers.test.ts     # Unit tests for pure helper functions
└── utils.test.ts       # Unit tests for currency formatting
```

## Communication Style

- **No emotional validation** — never say "I understand your frustration". Results matter, not words.
- **No excessive apologies** — don't apologize repeatedly. Fix the problem.
- **Be direct** — state facts, propose solutions, execute. Skip the fluff.

## Spanish Copy Standard

All user-facing text uses informal **tú**, never **usted**:
- Imperatives: `ingresa`, `selecciona`, `agrega` (NOT `ingrese`, `seleccione`, `agregue`)
- Possessives: `tu`, `tus` (NOT `su`, `sus`)
- Pronouns: `te`, `ti`, `tú` (NOT `le`, `usted`)

## Code Rules

1. **One component per file**
2. **File naming** → lowercase, no hyphens/underscores (e.g., `editablecell.tsx`, not `editable-cell.tsx`)
3. **No `@/` imports** — all imports are relative within `src/`
4. **Icons** — use direct lucide-react imports (`import { Eye } from 'lucide-react'`), not a wrapper component
5. **Tailwind classes** — the package ships class strings but does NOT bundle CSS. Consumers add the dist path to their `tailwind.config.ts` content array
6. **API stability** — the exported props interface (`MonthlyTableProps`) must stay backward-compatible with jogi's call sites. Breaking changes require updating jogi's `lib/reports/monthlytable.tsx` re-export
7. **Optimistic updates** — always update UI immediately, then fire callbacks. Don't block UI on async responses
8. **After modifying a feature**, update this CLAUDE.md if any key behavior changed

## Exports

```ts
// Default export
MonthlyTable

// Named type exports
Month, RowData, RowType, MonthlyTableProps

// Named function exports
generateLastNMonths

// Table components (named exports)
DebtsTable, BoletasTable, TributarioTable, AssetTable

// Table type exports
DebtEntry, DebtsTableProps
BoletaMonth, BoletasTableProps
TributarioEntry, TributarioTableProps
AssetRowData, AssetTableProps
```

## Consumer Setup (jogi)

```ts
// jogi/lib/reports/monthlytable.tsx
export { default } from '@avd/financetables'
export type { Month, RowData, RowType, MonthlyTableProps } from '@avd/financetables'

// jogi/lib/reports/debtstable.tsx
export { DebtsTable as default } from '@avd/financetables'
export type { DebtEntry, DebtsTableProps } from '@avd/financetables'

// jogi/lib/reports/boletastable.tsx
export { BoletasTable as default } from '@avd/financetables'
export type { BoletaMonth, BoletasTableProps } from '@avd/financetables'

// jogi/lib/reports/tributariotable.tsx
export { TributarioTable as default } from '@avd/financetables'
export type { TributarioEntry, TributarioTableProps } from '@avd/financetables'

// jogi/lib/reports/asset-table.tsx → assettable.tsx
export { AssetTable as default } from '@avd/financetables'
export type { AssetRowData, AssetTableProps } from '@avd/financetables'
```

```ts
// jogi/tailwind.config.ts — content array
'./node_modules/@avd/financetables/dist/**/*.{js,mjs}'
```

```json
// jogi/package.json — dependencies
"@avd/financetables": "github:luvidal/financetables"
```

## Inlined Dependencies

These were copied from jogi during extraction. They are now owned by this package:

| File | Origin in jogi |
|------|---------------|
| `styles.ts` | `lib/reports/styles.ts` (T object) |
| `utils.ts` | `lib/reports/utils.ts` (displayCurrencyCompact, displayCurrency) |
| `usemobile.ts` | `context/device.ts` (useIsMobile) |
| `editablecell.tsx` | `components/forms/editablecell.tsx` |

## Key Behaviors

- **Sections**: Auto-detected from row types or explicitly provided via `sections` prop
- **Row types**: `add`/`income` (add to total), `subtract`/`deduction`/`debt` (subtract from total)
- **Grouping**: Select 2+ rows of same type → group into collapsible header. Auto-ungroups when <2 children remain
- **Drag reorder**: Rows reorder within their type family. Groups drag as a unit. 600ms hover on collapsed group auto-expands
- **Keyboard**: Arrow keys navigate cells, Enter edits, Tab moves right, Escape clears focus
- **Totals**: Header shows per-month totals. Multi-section tables show subtotal rows per section
- **Empty side**: Always renders with add-row input visible, never hidden
