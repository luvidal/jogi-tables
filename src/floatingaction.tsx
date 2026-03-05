import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { FoldVertical, X, Check } from 'lucide-react'

// ============================================================================
// Context menu (right-click on rows)
// ============================================================================

interface ContextMenuProps {
    x: number
    y: number
    canGroup: boolean
    selectedCount: number
    onGroup: () => void
    onCancel: () => void
    onClose: () => void
}

export const ContextMenu = ({ x, y, canGroup, selectedCount, onGroup, onCancel, onClose }: ContextMenuProps) => {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handle = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) onClose()
        }
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        document.addEventListener('mousedown', handle)
        document.addEventListener('keydown', handleKey)
        return () => {
            document.removeEventListener('mousedown', handle)
            document.removeEventListener('keydown', handleKey)
        }
    }, [onClose])

    // Adjust position to keep menu on screen
    useEffect(() => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        if (rect.right > window.innerWidth) {
            ref.current.style.left = `${window.innerWidth - rect.width - 8}px`
        }
        if (rect.bottom > window.innerHeight) {
            ref.current.style.top = `${window.innerHeight - rect.height - 8}px`
        }
    }, [])

    const menu = (
        <div
            ref={ref}
            className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[180px] print:hidden"
            style={{ left: x, top: y }}
        >
            <button
                onClick={() => { onGroup(); onClose() }}
                disabled={!canGroup}
                className="w-full px-3 py-1.5 text-left text-xs flex items-center gap-2 hover:bg-gray-50 disabled:text-gray-300 disabled:hover:bg-transparent"
            >
                <FoldVertical size={14} />
                Agrupar {selectedCount} filas
            </button>
            <button
                onClick={() => { onCancel(); onClose() }}
                className="w-full px-3 py-1.5 text-left text-xs flex items-center gap-2 hover:bg-gray-50 text-gray-600"
            >
                <X size={14} />
                Cancelar selección
            </button>
        </div>
    )

    if (typeof document !== 'undefined') {
        return createPortal(menu, document.body)
    }
    return menu
}

// ============================================================================
// Header selection bar (replaces month totals when rows are selected)
// ============================================================================

interface HeaderSelectionBarProps {
    selectedCount: number
    canGroup: boolean
    monthCount: number
    naming: boolean
    onNamingChange: (v: boolean) => void
    onGroup: (name: string) => void
    onCancel: () => void
}

export const HeaderSelectionBar = ({ selectedCount, canGroup, monthCount, naming, onNamingChange, onGroup, onCancel }: HeaderSelectionBarProps) => {
    const [groupName, setGroupName] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (naming && inputRef.current) {
            inputRef.current.focus()
        }
    }, [naming])

    // Reset when selection is cleared
    useEffect(() => {
        if (selectedCount === 0) {
            setGroupName('')
        }
    }, [selectedCount])

    const handleSubmit = () => {
        const name = groupName.trim()
        if (name) {
            onGroup(name)
            onNamingChange(false)
            setGroupName('')
        }
    }

    return (
        <>
            {/* Span all month columns + chevron column */}
            <td
                colSpan={monthCount + 1}
                className="px-4 py-2.5 text-right"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-end gap-2">
                    <span className="text-xs text-gray-500 mr-1">
                        {selectedCount} fila{selectedCount !== 1 ? 's' : ''}
                    </span>

                    {naming ? (
                        <div className="flex items-center gap-1.5">
                            <input
                                ref={inputRef}
                                type="text"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                placeholder="Nombre del grupo..."
                                className="text-xs border border-gray-300 bg-white text-gray-800 placeholder-gray-400 rounded px-2 py-1 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 w-44"
                                onKeyDown={(e) => {
                                    e.stopPropagation()
                                    if (e.key === 'Enter') handleSubmit()
                                    if (e.key === 'Escape') { onNamingChange(false); setGroupName('') }
                                }}
                            />
                            <button
                                onClick={handleSubmit}
                                disabled={!groupName.trim()}
                                className="p-1 rounded text-emerald-700 hover:bg-emerald-100 disabled:text-gray-300 disabled:hover:bg-transparent"
                                title="Confirmar"
                            >
                                <Check size={14} />
                            </button>
                            <button
                                onClick={() => { onNamingChange(false); setGroupName('') }}
                                className="p-1 rounded text-gray-400 hover:bg-gray-200"
                                title="Cancelar"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={() => onNamingChange(true)}
                                disabled={!canGroup}
                                className="text-xs px-3 py-1 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                                title={!canGroup && selectedCount < 2 ? 'Selecciona al menos 2 filas' : !canGroup ? 'Solo puedes agrupar filas del mismo tipo' : 'Agrupar filas seleccionadas'}
                            >
                                Agrupar
                            </button>
                            <button
                                onClick={onCancel}
                                className="text-xs px-2 py-1 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
                            >
                                Cancelar
                            </button>
                        </>
                    )}
                </div>
            </td>
        </>
    )
}
