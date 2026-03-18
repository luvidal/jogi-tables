import { T } from './styles'

interface EmptyStateRowProps {
    show: boolean
    colSpan: number
    message: string
}

const EmptyStateRow = ({ show, colSpan, message }: EmptyStateRowProps) => {
    if (!show) return null
    return (
        <tr>
            <td colSpan={colSpan} className={`px-2 py-3 text-center ${T.empty}`}>
                {message}
            </td>
        </tr>
    )
}

export default EmptyStateRow
