import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Panel, Group, Separator } from 'react-resizable-panels'
import ReaderComponent, { type ParagraphLocation, type ReaderHandle } from '../components/Reader'
import DiscussionPanel from '../components/DiscussionPanel'
import TableOfContents from '../components/TableOfContents'
import ReadingControls from '../components/ReadingControls'
import KeyboardShortcutsModal from '../components/KeyboardShortcutsModal'
import BookmarksPanel from '../components/BookmarksPanel'
import BookmarkModal from '../components/BookmarkModal'
import MobileReaderLayout from '../components/MobileReaderLayout'
import { useIsMobile } from '../hooks/useMediaQuery'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { useBookmarks } from '../hooks/useBookmarks'
import { useOnboarding } from '../hooks/useOnboarding'
import { downloadBookmarks } from '../utils/exportBookmarks'
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
  onOpenSearch: (author?: string) => void
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
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [showBookmarkModal, setShowBookmarkModal] = useState(false)
  const [pendingBookmark, setPendingBookmark] = useState<{ text: string; location: ParagraphLocation } | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isReadingMode, setIsReadingMode] = useState(false)
  const readerRef = useRef<ReaderHandle>(null)
  const isMobile = useIsMobile()
  const { bookmarks, addBookmark, removeBookmark, updateNote, getBookmarksForText } = useBookmarks()
  const { hasSeenHighlightHint, markHighlightHintSeen, isLoaded: onboardingLoaded } = useOnboarding()
  const [showHighlightHint, setShowHighlightHint] = useState(false)

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
    setIsReadingMode(false) // Exit reading mode to show the chat panel
  }, [])

  const handleQuoteUsed = useCallback(() => {
    setPendingQuote(null)
  }, [])

  const handleSaveBookmark = useCallback((selectedText: string, location: ParagraphLocation) => {
    setPendingBookmark({ text: selectedText, location })
    setShowBookmarkModal(true)
  }, [])

  const handleConfirmBookmark = useCallback((note: string) => {
    if (pendingBookmark && text) {
      addBookmark({
        textId: text.id,
        textTitle: text.title,
        textAuthor: text.author,
        book: pendingBookmark.location.book,
        section: pendingBookmark.location.section,
        paragraphIndex: pendingBookmark.location.index,
        selectedText: pendingBookmark.text,
        note: note || undefined,
      })
    }
    setShowBookmarkModal(false)
    setPendingBookmark(null)
  }, [pendingBookmark, text, addBookmark])

  const handleScrollToBookmark = useCallback((paragraphIndex: number) => {
    // Find the book for this paragraph
    if (text) {
      const section = text.sections[paragraphIndex]
      if (section) {
        readerRef.current?.scrollToBook(section.book)
        // After scrolling to book, scroll to specific paragraph
        setTimeout(() => {
          const element = document.querySelector(`[data-paragraph-index="${paragraphIndex}"]`)
          element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 300)
      }
    }
  }, [text])

  const handleExportBookmarks = useCallback(() => {
    if (text) {
      const textBookmarks = getBookmarksForText(text.id)
      downloadBookmarks(textBookmarks, text.title, text.author)
    }
  }, [text, getBookmarksForText])

  const handleScroll = useCallback((progress: number) => {
    setReadingProgress(progress)
  }, [])

  const handleBookChange = useCallback((book: number) => {
    setCurrentBook(book)
  }, [])

  const handleSectionChange = useCallback((sectionIndex: number) => {
    // Save to localStorage whenever section changes
    if (textId && text) {
      const section = text.sections[sectionIndex]
      if (section) {
        localStorage.setItem(`reading-position-${textId}`, JSON.stringify({
          book: section.book,
          sectionIndex,
          progress: readingProgress
        }))
      }
    }
  }, [textId, text, readingProgress])

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

  // Show highlight hint for first-time desktop visitors
  useEffect(() => {
    if (!isMobile && onboardingLoaded && !hasSeenHighlightHint && text) {
      // Show hint after a short delay to let user settle in
      const timer = setTimeout(() => {
        setShowHighlightHint(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isMobile, onboardingLoaded, hasSeenHighlightHint, text])

  // Auto-dismiss highlight hint after 8 seconds
  useEffect(() => {
    if (showHighlightHint) {
      const timer = setTimeout(() => {
        setShowHighlightHint(false)
        markHighlightHintSeen()
      }, 8000)
      return () => clearTimeout(timer)
    }
  }, [showHighlightHint, markHighlightHintSeen])

  // Keyboard shortcuts - always enabled for toggle shortcuts
  useKeyboardShortcuts([
    { key: 'f', handler: toggleFullscreen },
    { key: 'Escape', handler: () => {
      if (isFullscreen) document.exitFullscreen()
      setShowTOC(false)
      setShowControls(false)
      setShowShortcuts(false)
      setShowBookmarks(false)
      setShowBookmarkModal(false)
    }},
    { key: '\\', metaKey: true, handler: () => setShowTOC(prev => !prev) },
    { key: 'b', metaKey: true, handler: () => setShowBookmarks(prev => !prev) },
    { key: '?', shiftKey: true, handler: () => setShowShortcuts(prev => !prev) },
    { key: '.', metaKey: true, handler: () => setIsReadingMode(prev => !prev) },
  ], true)

  // Restore reading position on load
  useEffect(() => {
    if (textId && text && books.length > 0) {
      const saved = localStorage.getItem(`reading-position-${textId}`)
      if (saved) {
        try {
          const { book, sectionIndex } = JSON.parse(saved)
          // Prefer section-level restore if available
          if (typeof sectionIndex === 'number' && sectionIndex >= 0 && sectionIndex < text.sections.length) {
            setCurrentBook(text.sections[sectionIndex].book)
            // Delay scroll to let content render
            setTimeout(() => {
              readerRef.current?.scrollToSection(sectionIndex)
            }, 100)
          } else if (books.includes(book)) {
            // Fall back to book-level restore for older saved data
            setCurrentBook(book)
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

  // Mobile gets a completely different layout
  if (isMobile) {
    return (
      <MobileReaderLayout
        textId={text.id}
        title={text.title}
        author={text.author}
        category={text.category}
        sections={text.sections}
        onOpenSearch={onOpenSearch}
      />
    )
  }

  // Desktop layout
  return (
    <div className="reader-page h-full bg-[var(--bg-primary)] flex flex-col">
      {/* Header */}
      <header className="bg-[var(--bg-secondary)] border-b border-[var(--border-primary)] px-4 md:px-6 py-3 md:py-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
            <Link
              to="/"
              className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors shrink-0"
              title="Back to library"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>

            {/* TOC button */}
            <button
              onClick={() => setShowTOC(true)}
              className="p-2 rounded text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              title="Table of Contents (⌘\)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>

            {/* Bookmarks button */}
            <button
              onClick={() => setShowBookmarks(true)}
              className="p-2 rounded text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              title="Bookmarks (⌘B)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>

            <div className="min-w-0">
              <h1 className="text-lg md:text-xl font-display font-semibold text-[var(--text-primary)] truncate">{text.title}</h1>
              <p className="text-[var(--text-muted)] text-sm hidden md:block font-ui">{text.author}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            {/* Search button */}
            <button
              onClick={() => onOpenSearch()}
              className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              title="Search (⌘K)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Reading mode button */}
            <button
              onClick={() => setIsReadingMode(prev => !prev)}
              className={`p-2 rounded-lg transition-colors ${
                isReadingMode
                  ? 'text-[var(--accent-primary)] bg-[var(--accent-bg)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
              }`}
              title={isReadingMode ? 'Exit reading mode (⌘.)' : 'Enter reading mode (⌘.)'}
            >
              {isReadingMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              )}
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
                  className="flex items-center gap-2 px-4 py-2 rounded border border-[var(--border-primary)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-tertiary)] transition-colors text-sm font-ui"
                >
                  <span className="text-[var(--text-primary)] font-medium">Book {currentBook}</span>
                  <span className="text-[var(--text-muted)]">of {totalBooks}</span>
                  <svg className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${showBookMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showBookMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowBookMenu(false)}
                    />
                    <div className="absolute right-0 mt-1 w-48 bg-[var(--bg-secondary)] rounded shadow-lg border border-[var(--border-secondary)] py-1 z-20 max-h-64 overflow-y-auto">
                      {books.map(book => (
                        <button
                          key={book}
                          onClick={() => handleBookSelect(book)}
                          className={`w-full text-left px-4 py-2.5 text-sm font-ui hover:bg-[var(--bg-tertiary)] transition-colors ${
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
        <Panel defaultSize={isMobile ? 60 : 75} minSize={30}>
          <div className="h-full overflow-y-auto bg-[var(--bg-primary)]">
            <ReaderComponent
              ref={readerRef}
              sections={text.sections}
              onSelectText={handleSelectText}
              onSaveBookmark={handleSaveBookmark}
              onScroll={handleScroll}
              onBookChange={handleBookChange}
              onSectionChange={handleSectionChange}
            />
          </div>
        </Panel>

        {!isReadingMode && (
          <>
            <Separator className={
              isMobile
                ? 'h-2 bg-[var(--border-primary)] hover:bg-[var(--border-secondary)] active:bg-[var(--text-muted)] transition-colors cursor-row-resize'
                : 'w-1 bg-[var(--border-primary)] hover:bg-[var(--border-secondary)] active:bg-[var(--text-muted)] transition-colors cursor-col-resize'
            } />

            <Panel defaultSize={isMobile ? 40 : 25} minSize={20}>
              <div className="h-full bg-[var(--bg-secondary)] shadow-lg">
                <DiscussionPanel
                  textId={text.id}
                  textTitle={text.title}
                  textAuthor={text.author}
                  textCategory={text.category}
                  activeParagraph={activeParagraph}
                  pendingQuote={pendingQuote}
                  onQuoteUsed={handleQuoteUsed}
                />
              </div>
            </Panel>
          </>
        )}
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

      {/* Bookmarks panel */}
      <BookmarksPanel
        bookmarks={bookmarks}
        textId={text.id}
        isOpen={showBookmarks}
        onClose={() => setShowBookmarks(false)}
        onSelectBookmark={handleScrollToBookmark}
        onDeleteBookmark={removeBookmark}
        onUpdateNote={updateNote}
        onExport={handleExportBookmarks}
      />

      {/* Bookmark modal */}
      {pendingBookmark && (
        <BookmarkModal
          isOpen={showBookmarkModal}
          onClose={() => {
            setShowBookmarkModal(false)
            setPendingBookmark(null)
          }}
          onSave={handleConfirmBookmark}
          selectedText={pendingBookmark.text}
          location={pendingBookmark.location}
        />
      )}

      {/* Highlight hint toast */}
      {showHighlightHint && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300"
          role="alert"
        >
          <div className="flex items-center gap-3 px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg shadow-lg">
            <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <p className="text-sm text-[var(--text-secondary)] font-ui">
              <span className="text-[var(--text-primary)] font-medium">Highlight any passage</span> to discuss it
            </p>
            <button
              onClick={() => {
                setShowHighlightHint(false)
                markHighlightHintSeen()
              }}
              className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
