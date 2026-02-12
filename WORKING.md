# Philosophy Insight - Working Document

*This file is Claude Code's persistent memory across sessions. Read this first.*

---

## Current Status

**Phase:** 3 - Reading Experience Polish ← COMPLETE
**Focus:** UI/UX redesign for delightful discovery experience
**Started:** 2026-02-10

---

## The Mission

Transform MVP into the north star vision: "ChatGPT embedded inside the book."

See `NORTH_STAR.md` for full vision.

---

## Phase Roadmap

### Phase 1: Spatial Grounding ← COMPLETE
Text selection is the primary interaction. AI gets intelligent context automatically.

- [x] Text selection tracks which paragraph it came from
- [x] Pass location context to AI with each message (book, section, content, prev/next)
- [x] Update system prompt to include spatial context
- [x] Surrounding context (prev/next paragraphs) sent to AI
- [x] Simplified UX: only text selection, no separate paragraph clicking

**Design decision:** User highlights text → clicks "Discuss" → AI gets full context (the paragraph + surrounding paragraphs) automatically. No need for separate "click to focus" interaction.

**Done when:** User highlights confusing text, asks "What does this mean?", AI understands the full context.

### Phase 2: Full Texts & Navigation ← COMPLETE
Current texts are incomplete snippets. Users need full works to actually "read philosophy."

#### The Problem
- Meditations: 38 sections but real text has ~480+ passages (8% coverage) **→ FIXED**
- Republic: 66 sections across books 1,2,7 only (missing 3-6, 8-10) **→ FIXED**
- Users can't read a complete work chapter-by-chapter **→ FIXED**

#### The Solution

**Part A: Source Full Texts**
- [x] Get complete Meditations from Project Gutenberg → 487 sections across 12 books
  - Using George W. Chrystal translation (1902) - more modern language than George Long
  - Parser: `backend/scripts/parse_meditations_chrystal.py`
- [x] Parse into JSON format: `{book, number, content}` per section
- [x] Write Python scripts to automate Gutenberg → JSON conversion
- [x] Republic: 1595 sections across 10 books (Jowett translation)
- [x] Nicomachean Ethics: 1085 sections across 10 books (Ross translation)
- [x] Beyond Good & Evil: 293 aphorisms across 9 chapters (Zimmern translation)
- [x] On Liberty: 132 sections across 5 chapters

**Part B: Navigation UI**
- [x] Table of contents sidebar or dropdown showing all books/chapters
- [x] Chapter selector: click "Book 3" → scroll/jump there
- [x] Current location indicator in header (e.g., "Book 3 of 12")
- [x] Persistent reading position per text (localStorage)
- [ ] Progress per chapter, not just overall (deferred - overall progress works for now)

**Part C: Performance Considerations**
- [x] Full texts may be 100KB+ each → Meditations is 386KB, renders smoothly
- [x] Optimized by removing staggered paragraph animations
- [x] Test with largest text first → Works well

#### Implementation Order
1. ✅ Get one full text working (Meditations) as proof of concept
2. ✅ Add navigation UI to jump between books
3. ✅ Add reading position persistence
4. ✅ Expand to other texts (Republic, Nicomachean Ethics, Beyond Good & Evil, On Liberty)

**Done when:** All major texts are complete with full content. **→ DONE!**

### Phase 3: Reading Experience Polish ← COMPLETE
- [x] Mobile responsive layout (vertical panel stack)
- [x] Dynamic text suggestions (based on author/category)
- [x] Conversation export (Markdown download)
- [x] Dark mode toggle (Light/Dark/System with OS preference detection)
- [x] Font size adjustment (Small/Medium/Large)
- [x] Font family toggle (Serif/Sans)
- [x] Visual hierarchy improvements (complete home page redesign)
- [x] Command palette search (Cmd+K, fuzzy search, author filtering)
- [x] Curated "Start Here" collection for beginners
- [x] Browse by Era and Browse by Philosopher sections
- [x] Table of Contents sidebar in reader
- [x] Reading controls panel
- [x] Keyboard shortcuts (fullscreen, TOC toggle, search)
- [x] Keyboard shortcuts help modal
- [x] Continue Reading section (shows texts with progress)
- [x] Playwright E2E test suite (37 tests)

**Done when:** Someone can read for an hour comfortably. **→ DONE!**

