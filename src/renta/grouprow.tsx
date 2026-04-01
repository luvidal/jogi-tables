import React, { useMemo } from 'react'
import { GripVertical, ChevronDown, ChevronRight, Ungroup } from 'lucide-react'
import { computeGroupValues } from './helpers'
import { isSubtractType } from './helpers'
import { T } from '../common/styles'
import type { RowData, Month } from './types'

interface GroupRowProps {
    group: RowData
    childRows: RowData[]
    months: Month[]
    isHovered: boolean
    forceExpanded: boolean
    formatValue: (value: number | null | undefined) => string
    hoverProps: Record<string, unknown>
    onToggleCollapse: () => void
    onUngroup: () => void
    onLabelChange: (label: string) => void
    /** Variable column */
    showVariableColumn?: boolean
    showClassificationColumns?: boolean
    /** Drag reorder props */
    isDragging?: boolean
    dropIndicator?: 'above' | 'below' | null
    onDragStart?: (e: React.DragEvent) => void
    onDragOver?: (e: React.DragEvent) => void
    onDragLeave?: () => void
    onDrop?: (e: React.DragEvent) => void
    onDragEnd?: () => void
}

const GroupRow = ({
    group,
    childRows,
    months,
    isHovered,
    forceExpanded,
    formatValue,
    hoverProps,
    onToggleCollapse,
    onUngroup,
    onLabelChange,
    showVariableColumn = false,
    showClassificationColumns = false,
    isDragging = false,
    dropIndicator,
    onDragStart,
    onDragOver,
    onDragLeave,
    onDrop,
    onDragEnd,
}: GroupRowProps) => {
    const groupValues = useMemo(() => computeGroupValues(childRows, months), [childRows, months])
    const subtract = isSubtractType(group.type)
    const isExpanded = forceExpanded || !group.collapsed
    const dropBorder = dropIndicator === 'above' ? 'border-t-2 border-t-blue-400'
        : dropIndicator === 'below' ? 'border-b-2 border-b-blue-400' : ''

    return (
        <tr
            className={`border-b border-gray-200 ${subtract ? 'bg-red-50/30' : 'bg-gray-50/50'} ${isDragging ? 'opacity-40' : ''} ${dropBorder} group`}
            {...hoverProps}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
            <td className={`${T.cellEditLabel} text-gray-700 overflow-hidden ${T.vline}`}>
                <div className="flex items-center gap-0.5 min-w-0">
                    {isHovered && onDragStart && (
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
                    <button
                        onClick={onToggleCollapse}
                        className="p-0.5 rounded shrink-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                        title={isExpanded ? 'Colapsar grupo' : 'Expandir grupo'}
                    >
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                    <input
                        type="text"
                        value={group.label}
                        onChange={(e) => onLabelChange(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
                        }}
                        className="flex-1 min-w-0 bg-transparent border-none outline-none text-xs font-semibold text-gray-700 truncate"
                        title={group.label}
                    />
                </div>
            </td>
            {showClassificationColumns && <><td className={`${T.cellCompact} text-center`}><span className={T.empty}>—</span></td><td className={`${T.cellCompact} text-center`}><span className={T.empty}>—</span></td></>}
            {showVariableColumn && !showClassificationColumns && <td className={`${T.cellCompact} text-center ${T.vline}`}><span className={T.empty}>—</span></td>}
            {months.map((p, mi) => {
                const value = groupValues[p.id] ?? 0
                const hasValue = value !== 0
                const vline = mi < months.length - 1 ? T.vline : ''
                return (
                    <td
                        key={p.id}
                        className={`${T.cellEdit} text-right ${vline}`}
                    >
                        <div className="h-5 flex items-center justify-end">
                            <span className={`text-xs tabular-nums font-medium ${subtract ? (hasValue ? 'text-rose-600' : 'text-gray-300') : (hasValue ? 'text-gray-800' : 'text-gray-300')}`}>
                                {hasValue ? formatValue(value) : '—'}
                            </span>
                        </div>
                    </td>
                )
            })}
            <td className={`${T.actionCol} text-center`}>
                {isHovered && (
                    <button
                        onClick={onUngroup}
                        className="p-0.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                        title="Desagrupar"
                    >
                        <Ungroup size={14} />
                    </button>
                )}
            </td>
        </tr>
    )
}

export default GroupRow
