import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeToggle from '../components/ThemeToggle'
import { startHereTexts, eras, getPhilosophersFromTexts, type EraId } from '../data/collections'

interface TextInfo {
  id: string
  title: string
  author: string
  description?: string
  year?: string
  category?: string
}

interface HomeProps {
  texts: TextInfo[]
  onOpenSearch: (author?: string) => void
}

interface ReadingProgress {
  textId: string
  book: number
  progress: number
}

const categoryColors: Record<string, string> = {
  // Western
  ancient: 'bg-[var(--category-ancient-bg)] text-[var(--category-ancient-text)]',
  medieval: 'bg-[var(--category-medieval-bg)] text-[var(--category-medieval-text)]',
  enlightenment: 'bg-[var(--category-enlightenment-bg)] text-[var(--category-enlightenment-text)]',
  modern: 'bg-[var(--category-modern-bg)] text-[var(--category-modern-text)]',
  // Eastern
  chinese: 'bg-[var(--category-chinese-bg)] text-[var(--category-chinese-text)]',
  indian: 'bg-[var(--category-indian-bg)] text-[var(--category-indian-text)]',
  buddhist: 'bg-[var(--category-buddhist-bg)] text-[var(--category-buddhist-text)]',
  sufi: 'bg-[var(--category-sufi-bg)] text-[var(--category-sufi-text)]',
}

const eraColors: Record<string, { bg: string; border: string; text: string }> = {
  // Western
  ancient: { bg: 'bg-[var(--category-ancient-bg)]', border: 'border-[var(--category-ancient-text)]/20', text: 'text-[var(--category-ancient-text)]' },
  medieval: { bg: 'bg-[var(--category-medieval-bg)]', border: 'border-[var(--category-medieval-text)]/20', text: 'text-[var(--category-medieval-text)]' },
  enlightenment: { bg: 'bg-[var(--category-enlightenment-bg)]', border: 'border-[var(--category-enlightenment-text)]/20', text: 'text-[var(--category-enlightenment-text)]' },
  modern: { bg: 'bg-[var(--category-modern-bg)]', border: 'border-[var(--category-modern-text)]/20', text: 'text-[var(--category-modern-text)]' },
  // Eastern
  chinese: { bg: 'bg-[var(--category-chinese-bg)]', border: 'border-[var(--category-chinese-text)]/20', text: 'text-[var(--category-chinese-text)]' },
  indian: { bg: 'bg-[var(--category-indian-bg)]', border: 'border-[var(--category-indian-text)]/20', text: 'text-[var(--category-indian-text)]' },
  buddhist: { bg: 'bg-[var(--category-buddhist-bg)]', border: 'border-[var(--category-buddhist-text)]/20', text: 'text-[var(--category-buddhist-text)]' },
  sufi: { bg: 'bg-[var(--category-sufi-bg)]', border: 'border-[var(--category-sufi-text)]/20', text: 'text-[var(--category-sufi-text)]' },
}

type SortOption = 'title' | 'author' | 'era'
type FilterEra = EraId | 'all'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    }
  }
}