### Phase 4: Memory and Continuity
- [ ] Multiple conversations per text (tabs or dropdown to switch)
- [ ] Name/title conversations for easy reference
- [ ] Conversation history tied to specific passages
- [ ] Show prior discussions when clicking previously-discussed paragraphs
- [ ] AI references prior discussions in prompts

**Done when:** Returning after a week feels continuous.

### Phase 5: Library Depth ← COMPLETE
- [x] 136 texts from Project Gutenberg (Ancient through 19th century)
- [x] Mix of periods: Ancient (50), Medieval (5), Enlightenment (34), Modern (45)
- [x] Consistent JSON formatting with auto-structure detection
- [x] Curated collections and era-based browsing

**Done when:** Meaningful choice without overwhelm. **→ DONE!**

---

## Decisions Made

1. **No gamification** - per user directive and north star
2. **No accounts/cloud sync yet** - core loop first
3. **No social features** - per north star ("quiet reading room")
4. **Free for everyone** - no monetization concerns

---

## Technical Context

**Stack:**
- Backend: FastAPI (Python), OpenAI API
- Frontend: React + TypeScript, Vite, Tailwind CSS v4
- State: localStorage for conversations
- Texts: JSON files in `backend/texts/`

**Key Files:**
- `frontend/src/components/Reader.tsx` - Text display, selection handling
- `frontend/src/components/DiscussionPanel.tsx` - Chat interface
- `frontend/src/pages/Reader.tsx` - Main reading view, panel layout
- `backend/main.py` - API routes, OpenAI integration

**Current Text Schema:**
```json
{
  "id": "meditations",
  "title": "Meditations",
  "author": "Marcus Aurelius",
  "sections": [{"book": 1, "number": 1, "content": "..."}]
}
```

---

## Session Log

### 2026-02-11 (Session 7) - Major UI/UX Redesign
- **Complete UI/UX redesign** implementing full vision from plan
- **Dark Mode**: ThemeContext, ThemeToggle, useDarkMode hook with system preference detection
- **Command Palette**: Spotlight-style search (Cmd+K or /), fuzzy search with Fuse.js, author filtering, recent searches
- **Home Page Redesign**:
  - Continue Reading section (shows texts with saved progress)
  - Start Here curated collection (8 essential texts for beginners)
  - Browse by Era (Ancient, Medieval, Enlightenment, Modern)
  - Browse by Philosopher (horizontal scroll)
  - Full Library with era filters and sorting
- **Reader Enhancements**:
  - Table of Contents sidebar (Cmd+\ to toggle)
  - Reading Controls (font size S/M/L, serif/sans, theme, fullscreen)
  - Keyboard shortcuts modal (Shift+/ to open)
  - Fullscreen mode (f key)
- **New files created**:
  - `src/contexts/ThemeContext.tsx`
  - `src/hooks/useDarkMode.ts`, `useKeyboardShortcuts.ts`
  - `src/data/collections.ts`
  - `src/components/CommandPalette.tsx`, `ThemeToggle.tsx`, `TableOfContents.tsx`, `ReadingControls.tsx`, `KeyboardShortcutsModal.tsx`
  - `tests/ui-features.spec.ts` (37 Playwright tests)
- **Bug fixes during testing**:
  - Fixed keyboard shortcuts being disabled when modals open
  - Fixed ? shortcut (changed to Shift+/ internally)
  - Fixed author search showing all texts by selected author
- **Dependencies added**: fuse.js, @playwright/test
- Updated CLAUDE.md with all new features
- Phase 3 now complete!

### 2026-02-11 (Session 6)
- Implemented Priority 1 improvements (Phase 3 polish)
- **Dynamic suggestions**: DiscussionPanel now generates context-aware suggestions based on text author and category instead of hardcoded Marcus Aurelius questions
- **Conversation export**: Added Export button next to Clear that downloads conversation as Markdown file with proper formatting (blockquotes for highlighted passages)
- **Mobile responsiveness**: Added useMediaQuery hook, panels stack vertically on mobile (< 768px), header simplified for small screens
- Files modified:
  - `frontend/src/components/DiscussionPanel.tsx` (suggestions, export)
  - `frontend/src/pages/Reader.tsx` (mobile layout, category prop)
  - `frontend/src/hooks/useMediaQuery.ts` (new)
- Added multiple conversations feature to Phase 4 roadmap
- Next: Dark mode, font controls, or more polish

