import { motion, AnimatePresence } from 'framer-motion'

interface KeyboardShortcutsModalProps {
  isOpen: boolean
  onClose: () => void
}

const shortcuts = [
  { category: 'Navigation', items: [
    { keys: ['⌘', 'K'], description: 'Open search' },
  ]},
  { category: 'Reading', items: [
    { keys: ['f'], description: 'Toggle fullscreen' },
    { keys: ['⌘', '.'], description: 'Toggle zen mode' },
    { keys: ['⌘', '\\'], description: 'Toggle table of contents' },
    { keys: ['⌘', 'B'], description: 'Toggle bookmarks panel' },
    { keys: ['Esc'], description: 'Exit fullscreen / close modals' },
  ]},
  { category: 'Discussion', items: [
    { keys: ['⌘', '/'], description: 'Focus chat input' },
    { keys: ['Enter'], description: 'Send message' },
    { keys: ['Shift', 'Enter'], description: 'New line in message' },
  ]},
]

export default function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
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
                <h2 className="font-semibold text-[var(--text-primary)]">Keyboard Shortcuts</h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Shortcuts list */}
              <div className="px-5 py-4 max-h-[60vh] overflow-y-auto space-y-6">
                {shortcuts.map((section) => (
                  <div key={section.category}>
                    <h3 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-3">
                      {section.category}
                    </h3>
                    <div className="space-y-2">
                      {section.items.map((shortcut) => (
                        <div
                          key={shortcut.description}
                          className="flex items-center justify-between py-1.5"
                        >
                          <span className="text-sm text-[var(--text-secondary)]">
                            {shortcut.description}
                          </span>
                          <div className="flex items-center gap-1">
                            {shortcut.keys.map((key, index) => (
                              <span key={index}>
                                {index > 0 && <span className="text-[var(--text-muted)] mx-0.5">+</span>}
                                <kbd className="px-2 py-1 text-xs font-medium bg-[var(--bg-tertiary)] rounded text-[var(--text-primary)] min-w-[24px] text-center inline-block">
                                  {key}
                                </kbd>
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 bg-[var(--bg-tertiary)] border-t border-[var(--border-primary)]">
                <p className="text-xs text-[var(--text-muted)] text-center">
                  Press <kbd className="px-1.5 py-0.5 bg-[var(--bg-secondary)] rounded">Esc</kbd> or <kbd className="px-1.5 py-0.5 bg-[var(--bg-secondary)] rounded">?</kbd> to close
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
