#!/usr/bin/env python3
"""
Parse Beyond Good and Evil (Zimmern translation) from Project Gutenberg.
"""

import json
import re
import urllib.request
from pathlib import Path


def fetch_text(url: str) -> str:
    """Fetch text from URL."""
    with urllib.request.urlopen(url) as response:
        return response.read().decode('utf-8')


def roman_to_int(roman: str) -> int:
    """Convert Roman numeral to integer."""
    values = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100}
    result = 0
    prev = 0
    for char in reversed(roman.upper()):
        val = values.get(char, 0)
        if val < prev:
            result -= val
        else:
            result += val
        prev = val
    return result


def parse_beyond_good_evil(text: str) -> dict:
    """Parse Beyond Good and Evil into JSON format."""

    lines = text.split('\n')

    # Find chapter boundaries
    # Actual chapters start after the TOC (around line 150+)
    chapter_starts = []
    chapter_titles = {
        'I': 'Prejudices of Philosophers',
        'II': 'The Free Spirit',
        'III': 'The Religious Mood',
        'IV': 'Apophthegms and Interludes',
        'V': 'The Natural History of Morals',
        'VI': 'We Scholars',
        'VII': 'Our Virtues',
        'VIII': 'Peoples and Countries',
        'IX': 'What is Noble?'
    }

    for i, line in enumerate(lines):
        match = re.match(r'^CHAPTER ([IVX]+)\.\s+', line.strip())
        if match and i > 100:  # Skip TOC
            chapter_num = roman_to_int(match.group(1))
            chapter_starts.append((i, chapter_num))

    if not chapter_starts:
        raise ValueError("Could not find chapter markers")

    # Find end of main text
    end_idx = len(lines)
    for i, line in enumerate(lines):
        if '*** END OF THE PROJECT GUTENBERG EBOOK' in line:
            end_idx = i
            break
        # Also stop before the poem at the end
        if 'FROM THE HEIGHTS' in line and i > 3000:
            end_idx = i
            break

    sections = []

    # Process each chapter
    for idx, (start_line, chapter_num) in enumerate(chapter_starts):
        # Determine end of this chapter
        if idx + 1 < len(chapter_starts):
            end_line = chapter_starts[idx + 1][0]
        else:
            end_line = end_idx

        # Extract chapter text
        chapter_lines = lines[start_line + 1:end_line]
        chapter_text = '\n'.join(chapter_lines)

        # Split by aphorism numbers (1. 2. 3. etc. at start of line)
        # Pattern: number at start of line followed by period and space
        parts = re.split(r'\n(\d+)\.\s+', '\n' + chapter_text)

        # parts will be: [intro_text, '1', aphorism1_text, '2', aphorism2_text, ...]
        i = 1
        while i < len(parts) - 1:
            aphorism_num = int(parts[i])
            aphorism_text = parts[i + 1].strip()

            # Clean up the text
            aphorism_text = re.sub(r'\s+', ' ', aphorism_text)

            if aphorism_text and len(aphorism_text) >= 20:
                sections.append({
                    'book': chapter_num,
                    'number': aphorism_num,
                    'content': aphorism_text
                })
            i += 2

    return {
        'id': 'beyond-good-evil',
        'title': 'Beyond Good and Evil',
        'author': 'Friedrich Nietzsche',
        'translator': 'Helen Zimmern',
        'year': '1886',
        'description': "Nietzsche's critique of traditional morality and philosophy. Challenges the foundations of Western thought with provocative aphorisms on truth, morality, and the will to power.",
        'category': 'modern',
        'sections': sections
    }


def main():
    print("Fetching Beyond Good and Evil from Project Gutenberg...")
    url = "https://www.gutenberg.org/cache/epub/4363/pg4363.txt"
    text = fetch_text(url)

    print("Parsing text...")
    data = parse_beyond_good_evil(text)

    print(f"Found {len(data['sections'])} aphorisms across {max(s['book'] for s in data['sections'])} chapters")

    # Show breakdown by chapter
    max_chapter = max(s['book'] for s in data['sections'])
    for chapter in range(1, max_chapter + 1):
        count = len([s for s in data['sections'] if s['book'] == chapter])
        print(f"  Chapter {chapter}: {count} aphorisms")

    # Save to file
    output_path = Path(__file__).parent.parent / 'texts' / 'beyond-good-evil.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\nSaved to {output_path}")

    # Show first few sections as preview
    print("\nPreview of first 3 aphorisms:")
    for s in data['sections'][:3]:
        preview = s['content'][:100] + '...' if len(s['content']) > 100 else s['content']
        print(f"  Chapter {s['book']}, Aphorism {s['number']}: {preview}")


if __name__ == '__main__':
    main()
