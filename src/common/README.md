# Common

Shared components, hooks, and utilities used across all table components. Everything in this folder is designed to ensure visual and behavioral consistency across tables.

## Files

| File | Description |
|------|-------------|
| `styles.ts` | `T` object with Tailwind class tokens for consistent table styling |
| `utils.ts` | Currency formatting: `displayCurrency`, `displayCurrencyCompact` (Chilean peso, es-CL) |
| `editablecell.tsx` | Inline-editable table cell with currency, number, text, and percent modes |
| `usemobile.ts` | `useIsMobile()` media query hook (max-width: 639px) |

## Usage

All tables import shared resources from this folder:

```ts
import { T } from '../common/styles'
import EditableCell from '../common/editablecell'
import { displayCurrencyCompact } from '../common/utils'
```

## Consumers

- **styles.ts** — used by all tables (monthly, debts, boletas, tributario, assets)
- **editablecell.tsx** — used by monthly (datarow, addrow), debts, assets
- **utils.ts** — used by monthly (helpers), boletas, tributario
- **usemobile.ts** — used by editablecell
