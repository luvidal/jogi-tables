import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Trash2 } from 'lucide-react'

interface DeleteDialogProps {
    count: number
    onConfirm: (reason: string) => void
    onCancel: () => void
}

const DeleteDialog = ({ count, onConfirm, onCancel }: DeleteDialogProps) => {
    const [reason, setReason] = useState('')
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const cardRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel()
        }
        document.addEventListener('keydown', handleKey)
        return () => document.removeEventListener('keydown', handleKey)
    }, [onCancel])

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
            onCancel()
        }
    }

    const handleSubmit = () => {
        onConfirm(reason.trim())
    }

    const dialog = (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            onClick={handleBackdropClick}
        >
            <div
                ref={cardRef}
                className="bg-surface-1 border border-edge-subtle/20 rounded-2xl shadow-xl p-8 w-full max-w-sm mx-4 text-center"
            >
                <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 rounded-full bg-status-pending/10 flex items-center justify-center">
                        <Trash2 size={24} className="text-status-pending" />
                    </div>
                </div>

                <h3 className="text-lg font-semibold text-ink-primary mb-2">
                    ¿Cuál es la razón para borrar?
                </h3>
                <p className="text-sm text-ink-tertiary mb-5">
                    {count === 1 ? 'Esta fila se moverá a la papelera.' : `${count} filas se moverán a la papelera.`}
                </p>

                <textarea
                    ref={inputRef}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Escribe una razón..."
                    rows={2}
                    className="w-full text-sm bg-surface-0 text-ink-primary border border-edge-subtle/20 rounded-lg px-3 py-2 mb-5 outline-none focus:border-status-pending/60 focus:ring-1 focus:ring-status-pending/40 resize-none placeholder-ink-tertiary/60"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSubmit()
                        }
                    }}
                />

                <div className="flex gap-3">
                    <button
                        onClick={handleSubmit}
                        className="flex-1 py-2.5 rounded-lg bg-status-pending text-status-pending-contrast text-sm font-medium hover:bg-status-pending/80 transition-colors"
                    >
                        Confirmar
                    </button>
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2.5 rounded-lg border border-edge-subtle/20 text-ink-secondary text-sm font-medium hover:bg-surface-2 transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    )

    if (typeof document !== 'undefined') {
        return createPortal(dialog, document.body)
    }
    return dialog
}

export default DeleteDialog
