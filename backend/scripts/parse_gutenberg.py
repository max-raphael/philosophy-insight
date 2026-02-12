#!/usr/bin/env python3
"""
Parse Project Gutenberg texts into Philosophy Insight JSON format.
"""

import json
import re
import urllib.request
from pathlib import Path


def fetch_text(url: str) -> str:
    """Fetch text from URL."""
    with urllib.request.urlopen(url) as response:
        return response.read().decode('utf-8')


def parse_meditations(text: str) -> dict:
    """Parse Meditations text into JSON format."""

    # Find the actual content (between START and END markers)
    start_match = re.search(r'\*\*\* START OF .+? \*\*\*', text)
    end_match = re.search(r'\*\*\* END OF .+? \*\*\*', text)

    if start_match and end_match:
        text = text[start_match.end():end_match.start()]

    sections = []

    # Roman numeral patterns for section numbers
    roman_pattern = r'^([IVXLC]+)\.'

    # Find all books (THE FIRST BOOK, THE SECOND BOOK, etc.)
    book_names = [
        'THE FIRST BOOK', 'THE SECOND BOOK', 'THE THIRD BOOK',
        'THE FOURTH BOOK', 'THE FIFTH BOOK', 'THE SIXTH BOOK',
        'THE SEVENTH BOOK', 'THE EIGHTH BOOK', 'THE NINTH BOOK',
        'THE TENTH BOOK', 'THE ELEVENTH BOOK', 'THE TWELFTH BOOK'
    ]

    # Split by book markers
    current_book = 0
    lines = text.split('\n')
    current_section_lines = []
    current_section_num = 0

    i = 0
    while i < len(lines):
        line = lines[i].strip()

        # Check for book header
        for book_idx, book_name in enumerate(book_names):
            if line.upper().startswith(book_name):
                # Save previous section if exists
                if current_section_lines and current_book > 0:
                    content = clean_content(' '.join(current_section_lines))
                    if content:
                        sections.append({
                            'book': current_book,
                            'number': current_section_num,
                            'content': content
                        })
                current_book = book_idx + 1
                current_section_lines = []
                current_section_num = 0
                break

        # Check for Roman numeral section start
        if current_book > 0:
            roman_match = re.match(roman_pattern, line)
            if roman_match:
                # Save previous section
                if current_section_lines:
                    content = clean_content(' '.join(current_section_lines))
                    if content:
                        sections.append({
                            'book': current_book,
                            'number': current_section_num,
                            'content': content
                        })

                # Start new section
                current_section_num = roman_to_int(roman_match.group(1))
                # Get rest of line after the roman numeral
                rest = line[roman_match.end():].strip()
                current_section_lines = [rest] if rest else []
            elif line and current_section_num > 0:
                # Continue current section
                current_section_lines.append(line)

        i += 1

    # Don't forget the last section
    if current_section_lines and current_book > 0:
        content = clean_content(' '.join(current_section_lines))
        if content:
            sections.append({
                'book': current_book,
                'number': current_section_num,
                'content': content
            })

    return {
        'id': 'meditations',
        'title': 'Meditations',
        'author': 'Marcus Aurelius',
        'translator': 'George Long',
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


def clean_content(text: str) -> str:
    """Clean up section content."""
    # Collapse multiple spaces
    text = re.sub(r'\s+', ' ', text)
    text = text.strip()
    return text


def main():
    print("Fetching Meditations from Project Gutenberg...")
    url = "https://www.gutenberg.org/cache/epub/2680/pg2680.txt"
    text = fetch_text(url)

    print("Parsing text...")
    data = parse_meditations(text)

    print(f"Found {len(data['sections'])} sections across 12 books")

    # Show breakdown by book
    for book in range(1, 13):
        count = len([s for s in data['sections'] if s['book'] == book])
        print(f"  Book {book}: {count} sections")

    # Save to file
    output_path = Path(__file__).parent.parent / 'texts' / 'meditations.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\nSaved to {output_path}")


if __name__ == '__main__':
    main()
