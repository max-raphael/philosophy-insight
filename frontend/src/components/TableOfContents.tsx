import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Section {
  book: number
  number: number
  content: string
}

interface TableOfContentsProps {
  sections: Section[]
  currentBook: number
  isOpen: boolean
  onClose: () => void
  onSelectBook: (book: number) => void
}

export default function TableOfContents({
  sections,
  currentBook,
  isOpen,
  onClose,
  onSelectBook,
}: TableOfContentsProps) {
  // Group sections by book
  const books = useMemo(() => {
    const bookMap = new Map<number, { book: number; sectionCount: number; firstSection: string }>()

    sections.forEach(section => {
      if (!bookMap.has(section.book)) {
        // Get first ~100 chars of content as preview
        const preview = section.content.slice(0, 100).replace(/\s+/g, ' ').trim()
        bookMap.set(section.book, {
          book: section.book,
          sectionCount: 1,
          firstSection: preview + (section.content.length > 100 ? '...' : ''),
        })
      } else {
        const existing = bookMap.get(section.book)!
        existing.sectionCount++
      }
    })

    return Array.from(bookMap.values()).sort((a, b) => a.book - b.book)
  }, [sections])

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
            className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 lg:hidden"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-[var(--bg-secondary)] border-r border-[var(--border-primary)] shadow-xl flex flex-col"
          >
            {/* Header */}
            <div className="px-4 py-4 border-b border-[var(--border-primary)] flex items-center justify-between shrink-0">
              <h2 className="font-semibold text-[var(--text-primary)]">Table of Contents</h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Book list */}
            <nav className="flex-1 overflow-y-auto py-2">
              {books.map((bookInfo) => (
                <button
                  key={bookInfo.book}
                  onClick={() => {
                    onSelectBook(bookInfo.book)
                    onClose()
                  }}
                  className={`w-full px-4 py-3 text-left transition-colors border-l-2 ${
                    bookInfo.book === currentBook
                      ? 'bg-[var(--accent-bg)] border-[var(--accent-primary)]'
                      : 'border-transparent hover:bg-[var(--bg-tertiary)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-medium ${
                      bookInfo.book === currentBook
                        ? 'text-[var(--accent-primary)]'
                        : 'text-[var(--text-primary)]'
                    }`}>
                      Book {bookInfo.book}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {bookInfo.sectionCount} sections
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2">
                    {bookInfo.firstSection}
                  </p>
                </button>
              ))}
            </nav>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-[var(--border-primary)] shrink-0">
              <p className="text-xs text-[var(--text-muted)]">
                {books.length} books &middot; {sections.length} sections
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
