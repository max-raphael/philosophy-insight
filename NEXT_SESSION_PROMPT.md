# Philosophy Insight Library Expansion - Next Priorities

## Context

Philosophy Insight is a web app for reading philosophy texts with an AI companion. The library has grown from 187 to 401 texts through Project Gutenberg and Marxists Internet Archive imports.

## Current State

- **401 texts** currently in `backend/texts/`
- **Phase 8 complete**: 36 Marxist/Anarchist texts imported from marxists.org
- **Import infrastructure**:
  - `backend/scripts/import_gutenberg.py` - Plain text from Gutenberg
  - `backend/scripts/import_marxists.py` - HTML from marxists.org (NEW)
  - `backend/scripts/marxists_manifest.py` - 51 Marxist text configs (NEW)
- **Frontend updated**: New "marxist" category with rose color scheme
- **Master plan**: `MASTER_EXPANSION_PLAN.md` documents all work

## Priority Options for Next Session

### Option A: Fix Failed Phase 8 URLs (Quick Win - ~15 texts)

16 texts failed due to incorrect URLs in `marxists_manifest.py`. Research correct URLs and re-import:

**Failed Gramsci texts (5):**
- gramsci-study-philosophy
- gramsci-intellectuals
- gramsci-party
- gramsci-hegemony
- gramsci-americanism

**Failed Lukács texts (4):**
- lukacs-reification
- lukacs-rosa-luxemburg
- lukacs-legality-illegality
- lukacs-party

**Failed Kropotkin texts (5):**
- kropotkin-anarchist-morality
- kropotkin-anarchist-communism
- kropotkin-modern-science
- kropotkin-state-historic-role
- kropotkin-mutual-aid

**Failed Goldman texts (2):**
- goldman-anarchism
- goldman-philosophy-atheism

Steps:
1. Research correct URLs on marxists.org for each text
2. Update `marxists_manifest.py` with correct URLs
3. Run: `python scripts/import_marxists.py --author gramsci` (etc.)
4. Verify texts load in UI

### Option B: Phase 9 - Standard Ebooks (~30 texts)

Import higher-quality versions of texts from standardebooks.org (CC0 license).

Requires building `import_standard_ebooks.py` to parse EPUB format.

Key texts available:
- Boethius: Consolation of Philosophy
- Descartes: Philosophical Works (complete collection)
- Jane Addams: Democracy and Social Ethics
- William Godwin: Political Justice
- Higher quality versions of existing texts

### Option C: Phase 10 - Complete Cicero (Perseus)

Import remaining Cicero philosophical works from Perseus Digital Library:
- De Natura Deorum
- De Divinatione
- De Fato
- De Legibus
- De Senectute
- De Amicitia
- Letters to Atticus (3 vols)

Requires building `import_perseus.py` for XML parsing.

### Option D: Build Gutenberg HTML Parser

6 important texts exist on Gutenberg but only in HTML/EPUB format:
- Wittgenstein: Tractatus Logico-Philosophicus
- Russell: Introduction to Mathematical Philosophy
- Poincaré: Science and Hypothesis
- Russell: Analysis of Matter
- Russell: ABC of Atoms
- Whitehead: Enquiry Concerning Natural Knowledge

Build `import_gutenberg_html.py` to handle these.

## Recommended Priority

**Option A** (Fix Phase 8 URLs) is the quickest win - just research correct URLs and run existing import script. This would bring the marxist collection from 36 to ~51 texts.

## Reference Files

- `MASTER_EXPANSION_PLAN.md` - Full expansion plan with all phases
- `PHILOSOPHY_SOURCES_RESEARCH.md` - Research on all sources
- `backend/scripts/import_marxists.py` - Working marxists.org parser
- `backend/scripts/marxists_manifest.py` - Text configs (update URLs here)

## Current Coverage

| Category | Count |
|----------|-------|
| Ancient | 67 |
| Medieval | 10 |
| Enlightenment | 71 |
| Modern | 158 |
| Marxist/Anarchist | 36 |
| Chinese | 16 |
| Indian | 22 |
| Buddhist | 10 |
| Sufi | 11 |
| **TOTAL** | **401** |

## Begin

Choose a priority option above and proceed. For Option A, start by browsing marxists.org to find the correct URLs for the failed texts.
