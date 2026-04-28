import { Eye, GripVertical, X } from 'lucide-react'
import type { DragEvent } from 'react'

/**
 * Row hover toolbar — slides in from the left edge of a table row, overlaying
 * the leftmost characters of the first cell. Replaces the legacy right-side
 * action column. Order: drag handle · checkbox · delete.
 *
 * Visibility: hidden by default; revealed when `hovered` (or `focusWithin`,
 * for keyboard a11y). The checkbox has additional "selection mode" semantics —
 * when `anySelected` is true, every checkbox stays visible so analysts can
 * extend a selection without hovering each row.
 *
 * Place inside the first cell of the row with the row container having
 * `position: relative` (and ideally `group` for tailwind hover propagation).
 * The toolbar covers the cell's left edge — no extra layout column needed.
 */
interface RowToolbarProps {
    hovered: boolean
    /** True when at least one row in the table is selected (drives "selection mode" checkbox) */
    anySelected?: boolean
    /** Whether this row is currently selected */
    selected?: boolean
    /** Show drag handle */
    reorderable?: boolean
    onDragStart?: (e: DragEvent) => void
    onDragEnd?: () => void
    /** Show checkbox */
    selectable?: boolean
    onToggleSelect?: () => void
    /** Show delete button */
    onDelete?: () => void
    /** Show source-file Eye button (when row has a sourceFileId) */
    sourceFileId?: string
    onViewSource?: (fileIds: string[]) => void
}

const RowToolbar = ({
    hovered,
    anySelected = false,
    selected = false,
    reorderable = false,
    onDragStart,
    onDragEnd,
    selectable = false,
    onToggleSelect,
    onDelete,
    sourceFileId,
    onViewSource,
}: RowToolbarProps) => {
    // Toolbar slides in on hover (or when sibling input is focused via group-focus-within).
    // Selection mode keeps the toolbar visible too — analysts need to see + extend the selection.
    const reveal = hovered || anySelected
    const transform = reveal ? 'translate-x-0 opacity-100 pointer-events-auto' : '-translate-x-full opacity-0 pointer-events-none'

    return (
        <div
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 flex items-center gap-0.5 px-1 py-0.5 rounded-r bg-surface-1/85 backdrop-blur-sm shadow-sm transition-[transform,opacity] duration-150 ease-out ${transform} group-focus-within:translate-x-0 group-focus-within:opacity-100 group-focus-within:pointer-events-auto`}
            // Stop propagation so a click on the toolbar doesn't toggle row select
            onClick={e => e.stopPropagation()}
            // Keep toolbar visible while cursor is over it (avoids flicker when crossing
            // from row body → toolbar). The parent's onMouseLeave still fires when we
            // leave the toolbar entirely.
            onMouseDown={e => e.stopPropagation()}
        >
            {reorderable && onDragStart && (
                <span
                    draggable={hovered}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    className="cursor-grab active:cursor-grabbing text-ink-tertiary/70 hover:text-ink-secondary p-0.5 rounded"
                    title="Arrastrar para reordenar"
                >
                    <GripVertical size={14} />
                </span>
            )}
            {selectable && onToggleSelect && (
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={onToggleSelect}
                    className="w-3.5 h-3.5 rounded border-edge-subtle/30 text-status-ok focus:ring-status-ok cursor-pointer"
                    title="Seleccionar fila"
                />
            )}
            {onDelete && (
                <button
                    type="button"
                    onClick={onDelete}
                    className="p-0.5 rounded text-status-pending/70 hover:text-status-pending hover:bg-status-pending/10"
                    title="Eliminar fila"
                    disabled={anySelected}
                >
                    <X size={14} />
                </button>
            )}
            {sourceFileId && onViewSource && (
                <button
                    type="button"
                    onClick={() => onViewSource([sourceFileId])}
                    className="p-0.5 rounded text-ink-tertiary hover:text-ink-primary hover:bg-surface-2"
                    title="Ver documento fuente"
                >
                    <Eye size={14} />
                </button>
            )}
        </div>
    )
}

export default RowToolbar
