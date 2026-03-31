// Shared Report Table Styles — single source of truth for all table padding,
// fonts, and structural classes. Every table component must use these tokens.
//
// Padding tiers:
//   cell/cellValue       — read-only rows (compact)
//   cellEdit/cellEditVal — editable rows (taller for click-to-edit targets)
//   headerCell           — column headers (th)
//   headerAccordion      — accordion header (TableShell title bar)
//   totalCell            — footer/total rows

export const T = {
    // ── Base ──
    table: 'w-full text-xs border-separate border-spacing-0',

    // ── Header: accordion bar (TableShell) ──
    headerAccordion: 'px-4 py-2.5',
    headerAccordionStat: 'px-2 py-2.5 text-right',
    headerTitle: 'font-normal text-xs truncate',
    headerStat: 'font-normal text-xs',
    headerStatLabel: 'font-normal text-xs uppercase',
    headerCount: 'font-medium text-xs',

    // ── Header: column headers (th) ──
    th: 'text-gray-500 font-medium text-xs uppercase',
    headerCell: 'px-2 py-1.5',
    /** Vertical divider between columns */
    vline: 'border-r border-gray-200',
    /** Action column (delete button) — fixed narrow width */
    actionCol: 'w-10',
    /** Compact cell padding for small icon/badge columns */
    cellCompact: 'px-0.5 py-1',

    // ── Body: read-only cells (compact) ──
    cell: 'py-1.5 px-3',
    cellValue: 'py-1.5 px-3 text-right tabular-nums',
    cellLabel: 'overflow-hidden',

    // ── Body: editable cells (taller click targets) ──
    cellEdit: 'px-2 py-1.5',
    cellEditLabel: 'pl-1 pr-2 py-1.5',

    // ── Totals / footer ──
    totalCell: 'px-2 py-1.5',
    totalLabel: 'font-medium text-xs',
    totalValue: 'font-medium text-xs',
    footerLabel: 'font-bold',
    footerValue: 'font-bold',

    // ── Inputs (transparent inline) ──
    input: 'bg-transparent border-none outline-none text-xs truncate',
    inputLabel: 'bg-transparent border-none outline-none text-xs font-medium truncate',
    inputPlaceholder: 'bg-transparent border-none outline-none text-xs text-gray-500 placeholder-gray-400 truncate',
    rowLabel: 'bg-transparent border-none outline-none text-xs font-medium text-gray-600 truncate',

    // ── Typography helpers ──
    sectionTitle: 'font-normal text-xs',
    /** Data row indent (child rows below subheaders) */
    cellIndent: 'pl-6',
    muted: 'text-xs text-gray-600',
    empty: 'text-xs text-gray-400 italic',
    cardLabel: 'text-xs font-medium',
    cardValue: 'text-xs font-semibold',

    // ── Row classes ──
    row: 'border-b border-gray-100',
    rowBorder: 'border-b border-gray-100',
    rowHover: 'hover:bg-gray-50',
    rowTotal: 'border-b bg-gray-50/80 border-gray-200',
    rowGrandtotal: 'border-b-2 bg-gray-100 border-gray-300',
} as const
