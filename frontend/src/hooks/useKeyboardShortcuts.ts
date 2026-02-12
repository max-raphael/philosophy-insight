import { useEffect, useCallback } from 'react'

type ShortcutHandler = () => void

interface Shortcut {
  key: string
  metaKey?: boolean
  ctrlKey?: boolean
  shiftKey?: boolean
  handler: ShortcutHandler
  description?: string
}

export function useKeyboardShortcuts(shortcuts: Shortcut[], enabled = true) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled) return

    // Don't trigger shortcuts when typing in inputs
    const target = e.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      // Allow Escape in inputs
      if (e.key !== 'Escape') return
    }

    for (const shortcut of shortcuts) {
      const keyMatches = e.key.toLowerCase() === shortcut.key.toLowerCase()
      const metaMatches = shortcut.metaKey ? (e.metaKey || e.ctrlKey) : !e.metaKey
      const ctrlMatches = shortcut.ctrlKey ? e.ctrlKey : !e.ctrlKey
      const shiftMatches = shortcut.shiftKey ? e.shiftKey : !e.shiftKey

      // Special handling for Cmd+K - require meta or ctrl
      if (shortcut.key === 'k' && shortcut.metaKey) {
        if (keyMatches && (e.metaKey || e.ctrlKey)) {
          e.preventDefault()
          shortcut.handler()
          return
        }
        continue
      }

      if (keyMatches && metaMatches && ctrlMatches && shiftMatches) {
        e.preventDefault()
        shortcut.handler()
        return
      }
    }
  }, [shortcuts, enabled])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}

// Common shortcuts for easy import
export const SHORTCUTS = {
  SEARCH: { key: 'k', metaKey: true, description: 'Open search' },
  CLOSE: { key: 'Escape', description: 'Close modal' },
  HELP: { key: '?', shiftKey: true, description: 'Show keyboard shortcuts' },
  FULLSCREEN: { key: 'f', description: 'Toggle fullscreen' },
  NEXT_SECTION: { key: 'j', description: 'Next section' },
  PREV_SECTION: { key: 'k', description: 'Previous section' },
  TOGGLE_TOC: { key: '\\', metaKey: true, description: 'Toggle table of contents' },
} as const
