#!/usr/bin/env python3
"""
Re-import batch 2: 105 Gutenberg texts with granularity issues.
"""

import json
import re
import urllib.request
from pathlib import Path
from datetime import datetime

TEXTS_DIR = Path(__file__).parent.parent.parent / "texts"
TRACKER_PATH = Path(__file__).parent / "tracker.json"

TEXTS_TO_REIMPORT = {
    'age-of-reason': 3743,
    'bosanquet-state': 63249,
    'brentano-right-wrong': 49228,
    'burke-works-1': 15043,
    'burke-works-2': 15198,
    'burke-works-3': 15679,
    'burke-works-4': 15700,
    'burke-works-5': 15701,
    'carlyle-pamphlets': 1140,
    'chance-love-and-logic': 65274,
    'chinese-classics': 3100,
    'communist-manifesto': 61,
    'croce-historiography': 54642,
    'croce-practical': 54938,
    'croce-vico': 52814,
    'democracy-and-education': 852,
    'early-greek-philosophy': 67097,
    'emerson-essays-1': 2944,
    'enneads-vol-2': 42931,
    'enneads-vol-4': 42933,
    'enquiry-concerning-morals': 4320,
    'essays-experimental-logic': 40794,
    'essays-montaigne': 3600,
    'essence-of-christianity': 47025,
    'ethics-dewey': 39551,
    'ferguson-civil-society': 8646,
    'first-principles': 55046,
    'folk-psychology': 44138,
    'foundations-geometry': 52091,
    'foundations-science': 39713,
    'ghazali-teachings': 73140,
    'god-and-the-state': 36568,
    'hegel-fine-art-1': 55334,
    'hegel-fine-art-2': 55445,
    'hegel-fine-art-3': 55623,
    'hegel-history-philosophy-1': 51635,
    'hegel-history-philosophy-2': 51636,
    'hegel-history-philosophy-3': 58169,
    'hegel-logic': 55108,
    'history-inductive-sciences': 68693,
    'holbach-christianity-unveiled': 40770,
    'holbach-system-nature-1': 8909,
    'how-we-think': 37423,
    'huxley-evolution-ethics': 2940,
    'huxley-lay-sermons': 16729,
    'huxley-science-culture': 52344,
    'ibn-tufail-awakening': 34572,
    'icarus': 66225,
    'influence-darwin': 51525,
    'james-will-to-believe': 37090,
    'jnana-yoga': 72368,
    'knowledge-external-world': 37090,
    'la-bruyere-characters': 46633,
    'laws': 1750,
    'lives-of-philosophers': 57342,
    'mahabharata-vol-2': 15475,
    'mahabharata-vol-4': 15477,
    'methods-of-ethics': 46743,
    'moral-principles-education': 25172,
    'mozi': 24240,
    'mutual-aid': 4341,
    'mysticism-and-logic': 25447,
    'novum-organon-renovatum': 69764,
    'novum-organum': 45988,
    'on-duties': 47001,
    'outlines-critical-ethics': 60422,
    'pascal-provincial-letters': 73959,
    'pater-appreciations': 4037,
    'pater-greek-studies': 4035,
    'perpetual-peace': 50922,
    'philosophical-studies': 50141,
    'philosophy-discovery': 51555,
    'plutarch-essays-1': 62618,
    'plutarch-essays-2': 62858,
    'principles-of-psychology-vol-1': 57628,
    'principles-of-psychology-vol-2': 57634,
    'ramayana': 24869,
    'rights-of-man': 31270,
    'roman-stoicism': 64488,
    'royce-religious-insight': 33677,
    'rumi-mesnevi': 61724,
    'sacred-books-of-east': 12894,
    'santayana-soliloquies': 48429,
    'schlegel-philosophy-history-1': 38365,
    'schopenhauer-basis-morality': 44929,
    'schopenhauer-fourfold-root': 50966,
    'spencer-data-ethics': 46129,
    'spencer-education': 16510,
    'spinoza-improvement': 1016,
    'studies-logical-theory': 40665,
    'system-of-logic': 27942,
    'taylor-mill-enfranchisement': 73404,
    'theory-of-moral-sentiments': 67363,
    'thoreau-cape-cod': 34392,
    'thoreau-maine-woods': 42500,
    'treatise-of-human-nature': 4705,
    'tusculan-disputations': 14988,
    'unto-this-last': 36541,
    'varieties-of-religious-experience': 621,
    'voltaire-toleration': 64858,
    'wang-yangming-instructions': 25517,
    'what-is-property': 360,
    'why-men-fight': 55610,
    'worlds-greatest-philosophy': 25009,
    'zen-experience': 34325,
}

TARGET_SECTION_SIZE = 1500
MIN_SECTION_SIZE = 300


def fetch_gutenberg(gutenberg_id: int) -> str:
    """Fetch raw text from Project Gutenberg."""
    url = f"https://www.gutenberg.org/cache/epub/{gutenberg_id}/pg{gutenberg_id}.txt"
    print(f"    Fetching {url}")
    with urllib.request.urlopen(url, timeout=30) as response:
        return response.read().decode('utf-8', errors='replace')


