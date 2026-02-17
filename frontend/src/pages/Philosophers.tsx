import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeToggle from '../components/ThemeToggle'
import { getPhilosophersFromTexts, eras, type EraId } from '../data/collections'
import { philosopherImages } from '../data/philosopherImages'

interface TextInfo {
  id: string
  title: string
  author: string
  description?: string
  year?: string
  category?: string
}

interface PhilosophersProps {
  texts: TextInfo[]
  onOpenSearch: (author?: string) => void
}

// Category labels
const categoryLabels: Record<string, string> = {
  ancient: 'Ancient',
  medieval: 'Medieval',
  enlightenment: 'Enlightenment',
  modern: 'Modern',
  chinese: 'Chinese',
  indian: 'Indian',
  buddhist: 'Buddhist',
  sufi: 'Sufi & Persian',
  marxist: 'Revolutionary',
}

// Category color mapping
const categoryStyles: Record<string, { bg: string; text: string }> = {
  ancient: { bg: 'bg-[var(--category-ancient-bg)]', text: 'text-[var(--category-ancient-text)]' },
  medieval: { bg: 'bg-[var(--category-medieval-bg)]', text: 'text-[var(--category-medieval-text)]' },
  enlightenment: { bg: 'bg-[var(--category-enlightenment-bg)]', text: 'text-[var(--category-enlightenment-text)]' },
  modern: { bg: 'bg-[var(--category-modern-bg)]', text: 'text-[var(--category-modern-text)]' },
  chinese: { bg: 'bg-[var(--category-chinese-bg)]', text: 'text-[var(--category-chinese-text)]' },
  indian: { bg: 'bg-[var(--category-indian-bg)]', text: 'text-[var(--category-indian-text)]' },
  buddhist: { bg: 'bg-[var(--category-buddhist-bg)]', text: 'text-[var(--category-buddhist-text)]' },
  sufi: { bg: 'bg-[var(--category-sufi-bg)]', text: 'text-[var(--category-sufi-text)]' },
  marxist: { bg: 'bg-[var(--category-marxist-bg)]', text: 'text-[var(--category-marxist-text)]' },
}

type FilterCategory = EraId | 'all'

interface Philosopher {
  name: string
  textIds: string[]
  category: string
}

