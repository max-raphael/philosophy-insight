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
  onSaveBookmark?: (text: string, location: ParagraphLocation) => void
  onScroll: (progress: number) => void
  onBookChange?: (book: number) => void
  onSectionChange?: (sectionIndex: number) => void
}

export interface ReaderHandle {
  scrollToBook: (book: number) => void
  scrollToSection: (sectionIndex: number) => void
}

// Convert number to Roman numeral
function toRoman(num: number): string {
  const romanNumerals: [number, string][] = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
  ]
  let result = ''
  for (const [value, symbol] of romanNumerals) {
    while (num >= value) {
      result += symbol
      num -= value
    }
  }
  return result
}

const Reader = forwardRef<ReaderHandle, ReaderProps>(function Reader(
  { sections, onSelectText, onSaveBookmark, onScroll, onBookChange, onSectionChange },
  ref
) {
  const [selectionPopup, setSelectionPopup] = useState<{ x: number; y: number; text: string; location: ParagraphLocation } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const bookRefs = useRef<Map<number, HTMLDivElement>>(new Map())
  const sectionRefs = useRef<Map<number, HTMLParagraphElement>>(new Map())

  // Group sections by book
  const sectionsByBook: Map<number, Section[]> = new Map()
  sections.forEach((section) => {
    if (!sectionsByBook.has(section.book)) {
      sectionsByBook.set(section.book, [])
    }
    sectionsByBook.get(section.book)!.push(section)
  })

  const books = Array.from(sectionsByBook.keys()).sort((a, b) => a - b)

  // Expose scrollToBook and scrollToSection methods
  useImperativeHandle(ref, () => ({
    scrollToBook: (book: number) => {
      const bookElement = bookRefs.current.get(book)
      if (bookElement && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const bookRect = bookElement.getBoundingClientRect()
        const scrollTop = containerRef.current.scrollTop + (bookRect.top - containerRect.top) - 20
        containerRef.current.scrollTo({ top: scrollTop, behavior: 'smooth' })
      }
    },
    scrollToSection: (sectionIndex: number) => {
      const sectionElement = sectionRefs.current.get(sectionIndex)
      if (sectionElement && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const sectionRect = sectionElement.getBoundingClientRect()
        const scrollTop = containerRef.current.scrollTop + (sectionRect.top - containerRect.top) - 60
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

  // Track current visible section with IntersectionObserver
  useEffect(() => {
    if (!onSectionChange) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible section
        const visibleSections = entries
          .filter(entry => entry.isIntersecting)
          .map(entry => parseInt(entry.target.getAttribute('data-paragraph-index') || '-1', 10))
          .filter(index => index >= 0)
          .sort((a, b) => a - b)

        if (visibleSections.length > 0) {
          onSectionChange(visibleSections[0])
        }
      },
      {
        root: containerRef.current,
        rootMargin: '-20% 0px -70% 0px', // Trigger when section is near top
        threshold: 0
      }
    )

    sectionRefs.current.forEach((element) => {
      observer.observe(element)
    })

    return () => observer.disconnect()
  }, [onSectionChange, sections.length])

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

  const handleSave = () => {
    if (selectionPopup && onSaveBookmark) {
      onSaveBookmark(selectionPopup.text, selectionPopup.location)
      setSelectionPopup(null)
      window.getSelection()?.removeAllRanges()
    }
  }

  return (
    <div ref={containerRef} className="h-full overflow-y-auto px-8 py-12 lg:px-16 book-spine">
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
            <div className="flex items-center bg-[var(--accent-primary)] rounded shadow-lg overflow-hidden">
              <button
                onClick={handleDiscuss}
                className="text-[var(--text-inverted)] px-4 py-2 text-sm font-ui font-medium hover:bg-white/10 active:bg-white/20 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Discuss
              </button>
              {onSaveBookmark && (
                <>
                  <div className="w-px h-6 bg-white/20" />
                  <button
                    onClick={handleSave}
                    className="text-[var(--text-inverted)] px-4 py-2 text-sm font-ui font-medium hover:bg-white/10 active:bg-white/20 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    Save
                  </button>
                </>
              )}
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 top-full">
              <div className="border-8 border-transparent" style={{ borderTopColor: 'var(--accent-primary)' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content - Book-like layout */}
      <div className="max-w-3xl mx-auto reader-content">
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
              className="mb-20"
            >
              {/* Book header - scholarly style (only show if multiple books) */}
              {books.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: bookIndex * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="text-center mb-12"
                >
                  <span className="block text-[var(--text-muted)] font-display text-sm tracking-widest uppercase mb-2">
                    Book
                  </span>
                  <span className="block text-[var(--accent-primary)] font-display text-4xl font-medium">
                    {toRoman(book)}
                  </span>
                  <div className="mt-4 flex items-center justify-center gap-4">
                    <span className="w-12 h-px bg-[var(--border-decorative)]" />
                    <span className="text-[var(--text-muted)] text-xs">§</span>
                    <span className="w-12 h-px bg-[var(--border-decorative)]" />
                  </div>
                </motion.div>
              )}

              <div className="space-y-8">
                {bookSections.map((section, localIndex) => {
                  const globalIndex = globalIndexStart + localIndex
                  const isFirstParagraph = localIndex === 0

                  return (
                    <p
                      key={localIndex}
                      ref={(el) => {
                        if (el) sectionRefs.current.set(globalIndex, el)
                      }}
                      data-paragraph-index={globalIndex}
                      className={`font-body text-[var(--text-secondary)] text-lg leading-[1.85] ${
                        isFirstParagraph ? 'drop-cap' : ''
                      }`}
                    >
                      <span className="text-[var(--text-muted)] text-xs font-ui mr-4 select-none opacity-60">
                        {section.number}
                      </span>
                      {formatText(section.content)}
                    </p>
                  )
                })}
              </div>

              {/* Book divider - ornamental */}
              {bookIndex < books.length - 1 && (
                <div className="mt-16 flex items-center justify-center">
                  <span className="text-[var(--text-muted)] text-lg tracking-[0.5em]">* * *</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
})

export default Reader
