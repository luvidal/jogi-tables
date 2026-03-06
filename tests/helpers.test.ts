import { describe, it, expect } from 'vitest'
import {
    generateLastNMonths,
    defaultFormatValue,
    isAddType,
    isSubtractType,
    rowMatchesSection,
    defaultCalculateTotal,
    getOrderedItems,
    computeSectionSubtotal,
    computeGroupValues,
    createGroup,
    ungroupRows,
    autoUngroup,
} from '../src/monthly/helpers'
import type { RowData, Month } from '../src/monthly/types'

// ============================================================================
// Row type helpers
// ============================================================================

describe('isAddType', () => {
    it('returns true for add and income', () => {
        expect(isAddType('add')).toBe(true)
        expect(isAddType('income')).toBe(true)
    })
    it('returns false for subtract types', () => {
        expect(isAddType('subtract')).toBe(false)
        expect(isAddType('deduction')).toBe(false)
        expect(isAddType('debt')).toBe(false)
    })
})

describe('isSubtractType', () => {
    it('returns true for subtract, deduction, debt', () => {
        expect(isSubtractType('subtract')).toBe(true)
        expect(isSubtractType('deduction')).toBe(true)
        expect(isSubtractType('debt')).toBe(true)
    })
    it('returns false for add types', () => {
        expect(isSubtractType('add')).toBe(false)
        expect(isSubtractType('income')).toBe(false)
    })
})

describe('rowMatchesSection', () => {
    const row = (type: RowData['type']): RowData => ({
        id: '1', label: 'test', type, values: {},
    })

    it('matches exact type', () => {
        expect(rowMatchesSection(row('income'), 'income')).toBe(true)
        expect(rowMatchesSection(row('deduction'), 'deduction')).toBe(true)
    })
    it('matches add/income aliases', () => {
        expect(rowMatchesSection(row('add'), 'income')).toBe(true)
        expect(rowMatchesSection(row('income'), 'add')).toBe(true)
    })
    it('matches subtract aliases', () => {
        expect(rowMatchesSection(row('deduction'), 'subtract')).toBe(true)
        expect(rowMatchesSection(row('debt'), 'subtract')).toBe(true)
    })
    it('does not cross-match add and subtract', () => {
        expect(rowMatchesSection(row('income'), 'deduction')).toBe(false)
        expect(rowMatchesSection(row('subtract'), 'add')).toBe(false)
    })
})

// ============================================================================
// Month generation
// ============================================================================

describe('generateLastNMonths', () => {
    it('generates correct number of months', () => {
        expect(generateLastNMonths(3)).toHaveLength(3)
        expect(generateLastNMonths(1)).toHaveLength(1)
        expect(generateLastNMonths(6)).toHaveLength(6)
    })
    it('months have id in YYYY-MM format', () => {
        const months = generateLastNMonths(1)
        expect(months[0].id).toMatch(/^\d{4}-\d{2}$/)
    })
    it('months have uppercase 3-letter labels', () => {
        const months = generateLastNMonths(12)
        for (const m of months) {
            expect(m.label).toMatch(/^[A-Z]{3}$/)
        }
    })
    it('months are ordered oldest first', () => {
        const months = generateLastNMonths(3)
        expect(months[0].id < months[1].id).toBe(true)
        expect(months[1].id < months[2].id).toBe(true)
    })
})

// ============================================================================
// Formatting
// ============================================================================

describe('defaultFormatValue', () => {
    it('formats null/undefined as dash', () => {
        expect(defaultFormatValue(null)).toBe('—')
        expect(defaultFormatValue(undefined)).toBe('—')
    })
    it('formats numbers as compact currency', () => {
        const result = defaultFormatValue(1_500_000)
        expect(result).toContain('1.500')
        expect(result).toContain('$')
    })
    it('formats zero', () => {
        expect(defaultFormatValue(0)).toBe('$0')
    })
})

