# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Philosophy Insight is a web app for reading philosophy texts with an AI companion. Users read classic philosophical texts (left panel) and discuss passages with an AI tutor (right panel). Highlighting text adds it as a quote to the chat.

**The core value proposition:** Reading philosophy while discussing it with an LLM paragraph-by-paragraph dramatically improves comprehension. This app provides a polished, focused interface for that experience.

## Commands

### Backend (FastAPI)
```bash
cd backend
source venv/bin/activate
python main.py              # Runs on http://localhost:8000
```

### Frontend (React + Vite)
```bash
cd frontend
npm run dev                 # Runs on http://localhost:5173
npm run build               # TypeScript check + production build
npm run lint                # ESLint
npm test                    # Run Playwright E2E tests
npm run test:headed         # Run tests with browser visible
```

### Development
Run both servers simultaneously (two terminals). Backend requires `OPENAI_API_KEY` in `backend/.env`.

After adding/modifying text JSON files:
```bash
curl -X POST http://localhost:8000/reload-texts
```

## Architecture

```
/backend
  main.py           # FastAPI app - all routes, OpenAI integration, conversation storage
  texts/*.json      # Philosophy texts as JSON (136 texts currently)
  scripts/
    import_gutenberg.py   # Generic Gutenberg parser with auto-structure detection
    text_manifest.py      # Manifest of all texts to import (TextConfig definitions)
    batch_import.py       # Batch import script with progress tracking
    parse_*.py            # Legacy per-text parsers (no longer needed)
  .env              # OPENAI_API_KEY

/frontend
  src/
    App.tsx               # Router setup, ThemeProvider, CommandPalette, global shortcuts
    contexts/
      ThemeContext.tsx    # Dark mode state management
    hooks/
      useDarkMode.ts      # Theme preference with system detection + localStorage
      useKeyboardShortcuts.ts  # Global keyboard shortcut handler
      useMediaQuery.ts    # Responsive breakpoint detection
    data/
      collections.ts      # Curated text collections ("Start Here", eras, themes)
    pages/
      Home.tsx            # Curated discovery experience with sections
      Reader.tsx          # Reading view with TOC, controls, keyboard nav
    components/
      Reader.tsx          # Text display with selection popup
      DiscussionPanel.tsx # Chat with streaming responses
      CommandPalette.tsx  # Spotlight-style search (Cmd+K)
      ThemeToggle.tsx     # Light/Dark/System theme switcher
      TableOfContents.tsx # Sidebar TOC navigation
      ReadingControls.tsx # Font size, font family, theme, fullscreen
      KeyboardShortcutsModal.tsx  # Help modal showing shortcuts
  tests/
    ui-features.spec.ts   # Playwright E2E tests (37 tests)
  playwright.config.ts    # Playwright configuration
```

## Key Patterns

**Text JSON Schema:**
```json
{
  "id": "meditations",
  "title": "Meditations",
  "author": "Marcus Aurelius",
  "translator": "George W. Chrystal",
  "year": "c. 161-180 CE",
  "description": "...",
  "category": "ancient",
  "sections": [{"book": 1, "number": 1, "content": "..."}]
}
```

**API Endpoints:**
- `GET /texts` - List all texts (metadata only)
- `GET /texts/{id}` - Full text with sections
- `POST /chat/stream` - SSE streaming chat response
- `DELETE /conversations/{id}` - Clear conversation

**Frontend State:**
- Conversations persist in localStorage per text
- `pendingQuote` state flows: Reader selection → App → DiscussionPanel input
- Streaming responses use SSE with `data: {content}` / `data: {done: true}` format
- Theme preference persists in localStorage (`philosophy-insight-theme`)
- Reading settings persist in localStorage (`philosophy-insight-reading-settings`)
- Reading position persists per text (`reading-position-{textId}`)

**Styling:** Tailwind CSS v4, Libre Baskerville for text, Inter for UI. Category colors: amber (ancient), emerald (enlightenment), blue (modern), stone (medieval). CSS custom properties enable dark mode theming.