### 2026-02-11 (Session 5)
- Completed Phase 2: Full Texts
- Parsed full Republic from Gutenberg (Jowett translation)
  - 1595 sections across 10 books
  - Parser: `backend/scripts/parse_republic.py`
  - Combines short paragraphs into ~400 char sections for comfortable reading
- Parsed full Nicomachean Ethics (Ross translation)
  - 1085 sections across 10 books
  - Parser: `backend/scripts/parse_nicomachean.py`
- Parsed full Beyond Good & Evil (Zimmern translation)
  - 293 aphorisms across 9 chapters
  - Parser: `backend/scripts/parse_beyond_good_evil.py`
- Parsed full On Liberty (Mill)
  - 132 sections across 5 chapters
  - Parser: `backend/scripts/parse_on_liberty.py`
- All major texts now complete with full content
- Library now has 7 texts with ~3700 total sections
- Next: Phase 3 (Dark mode, font controls) or more texts

### 2026-02-11 (Session 4)
- Implemented Phase 2 Part A: Full Meditations text
  - Wrote `backend/scripts/parse_gutenberg.py` for George Long translation
  - Then swapped to George W. Chrystal translation (more modern language)
  - Created `backend/scripts/parse_meditations_chrystal.py` for the new format
  - Meditations now has 487 sections across 12 books (was 38 snippets)
  - Chrystal uses cleaner prose: "I learned from my grandfather..." vs archaic "Of my grandfather I have learned..."
- Implemented Phase 2 Part B: Navigation UI
  - Added book selector dropdown in header ("Book X of Y")
  - Added scrollToBook functionality with IntersectionObserver tracking
  - Added reading position persistence in localStorage
  - Optimized animations for large texts (removed staggered paragraph delays)
- UI Polish
  - Increased text container max-width from `max-w-2xl` to `max-w-4xl` for better use of space
- Build passes, Meditations is fully readable with navigation
- Next: Expand to other texts (Republic, etc.)

### 2026-02-11 (Session 3)
- Generated docs/CONTRIB.md and docs/RUNBOOK.md
- Identified gap: current texts are snippets, not full works
- Planned Phase 2: Full Texts & Navigation
- Next session should start with Phase 2 implementation

### 2026-02-10 (Session 2)
- Implemented Phase 1: Spatial Grounding
- Added ParagraphLocation type and tracking
- Text selection now tracks source paragraph automatically
- DiscussionPanel passes full context to API (paragraph + surrounding)
- Backend system prompt includes spatial context
- Simplified UX per user feedback: removed paragraph clicking, kept only text selection
- Build passes, Phase 1 complete

### 2026-02-10 (Session 1)
- Created NORTH_STAR.md with user
- Established phase roadmap
- Starting Phase 1: Spatial Grounding

---

## Questions for User (if blocked)

*None currently*

---

## Current Library

**136 texts** imported from Project Gutenberg covering 2,500 years of philosophy.

| Era | Count | Key Authors |
|-----|-------|-------------|
| Ancient | 50 | Plato, Aristotle, Marcus Aurelius, Epictetus, Seneca, Plotinus |
| Medieval | 5 | Augustine, Aquinas, Boethius, Maimonides |
| Enlightenment | 34 | Descartes, Spinoza, Locke, Hume, Kant, Rousseau |
| Modern | 45 | Hegel, Nietzsche, Mill, Marx, James, Dewey |

**Curated Collections** (in `src/data/collections.ts`):
- "Start Here" - 8 essential texts for beginners
- Era-based browsing with visual cards
- Thematic collections (Death & Mortality, Political Philosophy, Ethics, etc.)

Import tools: `backend/scripts/batch_import.py`, `backend/scripts/import_gutenberg.py`

---

## Next Session Checklist

When starting a new session:
1. Read this file first
2. Read NORTH_STAR.md if context needed
3. Check current phase and uncompleted tasks
4. Continue where left off

**Current priority:** Phase 4 (Memory & Continuity) - Multiple conversations per text, conversation history tied to passages

**Completed phases:**
- ✅ Phase 1: Spatial Grounding
- ✅ Phase 2: Full Texts & Navigation (136 texts)
- ✅ Phase 3: Reading Experience Polish (full UI/UX redesign)
- ✅ Phase 5: Library Depth (136 texts with curated collections)
