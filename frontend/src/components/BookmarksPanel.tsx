import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Bookmark } from '../hooks/useBookmarks'

interface BookmarksPanelProps {
  bookmarks: Bookmark[]
  textId: string
  isOpen: boolean
  onClose: () => void
  onSelectBookmark: (paragraphIndex: number) => void
  onDeleteBookmark: (id: string) => void
  onUpdateNote: (id: string, note: string) => void
  onExport: () => void
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

export default function BookmarksPanel({
  bookmarks,
  textId,
  isOpen,
  onClose,
  onSelectBookmark,
  onDeleteBookmark,
  onUpdateNote,
  onExport,
}: BookmarksPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingNote, setEditingNote] = useState('')

  // Filter to current text and group by book
  const textBookmarks = useMemo(() => {
    return bookmarks
      .filter(b => b.textId === textId)
      .sort((a, b) => a.paragraphIndex - b.paragraphIndex)
  }, [bookmarks, textId])

  const bookmarksByBook = useMemo(() => {
    const map = new Map<number, Bookmark[]>()
    textBookmarks.forEach(bookmark => {
      if (!map.has(bookmark.book)) {
        map.set(bookmark.book, [])
      }
      map.get(bookmark.book)!.push(bookmark)
    })
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0])
  }, [textBookmarks])

  const startEditNote = (bookmark: Bookmark) => {
    setEditingId(bookmark.id)
    setEditingNote(bookmark.note || '')
  }

  const saveNote = () => {
    if (editingId) {
      onUpdateNote(editingId, editingNote)
      setEditingId(null)
      setEditingNote('')
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingNote('')
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/30 dark:bg-black/50 lg:hidden"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-0 top-0 bottom-0 z-50 w-80 bg-[var(--bg-secondary)] border-r border-[var(--border-primary)] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-[var(--border-primary)] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <h2 className="font-display text-lg font-medium text-[var(--text-primary)]">Bookmarks</h2>
              </div>
              <div className="flex items-center gap-1">
                {textBookmarks.length > 0 && (
                  <button
                    onClick={onExport}
                    className="p-1.5 rounded text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                    title="Export bookmarks"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Bookmarks list */}
            <nav className="flex-1 overflow-y-auto py-4 px-5">
              {textBookmarks.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-12 h-12 mx-auto text-[var(--text-muted)] opacity-50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <p className="text-sm text-[var(--text-muted)]">No bookmarks yet</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Select text and click "Save" to bookmark
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {bookmarksByBook.map(([book, bookBookmarks]) => (
                    <div key={book}>
                      {/* Book header */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-display text-sm text-[var(--text-muted)]">
                          Book {toRoman(book)}
                        </span>
                        <span className="flex-1 border-b border-dotted border-[var(--border-primary)]" />
                        <span className="text-xs text-[var(--text-muted)]">
                          {bookBookmarks.length}
                        </span>
                      </div>

                      {/* Bookmarks in this book */}
                      <div className="space-y-2">
                        {bookBookmarks.map((bookmark) => (
                          <div
                            key={bookmark.id}
                            className="group rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] overflow-hidden"
                          >
                            {/* Main content - clickable */}
                            <button
                              onClick={() => {
                                onSelectBookmark(bookmark.paragraphIndex)
                                onClose()
                              }}
                              className="w-full text-left p-3 hover:bg-[var(--bg-primary)]/50 transition-colors"
                            >
                              {/* Location badge */}
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-ui text-[var(--accent-primary)] bg-[var(--accent-bg)] px-2 py-0.5 rounded">
                                  §{bookmark.section}
                                </span>
                                <span className="text-xs text-[var(--text-muted)]">
                                  {new Date(bookmark.createdAt).toLocaleDateString()}
                                </span>
                              </div>

                              {/* Quote */}
                              <p className="text-sm text-[var(--text-secondary)] font-body italic line-clamp-3 leading-relaxed">
                                "{bookmark.selectedText.slice(0, 150)}{bookmark.selectedText.length > 150 ? '…' : ''}"
                              </p>

                              {/* Note (if exists and not editing) */}
                              {bookmark.note && editingId !== bookmark.id && (
                                <p className="text-xs text-[var(--text-muted)] mt-2 line-clamp-2">
                                  {bookmark.note}
                                </p>
                              )}
                            </button>

                            {/* Edit note form */}
                            {editingId === bookmark.id && (
                              <div className="px-3 pb-3">
                                <textarea
                                  value={editingNote}
                                  onChange={(e) => setEditingNote(e.target.value)}
                                  placeholder="Add a note..."
                                  rows={2}
                                  className="w-full px-2 py-1.5 rounded bg-[var(--bg-primary)] border border-[var(--border-primary)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] resize-none"
                                  autoFocus
                                />
                                <div className="flex items-center justify-end gap-2 mt-2">
                                  <button
                                    onClick={cancelEdit}
                                    className="px-2 py-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={saveNote}
                                    className="px-2 py-1 text-xs bg-[var(--accent-primary)] text-[var(--text-inverted)] rounded hover:opacity-90"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Actions bar */}
                            {editingId !== bookmark.id && (
                              <div className="flex items-center justify-end gap-1 px-2 py-1.5 bg-[var(--bg-secondary)] border-t border-[var(--border-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => startEditNote(bookmark)}
                                  className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
                                  title={bookmark.note ? "Edit note" : "Add note"}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => onDeleteBookmark(bookmark.id)}
                                  className="p-1 rounded text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10"
                                  title="Delete bookmark"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </nav>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-[var(--border-primary)] shrink-0 bg-[var(--bg-tertiary)]">
              <p className="text-xs text-[var(--text-muted)] font-ui">
                {textBookmarks.length} bookmark{textBookmarks.length !== 1 ? 's' : ''} saved
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
