import { useState, useRef, useCallback, useEffect, type ReactNode } from 'react'
import { motion, AnimatePresence, useAnimation, type PanInfo } from 'framer-motion'

export type SnapPoint = 'closed' | 'half' | 'full'

interface MobileBottomSheetProps {
  children: ReactNode
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  snapPoint?: SnapPoint
  onSnapPointChange?: (point: SnapPoint) => void
  title?: string
}

// Snap point positions as percentage of viewport height
const SNAP_POSITIONS: Record<SnapPoint, number> = {
  closed: 0,
  half: 50,
  full: 90,
}

// Velocity threshold for flick gestures (pixels per second)
const FLICK_THRESHOLD = 500

export default function MobileBottomSheet({
  children,
  isOpen,
  onOpenChange,
  snapPoint = 'half',
  onSnapPointChange,
  title,
}: MobileBottomSheetProps) {
  const controls = useAnimation()
  const sheetRef = useRef<HTMLDivElement>(null)
  const [currentHeight, setCurrentHeight] = useState(SNAP_POSITIONS[snapPoint])
  const [isDragging, setIsDragging] = useState(false)

  // Get viewport height accounting for mobile browsers
  const getViewportHeight = useCallback(() => {
    return window.visualViewport?.height || window.innerHeight
  }, [])

  // Animate to a snap point
  const animateToSnapPoint = useCallback((point: SnapPoint) => {
    const targetHeight = SNAP_POSITIONS[point]
    setCurrentHeight(targetHeight)
    controls.start({
      height: `${targetHeight}vh`,
      transition: { type: 'spring', damping: 30, stiffness: 400 }
    })
    onSnapPointChange?.(point)

    if (point === 'closed') {
      onOpenChange(false)
    }
  }, [controls, onSnapPointChange, onOpenChange])

  // Find nearest snap point based on current position and velocity
  const findSnapPoint = useCallback((currentPercent: number, velocity: number): SnapPoint => {
    // If flicking down fast, close
    if (velocity > FLICK_THRESHOLD) {
      if (currentPercent < 30) return 'closed'
      if (currentPercent < 70) return 'half'
      return 'half'
    }

    // If flicking up fast, expand
    if (velocity < -FLICK_THRESHOLD) {
      if (currentPercent < 30) return 'half'
      return 'full'
    }

    // Otherwise snap to nearest
    if (currentPercent < 20) return 'closed'
    if (currentPercent < 70) return 'half'
    return 'full'
  }, [])

  // Handle drag
  const handleDrag = useCallback((_: unknown, info: PanInfo) => {
    const viewportHeight = getViewportHeight()
    const dragDelta = -info.delta.y // Negative because dragging up should increase height
    const deltaPercent = (dragDelta / viewportHeight) * 100

    setCurrentHeight(prev => {
      const newHeight = Math.max(0, Math.min(95, prev + deltaPercent))
      return newHeight
    })
  }, [getViewportHeight])

  // Handle drag end
  const handleDragEnd = useCallback((_: unknown, info: PanInfo) => {
    setIsDragging(false)
    const velocity = -info.velocity.y // Negative because up is positive velocity
    const targetSnapPoint = findSnapPoint(currentHeight, velocity)
    animateToSnapPoint(targetSnapPoint)
  }, [currentHeight, findSnapPoint, animateToSnapPoint])

  // Sync height with drag during gesture
  useEffect(() => {
    if (isDragging) {
      controls.set({ height: `${currentHeight}vh` })
    }
  }, [currentHeight, isDragging, controls])

  // Animate when isOpen changes
  useEffect(() => {
    if (isOpen) {
      animateToSnapPoint(snapPoint)
    } else {
      animateToSnapPoint('closed')
    }
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  // Handle backdrop click
  const handleBackdropClick = useCallback(() => {
    animateToSnapPoint('closed')
  }, [animateToSnapPoint])

  // Handle keyboard visibility changes
  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return

    const handleResize = () => {
      // When keyboard opens, viewport height decreases
      // Adjust sheet position to stay visible
      if (isOpen && sheetRef.current) {
        controls.start({
          height: `${currentHeight}vh`,
          transition: { duration: 0.1 }
        })
      }
    }

    viewport.addEventListener('resize', handleResize)
    return () => viewport.removeEventListener('resize', handleResize)
  }, [isOpen, currentHeight, controls])

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
            className="fixed inset-0 bg-black/40 z-40"
            onClick={handleBackdropClick}
          />

          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            initial={{ height: '0vh' }}
            animate={controls}
            exit={{ height: '0vh' }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-secondary)] rounded-t-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{
              maxHeight: '95vh',
              paddingBottom: 'env(safe-area-inset-bottom, 0px)'
            }}
          >
            {/* Drag handle area */}
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0}
              onDragStart={() => setIsDragging(true)}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              className="flex-shrink-0 cursor-grab active:cursor-grabbing touch-none"
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-[var(--text-muted)] rounded-full" />
              </div>

              {/* Title bar */}
              {title && (
                <div className="px-4 pb-3 border-b border-[var(--border-primary)]">
                  <h3 className="font-semibold text-[var(--text-primary)] text-center">
                    {title}
                  </h3>
                </div>
              )}
            </motion.div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
