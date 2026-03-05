import React from 'react'
import { GripVertical, X, Eye } from 'lucide-react'
import EditableCell from './editablecell'
import { T } from './styles'
import { isSubtractType } from './helpers'
import type { RowData, Month } from './types'

interface DataRowProps {
    row: RowData
    months: Month[]
    isHovered: boolean
    indented?: boolean
    selected?: boolean
    anySelected?: boolean
    selectable?: boolean
    onMouseEnter: () => void
    onMouseLeave: () => void
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
    indented = false,
    selected = false,
    anySelected = false,
    selectable = false,
    onMouseEnter,
    onMouseLeave,
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
    isDragging = false,
    dropIndicator,
    onDragStart,
    onDragOver,
    onDragLeave,
    onDrop,
    onDragEnd,
}: DataRowProps) => {
    const subtract = isSubtractType(row.type)
    const rowBg = selected
        ? 'bg-emerald-50/60'
        : subtract ? 'bg-red-50/50 hover:bg-red-100/50' : 'hover:bg-gray-50'
    const showCheckbox = selectable && (anySelected || isHovered)
    const dropBorder = dropIndicator === 'above' ? 'border-t-2 border-t-blue-400'
        : dropIndicator === 'below' ? 'border-b-2 border-b-blue-400' : ''

    return (
        <tr
            className={`border-b border-gray-100 ${rowBg} ${isDragging ? 'opacity-40' : ''} ${dropBorder} group`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onContextMenu={onContextMenu}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
            <td className={`pl-1 pr-2 py-1.5 text-gray-700 ${T.cellLabel}`} style={{ width: '180px' }}>
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
                    ) : isHovered ? (
                        <button
                            onClick={onRemove}
                            className="p-0.5 rounded shrink-0 text-red-400 hover:text-red-600 hover:bg-red-100"
                            title="Eliminar fila"
                        >
                            <X size={14} />
                        </button>
                    ) : null}
                    <input
                        type="text"
                        value={row.label}
                        onChange={(e) => onLabelChange(e.target.value)}
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
                    />
                )
            })}
            <td style={{ width: '40px' }}></td>
        </tr>
    )
}

export default DataRow
