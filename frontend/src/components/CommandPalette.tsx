import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Fuse from 'fuse.js'

interface TextInfo {
  id: string
  title: string
  author: string
  description?: string
  year?: string
  category?: string
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  texts: TextInfo[]
  initialAuthor?: string | null
}

const RECENT_SEARCHES_KEY = 'philosophy-insight-recent-searches'
const MAX_RECENT = 5

export default function CommandPalette({ isOpen, onClose, texts, initialAuthor }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored))
      } catch {
        // Ignore invalid data
      }
    }
  }, [])

  // Fuse.js search instance
  const fuse = useMemo(() => {
    return new Fuse(texts, {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'author', weight: 0.3 },
        { name: 'description', weight: 0.2 },
        { name: 'category', weight: 0.1 },
      ],
      threshold: 0.4,
      includeScore: true,
      ignoreLocation: true,
    })
  }, [texts])

  // Texts by selected author (when an author is clicked)
  const textsByAuthor = useMemo(() => {
    if (!selectedAuthor) return []
    return texts.filter(t => t.author === selectedAuthor)
  }, [selectedAuthor, texts])

  // Search results
  const results = useMemo(() => {
    if (selectedAuthor) {
      // When author is selected, show all their texts
      return textsByAuthor
    }
    if (!query.trim()) {
      // Show recent texts when no query
      return []
    }
    return fuse.search(query).slice(0, 15).map(r => r.item)
  }, [query, fuse, selectedAuthor, textsByAuthor])

  // Get unique authors for grouping (only when not in author mode)
  const authorResults = useMemo(() => {
    if (selectedAuthor) return [] // Don't show author cards when viewing an author's texts
    if (!query.trim()) return []
    const queryLower = query.toLowerCase()
    const authors = new Map<string, { author: string; count: number; category: string }>()

    texts.forEach(text => {
      if (text.author.toLowerCase().includes(queryLower)) {
        const existing = authors.get(text.author)
        if (existing) {
          existing.count++
        } else {
          authors.set(text.author, {
            author: text.author,
            count: 1,
            category: text.category || 'ancient',
          })
        }
      }
    })

    return Array.from(authors.values()).slice(0, 3)
  }, [query, texts, selectedAuthor])

  // Combined results for display
  const displayItems = useMemo(() => {
    const items: Array<{ type: 'text' | 'author' | 'recent'; data: TextInfo | { author: string; count: number; category: string } | TextInfo }> = []

    if (selectedAuthor) {
      // Show all texts by selected author
      results.forEach(text => {
        items.push({ type: 'text', data: text })
      })
    } else if (!query.trim()) {
      // Show recent texts
      recentSearches.forEach(id => {
        const text = texts.find(t => t.id === id)
        if (text) {
          items.push({ type: 'recent', data: text })
        }
      })
    } else {
      // Add author matches first
      authorResults.forEach(author => {
        items.push({ type: 'author', data: author })
      })
      // Add text matches
      results.forEach(text => {
        items.push({ type: 'text', data: text })
      })
    }

    return items
  }, [query, results, authorResults, recentSearches, texts, selectedAuthor])

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [displayItems.length])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      // Only reset selectedAuthor if no initialAuthor is provided
      setSelectedAuthor(initialAuthor || null)
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen, initialAuthor])

  // Scroll selected item into view
  useEffect(() => {
    const list = listRef.current
    if (!list) return

    const selectedElement = list.children[selectedIndex] as HTMLElement
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  const addToRecent = useCallback((textId: string) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(id => id !== textId)
      const updated = [textId, ...filtered].slice(0, MAX_RECENT)
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const handleSelect = useCallback((item: typeof displayItems[number]) => {
    if (item.type === 'author') {
      const author = (item.data as { author: string }).author
      setSelectedAuthor(author)
      setQuery('') // Clear query to show all texts by author
      setSelectedIndex(0)
      return
    }

    const text = item.data as TextInfo
    addToRecent(text.id)
    navigate(`/texts/${text.id}`)
    onClose()
  }, [navigate, onClose, addToRecent])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, displayItems.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (displayItems[selectedIndex]) {
          handleSelect(displayItems[selectedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        onClose()
        break
    }
  }, [displayItems, selectedIndex, handleSelect, onClose])

  // Global keyboard shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K or /
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (isOpen) {
          onClose()
        } else {
          // This is handled by parent
        }
      }
    }

    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => document.removeEventListener('keydown', handleGlobalKeyDown)
  }, [isOpen, onClose])

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'ancient': return 'bg-[var(--category-ancient-bg)] text-[var(--category-ancient-text)]'
      case 'medieval': return 'bg-[var(--category-medieval-bg)] text-[var(--category-medieval-text)]'
      case 'enlightenment': return 'bg-[var(--category-enlightenment-bg)] text-[var(--category-enlightenment-text)]'
      case 'modern': return 'bg-[var(--category-modern-bg)] text-[var(--category-modern-text)]'
      default: return 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 command-palette-backdrop"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed left-1/2 top-[20%] -translate-x-1/2 z-50 w-full max-w-xl"
          >
            <div className="mx-4 overflow-hidden rounded-xl bg-[var(--bg-secondary)] shadow-2xl border border-[var(--border-primary)]">
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 border-b border-[var(--border-primary)]">
                {selectedAuthor ? (
                  <button
                    onClick={() => setSelectedAuthor(null)}
                    className="p-1 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors shrink-0"
                    title="Back to search"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                ) : (
                  <svg className="w-5 h-5 text-[var(--text-muted)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
                {selectedAuthor ? (
                  <div className="flex-1 py-4 flex items-center gap-2">
                    <span className="text-[var(--text-primary)] font-medium">{selectedAuthor}</span>
                    <span className="text-[var(--text-muted)]">·</span>
                    <span className="text-[var(--text-muted)] text-sm">{textsByAuthor.length} texts</span>
                  </div>
                ) : (
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search texts, authors, or topics..."
                    className="flex-1 py-4 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none ring-0 border-none text-base"
                    style={{ outline: 'none' }}
                  />
                )}
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs text-[var(--text-muted)] bg-[var(--bg-tertiary)] rounded">
                  esc
                </kbd>
              </div>

              {/* Results */}
              <div ref={listRef} className="max-h-[60vh] overflow-y-auto">
                {displayItems.length === 0 && query.trim() && !selectedAuthor && (
                  <div className="px-4 py-8 text-center">
                    <p className="text-[var(--text-muted)]">No results found for "{query}"</p>
                    <p className="text-sm text-[var(--text-muted)] mt-1">Try searching for a title, author, or topic</p>
                  </div>
                )}

                {displayItems.length === 0 && !query.trim() && !selectedAuthor && (
                  <div className="px-4 py-6 text-center">
                    <p className="text-[var(--text-tertiary)] text-sm">
                      Start typing to search 136 philosophical texts
                    </p>
                  </div>
                )}

                {displayItems.length > 0 && (
                  <div className="py-2">
                    {selectedAuthor && (
                      <div className="px-4 py-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                        Works by {selectedAuthor}
                      </div>
                    )}

                    {!selectedAuthor && !query.trim() && displayItems.length > 0 && (
                      <div className="px-4 py-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                        Recent
                      </div>
                    )}

                    {!selectedAuthor && query.trim() && authorResults.length > 0 && (
                      <div className="px-4 py-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                        Authors
                      </div>
                    )}

                    {displayItems.map((item, index) => {
                      const isSelected = index === selectedIndex

                      if (item.type === 'author') {
                        const authorData = item.data as { author: string; count: number; category: string }
                        return (
                          <button
                            key={`author-${authorData.author}`}
                            onClick={() => handleSelect(item)}
                            className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                              isSelected ? 'bg-[var(--accent-bg)]' : 'hover:bg-[var(--bg-tertiary)]'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center shrink-0">
                              <svg className="w-4 h-4 text-[var(--text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[var(--text-primary)] font-medium">{authorData.author}</p>
                              <p className="text-sm text-[var(--text-muted)]">{authorData.count} texts</p>
                            </div>
                            <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        )
                      }

                      // Render section header for texts after authors (not in author mode)
                      const showTextsHeader = !selectedAuthor &&
                        query.trim() &&
                        item.type === 'text' &&
                        index > 0 &&
                        displayItems[index - 1].type === 'author'

                      const text = item.data as TextInfo
                      return (
                        <div key={text.id}>
                          {showTextsHeader && (
                            <div className="px-4 py-2 mt-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide border-t border-[var(--border-primary)]">
                              Texts
                            </div>
                          )}
                          <button
                            onClick={() => handleSelect(item)}
                            className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                              isSelected ? 'bg-[var(--accent-bg)]' : 'hover:bg-[var(--bg-tertiary)]'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center shrink-0">
                              <svg className="w-4 h-4 text-[var(--text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[var(--text-primary)] font-medium truncate">{text.title}</p>
                              <p className="text-sm text-[var(--text-muted)] truncate">{text.author}</p>
                            </div>
                            {text.category && (
                              <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${getCategoryColor(text.category)}`}>
                                {text.category}
                              </span>
                            )}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-[var(--border-primary)] flex items-center justify-between text-xs text-[var(--text-muted)]">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded">↑↓</kbd>
                    navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded">↵</kbd>
                    select
                  </span>
                </div>
                <span>136 texts</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
