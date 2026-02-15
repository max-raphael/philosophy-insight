export interface Collection {
  id: string
  name: string
  description: string
  textIds: string[]
  icon?: string
}

export interface StartHereText {
  id: string
  tagline: string
}

// Essential texts for beginners
export const startHereTexts: StartHereText[] = [
  { id: 'meditations', tagline: 'The most accessible entry to philosophy' },
  { id: 'apology', tagline: "Socrates' defense - the origin story" },
  { id: 'nicomachean-ethics', tagline: 'The foundation of virtue ethics' },
  { id: 'meditations-first-philosophy', tagline: 'I think, therefore I am' },
  { id: 'enquiry-human-understanding', tagline: 'Radical skepticism made clear' },
  { id: 'groundwork-metaphysics-of-morals', tagline: 'The categorical imperative' },
  { id: 'on-liberty', tagline: 'The classic defense of freedom' },
  { id: 'beyond-good-and-evil', tagline: 'Philosophy with a hammer' },
]

// Thematic collections
export const thematicCollections: Collection[] = [
  {
    id: 'death-mortality',
    name: 'On Death & Mortality',
    description: 'Philosophers contemplate the end of life and how to face it',
    textIds: ['phaedo', 'meditations', 'letters-seneca'],
  },
  {
    id: 'political-philosophy',
    name: 'Political Philosophy',
    description: 'The foundations of government, justice, and society',
    textIds: ['republic', 'leviathan', 'social-contract', 'on-liberty'],
  },
  {
    id: 'ethics-virtue',
    name: 'Ethics & How to Live',
    description: 'What makes a good life and how should we act?',
    textIds: ['nicomachean-ethics', 'groundwork-metaphysics-of-morals', 'utilitarianism', 'letters-seneca'],
  },
  {
    id: 'knowledge-reality',
    name: 'Knowledge & Reality',
    description: 'What can we know and what exists?',
    textIds: ['meditations-first-philosophy', 'enquiry-human-understanding', 'critique-pure-reason', 'pragmatism'],
  },
  {
    id: 'stoic-path',
    name: 'The Stoic Path',
    description: 'Ancient wisdom for modern resilience',
    textIds: ['meditations', 'enchiridion', 'letters-seneca', 'discourses-epictetus'],
  },
]

// Era metadata for browsing
export const eras = [
  // Western
  {
    id: 'ancient',
    name: 'Ancient',
    years: '600 BCE - 500 CE',
    description: 'The foundations of Western philosophy',
    color: 'amber',
  },
  {
    id: 'medieval',
    name: 'Medieval',
    years: '400 - 1400 CE',
    description: 'Faith and reason in the Christian tradition',
    color: 'stone',
  },
  {
    id: 'enlightenment',
    name: 'Enlightenment',
    years: '1500 - 1800',
    description: 'The age of reason and revolution',
    color: 'emerald',
  },
  {
    id: '19th-century',
    name: '19th Century',
    years: '1800 - 1900',
    description: 'Idealism, romanticism, and the will',
    color: 'blue',
  },
  {
    id: '20th-century',
    name: '20th Century',
    years: '1900 - 1970',
    description: 'Pragmatism, analysis, and process',
    color: 'blue',
  },
  // Islamic
  {
    id: 'islamic',
    name: 'Islamic',
    years: '800 - 1400 CE',
    description: 'The golden age of Arabic philosophy',
    color: 'amber',
  },
  // Eastern
  {
    id: 'chinese',
    name: 'Chinese',
    years: '600 BCE - present',
    description: 'Confucianism, Daoism, and the art of living',
    color: 'red',
  },
  {
    id: 'indian',
    name: 'Indian',
    years: '800 BCE - present',
    description: 'Vedanta, Yoga, and the paths to liberation',
    color: 'orange',
  },
  {
    id: 'buddhist',
    name: 'Buddhist',
    years: '500 BCE - present',
    description: 'The Middle Way and the end of suffering',
    color: 'yellow',
  },
  {
    id: 'persian',
    name: 'Persian',
    years: '1000 - 1500 CE',
    description: 'Mystical poetry and the path of the heart',
    color: 'purple',
  },
  // Political
  {
    id: 'revolutionary',
    name: 'Revolutionary',
    years: '1840 - present',
    description: 'Marxism, anarchism, and radical critique',
    color: 'rose',
  },
] as const

export type EraId = typeof eras[number]['id']

// Get all unique philosophers from texts
export function getPhilosophersFromTexts(texts: { author: string; id: string; category?: string }[]) {
  const philosopherMap = new Map<string, { name: string; textIds: string[]; category: string }>()

  texts.forEach(text => {
    const existing = philosopherMap.get(text.author)
    if (existing) {
      existing.textIds.push(text.id)
    } else {
      philosopherMap.set(text.author, {
        name: text.author,
        textIds: [text.id],
        category: text.category || 'ancient',
      })
    }
  })

  return Array.from(philosopherMap.values()).sort((a, b) => b.textIds.length - a.textIds.length)
}
