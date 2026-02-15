import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ThemeToggle from '../components/ThemeToggle'

const shortcuts = [
  { keys: ['⌘', 'K'], description: 'Open search' },
  { keys: ['f'], description: 'Toggle fullscreen' },
  { keys: ['⌘', '.'], description: 'Toggle reading mode' },
  { keys: ['⌘', '\\'], description: 'Toggle table of contents' },
  { keys: ['⌘', 'B'], description: 'Toggle bookmarks panel' },
  { keys: ['⌘', '/'], description: 'Focus chat input' },
  { keys: ['?'], description: 'Show all shortcuts' },
]

export default function HowToUse() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] relative">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[var(--accent-primary)]/[0.03] blur-[100px] rounded-full" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between bg-[var(--bg-secondary)]/80 backdrop-blur-xl border border-[var(--border-primary)]/50 rounded-full px-6 py-3 shadow-lg">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 flex items-center justify-center">
                <svg className="w-4 h-4 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="font-display text-lg font-medium text-[var(--text-primary)] tracking-tight">Philosophy Insight</span>
            </Link>

            <ThemeToggle />
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <main className="relative z-10 pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-16"
          >
            <span className="font-display text-6xl text-[var(--accent-primary)]/30 block mb-4">φ</span>
            <h1 className="font-display text-4xl md:text-5xl font-medium text-[var(--text-primary)] mb-4">
              How to Use This App
            </h1>
            <p className="text-lg text-[var(--text-secondary)] font-body max-w-xl mx-auto">
              A guide to engaging deeply with philosophical texts
            </p>
          </motion.div>

          {/* Sections */}
          <div className="space-y-16">
            {/* The Philosophy */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="font-display text-2xl font-medium text-[var(--text-primary)] mb-4">
                The Philosophy of Reading
              </h2>
              <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] p-6">
                <p className="text-[var(--text-secondary)] font-body leading-relaxed mb-4">
                  Philosophy demands active engagement. This app helps you read slowly and think carefully—not speed through texts for quick answers.
                </p>
                <p className="text-[var(--text-secondary)] font-body leading-relaxed mb-4">
                  Highlight passages that confuse or intrigue you. Sit with the difficulty before asking for help. The struggle to understand is where genuine learning happens.
                </p>
                <blockquote className="border-l-2 border-[var(--accent-primary)]/50 pl-4 text-[var(--text-tertiary)] font-body italic">
                  "Wonder is the feeling of a philosopher, and philosophy begins in wonder."
                  <span className="block mt-1 text-sm not-italic">— Plato, Theaetetus</span>
                </blockquote>
              </div>
            </motion.section>

            {/* How It Works */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="font-display text-2xl font-medium text-[var(--text-primary)] mb-4">
                How It Works
              </h2>
              <div className="space-y-4">
                <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center shrink-0">
                      <span className="font-display text-lg text-[var(--accent-primary)]">1</span>
                    </div>
                    <div>
                      <h3 className="font-ui font-medium text-[var(--text-primary)] mb-1">Select any text</h3>
                      <p className="text-[var(--text-secondary)] font-body text-sm leading-relaxed">
                        While reading, highlight any passage to discuss it with your AI companion. On desktop, click and drag. On mobile, tap and hold.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center shrink-0">
                      <span className="font-display text-lg text-[var(--accent-primary)]">2</span>
                    </div>
                    <div>
                      <h3 className="font-ui font-medium text-[var(--text-primary)] mb-1">Your selection appears as a quote</h3>
                      <p className="text-[var(--text-secondary)] font-body text-sm leading-relaxed">
                        The highlighted text appears as a quote card above the chat input. The AI knows exactly which book and section you're reading.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center shrink-0">
                      <span className="font-display text-lg text-[var(--accent-primary)]">3</span>
                    </div>
                    <div>
                      <h3 className="font-ui font-medium text-[var(--text-primary)] mb-1">Ask your question</h3>
                      <p className="text-[var(--text-secondary)] font-body text-sm leading-relaxed">
                        Type your question or thought. Press Enter to send. The AI will respond with context from the specific passage you selected.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Two Modes */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="font-display text-2xl font-medium text-[var(--text-primary)] mb-4">
                Two Modes of Discussion
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] p-6">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="font-ui font-medium text-[var(--text-primary)] mb-2">Tutor Mode</h3>
                  <p className="text-[var(--text-secondary)] font-body text-sm leading-relaxed">
                    Direct explanations when you want clarity. The AI explains concepts, provides historical context, and helps you understand difficult passages.
                  </p>
                </div>

                <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] p-6">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-ui font-medium text-[var(--text-primary)] mb-2">Socratic Mode</h3>
                  <p className="text-[var(--text-secondary)] font-body text-sm leading-relaxed">
                    Guided questions that help you discover insights yourself. The AI asks probing questions rather than giving direct answers. Say "just tell me" if you want a direct answer.
                  </p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-primary)]">
                <p className="text-sm text-[var(--text-secondary)] font-body">
                  <span className="text-[var(--accent-primary)] font-medium">Tip:</span> Try Socratic mode first. The struggle to articulate your understanding often reveals what you actually think—and what you don't yet understand.
                </p>
              </div>
            </motion.section>

            {/* Save & Export */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h2 className="font-display text-2xl font-medium text-[var(--text-primary)] mb-4">
                Save & Export
              </h2>
              <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[var(--accent-primary)] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <div>
                    <p className="text-[var(--text-secondary)] font-body text-sm leading-relaxed">
                      <span className="text-[var(--text-primary)] font-medium">Bookmark passages</span> for later review. Press <kbd className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded text-xs">⌘B</kbd> to open the bookmarks panel.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[var(--accent-primary)] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <div>
                    <p className="text-[var(--text-secondary)] font-body text-sm leading-relaxed">
                      <span className="text-[var(--text-primary)] font-medium">Add notes</span> to your bookmarks to capture your thoughts and interpretations.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[var(--accent-primary)] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <div>
                    <p className="text-[var(--text-secondary)] font-body text-sm leading-relaxed">
                      <span className="text-[var(--text-primary)] font-medium">Export to Markdown</span> to save your bookmarks and notes for external use.
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Keyboard Shortcuts */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="font-display text-2xl font-medium text-[var(--text-primary)] mb-4">
                Keyboard Shortcuts
              </h2>
              <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] p-6">
                <div className="space-y-3">
                  {shortcuts.map((shortcut) => (
                    <div
                      key={shortcut.description}
                      className="flex items-center justify-between py-1.5"
                    >
                      <span className="text-sm text-[var(--text-secondary)] font-body">
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
            </motion.section>

            {/* On Mobile */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <h2 className="font-display text-2xl font-medium text-[var(--text-primary)] mb-4">
                On Mobile
              </h2>
              <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[var(--accent-primary)] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 11l5 5 5-5M7 6l5 5 5-5" />
                  </svg>
                  <div>
                    <p className="text-[var(--text-secondary)] font-body text-sm leading-relaxed">
                      <span className="text-[var(--text-primary)] font-medium">Swipe up</span> on the chat button to open the discussion panel. Drag to resize.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[var(--accent-primary)] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                  <div>
                    <p className="text-[var(--text-secondary)] font-body text-sm leading-relaxed">
                      <span className="text-[var(--text-primary)] font-medium">Tap and hold</span> text to select it. A popup will appear with options to discuss or save.
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 text-center"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--accent-primary)] text-[var(--text-inverted)] font-ui font-medium rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors"
            >
              Start Reading
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
