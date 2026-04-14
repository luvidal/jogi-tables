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
    const dropBorder = dropIndicator === 'above' ? 'border-t-2 border-t-brand'
        : dropIndicator === 'below' ? 'border-b-2 border-b-brand' : ''

    return (
        <tr
            className={`border-b border-edge-subtle/10 ${subtract ? 'bg-status-pending/10' : 'bg-surface-1/60'} ${isDragging ? 'opacity-40' : ''} ${dropBorder} group`}
            {...hoverProps}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
            <td className={`${T.cellEditLabel} text-ink-secondary overflow-hidden ${showClassificationColumns ? '' : T.vline}`}>
                <div className="flex items-center gap-0.5 min-w-0">
                    {onDragStart && (
                        <span
                            draggable={isHovered}
                            onDragStart={onDragStart}
                            onDragEnd={onDragEnd}
                            className={`shrink-0 cursor-grab active:cursor-grabbing text-ink-tertiary/60 hover:text-ink-tertiary transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                            title="Arrastrar para reordenar"
                        >
                            <GripVertical size={14} />
                        </span>
                    )}
                    <button
                        onClick={onToggleCollapse}
                        className="p-0.5 rounded shrink-0 text-ink-tertiary hover:text-ink-secondary hover:bg-surface-2"
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
                        className="flex-1 min-w-0 bg-transparent border-none outline-none text-xs font-semibold text-ink-secondary truncate"
                        title={group.label}
                    />
                </div>
            </td>
            {showClassificationColumns && <><td className={T.cellCompact} /><td className={`${T.cellCompact} ${T.vline}`} /></>}
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
                            <span className={`text-xs tabular-nums font-medium ${subtract ? (hasValue ? 'text-status-pending' : 'text-ink-tertiary/60') : (hasValue ? 'text-ink-primary' : 'text-ink-tertiary/60')}`}>
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
                        className="p-0.5 rounded text-ink-tertiary hover:text-ink-secondary hover:bg-surface-2"
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
