#!/usr/bin/env python3
"""
Parse the Chrystal translation of Meditations from Project Gutenberg.
"""

import json
import re
import urllib.request
from pathlib import Path


def fetch_text(url: str) -> str:
    """Fetch text from URL."""
    with urllib.request.urlopen(url) as response:
        return response.read().decode('utf-8')


def parse_meditations_chrystal(text: str) -> dict:
    """Parse Chrystal's Meditations translation into JSON format."""

    # Find the actual content (between START and END markers)
    start_match = re.search(r'\*\*\* START OF .+? \*\*\*', text)
    end_match = re.search(r'\*\*\* END OF .+? \*\*\*', text)

    if start_match and end_match:
        text = text[start_match.end():end_match.start()]

    sections = []
    current_book = 0

    # Split into lines and join into continuous text per book
    lines = text.split('\n')

    # First pass: identify book boundaries and collect text
    book_texts = {}
    current_book = 0
    current_lines = []

    for line in lines:
        stripped = line.strip()

        # Check for book header (BOOK I., BOOK II., etc.)
        book_match = re.match(r'^BOOK\s+([IVX]+)\.?$', stripped)
        if book_match:
            # Save previous book's text
            if current_book > 0 and current_lines:
                book_texts[current_book] = ' '.join(current_lines)

            # Start new book
            roman = book_match.group(1)
            current_book = roman_to_int(roman)
            current_lines = []
            continue

        # Skip end-of-book markers and other metadata
        if stripped.startswith('END OF THE') or stripped.startswith('IN THE COUNTRY'):
            continue

        if current_book > 0 and stripped:
            current_lines.append(stripped)

    # Don't forget last book
    if current_book > 0 and current_lines:
        book_texts[current_book] = ' '.join(current_lines)

    # Second pass: extract numbered sections from each book's text
    for book_num in sorted(book_texts.keys()):
        book_text = book_texts[book_num]

        # Split by section numbers (1. 2. 3. etc at word boundaries)
        # Pattern: number followed by period and space, at start or after space
        parts = re.split(r'(?:^|\s)(\d+)\.\s+', book_text)

        # parts will be: [intro_text, '1', section1_text, '2', section2_text, ...]
        i = 1
        while i < len(parts) - 1:
            section_num = int(parts[i])
            section_text = parts[i + 1].strip()

            # Clean up the text
            section_text = re.sub(r'\s+', ' ', section_text)

            if section_text:
                sections.append({
                    'book': book_num,
                    'number': section_num,
                    'content': section_text
                })
            i += 2

    return {
        'id': 'meditations',
        'title': 'Meditations',
        'author': 'Marcus Aurelius',
        'translator': 'George W. Chrystal',
        'year': 'c. 161-180 CE',
        'description': 'Personal writings of the Roman Emperor Marcus Aurelius, recording his private notes to himself on Stoic philosophy and self-improvement. A cornerstone of Stoic literature.',
        'category': 'ancient',
        'sections': sections
    }


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


def main():
    print("Fetching Meditations (Chrystal translation) from Project Gutenberg...")
    url = "https://www.gutenberg.org/cache/epub/55317/pg55317.txt"
    text = fetch_text(url)

    print("Parsing text...")
    data = parse_meditations_chrystal(text)

    print(f"Found {len(data['sections'])} sections across {max(s['book'] for s in data['sections'])} books")

    # Show breakdown by book
    max_book = max(s['book'] for s in data['sections'])
    for book in range(1, max_book + 1):
        count = len([s for s in data['sections'] if s['book'] == book])
        print(f"  Book {book}: {count} sections")

    # Save to file
    output_path = Path(__file__).parent.parent / 'texts' / 'meditations.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\nSaved to {output_path}")

    # Show first few sections as preview
    print("\nPreview of first 3 sections:")
    for s in data['sections'][:3]:
        preview = s['content'][:100] + '...' if len(s['content']) > 100 else s['content']
        print(f"  Book {s['book']}, Section {s['number']}: {preview}")


if __name__ == '__main__':
    main()
