import { Link } from 'react-router-dom'

interface MobileHeaderProps {
  title: string
  progress: number
  currentBook: number
  totalBooks: number
  onOpenSearch: () => void
  onOpenTOC: () => void
  onOpenBookmarks: () => void
  onOpenSettings: () => void
  messageCount: number
  bookmarkCount: number
  onChatToggle: () => void
  isChatOpen: boolean
}

export default function MobileHeader({
  title,
  progress,
  currentBook,
  totalBooks,
  onOpenSearch,
  onOpenTOC,
  onOpenBookmarks,
  onOpenSettings,
  messageCount,
  bookmarkCount,
  onChatToggle,
  isChatOpen,
}: MobileHeaderProps) {
  return (
    <header className="mobile-header bg-[var(--bg-secondary)] border-b border-[var(--border-primary)] px-3 py-2 shrink-0 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        {/* Left: Back + TOC */}
        <div className="flex items-center gap-1">
          <Link
            to="/"
            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors touch-target"
            title="Back to library"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>

          <button
            onClick={onOpenTOC}
            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors touch-target"
            title="Table of Contents"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>

          <button
            onClick={onOpenBookmarks}
            className="relative p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors touch-target"
            title="Bookmarks"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            {bookmarkCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[var(--accent-primary)] text-[var(--text-inverted)] text-[10px] font-bold rounded-full flex items-center justify-center">
                {bookmarkCount > 9 ? '9+' : bookmarkCount}
              </span>
            )}
          </button>
        </div>

        {/* Center: Title + Progress */}
        <div className="flex-1 min-w-0 text-center px-2">
          <h1 className="text-sm font-semibold text-[var(--text-primary)] truncate">
            {title}
          </h1>
          <div className="flex items-center justify-center gap-2 text-xs text-[var(--text-muted)]">
            {totalBooks > 1 && (
              <span>Book {currentBook}</span>
            )}
            <span>{Math.round(progress * 100)}%</span>
          </div>
        </div>

        {/* Right: Settings + Search + Chat */}
        <div className="flex items-center gap-1">
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors touch-target"
            title="Reading settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>

          <button
            onClick={onOpenSearch}
            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors touch-target"
            title="Search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Chat toggle with badge */}
          <button
            onClick={onChatToggle}
            className={`relative p-2 rounded-lg transition-colors touch-target ${
              isChatOpen
                ? 'text-[var(--accent-primary)] bg-[var(--accent-bg)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
            }`}
            title={isChatOpen ? 'Close discussion' : 'Open discussion'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {messageCount > 0 && !isChatOpen && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[var(--accent-primary)] text-[var(--text-inverted)] text-[10px] font-bold rounded-full flex items-center justify-center">
                {messageCount > 9 ? '9+' : messageCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-2 h-0.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--accent-primary)] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </header>
  )
}
