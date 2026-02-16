# Philosophy Insight Library Expansion - Next Priorities

## Context

Philosophy Insight is a web app for reading philosophy texts with an AI companion. The library has grown from 187 to 423 texts through Project Gutenberg, Marxists Internet Archive, and Standard Ebooks imports.

## Current State

- **423 texts** currently in `backend/texts/`
- **Phase 8 complete**: 40 Marxist/Anarchist texts from marxists.org
- **Phase 9 complete**: 19 texts from Standard Ebooks
- **Import infrastructure**:
  - `backend/scripts/import_gutenberg.py` - Plain text from Gutenberg
  - `backend/scripts/import_marxists.py` - HTML from marxists.org
  - `backend/scripts/import_standard_ebooks.py` - HTML from Standard Ebooks (19 texts defined)
- **Frontend**: "revolutionary" category with rose color scheme
- **Master plan**: `MASTER_EXPANSION_PLAN.md` documents all work

### Recent Work (2026-02-15)

**Phase 8 URL Fixes (6 texts):**
- lukacs-reification, lukacs-rosa-luxemburg, lukacs-legality-illegality, lukacs-party
- goldman-anarchism, goldman-philosophy-atheism

**Phase 9 Standard Ebooks (19 texts):**

Revolutionary/Anarchist:
- kropotkin-mutual-aid (8 sections)
- kropotkin-conquest-bread (54 sections)
- malatesta-essays (3 sections)
- proudhon-what-is-property (28 sections)
- jean-grave-moribund-society (23 sections)

20th Century:
- tractatus (Wittgenstein - the text we couldn't get from Gutenberg!)
- addams-democracy-social-ethics
- follett-new-state
- hobhouse-liberalism
- tawney-acquisitive-society

Women Philosophers:
- cooper-voice-from-south (Anna Julia Cooper)
- gilman-women-economics (Charlotte Perkins Gilman)

Ancient:
- diogenes-laertius-lives
- seneca-dialogues (523 sections!)
- cicero-tusculan-disputations

Medieval:
- boethius-consolation-se (78 sections)

Enlightenment:
- descartes-philosophical-works (125 sections - complete Descartes!)

Social Philosophy:
- le-bon-crowd
- veblen-leisure-class

## Priority Options for Next Session

### Option A: More Standard Ebooks

Many more philosophy texts available:
- Plato: Dialogues (comprehensive)
- Thomas Paine: Age of Reason, Rights of Man, Essays
- Augustine: City of God
- W.E.B. Du Bois: Darkwater
- Locke: Two Treatises, Some Thoughts Concerning Education
- Hobbes: Leviathan
- Nietzsche: Beyond Good and Evil, Genealogy of Morals, Zarathustra
- Tolstoy: What Is Art?, Kingdom of God Is Within You

### Option B: Phase 10 - Complete Cicero (Perseus)

Import remaining Cicero works from Perseus Digital Library:
- De Natura Deorum
- De Divinatione
- De Fato
- De Legibus
- De Senectute
- De Amicitia

Requires building `import_perseus.py` for XML parsing.

### Option C: Build Gutenberg HTML Parser

5 remaining texts on Gutenberg in HTML/EPUB format:
- Russell: Introduction to Mathematical Philosophy
- Poincaré: Science and Hypothesis
- Russell: Analysis of Matter
- Russell: ABC of Atoms
- Whitehead: Enquiry Concerning Natural Knowledge

### Option D: Frontend Polish

- Update collections.ts with new curated lists
- Add "Women in Philosophy" collection
- Add "Anarchist Thought" collection
- Review category assignments for new imports

## Current Coverage

| Category | Count |
|----------|-------|
| Ancient | ~70 |
| Medieval | ~12 |
| Enlightenment | ~73 |
| 19th Century | ~90 |
| 20th Century | ~75 |
| Revolutionary | ~47 |
| Chinese | 16 |
| Indian | 22 |
| Buddhist | 10 |
| Sufi | 11 |
| **TOTAL** | **~423** |

## Begin

Choose a priority option above and proceed.
