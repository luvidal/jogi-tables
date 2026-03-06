import { describe, it, expect } from 'vitest'
import { displayCurrency, displayCurrencyCompact } from '../src/common/utils'

describe('displayCurrency', () => {
    it('returns empty string for null/undefined', () => {
        expect(displayCurrency(null)).toBe('')
        expect(displayCurrency(undefined)).toBe('')
    })

    it('formats with $ prefix and locale separators', () => {
        const result = displayCurrency(1_500_000)
        expect(result).toContain('$')
        expect(result).toContain('1.500.000')
    })

    it('formats zero', () => {
        expect(displayCurrency(0)).toBe('$ 0')
    })

    it('formats negative numbers', () => {
        const result = displayCurrency(-500_000)
        expect(result).toContain('-')
        expect(result).toContain('500.000')
    })
})

describe('displayCurrencyCompact', () => {
    it('returns dash for null/undefined', () => {
        expect(displayCurrencyCompact(null)).toBe('—')
        expect(displayCurrencyCompact(undefined)).toBe('—')
    })

    it('rounds to nearest thousand', () => {
        expect(displayCurrencyCompact(1_500_000)).toBe('$1.500')
        expect(displayCurrencyCompact(539_000)).toBe('$539')
        expect(displayCurrencyCompact(150)).toBe('$0')
    })

    it('rounds 500+ up', () => {
        expect(displayCurrencyCompact(1_500)).toBe('$2')
        expect(displayCurrencyCompact(499)).toBe('$0')
    })

    it('handles zero', () => {
        expect(displayCurrencyCompact(0)).toBe('$0')
    })

    it('adds minus sign for deductions', () => {
        const result = displayCurrencyCompact(187_500, true)
        expect(result).toBe('-$188')
    })

    it('no minus sign for deductions when value is 0', () => {
        expect(displayCurrencyCompact(0, true)).toBe('$0')
    })

    it('handles negative values', () => {
        const result = displayCurrencyCompact(-300_000)
        expect(result).toBe('$300')
    })
})
