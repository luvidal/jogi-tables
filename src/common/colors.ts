/**
 * ColorScheme — single source of truth for table section coloring.
 *
 * Consumers pass one `colorScheme` prop instead of separate headerBg/headerText.
 * The library applies it consistently to headers, footers, borders, and accents.
 *
 * Values are Tailwind class strings. Phase 2b migrated defaults to the unified
 * token palette (surface-*, ink-*, edge-*) owned by the host consumer. Legacy
 * callers passing raw Tailwind color literals (`bg-rose-50`) still work via the
 * headerBg/headerText path; the border derivation preserves the old regex.
 */

export interface ColorScheme {
  /** Header/footer background — e.g. 'bg-surface-2' or legacy 'bg-rose-50' */
  bg: string
  /** Header/footer text + icon color — e.g. 'text-ink-secondary' or legacy 'text-rose-700' */
  text: string
  /** Section border — e.g. 'border-edge-subtle/20' or legacy 'border-rose-200' */
  border: string
}

/** Neutral fallback when no scheme is provided — dark token palette. */
export const DEFAULT_SCHEME: ColorScheme = {
  bg: 'bg-surface-2',
  text: 'text-ink-secondary',
  border: 'border-edge-subtle/20',
}

/**
 * Resolve color scheme from new `colorScheme` prop or legacy `headerBg`/`headerText`.
 * Priority: colorScheme > headerBg/headerText > defaultScheme
 */
export function resolveColors(
  colorScheme?: ColorScheme,
  headerBg?: string,
  headerText?: string,
  defaultScheme: ColorScheme = DEFAULT_SCHEME,
): ColorScheme {
  if (colorScheme) return colorScheme
  if (headerBg || headerText) {
    const bg = headerBg || defaultScheme.bg
    const text = headerText || defaultScheme.text
    // Legacy: derive border from bg for hex-literal callers like 'bg-rose-50'.
    // If the bg doesn't match the legacy /50|/100 suffix pattern, fall back to
    // the default border so token-based callers ('bg-surface-2') still work.
    const legacy = /-(50|100)$/.test(bg)
    const border = legacy
      ? bg.replace('bg-', 'border-').replace(/-(50|100)$/, '-200')
      : defaultScheme.border
    return { bg, text, border }
  }
  return defaultScheme
}
