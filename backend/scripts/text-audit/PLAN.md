# Text Audit & Repair Plan

## Objective

Systematically validate and fix formatting issues across all 423 philosophy texts imported from Project Gutenberg, Marxists Internet Archive, and Standard Ebooks.

## Known Issues (from Education and the Good Life)

1. **Table of Contents parsed as content** - Section content is just a chapter title with page number (e.g., "GENERAL PRINCIPLES 239")
2. **Sections out of order** - Book 3 appears before Book 1
3. **Merged sections** - Introduction combined with unrelated TOC entry
4. **Missing chapters** - Regex edge cases (hyphens, special characters in titles)
5. **Duplicate headers** - Chapter title repeated in content
6. **Very short sections** - Content < 100 chars likely indicates parsing error

## Validation Criteria

A text is considered **valid** if:
- [ ] Sections are ordered (book numbers ascending, chapter numbers ascending within books)
- [ ] No section content < 100 characters (likely TOC entry)
- [ ] No section content starts with page numbers (e.g., "CHAPTER X 239")
- [ ] No obvious gaps in chapter numbering within a book
- [ ] Content doesn't start with the chapter title verbatim

A text **needs repair** if any of the above fail.

## Agent Instructions

Each agent will:

1. **Read** the JSON file for assigned text
2. **Validate** against the criteria above
3. **Decide**:
   - If valid → mark as "clean" in tracker
   - If invalid → attempt repair
4. **Repair** (if needed):
   - Fetch fresh from source (Gutenberg/Marxists/Standard Ebooks)
   - Re-parse with appropriate handling for the text's structure
   - Save fixed JSON
5. **Report** result to tracker:
   - "clean" - no issues found
   - "fixed" - issues found and repaired
   - "needs-manual" - issues found but couldn't auto-fix (with reason)
   - "error" - agent encountered an error

## Execution Plan

### Phase 1: Test Batch (20 texts) - IN PROGRESS
- Spawned 20 agents on diverse texts (different categories, authors, sizes)
- Texts: schopenhauer-controversy, first-principles, thoreau-maine-woods, public-problems, croce-practical, concept-nature, diogenes-laertius-lives, apology, the-republic, zen-experience, zen-and-art, jatakamala, wang-yangming-instructions, art-of-war, book-of-war, diderot-rameau, burke-works-4, theological-political-treatise, upanishads, mahabharata-vol-1
- Validate the agent approach works
- Refine validation criteria if needed

### Phase 2: Full Run
- Spawn agents for remaining ~400 texts in batches of ~30
- Each batch runs in background
- Monitor progress via tracker

### Phase 3: Manual Review
- Address any "needs-manual" texts
- Verify a sample of "fixed" texts

## Files

- `PLAN.md` - This document
- `tracker.json` - Status of each text
- `validate_text.py` - Validation logic (shared by agents)
- `logs/` - Agent output logs

## Success Criteria

- All 423 texts in "clean" or "fixed" status
- Zero "needs-manual" or "error" (or manually resolved)
- Spot-check of 20 random "fixed" texts confirms quality
