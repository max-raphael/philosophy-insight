import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ThemeToggle from '../components/ThemeToggle'
import { API_URL } from '../config'

type FeedbackCategory = 'bug' | 'feature' | 'text-request' | 'general'

interface FormState {
  category: FeedbackCategory
  message: string
  name: string
  email: string
}

const categories: { id: FeedbackCategory; label: string; description: string }[] = [
  { id: 'bug', label: 'Bug Report', description: 'Something is broken or not working as expected' },
  { id: 'feature', label: 'Feature Request', description: 'Suggest a new feature or improvement' },
  { id: 'text-request', label: 'Text Request', description: 'Request a new philosophical text to be added' },
  { id: 'general', label: 'General Feedback', description: 'Share your thoughts, praise, or questions' },
]

export default function Feedback() {
  const [form, setForm] = useState<FormState>({
    category: 'general',
    message: '',
    name: '',
    email: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.message.trim()) {
      setError('Please enter a message')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch(`${API_URL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: form.category,
          message: form.message.trim(),
          name: form.name.trim() || undefined,
          email: form.email.trim() || undefined,
        }),
      })

      if (response.ok) {
        setSubmitted(true)
      } else if (response.status === 429) {
        setError('Too many submissions. Please try again later.')
      } else {
        const data = await response.json()
        setError(data.detail || 'Failed to submit feedback. Please try again.')
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

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
        <div className="max-w-2xl mx-auto px-6">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-5xl font-medium text-[var(--text-primary)] mb-4">
              Feedback
            </h1>
            <p className="text-lg text-[var(--text-secondary)] font-body">
              Help us improve Philosophy Insight. No account required.
            </p>
          </motion.div>

          {submitted ? (
            /* Success state */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] p-8 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-display text-2xl font-medium text-[var(--text-primary)] mb-3">
                Thank you!
              </h2>
              <p className="text-[var(--text-secondary)] font-body mb-6">
                Your feedback has been submitted. We read every message and appreciate you taking the time to help improve Philosophy Insight.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent-primary)] text-[var(--text-inverted)] rounded-full font-ui hover:opacity-90 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Library
              </Link>
            </motion.div>
          ) : (
            /* Form */
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Category selector */}
              <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] p-6">
                <label className="block text-sm font-ui text-[var(--text-muted)] uppercase tracking-wider mb-4">
                  What type of feedback?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setForm({ ...form, category: cat.id })}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        form.category === cat.id
                          ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/50'
                          : 'bg-[var(--bg-tertiary)] border-[var(--border-primary)] hover:border-[var(--border-secondary)]'
                      }`}
                    >
                      <span className={`block font-ui text-sm font-medium mb-1 ${
                        form.category === cat.id ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'
                      }`}>
                        {cat.label}
                      </span>
                      <span className="block text-xs text-[var(--text-muted)]">
                        {cat.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] p-6">
                <label htmlFor="message" className="block text-sm font-ui text-[var(--text-muted)] uppercase tracking-wider mb-4">
                  Your message <span className="text-[var(--accent-primary)]">*</span>
                </label>
                <textarea
                  id="message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder={
                    form.category === 'bug' ? "Describe what happened and what you expected..."
                    : form.category === 'feature' ? "Describe the feature you'd like to see..."
                    : form.category === 'text-request' ? "Which text would you like us to add? Include author and title if known..."
                    : "Share your thoughts..."
                  }
                  rows={6}
                  className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] font-body placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors resize-none"
                  required
                />
                <p className="mt-2 text-xs text-[var(--text-muted)]">
                  {form.message.length}/5000 characters
                </p>
              </div>

              {/* Optional contact info */}
              <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] p-6">
                <label className="block text-sm font-ui text-[var(--text-muted)] uppercase tracking-wider mb-4">
                  Contact info (optional)
                </label>
                <p className="text-sm text-[var(--text-secondary)] font-body mb-4">
                  Leave your contact info if you'd like us to follow up. Completely optional.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Name"
                    className="px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] font-body placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                  />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Email"
                    className="px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] font-body placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                  />
                </div>
              </div>

              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                >
                  <p className="text-sm text-red-500 font-ui">{error}</p>
                </motion.div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={submitting || !form.message.trim()}
                className="w-full py-4 bg-[var(--accent-primary)] text-[var(--text-inverted)] rounded-full font-ui font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Submit Feedback
                  </>
                )}
              </button>
            </motion.form>
          )}

          {/* Back link */}
          {!submitted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 text-center"
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
          )}
        </div>
      </main>
    </div>
  )
}
