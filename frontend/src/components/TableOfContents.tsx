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

// Convert number to Roman numeral
function toRoman(num: number): string {
  const romanNumerals: [number, string][] = [
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
        // Get first ~80 chars of content as preview
        const preview = section.content.slice(0, 80).replace(/\s+/g, ' ').trim()
        bookMap.set(section.book, {
          book: section.book,
          sectionCount: 1,
          firstSection: preview + (section.content.length > 80 ? '…' : ''),
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/30 dark:bg-black/50 lg:hidden"
            onClick={onClose}
          />

          {/* Sidebar - Index Style */}
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-0 top-0 bottom-0 z-50 w-80 bg-[var(--bg-secondary)] border-r border-[var(--border-primary)] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-[var(--border-primary)] flex items-center justify-between shrink-0">
              <h2 className="font-display text-lg font-medium text-[var(--text-primary)]">Contents</h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Book list - Index style */}
            <nav className="flex-1 overflow-y-auto py-4 px-5">
              <div className="space-y-1">
                {books.map((bookInfo) => {
                  const isActive = bookInfo.book === currentBook
                  return (
                    <button
                      key={bookInfo.book}
                      onClick={() => {
                        onSelectBook(bookInfo.book)
                        onClose()
                      }}
                      className={`w-full text-left transition-all rounded px-3 py-2.5 group ${
                        isActive
                          ? 'bg-[var(--accent-bg)]'
                          : 'hover:bg-[var(--bg-tertiary)]'
                      }`}
                    >
                      <div className="flex items-baseline gap-3">
                        {/* Roman numeral */}
                        <span className={`font-display text-sm shrink-0 w-8 ${
                          isActive
                            ? 'text-[var(--accent-primary)]'
                            : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'
                        }`}>
                          {toRoman(bookInfo.book)}
                        </span>

                        {/* Book title and preview */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-2">
                            <span className={`font-display text-base ${
                              isActive
                                ? 'text-[var(--accent-primary)]'
                                : 'text-[var(--text-primary)]'
                            }`}>
                              Book {bookInfo.book}
                            </span>
                            {/* Leader dots */}
                            <span className="flex-1 border-b border-dotted border-[var(--border-primary)] mb-1 mx-1" />
                            <span className="text-xs text-[var(--text-muted)] font-ui shrink-0">
                              {bookInfo.sectionCount}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--text-muted)] font-body italic line-clamp-1 mt-0.5">
                            {bookInfo.firstSection}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </nav>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-[var(--border-primary)] shrink-0 bg-[var(--bg-tertiary)]">
              <p className="text-xs text-[var(--text-muted)] font-ui small-caps">
                {books.length} books · {sections.length} sections
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
