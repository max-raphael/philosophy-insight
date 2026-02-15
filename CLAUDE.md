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
  texts/*.json      # Philosophy texts as JSON (401 texts currently)
  scripts/
    import_gutenberg.py   # Generic Gutenberg parser with auto-structure detection
    import_marxists.py    # Marxists.org HTML parser for Marxist/Anarchist texts
    text_manifest.py      # Manifest of Gutenberg texts (TextConfig definitions)
    marxists_manifest.py  # Manifest of marxists.org texts
    batch_import.py       # Batch import script with progress tracking
    parse_*.py            # Legacy per-text parsers (no longer needed)
  .env              # OPENAI_API_KEY

/frontend
  src/
    App.tsx               # Router setup, ThemeProvider, CommandPalette, global shortcuts
    config.ts             # API URL configuration
    contexts/
      ThemeContext.tsx    # Dark mode state management
    hooks/
      useConversations.ts # Multi-conversation CRUD, localStorage, migration
      useDarkMode.ts      # Theme preference with system detection + localStorage
      useKeyboardShortcuts.ts  # Global keyboard shortcut handler
      useMediaQuery.ts    # Responsive breakpoint detection
      useOnboarding.ts    # First-time user detection and onboarding state
      useTextSelection.ts # Unified mouse/touch text selection
    utils/
      formatText.tsx      # Text formatting utilities
    data/
      collections.ts      # Curated text collections ("Start Here", eras, themes)
    pages/
      Home.tsx            # Curated discovery experience with sections
      HowToUse.tsx        # Guide page for new users on using the app
      Philosophers.tsx    # Dedicated page showing all philosophers with portraits
      Reader.tsx          # Reading view with TOC, controls, keyboard nav, zen mode
    components/
      Reader.tsx          # Text display with selection popup
      DiscussionPanel.tsx # Chat with streaming responses
      ConversationSwitcher.tsx  # Dropdown for managing multiple conversations
      CommandPalette.tsx  # Spotlight-style search (Cmd+K)
      ThemeToggle.tsx     # Dark/Light theme switcher
      TableOfContents.tsx # Sidebar TOC navigation
      ReadingControls.tsx # Font size, font family, theme, fullscreen
      KeyboardShortcutsModal.tsx  # Help modal showing shortcuts
      MobileReaderLayout.tsx  # Mobile-specific full-screen reader
      MobileBottomSheet.tsx   # Draggable bottom sheet with snap points
      MobileHeader.tsx        # Compact mobile header
      onboarding/
        WelcomeModal.tsx    # First-visit welcome modal with philosophical framing
  tests/
    ui-features.spec.ts   # Playwright E2E tests (62 tests)
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
- `POST /chat/stream` - SSE streaming chat response (accepts `mode`: `"tutor"` or `"socratic"`)
- `POST /generate-title` - Generate conversation title from first exchange (uses gpt-4o-mini)
- `DELETE /conversations/{id}` - Clear conversation

**Frontend State:**
- Multiple conversations per text with localStorage persistence:
  - Index: `philosophy-insight-conversations-index-{textId}` (metadata for all conversations)
  - Messages: `philosophy-insight-conversation-{textId}-{conversationId}` (actual messages)
- Bookmarks stored globally: `philosophy-insight-bookmarks` (array of all bookmarks with text/location metadata)
- Onboarding state: `philosophy-insight-onboarding` (tracks first visit, welcome modal seen)
- `pendingQuote` state flows: Reader selection → App → DiscussionPanel → quote card above input
- Streaming responses use SSE with `data: {content}` / `data: {done: true}` format
- Theme preference persists in localStorage (`philosophy-insight-theme`)
- Reading settings persist in localStorage (`philosophy-insight-reading-settings`)
- Reading position persists per text at section level (`reading-position-{textId}`) - auto-saves current section as you scroll, restores exact position on return

**Styling:** Tailwind CSS v4, Libre Baskerville for text, Inter for UI. Category colors defined via CSS custom properties:
- Western: amber (ancient), stone (medieval), emerald (enlightenment), blue (modern)
- Eastern: red (chinese), orange (indian), yellow (buddhist), purple (sufi)
- Revolutionary: rose (marxist)

CSS custom properties enable dark mode theming.

## UI Features

### Onboarding
- **Welcome Modal** - Appears on first visit to Home page
  - Philosophical framing: "wrestle with it first" before asking for help
  - Primary CTA dismisses modal, secondary links to How to Read guide
  - Persists in localStorage so it only shows once
- **How to Use page** (`/how-to-use`) - Static guide with sections:
  - Philosophy of reading (value of struggling with difficult ideas)
  - How selection and discussion works
  - Tutor vs Socratic modes
  - Bookmarks and export
  - Keyboard shortcuts
  - Mobile gestures
- **Mobile hint** - Toast appears on first Reader visit: "Swipe up to discuss passages"
- **Access points** - Footer link, keyboard shortcuts modal link, welcome modal CTA

### Dark Mode
- Two modes: Light (default) and Dark
- Toggle via ThemeToggle button in header or Reading Controls
- CSS variables in `index.css` control all colors for seamless theming

### Command Palette (Search)
- Open with `Cmd+K`
- Fuzzy search across titles, authors, descriptions
- Click an author to see all their texts
- Recent searches shown when empty
- Keyboard navigation: `↑↓` to navigate, `Enter` to select, `Esc` to close

### Home Page Sections
1. **Hero** - Rotating philosophical quotes with "Explore the Library" CTA
2. **Continue Reading** - Texts with saved reading progress (shown only if progress exists)
3. **Start Here** - Curated essential texts in uniform 3-column grid
4. **Philosophical Traditions** - Two-column layout (Western | Eastern) with clickable era cards
5. **Philosophers Gallery** - Horizontal scroll with portraits sourced from Wikipedia API
6. **The Library** - Filterable/sortable grid with pill-style era filters

### Philosophers Page (`/philosophers`)
- Grid of all philosophers with portraits from Wikipedia
- Filter by tradition (Ancient, Medieval, Enlightenment, Modern, Eastern, Revolutionary)
- Click a philosopher to expand and see their available works
- Links directly to each text's reader page

### Reader Features (Desktop)
- **Table of Contents** - Sidebar showing book structure (`Cmd+\` to toggle)
- **Bookmarks** - Save passages with optional notes (`Cmd+B` to toggle panel), export to Markdown
- **Reading Controls** - Font size (S/M/L), font family (Serif/Sans), theme
- **Fullscreen Mode** - Press `f` to toggle
- **Zen Mode** - Hide chat panel for distraction-free reading (button in header)
- **Progress Tracking** - Percentage and book number shown in header; auto-saves section position and resumes where you left off
- **Keyboard Navigation** - See shortcuts below

### Discussion Panel
- **Mode Toggle** - Switch between Tutor and Socratic modes:
  - **Tutor mode** (default): AI explains concepts with precision and depth
  - **Socratic mode**: AI asks guiding questions to help you discover insights yourself (say "just tell me" for a direct answer)
- **Quote Card** - Highlighting text shows it as a dismissible card above the input (not inline in the textarea)
- **Resizable Input** - Drag the divider between messages and input to resize (80px-400px range)
- **Context Passing** - When sending a message, includes:
  - Location: `[Book X, Section Y]`
  - Full paragraph text (no truncation)
  - Highlighted phrase marked separately: `[Highlighted: "..."]`
- **Conversation Management** - Multiple named conversations per text with auto-generated titles

### Mobile Experience (≤768px)
Mobile gets a completely different layout optimized for touch:
- **Full-screen reader** - No cramped split view, maximizes reading space
- **Bottom sheet chat** - Slide-up sheet with drag gestures and 3 snap points (closed/half/full)
- **Touch text selection** - Uses `selectionchange` event; "Discuss" button appears below selection (avoids Chrome's native menu)
- **Floating action button** - Quick access to open chat when sheet is closed
- **Compact header** - Back, TOC, settings, search, and chat toggle
- **iOS safe areas** - Respects notch and home indicator

**Architecture:** `Reader.tsx` branches on `useIsMobile()` hook - mobile renders `MobileReaderLayout`, desktop renders the panel-based layout. All shared logic (conversations, API, localStorage) is reused.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+K` | Open search |
| `Esc` | Close modal/exit fullscreen |
| `f` | Toggle fullscreen (Reader) |
| `Cmd+.` | Toggle zen mode (Reader) |
| `Cmd+\` | Toggle table of contents (Reader) |
| `Cmd+B` | Toggle bookmarks panel (Reader) |
| `Cmd+/` | Focus chat input (Reader) |
| `?` | Show keyboard shortcuts (Reader) |

## Testing

Run Playwright E2E tests:
```bash
cd frontend
npm test              # Run all 62 tests headless
npm run test:headed   # Run with browser visible
npm run test:ui       # Open Playwright UI
```

Tests cover: Home page sections, dark mode, command palette, reader features, keyboard shortcuts, navigation, responsive design, zen mode, conversations, Socratic mode, bookmarks, and onboarding.

## Text Import System

### Current State
- **401 texts** imported from Project Gutenberg and Marxists Internet Archive
- Covers Western philosophy (Ancient through 20th century) plus Eastern philosophy traditions
- New marxist/anarchist category with 36 texts from marxists.org

**Coverage by tradition:**

Western (136 texts):
- Ancient: 50 texts (Plato, Aristotle, Stoics, Epicureans, Neoplatonists)
- Medieval: 5 texts (Augustine, Aquinas, Boethius, Maimonides)
- Enlightenment: 35 texts (Bacon, Descartes, Spinoza, Locke, Hume, Kant, Rousseau)
- Modern (19th c.): 46 texts (Hegel, Nietzsche, Mill, Marx, James, Dewey)

Eastern (51 texts):
- Chinese: 9 texts (Confucius, Laozi, Zhuangzi, Mencius)
- Indian: 22 texts (Upanishads, Bhagavad Gita, Patanjali, Shankara)
- Buddhist: 10 texts (Dhammapada, Heart Sutra, Zen texts)
- Sufi: 10 texts (Rumi, Hafiz, Attar, Ibn Arabi)

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
    category='enlightenment', # Western: ancient, medieval, enlightenment, modern
                              # Eastern: chinese, indian, buddhist, sufi
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

## Claude Code Slash Commands

Custom commands in `.claude/commands/`:
- `/acp` - Add, commit, and push all changes to git
- `/ceo` - Evaluate product status and suggest next priorities