// ============================================================================
// Total calculation
// ============================================================================

describe('defaultCalculateTotal', () => {
    const months: Month[] = [{ id: 'm1', label: 'M1' }]

    it('sums add rows and subtracts subtract rows', () => {
        const rows: RowData[] = [
            { id: '1', label: 'Income', type: 'income', values: { m1: 1000 } },
            { id: '2', label: 'Deduction', type: 'deduction', values: { m1: 300 } },
        ]
        expect(defaultCalculateTotal('m1', rows)).toBe(700)
    })

    it('skips group headers', () => {
        const rows: RowData[] = [
            { id: '1', label: 'Group', type: 'income', values: { m1: 9999 }, isGroup: true },
            { id: '2', label: 'Child', type: 'income', values: { m1: 500 } },
        ]
        expect(defaultCalculateTotal('m1', rows)).toBe(500)
    })

    it('handles null values', () => {
        const rows: RowData[] = [
            { id: '1', label: 'A', type: 'income', values: { m1: null } },
            { id: '2', label: 'B', type: 'income', values: { m1: 200 } },
        ]
        expect(defaultCalculateTotal('m1', rows)).toBe(200)
    })

    it('handles missing month', () => {
        const rows: RowData[] = [
            { id: '1', label: 'A', type: 'income', values: {} },
        ]
        expect(defaultCalculateTotal('m1', rows)).toBe(0)
    })

    it('returns 0 for empty rows', () => {
        expect(defaultCalculateTotal('m1', [])).toBe(0)
    })
})

// ============================================================================
// Ordering & grouping
// ============================================================================

describe('getOrderedItems', () => {
    it('returns ungrouped rows as individual items', () => {
        const rows: RowData[] = [
            { id: '1', label: 'A', type: 'income', values: {} },
            { id: '2', label: 'B', type: 'income', values: {} },
        ]
        const items = getOrderedItems(rows, 'income')
        expect(items).toHaveLength(2)
        expect(items[0].kind).toBe('row')
        expect(items[1].kind).toBe('row')
    })

    it('groups rows under their group header', () => {
        const rows: RowData[] = [
            { id: 'g1', label: 'Group', type: 'income', values: {}, isGroup: true, order: 0 },
            { id: '1', label: 'Child A', type: 'income', values: {}, groupId: 'g1', order: 1 },
            { id: '2', label: 'Child B', type: 'income', values: {}, groupId: 'g1', order: 2 },
        ]
        const items = getOrderedItems(rows, 'income')
        expect(items).toHaveLength(1)
        expect(items[0].kind).toBe('group')
        if (items[0].kind === 'group') {
            expect(items[0].children).toHaveLength(2)
        }
    })

    it('filters by section type', () => {
        const rows: RowData[] = [
            { id: '1', label: 'Income', type: 'income', values: {} },
            { id: '2', label: 'Deduction', type: 'deduction', values: {} },
        ]
        expect(getOrderedItems(rows, 'income')).toHaveLength(1)
        expect(getOrderedItems(rows, 'deduction')).toHaveLength(1)
    })

    it('sorts by order field', () => {
        const rows: RowData[] = [
            { id: '1', label: 'Second', type: 'income', values: {}, order: 2 },
            { id: '2', label: 'First', type: 'income', values: {}, order: 1 },
        ]
        const items = getOrderedItems(rows, 'income')
        expect(items[0].kind === 'row' && items[0].row.label).toBe('First')
        expect(items[1].kind === 'row' && items[1].row.label).toBe('Second')
    })
})

