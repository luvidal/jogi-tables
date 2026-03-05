import { displayCurrencyCompact } from './utils'
import type { RowData, RowType, Month } from './types'

// ============================================================================
// Month generation
// ============================================================================

const MONTH_NAMES = ['', 'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']

export const generateLastNMonths = (count: number): Month[] => {
    const months: Month[] = []
    const now = new Date()
    for (let i = count - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const id = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        const label = MONTH_NAMES[d.getMonth() + 1]
        months.push({ id, label })
    }
    return months
}

// ============================================================================
// Formatting
// ============================================================================

export const defaultFormatValue = (value: number | null | undefined): string => {
    return displayCurrencyCompact(value)
}

// ============================================================================
// Row type helpers
// ============================================================================

export const isAddType = (type: RowType): boolean => type === 'add' || type === 'income'
export const isSubtractType = (type: RowType): boolean => type === 'subtract' || type === 'deduction' || type === 'debt'

/** Check if a row matches a section type (handles aliases) */
export const rowMatchesSection = (row: RowData, sectionType: RowType): boolean => {
    if (row.type === sectionType) return true
    if (sectionType === 'add' && row.type === 'income') return true
    if (sectionType === 'income' && row.type === 'add') return true
    if (sectionType === 'subtract' && (row.type === 'deduction' || row.type === 'debt')) return true
    return false
}

// ============================================================================
// Total calculation
// ============================================================================

export const defaultCalculateTotal = (monthId: string, rows: RowData[]): number => {
    let total = 0
    for (const row of rows) {
        if (row.isGroup) continue // Skip group headers — they're computed sums
        const value = row.values[monthId]
        if (value !== null && value !== undefined) {
            if (isAddType(row.type)) {
                total += value
            } else {
                total -= value
            }
        }
    }
    return total
}

// ============================================================================
// Ordering & grouping
// ============================================================================

export type RenderItem =
    | { kind: 'row'; row: RowData }
    | { kind: 'group'; group: RowData; children: RowData[] }

/** Get ordered items for a section, collecting grouped rows under their group headers */
export const getOrderedItems = (rows: RowData[], sectionType: RowType): RenderItem[] => {
    const sectionRows = rows.filter(r => rowMatchesSection(r, sectionType))

    const groups = sectionRows.filter(r => r.isGroup)
    const groupedChildren = sectionRows.filter(r => r.groupId && !r.isGroup)
    const ungrouped = sectionRows.filter(r => !r.isGroup && !r.groupId)

    // Build items with sort keys
    type SortableItem = RenderItem & { sortKey: number }
    const items: SortableItem[] = []

    for (const group of groups) {
        const children = groupedChildren
            .filter(r => r.groupId === group.id)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        items.push({ kind: 'group', group, children, sortKey: group.order ?? 0 })
    }

    for (const row of ungrouped) {
        items.push({ kind: 'row', row, sortKey: row.order ?? 0 })
    }

    // Sort by order, preserving original array order for ties
    items.sort((a, b) => a.sortKey - b.sortKey)

    return items
}

/** Compute section subtotal (sum of all non-group rows matching a section type) */
export const computeSectionSubtotal = (rows: RowData[], sectionType: RowType, months: Month[]): Record<string, number> => {
    const sectionRows = rows.filter(r => rowMatchesSection(r, sectionType) && !r.isGroup)
    const result: Record<string, number> = {}
    for (const month of months) {
        let sum = 0
        for (const row of sectionRows) {
            sum += row.values[month.id] ?? 0
        }
        result[month.id] = sum
    }
    return result
}

/** Compute group header values (sum of children per month) */
export const computeGroupValues = (children: RowData[], months: Month[]): Record<string, number> => {
    const result: Record<string, number> = {}
    for (const month of months) {
        let sum = 0
        for (const child of children) {
            sum += child.values[month.id] ?? 0
        }
        result[month.id] = sum
    }
    return result
}

/** Create a group from selected rows */
export const createGroup = (rows: RowData[], selectedIds: Set<string>, groupName: string): RowData[] => {
    const selected = rows.filter(r => selectedIds.has(r.id))
    if (selected.length < 2) return rows

    const groupType = selected[0].type
    const groupId = `group_${Date.now()}`

    // Find the position of the first selected row
    const firstIdx = rows.findIndex(r => selectedIds.has(r.id))

    const newRows = rows.map((r, idx) => {
        if (selectedIds.has(r.id)) {
            return { ...r, groupId, order: idx }
        }
        return r
    })

    // Insert group header at the position of the first selected row
    const groupHeader: RowData = {
        id: groupId,
        label: groupName,
        type: groupType,
        values: {},
        isGroup: true,
        collapsed: false,
        order: firstIdx,
    }

    newRows.splice(firstIdx, 0, groupHeader)
    return newRows
}

/** Remove a group, restoring children to ungrouped */
export const ungroupRows = (rows: RowData[], groupId: string): RowData[] => {
    return rows
        .filter(r => r.id !== groupId) // Remove the group header
        .map(r => {
            if (r.groupId === groupId) {
                const { groupId: _, ...rest } = r
                return rest
            }
            return r
        })
}

/** Auto-ungroup if a group has fewer than 2 children */
export const autoUngroup = (rows: RowData[]): RowData[] => {
    const groups = rows.filter(r => r.isGroup)
    let result = rows
    for (const group of groups) {
        const children = result.filter(r => r.groupId === group.id)
        if (children.length < 2) {
            result = ungroupRows(result, group.id)
        }
    }
    return result
}
