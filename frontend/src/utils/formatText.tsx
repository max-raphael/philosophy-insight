import type { ReactNode } from 'react'

/**
 * Formats plain text from Project Gutenberg with proper typography.
 * Converts:
 * - _word_ → italics
 * - -- → em-dash (—)
 * - ... → ellipsis (…)
 * - *word* → bold
 * - [Footnote: ...] → styled footnote
 * - [Note: ...] → styled note
 * - [1], [2], etc. → superscript reference
 */
export function formatText(text: string): ReactNode[] {
  // First, do simple character replacements
  const processed = text
    // Convert -- to em-dash (but not --- which might be intentional)
    .replace(/([^-])--([^-])/g, '$1—$2')
    // Convert ... to proper ellipsis
    .replace(/\.\.\./g, '…')

  // Now parse for inline formatting
  const result: ReactNode[] = []
  let key = 0

  // Combined regex to find all patterns
  const combinedPattern = /(_[^_]+_|\*[^*]+\*|\[Footnote:\s*[^\]]+\]|\[Note:\s*[^\]]+\]|\[\d+\])/g

  const parts = processed.split(combinedPattern)

  for (const part of parts) {
    if (!part) continue

    // Check which pattern this matches
    if (/^_[^_]+_$/.test(part)) {
      // Italics
      const inner = part.slice(1, -1)
      result.push(<em key={key++}>{inner}</em>)
    } else if (/^\*[^*]+\*$/.test(part)) {
      // Bold
      const inner = part.slice(1, -1)
      result.push(<strong key={key++}>{inner}</strong>)
    } else if (/^\[Footnote:\s*[^\]]+\]$/.test(part)) {
      // Footnote
      const inner = part.replace(/^\[Footnote:\s*/, '').replace(/\]$/, '')
      result.push(
        <span key={key++} className="text-sm text-[var(--text-muted)] italic">
          [{inner}]
        </span>
      )
    } else if (/^\[Note:\s*[^\]]+\]$/.test(part)) {
      // Note
      const inner = part.replace(/^\[Note:\s*/, '').replace(/\]$/, '')
      result.push(
        <span key={key++} className="text-sm text-[var(--text-muted)] italic">
          [Note: {inner}]
        </span>
      )
    } else if (/^\[\d+\]$/.test(part)) {
      // Reference number
      const inner = part.slice(1, -1)
      result.push(
        <sup key={key++} className="text-xs text-[var(--text-muted)]">[{inner}]</sup>
      )
    } else {
      // Plain text
      result.push(part)
    }
  }

  return result
}
