import React, { useState } from 'react'
import { Eye } from 'lucide-react'

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
// TableShell — shared accordion wrapper for collapsible table sections
// ============================================================================

export interface TableShellProps {
    // Appearance
    headerBg?: string
    headerText?: string

    // Collapse behavior
    defaultCollapsed?: boolean
    forceExpanded?: boolean
    disableToggle?: boolean       // Prevents toggle (e.g., MonthlyTable during selection)

    // Header content — render prop receives { isExpanded }
    renderHeader: (ctx: { isExpanded: boolean }) => React.ReactNode

    // Table body content (inside the collapsible white area)
    children: React.ReactNode

    // Optional content after the collapsible area (e.g., recycle bin, dialogs)
    renderAfterContent?: (ctx: { isExpanded: boolean }) => React.ReactNode

    // Extra props for the content wrapper div
    contentClassName?: string
    contentProps?: React.HTMLAttributes<HTMLDivElement>
}

const TableShell = ({
    headerBg = 'bg-gray-100',
    headerText = 'text-gray-700',
    defaultCollapsed = false,
    forceExpanded = false,
    disableToggle = false,
    renderHeader,
    children,
    renderAfterContent,
    contentClassName,
    contentProps,
}: TableShellProps) => {
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
    const isExpanded = forceExpanded || !isCollapsed
    const canToggle = !forceExpanded && !disableToggle

    return (
        <div className={`rounded-xl overflow-hidden ${isExpanded ? 'border border-gray-200' : ''}`}>
            {/* Accordion Header */}
            <div
                role={canToggle ? 'button' : undefined}
                tabIndex={canToggle ? 0 : undefined}
                onClick={() => canToggle && setIsCollapsed(!isCollapsed)}
                onKeyDown={(e) => {
                    if (canToggle && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault()
                        setIsCollapsed(!isCollapsed)
                    }
                }}
                className={`w-full ${headerBg} hover:brightness-95 transition-all ${canToggle ? 'cursor-pointer' : 'cursor-default'} ${isExpanded ? 'rounded-t-xl' : 'rounded-xl'}`}
            >
                {renderHeader({ isExpanded })}
            </div>

            {/* Collapsible Content */}
            <div
                {...contentProps}
                className={`bg-white ${!isExpanded ? 'hidden print:block' : ''} ${contentClassName || ''}`}
            >
                {children}
            </div>

            {/* Optional footer (recycle bin, dialogs, etc.) */}
            {renderAfterContent?.({ isExpanded })}
        </div>
    )
}

export default TableShell
