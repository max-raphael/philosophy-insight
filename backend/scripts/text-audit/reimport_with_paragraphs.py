#!/usr/bin/env python3
"""
Re-import specific texts from Gutenberg with paragraph preservation.
This is a one-off repair script for the 48 texts that had newlines stripped.

Does NOT modify import_gutenberg.py - creates standalone import logic.
"""

import json
import re
import urllib.request
from pathlib import Path
from datetime import datetime

TEXTS_DIR = Path(__file__).parent.parent.parent / "texts"
TRACKER_PATH = Path(__file__).parent / "tracker.json"

# Texts that need re-import (have no paragraph markers due to whitespace collapse)
# Gutenberg IDs verified from text_manifest.py
TEXTS_TO_REIMPORT = {
    'arnold-essays-criticism': 77244,
    'averroes-philosophy': 65708,
    'berkeley-works-1': 39746,
    'bruno-enthusiasts-2': 19833,
    'carlyle-sartor': 1051,
    'conquest-happiness': 77894,
    'creative-intelligence': 33727,
    'critique-of-judgment': 48433,
    'critique-of-practical-reason': 5683,
    'croce-aesthetic': 54618,
    'croce-logic': 54137,
    'emerson-conduct-life': 39827,
    'emerson-essays-2': 2945,
    'emerson-representative-men': 6312,
    'emerson-society-solitude': 69258,
    'enneads-vol-1': 42930,
    'erasmus-colloquies': 14031,
    'essay-concerning-human-understanding': 10615,
    'godwin-thoughts-man': 743,
    'golden-verses-pythagoras': 69174,
    'hegel-fine-art-4': 55731,
    'holbach-superstition': 17607,
    'holbach-system-nature-2': 8910,
    'human-nature-conduct': 41386,
    'hume-political-discourses': 59792,
    'iamblichus-mysteries': 72815,
    'iamblichus-pythagoras': 63300,
    'jataka-tales': 51880,
    'lessing-laocoon': 73078,
    'leviathan': 3207,
    'mencius': 24178,
    'philosophical-dictionary': 18569,
    'philosophy-russell': 72981,
    'plutarch-morals': 23639,
    'porphyry-select-works': 77014,
    'proclus-euclid': 74253,
    'proposed-roads-freedom': 690,
    'rochefoucauld-maxims': 9105,
    'school-society': 53910,
    'schopenhauer-controversy': 10731,
    'spencer-essays-1': 29869,
    'thoreau-week-concord': 4232,
    'timaeus': 1572,
    'twilight-of-the-idols': 52263,
    'world-as-will-and-representation': 38427,
    # Marxists.org texts - handled separately:
    # 'bakunin-statism-anarchy': None,
    # 'lukacs-legality-illegality': None,
    # 'marx-jewish-question': None,
}

TARGET_SECTION_SIZE = 1500
MIN_SECTION_SIZE = 300
MAX_SECTION_SIZE = 4000


def fetch_gutenberg(gutenberg_id: int) -> str:
    """Fetch raw text from Project Gutenberg."""
    url = f"https://www.gutenberg.org/cache/epub/{gutenberg_id}/pg{gutenberg_id}.txt"
    print(f"    Fetching {url}")
    with urllib.request.urlopen(url, timeout=30) as response:
        return response.read().decode('utf-8', errors='replace')


def strip_boilerplate(text: str) -> str:
    """Remove Gutenberg header and footer."""
    # Find start marker
    start_patterns = [
        r'\*\*\* START OF THE PROJECT GUTENBERG EBOOK[^\*]+\*\*\*',
        r'\*\*\* START OF THIS PROJECT GUTENBERG EBOOK[^\*]+\*\*\*',
    ]
    for pattern in start_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            text = text[match.end():]
            break

    # Find end marker
    end_patterns = [
        r'\*\*\* END OF THE PROJECT GUTENBERG EBOOK',
        r'\*\*\* END OF THIS PROJECT GUTENBERG EBOOK',
        r'End of the Project Gutenberg EBook',
        r'End of Project Gutenberg',
    ]
    for pattern in end_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            text = text[:match.start()]
            break

    return text.strip()


def normalize_whitespace_preserve_paragraphs(text: str) -> str:
    """
    Normalize whitespace but PRESERVE paragraph breaks (double newlines).
    This is the key difference from the original import script.
    """
    # Normalize line endings
    text = text.replace('\r\n', '\n').replace('\r', '\n')

    # Convert 3+ newlines to exactly 2 (paragraph break)
    text = re.sub(r'\n{3,}', '\n\n', text)

    # Within paragraphs: collapse multiple spaces to single space
    # But keep the \n\n paragraph markers
    lines = text.split('\n\n')
    cleaned_lines = []
    for line in lines:
        # Collapse whitespace within each paragraph
        line = re.sub(r'[ \t]+', ' ', line)
        line = re.sub(r'\n', ' ', line)  # Single newlines become spaces
        line = line.strip()
        if line:
            cleaned_lines.append(line)

    return '\n\n'.join(cleaned_lines)


