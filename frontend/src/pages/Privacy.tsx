import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ThemeToggle from '../components/ThemeToggle'

export default function Privacy() {
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
            <h1 className="font-display text-4xl md:text-5xl font-medium text-[var(--text-primary)] mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-[var(--text-secondary)] font-body">
              Last updated: February 2026
            </p>
          </motion.div>

          {/* Sections */}
          <div className="space-y-8">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] p-6"
            >
              <h2 className="font-display text-2xl font-medium text-[var(--text-primary)] mb-4">
                What We Collect
              </h2>
              <p className="text-[var(--text-secondary)] font-body leading-relaxed mb-4">
                Philosophy Insight is designed with privacy in mind. We collect minimal data:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--text-secondary)] font-body">
                <li>
                  <strong className="text-[var(--text-primary)]">Conversations:</strong> Your discussions are sent to our servers to generate AI responses. Conversations are stored temporarily in memory and are not permanently saved.
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Analytics:</strong> We use Vercel Analytics to understand how the app is used. This collects anonymous page view data without personal identifiers.
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Local storage:</strong> Reading progress, bookmarks, and preferences are stored in your browser's local storage and never sent to our servers.
                </li>
              </ul>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] p-6"
            >
              <h2 className="font-display text-2xl font-medium text-[var(--text-primary)] mb-4">
                Third-Party Services
              </h2>
              <p className="text-[var(--text-secondary)] font-body leading-relaxed">
                We use OpenAI's API to power the AI companion. Your conversation messages are sent to OpenAI for processing. Please review{' '}
                <a
                  href="https://openai.com/policies/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent-primary)] hover:underline"
                >
                  OpenAI's Privacy Policy
                </a>{' '}
                for details on how they handle data.
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] p-6"
            >
              <h2 className="font-display text-2xl font-medium text-[var(--text-primary)] mb-4">
                Your Rights
              </h2>
              <p className="text-[var(--text-secondary)] font-body leading-relaxed">
                You can clear your local data at any time through your browser settings. Since we don't store personal information on our servers, there's nothing to delete on our end. Your conversations exist only for the duration of your session.
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] p-6"
            >
              <h2 className="font-display text-2xl font-medium text-[var(--text-primary)] mb-4">
                No Cookies
              </h2>
              <p className="text-[var(--text-secondary)] font-body leading-relaxed">
                Philosophy Insight does not use cookies. All preferences and reading progress are stored in your browser's local storage, which stays on your device.
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] p-6"
            >
              <h2 className="font-display text-2xl font-medium text-[var(--text-primary)] mb-4">
                Contact
              </h2>
              <p className="text-[var(--text-secondary)] font-body leading-relaxed">
                Questions about this policy? Feel free to reach out through our feedback channels.
              </p>
            </motion.section>
          </div>

          {/* Back link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-12 text-center"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors font-ui"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Library
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
