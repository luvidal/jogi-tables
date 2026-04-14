import React from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

export interface CollapsibleSectionProps {
    label: string
    collapsed: boolean
    onToggle: () => void
    /** Inline summary shown next to label (e.g. total, count badge) */
    summary?: React.ReactNode
    /** Extra classes on the header bar */
    headerClassName?: string
    children: React.ReactNode
}

const CollapsibleSection = ({
    label,
    collapsed,
    onToggle,
    summary,
    headerClassName,
    children,
}: CollapsibleSectionProps) => {
    const Chevron = collapsed ? ChevronRight : ChevronDown

    return (
        <div>
            <button
                type="button"
                onClick={onToggle}
                className={`w-full flex items-center gap-1.5 px-1 py-1.5 text-xs font-medium text-ink-tertiary uppercase tracking-wide hover:text-ink-secondary transition-colors cursor-pointer ${headerClassName || ''}`}
            >
                <Chevron size={14} className="shrink-0" />
                <span>{label}</span>
                {summary && <span className="ml-auto font-normal normal-case tracking-normal text-ink-tertiary">{summary}</span>}
            </button>
            {!collapsed && children}
        </div>
    )
}

export default CollapsibleSection
