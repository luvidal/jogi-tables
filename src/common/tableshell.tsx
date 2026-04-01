import React from 'react'
import { Eye } from 'lucide-react'
import { resolveColors } from './colors'
import { T } from './styles'

// ============================================================================
// SourceIcon — reusable eye icon for source file viewing in headers/rows
// ============================================================================

export const SourceIcon = ({
    fileIds,
    onViewSource,
    className,
}: {
    fileIds?: string[]
    onViewSource?: (ids: string[]) => void
    className?: string
}) => {
    if (!fileIds?.length || !onViewSource) return null
    return (
        <button
            onClick={(e) => { e.stopPropagation(); onViewSource(fileIds) }}
            className="p-1 rounded hover:bg-white/50 transition-colors"
            title="Ver documento fuente"
        >
            <Eye size={14} className={className} />
        </button>
    )
}

// ============================================================================
// TableShell — single-table wrapper with colored header row
// ============================================================================

export interface TableShellProps {
    // Appearance
    colorScheme?: import('./colors').ColorScheme
    /** @deprecated Use colorScheme instead */
    headerBg?: string

    // Header content — render prop returns <td> cells for the header <tr>
    renderHeader: () => React.ReactNode

    // Table body content — <tr> elements placed inside <tbody>
    children: React.ReactNode

    // Optional content after the table (e.g., recycle bin, dialogs)
    renderAfterContent?: () => React.ReactNode
}

const TableShell = ({
    colorScheme: colorSchemeProp,
    headerBg: headerBgProp = 'bg-gray-100',
    renderHeader,
    children,
    renderAfterContent,
}: TableShellProps) => {
    const { bg: headerBg } = resolveColors(colorSchemeProp, headerBgProp)

    return (
        <>
            <table className={T.table}>
                <thead>
                    <tr className={headerBg}>
                        {renderHeader()}
                    </tr>
                </thead>
                <tbody>
                    {children}
                </tbody>
            </table>
            {renderAfterContent?.()}
        </>
    )
}

export default TableShell
