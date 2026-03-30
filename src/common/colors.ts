/**
 * ColorScheme — single source of truth for table section coloring.
 *
 * Consumers pass one `colorScheme` prop instead of separate headerBg/headerText.
 * The library applies it consistently to headers, footers, borders, and accents.
 */

export interface ColorScheme {
  /** Header/footer background — e.g. 'bg-rose-50' */
  bg: string
  /** Header/footer text + icon color — e.g. 'text-rose-700' */
  text: string
  /** Section border — e.g. 'border-rose-200' */
  border: string
}

/** Neutral fallback when no scheme is provided */
export const DEFAULT_SCHEME: ColorScheme = {
  bg: 'bg-gray-100',
  text: 'text-gray-700',
  border: 'border-gray-200',
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
    // Derive border from bg: 'bg-rose-50' → 'border-rose-200'
    const border = bg.replace('bg-', 'border-').replace(/-(50|100)$/, '-200')
    return { bg, text, border }
  }
  return defaultScheme
}
