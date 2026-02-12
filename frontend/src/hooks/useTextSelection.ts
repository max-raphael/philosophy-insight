import { useState, useEffect, useCallback, useRef } from 'react'

export interface SelectionData {
  text: string
  rect: DOMRect
}

interface UseTextSelectionOptions {
  /** Container element to scope selection detection */
  containerRef: React.RefObject<HTMLElement | null>
  /** Called when selection is made */
  onSelect?: (data: SelectionData) => void
  /** Called when selection is cleared */
  onClear?: () => void
  /** Minimum characters required for selection */
  minLength?: number
}

/**
 * Unified text selection hook that works for both mouse and touch.
 * Uses the `selectionchange` event which fires for all selection methods.
 */
export function useTextSelection({
  containerRef,
  onSelect,
  onClear,
  minLength = 1,
}: UseTextSelectionOptions) {
  const [selection, setSelection] = useState<SelectionData | null>(null)
  const lastSelectionText = useRef<string>('')

  // Check if selection is within our container
  const isSelectionInContainer = useCallback((sel: Selection): boolean => {
    if (!containerRef.current || sel.rangeCount === 0) return false

    const range = sel.getRangeAt(0)
    const container = containerRef.current

    // Check if the selection's common ancestor is within our container
    return container.contains(range.commonAncestorContainer)
  }, [containerRef])

  // Handle selection changes
  const handleSelectionChange = useCallback(() => {
    const sel = window.getSelection()

    if (!sel || sel.rangeCount === 0) {
      if (selection) {
        setSelection(null)
        onClear?.()
      }
      return
    }

    const text = sel.toString().trim()

    // If no text or text hasn't changed, skip
    if (!text || text === lastSelectionText.current) {
      return
    }

    // Check minimum length
    if (text.length < minLength) {
      if (selection) {
        setSelection(null)
        onClear?.()
      }
      return
    }

    // Check if selection is within our container
    if (!isSelectionInContainer(sel)) {
      return
    }

    const range = sel.getRangeAt(0)
    const rect = range.getBoundingClientRect()

    // Only trigger if we have a valid rect (not collapsed)
    if (rect.width > 0 && rect.height > 0) {
      const data: SelectionData = { text, rect }
      lastSelectionText.current = text
      setSelection(data)
      onSelect?.(data)
    }
  }, [containerRef, selection, onSelect, onClear, minLength, isSelectionInContainer])

  // Clear selection programmatically
  const clearSelection = useCallback(() => {
    window.getSelection()?.removeAllRanges()
    lastSelectionText.current = ''
    setSelection(null)
    onClear?.()
  }, [onClear])

  // Listen for selection changes
  useEffect(() => {
    // Use selectionchange event - works for both mouse and touch
    document.addEventListener('selectionchange', handleSelectionChange)

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange)
    }
  }, [handleSelectionChange])

  // Also listen for mouseup/touchend to catch the final selection
  // This helps ensure we capture the selection when the user finishes
  useEffect(() => {
    const handleEnd = () => {
      // Small delay to let the selection finalize
      setTimeout(handleSelectionChange, 10)
    }

    document.addEventListener('mouseup', handleEnd)
    document.addEventListener('touchend', handleEnd)

    return () => {
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchend', handleEnd)
    }
  }, [handleSelectionChange])

  // Clear on click outside selection
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      // Don't clear if clicking on selection popup
      if (target.closest('.selection-popup')) {
        return
      }

      // Clear after a small delay to allow for new selection to start
      setTimeout(() => {
        const sel = window.getSelection()
        if (!sel || sel.toString().trim() === '') {
          lastSelectionText.current = ''
          setSelection(null)
          onClear?.()
        }
      }, 10)
    }

    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [onClear])

  // Handle touch start for clearing
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement

      // Don't clear if touching selection popup
      if (target.closest('.selection-popup')) {
        return
      }
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    return () => document.removeEventListener('touchstart', handleTouchStart)
  }, [])

  // Clear on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selection) {
        clearSelection()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selection, clearSelection])

  return {
    selection,
    clearSelection,
    hasSelection: selection !== null,
  }
}
