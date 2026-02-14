import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

interface WelcomeModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const navigate = useNavigate()

  const handleHowToRead = () => {
    onClose()
    navigate('/how-to-read')
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
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
          >
            <div className="mx-4 overflow-hidden rounded-2xl bg-[var(--bg-secondary)] shadow-2xl border border-[var(--border-primary)]">
              {/* Content */}
              <div className="px-8 py-10 text-center">
                {/* Phi symbol ornament */}
                <div className="mb-6">
                  <span className="font-display text-5xl text-[var(--accent-primary)]/40">
                    φ
                  </span>
                </div>

                {/* Title */}
                <h2 className="font-display text-3xl font-medium text-[var(--text-primary)] mb-4">
                  Welcome to Philosophy Insight
                </h2>

                {/* Description */}
                <div className="space-y-4 mb-8">
                  <p className="text-[var(--text-secondary)] font-body leading-relaxed">
                    Read the great texts of philosophy with an AI companion.
                    Highlight any passage to discuss it—but wrestle with it first.
                  </p>
                  <p className="text-[var(--text-tertiary)] font-body text-sm leading-relaxed italic">
                    The best insights come from struggling with difficult ideas,
                    not from having them explained away.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={onClose}
                    className="w-full sm:w-auto px-8 py-3 bg-[var(--accent-primary)] text-[var(--text-inverted)] font-ui font-medium rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors"
                  >
                    Begin Exploring
                  </button>
                  <button
                    onClick={handleHowToRead}
                    className="w-full sm:w-auto px-6 py-3 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] font-ui transition-colors flex items-center justify-center gap-2"
                  >
                    How to Read
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Footer hint */}
              <div className="px-8 py-4 bg-[var(--bg-tertiary)] border-t border-[var(--border-primary)]">
                <p className="text-xs text-[var(--text-muted)] text-center font-ui">
                  Press <kbd className="px-1.5 py-0.5 bg-[var(--bg-secondary)] rounded">?</kbd> anytime to see keyboard shortcuts
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
