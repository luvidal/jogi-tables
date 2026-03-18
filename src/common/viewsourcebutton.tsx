import { Eye } from 'lucide-react'

interface ViewSourceButtonProps {
    sourceFileId?: string
    onViewSource?: (fileIds: string[]) => void
    isVisible: boolean
    size?: 'sm' | 'default'
}

const ViewSourceButton = ({
    sourceFileId,
    onViewSource,
    isVisible,
    size = 'sm',
}: ViewSourceButtonProps) => {
    if (!sourceFileId || !onViewSource) return null
    const padding = size === 'sm' ? 'p-0.5' : 'p-1'
    return (
        <button
            onClick={() => onViewSource([sourceFileId])}
            className={`${padding} rounded transition-all shrink-0 ${isVisible ? 'opacity-100 text-gray-400 hover:text-gray-600 hover:bg-gray-100' : 'opacity-0'}`}
            title="Ver documento fuente"
        >
            <Eye size={14} />
        </button>
    )
}

export default ViewSourceButton
