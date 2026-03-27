import React from 'react'
import { GripVertical, Eye } from 'lucide-react'
import EditableCell from '../common/editablecell'
import { T } from '../common/styles'
import DeleteRowButton from '../common/deletebutton'
import { isSubtractType } from './helpers'
import type { RowData, Month } from './types'

type NaturalezaType = 'Imponible' | 'No imponible' | 'Legal' | 'Otro' | undefined

const naturalezaPill = (n: NaturalezaType): { label: string; style: string } => {
    switch (n) {
        case 'Imponible': return { label: 'IMP', style: 'bg-blue-50 text-blue-600 border border-blue-200' }
        case 'No imponible': return { label: 'NO IMP', style: 'bg-gray-50 text-gray-500 border border-gray-200' }
        case 'Legal': return { label: 'LEGAL', style: 'bg-green-50 text-green-600 border border-green-200' }
        case 'Otro': return { label: 'OTRO', style: 'bg-slate-50 text-slate-500 border border-slate-200' }
        default: return { label: '—', style: 'bg-gray-50 text-gray-300 border border-gray-100' }
    }
}

const rentaPill = (isVariable: boolean | undefined, naturaleza: NaturalezaType): { label: string; style: string } => {
    if (naturaleza === 'Legal') return { label: '—', style: 'bg-gray-50 text-gray-300 border border-gray-100' }
    return isVariable
        ? { label: 'RV', style: 'bg-amber-50 text-amber-600 border border-amber-200' }
        : { label: 'RF', style: 'bg-sky-50 text-sky-600 border border-sky-200' }
}

const PILL = 'rounded-sm py-0.5 text-[9px] font-semibold cursor-pointer select-none transition-opacity hover:opacity-70 block leading-tight whitespace-nowrap text-center mx-auto px-1.5'

interface DataRowProps {
    row: RowData
    months: Month[]
    isHovered: boolean
    selected?: boolean
    anySelected?: boolean
    selectable?: boolean
    hoverProps: Record<string, unknown>
    onRemove: () => void
    onToggleSelect?: () => void
    onContextMenu?: (e: React.MouseEvent) => void
    onLabelChange: (label: string) => void
    onValueChange: (monthId: string, value: number | null) => void
    onViewSource?: (fileIds: string[]) => void
    /** Keyboard nav: check if a cell is focused */
    isCellFocused?: (monthIndex: number) => boolean
    /** Keyboard nav: set focus on a cell */
    onCellFocus?: (monthIndex: number) => void
    /** Keyboard nav: navigate after edit commit */
    onNavigate?: (direction: 'up' | 'down' | 'left' | 'right') => void
    /** Keyboard nav: counter that triggers edit on focused cell */
    editTrigger?: number
    /** Keyboard nav: counter that triggers clear on focused cell */
    clearTrigger?: number
    /** Keyboard nav: initial value for type-to-edit */
    editInitialValue?: string | null
    /** Variable column */
    showVariableColumn?: boolean
    onToggleVariable?: () => void
    /** Classification columns (Tipo + Renta) */
    showClassificationColumns?: boolean
    onToggleNaturaleza?: () => void
    /** Drag reorder: is this row being dragged */
    isDragging?: boolean
    /** Drag reorder: is this the drop target, and position */
    dropIndicator?: 'above' | 'below' | null
    /** Drag reorder: drag start handler */
    onDragStart?: (e: React.DragEvent) => void
    /** Drag reorder: drag over handler */
    onDragOver?: (e: React.DragEvent) => void
    /** Drag reorder: drag leave handler */
    onDragLeave?: () => void
    /** Drag reorder: drop handler */
    onDrop?: (e: React.DragEvent) => void
    /** Drag reorder: drag end handler */
    onDragEnd?: () => void
}

