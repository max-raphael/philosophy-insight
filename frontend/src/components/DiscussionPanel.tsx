import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { useConversations } from '../hooks/useConversations'
import ConversationSwitcher from './ConversationSwitcher'
import { API_URL } from '../config'

interface ParagraphLocation {
  book: number
  section: number
  content: string
  index: number
}

interface DiscussionPanelProps {
  textId: string
  textTitle: string
  textAuthor: string
  textCategory?: string
  activeParagraph: ParagraphLocation | null
  pendingQuote: string | null
  onQuoteUsed: () => void
}

// Parse context from a formatted user message for display
interface ParsedMessage {
  location: { book: number; section: number } | null
  quote: string | null
  content: string
}

function parseMessageContext(content: string): ParsedMessage {
  let location = null
  let quote = null
  let remaining = content

  // Parse [Book X, Section Y]
  const locationMatch = remaining.match(/^\[Book (\d+), Section (\d+)\]\n/)
  if (locationMatch) {
    location = { book: parseInt(locationMatch[1]), section: parseInt(locationMatch[2]) }
    remaining = remaining.slice(locationMatch[0].length)
  }

  // Parse quoted passage (lines starting with >)
  const lines = remaining.split('\n')
  const quoteLines: string[] = []
  let i = 0
  while (i < lines.length && lines[i].startsWith('> ')) {
    quoteLines.push(lines[i].slice(2))
    i++
  }
  if (quoteLines.length > 0) {
    // Skip blank line after quote
    if (lines[i] === '') i++
    remaining = lines.slice(i).join('\n')
  }

  // Check for [Highlighted: "..."] marker - show only this in UI, not full paragraph
  const highlightMatch = remaining.match(/^\[Highlighted: "(.+?)"\]\n\n/s)
  if (highlightMatch) {
    quote = highlightMatch[1]
    remaining = remaining.slice(highlightMatch[0].length)
  } else if (quoteLines.length > 0) {
    // No highlight marker, show the quoted passage (ambient context)
    quote = quoteLines.join('\n')
  }

  return { location, quote, content: remaining }
}

// Format a user message with embedded context for the API
function formatMessageWithContext(
  userText: string,
  location: { book: number; section: number } | null,
  passage: string | null,
  quote: string | null
): string {
  let formatted = ''

  // Only add context when user explicitly highlights text
  if (quote) {
    // Add location if available
    if (location) {
      formatted += `[Book ${location.book}, Section ${location.section}]\n`
    }

    if (passage && passage.includes(quote)) {
      // Include full paragraph with the highlight marked
      formatted += `> ${passage.split('\n').join('\n> ')}\n\n`
      formatted += `[Highlighted: "${quote}"]\n\n`
    } else {
      // Just the highlight (not found in current paragraph, e.g. selected across paragraphs)
      formatted += `> ${quote.split('\n').join('\n> ')}\n\n`
    }
  }
  // No location or context when user hasn't highlighted anything - just send their message

  formatted += userText
  return formatted
}

// Generate contextual suggestions based on the text being read
const generateSuggestions = (author: string, category?: string): string[] => {
  const schoolByCategory: Record<string, string> = {
    ancient: "What philosophical school does this represent?",
    modern: "What philosophical movement is this part of?",
    enlightenment: "How does this relate to Enlightenment thought?",
  }
  return [
    "What is this text about?",
    `Who was ${author}?`,
    schoolByCategory[category || 'ancient'] || "What are the key themes?",
  ]
}

