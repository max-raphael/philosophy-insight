#!/usr/bin/env python3
"""
Parse the Republic (Jowett translation) from Project Gutenberg.
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


def parse_republic(text: str) -> dict:
    """Parse Jowett's Republic translation into JSON format."""

    # Find the start of the actual dialogue (after the introduction)
    # The dialogue starts with " BOOK I." on its own line after the intro
    lines = text.split('\n')

    # Find line indices for all BOOK markers in the dialogue section
    # The dialogue section starts after the introduction (around line 8600+)
    book_starts = []

    for i, line in enumerate(lines):
        # Look for " BOOK X." pattern (with leading space, standalone line)
        match = re.match(r'^\s*BOOK ([IVX]+)\.\s*$', line)
        if match:
            book_num = roman_to_int(match.group(1))
            # The dialogue section has books appearing at higher line numbers
            # (the intro section has them mixed with text)
            if i > 8000:  # Dialogue section
                book_starts.append((i, book_num))

    if not book_starts:
        raise ValueError("Could not find dialogue section")

    # Find end of text (Gutenberg end marker)
    end_idx = len(lines)
    for i, line in enumerate(lines):
        if '*** END OF THE PROJECT GUTENBERG EBOOK' in line:
            end_idx = i
            break

    sections = []
    TARGET_SIZE = 400  # Target chars per section (similar to Meditations)

    # Process each book
    for idx, (start_line, book_num) in enumerate(book_starts):
        # Determine end of this book
        if idx + 1 < len(book_starts):
            end_line = book_starts[idx + 1][0]
        else:
            end_line = end_idx

        # Extract book text (skip the BOOK header line)
        book_lines = lines[start_line + 1:end_line]
        book_text = '\n'.join(book_lines)

        # Split into paragraphs (by blank lines)
        paragraphs = re.split(r'\n\s*\n', book_text)

        # Clean and filter paragraphs
        clean_paragraphs = []
        for para in paragraphs:
            content = para.strip()
            content = re.sub(r'\s+', ' ', content)
            if len(content) >= 20:
                clean_paragraphs.append(content)

        # Combine short paragraphs into larger sections
        section_num = 0
        current_content = []
        current_length = 0

        for para in clean_paragraphs:
            # If adding this paragraph keeps us under target, accumulate
            if current_length + len(para) < TARGET_SIZE:
                current_content.append(para)
                current_length += len(para)
            else:
                # Save current section if we have content
                if current_content:
                    section_num += 1
                    sections.append({
                        'book': book_num,
                        'number': section_num,
                        'content': '\n\n'.join(current_content)
                    })
                # Start new section with this paragraph
                current_content = [para]
                current_length = len(para)

        # Don't forget the last section
        if current_content:
            section_num += 1
            sections.append({
                'book': book_num,
                'number': section_num,
                'content': '\n\n'.join(current_content)
            })

    return {
        'id': 'republic',
        'title': 'Republic',
        'author': 'Plato',
        'translator': 'Benjamin Jowett',
        'year': 'c. 375 BCE',
        'description': "Plato's masterwork exploring justice, the ideal state, and the nature of the soul through Socratic dialogue. Features the famous Allegory of the Cave and the theory of Forms.",
        'category': 'ancient',
        'sections': sections
    }


def main():
    print("Fetching Republic (Jowett translation) from Project Gutenberg...")
    url = "https://www.gutenberg.org/cache/epub/1497/pg1497.txt"
    text = fetch_text(url)

    print("Parsing text...")
    data = parse_republic(text)

    print(f"Found {len(data['sections'])} sections across {max(s['book'] for s in data['sections'])} books")

    # Show breakdown by book
    max_book = max(s['book'] for s in data['sections'])
    for book in range(1, max_book + 1):
        count = len([s for s in data['sections'] if s['book'] == book])
        print(f"  Book {book}: {count} sections")

    # Save to file
    output_path = Path(__file__).parent.parent / 'texts' / 'republic.json'
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
