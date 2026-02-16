#!/usr/bin/env python3
"""
Split large sections into paragraphs for texts that have paragraph markers (\n\n).
This is a repair script - doesn't re-import, just splits existing content.

Only operates on texts that:
1. Have sections > 5000 chars average
2. Have usable paragraph markers (double newlines)
"""

import json
import os
import re
from pathlib import Path
from datetime import datetime

TEXTS_DIR = Path(__file__).parent.parent.parent / "texts"
TRACKER_PATH = Path(__file__).parent / "tracker.json"

# Texts identified as having paragraph markers and needing splitting
TEXTS_WITH_MARKERS = [
    "addams-democracy-social-ethics",
    "cicero-tusculan-disputations",
    "cooper-voice-from-south",
    "descartes-philosophical-works",
    "diogenes-laertius-lives",
    "education-good-life",
    "follett-new-state",
    "gilman-women-economics",
    "hobhouse-liberalism",
    "jean-grave-moribund-society",
    "kropotkin-mutual-aid",
    "malatesta-essays",
    "tawney-acquisitive-society",
    "tractatus",
    "veblen-leisure-class",
]

MIN_PARAGRAPH_SIZE = 200  # Don't create sections smaller than this
TARGET_SECTION_SIZE = 1500  # Ideal section size
MAX_SECTION_SIZE = 4000  # Try to keep under this


def split_content_into_paragraphs(content: str) -> list[str]:
    """Split content on double newlines, merging small paragraphs."""
    # Split on double newlines
    paragraphs = re.split(r'\n\n+', content)

    # Clean up each paragraph
    paragraphs = [p.strip() for p in paragraphs if p.strip()]

    # Merge small paragraphs to hit target size
    merged = []
    current = ""

    for para in paragraphs:
        if not current:
            current = para
        elif len(current) < TARGET_SECTION_SIZE:
            # Merge with current
            current = current + "\n\n" + para
        else:
            # Current is big enough, save it and start new
            merged.append(current)
            current = para

    # Don't forget the last one
    if current:
        merged.append(current)

    # Final pass: merge any remaining tiny sections
    final = []
    for section in merged:
        if final and len(section) < MIN_PARAGRAPH_SIZE:
            final[-1] = final[-1] + "\n\n" + section
        else:
            final.append(section)

    return final


def process_text(text_id: str, dry_run: bool = False) -> dict:
    """Process a single text, splitting large sections into paragraphs."""
    filepath = TEXTS_DIR / f"{text_id}.json"

    with open(filepath) as f:
        data = json.load(f)

    original_sections = data['sections']
    new_sections = []

    for section in original_sections:
        content = section['content']
        book = section.get('book', 1)

        # Check if this section needs splitting
        if len(content) > MAX_SECTION_SIZE and '\n\n' in content:
            # Split into paragraphs
            paragraphs = split_content_into_paragraphs(content)

            # Create new sections for each paragraph
            for i, para in enumerate(paragraphs):
                new_sections.append({
                    'book': book,
                    'number': len(new_sections) + 1,
                    'content': para
                })
        else:
            # Keep section as-is but renumber
            new_sections.append({
                'book': book,
                'number': len(new_sections) + 1,
                'content': content
            })

    # Calculate stats
    old_avg = sum(len(s['content']) for s in original_sections) // len(original_sections)
    new_avg = sum(len(s['content']) for s in new_sections) // len(new_sections)

    result = {
        'text_id': text_id,
        'title': data.get('title'),
        'old_sections': len(original_sections),
        'new_sections': len(new_sections),
        'old_avg_size': old_avg,
        'new_avg_size': new_avg,
    }

    if not dry_run:
        # Update the data
        data['sections'] = new_sections

        # Save back
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        result['saved'] = True
    else:
        result['saved'] = False

    return result


def update_tracker(text_id: str, new_section_count: int, new_avg_size: int):
    """Update tracker with new status."""
    with open(TRACKER_PATH) as f:
        tracker = json.load(f)

    if text_id in tracker['texts']:
        # Re-validate
        if new_avg_size < 5000:
            tracker['texts'][text_id]['status'] = 'fixed'
            tracker['texts'][text_id]['notes'] = f'Split large sections into {new_section_count} paragraphs (avg {new_avg_size} chars)'
        else:
            tracker['texts'][text_id]['notes'] = f'Split attempted but avg still {new_avg_size} chars'

        tracker['texts'][text_id]['sections_count'] = new_section_count
        tracker['texts'][text_id]['updated_at'] = datetime.now().isoformat()

    with open(TRACKER_PATH, 'w') as f:
        json.dump(tracker, f, indent=2)


def main():
    import argparse
    parser = argparse.ArgumentParser(description='Split large sections into paragraphs')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be done without saving')
    parser.add_argument('--text', type=str, help='Process single text by ID')
    args = parser.parse_args()

    texts_to_process = [args.text] if args.text else TEXTS_WITH_MARKERS

    print(f"Processing {len(texts_to_process)} texts...")
    print(f"Mode: {'DRY RUN' if args.dry_run else 'LIVE'}")
    print()

    for text_id in texts_to_process:
        try:
            result = process_text(text_id, dry_run=args.dry_run)

            print(f"{text_id}:")
            print(f"  {result['old_sections']} sections -> {result['new_sections']} sections")
            print(f"  {result['old_avg_size']:,} chars avg -> {result['new_avg_size']:,} chars avg")

            if not args.dry_run:
                update_tracker(text_id, result['new_sections'], result['new_avg_size'])
                print(f"  ✓ Saved and tracker updated")
            print()

        except Exception as e:
            print(f"{text_id}: ERROR - {e}")
            print()

    print("Done!")


if __name__ == '__main__':
    main()
