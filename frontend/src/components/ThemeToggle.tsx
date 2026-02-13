import { motion } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'

interface ThemeToggleProps {
  className?: string
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme()

  const getIcon = () => {
    if (isDark) {
      // Candle icon for dark mode (candlelit study)
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2c.5 0 1 .5 1 1v1c0 .5-.5 1-1 1s-1-.5-1-1V3c0-.5.5-1 1-1z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6c-1.5 0-2.5 1.5-2.5 3.5 0 1.5.5 2.5 1.5 3v8c0 .5.5 1 1 1s1-.5 1-1v-8c1-.5 1.5-1.5 1.5-3C14.5 7.5 13.5 6 12 6z" />
          <ellipse cx="12" cy="3" rx="0.5" ry="1" fill="currentColor" opacity="0.6" />
        </svg>
      )
    }
    // Window with light for daylight mode
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={1.5} />
        <line x1="12" y1="3" x2="12" y2="21" strokeWidth={1.5} />
        <line x1="3" y1="12" x2="21" y2="12" strokeWidth={1.5} />
        <path d="M5 5l4 4M15 5l4 4" strokeWidth={1} opacity="0.5" />
      </svg>
    )
  }

  const getLabel = () => {
    return isDark ? 'Dark' : 'Light'
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={toggleTheme}
      className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors
        hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] font-ui ${className}`}
      title={`Current: ${getLabel()}. Click to change.`}
    >
      {getIcon()}
      <span className="text-sm">{getLabel()}</span>
    </motion.button>
  )
}