## UI Features

### Dark Mode
- Three modes: Light, Dark, System (auto-detects OS preference)
- Toggle via ThemeToggle button in header or Reading Controls
- CSS variables in `index.css` control all colors for seamless theming

### Command Palette (Search)
- Open with `Cmd+K` or `/` from anywhere
- Fuzzy search across titles, authors, descriptions
- Click an author to see all their texts
- Recent searches shown when empty
- Keyboard navigation: `↑↓` to navigate, `Enter` to select, `Esc` to close

### Home Page Sections
1. **Continue Reading** - Texts with saved reading progress
2. **Start Here** - 8 curated essential texts for beginners
3. **Browse by Era** - Ancient, Medieval, Enlightenment, Modern
4. **Browse by Philosopher** - Horizontal scroll of top authors
5. **Full Library** - Filterable/sortable grid of all texts

### Reader Features
- **Table of Contents** - Sidebar showing book structure (`Cmd+\` to toggle)
- **Reading Controls** - Font size (S/M/L), font family (Serif/Sans), theme
- **Fullscreen Mode** - Press `f` to toggle
- **Progress Tracking** - Percentage and book number shown in header
- **Keyboard Navigation** - See shortcuts below

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+K` or `/` | Open search |
| `Esc` | Close modal/exit fullscreen |
| `f` | Toggle fullscreen (Reader) |
| `Cmd+\` | Toggle table of contents (Reader) |
| `Shift+/` (?) | Show keyboard shortcuts (Reader) |

## Testing

Run Playwright E2E tests:
```bash
cd frontend
npm test              # Run all 37 tests headless
npm run test:headed   # Run with browser visible
npm run test:ui       # Open Playwright UI
```

Tests cover: Home page sections, dark mode, command palette, reader features, keyboard shortcuts, navigation, and responsive design.

## Text Import System

### Current State
- **136 texts** imported from Project Gutenberg
- Target was ~150 texts for complete philosophy canon (Ancient through 19th century)
- 20th century texts are mostly under copyright and unavailable

**Coverage by era:**
- Ancient: 50 texts (Plato, Aristotle, Stoics, Epicureans, Neoplatonists)
- Medieval: 5 texts (Augustine, Aquinas, Boethius, Maimonides)
- Enlightenment: 34 texts (Bacon, Descartes, Spinoza, Locke, Hume, Kant, Rousseau)
- Modern (19th c.): 45 texts (Hegel, Nietzsche, Mill, Marx, James, Dewey)

### How to Add More Texts

1. **Add to manifest** (`backend/scripts/text_manifest.py`):
```python
TextConfig(
    gutenberg_id=1234,        # Project Gutenberg ebook ID
    id='text-slug',           # URL-safe identifier
    title='Title',
    author='Author Name',
    translator='Translator',  # Optional
    year='1800',
    description='One sentence description.',
    category='enlightenment', # ancient, medieval, enlightenment, modern
)
```

2. **Run batch import**:
```bash
cd backend
source venv/bin/activate
python scripts/batch_import.py              # Import all new texts
python scripts/batch_import.py --id slug    # Import single text
python scripts/batch_import.py --test 5     # Test with first 5
```

3. **Reload backend**:
```bash
curl -X POST http://localhost:8000/reload-texts
```

### Texts Available to Add (to reach 150+)

**Plotinus:** Volumes 2-4 of Complete Works (42931, 42932, 42933)

**Medieval:** Anselm - Proslogion, Duns Scotus, William of Ockham, Meister Eckhart (most not on Gutenberg)

**Victorian:** T.H. Huxley essays, more Carlyle works

**Note:** Many medieval and 20th century texts are not available on Project Gutenberg due to copyright or lack of digitization.

### Parser Notes
- `import_gutenberg.py` auto-detects BOOK/CHAPTER/PART/SECTION structure
- Falls back to paragraph chunking (~600 char sections) for unstructured texts
- Filters out table-of-contents entries automatically
- Some texts may need manual review if structure detection fails
