// Category badge colors and labels, shared by Home.tsx and Philosophers.tsx.
// Class names are written out in full so Tailwind can detect them.

import { eras, type EraId } from './collections'

export const categoryStyles: Record<EraId, { bg: string; text: string }> = {
  ancient: { bg: 'bg-[var(--category-ancient-bg)]', text: 'text-[var(--category-ancient-text)]' },
  medieval: { bg: 'bg-[var(--category-medieval-bg)]', text: 'text-[var(--category-medieval-text)]' },
  enlightenment: { bg: 'bg-[var(--category-enlightenment-bg)]', text: 'text-[var(--category-enlightenment-text)]' },
  '19th-century': { bg: 'bg-[var(--category-19th-century-bg)]', text: 'text-[var(--category-19th-century-text)]' },
  '20th-century': { bg: 'bg-[var(--category-20th-century-bg)]', text: 'text-[var(--category-20th-century-text)]' },
  islamic: { bg: 'bg-[var(--category-islamic-bg)]', text: 'text-[var(--category-islamic-text)]' },
  chinese: { bg: 'bg-[var(--category-chinese-bg)]', text: 'text-[var(--category-chinese-text)]' },
  indian: { bg: 'bg-[var(--category-indian-bg)]', text: 'text-[var(--category-indian-text)]' },
  buddhist: { bg: 'bg-[var(--category-buddhist-bg)]', text: 'text-[var(--category-buddhist-text)]' },
  persian: { bg: 'bg-[var(--category-persian-bg)]', text: 'text-[var(--category-persian-text)]' },
  revolutionary: { bg: 'bg-[var(--category-revolutionary-bg)]', text: 'text-[var(--category-revolutionary-text)]' },
}

export const categoryLabels = Object.fromEntries(eras.map(era => [era.id, era.name])) as Record<EraId, string>

export function getCategoryStyle(category: string | undefined) {
  return categoryStyles[category as EraId]
}

export function getCategoryLabel(category: string | undefined) {
  return categoryLabels[category as EraId]
}
