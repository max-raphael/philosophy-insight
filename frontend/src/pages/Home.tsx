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
  ancient: 'bg-[var(--category-ancient-bg)] text-[var(--category-ancient-text)]',
  medieval: 'bg-[var(--category-medieval-bg)] text-[var(--category-medieval-text)]',
  enlightenment: 'bg-[var(--category-enlightenment-bg)] text-[var(--category-enlightenment-text)]',
  modern: 'bg-[var(--category-modern-bg)] text-[var(--category-modern-text)]',
}

const eraColors: Record<string, { bg: string; border: string; text: string }> = {
  ancient: { bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-800', text: 'text-amber-700 dark:text-amber-300' },
  medieval: { bg: 'bg-stone-100 dark:bg-stone-800/50', border: 'border-stone-300 dark:border-stone-600', text: 'text-stone-700 dark:text-stone-300' },
  enlightenment: { bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-800', text: 'text-emerald-700 dark:text-emerald-300' },
  modern: { bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-300' },
}

type SortOption = 'title' | 'author' | 'era'
type FilterEra = EraId | 'all'

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
          <div className="w-8 h-8 border-2 border-[var(--border-secondary)] border-t-[var(--text-tertiary)] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--text-muted)] text-sm">Loading library...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-[var(--text-primary)] font-medium mb-1">Connection Error</p>
          <p className="text-[var(--text-muted)] text-sm">{error}</p>
          <p className="text-[var(--text-muted)] text-xs mt-2">Make sure the backend is running on port 8000</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="bg-[var(--bg-secondary)] border-b border-[var(--border-primary)]">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-serif font-bold text-[var(--text-primary)]"
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
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-center max-w-2xl mx-auto"
          >
            <p className="text-lg text-[var(--text-secondary)] mb-6">
              Read philosophy with an AI companion. Explore {texts.length} texts from 2,500 years of thought.
            </p>

            {/* Search Bar */}
            <button
              onClick={() => onOpenSearch()}
              className="w-full max-w-lg mx-auto flex items-center gap-3 px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl hover:border-[var(--border-secondary)] hover:shadow-md transition-all group"
            >
              <svg className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="flex-1 text-left text-[var(--text-muted)]">Search texts, authors, or topics...</span>
              <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-[var(--text-muted)] bg-[var(--bg-tertiary)] rounded">
                <span>⌘</span>K
              </kbd>
            </button>
          </motion.div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-12">
        {/* Continue Reading */}
        <AnimatePresence>
          {continueReading.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-sm font-medium tracking-widest text-[var(--text-muted)] uppercase mb-4">
                Continue Reading
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {continueReading.map((progress) => {
                  const text = texts.find(t => t.id === progress.textId)
                  if (!text) return null
                  return (
                    <Link
                      key={progress.textId}
                      to={`/texts/${progress.textId}`}
                      className="group p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] hover:border-[var(--border-secondary)] hover:shadow-md transition-all"
                    >
                      <h3 className="font-serif font-semibold text-[var(--text-primary)] truncate group-hover:text-[var(--accent-primary)]">
                        {text.title}
                      </h3>
                      <p className="text-sm text-[var(--text-muted)] mb-3">{text.author}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[var(--accent-primary)] rounded-full"
                            style={{ width: `${(progress.book / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-[var(--text-muted)]">Book {progress.book}</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Start Here */}
        {startHereWithData.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium tracking-widest text-[var(--text-muted)] uppercase">
                Start Here
              </h2>
              <span className="text-xs text-[var(--text-muted)]">Essential reads for beginners</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {startHereWithData.slice(0, 4).map((text, index) => (
                <motion.div
                  key={text.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <Link
                    to={`/texts/${text.id}`}
                    className="group h-full flex flex-col p-5 bg-[var(--bg-secondary)] rounded-xl border-2 border-[var(--border-primary)] hover:border-[var(--accent-primary)] hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[text.category || 'ancient']}`}>
                        {text.category}
                      </span>
                      <svg className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                      {text.title}
                    </h3>
                    <p className="text-sm text-[var(--text-tertiary)] mb-2">{text.author}</p>
                    <p className="text-sm text-[var(--text-muted)] italic mt-auto">"{text.tagline}"</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Browse by Era */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-sm font-medium tracking-widest text-[var(--text-muted)] uppercase mb-4">
            Browse by Era
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {eras.map((era) => {
              const eraTexts = textsByEra[era.id] || []
              const colors = eraColors[era.id]
              return (
                <button
                  key={era.id}
                  onClick={() => {
                    setFilterEra(era.id)
                    setShowAllLibrary(true)
                    document.getElementById('library')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className={`group p-5 rounded-xl border-2 ${colors.bg} ${colors.border} hover:shadow-lg transition-all text-left`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-2xl font-serif font-bold ${colors.text}`}>{eraTexts.length}</span>
                    <svg className={`w-5 h-5 ${colors.text} opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <h3 className={`font-semibold ${colors.text}`}>{era.name}</h3>
                  <p className="text-sm text-[var(--text-muted)]">{era.years}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-2">{era.description}</p>
                </button>
              )
            })}
          </div>
        </motion.section>

        {/* Browse by Philosopher */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-sm font-medium tracking-widest text-[var(--text-muted)] uppercase mb-4">
            Browse by Philosopher
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
            {philosophers.map((philosopher) => (
              <button
                key={philosopher.name}
                onClick={() => onOpenSearch(philosopher.name)}
                className="shrink-0 p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] hover:border-[var(--border-secondary)] hover:shadow-md transition-all min-w-[160px]"
              >
                <div className="w-10 h-10 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center mb-3">
                  <span className="text-lg font-serif font-bold text-[var(--text-tertiary)]">
                    {philosopher.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-medium text-[var(--text-primary)] truncate">{philosopher.name}</h3>
                <p className="text-xs text-[var(--text-muted)]">{philosopher.textIds.length} texts</p>
              </button>
            ))}
          </div>
        </motion.section>

        {/* Full Library */}
        <motion.section
          id="library"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-sm font-medium tracking-widest text-[var(--text-muted)] uppercase">
              Full Library ({filteredTexts.length} texts)
            </h2>
            <div className="flex items-center gap-3">
              {/* Era Filter */}
              <div className="flex items-center gap-1 bg-[var(--bg-secondary)] rounded-lg p-1 border border-[var(--border-primary)]">
                <button
                  onClick={() => setFilterEra('all')}
                  className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
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
                    className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
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
                className="px-3 py-2 text-xs bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]"
              >
                <option value="title">Sort by Title</option>
                <option value="author">Sort by Author</option>
                <option value="era">Sort by Era</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedTexts.map((text, index) => (
              <motion.div
                key={text.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
              >
                <Link
                  to={`/texts/${text.id}`}
                  className="h-full flex flex-col bg-[var(--bg-secondary)] rounded-xl p-5 border border-[var(--border-primary)] hover:border-[var(--border-secondary)] hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors flex-1 pr-2">
                      {text.title}
                    </h3>
                    {text.category && (
                      <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${categoryColors[text.category]}`}>
                        {text.category}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--text-tertiary)]">{text.author}</p>
                  {text.year && (
                    <p className="text-xs text-[var(--text-muted)] mt-1">{text.year}</p>
                  )}
                  {text.description && (
                    <p className="text-sm text-[var(--text-secondary)] mt-3 line-clamp-3 flex-1">
                      {text.description}
                    </p>
                  )}
                  <div className="mt-4 flex items-center text-[var(--accent-primary)] text-sm font-medium">
                    <span>Start reading</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Show more/less button */}
          {filteredTexts.length > 12 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAllLibrary(!showAllLibrary)}
                className="px-6 py-2 text-sm font-medium text-[var(--text-secondary)] bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg hover:border-[var(--border-secondary)] hover:shadow-sm transition-all"
              >
                {showAllLibrary ? 'Show less' : `Show all ${filteredTexts.length} texts`}
              </button>
            </div>
          )}
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-primary)] bg-[var(--bg-secondary)] mt-12">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center">
          <p className="text-[var(--text-muted)] text-sm">
            Texts sourced from public domain works. Press <kbd className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded text-xs">⌘K</kbd> to search.
          </p>
        </div>
      </footer>
    </div>
  )
}
