# Text Audit Handoff

## Current State (as of 2026-02-16)

**395 / 423 texts clean (93%)**

| Status | Count |
|--------|-------|
| Clean | 395 |
| Needs re-parse | 4 |
| Needs manual | 24 |

## What We Did

### Phase 1: Initial Audit
- Ran validation on all 423 texts
- Found many had granularity issues (sections too large - entire chapters as single sections)
- Original "clean" count was only 41

### Phase 2: Split texts with paragraph markers
- Script: `split_large_sections.py`
- Fixed 15 texts that had `\n\n` paragraph markers
- These could be split without re-importing

### Phase 3: Re-import from Gutenberg (Batch 1)
- Script: `reimport_with_paragraphs.py`
- Re-imported 45 texts from Gutenberg with paragraph preservation
- Key fix: Original import collapsed all whitespace (`\s+` -> ` `), stripping paragraph breaks

### Phase 4: Accept minor issues
- Many texts flagged for "short sections" were actually fine (dialogue, aphorisms, headers)
- Marked ~200 texts as clean after manual review

### Phase 5: Fix duplicate numbering
- Script: `fix_duplicates.py`
- Fixed 107 texts with duplicate (book, number) keys
- Most were mislabeled sections, not true duplicates

### Phase 6: Re-import from Gutenberg (Batch 2)
- Script: `reimport_batch2.py`
- Re-imported 89 more texts we hadn't tried before

## Remaining 24 Needs-Manual

### Severe granularity (3) - Gutenberg sources lack paragraph breaks
- `chinese-classics`
- `proudhon-what-is-property`
- `wang-yangming-instructions`

### Ordering issues (6) - Sections mislabeled
- `ethics`
- `hegel-philosophy-mind`
- `marx-civil-war-france`
- `marx-german-ideology`
- `mutual-aid`
- `principles-of-psychology-vol-1`

### Minor only (15) - Could accept as clean
- `age-of-reason`, `croce-vico`, `essays-montaigne`, `hegel-logic`
- `kropotkin-conquest-bread`, `laws`, `le-bon-crowd`, `lenin-state-revolution`
- `lives-of-philosophers`, `mahabharata-vol-4`, `mozi`, `ramayana`
- `sacred-books-of-east`, `treatise-of-human-nature`, `zen-experience`

## 4 Needs Re-parse (Marxists.org texts)
- `bakunin-statism-anarchy`
- `lukacs-legality-illegality`
- `marx-jewish-question`
- `mencius` (Gutenberg source lacks paragraphs)

## Next Steps

1. **Quick win**: Mark 15 minor-only texts as clean → 410 clean (97%)
2. **Marxists.org**: Create re-import script for Marxists.org texts with paragraph preservation
3. **Ordering fixes**: The 6 ordering texts might need manual book/chapter reassignment
4. **Severe granularity**: The 3 texts without paragraph breaks would need heuristic splitting or different sources

## Key Files

- `tracker.json` - Status of all 423 texts
- `validate_text.py` - Validation logic (checks ordering, duplicates, granularity, short sections)
- `revalidate_all.py` - Batch re-validation (WARNING: overwrites manual "accepted" decisions)
- `split_large_sections.py` - Splits texts that have `\n\n` markers
- `reimport_with_paragraphs.py` - Re-imports from Gutenberg preserving paragraphs (batch 1)
- `reimport_batch2.py` - Same for batch 2
- `fix_duplicates.py` - Renumbers sections to fix duplicate keys

## Important Notes

- `revalidate_all.py` will overwrite manual acceptance decisions - need to re-run the acceptance logic after
- The root cause of granularity issues was `import_gutenberg.py` line 487: `text = re.sub(r'\s+', ' ', text)` which collapsed paragraph breaks
- We did NOT modify `import_gutenberg.py` to avoid breaking existing imports
- Texts from Marxists.org need a separate approach (different HTML structure)
