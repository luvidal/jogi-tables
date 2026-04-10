import { useState, useCallback } from 'react'

/**
 * Local collapse state for a set of named sections.
 * All sections start expanded (collapsed = false) unless initialCollapsed is provided.
 */
export function useCollapsedState(keys: string[], initialCollapsed: Record<string, boolean> = {}) {
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() => {
        const state: Record<string, boolean> = {}
        for (const k of keys) state[k] = initialCollapsed[k] ?? false
        return state
    })

    const toggle = useCallback((key: string) => {
        setCollapsed(prev => ({ ...prev, [key]: !prev[key] }))
    }, [])

    const expandAll = useCallback(() => {
        setCollapsed(prev => {
            const next: Record<string, boolean> = {}
            for (const k of Object.keys(prev)) next[k] = false
            return next
        })
    }, [])

    const collapseAll = useCallback(() => {
        setCollapsed(prev => {
            const next: Record<string, boolean> = {}
            for (const k of Object.keys(prev)) next[k] = true
            return next
        })
    }, [])

    return { collapsed, toggle, expandAll, collapseAll }
}