export default function Home({ texts, onOpenSearch }: HomeProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [continueReading, setContinueReading] = useState<ReadingProgress[]>([])
  const [sortBy, setSortBy] = useState<SortOption>('title')
  const [filterEra, setFilterEra] = useState<FilterEra>('all')
  const [showAllLibrary, setShowAllLibrary] = useState(false)

  // Simulate loading state based on texts prop
  useEffect(() => {
    if (texts.length > 0) {
      setLoading(false)
    }
  }, [texts])

  // Handle error if no texts after timeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (texts.length === 0) {
        setError('Failed to load texts. Make sure the backend is running.')
      }
    }, 5000)
    return () => clearTimeout(timeout)
  }, [texts])

  // Load continue reading from localStorage
  useEffect(() => {
    const progress: ReadingProgress[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('reading-position-')) {
        const textId = key.replace('reading-position-', '')
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}')
          if (data.book) {
            progress.push({ textId, book: data.book, progress: data.progress || 0 })
          }
        } catch {
          // Ignore invalid data
        }
      }
    }
    setContinueReading(progress.slice(0, 4))
  }, [])

  // Get "Start Here" texts with metadata
  const startHereWithData = useMemo(() => {
    return startHereTexts
      .map(sh => {
        const text = texts.find(t => t.id === sh.id)
        return text ? { ...text, tagline: sh.tagline } : null
      })
      .filter(Boolean) as (TextInfo & { tagline: string })[]
  }, [texts])

  // Get philosophers
  const philosophers = useMemo(() => {
    return getPhilosophersFromTexts(texts).slice(0, 12)
  }, [texts])

  // Get texts by era
  const textsByEra = useMemo(() => {
    const byEra: Record<string, TextInfo[]> = {}
    eras.forEach(era => {
      byEra[era.id] = texts.filter(t => t.category === era.id)
    })
    return byEra
  }, [texts])

  // Filter and sort library
  const filteredTexts = useMemo(() => {
    let filtered = texts
    if (filterEra !== 'all') {
      filtered = texts.filter(t => t.category === filterEra)
    }

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'author':
          return a.author.localeCompare(b.author)
        case 'era':
          const eraOrder = ['ancient', 'medieval', 'enlightenment', 'modern']
          return eraOrder.indexOf(a.category || '') - eraOrder.indexOf(b.category || '')
        default:
          return a.title.localeCompare(b.title)
      }
    })
  }, [texts, filterEra, sortBy])

  const displayedTexts = showAllLibrary ? filteredTexts : filteredTexts.slice(0, 12)

  if (loading && texts.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--border-secondary)] border-t-[var(--accent-primary)] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--text-muted)] text-sm font-ui">Loading library...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-12 h-12 bg-[var(--category-chinese-bg)] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-[var(--category-chinese-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-[var(--text-primary)] font-display text-xl mb-1">Connection Error</p>
          <p className="text-[var(--text-muted)] text-sm font-body">{error}</p>
          <p className="text-[var(--text-muted)] text-xs mt-2 font-ui">Make sure the backend is running on port 8000</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] relative">
      {/* Subtle texture overlay */}
      <div className="fixed inset-0 pointer-events-none textured" />

      {/* Header */}
      <header className="relative bg-[var(--bg-secondary)] border-b border-[var(--border-primary)]">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-10">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl font-display font-semibold text-[var(--text-primary)] tracking-tight"
            >
              Philosophy Insight
            </motion.h1>
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>

          {/* Hero with Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-2xl mx-auto"
          >
            <p className="text-lg text-[var(--text-secondary)] mb-8 font-body leading-relaxed">
              Read philosophy with an AI companion. Explore{' '}
              <span className="text-[var(--accent-primary)] font-medium">{texts.length} texts</span>{' '}
              from 2,500 years of thought.
            </p>

            {/* Search Bar */}
            <button
              onClick={() => onOpenSearch()}
              className="w-full max-w-lg mx-auto flex items-center gap-3 px-5 py-3.5 bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded hover:border-[var(--accent-primary)] hover:shadow-md transition-all group"
            >
              <svg className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="flex-1 text-left text-[var(--text-muted)] font-body italic">Search the library...</span>
              <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-[var(--text-muted)] bg-[var(--bg-tertiary)] rounded font-ui border border-[var(--border-primary)]">
                <span>⌘</span>K
              </kbd>
            </button>
          </motion.div>
        </div>

        {/* Decorative rule */}
        <div className="rule-line mt-0" />
      </header>

      <main className="relative max-w-5xl mx-auto px-6 py-10 space-y-16">
        {/* Continue Reading */}
        <AnimatePresence>
          {continueReading.length > 0 && (
            <motion.section
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center gap-4 mb-6">
                <h2 className="section-header">Continue Reading</h2>
                <div className="flex-1 rule-line" />
              </div>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                variants={containerVariants}
              >
                {continueReading.map((progress) => {
                  const text = texts.find(t => t.id === progress.textId)
                  if (!text) return null
                  return (
                    <motion.div key={progress.textId} variants={itemVariants}>
                      <Link
                        to={`/texts/${progress.textId}`}
                        className="group block p-5 bg-[var(--bg-secondary)] rounded border border-[var(--border-primary)] hover:border-[var(--accent-primary)] hover:shadow-md transition-all"
                      >
                        <h3 className="font-display text-lg font-medium text-[var(--text-primary)] truncate group-hover:text-[var(--accent-primary)] transition-colors">
                          {text.title}
                        </h3>
                        <p className="text-sm text-[var(--text-muted)] font-ui mb-4">{text.author}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[var(--accent-primary)] rounded-full transition-all"
                              style={{ width: `${(progress.book / 10) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-[var(--text-muted)] font-ui">Book {progress.book}</span>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Start Here */}
        {startHereWithData.length > 0 && (
          <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="section-header">Start Here</h2>
                <div className="w-16 rule-line" />
              </div>
              <span className="text-xs text-[var(--text-muted)] font-ui italic">Essential reads for beginners</span>
            </div>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              variants={containerVariants}
            >
              {startHereWithData.slice(0, 4).map((text) => (
                <motion.div key={text.id} variants={itemVariants}>
                  <Link
                    to={`/texts/${text.id}`}
                    className="group h-full flex flex-col p-5 bg-[var(--bg-secondary)] rounded border-2 border-[var(--border-primary)] hover:border-[var(--accent-primary)] hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className={`text-xs px-2.5 py-1 rounded font-ui ${categoryColors[text.category || 'ancient']}`}>
                        {text.category}
                      </span>
                      <svg className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <h3 className="font-display text-xl font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors mb-1">
                      {text.title}
                    </h3>
                    <p className="text-sm text-[var(--text-tertiary)] font-ui mb-3">{text.author}</p>
                    <p className="text-sm text-[var(--text-muted)] font-body italic mt-auto">"{text.tagline}"</p>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        )}

        {/* Decorative divider */}
        <div className="ornament-divider">
          <span className="text-[var(--accent-primary)]">§</span>
        </div>

        {/* Browse by Era */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="flex items-center gap-4 mb-6">
            <h2 className="section-header">Browse by Era</h2>
            <div className="flex-1 rule-line" />
          </div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            variants={containerVariants}
          >
            {eras.map((era) => {
              const eraTexts = textsByEra[era.id] || []
              const colors = eraColors[era.id]
              return (
                <motion.div key={era.id} variants={itemVariants}>
                  <button
                    onClick={() => {
                      setFilterEra(era.id)
                      setShowAllLibrary(true)
                      document.getElementById('library')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className={`group w-full p-5 rounded border ${colors.bg} ${colors.border} hover:shadow-lg transition-all text-left`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className={`font-display text-3xl font-semibold ${colors.text}`}>{eraTexts.length}</span>
                      <svg className={`w-5 h-5 ${colors.text} opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <h3 className={`font-display text-lg font-medium ${colors.text}`}>{era.name}</h3>
                    <p className="text-sm text-[var(--text-muted)] font-ui">{era.years}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-2 font-body line-clamp-2">{era.description}</p>
                  </button>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.section>

        {/* Browse by Philosopher */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="flex items-center gap-4 mb-6">
            <h2 className="section-header">Browse by Philosopher</h2>
            <div className="flex-1 rule-line" />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-3 -mx-6 px-6 scrollbar-hide">
            {philosophers.map((philosopher) => (
              <motion.button
                key={philosopher.name}
                variants={itemVariants}
                onClick={() => onOpenSearch(philosopher.name)}
                className="shrink-0 p-5 bg-[var(--bg-secondary)] rounded border border-[var(--border-primary)] hover:border-[var(--accent-primary)] hover:shadow-md transition-all min-w-[160px] text-left group"
              >
                {/* Parchment-style avatar */}
                <div className="relative w-12 h-12 mb-3">
                  <div className="absolute inset-0 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-decorative)]" />
                  <span className="absolute inset-0 flex items-center justify-center font-display text-2xl text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] transition-colors">
                    {philosopher.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-display text-base font-medium text-[var(--text-primary)] truncate group-hover:text-[var(--accent-primary)] transition-colors">
                  {philosopher.name}
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-ui">{philosopher.textIds.length} works</p>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Full Library */}
        <motion.section
          id="library"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <h2 className="section-header">Full Library</h2>
              <span className="text-xs text-[var(--text-muted)] font-ui">({filteredTexts.length} texts)</span>
            </div>
            <div className="flex items-center gap-3">
              {/* Era Filter */}
              <div className="flex items-center gap-1 bg-[var(--bg-secondary)] rounded p-1 border border-[var(--border-primary)]">
                <button
                  onClick={() => setFilterEra('all')}
                  className={`px-3 py-1.5 text-xs rounded transition-colors font-ui ${
                    filterEra === 'all'
                      ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-medium'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                  }`}
                >
                  All
                </button>
                {eras.map(era => (
                  <button
                    key={era.id}
                    onClick={() => setFilterEra(era.id)}
                    className={`px-3 py-1.5 text-xs rounded transition-colors font-ui ${
                      filterEra === era.id
                        ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-medium'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                    }`}
                  >
                    {era.name}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 text-xs bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded text-[var(--text-secondary)] font-ui focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
              >
                <option value="title">Sort by Title</option>
                <option value="author">Sort by Author</option>
                <option value="era">Sort by Era</option>
              </select>
            </div>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={containerVariants}
          >
            {displayedTexts.map((text) => (
              <motion.div key={text.id} variants={itemVariants}>
                <Link
                  to={`/texts/${text.id}`}
                  className="h-full flex flex-col bg-[var(--bg-secondary)] rounded p-5 border border-[var(--border-primary)] hover:border-[var(--accent-primary)] hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-display text-lg font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors flex-1 pr-2 leading-tight">
                      {text.title}
                    </h3>
                    {text.category && (
                      <span className={`text-xs px-2 py-0.5 rounded shrink-0 font-ui ${categoryColors[text.category]}`}>
                        {text.category}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--text-tertiary)] font-ui">{text.author}</p>
                  {text.year && (
                    <p className="text-xs text-[var(--text-muted)] mt-1 font-ui">{text.year}</p>
                  )}
                  {text.description && (
                    <p className="text-sm text-[var(--text-secondary)] mt-3 line-clamp-3 flex-1 font-body">
                      {text.description}
                    </p>
                  )}
                  <div className="mt-4 flex items-center text-[var(--accent-primary)] text-sm font-ui">
                    <span>Begin reading</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Show more/less button */}
          {filteredTexts.length > 12 && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setShowAllLibrary(!showAllLibrary)}
                className="px-6 py-2.5 text-sm font-ui text-[var(--text-secondary)] bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all"
              >
                {showAllLibrary ? 'Show fewer' : `View all ${filteredTexts.length} texts`}
              </button>
            </div>
          )}
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-[var(--border-primary)] bg-[var(--bg-secondary)] mt-16">
        <div className="max-w-5xl mx-auto px-6 py-10 text-center">
          <p className="text-[var(--text-muted)] text-sm font-body">
            Texts sourced from public domain works.
          </p>
          <p className="text-[var(--text-muted)] text-xs mt-2 font-ui">
            Press <kbd className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded text-[10px]">⌘K</kbd> to search the library.
          </p>
        </div>
      </footer>
    </div>
  )
}
