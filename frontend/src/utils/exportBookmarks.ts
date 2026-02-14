import type { Bookmark } from '../hooks/useBookmarks'

export function exportBookmarksToMarkdown(
  bookmarks: Bookmark[],
  textTitle: string,
  textAuthor: string
): string {
  if (bookmarks.length === 0) {
    return ''
  }

  // Sort by book and section
  const sorted = [...bookmarks].sort((a, b) => {
    if (a.book !== b.book) return a.book - b.book
    return a.section - b.section
  })

  const lines: string[] = [
    `# Bookmarks: ${textTitle}`,
    `*${textAuthor}*`,
    '',
    `Exported on ${new Date().toLocaleDateString()}`,
    '',
    '---',
    '',
  ]

  let currentBook = -1

  sorted.forEach(bookmark => {
    // Add book header if new book
    if (bookmark.book !== currentBook) {
      currentBook = bookmark.book
      lines.push(`## Book ${currentBook}`, '')
    }

    // Add bookmark
    lines.push(`### Section ${bookmark.section}`)
    lines.push('')
    lines.push(`> ${bookmark.selectedText}`)
    lines.push('')

    if (bookmark.note) {
      lines.push(`**Note:** ${bookmark.note}`)
      lines.push('')
    }

    lines.push(`*Saved on ${new Date(bookmark.createdAt).toLocaleDateString()}*`)
    lines.push('')
    lines.push('---')
    lines.push('')
  })

  return lines.join('\n')
}

export function downloadBookmarks(
  bookmarks: Bookmark[],
  textTitle: string,
  textAuthor: string
): void {
  const markdown = exportBookmarksToMarkdown(bookmarks, textTitle, textAuthor)

  if (!markdown) {
    return
  }

  const blob = new Blob([markdown], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${textTitle.toLowerCase().replace(/\s+/g, '-')}-bookmarks.md`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