describe('computeSectionSubtotal', () => {
    const months: Month[] = [
        { id: 'm1', label: 'M1' },
        { id: 'm2', label: 'M2' },
    ]

    it('sums values per month for matching rows', () => {
        const rows: RowData[] = [
            { id: '1', label: 'A', type: 'income', values: { m1: 100, m2: 200 } },
            { id: '2', label: 'B', type: 'income', values: { m1: 300, m2: 400 } },
        ]
        const result = computeSectionSubtotal(rows, 'income', months)
        expect(result.m1).toBe(400)
        expect(result.m2).toBe(600)
    })

    it('skips group headers', () => {
        const rows: RowData[] = [
            { id: 'g', label: 'Group', type: 'income', values: { m1: 9999 }, isGroup: true },
            { id: '1', label: 'A', type: 'income', values: { m1: 100 } },
        ]
        expect(computeSectionSubtotal(rows, 'income', months).m1).toBe(100)
    })
})

describe('computeGroupValues', () => {
    const months: Month[] = [{ id: 'm1', label: 'M1' }]

    it('sums children values per month', () => {
        const children: RowData[] = [
            { id: '1', label: 'A', type: 'income', values: { m1: 100 } },
            { id: '2', label: 'B', type: 'income', values: { m1: 250 } },
        ]
        expect(computeGroupValues(children, months).m1).toBe(350)
    })

    it('handles null values as 0', () => {
        const children: RowData[] = [
            { id: '1', label: 'A', type: 'income', values: { m1: null } },
            { id: '2', label: 'B', type: 'income', values: { m1: 100 } },
        ]
        expect(computeGroupValues(children, months).m1).toBe(100)
    })
})

describe('createGroup', () => {
    it('creates a group header and assigns children', () => {
        const rows: RowData[] = [
            { id: '1', label: 'A', type: 'income', values: {} },
            { id: '2', label: 'B', type: 'income', values: {} },
            { id: '3', label: 'C', type: 'income', values: {} },
        ]
        const selected = new Set(['1', '3'])
        const result = createGroup(rows, selected, 'My Group')

        const header = result.find(r => r.isGroup)
        expect(header).toBeDefined()
        expect(header!.label).toBe('My Group')
        expect(header!.type).toBe('income')

        const children = result.filter(r => r.groupId === header!.id)
        expect(children).toHaveLength(2)
    })

    it('does nothing with fewer than 2 selected', () => {
        const rows: RowData[] = [
            { id: '1', label: 'A', type: 'income', values: {} },
        ]
        const result = createGroup(rows, new Set(['1']), 'Solo')
        expect(result).toEqual(rows)
    })
})

describe('ungroupRows', () => {
    it('removes group header and clears children groupId', () => {
        const rows: RowData[] = [
            { id: 'g1', label: 'Group', type: 'income', values: {}, isGroup: true },
            { id: '1', label: 'A', type: 'income', values: {}, groupId: 'g1' },
            { id: '2', label: 'B', type: 'income', values: {}, groupId: 'g1' },
        ]
        const result = ungroupRows(rows, 'g1')
        expect(result).toHaveLength(2)
        expect(result.find(r => r.isGroup)).toBeUndefined()
        expect(result.every(r => !r.groupId)).toBe(true)
    })
})

describe('autoUngroup', () => {
    it('ungroups when fewer than 2 children remain', () => {
        const rows: RowData[] = [
            { id: 'g1', label: 'Group', type: 'income', values: {}, isGroup: true },
            { id: '1', label: 'Only Child', type: 'income', values: {}, groupId: 'g1' },
        ]
        const result = autoUngroup(rows)
        expect(result).toHaveLength(1)
        expect(result[0].groupId).toBeUndefined()
    })

    it('keeps groups with 2+ children', () => {
        const rows: RowData[] = [
            { id: 'g1', label: 'Group', type: 'income', values: {}, isGroup: true },
            { id: '1', label: 'A', type: 'income', values: {}, groupId: 'g1' },
            { id: '2', label: 'B', type: 'income', values: {}, groupId: 'g1' },
        ]
        const result = autoUngroup(rows)
        expect(result).toHaveLength(3)
        expect(result.find(r => r.isGroup)).toBeDefined()
    })
})
