import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface BookmarkModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (note: string) => void
  selectedText: string
  location: { book: number; section: number }
}

export default function BookmarkModal({
  isOpen,
  onClose,
  onSave,
  selectedText,
  location,
}: BookmarkModalProps) {
  const [note, setNote] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Focus textarea when modal opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isOpen])

  // Reset note when modal closes
  useEffect(() => {
    if (!isOpen) {
      setNote('')
    }
  }, [isOpen])

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        onSave(note)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, onSave, note])

  const handleSave = () => {
    onSave(note)
  }

  // Truncate quote for display
  const displayQuote = selectedText.length > 200
    ? selectedText.slice(0, 200) + '...'
    : selectedText

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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="mx-4 overflow-hidden rounded-xl bg-[var(--bg-secondary)] shadow-2xl border border-[var(--border-primary)]">
              {/* Header */}
              <div className="px-5 py-4 border-b border-[var(--border-primary)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <h2 className="font-semibold text-[var(--text-primary)]">Save Passage</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="px-5 py-4 space-y-4">
                {/* Location badge */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                    Book {location.book}, Section {location.section}
                  </span>
                </div>

                {/* Quote preview */}
                <div className="p-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)]">
                  <p className="text-sm text-[var(--text-secondary)] italic leading-relaxed">
                    "{displayQuote}"
                  </p>
                </div>

                {/* Note input */}
                <div>
                  <label htmlFor="bookmark-note" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Add a note (optional)
                  </label>
                  <textarea
                    ref={textareaRef}
                    id="bookmark-note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Why is this passage meaningful to you?"
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:border-[var(--accent-primary)] resize-none"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-4 bg-[var(--bg-tertiary)] border-t border-[var(--border-primary)] flex items-center justify-between">
                <p className="text-xs text-[var(--text-muted)]">
                  <kbd className="px-1.5 py-0.5 bg-[var(--bg-secondary)] rounded">⌘</kbd>
                  <span className="mx-1">+</span>
                  <kbd className="px-1.5 py-0.5 bg-[var(--bg-secondary)] rounded">↵</kbd>
                  <span className="ml-1.5">to save</span>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 text-sm font-medium bg-[var(--accent-primary)] text-[var(--text-inverted)] rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