export default function Philosophers({ texts, onOpenSearch }: PhilosophersProps) {
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all')
  const [selectedPhilosopher, setSelectedPhilosopher] = useState<Philosopher | null>(null)
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())

  // Get all philosophers from texts
  const philosophers = useMemo(() => {
    return getPhilosophersFromTexts(texts)
  }, [texts])

  // Filter philosophers by category
  const filteredPhilosophers = useMemo(() => {
    if (filterCategory === 'all') return philosophers
    return philosophers.filter(p => p.category === filterCategory)
  }, [philosophers, filterCategory])

  // Get texts for a philosopher
  const getPhilosopherTexts = (textIds: string[]) => {
    return texts.filter(t => textIds.includes(t.id))
  }

  // Close modal on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPhilosopher(null)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedPhilosopher) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [selectedPhilosopher])

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between bg-[var(--bg-secondary)]/80 backdrop-blur-xl border border-[var(--border-primary)]/50 rounded-full px-6 py-3 shadow-lg">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 flex items-center justify-center">
                <svg className="w-4 h-4 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="font-display text-lg font-medium text-[var(--text-primary)] tracking-tight">Philosophy Insight</span>
            </Link>

            <div className="flex items-center gap-4">
              <button
                onClick={() => onOpenSearch()}
                className="hidden sm:flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors font-ui"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors font-ui mb-6"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Library
            </Link>
            <h1 className="font-display text-4xl md:text-5xl font-medium text-[var(--text-primary)] mb-4">
              Philosophers
            </h1>
            <p className="text-lg text-[var(--text-secondary)] font-body max-w-2xl">
              {filteredPhilosophers.length} thinkers across {eras.length} traditions, spanning 2,500 years of human thought.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-4 py-2 text-sm rounded-full transition-all font-ui ${
                  filterCategory === 'all'
                    ? 'bg-[var(--accent-primary)] text-[var(--text-inverted)]'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-primary)] hover:border-[var(--accent-primary)]'
                }`}
              >
                All
              </button>
              {eras.map(era => (
                <button
                  key={era.id}
                  onClick={() => setFilterCategory(era.id)}
                  className={`px-4 py-2 text-sm rounded-full transition-all font-ui ${
                    filterCategory === era.id
                      ? 'bg-[var(--accent-primary)] text-[var(--text-inverted)]'
                      : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-primary)] hover:border-[var(--accent-primary)]'
                  }`}
                >
                  {era.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Philosopher Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredPhilosophers.map((philosopher, i) => {
              const imageUrl = philosopherImages[philosopher.name]
              const style = categoryStyles[philosopher.category] || categoryStyles.ancient

              return (
                <motion.button
                  key={philosopher.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.5) }}
                  onClick={() => setSelectedPhilosopher(philosopher)}
                  className="text-left group"
                >
                  {/* Avatar */}
                  <div className="relative w-full aspect-square mb-3 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] overflow-hidden group-hover:border-[var(--accent-primary)]/50 transition-all duration-300">
                    {imageUrl && !failedImages.has(philosopher.name) ? (
                      <img
                        src={imageUrl}
                        alt={philosopher.name}
                        className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        onError={() => setFailedImages(prev => new Set(prev).add(philosopher.name))}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-display text-5xl text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors duration-300">
                          {philosopher.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Category badge */}
                    <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-ui ${style.bg} ${style.text}`}>
                      {categoryLabels[philosopher.category] || 'Unknown'}
                    </div>

                    {/* Work count badge */}
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-[var(--bg-primary)]/80 backdrop-blur-sm rounded-full">
                      <span className="text-[10px] font-ui text-[var(--text-muted)]">
                        {philosopher.textIds.length} {philosopher.textIds.length === 1 ? 'work' : 'works'}
                      </span>
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="font-display text-base font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors truncate">
                    {philosopher.name}
                  </h3>
                </motion.button>
              )
            })}
          </div>

          {/* Empty state */}
          {filteredPhilosophers.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <p className="text-[var(--text-secondary)] font-body">
                No philosophers found in this category.
              </p>
              <button
                onClick={() => setFilterCategory('all')}
                className="mt-4 text-[var(--accent-primary)] hover:underline font-ui"
              >
                View all philosophers
              </button>
            </motion.div>
          )}
        </div>
      </main>

      {/* Philosopher Modal */}
      <AnimatePresence>
        {selectedPhilosopher && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedPhilosopher(null)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[85vh] overflow-hidden"
            >
              <div className="mx-4 overflow-hidden rounded-2xl bg-[var(--bg-secondary)] shadow-2xl border border-[var(--border-primary)]">
                {/* Header with portrait */}
                <div className="relative">
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedPhilosopher(null)}
                    className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[var(--bg-primary)]/80 backdrop-blur-sm flex items-center justify-center hover:bg-[var(--bg-primary)] transition-colors"
                  >
                    <svg className="w-4 h-4 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <div className="flex items-center gap-6 p-6 pb-4">
                    {/* Portrait */}
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] overflow-hidden shrink-0">
                      {philosopherImages[selectedPhilosopher.name] && !failedImages.has(selectedPhilosopher.name) ? (
                        <img
                          src={philosopherImages[selectedPhilosopher.name]}
                          alt={selectedPhilosopher.name}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={() => setFailedImages(prev => new Set(prev).add(selectedPhilosopher.name))}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-display text-4xl text-[var(--text-muted)]">
                            {selectedPhilosopher.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0">
                      <h2 className="font-display text-2xl sm:text-3xl font-medium text-[var(--text-primary)] mb-2">
                        {selectedPhilosopher.name}
                      </h2>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-ui ${categoryStyles[selectedPhilosopher.category]?.bg || ''} ${categoryStyles[selectedPhilosopher.category]?.text || ''}`}>
                          {categoryLabels[selectedPhilosopher.category] || 'Unknown'}
                        </span>
                        <span className="text-sm text-[var(--text-secondary)] font-ui">
                          {selectedPhilosopher.textIds.length} {selectedPhilosopher.textIds.length === 1 ? 'work' : 'works'} available
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Works grid */}
                <div className="px-6 pb-6 max-h-[50vh] overflow-y-auto">
                  <p className="text-xs font-ui text-[var(--text-muted)] uppercase tracking-wider mb-4">
                    Available Works
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {getPhilosopherTexts(selectedPhilosopher.textIds).map(text => (
                      <Link
                        key={text.id}
                        to={`/texts/${text.id}`}
                        onClick={() => setSelectedPhilosopher(null)}
                        className="group flex flex-col p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] hover:border-[var(--accent-primary)]/50 hover:bg-[var(--bg-primary)] transition-all"
                      >
                        <h3 className="font-ui font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors mb-1">
                          {text.title}
                        </h3>
                        {text.year && (
                          <p className="text-xs text-[var(--text-muted)] mb-2">
                            {text.year}
                          </p>
                        )}
                        {text.description && (
                          <p className="text-sm text-[var(--text-secondary)] line-clamp-2 font-body">
                            {text.description}
                          </p>
                        )}
                        <div className="mt-auto pt-3 flex items-center gap-1 text-xs text-[var(--accent-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Read</span>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
