// Shared Report Table Styles — inlined from jogi's lib/reports/styles.ts

export const T = {
    table: 'w-full text-xs',
    headerTitle: 'font-normal text-xs truncate',
    headerStat: 'font-normal text-xs',
    headerStatLabel: 'font-normal text-xs uppercase',
    headerCount: 'font-medium text-xs',
    th: 'text-gray-500 font-medium text-xs uppercase',
    cellLabel: 'overflow-hidden',
    input: 'bg-transparent border-none outline-none text-xs truncate',
    inputLabel: 'bg-transparent border-none outline-none text-xs font-medium truncate',
    inputPlaceholder: 'bg-transparent border-none outline-none text-xs text-gray-500 placeholder-gray-400 truncate',
    rowLabel: 'bg-transparent border-none outline-none text-xs font-medium text-gray-600 truncate',
    sectionTitle: 'font-normal text-xs',
    totalLabel: 'font-medium text-xs',
    totalValue: 'font-medium text-xs',
    footerLabel: 'font-bold',
    footerValue: 'font-bold',
    muted: 'text-xs text-gray-600',
    empty: 'text-xs text-gray-400 italic',
    cardLabel: 'text-xs font-medium',
    cardValue: 'text-xs font-semibold',
} as const
