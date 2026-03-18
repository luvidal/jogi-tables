import { X } from 'lucide-react'

interface DeleteRowButtonProps {
    onClick: () => void
    isVisible: boolean
    size?: 'sm' | 'default'
    title?: string
}

const DeleteRowButton = ({
    onClick,
    isVisible,
    size = 'sm',
    title = 'Eliminar',
}: DeleteRowButtonProps) => {
    const padding = size === 'sm' ? 'p-0.5' : 'p-1'
    const iconSize = size === 'sm' ? 14 : 16
    return (
        <button
            onClick={onClick}
            className={`${padding} rounded transition-all shrink-0 ${isVisible ? 'opacity-100 text-red-400 hover:text-red-600 hover:bg-red-100' : 'opacity-0'}`}
            title={title}
        >
            <X size={iconSize} />
        </button>
    )
}

export default DeleteRowButton
