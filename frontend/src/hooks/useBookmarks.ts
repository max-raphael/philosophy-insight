import { useState, useEffect, useCallback } from 'react'

export interface Bookmark {
  id: string
  textId: string
  textTitle: string
  textAuthor: string
  book: number
  section: number
  paragraphIndex: number
  selectedText: string
  note?: string
  createdAt: number
}

export interface BookmarksIndex {
  version: 1
  bookmarks: Bookmark[]
}

// localStorage key
const STORAGE_KEY = 'philosophy-insight-bookmarks'

// Generate unique bookmark ID
const generateId = () => `bm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load bookmarks on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed: BookmarksIndex = JSON.parse(stored)
        setBookmarks(parsed.bookmarks || [])
      } catch (e) {
        console.error('Failed to load bookmarks:', e)
        setBookmarks([])
      }
    }
    setIsLoaded(true)
  }, [])

  // Save bookmarks when they change
  useEffect(() => {
    if (isLoaded) {
      const index: BookmarksIndex = { version: 1, bookmarks }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(index))
    }
  }, [bookmarks, isLoaded])

  // Add a new bookmark
  const addBookmark = useCallback((
    bookmark: Omit<Bookmark, 'id' | 'createdAt'>
  ): Bookmark => {
    const newBookmark: Bookmark = {
      ...bookmark,
      id: generateId(),
      createdAt: Date.now(),
    }
    setBookmarks(prev => [...prev, newBookmark])
    return newBookmark
  }, [])

  // Remove a bookmark
  const removeBookmark = useCallback((id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id))
  }, [])

  // Update a bookmark's note
  const updateNote = useCallback((id: string, note: string) => {
    setBookmarks(prev => prev.map(b =>
      b.id === id ? { ...b, note } : b
    ))
  }, [])

  // Get bookmarks for a specific text
  const getBookmarksForText = useCallback((textId: string): Bookmark[] => {
    return bookmarks.filter(b => b.textId === textId)
  }, [bookmarks])

  // Get all bookmarks
  const getAllBookmarks = useCallback((): Bookmark[] => {
    return bookmarks
  }, [bookmarks])

  // Check if a passage is already bookmarked
  const isBookmarked = useCallback((
    textId: string,
    paragraphIndex: number
  ): Bookmark | undefined => {
    return bookmarks.find(
      b => b.textId === textId && b.paragraphIndex === paragraphIndex
    )
  }, [bookmarks])

  // Get bookmark count for a text
  const getBookmarkCount = useCallback((textId: string): number => {
    return bookmarks.filter(b => b.textId === textId).length
  }, [bookmarks])

  return {
    bookmarks,
    isLoaded,
    addBookmark,
    removeBookmark,
    updateNote,
    getBookmarksForText,
    getAllBookmarks,
    isBookmarked,
    getBookmarkCount,
  }
}