def split_into_sections(text: str) -> list:
    """
    Split text into sections based on paragraph breaks.
    Merges small paragraphs to hit target section size.
    """
    paragraphs = text.split('\n\n')
    paragraphs = [p.strip() for p in paragraphs if p.strip()]

    if not paragraphs:
        return []

    sections = []
    current_content = ""
    current_book = 1
    section_num = 1

    for para in paragraphs:
        if not current_content:
            current_content = para
        elif len(current_content) < TARGET_SECTION_SIZE:
            current_content += "\n\n" + para
        else:
            # Save current section
            sections.append({
                'book': current_book,
                'number': section_num,
                'content': current_content
            })
            section_num += 1
            current_content = para

    # Don't forget the last section
    if current_content:
        sections.append({
            'book': current_book,
            'number': section_num,
            'content': current_content
        })

    # Merge any remaining tiny sections
    final_sections = []
    for section in sections:
        if final_sections and len(section['content']) < MIN_SECTION_SIZE:
            final_sections[-1]['content'] += "\n\n" + section['content']
        else:
            final_sections.append(section)

    # Renumber
    for i, section in enumerate(final_sections):
        section['number'] = i + 1

    return final_sections


def reimport_text(text_id: str, gutenberg_id: int, dry_run: bool = False) -> dict:
    """Re-import a single text with paragraph preservation."""

    # Load existing JSON to preserve metadata
    json_path = TEXTS_DIR / f"{text_id}.json"
    with open(json_path) as f:
        existing = json.load(f)

    # Fetch fresh from Gutenberg
    raw_text = fetch_gutenberg(gutenberg_id)

    # Strip boilerplate
    text = strip_boilerplate(raw_text)

    # Normalize whitespace but keep paragraph breaks
    text = normalize_whitespace_preserve_paragraphs(text)

    # Split into sections
    new_sections = split_into_sections(text)

    # Calculate stats
    old_sections = existing.get('sections', [])
    old_count = len(old_sections)
    old_avg = sum(len(s.get('content', '')) for s in old_sections) // old_count if old_count else 0

    new_count = len(new_sections)
    new_avg = sum(len(s['content']) for s in new_sections) // new_count if new_count else 0

    result = {
        'text_id': text_id,
        'title': existing.get('title'),
        'old_sections': old_count,
        'new_sections': new_count,
        'old_avg': old_avg,
        'new_avg': new_avg,
    }

    if not dry_run and new_sections:
        # Update sections in existing data
        existing['sections'] = new_sections

        # Save
        with open(json_path, 'w') as f:
            json.dump(existing, f, indent=2, ensure_ascii=False)

        result['saved'] = True
    else:
        result['saved'] = False

    return result


def update_tracker(text_id: str, new_section_count: int, new_avg: int):
    """Update tracker with new status."""
    with open(TRACKER_PATH) as f:
        tracker = json.load(f)

    if text_id in tracker['texts']:
        if new_avg < 5000:
            tracker['texts'][text_id]['status'] = 'fixed'
            tracker['texts'][text_id]['notes'] = f'Re-imported with paragraph preservation: {new_section_count} sections (avg {new_avg} chars)'
        tracker['texts'][text_id]['sections_count'] = new_section_count
        tracker['texts'][text_id]['updated_at'] = datetime.now().isoformat()

    with open(TRACKER_PATH, 'w') as f:
        json.dump(tracker, f, indent=2)


def main():
    import argparse
    parser = argparse.ArgumentParser(description='Re-import texts with paragraph preservation')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be done')
    parser.add_argument('--text', type=str, help='Process single text by ID')
    args = parser.parse_args()

    # Filter to texts with Gutenberg IDs
    texts_to_process = {k: v for k, v in TEXTS_TO_REIMPORT.items() if v is not None}

    if args.text:
        if args.text not in texts_to_process:
            print(f"Error: {args.text} not in list or has no Gutenberg ID")
            return
        texts_to_process = {args.text: texts_to_process[args.text]}

    print(f"Re-importing {len(texts_to_process)} texts from Gutenberg...")
    print(f"Mode: {'DRY RUN' if args.dry_run else 'LIVE'}")
    print()

    success = 0
    failed = 0

    for text_id, gutenberg_id in texts_to_process.items():
        print(f"{text_id} (Gutenberg #{gutenberg_id}):")
        try:
            result = reimport_text(text_id, gutenberg_id, dry_run=args.dry_run)

            print(f"    {result['old_sections']} sections -> {result['new_sections']} sections")
            print(f"    {result['old_avg']:,} avg -> {result['new_avg']:,} avg")

            if not args.dry_run and result['saved']:
                update_tracker(text_id, result['new_sections'], result['new_avg'])
                print(f"    ✓ Saved")
                success += 1
            elif args.dry_run:
                success += 1

        except Exception as e:
            print(f"    ERROR: {e}")
            failed += 1

        print()

    print("=" * 50)
    print(f"Success: {success}, Failed: {failed}")
    if failed > 0:
        print("Failed texts may be from Marxists.org (not Gutenberg)")


if __name__ == '__main__':
    main()
