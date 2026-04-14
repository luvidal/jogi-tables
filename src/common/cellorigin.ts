export type CellOrigin = 'ai' | 'user' | 'calculated'

export const ORIGIN_CLASSES: Record<CellOrigin, string> = {
  ai: 'text-ink-tertiary',
  user: 'text-ink-primary',
  calculated: 'text-status-info',
}
