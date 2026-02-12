import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ConversationsIndex, ConversationMeta } from '../hooks/useConversations'

interface ConversationSwitcherProps {
  index: ConversationsIndex
  activeConversation: ConversationMeta | null
  onSwitch: (id: string) => void
  onCreate: () => void
  onRename: (id: string, title: string) => void
  onDelete: (id: string) => void
}

export default function ConversationSwitcher({
  index,
  activeConversation,
  onSwitch,
  onCreate,
  onRename,
  onDelete,
}: ConversationSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const editInputRef = useRef<HTMLInputElement>(null)

  // Focus input when editing starts
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [editingId])

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (editingId) {
          setEditingId(null)
        } else if (isOpen) {
          setIsOpen(false)
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, editingId])

  const startEditing = (conv: ConversationMeta, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingId(conv.id)
    setEditValue(conv.title)
  }

  const saveEdit = () => {
    if (editingId && editValue.trim()) {
      onRename(editingId, editValue.trim())
    }
    setEditingId(null)
  }

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      saveEdit()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setEditingId(null)
    }
  }

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(id)
  }

  const handleCreate = () => {
    onCreate()
    setIsOpen(false)
  }

  const handleSwitch = (id: string) => {
    onSwitch(id)
    setIsOpen(false)
  }

  const formatMessageCount = (count: number) => {
    if (count === 0) return 'New'
    return count === 1 ? '1 msg' : `${count} msgs`
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 hover:bg-[var(--bg-tertiary)] px-2 py-1 -ml-2 rounded-lg transition-colors group"
      >
        <h3 className="font-semibold text-[var(--text-primary)]">
          Discussion
          {activeConversation && (
            <span className="font-normal text-[var(--text-secondary)]">
              : {activeConversation.title}
            </span>
          )}
        </h3>
        <svg
          className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 top-full mt-2 z-50 w-72 bg-[var(--bg-secondary)] rounded-xl shadow-xl border border-[var(--border-primary)] overflow-hidden"
            >
              {/* Header */}
              <div className="px-3 py-2 border-b border-[var(--border-primary)]">
                <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                  Conversations
                </span>
              </div>

              {/* Conversation list */}
              <div className="max-h-64 overflow-y-auto">
                {index.conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => handleSwitch(conv.id)}
                    className={`group flex items-center gap-2 px-3 py-2.5 cursor-pointer transition-colors ${
                      conv.id === index.activeConversationId
                        ? 'bg-[var(--accent-bg-subtle)]'
                        : 'hover:bg-[var(--bg-tertiary)]'
                    }`}
                  >
                    {/* Active indicator */}
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      conv.id === index.activeConversationId
                        ? 'bg-[var(--accent-primary)]'
                        : 'bg-transparent'
                    }`} />

                    {/* Title (or edit input) */}
                    <div className="flex-1 min-w-0">
                      {editingId === conv.id ? (
                        <input
                          ref={editInputRef}
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={handleEditKeyDown}
                          onBlur={saveEdit}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full px-2 py-0.5 text-sm bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] text-[var(--text-primary)]"
                        />
                      ) : (
                        <span
                          className={`text-sm truncate block ${
                            conv.id === index.activeConversationId
                              ? 'text-[var(--text-primary)] font-medium'
                              : 'text-[var(--text-secondary)]'
                          }`}
                          title={conv.title}
                        >
                          {conv.title}
                        </span>
                      )}
                    </div>

                    {/* Message count */}
                    <span className="text-xs text-[var(--text-muted)] shrink-0">
                      {formatMessageCount(conv.messageCount)}
                    </span>

                    {/* Actions (show on hover) */}
                    {editingId !== conv.id && (
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Rename button */}
                        <button
                          onClick={(e) => startEditing(conv, e)}
                          className="p-1 hover:bg-[var(--bg-primary)] rounded transition-colors"
                          title="Rename"
                        >
                          <svg className="w-3.5 h-3.5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>

                        {/* Delete button */}
                        <button
                          onClick={(e) => handleDelete(conv.id, e)}
                          className="p-1 hover:bg-[var(--bg-primary)] rounded transition-colors"
                          title="Delete"
                        >
                          <svg className="w-3.5 h-3.5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* New conversation button */}
              <div className="border-t border-[var(--border-primary)]">
                <button
                  onClick={handleCreate}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New conversation
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
