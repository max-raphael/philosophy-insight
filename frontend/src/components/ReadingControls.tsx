import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'

type FontSize = 'small' | 'medium' | 'large'

interface ReadingSettings {
  fontSize: FontSize
  fontFamily: 'serif' | 'sans'
}

interface ReadingControlsProps {
  isOpen: boolean
  onClose: () => void
  onFullscreen: () => void
  isFullscreen: boolean
}

const SETTINGS_KEY = 'philosophy-insight-reading-settings'

const defaultSettings: ReadingSettings = {
  fontSize: 'medium',
  fontFamily: 'serif',
}

export function useReadingSettings() {
  const [settings, setSettings] = useState<ReadingSettings>(() => {
    if (typeof window === 'undefined') return defaultSettings
    const stored = localStorage.getItem(SETTINGS_KEY)
    if (stored) {
      try {
        return { ...defaultSettings, ...JSON.parse(stored) }
      } catch {
        return defaultSettings
      }
    }
    return defaultSettings
  })

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))

    // Apply to document
    const root = document.documentElement
    root.dataset.fontSize = settings.fontSize
    root.dataset.fontFamily = settings.fontFamily
  }, [settings])

  const updateSettings = (updates: Partial<ReadingSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }))
  }

  return { settings, updateSettings }
}

export default function ReadingControls({
  isOpen,
  onClose,
  onFullscreen,
  isFullscreen,
}: ReadingControlsProps) {
  const { theme, setTheme } = useTheme()
  const { settings, updateSettings } = useReadingSettings()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 z-50 w-64 bg-[var(--bg-secondary)] rounded-xl shadow-xl border border-[var(--border-primary)] overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* Font Size */}
              <div>
                <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-2 block">
                  Font Size
                </label>
                <div className="flex gap-1 bg-[var(--bg-tertiary)] p-1 rounded-lg">
                  {(['small', 'medium', 'large'] as FontSize[]).map((size) => (
                    <button
                      key={size}
                      onClick={() => updateSettings({ fontSize: size })}
                      className={`flex-1 py-2 text-sm rounded-md transition-colors ${
                        settings.fontSize === size
                          ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] font-medium shadow-sm'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                      }`}
                    >
                      <span className={size === 'small' ? 'text-xs' : size === 'large' ? 'text-base' : 'text-sm'}>
                        Aa
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Family */}
              <div>
                <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-2 block">
                  Font Style
                </label>
                <div className="flex gap-1 bg-[var(--bg-tertiary)] p-1 rounded-lg">
                  <button
                    onClick={() => updateSettings({ fontFamily: 'serif' })}
                    className={`flex-1 py-2 text-sm rounded-md transition-colors ${
                      settings.fontFamily === 'serif'
                        ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] font-medium shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                    }`}
                  >
                    <span className="font-serif">Serif</span>
                  </button>
                  <button
                    onClick={() => updateSettings({ fontFamily: 'sans' })}
                    className={`flex-1 py-2 text-sm rounded-md transition-colors ${
                      settings.fontFamily === 'sans'
                        ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] font-medium shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                    }`}
                  >
                    <span className="font-sans">Sans</span>
                  </button>
                </div>
              </div>

              {/* Theme */}
              <div>
                <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-2 block">
                  Theme
                </label>
                <div className="flex gap-1 bg-[var(--bg-tertiary)] p-1 rounded-lg">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex-1 py-2 text-sm rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                      theme === 'light'
                        ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] font-medium shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex-1 py-2 text-sm rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                      theme === 'dark'
                        ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] font-medium shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setTheme('system')}
                    className={`flex-1 py-2 text-sm rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                      theme === 'system'
                        ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] font-medium shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Fullscreen */}
              <button
                onClick={onFullscreen}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--border-primary)] transition-colors"
              >
                <span className="text-sm text-[var(--text-secondary)]">
                  {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Mode'}
                </span>
                <div className="flex items-center gap-2">
                  <kbd className="px-1.5 py-0.5 text-xs bg-[var(--bg-secondary)] rounded text-[var(--text-muted)]">F</kbd>
                  <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isFullscreen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    )}
                  </svg>
                </div>
              </button>
            </div>

            {/* Keyboard shortcuts hint */}
            <div className="px-4 py-3 bg-[var(--bg-tertiary)] border-t border-[var(--border-primary)]">
              <p className="text-xs text-[var(--text-muted)]">
                Press <kbd className="px-1 py-0.5 bg-[var(--bg-secondary)] rounded">?</kbd> for keyboard shortcuts
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
