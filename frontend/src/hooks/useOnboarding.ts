import { useState, useEffect, useCallback } from 'react'

export interface OnboardingState {
  version: 1
  firstVisit: number
  hasSeenWelcome: boolean
  hasSeenGuide: boolean
}

const STORAGE_KEY = 'philosophy-insight-onboarding'

const getDefaultState = (): OnboardingState => ({
  version: 1,
  firstVisit: Date.now(),
  hasSeenWelcome: false,
  hasSeenGuide: false,
})

export function useOnboarding() {
  const [state, setState] = useState<OnboardingState | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load state on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed: OnboardingState = JSON.parse(stored)
        setState(parsed)
      } catch (e) {
        console.error('Failed to load onboarding state:', e)
        setState(getDefaultState())
      }
    } else {
      // First time user - create default state
      setState(getDefaultState())
    }
    setIsLoaded(true)
  }, [])

  // Save state when it changes
  useEffect(() => {
    if (isLoaded && state) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }
  }, [state, isLoaded])

  // Determine if this is a first-time user (no prior data in localStorage)
  const isFirstTimeUser = isLoaded && state !== null && !state.hasSeenWelcome

  // Show welcome modal if user hasn't seen it yet
  const showWelcome = isFirstTimeUser

  const markWelcomeSeen = useCallback(() => {
    setState(prev => prev ? { ...prev, hasSeenWelcome: true } : prev)
  }, [])

  const markGuideSeen = useCallback(() => {
    setState(prev => prev ? { ...prev, hasSeenGuide: true } : prev)
  }, [])

  // Reset onboarding (for testing or user request)
  const resetOnboarding = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setState(getDefaultState())
  }, [])

  return {
    isLoaded,
    isFirstTimeUser,
    showWelcome,
    hasSeenGuide: state?.hasSeenGuide ?? false,
    markWelcomeSeen,
    markGuideSeen,
    resetOnboarding,
  }
}
