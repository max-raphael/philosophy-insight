#!/usr/bin/env python3
"""
Fix duplicate (book, number) keys by renumbering sections sequentially.
Also removes true duplicates (identical content).
"""

import json
import os
from pathlib import Path
from datetime import datetime

TEXTS_DIR = Path(__file__).parent.parent.parent / "texts"
TRACKER_PATH = Path(__file__).parent / "tracker.json"


def fix_duplicates(text_id: str, dry_run: bool = False) -> dict:
    """Fix duplicate sections in a text."""
    filepath = TEXTS_DIR / f"{text_id}.json"

    with open(filepath) as f:
        data = json.load(f)

    sections = data['sections']
    original_count = len(sections)

    # Step 1: Remove true duplicates (identical content)
    seen_content = set()
    unique_sections = []
    removed_true_dups = 0

    for s in sections:
        content_hash = hash(s['content'])
        if content_hash not in seen_content:
            seen_content.add(content_hash)
            unique_sections.append(s)
        else:
            removed_true_dups += 1

    # Step 2: Renumber sequentially within each book
    # Group by book first
    books = {}
    for s in unique_sections:
        book = s.get('book', 1)
        if book not in books:
            books[book] = []
        books[book].append(s)

    # Renumber within each book
    renumbered = []
    for book in sorted(books.keys()):
        for i, s in enumerate(books[book], 1):
            renumbered.append({
                'book': book,
                'number': i,
                'content': s['content']
            })

    new_count = len(renumbered)

    # Check for remaining duplicates
    seen_keys = set()
    remaining_dups = 0
    for s in renumbered:
        key = (s['book'], s['number'])
        if key in seen_keys:
            remaining_dups += 1
        seen_keys.add(key)

    result = {
        'text_id': text_id,
        'original_sections': original_count,
        'removed_true_dups': removed_true_dups,
        'new_sections': new_count,
        'remaining_dups': remaining_dups,
    }

    if not dry_run and remaining_dups == 0:
        data['sections'] = renumbered
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        result['saved'] = True
    else:
        result['saved'] = False

    return result


def update_tracker(text_id: str, new_count: int):
    """Update tracker after fixing."""
    with open(TRACKER_PATH) as f:
        tracker = json.load(f)

    if text_id in tracker['texts']:
        # Re-check if now clean
        tracker['texts'][text_id]['sections_count'] = new_count
        tracker['texts'][text_id]['status'] = 'fixed'
        tracker['texts'][text_id]['notes'] = f'Fixed: renumbered sections sequentially, removed true duplicates'
        tracker['texts'][text_id]['updated_at'] = datetime.now().isoformat()
        tracker['texts'][text_id]['issues_found'] = []

    with open(TRACKER_PATH, 'w') as f:
        json.dump(tracker, f, indent=2)


def main():
    import argparse
    parser = argparse.ArgumentParser(description='Fix duplicate sections')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be done')
    parser.add_argument('--text', type=str, help='Process single text')
    args = parser.parse_args()

    # Find texts with duplicate issues
    with open(TRACKER_PATH) as f:
        tracker = json.load(f)

    if args.text:
        texts_to_fix = [args.text]
    else:
        texts_to_fix = []
        for text_id, info in tracker['texts'].items():
            if info['status'] != 'needs-manual':
                continue
            issues = info.get('issues_found', [])
            if any('DUPLICATE' in i for i in issues):
                texts_to_fix.append(text_id)

    print(f"Processing {len(texts_to_fix)} texts with duplicate issues...")
    print(f"Mode: {'DRY RUN' if args.dry_run else 'LIVE'}")
    print()

    success = 0
    failed = 0

    for text_id in texts_to_fix:
        try:
            result = fix_duplicates(text_id, dry_run=args.dry_run)

            print(f"{text_id}:")
            print(f"  {result['original_sections']} -> {result['new_sections']} sections")
            print(f"  Removed {result['removed_true_dups']} true duplicates")

            if result['remaining_dups'] > 0:
                print(f"  WARNING: {result['remaining_dups']} duplicates remain")
                failed += 1
            elif not args.dry_run and result['saved']:
                update_tracker(text_id, result['new_sections'])
                print(f"  ✓ Saved")
                success += 1
            else:
                success += 1

        except Exception as e:
            print(f"{text_id}: ERROR - {e}")
            failed += 1

        print()

    print("=" * 50)
    print(f"Success: {success}, Failed/Warnings: {failed}")


if __name__ == '__main__':
    main()
