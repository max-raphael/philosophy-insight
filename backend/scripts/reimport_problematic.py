#!/usr/bin/env python3
"""
Re-import texts that have poor section structure.
These texts were imported before the parser was updated with
LECTURE, ESSAY, LETTER, etc. patterns.
"""

import sys
import time
sys.path.insert(0, '/Users/maxraph/philosophy-insight/backend/scripts')

from pathlib import Path
from import_gutenberg import import_text, save_text
from text_manifest import ALL_TEXTS

# Texts with poor structure (<=5 sections but >50k chars)
# Found via analysis script
TEXTS_TO_REIMPORT = [
    'croce-aesthetic',           # 5 sections, 1,059,877 chars
    'schiller-aesthetical',      # 5 sections, 834,374 chars
    'spencer-essays-1',          # 3 sections, 971,674 chars
    'creative-intelligence',     # 3 sections, 756,740 chars
    'hazlitt-table-talk',        # 3 sections, 896,301 chars
    'thoreau-cape-cod',          # 5 sections, 432,525 chars
    'carlyle-pamphlets',         # 3 sections, 430,931 chars
    'erasmus-colloquies',        # 3 sections, 819,745 chars
    'burke-works-4',             # 5 sections, 783,369 chars
    'voltaire-toleration',       # 3 sections, 415,079 chars
    'brentano-right-wrong',      # 3 sections, 340,911 chars
    'averroes-philosophy',       # 3 sections, 289,995 chars
    'worlds-greatest-philosophy',# 3 sections, 665,895 chars
    'schlegel-philosophy-history-2', # 5 sections, 489,727 chars
    'analysis-of-mind',          # 2 sections, 263,452 chars - LECTURES!
    'thoreau-week-concord',      # 4 sections, 642,889 chars
    'enneads-vol-2',             # 3 sections, 631,335 chars
    'perpetual-peace',           # 5 sections, 315,624 chars
    'twilight-of-the-idols',     # 3 sections, 417,869 chars
    'hegel-philosophy-mind',     # 3 sections, 351,366 chars
    'human-nature-conduct',      # 4 sections, 486,251 chars
    'holbach-christianity-unveiled', # 3 sections, 235,360 chars
    'school-society',            # 5 sections, 135,093 chars
    'critique-of-practical-reason',  # 4 sections, 240,414 chars
    'rochefoucauld-maxims',      # 2 sections, 116,540 chars
    'porphyry-select-works',     # 3 sections, 138,073 chars
    'wang-yangming-instructions',# 2 sections, 83,773 chars
    'god-and-the-state',         # 3 sections, 184,525 chars
    'taylor-mill-enfranchisement',# 4 sections, 62,096 chars
]

def main():
    # Build lookup from manifest
    config_by_id = {c.id: c for c in ALL_TEXTS}

    output_dir = Path('/Users/maxraph/philosophy-insight/backend/texts')

    success = []
    failed = []

    for i, text_id in enumerate(TEXTS_TO_REIMPORT, 1):
        if text_id not in config_by_id:
            print(f"[{i}/{len(TEXTS_TO_REIMPORT)}] {text_id}: NOT IN MANIFEST (skipping)")
            failed.append((text_id, "Not in manifest"))
            continue

        config = config_by_id[text_id]
        print(f"\n[{i}/{len(TEXTS_TO_REIMPORT)}] Re-importing: {text_id} (Gutenberg #{config.gutenberg_id})")

        try:
            result = import_text(config)
            if result:
                save_text(result, output_dir)
                sections = result.get('sections', [])
                total_chars = sum(len(s.get('content', '')) for s in sections)
                print(f"  ✓ Success: {len(sections)} sections, {total_chars:,} chars")
                success.append((text_id, len(sections), total_chars))
            else:
                print(f"  ✗ Failed: No result returned")
                failed.append((text_id, "No result"))
        except Exception as e:
            print(f"  ✗ Error: {e}")
            failed.append((text_id, str(e)))

        # Rate limit to avoid overwhelming Gutenberg
        time.sleep(1)

    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    print(f"\nSuccessfully re-imported: {len(success)}/{len(TEXTS_TO_REIMPORT)}")
    for text_id, sections, chars in success:
        print(f"  {text_id}: {sections} sections, {chars:,} chars")

    if failed:
        print(f"\nFailed: {len(failed)}")
        for text_id, reason in failed:
            print(f"  {text_id}: {reason}")

if __name__ == '__main__':
    main()
