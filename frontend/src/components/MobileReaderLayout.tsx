import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MobileHeader from './MobileHeader'
import MobileBottomSheet, { type SnapPoint } from './MobileBottomSheet'
import ReaderComponent, { type ParagraphLocation, type ReaderHandle } from './Reader'
import DiscussionPanel from './DiscussionPanel'
import TableOfContents from './TableOfContents'
import ReadingControls from './ReadingControls'
import BookmarksPanel from './BookmarksPanel'
import BookmarkModal from './BookmarkModal'
import { useTextSelection } from '../hooks/useTextSelection'
import { useConversations } from '../hooks/useConversations'
import { useBookmarks } from '../hooks/useBookmarks'
import { useOnboarding } from '../hooks/useOnboarding'
import { downloadBookmarks } from '../utils/exportBookmarks'

interface Section {
  book: number
  number: number
  content: string
}

interface MobileReaderLayoutProps {
  textId: string
  title: string
  author: string
  category?: string
  sections: Section[]
  onOpenSearch: () => void
}

export default function MobileReaderLayout({
  textId,
  title,
  author,
  category,
  sections,
  onOpenSearch,
}: MobileReaderLayoutProps) {
  // Sheet state
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [sheetSnapPoint, setSheetSnapPoint] = useState<SnapPoint>('half')

  // Reader state
  const [readingProgress, setReadingProgress] = useState(0)
  const [currentBook, setCurrentBook] = useState(1)
  const [activeParagraph, setActiveParagraph] = useState<ParagraphLocation | null>(null)
  const [pendingQuote, setPendingQuote] = useState<string | null>(null)

  // UI state
  const [showTOC, setShowTOC] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [showBookmarkModal, setShowBookmarkModal] = useState(false)
  const [showSelectionPopup, setShowSelectionPopup] = useState(false)
  const [selectionPosition, setSelectionPosition] = useState({ x: 0, y: 0 })
  const [selectedText, setSelectedText] = useState('')
  const [pendingBookmark, setPendingBookmark] = useState<{ text: string; location: ParagraphLocation } | null>(null)
  const [showMobileHint, setShowMobileHint] = useState(false)

  const readerRef = useRef<ReaderHandle>(null)
  const readerContainerRef = useRef<HTMLDivElement>(null)

  // Get message count from conversations hook
  const { messages } = useConversations(textId)
  const { bookmarks, addBookmark, removeBookmark, updateNote, getBookmarksForText } = useBookmarks()
  const { isFirstTimeUser, isLoaded: onboardingLoaded } = useOnboarding()

  // Get unique books
  const books = Array.from(new Set(sections.map(s => s.book))).sort((a, b) => a - b)
  const totalBooks = books.length

  // Text selection handling
  const { clearSelection } = useTextSelection({
    containerRef: readerContainerRef,
    onSelect: (data) => {
      // Position popup BELOW the selection (Chrome's menu appears above)
      setSelectionPosition({
        x: data.rect.left + data.rect.width / 2,
        y: data.rect.bottom + 10,
      })
      setSelectedText(data.text)
      setShowSelectionPopup(true)

      // Find the paragraph location
      const sel = window.getSelection()
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0)
        let element = range.startContainer.nodeType === Node.TEXT_NODE
          ? range.startContainer.parentElement
          : range.startContainer as HTMLElement

        while (element && !element.hasAttribute('data-paragraph-index')) {
          element = element.parentElement
        }

        if (element) {
          const index = parseInt(element.getAttribute('data-paragraph-index') || '-1', 10)
          if (index >= 0 && index < sections.length) {
            const section = sections[index]
            setActiveParagraph({
              book: section.book,
              section: section.number,
              content: section.content,
              index,
            })
          }
        }
      }
    },
    onClear: () => {
      setShowSelectionPopup(false)
      setSelectedText('')
    },
    minLength: 3,
  })

  // Handle "Discuss" button click
  const handleDiscuss = useCallback(() => {
    if (selectedText) {
      setPendingQuote(selectedText)
      setIsSheetOpen(true)
      setSheetSnapPoint('half')
      setShowSelectionPopup(false)
      clearSelection()
    }
  }, [selectedText, clearSelection])

  // Handle "Save" button click
  const handleSave = useCallback(() => {
    if (selectedText && activeParagraph) {
      setPendingBookmark({ text: selectedText, location: activeParagraph })
      setShowBookmarkModal(true)
      setShowSelectionPopup(false)
      clearSelection()
    }
  }, [selectedText, activeParagraph, clearSelection])

  // Handle bookmark confirmation
  const handleConfirmBookmark = useCallback((note: string) => {
    if (pendingBookmark) {
      addBookmark({
        textId,
        textTitle: title,
        textAuthor: author,
        book: pendingBookmark.location.book,
        section: pendingBookmark.location.section,
        paragraphIndex: pendingBookmark.location.index,
        selectedText: pendingBookmark.text,
        note: note || undefined,
      })
    }
    setShowBookmarkModal(false)
    setPendingBookmark(null)
  }, [pendingBookmark, textId, title, author, addBookmark])

  // Handle scroll to bookmark
  const handleScrollToBookmark = useCallback((paragraphIndex: number) => {
    const section = sections[paragraphIndex]
    if (section) {
      readerRef.current?.scrollToBook(section.book)
      setTimeout(() => {
        const element = document.querySelector(`[data-paragraph-index="${paragraphIndex}"]`)
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 300)
    }
  }, [sections])

  // Handle export bookmarks
  const handleExportBookmarks = useCallback(() => {
    const textBookmarks = getBookmarksForText(textId)
    downloadBookmarks(textBookmarks, title, author)
  }, [textId, title, author, getBookmarksForText])

  // Handle quote used in chat
  const handleQuoteUsed = useCallback(() => {
    setPendingQuote(null)
  }, [])

  // Scroll handling
  const handleScroll = useCallback((progress: number) => {
    setReadingProgress(progress)
  }, [])

  const handleBookChange = useCallback((book: number) => {
    setCurrentBook(book)
  }, [])

  const handleSectionChange = useCallback((sectionIndex: number) => {
    // Save to localStorage whenever section changes
    if (textId && sections.length > 0) {
      const section = sections[sectionIndex]
      if (section) {
        localStorage.setItem(`reading-position-${textId}`, JSON.stringify({
          book: section.book,
          sectionIndex,
          progress: readingProgress
        }))
      }
    }
  }, [textId, sections, readingProgress])

  const handleBookSelect = useCallback((book: number) => {
    setShowTOC(false)
    readerRef.current?.scrollToBook(book)
  }, [])

  // Toggle chat
  const toggleChat = useCallback(() => {
    if (isSheetOpen) {
      setIsSheetOpen(false)
    } else {
      setIsSheetOpen(true)
      setSheetSnapPoint('half')
    }
  }, [isSheetOpen])

  // Restore reading position
  useEffect(() => {
    if (textId && sections.length > 0 && books.length > 0) {
      const saved = localStorage.getItem(`reading-position-${textId}`)
      if (saved) {
        try {
          const { book, sectionIndex } = JSON.parse(saved)
          // Prefer section-level restore if available
          if (typeof sectionIndex === 'number' && sectionIndex >= 0 && sectionIndex < sections.length) {
            setCurrentBook(sections[sectionIndex].book)
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
  }, [textId, sections.length, books.length])

  // Add/remove body class when sheet is open
  useEffect(() => {
    if (isSheetOpen) {
      document.body.classList.add('sheet-open')
    } else {
      document.body.classList.remove('sheet-open')
    }
    return () => {
      document.body.classList.remove('sheet-open')
    }
  }, [isSheetOpen])

  // Show mobile hint for first-time users
  useEffect(() => {
    if (onboardingLoaded && isFirstTimeUser && !isSheetOpen) {
      // Delay showing the hint so user can see the page first
      const showTimer = setTimeout(() => {
        setShowMobileHint(true)
      }, 1500)

      return () => clearTimeout(showTimer)
    }
  }, [onboardingLoaded, isFirstTimeUser, isSheetOpen])

  // Auto-dismiss mobile hint after 5 seconds
  useEffect(() => {
    if (showMobileHint) {
      const dismissTimer = setTimeout(() => {
        setShowMobileHint(false)
      }, 5000)

      return () => clearTimeout(dismissTimer)
    }
  }, [showMobileHint])

  return (
    <div className="mobile-reader bg-[var(--bg-primary)]">
      {/* Header */}
      <MobileHeader
        title={title}
        progress={readingProgress}
        currentBook={currentBook}
        totalBooks={totalBooks}
        onOpenSearch={onOpenSearch}
        onOpenTOC={() => setShowTOC(true)}
        onOpenBookmarks={() => setShowBookmarks(true)}
        onOpenSettings={() => setShowControls(true)}
        messageCount={messages.length}
        bookmarkCount={getBookmarksForText(textId).length}
        onChatToggle={toggleChat}
        isChatOpen={isSheetOpen}
      />

      {/* Reader content */}
      <div
        ref={readerContainerRef}
        className="flex-1 overflow-hidden"
      >
        <ReaderComponent
          ref={readerRef}
          sections={sections}
          onSelectText={() => {}} // Selection handled by useTextSelection
          onScroll={handleScroll}
          onBookChange={handleBookChange}
          onSectionChange={handleSectionChange}
        />
      </div>

      {/* Selection popup - positioned BELOW selection to avoid Chrome's menu */}
      <AnimatePresence>
        {showSelectionPopup && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="selection-popup fixed z-50 transform -translate-x-1/2"
            style={{ left: selectionPosition.x, top: selectionPosition.y }}
          >
            {/* Arrow pointing up */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-2">
              <div className="border-8 border-transparent" style={{ borderBottomColor: 'var(--text-primary)' }} />
            </div>
            <div className="flex items-center bg-[var(--text-primary)] rounded-xl shadow-xl overflow-hidden">
              <button
                onClick={handleDiscuss}
                className="text-[var(--text-inverted)] px-5 py-3 text-sm font-medium hover:bg-white/10 active:bg-white/20 transition-colors flex items-center gap-2 touch-target"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Discuss
              </button>
              <div className="w-px h-8 bg-white/20" />
              <button
                onClick={handleSave}
                className="text-[var(--text-inverted)] px-5 py-3 text-sm font-medium hover:bg-white/10 active:bg-white/20 transition-colors flex items-center gap-2 touch-target"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Save
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB for chat when sheet is closed */}
      <AnimatePresence>
        {!isSheetOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={toggleChat}
            className="fab bg-[var(--text-primary)] text-[var(--text-inverted)]"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {messages.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--accent-primary)] text-[var(--text-inverted)] text-xs font-bold rounded-full flex items-center justify-center">
                {messages.length > 9 ? '9+' : messages.length}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Bottom sheet with chat */}
      <MobileBottomSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        snapPoint={sheetSnapPoint}
        onSnapPointChange={setSheetSnapPoint}
      >
        <DiscussionPanel
          textId={textId}
          textTitle={title}
          textAuthor={author}
          textCategory={category}
          activeParagraph={activeParagraph}
          pendingQuote={pendingQuote}
          onQuoteUsed={handleQuoteUsed}
        />
      </MobileBottomSheet>

      {/* Table of Contents */}
      <TableOfContents
        sections={sections}
        currentBook={currentBook}
        isOpen={showTOC}
        onClose={() => setShowTOC(false)}
        onSelectBook={handleBookSelect}
      />

      {/* Reading Controls */}
      <AnimatePresence>
        {showControls && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setShowControls(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-secondary)] rounded-t-2xl p-4 pb-safe"
              style={{ paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}
            >
              <div className="flex justify-center mb-3">
                <div className="w-10 h-1 bg-[var(--text-muted)] rounded-full" />
              </div>
              <ReadingControls
                isOpen={true}
                onClose={() => setShowControls(false)}
                isFullscreen={false}
                onFullscreen={() => {}}
                isMobile={true}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bookmarks panel */}
      <BookmarksPanel
        bookmarks={bookmarks}
        textId={textId}
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

      {/* Mobile onboarding hint */}
      <AnimatePresence>
        {showMobileHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-24 left-4 right-4 z-40"
          >
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-4 shadow-lg flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 11l5 5 5-5M7 6l5 5 5-5" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--text-primary)] font-medium">Swipe up to discuss passages</p>
                <p className="text-xs text-[var(--text-muted)]">Tap and hold text to select</p>
              </div>
              <button
                onClick={() => setShowMobileHint(false)}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
