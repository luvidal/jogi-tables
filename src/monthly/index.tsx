import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { T } from '../common/styles'
import TableShell, { SourceIcon } from '../common/tableshell'
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
    softDeleteRows,
    restoreRows,
    computeSectionSubtotal,
    computeRentaVariable,
} from './helpers'
import DataRow from './datarow'
import AddRow from './addrow'
import GroupRow from './grouprow'
import DeleteDialog from './deletedialog'
import RecycleBin from './recyclebin'
import { HeaderSelectionBar, ContextMenu } from './floatingaction'
import { useKeyboard } from './usekeyboard'
import { useDragReorder } from './usedragreorder'

import type { RowData, MonthlyTableProps } from './types'

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
    defaultCollapsed = false,
    forceExpanded = false,
    formatValue = defaultFormatValue,
    calculateTotal = defaultCalculateTotal,
    showVariableColumn = false,
    sourceFileIds,
    onViewSource,
}: MonthlyTableProps) => {
    const [hoveredRow, setHoveredRow] = useState<string | null>(null)
    const [newRowLabels, setNewRowLabels] = useState<Record<string, string>>({})
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
    const [naming, setNaming] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState<Set<string> | null>(null)

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

    // Can group: 2+ selected, all same type family, none are group headers
    const canGroup = useMemo(() => {
        if (selectedRows.size < 2) return false
        const selected = rows.filter(r => selectedRows.has(r.id))
        if (selected.some(r => r.isGroup)) return false
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

    const requestDelete = useCallback((rowId: string) => {
        const row = rows.find(r => r.id === rowId)
        if (!row) return
        if (row.isGroup) {
            // Group headers ungroup immediately (no recycle bin)
            onRowsChange(ungroupRows(rows, rowId))
            return
        }
        setDeleteTarget(new Set([rowId]))
    }, [rows, onRowsChange])

    const requestDeleteSelected = useCallback(() => {
        setDeleteTarget(new Set(selectedRows))
    }, [selectedRows])

    const confirmDelete = useCallback((reason: string) => {
        if (!deleteTarget) return
        const newRows = softDeleteRows(rows, deleteTarget, reason)
        onRowsChange(newRows)
        clearSelection()
        setDeleteTarget(null)
    }, [rows, deleteTarget, onRowsChange, clearSelection])

    const handleRestore = useCallback((rowId: string) => {
        onRowsChange(restoreRows(rows, new Set([rowId])))
    }, [rows, onRowsChange])

    const deletedRows = useMemo(() =>
        rows.filter(r => r.deletedAt && !r.isGroup),
    [rows])

    const toggleGroupCollapse = useCallback((groupId: string) => {
        onRowsChange(rows.map(r => r.id === groupId ? { ...r, collapsed: !r.collapsed } : r))
    }, [rows, onRowsChange])

    const handleUngroup = useCallback((groupId: string) => {
        onRowsChange(ungroupRows(rows, groupId))
    }, [rows, onRowsChange])

    const toggleVariable = useCallback((rowId: string) => {
        onRowsChange(rows.map(r => r.id === rowId ? { ...r, isVariable: !r.isVariable } : r))
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

    const renderDataRow = (r: RowData) => (
        <DataRow
            key={r.id}
            row={r}
            months={monthsArray}
            isHovered={hoveredRow === r.id}
            selected={selectedRows.has(r.id)}
            anySelected={anySelected}
            selectable={!r.isGroup}
            onMouseEnter={() => setHoveredRow(r.id)}
            onMouseLeave={() => setHoveredRow(null)}
            onRemove={() => requestDelete(r.id)}
            onToggleSelect={() => toggleSelect(r.id)}
            onContextMenu={(e) => handleContextMenu(e, r.id)}
            onLabelChange={(label) => updateRowLabel(r.id, label)}
            onValueChange={(monthId, value) => updateRowValue(r.id, monthId, value)}
            onViewSource={onViewSource}
            showVariableColumn={showVariableColumn}
            onToggleVariable={() => toggleVariable(r.id)}
            isCellFocused={(mi) => keyboard.isFocused(r.id, mi)}
            onCellFocus={(mi) => keyboard.focus(r.id, mi)}
            onNavigate={keyboard.navigateAndEdit}
            editTrigger={keyboard.editTrigger}
            isDragging={drag.dragRowId === r.id}
            dropIndicator={drag.dropTargetId === r.id ? drag.dropPosition : null}
            onDragStart={drag.handleDragStart(r.id)}
            onDragOver={drag.handleDragOver(r.id)}
            onDragLeave={drag.handleDragLeave}
            onDrop={drag.handleDrop(rows, onRowsChange)}
            onDragEnd={drag.handleDragEnd}
        />
    )

    return (
        <TableShell
            headerBg={headerBg}
            headerText={headerText}
            defaultCollapsed={defaultCollapsed}
            forceExpanded={forceExpanded}
            disableToggle={anySelected}
            contentClassName="outline-none"
            contentProps={{
                tabIndex: 0,
                onKeyDown: keyboard.handleContainerKeyDown,
            }}
            renderHeader={({ isExpanded }) => (
                <div className="overflow-x-auto">
                    <table className={T.table} style={{ tableLayout: 'fixed' }}>
                        <tbody>
                            <tr>
                                {anySelected ? (
                                    <HeaderSelectionBar
                                        selectedCount={selectedRows.size}
                                        canGroup={canGroup}
                                        monthCount={monthsArray.length}
                                        naming={naming}
                                        onNamingChange={setNaming}
                                        onGroup={handleGroup}
                                        onDeleteSelected={requestDeleteSelected}
                                        onCancel={() => { clearSelection(); setNaming(false) }}
                                        showVariableColumn={showVariableColumn}
                                    />
                                ) : (
                                    <>
                                        <td className="px-4 py-2.5 text-left" style={{ width: '180px' }}>
                                            <div className="flex items-center gap-2">
                                                {!forceExpanded && (
                                                    isExpanded ? <ChevronUp size={16} className={headerText} /> : <ChevronDown size={16} className={headerText} />
                                                )}
                                                <span className={`${headerText} ${T.headerTitle}`}>{title}</span>
                                                <SourceIcon fileIds={sourceFileIds} onViewSource={onViewSource} className={headerText} />
                                            </div>
                                        </td>
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
                                        {/* Spacer aligns with body rows' actions column */}
                                        <td style={{ width: '40px' }} />
                                    </>
                                )}
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
            renderAfterContent={({ isExpanded }) => (
                <>
                    {/* Recycle bin footer */}
                    {isExpanded && (
                        <RecycleBin deletedRows={deletedRows} months={monthsArray} onRestore={handleRestore} formatValue={formatValue} showVariableColumn={showVariableColumn} />
                    )}

                    {/* Delete confirmation dialog */}
                    {deleteTarget && (
                        <DeleteDialog
                            count={deleteTarget.size}
                            onConfirm={confirmDelete}
                            onCancel={() => setDeleteTarget(null)}
                        />
                    )}

                    {/* Right-click context menu */}
                    {contextMenu && anySelected && (
                        <ContextMenu
                            x={contextMenu.x}
                            y={contextMenu.y}
                            canGroup={canGroup}
                            selectedCount={selectedRows.size}
                            onGroup={startGroupNaming}
                            onDeleteSelected={requestDeleteSelected}
                            onCancel={clearSelection}
                            onClose={() => setContextMenu(null)}
                        />
                    )}
                </>
            )}
        >
            <div className="overflow-x-auto">
                <table className={T.table} style={{ tableLayout: 'fixed' }}>
                    <tbody>
                        {effectiveSections.map((section) => {
                            const items = getOrderedItems(rows, section.type)
                            return (
                                <React.Fragment key={section.type}>
                                    {/* Subtotal row at TOP of section — only when table has multiple sections */}
                                    {effectiveSections.length > 1 && (() => {
                                        const subtotals = computeSectionSubtotal(rows, section.type, monthsArray)
                                        const isSubtract = isSubtractType(section.type)
                                        const label = isSubtract ? 'Total descuentos' : 'Total haberes'
                                        return (
                                            <tr className={`border-b-2 ${isSubtract ? 'border-b-rose-200 bg-red-50/30' : 'border-b-emerald-200 bg-emerald-50/30'}`}>
                                                <td className="pl-4 pr-2 py-2 text-gray-700" style={{ width: '180px' }}>
                                                    <span className={`${T.totalLabel} ${isSubtract ? 'text-rose-700' : 'text-emerald-700'}`}>{label}</span>
                                                </td>
                                                {monthsArray.map(p => {
                                                    const value = subtotals[p.id] ?? 0
                                                    const hasValue = value !== 0
                                                    const display = isSubtract ? `-${formatValue(value)}` : formatValue(value)
                                                    return (
                                                        <td key={p.id} className="px-2 py-2 text-right" style={{ width: '110px' }}>
                                                            <span className={`${T.totalValue} tabular-nums ${isSubtract ? (hasValue ? 'text-rose-600' : 'text-gray-300') : (hasValue ? 'text-emerald-700' : 'text-gray-300')}`}>
                                                                {hasValue ? display : '—'}
                                                            </span>
                                                        </td>
                                                    )
                                                })}
                                                <td style={{ width: '40px' }} />
                                            </tr>
                                        )
                                    })()}
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
                                                        showVariableColumn={showVariableColumn}
                                                        isDragging={drag.dragRowId === group.id}
                                                        dropIndicator={drag.dropTargetId === group.id ? drag.dropPosition : null}
                                                        onDragStart={drag.handleDragStart(group.id)}
                                                        onDragOver={drag.handleDragOver(group.id)}
                                                        onDragLeave={drag.handleDragLeave}
                                                        onDrop={drag.handleDrop(rows, onRowsChange)}
                                                        onDragEnd={drag.handleDragEnd}
                                                    />
                                                    {showChildren && groupChildren.map(child => renderDataRow(child))}
                                                </React.Fragment>
                                            )
                                        }
                                        return renderDataRow(item.row)
                                    })}
                                    <AddRow
                                        section={section}
                                        months={monthsArray}
                                        labelValue={newRowLabels[section.type] || ''}
                                        onLabelChange={(v) => setNewRowLabels(prev => ({ ...prev, [section.type]: v }))}
                                        onAddRow={(label) => addRow(section.type, label)}
                                        onAddRowWithValue={(monthId, value) => addRowWithValue(section.type, monthId, value)}
                                        showVariableColumn={showVariableColumn}
                                    />
                                </React.Fragment>
                            )
                        })}
                        {/* Summary rows — Renta Líquida, Renta Variable, Renta Fija */}
                        {showVariableColumn && effectiveSections.length > 1 && (() => {
                            const rentaVariable = computeRentaVariable(rows, monthsArray)
                            // formatValue strips negatives (displayCurrencyCompact uses Math.abs).
                            // Summary rows can be negative, so we prefix the sign manually.
                            const fmtSigned = (v: number) => v < 0 ? `-${formatValue(-v)}` : formatValue(v)
                            return (
                                <>
                                    {/* Renta Líquida = Total Haberes - Total Descuentos */}
                                    <tr className="border-t-2 border-t-blue-200 bg-blue-50">
                                        <td className="pl-4 pr-2 py-2" style={{ width: '180px' }}>
                                            <span className={`${T.totalLabel} text-blue-800`}>Renta Líquida</span>
                                        </td>
                                        {monthsArray.map(p => {
                                            const value = calculateTotal(p.id, rows)
                                            const hasValue = value !== 0
                                            return (
                                                <td key={p.id} className="px-2 py-2 text-right" style={{ width: '110px' }}>
                                                    <span className={`${T.totalValue} tabular-nums font-semibold ${hasValue ? 'text-blue-800' : 'text-gray-300'}`}>
                                                        {hasValue ? fmtSigned(value) : '—'}
                                                    </span>
                                                </td>
                                            )
                                        })}
                                        <td style={{ width: '40px' }} />
                                    </tr>
                                    {/* Renta Variable = sum of variable-flagged items */}
                                    <tr className="border-b border-gray-100 bg-amber-50/50">
                                        <td className="pl-4 pr-2 py-2" style={{ width: '180px' }}>
                                            <span className={`${T.totalLabel} text-amber-700`}>Renta Variable</span>
                                        </td>
                                        {monthsArray.map(p => {
                                            const value = rentaVariable[p.id] ?? 0
                                            const hasValue = value !== 0
                                            return (
                                                <td key={p.id} className="px-2 py-2 text-right" style={{ width: '110px' }}>
                                                    <span className={`${T.totalValue} tabular-nums ${hasValue ? 'text-amber-700' : 'text-gray-300'}`}>
                                                        {hasValue ? fmtSigned(value) : '—'}
                                                    </span>
                                                </td>
                                            )
                                        })}
                                        <td style={{ width: '40px' }} />
                                    </tr>
                                    {/* Renta Fija = Renta Líquida - Renta Variable */}
                                    <tr className="border-b border-gray-200 bg-emerald-50/50">
                                        <td className="pl-4 pr-2 py-2" style={{ width: '180px' }}>
                                            <span className={`${T.totalLabel} text-emerald-700`}>Renta Fija</span>
                                        </td>
                                        {monthsArray.map(p => {
                                            const liquida = calculateTotal(p.id, rows)
                                            const variable = rentaVariable[p.id] ?? 0
                                            const fija = liquida - variable
                                            const hasValue = fija !== 0
                                            return (
                                                <td key={p.id} className="px-2 py-2 text-right" style={{ width: '110px' }}>
                                                    <span className={`${T.totalValue} tabular-nums ${hasValue ? 'text-emerald-700' : 'text-gray-300'}`}>
                                                        {hasValue ? fmtSigned(fija) : '—'}
                                                    </span>
                                                </td>
                                            )
                                        })}
                                        <td style={{ width: '40px' }} />
                                    </tr>
                                </>
                            )
                        })()}
                    </tbody>
                </table>
            </div>
        </TableShell>
    )
}

export default MonthlyTable
