import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Panel, Group, Separator } from 'react-resizable-panels'
import ReaderComponent, { type ParagraphLocation, type ReaderHandle } from '../components/Reader'
import DiscussionPanel from '../components/DiscussionPanel'
import TableOfContents from '../components/TableOfContents'
import ReadingControls from '../components/ReadingControls'
import KeyboardShortcutsModal from '../components/KeyboardShortcutsModal'
import { useIsMobile } from '../hooks/useMediaQuery'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { API_URL } from '../config'

interface Section {
  book: number
  number: number
  content: string
}

interface TextData {
  id: string
  title: string
  author: string
  category?: string
  sections: Section[]
}

interface ReaderPageProps {
  onOpenSearch: () => void
}

export default function Reader({ onOpenSearch }: ReaderPageProps) {
  const { textId } = useParams<{ textId: string }>()
  const [text, setText] = useState<TextData | null>(null)
  const [pendingQuote, setPendingQuote] = useState<string | null>(null)
  const [activeParagraph, setActiveParagraph] = useState<ParagraphLocation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [readingProgress, setReadingProgress] = useState(0)
  const [currentBook, setCurrentBook] = useState(1)
  const [showBookMenu, setShowBookMenu] = useState(false)
  const [showTOC, setShowTOC] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const readerRef = useRef<ReaderHandle>(null)
  const isMobile = useIsMobile()

  // Get unique books from sections
  const books = text
    ? Array.from(new Set(text.sections.map(s => s.book))).sort((a, b) => a - b)
    : []
  const totalBooks = books.length

  useEffect(() => {
    if (!textId) return

    setLoading(true)
    setError(null)

    fetch(`${API_URL}/texts/${textId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load text')
        return res.json()
      })
      .then(data => {
        setText(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [textId])

  const handleSelectText = useCallback((selectedText: string, location: ParagraphLocation) => {
    setPendingQuote(selectedText)
    setActiveParagraph(location)
  }, [])

  const handleQuoteUsed = useCallback(() => {
    setPendingQuote(null)
  }, [])

  const handleScroll = useCallback((progress: number) => {
    setReadingProgress(progress)
  }, [])

  const handleBookChange = useCallback((book: number) => {
    setCurrentBook(book)
    // Save to localStorage
    if (textId) {
      localStorage.setItem(`reading-position-${textId}`, JSON.stringify({ book, progress: readingProgress }))
    }
  }, [textId, readingProgress])

  const handleBookSelect = useCallback((book: number) => {
    setShowBookMenu(false)
    readerRef.current?.scrollToBook(book)
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Keyboard shortcuts - always enabled for toggle shortcuts
  useKeyboardShortcuts([
    { key: 'f', handler: toggleFullscreen },
    { key: 'Escape', handler: () => {
      if (isFullscreen) document.exitFullscreen()
      setShowTOC(false)
      setShowControls(false)
      setShowShortcuts(false)
    }},
    { key: '\\', metaKey: true, handler: () => setShowTOC(prev => !prev) },
    { key: '/', shiftKey: true, handler: () => setShowShortcuts(prev => !prev) },
  ], true)

  // Restore reading position on load
  useEffect(() => {
    if (textId && text && books.length > 0) {
      const saved = localStorage.getItem(`reading-position-${textId}`)
      if (saved) {
        try {
          const { book } = JSON.parse(saved)
          if (books.includes(book)) {
            setCurrentBook(book)
            // Delay scroll to let content render
            setTimeout(() => {
              readerRef.current?.scrollToBook(book)
            }, 100)
          }
        } catch {
          // Ignore invalid saved data
        }
      }
    }
  }, [textId, text, books.length])

  if (loading) {
    return (
      <div className="h-full bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--border-secondary)] border-t-[var(--text-tertiary)] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--text-muted)] text-sm">Loading text...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-[var(--text-primary)] font-medium mb-1">Text Not Found</p>
          <p className="text-[var(--text-muted)] text-sm">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center mt-4 text-[var(--accent-primary)] hover:opacity-80 text-sm font-medium"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to library
          </Link>
        </div>
      </div>
    )
  }

  if (!text) return null

  return (
    <div className="reader-page h-full bg-[var(--bg-primary)] flex flex-col">
      {/* Header */}
      <header className="bg-[var(--bg-secondary)] border-b border-[var(--border-primary)] px-4 md:px-6 py-3 md:py-4 shrink-0 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
            <Link
              to="/"
              className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors shrink-0"
              title="Back to library"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>

            {/* TOC button */}
            <button
              onClick={() => setShowTOC(true)}
              className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              title="Table of Contents (⌘\)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>

            <div className="min-w-0">
              <h1 className="text-lg md:text-xl font-serif font-bold text-[var(--text-primary)] truncate">{text.title}</h1>
              <p className="text-[var(--text-muted)] text-sm hidden md:block">{text.author}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            {/* Search button */}
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              title="Search (⌘K)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Reading controls button */}
            <div className="relative">
              <button
                onClick={() => setShowControls(!showControls)}
                className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                title="Reading settings"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </button>
              <ReadingControls
                isOpen={showControls}
                onClose={() => setShowControls(false)}
                onFullscreen={toggleFullscreen}
                isFullscreen={isFullscreen}
              />
            </div>

            {/* Book selector - hidden on mobile */}
            {!isMobile && totalBooks > 1 && (
              <div className="relative">
                <button
                  onClick={() => setShowBookMenu(!showBookMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors text-sm"
                >
                  <span className="text-[var(--text-secondary)] font-medium">Book {currentBook}</span>
                  <span className="text-[var(--text-muted)]">of {totalBooks}</span>
                  <svg className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${showBookMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showBookMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowBookMenu(false)}
                    />
                    <div className="absolute right-0 mt-1 w-48 bg-[var(--bg-secondary)] rounded-lg shadow-lg border border-[var(--border-primary)] py-1 z-20 max-h-64 overflow-y-auto">
                      {books.map(book => (
                        <button
                          key={book}
                          onClick={() => handleBookSelect(book)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-[var(--bg-tertiary)] transition-colors ${
                            book === currentBook ? 'text-[var(--accent-primary)] font-medium bg-[var(--accent-bg)]' : 'text-[var(--text-secondary)]'
                          }`}
                        >
                          Book {book}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Reading progress - compact on mobile */}
            <div className="flex items-center gap-2 md:gap-3">
              <span className="text-xs text-[var(--text-muted)]">{Math.round(readingProgress * 100)}%</span>
              <div className="w-16 md:w-24 h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--accent-primary)] rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${readingProgress * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content with resizable panels */}
      <Group orientation={isMobile ? 'vertical' : 'horizontal'} className="flex-1">
        <Panel defaultSize={isMobile ? 60 : 50} minSize={30}>
          <div className="h-full overflow-y-auto bg-[var(--bg-primary)]">
            <ReaderComponent
              ref={readerRef}
              sections={text.sections}
              onSelectText={handleSelectText}
              onScroll={handleScroll}
              onBookChange={handleBookChange}
            />
          </div>
        </Panel>

        <Separator className={
          isMobile
            ? 'h-2 bg-[var(--border-primary)] hover:bg-[var(--border-secondary)] active:bg-[var(--text-muted)] transition-colors cursor-row-resize'
            : 'w-1 bg-[var(--border-primary)] hover:bg-[var(--border-secondary)] active:bg-[var(--text-muted)] transition-colors cursor-col-resize'
        } />

        <Panel defaultSize={isMobile ? 40 : 50} minSize={20}>
          <div className="h-full bg-[var(--bg-secondary)] shadow-lg">
            <DiscussionPanel
              textId={text.id}
              textTitle={text.title}
              textAuthor={text.author}
              textCategory={text.category}
              sections={text.sections}
              activeParagraph={activeParagraph}
              pendingQuote={pendingQuote}
              onQuoteUsed={handleQuoteUsed}
            />
          </div>
        </Panel>
      </Group>

      {/* Table of Contents sidebar */}
      <TableOfContents
        sections={text.sections}
        currentBook={currentBook}
        isOpen={showTOC}
        onClose={() => setShowTOC(false)}
        onSelectBook={handleBookSelect}
      />

      {/* Keyboard shortcuts modal */}
      <KeyboardShortcutsModal
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </div>
  )
}
