import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { Eye, ChevronUp, ChevronDown } from 'lucide-react'
import { T } from './styles'
import {
    generateLastNMonths,
    defaultFormatValue,
    defaultCalculateTotal,
    isAddType,
    isSubtractType,
    rowMatchesSection,
    getOrderedItems,
    createGroup,
    ungroupRows,
    autoUngroup,
    computeSectionSubtotal,
} from './helpers'
import DataRow from './datarow'
import AddRow from './addrow'
import GroupRow from './grouprow'
import { HeaderSelectionBar, ContextMenu } from './floatingaction'
import { useKeyboard } from './usekeyboard'
import { useDragReorder } from './usedragreorder'

// Re-export types for consumers
export type { Month, RowData, RowType, MonthlyTableProps } from './types'
import type { RowData, MonthlyTableProps } from './types'

// Re-export helpers consumers might need
export { generateLastNMonths } from './helpers'

// ============================================================================
// Component
// ============================================================================

const MonthlyTable = ({
    title,
    months = 3,
    rows,
    onRowsChange,
    sections,
    headerBg = 'bg-gray-100',
    headerText = 'text-gray-700',
    defaultCollapsed = true,
    forceExpanded = false,
    formatValue = defaultFormatValue,
    calculateTotal = defaultCalculateTotal,
    sourceFileIds,
    onViewSource,
}: MonthlyTableProps) => {
    const [hoveredRow, setHoveredRow] = useState<string | null>(null)
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
    const [newRowLabels, setNewRowLabels] = useState<Record<string, string>>({})
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
    const [naming, setNaming] = useState(false)

    const monthsArray = useMemo(() => {
        if (typeof months === 'number') return generateLastNMonths(months)
        return months
    }, [months])

    const effectiveSections = useMemo(() => {
        if (sections) return sections
        const hasIncome = rows.some(r => r.type === 'income')
        const hasDeduction = rows.some(r => r.type === 'deduction')
        const hasDebt = rows.some(r => r.type === 'debt')
        const hasAdd = rows.some(r => r.type === 'add')
        const hasSubtract = rows.some(r => r.type === 'subtract')

        const result: Array<{ type: typeof rows[0]['type']; placeholder: string }> = []
        if (hasIncome || hasAdd) result.push({ type: hasIncome ? 'income' : 'add', placeholder: 'Agregar ingreso...' })
        if (hasDeduction) result.push({ type: 'deduction', placeholder: 'Agregar descuento...' })
        if (hasDebt) result.push({ type: 'debt', placeholder: 'Agregar deuda...' })
        if (hasSubtract && !hasDeduction && !hasDebt) result.push({ type: 'subtract', placeholder: 'Agregar descuento...' })
        if (result.length === 0) result.push({ type: 'add', placeholder: 'Agregar fila...' })
        return result
    }, [sections, rows])

    const isExpanded = forceExpanded || !isCollapsed
    const anySelected = selectedRows.size > 0

    // Compute visible row IDs for keyboard navigation
    const visibleRowIds = useMemo(() => {
        const ids: string[] = []
        for (const section of effectiveSections) {
            const items = getOrderedItems(rows, section.type)
            for (const item of items) {
                if (item.kind === 'group') {
                    // Group headers are not navigable (read-only sums)
                    const showChildren = forceExpanded || !item.group.collapsed
                    if (showChildren) {
                        for (const child of item.children) ids.push(child.id)
                    }
                } else {
                    ids.push(item.row.id)
                }
            }
        }
        return ids
    }, [effectiveSections, rows, forceExpanded])

    const keyboard = useKeyboard({ visibleRowIds, monthCount: monthsArray.length })
    const drag = useDragReorder()

    // Auto-expand collapsed group headers when dragging over them for 600ms
    const expandTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    useEffect(() => {
        if (expandTimerRef.current) { clearTimeout(expandTimerRef.current); expandTimerRef.current = null }
        if (!drag.dropTargetId || forceExpanded) return
        const target = rows.find(r => r.id === drag.dropTargetId)
        if (!target?.isGroup || !target.collapsed) return
        expandTimerRef.current = setTimeout(() => toggleGroupCollapse(target.id), 600)
        return () => { if (expandTimerRef.current) { clearTimeout(expandTimerRef.current); expandTimerRef.current = null } }
    }, [drag.dropTargetId]) // eslint-disable-line react-hooks/exhaustive-deps

    // ========================================================================
    // Selection logic
    // ========================================================================

    const toggleSelect = useCallback((rowId: string) => {
        setSelectedRows(prev => {
            const next = new Set(prev)
            if (next.has(rowId)) next.delete(rowId)
            else next.add(rowId)
            return next
        })
    }, [])

    const clearSelection = useCallback(() => setSelectedRows(new Set()), [])

    // Can group: 2+ selected, all same type, none are groups or already grouped
    const canGroup = useMemo(() => {
        if (selectedRows.size < 2) return false
        const selected = rows.filter(r => selectedRows.has(r.id))
        if (selected.some(r => r.isGroup || r.groupId)) return false
        const types = new Set(selected.map(r => isAddType(r.type) ? 'add' : 'subtract'))
        return types.size === 1
    }, [selectedRows, rows])

    const handleGroup = useCallback((name: string) => {
        const newRows = createGroup(rows, selectedRows, name)
        onRowsChange(newRows)
        clearSelection()
        setNaming(false)
    }, [rows, selectedRows, onRowsChange, clearSelection])

    const handleContextMenu = useCallback((e: React.MouseEvent, rowId: string) => {
        if (!selectedRows.has(rowId) || selectedRows.size < 2) return
        e.preventDefault()
        setContextMenu({ x: e.clientX, y: e.clientY })
    }, [selectedRows])

    const startGroupNaming = useCallback(() => {
        setContextMenu(null)
        setNaming(true)
    }, [])

    // ========================================================================
    // Row management
    // ========================================================================

    const updateRowLabel = useCallback((rowId: string, label: string) => {
        onRowsChange(rows.map(r => r.id === rowId ? { ...r, label } : r))
    }, [rows, onRowsChange])

    const updateRowValue = useCallback((rowId: string, monthId: string, value: number | null) => {
        onRowsChange(rows.map(r => {
            if (r.id !== rowId) return r
            return { ...r, values: { ...r.values, [monthId]: value } }
        }))
    }, [rows, onRowsChange])

    const removeRow = useCallback((rowId: string) => {
        const row = rows.find(r => r.id === rowId)
        if (!row) return

        let newRows: RowData[]
        if (row.isGroup) {
            // Ungrouping: remove header, clear children's groupId
            newRows = ungroupRows(rows, rowId)
        } else {
            newRows = rows.filter(r => r.id !== rowId)
            // Auto-ungroup if group has <2 children remaining
            newRows = autoUngroup(newRows)
        }

        // Clear from selection
        setSelectedRows(prev => {
            if (!prev.has(rowId)) return prev
            const next = new Set(prev)
            next.delete(rowId)
            return next
        })

        onRowsChange(newRows)
    }, [rows, onRowsChange])

    const toggleGroupCollapse = useCallback((groupId: string) => {
        onRowsChange(rows.map(r => r.id === groupId ? { ...r, collapsed: !r.collapsed } : r))
    }, [rows, onRowsChange])

    const handleUngroup = useCallback((groupId: string) => {
        onRowsChange(ungroupRows(rows, groupId))
    }, [rows, onRowsChange])

    const addRow = useCallback((type: typeof rows[0]['type'], label: string) => {
        if (!label.trim()) return
        const newRow: RowData = { id: `row_${type}_${Date.now()}`, label: label.trim(), type, values: {} }
        setNewRowLabels(prev => ({ ...prev, [type]: '' }))

        if (isAddType(type)) {
            const subtractIndex = rows.findIndex(r => isSubtractType(r.type))
            if (subtractIndex === -1) {
                onRowsChange([...rows, newRow])
            } else {
                const updated = [...rows]
                updated.splice(subtractIndex, 0, newRow)
                onRowsChange(updated)
            }
        } else {
            onRowsChange([...rows, newRow])
        }
    }, [rows, onRowsChange])

    const addRowWithValue = useCallback((type: typeof rows[0]['type'], monthId: string, value: number | null) => {
        if (value === null) return
        const pendingLabel = (newRowLabels[type] || '').trim()
        const defaultLabel = isAddType(type) ? 'Nuevo ingreso' : 'Nuevo descuento'
        const newRow: RowData = { id: `row_${type}_${Date.now()}`, label: pendingLabel || defaultLabel, type, values: { [monthId]: value } }
        setNewRowLabels(prev => ({ ...prev, [type]: '' }))

        if (isAddType(type)) {
            const subtractIndex = rows.findIndex(r => isSubtractType(r.type))
            if (subtractIndex === -1) {
                onRowsChange([...rows, newRow])
            } else {
                const updated = [...rows]
                updated.splice(subtractIndex, 0, newRow)
                onRowsChange(updated)
            }
        } else {
            onRowsChange([...rows, newRow])
        }
    }, [rows, onRowsChange, newRowLabels])

    // ========================================================================
    // Render
    // ========================================================================

    return (
        <div className={`rounded-xl overflow-hidden ${!isExpanded ? '' : 'border border-gray-200'}`}>
            {/* Accordion Header — uses div (not button) to allow nested interactive elements during selection */}
            <div
                role={anySelected ? undefined : 'button'}
                onClick={() => !forceExpanded && !anySelected && setIsCollapsed(!isCollapsed)}
                className={`w-full ${headerBg} hover:brightness-95 transition-all ${forceExpanded || anySelected ? 'cursor-default' : 'cursor-pointer'} ${!isExpanded ? 'rounded-xl' : 'rounded-t-xl'}`}
            >
                <div className="overflow-x-auto">
                    <table className={T.table} style={{ tableLayout: 'fixed' }}>
                        <tbody>
                            <tr>
                                <td className="px-4 py-2.5 text-left" style={{ width: '180px' }}>
                                    <div className="flex items-center gap-2">
                                        <span className={`${headerText} ${T.headerTitle}`}>{title}</span>
                                        {!anySelected && sourceFileIds && sourceFileIds.length > 0 && onViewSource && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onViewSource(sourceFileIds) }}
                                                className="p-1 rounded hover:bg-white/50 transition-colors"
                                                title="Ver documento fuente"
                                            >
                                                <Eye size={14} className={headerText} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                                {anySelected ? (
                                    <HeaderSelectionBar
                                        selectedCount={selectedRows.size}
                                        canGroup={canGroup}
                                        monthCount={monthsArray.length}
                                        naming={naming}
                                        onNamingChange={setNaming}
                                        onGroup={handleGroup}
                                        onCancel={() => { clearSelection(); setNaming(false) }}
                                    />
                                ) : (
                                    <>
                                        {monthsArray.map((p) => {
                                            const total = calculateTotal(p.id, rows)
                                            const hasValue = total !== 0
                                            return (
                                                <td key={p.id} className="px-2 py-2.5 text-right" style={{ width: '110px' }}>
                                                    <span className={`${headerText} ${T.headerStatLabel}`}>{p.label}: </span>
                                                    <span className={`${T.headerStat} ${hasValue ? headerText : 'text-gray-400'}`}>
                                                        {hasValue ? formatValue(total) : '—'}
                                                    </span>
                                                </td>
                                            )
                                        })}
                                        <td className="px-2 py-2.5 text-right" style={{ width: '40px' }}>
                                            {!forceExpanded && (
                                                isExpanded ? <ChevronUp size={20} className={headerText} /> : <ChevronDown size={20} className={headerText} />
                                            )}
                                        </td>
                                    </>
                                )}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Collapsible Content */}
            <div
                className={`bg-white ${!isExpanded ? 'hidden print:block' : ''} outline-none`}
                tabIndex={0}
                onKeyDown={keyboard.handleContainerKeyDown}
            >
                <div className="overflow-x-auto">
                    <table className={T.table} style={{ tableLayout: 'fixed' }}>
                        <tbody>
                            {effectiveSections.map((section) => {
                                const items = getOrderedItems(rows, section.type)
                                return (
                                    <React.Fragment key={section.type}>
                                        {items.map(item => {
                                            if (item.kind === 'group') {
                                                const { group, children: groupChildren } = item
                                                const showChildren = forceExpanded || !group.collapsed
                                                return (
                                                    <React.Fragment key={group.id}>
                                                        <GroupRow
                                                            group={group}
                                                            childRows={groupChildren}
                                                            months={monthsArray}
                                                            isHovered={hoveredRow === group.id}
                                                            forceExpanded={forceExpanded}
                                                            formatValue={formatValue}
                                                            onMouseEnter={() => setHoveredRow(group.id)}
                                                            onMouseLeave={() => setHoveredRow(null)}
                                                            onToggleCollapse={() => toggleGroupCollapse(group.id)}
                                                            onUngroup={() => handleUngroup(group.id)}
                                                            onLabelChange={(label) => updateRowLabel(group.id, label)}
                                                            isDragging={drag.dragRowId === group.id}
                                                            dropIndicator={drag.dropTargetId === group.id ? drag.dropPosition : null}
                                                            onDragStart={drag.handleDragStart(group.id)}
                                                            onDragOver={drag.handleDragOver(group.id)}
                                                            onDragLeave={drag.handleDragLeave}
                                                            onDrop={drag.handleDrop(rows, onRowsChange)}
                                                            onDragEnd={drag.handleDragEnd}
                                                        />
                                                        {showChildren && groupChildren.map(child => (
                                                            <DataRow
                                                                key={child.id}
                                                                row={child}
                                                                months={monthsArray}
                                                                isHovered={hoveredRow === child.id}
                                                                indented
                                                                onMouseEnter={() => setHoveredRow(child.id)}
                                                                onMouseLeave={() => setHoveredRow(null)}
                                                                onRemove={() => removeRow(child.id)}
                                                                onLabelChange={(label) => updateRowLabel(child.id, label)}
                                                                onValueChange={(monthId, value) => updateRowValue(child.id, monthId, value)}
                                                                onViewSource={onViewSource}
                                                                isCellFocused={(mi) => keyboard.isFocused(child.id, mi)}
                                                                onCellFocus={(mi) => keyboard.focus(child.id, mi)}
                                                                onNavigate={keyboard.navigateAndEdit}
                                                                editTrigger={keyboard.editTrigger}
                                                                dropIndicator={drag.dropTargetId === child.id ? drag.dropPosition : null}
                                                                onDragOver={drag.handleDragOver(child.id)}
                                                                onDragLeave={drag.handleDragLeave}
                                                                onDrop={drag.handleDrop(rows, onRowsChange)}
                                                            />
                                                        ))}
                                                    </React.Fragment>
                                                )
                                            }
                                            const { row } = item
                                            const selectable = !row.isGroup && !row.groupId
                                            return (
                                                <DataRow
                                                    key={row.id}
                                                    row={row}
                                                    months={monthsArray}
                                                    isHovered={hoveredRow === row.id}
                                                    selected={selectedRows.has(row.id)}
                                                    anySelected={anySelected}
                                                    selectable={selectable}
                                                    onMouseEnter={() => setHoveredRow(row.id)}
                                                    onMouseLeave={() => setHoveredRow(null)}
                                                    onRemove={() => removeRow(row.id)}
                                                    onToggleSelect={() => toggleSelect(row.id)}
                                                    onContextMenu={(e) => handleContextMenu(e, row.id)}
                                                    onLabelChange={(label) => updateRowLabel(row.id, label)}
                                                    onValueChange={(monthId, value) => updateRowValue(row.id, monthId, value)}
                                                    onViewSource={onViewSource}
                                                    isCellFocused={(mi) => keyboard.isFocused(row.id, mi)}
                                                    onCellFocus={(mi) => keyboard.focus(row.id, mi)}
                                                    onNavigate={keyboard.navigateAndEdit}
                                                    editTrigger={keyboard.editTrigger}
                                                    isDragging={drag.dragRowId === row.id}
                                                    dropIndicator={drag.dropTargetId === row.id ? drag.dropPosition : null}
                                                    onDragStart={drag.handleDragStart(row.id)}
                                                    onDragOver={drag.handleDragOver(row.id)}
                                                    onDragLeave={drag.handleDragLeave}
                                                    onDrop={drag.handleDrop(rows, onRowsChange)}
                                                    onDragEnd={drag.handleDragEnd}
                                                />
                                            )
                                        })}
                                        <AddRow
                                            section={section}
                                            months={monthsArray}
                                            labelValue={newRowLabels[section.type] || ''}
                                            onLabelChange={(v) => setNewRowLabels(prev => ({ ...prev, [section.type]: v }))}
                                            onAddRow={(label) => addRow(section.type, label)}
                                            onAddRowWithValue={(monthId, value) => addRowWithValue(section.type, monthId, value)}
                                        />
                                        {/* Subtotal row — only when table has multiple sections */}
                                        {effectiveSections.length > 1 && (() => {
                                            const subtotals = computeSectionSubtotal(rows, section.type, monthsArray)
                                            const isSubtract = isSubtractType(section.type)
                                            const label = isSubtract ? 'Total descuentos' : 'Total haberes'
                                            return (
                                                <tr className={`border-t-2 ${isSubtract ? 'border-t-rose-200 bg-red-50/30' : 'border-t-emerald-200 bg-emerald-50/30'}`}>
                                                    <td className="pl-4 pr-2 py-2 text-gray-700" style={{ width: '180px' }}>
                                                        <span className={`${T.totalLabel} ${isSubtract ? 'text-rose-700' : 'text-emerald-700'}`}>{label}</span>
                                                    </td>
                                                    {monthsArray.map(p => {
                                                        const value = subtotals[p.id] ?? 0
                                                        const hasValue = value !== 0
                                                        return (
                                                            <td key={p.id} className="px-2 py-2 text-right" style={{ width: '110px' }}>
                                                                <span className={`${T.totalValue} tabular-nums ${isSubtract ? (hasValue ? 'text-rose-600' : 'text-gray-300') : (hasValue ? 'text-emerald-700' : 'text-gray-300')}`}>
                                                                    {hasValue ? formatValue(isSubtract ? -value : value) : '—'}
                                                                </span>
                                                            </td>
                                                        )
                                                    })}
                                                    <td style={{ width: '40px' }}></td>
                                                </tr>
                                            )
                                        })()}
                                    </React.Fragment>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

            </div>

            {/* Right-click context menu */}
            {contextMenu && anySelected && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    canGroup={canGroup}
                    selectedCount={selectedRows.size}
                    onGroup={startGroupNaming}
                    onCancel={clearSelection}
                    onClose={() => setContextMenu(null)}
                />
            )}
        </div>
    )
}

export default MonthlyTable