def strip_boilerplate(text: str) -> str:
    """Remove Gutenberg header and footer."""
    start_patterns = [
        r'\*\*\* START OF THE PROJECT GUTENBERG EBOOK[^\*]+\*\*\*',
        r'\*\*\* START OF THIS PROJECT GUTENBERG EBOOK[^\*]+\*\*\*',
    ]
    for pattern in start_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            text = text[match.end():]
            break

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
    """Normalize whitespace but PRESERVE paragraph breaks."""
    text = text.replace('\r\n', '\n').replace('\r', '\n')
    text = re.sub(r'\n{3,}', '\n\n', text)

    lines = text.split('\n\n')
    cleaned_lines = []
    for line in lines:
        line = re.sub(r'[ \t]+', ' ', line)
        line = re.sub(r'\n', ' ', line)
        line = line.strip()
        if line:
            cleaned_lines.append(line)

    return '\n\n'.join(cleaned_lines)


def split_into_sections(text: str) -> list:
    """Split text into sections based on paragraph breaks."""
    paragraphs = text.split('\n\n')
    paragraphs = [p.strip() for p in paragraphs if p.strip()]

    if not paragraphs:
        return []

    sections = []
    current_content = ""
    section_num = 1

    for para in paragraphs:
        if not current_content:
            current_content = para
        elif len(current_content) < TARGET_SECTION_SIZE:
            current_content += "\n\n" + para
        else:
            sections.append({
                'book': 1,
                'number': section_num,
                'content': current_content
            })
            section_num += 1
            current_content = para

    if current_content:
        sections.append({
            'book': 1,
            'number': section_num,
            'content': current_content
        })

    # Merge tiny sections
    final_sections = []
    for section in sections:
        if final_sections and len(section['content']) < MIN_SECTION_SIZE:
            final_sections[-1]['content'] += "\n\n" + section['content']
        else:
            final_sections.append(section)

    for i, section in enumerate(final_sections):
        section['number'] = i + 1

    return final_sections


def reimport_text(text_id: str, gutenberg_id: int, dry_run: bool = False) -> dict:
    """Re-import a single text."""
    json_path = TEXTS_DIR / f"{text_id}.json"

    if not json_path.exists():
        return {'text_id': text_id, 'error': 'File not found'}

    with open(json_path) as f:
        existing = json.load(f)

    raw_text = fetch_gutenberg(gutenberg_id)
    text = strip_boilerplate(raw_text)
    text = normalize_whitespace_preserve_paragraphs(text)
    new_sections = split_into_sections(text)

    old_sections = existing.get('sections', [])
    old_count = len(old_sections)
    old_avg = sum(len(s.get('content', '')) for s in old_sections) // old_count if old_count else 0

    new_count = len(new_sections)
    new_avg = sum(len(s['content']) for s in new_sections) // new_count if new_count else 0

    result = {
        'text_id': text_id,
        'old_sections': old_count,
        'new_sections': new_count,
        'old_avg': old_avg,
        'new_avg': new_avg,
    }

    if not dry_run and new_sections and new_avg < old_avg:
        existing['sections'] = new_sections
        with open(json_path, 'w') as f:
            json.dump(existing, f, indent=2, ensure_ascii=False)
        result['saved'] = True
    else:
        result['saved'] = False
        if new_avg >= old_avg:
            result['skip_reason'] = 'New avg not better'

    return result


def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--dry-run', action='store_true')
    parser.add_argument('--text', type=str)
    args = parser.parse_args()

    texts = {args.text: TEXTS_TO_REIMPORT[args.text]} if args.text else TEXTS_TO_REIMPORT

    print(f"Re-importing {len(texts)} texts...")
    print(f"Mode: {'DRY RUN' if args.dry_run else 'LIVE'}")
    print()

    success = 0
    skipped = 0
    failed = 0

    for text_id, gutenberg_id in texts.items():
        print(f"{text_id} (#{gutenberg_id}):")
        try:
            result = reimport_text(text_id, gutenberg_id, dry_run=args.dry_run)

            if 'error' in result:
                print(f"    ERROR: {result['error']}")
                failed += 1
            else:
                print(f"    {result['old_sections']} -> {result['new_sections']} sections")
                print(f"    {result['old_avg']:,} avg -> {result['new_avg']:,} avg")

                if result.get('saved'):
                    print(f"    ✓ Saved")
                    success += 1
                elif result.get('skip_reason'):
                    print(f"    Skipped: {result['skip_reason']}")
                    skipped += 1
                else:
                    success += 1

        except Exception as e:
            print(f"    ERROR: {e}")
            failed += 1

        print()

    print("=" * 50)
    print(f"Success: {success}, Skipped: {skipped}, Failed: {failed}")


if __name__ == '__main__':
    main()
