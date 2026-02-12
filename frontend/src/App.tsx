import { useState, useEffect, useCallback } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import CommandPalette from './components/CommandPalette'
import Home from './pages/Home'
import Reader from './pages/Reader'
import { API_URL } from './config'

interface TextInfo {
  id: string
  title: string
  author: string
  description?: string
  year?: string
  category?: string
}

function AppContent() {
  const [texts, setTexts] = useState<TextInfo[]>([])
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  // Fetch texts for search
  useEffect(() => {
    fetch(`${API_URL}/texts`)
      .then(res => res.json())
      .then(setTexts)
      .catch(console.error)
  }, [])

  const openCommandPalette = useCallback(() => {
    setCommandPaletteOpen(true)
  }, [])

  const closeCommandPalette = useCallback(() => {
    setCommandPaletteOpen(false)
  }, [])

  // Global keyboard shortcuts
  useKeyboardShortcuts([
    { key: 'k', metaKey: true, handler: openCommandPalette },
    { key: '/', handler: openCommandPalette },
  ], !commandPaletteOpen)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home texts={texts} onOpenSearch={openCommandPalette} />} />
        <Route path="/texts/:textId" element={<Reader onOpenSearch={openCommandPalette} />} />
      </Routes>
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={closeCommandPalette}
        texts={texts}
      />
    </BrowserRouter>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