const DataRow = ({
    row,
    months,
    isHovered,
    selected = false,
    anySelected = false,
    selectable = false,
    hoverProps,
    onRemove,
    onToggleSelect,
    onContextMenu,
    onLabelChange,
    onValueChange,
    onViewSource,
    isCellFocused,
    onCellFocus,
    onNavigate,
    editTrigger = 0,
    clearTrigger = 0,
    editInitialValue,
    showVariableColumn = false,
    onToggleVariable,
    showClassificationColumns = false,
    onToggleNaturaleza,
    isDragging = false,
    dropIndicator,
    onDragStart,
    onDragOver,
    onDragLeave,
    onDrop,
    onDragEnd,
}: DataRowProps) => {
    const indented = !!row.groupId
    const subtract = isSubtractType(row.type)
    const rowBg = selected
        ? 'bg-emerald-50/60'
        : row.isVariable
            ? (subtract ? 'bg-amber-50/60 hover:bg-amber-100/50' : 'bg-amber-50/40 hover:bg-amber-100/40')
            : (subtract ? 'bg-red-50/50 hover:bg-red-100/50' : 'hover:bg-gray-50')
    const showCheckbox = selectable && (anySelected || isHovered)
    const dropBorder = dropIndicator === 'above' ? 'border-t-2 border-t-blue-400'
        : dropIndicator === 'below' ? 'border-b-2 border-b-blue-400' : ''

    const handleRowClick = (e: React.MouseEvent) => {
        if (!selectable || !onToggleSelect) return
        if (!(e.metaKey || e.ctrlKey)) return
        const target = e.target as HTMLElement
        if (target.closest('input, button, [role="button"]')) return
        e.preventDefault()
        onToggleSelect()
    }

    return (
        <tr
            className={`border-b border-gray-100 ${rowBg} ${isDragging ? 'opacity-40' : ''} ${dropBorder} group`}
            onClick={handleRowClick}
            {...hoverProps}
            onContextMenu={onContextMenu}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
            <td className={`pl-1 pr-2 py-1.5 text-gray-700 ${T.cellLabel}`} style={{ width: (showClassificationColumns || showVariableColumn) ? '140px' : '180px' }}>
                <div className={`flex items-center gap-0.5 min-w-0 ${indented ? 'pl-4' : ''}`}>
                    {isHovered && onDragStart && !anySelected && (
                        <span
                            draggable
                            onDragStart={onDragStart}
                            onDragEnd={onDragEnd}
                            className="shrink-0 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500"
                            title="Arrastrar para reordenar"
                        >
                            <GripVertical size={14} />
                        </span>
                    )}
                    {showCheckbox ? (
                        <input
                            type="checkbox"
                            checked={selected}
                            onChange={onToggleSelect}
                            className="shrink-0 w-3.5 h-3.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                    ) : null}
                    <input
                        type="text"
                        value={row.label}
                        onChange={(e) => onLabelChange(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
                        }}
                        className={`flex-1 min-w-0 ${T.rowLabel} ${isHovered || showCheckbox ? '' : 'pl-1'}`}
                        title={row.label}
                    />
                    {row.sourceFileId && onViewSource && (
                        <button
                            onClick={() => onViewSource([row.sourceFileId!])}
                            className={`p-1 rounded transition-all shrink-0 ${isHovered ? 'opacity-100 text-gray-400 hover:text-gray-600 hover:bg-gray-100' : 'opacity-0'}`}
                            title="Ver documento fuente"
                        >
                            <Eye size={14} />
                        </button>
                    )}
                </div>
            </td>
            {showClassificationColumns && (() => {
                const tipo = naturalezaPill(row.naturaleza)
                const renta = rentaPill(row.isVariable, row.naturaleza)
                return (
                    <>
                        <td className="px-0.5 py-1 text-center" style={{ width: '44px' }}
                            onClick={(e) => { e.stopPropagation(); onToggleNaturaleza?.() }}
                            title={`${row.naturaleza || 'Sin tipo'} — click para cambiar`}
                        >
                            <span className={`${PILL} ${tipo.style}`}>{tipo.label}</span>
                        </td>
                        <td className="px-0.5 py-1 text-center" style={{ width: '36px' }}
                            onClick={(e) => { e.stopPropagation(); if (row.naturaleza !== 'Legal') onToggleVariable?.() }}
                            title={row.naturaleza === 'Legal' ? 'Descuento legal' : row.isVariable ? 'Variable — click para cambiar a Fija' : 'Fija — click para cambiar a Variable'}
                        >
                            <span className={`${PILL} ${renta.style}`}>{renta.label}</span>
                        </td>
                    </>
                )
            })()}
            {showVariableColumn && !showClassificationColumns && (() => {
                const renta = rentaPill(row.isVariable, undefined)
                return (
                    <td className="px-0.5 py-1 text-center" style={{ width: '28px' }}
                        onClick={(e) => { e.stopPropagation(); onToggleVariable?.() }}
                        title={row.isVariable ? 'Variable — click para cambiar a Fija' : 'Fija — click para cambiar a Variable'}
                    >
                        <span className={`${PILL} ${renta.style}`}>{renta.label}</span>
                    </td>
                )
            })()}
            {months.map((p, mi) => {
                const cellFocused = isCellFocused?.(mi) ?? false
                return (
                    <EditableCell
                        key={p.id}
                        value={row.values[p.id] ?? null}
                        onChange={(v) => onValueChange(p.id, v as number | null)}
                        isDeduction={subtract}
                        hasData={row.values[p.id] !== undefined && row.values[p.id] !== null}
                        width="110px"
                        type="currency"
                        onViewSource={p.sourceFileId && onViewSource ? () => onViewSource([p.sourceFileId!]) : undefined}
                        focused={cellFocused}
                        onCellFocus={onCellFocus ? () => onCellFocus(mi) : undefined}
                        onNavigate={onNavigate}
                        requestEdit={cellFocused ? editTrigger : 0}
                        requestClear={cellFocused ? clearTrigger : 0}
                        editInitialValue={cellFocused ? editInitialValue : undefined}
                    />
                )
            })}
            <td style={{ width: '40px' }} className="text-center">
                <DeleteRowButton onClick={onRemove} isVisible={isHovered && !anySelected} title="Eliminar fila" />
            </td>
        </tr>
    )
}

export default DataRow
