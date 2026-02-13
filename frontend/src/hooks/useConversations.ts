import { useState, useEffect, useCallback } from 'react'

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export type ConversationMode = 'tutor' | 'socratic'

export interface ConversationMeta {
  id: string
  title: string
  createdAt: number
  lastMessagePreview: string
  messageCount: number
  mode: ConversationMode
}

export interface ConversationsIndex {
  textId: string
  activeConversationId: string
  conversations: ConversationMeta[]
}

// localStorage keys
const getIndexKey = (textId: string) => `philosophy-insight-conversations-index-${textId}`
const getMessagesKey = (textId: string, conversationId: string) =>
  `philosophy-insight-conversation-${textId}-${conversationId}`
const getLegacyKey = (textId: string) => `philosophy-insight-conversation-${textId}`

// Generate unique conversation ID
const generateId = () => `conv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

// Create a new conversation metadata object
const createConversationMeta = (title: string, mode: ConversationMode = 'tutor'): ConversationMeta => ({
  id: generateId(),
  title,
  createdAt: Date.now(),
  lastMessagePreview: '',
  messageCount: 0,
  mode,
})

export function useConversations(textId: string) {
  const [index, setIndex] = useState<ConversationsIndex | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load or migrate on mount
  useEffect(() => {
    const indexKey = getIndexKey(textId)
    const legacyKey = getLegacyKey(textId)

    // Try to load existing index
    const storedIndex = localStorage.getItem(indexKey)
    if (storedIndex) {
      try {
        const parsed: ConversationsIndex = JSON.parse(storedIndex)
        // Add default mode to conversations that don't have it (backward compatibility)
        const migratedConversations = parsed.conversations.map(conv => ({
          ...conv,
          mode: conv.mode || 'tutor' as ConversationMode,
        }))
        const migratedIndex = { ...parsed, conversations: migratedConversations }
        setIndex(migratedIndex)

        // Load messages for active conversation
        const messagesKey = getMessagesKey(textId, parsed.activeConversationId)
        const storedMessages = localStorage.getItem(messagesKey)
        if (storedMessages) {
          setMessages(JSON.parse(storedMessages))
        }
        setIsLoaded(true)
        return
      } catch (e) {
        console.error('Failed to load conversations index:', e)
      }
    }

    // Check for legacy format and migrate
    const legacyMessages = localStorage.getItem(legacyKey)
    if (legacyMessages) {
      try {
        const parsedMessages: Message[] = JSON.parse(legacyMessages)
        const newConversation = createConversationMeta('First reading')

        // Update metadata based on messages
        if (parsedMessages.length > 0) {
          const lastMessage = parsedMessages[parsedMessages.length - 1]
          newConversation.lastMessagePreview = lastMessage.content.slice(0, 50)
          newConversation.messageCount = parsedMessages.length
        }

        const newIndex: ConversationsIndex = {
          textId,
          activeConversationId: newConversation.id,
          conversations: [newConversation],
        }

        // Save new format
        localStorage.setItem(indexKey, JSON.stringify(newIndex))
        localStorage.setItem(getMessagesKey(textId, newConversation.id), JSON.stringify(parsedMessages))

        // Remove legacy key
        localStorage.removeItem(legacyKey)

        setIndex(newIndex)
        setMessages(parsedMessages)
        setIsLoaded(true)
        return
      } catch (e) {
        console.error('Failed to migrate legacy conversation:', e)
      }
    }

    // No existing data - create fresh index with one conversation
    const newConversation = createConversationMeta('New conversation')
    const newIndex: ConversationsIndex = {
      textId,
      activeConversationId: newConversation.id,
      conversations: [newConversation],
    }

    localStorage.setItem(indexKey, JSON.stringify(newIndex))
    setIndex(newIndex)
    setMessages([])
    setIsLoaded(true)
  }, [textId])

  // Save index when it changes
  useEffect(() => {
    if (index && isLoaded) {
      localStorage.setItem(getIndexKey(textId), JSON.stringify(index))
    }
  }, [index, textId, isLoaded])

  // Save messages when they change
  useEffect(() => {
    if (index && isLoaded) {
      const messagesKey = getMessagesKey(textId, index.activeConversationId)
      if (messages.length > 0) {
        localStorage.setItem(messagesKey, JSON.stringify(messages))
      } else {
        // Don't remove the key for empty conversations, just store empty array
        localStorage.setItem(messagesKey, JSON.stringify([]))
      }

      // Update metadata in index
      setIndex(prev => {
        if (!prev) return prev
        return {
          ...prev,
          conversations: prev.conversations.map(conv => {
            if (conv.id === prev.activeConversationId) {
              const lastMessage = messages[messages.length - 1]
              return {
                ...conv,
                lastMessagePreview: lastMessage?.content.slice(0, 50) || '',
                messageCount: messages.length,
              }
            }
            return conv
          }),
        }
      })
    }
  }, [messages, textId, isLoaded])

  // Get active conversation metadata
  const activeConversation = index?.conversations.find(
    c => c.id === index.activeConversationId
  ) || null

  // Create a new conversation
  const createConversation = useCallback((title?: string) => {
    const count = index?.conversations.length || 0
    const newConversation = createConversationMeta(title || `Conversation ${count + 1}`)

    setIndex(prev => {
      if (!prev) return prev
      return {
        ...prev,
        activeConversationId: newConversation.id,
        conversations: [...prev.conversations, newConversation],
      }
    })
    setMessages([])
  }, [index?.conversations.length])

  // Rename a conversation
  const renameConversation = useCallback((id: string, title: string) => {
    setIndex(prev => {
      if (!prev) return prev
      return {
        ...prev,
        conversations: prev.conversations.map(conv =>
          conv.id === id ? { ...conv, title } : conv
        ),
      }
    })
  }, [])

  // Set mode for active conversation
  const setMode = useCallback((mode: ConversationMode) => {
    setIndex(prev => {
      if (!prev) return prev
      return {
        ...prev,
        conversations: prev.conversations.map(conv =>
          conv.id === prev.activeConversationId ? { ...conv, mode } : conv
        ),
      }
    })
  }, [])

  // Delete a conversation
  const deleteConversation = useCallback((id: string) => {
    if (!index) return

    // Remove messages from localStorage
    localStorage.removeItem(getMessagesKey(textId, id))

    // If this is the last conversation, create a new one
    if (index.conversations.length === 1) {
      const newConversation = createConversationMeta('New conversation')
      setIndex({
        ...index,
        activeConversationId: newConversation.id,
        conversations: [newConversation],
      })
      setMessages([])
      return
    }

    // Otherwise, remove and switch to another
    const remaining = index.conversations.filter(c => c.id !== id)
    const newActiveId = id === index.activeConversationId
      ? remaining[0].id
      : index.activeConversationId

    setIndex({
      ...index,
      activeConversationId: newActiveId,
      conversations: remaining,
    })

    // Load messages for new active conversation if we switched
    if (id === index.activeConversationId) {
      const storedMessages = localStorage.getItem(getMessagesKey(textId, newActiveId))
      setMessages(storedMessages ? JSON.parse(storedMessages) : [])
    }
  }, [index, textId])

  // Switch to a different conversation
  const switchConversation = useCallback((id: string) => {
    if (!index || id === index.activeConversationId) return

    setIndex(prev => prev ? { ...prev, activeConversationId: id } : prev)

    // Load messages for the new conversation
    const storedMessages = localStorage.getItem(getMessagesKey(textId, id))
    setMessages(storedMessages ? JSON.parse(storedMessages) : [])
  }, [index, textId])

  // Add a message
  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message])
  }, [])

  // Clear messages (for current conversation)
  const clearMessages = useCallback(() => {
    setMessages([])
    if (index) {
      localStorage.removeItem(getMessagesKey(textId, index.activeConversationId))
    }
  }, [index, textId])

  // Backend conversation ID (includes unique ID for proper separation)
  const backendConversationId = index
    ? `${textId}-${index.activeConversationId}`
    : `${textId}-pending`

  return {
    index,
    activeConversation,
    messages,
    isLoaded,
    backendConversationId,
    createConversation,
    renameConversation,
    deleteConversation,
    switchConversation,
    addMessage,
    setMessages,
    clearMessages,
    setMode,
  }
}
