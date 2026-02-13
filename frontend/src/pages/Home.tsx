import { useState, useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
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

// Rotating quotes for the hero
const heroQuotes = [
  { text: "The unexamined life is not worth living.", author: "Socrates", work: "Apology" },
  { text: "He who has a why to live can bear almost any how.", author: "Nietzsche", work: "Twilight of the Idols" },
  { text: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius", work: "Meditations" },
  { text: "To be is to be perceived.", author: "George Berkeley", work: "A Treatise Concerning Human Nature" },
  { text: "Man is condemned to be free.", author: "Jean-Paul Sartre", work: "Existentialism is a Humanism" },
]

// Philosopher portraits (from Wikipedia API - verified URLs)
const philosopherImages: Record<string, string> = {
  // Ancient
  'Plato': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Plato_Silanion_Musei_Capitolini_MC1377.jpg/440px-Plato_Silanion_Musei_Capitolini_MC1377.jpg',
  'Aristotle': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Aristotle_Altemps_Inv8575.jpg/440px-Aristotle_Altemps_Inv8575.jpg',
  'Cicero': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Bust_of_Cicero_%281st-cent._BC%29_-_Palazzo_Nuovo_-_Musei_Capitolini_-_Rome_2016.jpg/440px-Bust_of_Cicero_%281st-cent._BC%29_-_Palazzo_Nuovo_-_Musei_Capitolini_-_Rome_2016.jpg',
  'Seneca': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Duble_herma_of_Socrates_and_Seneca_Antikensammlung_Berlin_07.jpg/440px-Duble_herma_of_Socrates_and_Seneca_Antikensammlung_Berlin_07.jpg',
  'Marcus Aurelius': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/MSR-ra-61-b-1-DM.jpg/440px-MSR-ra-61-b-1-DM.jpg',
  // Medieval
  'Augustine of Hippo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Saint_Augustine_by_Philippe_de_Champaigne.jpg/440px-Saint_Augustine_by_Philippe_de_Champaigne.jpg',
  // Modern Western
  'Immanuel Kant': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Immanuel_Kant_%28painted_portrait%29.jpg/440px-Immanuel_Kant_%28painted_portrait%29.jpg',
  'Friedrich Nietzsche': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Nietzsche187a.jpg/440px-Nietzsche187a.jpg',
  'John Stuart Mill': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/John_Stuart_Mill_by_London_Stereoscopic_Company%2C_c1870.jpg/440px-John_Stuart_Mill_by_London_Stereoscopic_Company%2C_c1870.jpg',
  'David Hume': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Painting_of_David_Hume.jpg/440px-Painting_of_David_Hume.jpg',
  'William James': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/William_James_b1842c.jpg/440px-William_James_b1842c.jpg',
  'Jean-Jacques Rousseau': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Maurice_Quentin_de_La_Tour_-_Portrait_of_Jean-Jacques_Rousseau_-_WGA12360.jpg/440px-Maurice_Quentin_de_La_Tour_-_Portrait_of_Jean-Jacques_Rousseau_-_WGA12360.jpg',
  'Henry David Thoreau': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Benjamin_D._Maxham_-_Henry_David_Thoreau_-_Restored.jpg/440px-Benjamin_D._Maxham_-_Henry_David_Thoreau_-_Restored.jpg',
  // Eastern
  'Confucius': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Confucius_Tang_Dynasty.jpg/440px-Confucius_Tang_Dynasty.jpg',
  'Vyasa': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Sculpture_of_Vyasa.jpeg/440px-Sculpture_of_Vyasa.jpeg',
  'Rabindranath Tagore': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/1926_Rabindrath_Tagore.jpg/440px-1926_Rabindrath_Tagore.jpg',
  'Omar Khayyam': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Hakim_Omar_Khayam_-_panoramio.jpg/440px-Hakim_Omar_Khayam_-_panoramio.jpg',
}

// Category color mapping using CSS variables for proper light/dark mode support
const categoryStyles: Record<string, { bg: string; text: string; accent: string }> = {
  ancient: { bg: 'bg-[var(--category-ancient-bg)]', text: 'text-[var(--category-ancient-text)]', accent: 'border-[var(--category-ancient-text)]/40' },
  medieval: { bg: 'bg-[var(--category-medieval-bg)]', text: 'text-[var(--category-medieval-text)]', accent: 'border-[var(--category-medieval-text)]/40' },
  enlightenment: { bg: 'bg-[var(--category-enlightenment-bg)]', text: 'text-[var(--category-enlightenment-text)]', accent: 'border-[var(--category-enlightenment-text)]/40' },
  modern: { bg: 'bg-[var(--category-modern-bg)]', text: 'text-[var(--category-modern-text)]', accent: 'border-[var(--category-modern-text)]/40' },
  chinese: { bg: 'bg-[var(--category-chinese-bg)]', text: 'text-[var(--category-chinese-text)]', accent: 'border-[var(--category-chinese-text)]/40' },
  indian: { bg: 'bg-[var(--category-indian-bg)]', text: 'text-[var(--category-indian-text)]', accent: 'border-[var(--category-indian-text)]/40' },
  buddhist: { bg: 'bg-[var(--category-buddhist-bg)]', text: 'text-[var(--category-buddhist-text)]', accent: 'border-[var(--category-buddhist-text)]/40' },
  sufi: { bg: 'bg-[var(--category-sufi-bg)]', text: 'text-[var(--category-sufi-text)]', accent: 'border-[var(--category-sufi-text)]/40' },
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
  const [currentQuote, setCurrentQuote] = useState(0)
  const [hoveredEra, setHoveredEra] = useState<string | null>(null)

  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 50])

  // Rotate quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % heroQuotes.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

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
    return getPhilosophersFromTexts(texts).slice(0, 16)
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
          const eraOrder = ['ancient', 'medieval', 'enlightenment', 'modern', 'chinese', 'indian', 'buddhist', 'sufi']
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-6 relative">
            <div className="absolute inset-0 border-2 border-[var(--accent-primary)]/20 rounded-full" />
            <div className="absolute inset-0 border-2 border-transparent border-t-[var(--accent-primary)] rounded-full animate-spin" />
          </div>
          <p className="text-[var(--text-muted)] text-sm font-display tracking-wider uppercase">Opening the library...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <svg className="w-8 h-8 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-[var(--text-primary)] font-display text-2xl mb-2">The library is closed</p>
          <p className="text-[var(--text-muted)] text-sm font-body">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] relative overflow-x-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg-primary)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[var(--accent-primary)]/[0.03] blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[var(--accent-primary)]/[0.02] blur-[80px] rounded-full" />
      </div>

      {/* Floating navigation */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
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

            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenSearch()}
                className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="hidden sm:inline font-ui">Search</span>
                <kbd className="hidden md:flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] text-[var(--text-muted)] bg-[var(--bg-tertiary)] rounded border border-[var(--border-primary)]">
                  <span>⌘</span>K
                </kbd>
              </button>
              <div className="w-px h-5 bg-[var(--border-primary)]" />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 pt-24"
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Decorative flourish */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8"
          >
            <svg className="w-16 h-16 mx-auto text-[var(--accent-primary)]/30" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 0 L55 45 L100 50 L55 55 L50 100 L45 55 L0 50 L45 45 Z" />
            </svg>
          </motion.div>

          {/* Rotating quote */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuote}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <blockquote className="text-3xl md:text-5xl lg:text-6xl font-display font-medium text-[var(--text-primary)] leading-tight mb-6">
                "{heroQuotes[currentQuote].text}"
              </blockquote>
              <cite className="text-lg text-[var(--text-secondary)] font-body not-italic">
                <span className="text-[var(--accent-primary)]">{heroQuotes[currentQuote].author}</span>
                <span className="mx-3 text-[var(--text-muted)]">·</span>
                <span className="italic text-[var(--text-tertiary)]">{heroQuotes[currentQuote].work}</span>
              </cite>
            </motion.div>
          </AnimatePresence>

          {/* Quote progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-16">
            {heroQuotes.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQuote(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i === currentQuote
                    ? 'bg-[var(--accent-primary)] w-8'
                    : 'bg-[var(--border-decorative)] hover:bg-[var(--text-muted)]'
                }`}
              />
            ))}
          </div>

          {/* Tagline and CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <p className="text-xl text-[var(--text-secondary)] font-body mb-8 max-w-2xl mx-auto leading-relaxed">
              Read philosophy with an AI companion. Explore <span className="text-[var(--accent-primary)] font-medium">{texts.length} texts</span> from
              2,500 years of human thought, paragraph by paragraph.
            </p>

            <button
              onClick={() => document.getElementById('library')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative px-8 py-4 bg-[var(--accent-primary)] text-[var(--text-inverted)] font-ui font-medium rounded-lg overflow-hidden transition-all hover:shadow-xl hover:shadow-[var(--accent-primary)]/20"
            >
              <span className="relative z-10">Explore the Library</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-[var(--text-muted)]"
          >
            <span className="text-xs font-ui tracking-wider uppercase">Scroll to explore</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Main content */}
      <main className="relative z-10">
        {/* Continue Reading */}
        <AnimatePresence>
          {continueReading.length > 0 && (
            <motion.section
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="max-w-7xl mx-auto px-6 py-20"
            >
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="text-xs font-ui text-[var(--accent-primary)] tracking-widest uppercase mb-2">Welcome back</p>
                  <h2 className="text-3xl font-display font-medium text-[var(--text-primary)]">Continue Reading</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {continueReading.map((progress, i) => {
                  const text = texts.find(t => t.id === progress.textId)
                  if (!text) return null
                  return (
                    <motion.div
                      key={progress.textId}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link
                        to={`/texts/${progress.textId}`}
                        className="group block p-6 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] hover:border-[var(--accent-primary)]/50 hover:shadow-xl hover:shadow-[var(--accent-primary)]/5 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <span className="text-xs font-ui text-[var(--text-muted)] tracking-wider uppercase">
                            Book {progress.book}
                          </span>
                          <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center">
                            <svg className="w-4 h-4 text-[var(--accent-primary)] group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                        <h3 className="font-display text-xl font-medium text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent-primary)] transition-colors">
                          {text.title}
                        </h3>
                        <p className="text-sm text-[var(--text-tertiary)] font-ui">{text.author}</p>

                        <div className="mt-6">
                          <div className="h-1 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${Math.min((progress.book / 12) * 100, 100)}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: 0.3 }}
                              className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-primary-hover)] rounded-full"
                            />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Featured: Start Here */}
        {startHereWithData.length > 0 && (
          <section className="relative py-24 overflow-hidden">
            {/* Background accent */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--accent-primary)]/[0.02] to-transparent" />

            <div className="relative max-w-7xl mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <p className="text-xs font-ui text-[var(--accent-primary)] tracking-widest uppercase mb-3">For new readers</p>
                <h2 className="text-4xl md:text-5xl font-display font-medium text-[var(--text-primary)] mb-4">Start Here</h2>
                <p className="text-lg text-[var(--text-secondary)] font-body max-w-2xl mx-auto">
                  Accessible entry points into philosophy. Good places to begin.
                </p>
              </motion.div>

              {/* Featured grid - uniform cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {startHereWithData.map((text, i) => (
                  <motion.div
                    key={text.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Link
                      to={`/texts/${text.id}`}
                      className="group relative flex flex-col h-full p-6 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] hover:border-[var(--accent-primary)]/30 transition-all duration-500 overflow-hidden"
                    >
                      {/* Hover gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/0 to-[var(--accent-primary)]/0 group-hover:from-[var(--accent-primary)]/[0.03] group-hover:to-transparent transition-all duration-500" />

                      <div className="relative z-10 flex-1">
                        {/* Category badge */}
                        <div className="flex items-center justify-between mb-4">
                          <span className={`text-[10px] font-ui tracking-widest uppercase px-2 py-1 rounded-full ${
                            categoryStyles[text.category || 'ancient']?.bg || 'bg-[var(--bg-tertiary)]'
                          } ${categoryStyles[text.category || 'ancient']?.text || 'text-[var(--text-muted)]'}`}>
                            {text.category}
                          </span>
                          <svg className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>

                        {/* Title */}
                        <h3 className="font-display text-xl font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors mb-1">
                          {text.title}
                        </h3>
                        <p className="text-sm text-[var(--text-tertiary)] font-ui mb-4">{text.author}</p>

                        {/* Tagline */}
                        <p className="text-sm text-[var(--text-secondary)] font-body italic">
                          "{text.tagline}"
                        </p>
                      </div>

                      {/* Year at bottom */}
                      {text.year && (
                        <div className="relative z-10 mt-6 pt-4 border-t border-[var(--border-primary)]">
                          <span className="text-xs text-[var(--text-muted)] font-ui">{text.year}</span>
                        </div>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Philosophical Traditions */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <p className="text-xs font-ui text-[var(--accent-primary)] tracking-widest uppercase mb-3">Explore by tradition</p>
              <h2 className="text-4xl md:text-5xl font-display font-medium text-[var(--text-primary)] mb-4">Philosophical Traditions</h2>
              <p className="text-lg text-[var(--text-secondary)] font-body max-w-2xl mx-auto">
                From the agora of Athens to the monasteries of Tibet,
                discover wisdom across cultures and centuries.
              </p>
            </motion.div>

            {/* Two-column layout: Western and Eastern */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Western Philosophy */}
              <div>
                <h3 className="text-sm font-ui text-[var(--text-muted)] tracking-widest uppercase mb-6">Western Philosophy</h3>
                <div className="space-y-4">
                  {eras.slice(0, 4).map((era, i) => {
                    const eraTexts = textsByEra[era.id] || []
                    const isHovered = hoveredEra === era.id
                    return (
                      <motion.div
                        key={era.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <button
                          onMouseEnter={() => setHoveredEra(era.id)}
                          onMouseLeave={() => setHoveredEra(null)}
                          onClick={() => {
                            setFilterEra(era.id)
                            setShowAllLibrary(true)
                            document.getElementById('library')?.scrollIntoView({ behavior: 'smooth' })
                          }}
                          className={`group w-full p-6 rounded-xl border text-left transition-all duration-300 ${
                            isHovered
                              ? 'bg-[var(--bg-elevated)] border-[var(--accent-primary)]/30 shadow-lg'
                              : 'bg-[var(--bg-secondary)] border-[var(--border-primary)] hover:border-[var(--border-secondary)]'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-display text-2xl font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                                  {era.name}
                                </h4>
                                <span className="text-xs font-ui text-[var(--text-muted)]">{era.years}</span>
                              </div>
                              <p className="text-sm text-[var(--text-secondary)] font-body mb-3">{era.description}</p>
                              <p className="text-xs text-[var(--text-muted)] font-ui">
                                {eraTexts.length} texts available
                              </p>
                            </div>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                              isHovered ? 'bg-[var(--accent-primary)]' : 'bg-[var(--bg-tertiary)]'
                            }`}>
                              <span className={`font-display text-xl font-bold transition-colors ${
                                isHovered ? 'text-[var(--text-inverted)]' : 'text-[var(--text-secondary)]'
                              }`}>
                                {eraTexts.length}
                              </span>
                            </div>
                          </div>
                        </button>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* Eastern Philosophy */}
              <div>
                <h3 className="text-sm font-ui text-[var(--text-muted)] tracking-widest uppercase mb-6">Eastern Philosophy</h3>
                <div className="space-y-4">
                  {eras.slice(4).map((era, i) => {
                    const eraTexts = textsByEra[era.id] || []
                    const isHovered = hoveredEra === era.id
                    return (
                      <motion.div
                        key={era.id}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <button
                          onMouseEnter={() => setHoveredEra(era.id)}
                          onMouseLeave={() => setHoveredEra(null)}
                          onClick={() => {
                            setFilterEra(era.id)
                            setShowAllLibrary(true)
                            document.getElementById('library')?.scrollIntoView({ behavior: 'smooth' })
                          }}
                          className={`group w-full p-6 rounded-xl border text-left transition-all duration-300 ${
                            isHovered
                              ? 'bg-[var(--bg-elevated)] border-[var(--accent-primary)]/30 shadow-lg'
                              : 'bg-[var(--bg-secondary)] border-[var(--border-primary)] hover:border-[var(--border-secondary)]'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-display text-2xl font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                                  {era.name}
                                </h4>
                                <span className="text-xs font-ui text-[var(--text-muted)]">{era.years}</span>
                              </div>
                              <p className="text-sm text-[var(--text-secondary)] font-body mb-3">{era.description}</p>
                              <p className="text-xs text-[var(--text-muted)] font-ui">
                                {eraTexts.length} texts available
                              </p>
                            </div>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                              isHovered ? 'bg-[var(--accent-primary)]' : 'bg-[var(--bg-tertiary)]'
                            }`}>
                              <span className={`font-display text-xl font-bold transition-colors ${
                                isHovered ? 'text-[var(--text-inverted)]' : 'text-[var(--text-secondary)]'
                              }`}>
                                {eraTexts.length}
                              </span>
                            </div>
                          </div>
                        </button>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Thinkers Gallery */}
        <section className="py-24 bg-[var(--bg-secondary)]">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-end justify-between mb-12"
            >
              <div>
                <p className="text-xs font-ui text-[var(--accent-primary)] tracking-widest uppercase mb-3">The great minds</p>
                <h2 className="text-4xl md:text-5xl font-display font-medium text-[var(--text-primary)]">Philosophers</h2>
              </div>
              <button
                onClick={() => onOpenSearch()}
                className="hidden sm:flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors font-ui"
              >
                View all
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </motion.div>

            {/* Horizontal scroll gallery */}
            <div className="relative -mx-6 px-6">
              <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
                {philosophers.map((philosopher, i) => {
                  const imageUrl = philosopherImages[philosopher.name]
                  return (
                    <motion.button
                      key={philosopher.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => onOpenSearch(philosopher.name)}
                      className="group shrink-0 snap-start w-[180px] text-left"
                    >
                      {/* Avatar */}
                      <div className="relative w-full aspect-square mb-4 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] overflow-hidden group-hover:border-[var(--accent-primary)]/30 transition-all duration-300">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={philosopher.name}
                            className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="font-display text-6xl text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors duration-300">
                              {philosopher.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {/* Work count badge */}
                        <div className="absolute top-3 right-3 px-2 py-1 bg-[var(--bg-primary)]/80 backdrop-blur-sm rounded-full">
                          <span className="text-[10px] font-ui text-[var(--text-muted)]">{philosopher.textIds.length} works</span>
                        </div>
                      </div>

                      {/* Name */}
                      <h3 className="font-display text-lg font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors truncate">
                        {philosopher.name}
                      </h3>
                    </motion.button>
                  )
                })}
              </div>

              {/* Fade edges */}
              <div className="absolute left-0 top-0 bottom-6 w-12 bg-gradient-to-r from-[var(--bg-secondary)] to-transparent pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-6 w-12 bg-gradient-to-l from-[var(--bg-secondary)] to-transparent pointer-events-none" />
            </div>
          </div>
        </section>

        {/* Full Library */}
        <section id="library" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12"
            >
              <div>
                <p className="text-xs font-ui text-[var(--accent-primary)] tracking-widest uppercase mb-3">Complete collection</p>
                <h2 className="text-4xl md:text-5xl font-display font-medium text-[var(--text-primary)]">The Library</h2>
                <p className="text-lg text-[var(--text-secondary)] font-body mt-2">{filteredTexts.length} texts to explore</p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Era filter pills */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setFilterEra('all')}
                    className={`px-4 py-2 text-sm rounded-full transition-all font-ui ${
                      filterEra === 'all'
                        ? 'bg-[var(--accent-primary)] text-[var(--text-inverted)]'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-primary)] hover:border-[var(--accent-primary)]'
                    }`}
                  >
                    All
                  </button>
                  {eras.slice(0, 4).map(era => (
                    <button
                      key={era.id}
                      onClick={() => setFilterEra(era.id)}
                      className={`px-4 py-2 text-sm rounded-full transition-all font-ui ${
                        filterEra === era.id
                          ? 'bg-[var(--accent-primary)] text-[var(--text-inverted)]'
                          : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-primary)] hover:border-[var(--accent-primary)]'
                      }`}
                    >
                      {era.name}
                    </button>
                  ))}
                </div>

                {/* Sort dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-4 py-2 text-sm bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-full text-[var(--text-secondary)] font-ui focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                >
                  <option value="title">Sort by Title</option>
                  <option value="author">Sort by Author</option>
                  <option value="era">Sort by Era</option>
                </select>
              </div>
            </motion.div>

            {/* Library grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedTexts.map((text, i) => (
                <motion.div
                  key={text.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 6) * 0.05 }}
                >
                  <Link
                    to={`/texts/${text.id}`}
                    className="group h-full flex flex-col p-6 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] hover:border-[var(--accent-primary)]/30 hover:shadow-xl hover:shadow-[var(--accent-primary)]/5 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-display text-xl font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors flex-1 pr-3 leading-tight">
                        {text.title}
                      </h3>
                      {text.category && (
                        <span className={`text-[10px] font-ui tracking-wider uppercase px-2 py-1 rounded-full shrink-0 ${
                          categoryStyles[text.category]?.bg || 'bg-[var(--bg-tertiary)]'
                        } ${categoryStyles[text.category]?.text || 'text-[var(--text-muted)]'}`}>
                          {text.category}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-[var(--text-tertiary)] font-ui">{text.author}</p>
                    {text.year && (
                      <p className="text-xs text-[var(--text-muted)] mt-1 font-ui">{text.year}</p>
                    )}

                    {text.description && (
                      <p className="text-sm text-[var(--text-secondary)] mt-4 line-clamp-3 flex-1 font-body">
                        {text.description}
                      </p>
                    )}

                    <div className="mt-5 pt-4 border-t border-[var(--border-primary)] flex items-center justify-between">
                      <span className="text-sm text-[var(--accent-primary)] font-ui group-hover:translate-x-1 transition-transform">
                        Begin reading
                      </span>
                      <svg className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Show more */}
            {filteredTexts.length > 12 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-12 text-center"
              >
                <button
                  onClick={() => setShowAllLibrary(!showAllLibrary)}
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-full text-[var(--text-secondary)] font-ui hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all"
                >
                  <span>{showAllLibrary ? 'Show fewer' : `View all ${filteredTexts.length} texts`}</span>
                  <motion.svg
                    animate={{ rotate: showAllLibrary ? 180 : 0 }}
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-[var(--border-primary)] bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span className="font-display text-xl font-medium text-[var(--text-primary)]">Philosophy Insight</span>
              </div>
              <p className="text-sm text-[var(--text-secondary)] font-body leading-relaxed">
                Read philosophy with an AI companion. Discuss ideas paragraph by paragraph
                and deepen your understanding of humanity's greatest thinkers.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="text-xs font-ui text-[var(--text-muted)] tracking-widest uppercase mb-4">Quick Start</h4>
              <ul className="space-y-3">
                {startHereWithData.slice(0, 4).map(text => (
                  <li key={text.id}>
                    <Link
                      to={`/texts/${text.id}`}
                      className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors font-body"
                    >
                      {text.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stats */}
            <div>
              <h4 className="text-xs font-ui text-[var(--text-muted)] tracking-widest uppercase mb-4">The Collection</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-display text-3xl font-medium text-[var(--accent-primary)]">{texts.length}</p>
                  <p className="text-xs text-[var(--text-muted)] font-ui">Texts</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-medium text-[var(--accent-primary)]">{philosophers.length}+</p>
                  <p className="text-xs text-[var(--text-muted)] font-ui">Philosophers</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-medium text-[var(--accent-primary)]">2500+</p>
                  <p className="text-xs text-[var(--text-muted)] font-ui">Years of thought</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-medium text-[var(--accent-primary)]">8</p>
                  <p className="text-xs text-[var(--text-muted)] font-ui">Traditions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-[var(--border-primary)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[var(--text-muted)] font-ui">
              Texts sourced from public domain works. Built with care for seekers of wisdom.
            </p>
            <div className="flex items-center gap-4">
              <kbd className="flex items-center gap-1 px-2 py-1 text-xs text-[var(--text-muted)] bg-[var(--bg-tertiary)] rounded border border-[var(--border-primary)] font-ui">
                <span>⌘</span>K
              </kbd>
              <span className="text-xs text-[var(--text-muted)] font-ui">to search</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
