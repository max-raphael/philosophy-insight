import { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatText } from '../utils/formatText'

interface Section {
  book: number
  number: number
  content: string
}

export interface ParagraphLocation {
  book: number
  section: number
  content: string
  index: number
}

interface ReaderProps {
  sections: Section[]
  onSelectText: (text: string, location: ParagraphLocation) => void
  onScroll: (progress: number) => void
  onBookChange?: (book: number) => void
}

export interface ReaderHandle {
  scrollToBook: (book: number) => void
}

const Reader = forwardRef<ReaderHandle, ReaderProps>(function Reader(
  { sections, onSelectText, onScroll, onBookChange },
  ref
) {
  const [selectionPopup, setSelectionPopup] = useState<{ x: number; y: number; text: string; location: ParagraphLocation } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const bookRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  // Group sections by book
  const sectionsByBook: Map<number, Section[]> = new Map()
  sections.forEach((section) => {
    if (!sectionsByBook.has(section.book)) {
      sectionsByBook.set(section.book, [])
    }
    sectionsByBook.get(section.book)!.push(section)
  })

  const books = Array.from(sectionsByBook.keys()).sort((a, b) => a - b)

  // Expose scrollToBook method
  useImperativeHandle(ref, () => ({
    scrollToBook: (book: number) => {
      const bookElement = bookRefs.current.get(book)
      if (bookElement && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const bookRect = bookElement.getBoundingClientRect()
        const scrollTop = containerRef.current.scrollTop + (bookRect.top - containerRect.top) - 20
        containerRef.current.scrollTo({ top: scrollTop, behavior: 'smooth' })
      }
    }
  }))

  // Track current visible book with IntersectionObserver
  useEffect(() => {
    if (!onBookChange) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible book
        const visibleBooks = entries
          .filter(entry => entry.isIntersecting)
          .map(entry => parseInt(entry.target.getAttribute('data-book') || '0', 10))
          .sort((a, b) => a - b)

        if (visibleBooks.length > 0) {
          onBookChange(visibleBooks[0])
        }
      },
      {
        root: containerRef.current,
        rootMargin: '-10% 0px -80% 0px', // Trigger when book header is near top
        threshold: 0
      }
    )

    bookRefs.current.forEach((element) => {
      observer.observe(element)
    })

    return () => observer.disconnect()
  }, [onBookChange, books.length])

  // Track scroll progress
  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current
      const progress = scrollTop / (scrollHeight - clientHeight)
      onScroll(Math.min(1, Math.max(0, progress)))
    }
  }, [onScroll])

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  // Find the paragraph element and its location from a DOM node
  const findParagraphLocation = (node: Node): ParagraphLocation | null => {
    let element = node.nodeType === Node.TEXT_NODE ? node.parentElement : node as HTMLElement
    while (element && !element.hasAttribute('data-paragraph-index')) {
      element = element.parentElement
    }
    if (element) {
      const index = parseInt(element.getAttribute('data-paragraph-index') || '-1', 10)
      if (index >= 0 && index < sections.length) {
        const section = sections[index]
        return {
          book: section.book,
          section: section.number,
          content: section.content,
          index
        }
      }
    }
    return null
  }

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection()
      const text = selection?.toString().trim()

      if (text && text.length > 0) {
        const range = selection?.getRangeAt(0)
        const rect = range?.getBoundingClientRect()
        const location = range ? findParagraphLocation(range.startContainer) : null

        if (rect && containerRef.current && location) {
          setSelectionPopup({
            x: rect.left + rect.width / 2,
            y: rect.top - 10,
            text,
            location,
          })
        }
      } else {
        setSelectionPopup(null)
      }
    }

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.selection-popup')) {
        setSelectionPopup(null)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectionPopup(null)
        window.getSelection()?.removeAllRanges()
      }
    }

    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleDiscuss = () => {
    if (selectionPopup) {
      onSelectText(selectionPopup.text, selectionPopup.location)
      setSelectionPopup(null)
      window.getSelection()?.removeAllRanges()
    }
  }

  return (
    <div ref={containerRef} className="h-full overflow-y-auto px-8 py-10 lg:px-12">
      {/* Selection popup */}
      <AnimatePresence>
        {selectionPopup && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="selection-popup fixed z-50 transform -translate-x-1/2 -translate-y-full"
            style={{ left: selectionPopup.x, top: selectionPopup.y }}
          >
            <button
              onClick={handleDiscuss}
              className="bg-[var(--text-primary)] text-[var(--text-inverted)] px-4 py-2 rounded-lg text-sm font-medium shadow-xl hover:opacity-90 active:opacity-80 transition-opacity flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Discuss
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full">
              <div className="border-8 border-transparent" style={{ borderTopColor: 'var(--text-primary)' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="max-w-4xl mx-auto reader-content">
        {Array.from(sectionsByBook.entries()).map(([book, bookSections], bookIndex) => {
          // Compute the starting global index for this book
          let globalIndexStart = 0
          for (const [b] of sectionsByBook.entries()) {
            if (b === book) break
            globalIndexStart += sectionsByBook.get(b)!.length
          }

          return (
            <div
              key={book}
              ref={(el) => {
                if (el) bookRefs.current.set(book, el)
              }}
              data-book={book}
              id={`book-${book}`}
              className="mb-16"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: bookIndex * 0.05 }}
                className="text-sm font-medium tracking-widest text-[var(--text-muted)] uppercase mb-8"
              >
                Book {book}
              </motion.h2>

              <div className="space-y-6">
                {bookSections.map((section, localIndex) => {
                  const globalIndex = globalIndexStart + localIndex

                  return (
                    <p
                      key={localIndex}
                      data-paragraph-index={globalIndex}
                      className="font-serif text-[var(--text-secondary)] text-lg leading-relaxed"
                    >
                      <span className="text-[var(--text-muted)] text-sm font-sans mr-3 select-none">
                        {section.number}
                      </span>
                      {formatText(section.content)}
                    </p>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
})

export default Reader
