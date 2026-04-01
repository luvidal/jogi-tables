// EditableCell — inlined from jogi's components/forms/editablecell.tsx
// Replaced @/ imports with local package imports

import { useState, useRef, useEffect } from 'react'
import { Eye } from 'lucide-react'
import { T } from './styles'
import { useIsMobile } from './usemobile'
import { displayCurrencyCompact, displayCurrency } from './utils'

const parseCurrency = (value: string): number | null => {
    const cleaned = value.replace(/[^0-9-]/g, '')
    const num = parseInt(cleaned, 10)
    return isNaN(num) ? null : num
}

interface EditableCellProps {
    value: number | string | null | undefined
    onChange: (value: number | string | null) => void
    type?: 'text' | 'number' | 'currency' | 'percent'
    isDeduction?: boolean
    hasData?: boolean
    className?: string
    align?: 'left' | 'center' | 'right'
    placeholder?: string
    /** Callback to view source document - shows Eye icon on hover */
    onViewSource?: () => void
    /** Render as div instead of td (for non-table contexts) */
    asDiv?: boolean
    /** Show focus ring (keyboard navigation) */
    focused?: boolean
    /** Called when cell is clicked (for focus tracking) */
    onCellFocus?: () => void
    /** Called after edit commit to navigate to next cell (Tab→right, Enter→down) */
    onNavigate?: (direction: 'up' | 'down' | 'left' | 'right') => void
    /** Increment to trigger edit externally (keyboard Enter/F2 on focused cell) */
    requestEdit?: number
    /** Increment to clear the cell value (keyboard Delete/Backspace on focused cell) */
    requestClear?: number
    /** Initial value for type-to-edit (the character pressed to start editing) */
    editInitialValue?: string | null
}

/**
 * EditableCell - An inline-editable table cell
 *
 * Click to select (focus ring), double-click/Enter/F2/type to edit.
 * IMPORTANT: This component uses a fixed-size container to prevent layout shifts
 * when toggling between display and edit modes. The input is absolutely positioned
 * within a fixed-height container so clicking to edit does NOT scramble/shift
 * the table layout.
 */
const EditableCell = ({
    value,
    onChange,
    type = 'currency',
    isDeduction = false,
    hasData = true,
    className = '',
    align = 'right',
    placeholder = '',
    onViewSource,
    asDiv = false,
    focused = false,
    onCellFocus,
    onNavigate,
    requestEdit = 0,
    requestClear = 0,
    editInitialValue,
}: EditableCellProps) => {
    const isMobile = useIsMobile()
    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState('')
    const [isHovered, setIsHovered] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const startEdit = (initialValue?: string) => {
        setEditValue(initialValue ?? value?.toString() ?? '')
        setIsEditing(true)
    }

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus()
            // For type-to-edit, place cursor at end; otherwise select all
            if (editValue.length <= 1) {
                // Single char from type-to-edit — cursor at end
                const len = inputRef.current.value.length
                inputRef.current.setSelectionRange(len, len)
            } else {
                inputRef.current.select()
            }
        }
    }, [isEditing])

    const commitEdit = () => {
        setIsEditing(false)
        let newValue: number | string | null = editValue

        if (type === 'number') {
            newValue = editValue === '' ? null : parseInt(editValue, 10)
            if (typeof newValue === 'number' && isNaN(newValue)) newValue = null
        } else if (type === 'currency') {
            newValue = parseCurrency(editValue)
        } else if (type === 'percent') {
            newValue = editValue === '' ? null : parseFloat(editValue)
            if (typeof newValue === 'number' && isNaN(newValue)) newValue = null
        } else {
            newValue = editValue === '' ? null : editValue
        }

        // Call onChange if value changed
        // Note: using != to catch null/undefined differences
        if (newValue != value) {
            onChange(newValue)
        }
    }

    const cancelEdit = () => {
        setIsEditing(false)
        setEditValue('')
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            commitEdit()
            onNavigate?.('down')
        } else if (e.key === 'Tab') {
            e.preventDefault()
            commitEdit()
            onNavigate?.(e.shiftKey ? 'left' : 'right')
        } else if (e.key === 'Escape') {
            cancelEdit()
        }
    }

    // Format display value based on type
    const getDisplayValue = () => {
        if (type === 'currency') {
            return displayCurrencyCompact(value as number, isDeduction)
        }
        if (type === 'percent') {
            if (value === null || value === undefined) return '—'
            return `${value}%`
        }
        return value?.toString() || '—'
    }

    const displayValue = getDisplayValue()

    // Color classes based on state
    const colorClass = isDeduction && type === 'currency'
        ? (hasData ? 'text-rose-600' : 'text-gray-300')
        : (hasData ? 'text-gray-800' : 'text-gray-300')

    // Alignment classes
    const alignClass = align === 'left' ? 'text-left justify-start' : align === 'center' ? 'text-center justify-center' : 'text-right justify-end'
    const inputAlignClass = align === 'left' ? 'text-left' : align === 'center' ? 'text-center' : 'text-right'

    const Wrapper = asDiv ? 'div' : 'td'

    // Trigger edit externally (keyboard Enter/F2 or type-to-edit)
    useEffect(() => {
        if (requestEdit > 0 && !isEditing) {
            startEdit(editInitialValue ?? undefined)
        }
    }, [requestEdit])

    // Trigger clear externally (keyboard Delete/Backspace)
    useEffect(() => {
        if (requestClear > 0) {
            onChange(null)
        }
    }, [requestClear])

    // Click to select (focus ring only), double-click to edit
    const handleClick = () => {
        if (!isEditing) {
            onCellFocus?.()
        }
    }

    const handleDoubleClick = () => {
        if (!isEditing) {
            onCellFocus?.()
            startEdit()
        }
    }

    const focusRing = focused && !isEditing ? 'ring-2 ring-blue-400 ring-inset' : ''

    return (
        <Wrapper
            className={`${T.cellEdit} cursor-pointer ${focusRing} ${className}`}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`h-5 flex items-center ${alignClass} gap-1`}>
                {onViewSource && (isMobile || isHovered) && !isEditing && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onViewSource()
                        }}
                        className={`p-0.5 rounded hover:bg-gray-200 transition-all shrink-0 ${isMobile ? 'opacity-100' : ''}`}
                        title="Ver documento fuente"
                    >
                        <Eye size={14} className="text-gray-400" />
                    </button>
                )}
                {isEditing ? (
                    <input
                        ref={inputRef}
                        type="text"
                        inputMode={type === 'currency' || type === 'number' ? 'numeric' : undefined}
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        onBlur={commitEdit}
                        onKeyDown={handleKeyDown}
                        className={`w-full ${inputAlignClass} text-xs tabular-nums bg-transparent border-none outline-none p-0`}
                        autoComplete="off"
                    />
                ) : (
                    <span
                        className={`text-xs tabular-nums ${colorClass} ${!hasData ? 'text-gray-300' : ''}`}
                        title={type === 'currency' && hasData ? displayCurrency(value as number) : undefined}
                    >
                        {displayValue}
                    </span>
                )}
            </div>
        </Wrapper>
    )
}

export default EditableCell