export default function DiscussionPanel({
  textId,
  textTitle,
  textAuthor,
  textCategory,
  activeParagraph,
  pendingQuote,
  onQuoteUsed,
}: DiscussionPanelProps) {
  const {
    index,
    activeConversation,
    messages,
    setMessages,
    backendConversationId,
    createConversation,
    renameConversation,
    deleteConversation,
    switchConversation,
    clearMessages,
  } = useConversations(textId)

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [inputHeight, setInputHeight] = useState(120) // Default input area height
  const [isDragging, setIsDragging] = useState(false)
  const [activeQuote, setActiveQuote] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragStartY = useRef(0)
  const dragStartHeight = useRef(0)

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  // Handle pending quote - store it separately as activeQuote
  useEffect(() => {
    if (pendingQuote) {
      setActiveQuote(pendingQuote)
      onQuoteUsed()
      inputRef.current?.focus()
    }
  }, [pendingQuote, onQuoteUsed])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + / to focus input
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Handle divider drag
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    setIsDragging(true)
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    dragStartY.current = clientY
    dragStartHeight.current = inputHeight
  }, [inputHeight])

  useEffect(() => {
    if (!isDragging) return

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      const delta = dragStartY.current - clientY
      const newHeight = Math.min(Math.max(dragStartHeight.current + delta, 80), 400)
      setInputHeight(newHeight)
    }

    const handleEnd = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleEnd)
    document.addEventListener('touchmove', handleMove)
    document.addEventListener('touchend', handleEnd)

    return () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchmove', handleMove)
      document.removeEventListener('touchend', handleEnd)
    }
  }, [isDragging])

  // Generate a title for the conversation after first exchange
  const generateTitle = useCallback(async (userMsg: string, assistantMsg: string) => {
    if (!activeConversation) return

    try {
      const response = await fetch(`${API_URL}/generate-title`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text_title: textTitle,
          text_author: textAuthor,
          first_user_message: userMsg,
          first_assistant_message: assistantMsg,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.title && activeConversation) {
          renameConversation(activeConversation.id, data.title)
        }
      }
    } catch (e) {
      // Silently fail - title generation is not critical
      console.error('Failed to generate title:', e)
    }
  }, [activeConversation, textTitle, textAuthor, renameConversation])

  const sendMessage = useCallback(async () => {
    if (!input.trim() || loading) return

    const userText = input.trim()
    const isFirstExchange = messages.length === 0
    setInput('')

    // Use activeQuote if present, then clear it
    const quoteToSend = activeQuote
    setActiveQuote(null)

    // Format the message with embedded context
    const formattedMessage = formatMessageWithContext(
      userText,
      activeParagraph ? { book: activeParagraph.book, section: activeParagraph.section } : null,
      activeParagraph?.content || null,
      quoteToSend
    )

    setMessages(prev => [...prev, { role: 'user', content: formattedMessage }])
    setLoading(true)
    setStreamingContent('')

    try {
      const response = await fetch(`${API_URL}/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: backendConversationId,
          text_id: textId,
          user_message: formattedMessage,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                if (data.content) {
                  fullResponse += data.content
                  setStreamingContent(fullResponse)
                } else if (data.done) {
                  setMessages(prev => [...prev, { role: 'assistant', content: fullResponse }])
                  setStreamingContent('')
                  // Generate title after first exchange
                  if (isFirstExchange) {
                    generateTitle(userText, fullResponse)
                  }
                } else if (data.error) {
                  throw new Error(data.error)
                }
              } catch (e) {
                // Ignore JSON parse errors for incomplete chunks
              }
            }
          }
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${errorMessage}` }])
      setStreamingContent('')
    } finally {
      setLoading(false)
    }
  }, [input, loading, backendConversationId, textId, activeParagraph, setMessages, messages.length, generateTitle, activeQuote])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearConversation = () => {
    clearMessages()
    fetch(`${API_URL}/conversations/${backendConversationId}`, { method: 'DELETE' })
  }

  const exportConversation = () => {
    if (messages.length === 0) return

    const timestamp = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const conversationTitle = activeConversation?.title || 'Discussion'

    let markdown = `# Discussion: ${textTitle}\n`
    markdown += `**Author:** ${textAuthor}\n`
    markdown += `**Conversation:** ${conversationTitle}\n`
    markdown += `**Exported:** ${timestamp}\n\n`
    markdown += `---\n\n`

    messages.forEach((message) => {
      if (message.role === 'user') {
        // Check if content starts with a quote (from text highlighting)
        const lines = message.content.split('\n\n')
        if (lines[0].startsWith('"') && lines[0].endsWith('"')) {
          markdown += `> ${lines[0].slice(1, -1)}\n\n`
          if (lines.length > 1) {
            markdown += `**You:** ${lines.slice(1).join('\n\n')}\n\n`
          }
        } else {
          markdown += `**You:** ${message.content}\n\n`
        }
      } else {
        markdown += `**Tutor:** ${message.content}\n\n`
      }
    })

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${textTitle.toLowerCase().replace(/\s+/g, '-')}-discussion.md`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div ref={containerRef} className="h-full flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[var(--border-primary)] flex items-center justify-between shrink-0 bg-[var(--bg-secondary)]">
        <div>
          {index && activeConversation ? (
            <ConversationSwitcher
              index={index}
              activeConversation={activeConversation}
              onSwitch={switchConversation}
              onCreate={createConversation}
              onRename={renameConversation}
              onDelete={deleteConversation}
            />
          ) : (
            <h3 className="font-semibold text-[var(--text-primary)]">Discussion</h3>
          )}
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {messages.length === 0
              ? 'Highlight text to discuss'
              : `${messages.length} message${messages.length === 1 ? '' : 's'}`
            }
          </p>
        </div>
        <AnimatePresence>
          {messages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-1"
            >
              <button
                onClick={exportConversation}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] px-3 py-1.5 hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors flex items-center gap-1"
                title="Export as Markdown"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
              </button>
              <button
                onClick={clearConversation}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] px-3 py-1.5 hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
              >
                Clear
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.length === 0 && !streamingContent && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-8"
            >
              <div className="w-12 h-12 bg-[var(--accent-bg-subtle)] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="text-[var(--text-primary)] font-medium mb-1">Welcome to {textTitle}</p>
              <p className="text-[var(--text-muted)] text-sm mb-6">
                Ask anything, or highlight text to discuss it
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {generateSuggestions(textAuthor, textCategory).map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="px-4 py-2 text-sm bg-[var(--bg-tertiary)] hover:bg-[var(--border-primary)] rounded-full text-[var(--text-secondary)] transition-all hover:shadow-sm active:scale-95"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              <p className="text-[var(--text-muted)] text-xs mt-6">
                Press <kbd className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded text-[var(--text-tertiary)]">Cmd</kbd> + <kbd className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded text-[var(--text-tertiary)]">/</kbd> to focus
              </p>
            </motion.div>
          )}

          {messages.map((message, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={message.role === 'user' ? 'ml-8' : 'mr-4'}
            >
              <div
                className={`p-4 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-[var(--text-primary)] text-[var(--text-inverted)] rounded-br-md'
                    : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-bl-md'
                }`}
              >
                {message.role === 'user' ? (
                  (() => {
                    const parsed = parseMessageContext(message.content)
                    return (
                      <div className="text-sm leading-relaxed">
                        {parsed.location && (
                          <span className="text-xs opacity-60 mb-1.5 block">
                            Book {parsed.location.book}, Section {parsed.location.section}
                          </span>
                        )}
                        {parsed.quote && (
                          <blockquote className="border-l-2 border-current/30 pl-3 mb-2 opacity-80 italic text-[13px]">
                            {parsed.quote}
                          </blockquote>
                        )}
                        <p className="whitespace-pre-wrap">{parsed.content}</p>
                      </div>
                    )
                  })()
                ) : (
                  <div className="text-sm leading-relaxed prose-custom">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Streaming message */}
        <AnimatePresence>
          {streamingContent && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mr-4"
            >
              <div className="p-4 rounded-2xl bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-bl-md">
                <div className="text-sm leading-relaxed prose-custom">
                  <ReactMarkdown>{streamingContent}</ReactMarkdown>
                  <span className="inline-block w-2 h-4 bg-[var(--text-muted)] animate-pulse ml-0.5" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading indicator */}
        <AnimatePresence>
          {loading && !streamingContent && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mr-4"
            >
              <div className="p-4 rounded-2xl bg-[var(--bg-tertiary)] rounded-bl-md inline-block">
                <div className="flex space-x-1.5">
                  <div className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <div className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Draggable Divider */}
      <div
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        className={`h-2 shrink-0 cursor-ns-resize flex items-center justify-center group hover:bg-[var(--bg-tertiary)] transition-colors ${isDragging ? 'bg-[var(--bg-tertiary)]' : ''}`}
      >
        <div className={`w-12 h-1 rounded-full transition-colors ${isDragging ? 'bg-[var(--text-muted)]' : 'bg-[var(--border-primary)] group-hover:bg-[var(--text-muted)]'}`} />
      </div>

      {/* Input */}
      <div
        className="p-4 border-t border-[var(--border-primary)] shrink-0 bg-[var(--bg-secondary)] flex flex-col"
        style={{ height: activeQuote ? inputHeight + 60 : inputHeight }}
      >
        {/* Quote Card */}
        <AnimatePresence>
          {activeQuote && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 overflow-hidden"
            >
              <div className="flex items-start gap-2 p-3 bg-[var(--bg-tertiary)] rounded-lg border-l-2 border-[var(--accent-primary)]">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[var(--text-muted)] mb-1">Discussing passage:</p>
                  <p className="text-sm text-[var(--text-secondary)] italic line-clamp-2">
                    "{activeQuote.length > 150 ? activeQuote.slice(0, 150) + '...' : activeQuote}"
                  </p>
                </div>
                <button
                  onClick={() => setActiveQuote(null)}
                  className="p-1 text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] rounded transition-colors shrink-0"
                  title="Remove quote"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3 items-end flex-1 min-h-0">
          <div className="flex-1 relative h-full">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={activeQuote ? "Ask about this passage..." : "Ask about the text..."}
              className="w-full h-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[var(--border-secondary)] focus:border-transparent text-sm text-[var(--text-primary)] transition-all placeholder:text-[var(--text-muted)]"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="px-5 py-3 bg-[var(--text-primary)] text-[var(--text-inverted)] rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-medium shadow-sm disabled:shadow-none self-end"
          >
            Send
          </motion.button>
        </div>
      </div>
    </div>
  )
}
