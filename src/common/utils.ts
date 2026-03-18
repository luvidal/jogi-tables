// Currency formatting — inlined from jogi's lib/reports/utils.ts

export const displayCurrency = (value: number | undefined | null): string => {
    if (value === undefined || value === null) return ''
    return `$ ${value.toLocaleString('es-CL')}`
}

/**
 * Compact currency: rounds to nearest thousand and displays without decimals.
 * 1_393_231 → "$1.393", 539_000 → "$539", 150 → "$0"
 */
/**
 * Full currency with em-dash for null/undefined.
 * 1_500_000 → "$ 1.500.000", null → "—"
 */
export const defaultFormatCurrency = (value: number | null | undefined): string => {
    if (value === undefined || value === null) return '—'
    return `$ ${value.toLocaleString('es-CL')}`
}

export const displayCurrencyCompact = (value: number | undefined | null, isDeduction = false): string => {
    if (value === undefined || value === null) return '—'
    const abs = Math.abs(value)
    const sign = isDeduction && value > 0 ? '-' : ''
    const thousands = Math.round(abs / 1000)
    return `${sign}$${thousands.toLocaleString('es-CL')}`
}
