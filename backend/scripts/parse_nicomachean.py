#!/usr/bin/env python3
"""
Parse Nicomachean Ethics from Project Gutenberg.
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


def parse_nicomachean(text: str) -> dict:
    """Parse Nicomachean Ethics into JSON format."""

    lines = text.split('\n')

    # Find book boundaries (actual text, not TOC or notes)
    # The actual text BOOK markers are at lines 860-9345 range
    book_starts = []

    for i, line in enumerate(lines):
        match = re.match(r'^BOOK ([IVX]+)\s*$', line.strip())
        if match and 800 < i < 10000:  # Actual text section
            book_num = roman_to_int(match.group(1))
            book_starts.append((i, book_num))

    if not book_starts:
        raise ValueError("Could not find book markers")

    # Find end of main text (before notes section)
    end_idx = 10300  # Notes start around 10337
    for i, line in enumerate(lines):
        if '*** END OF THE PROJECT GUTENBERG EBOOK' in line:
            end_idx = min(end_idx, i)
            break

    sections = []
    TARGET_SIZE = 400

    # Process each book
    for idx, (start_line, book_num) in enumerate(book_starts):
        # Determine end of this book
        if idx + 1 < len(book_starts):
            end_line = book_starts[idx + 1][0]
        else:
            end_line = end_idx

        # Extract book text
        book_lines = lines[start_line + 1:end_line]
        book_text = '\n'.join(book_lines)

        # Remove chapter markers to get clean text
        # Keep the text but remove "Chapter I.", "Chapter II.", etc.
        book_text = re.sub(r'\nChapter [IVX]+\.\n', '\n\n', book_text)

        # Split into paragraphs
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
            if current_length + len(para) < TARGET_SIZE:
                current_content.append(para)
                current_length += len(para)
            else:
                if current_content:
                    section_num += 1
                    sections.append({
                        'book': book_num,
                        'number': section_num,
                        'content': '\n\n'.join(current_content)
                    })
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
        'id': 'nicomachean-ethics',
        'title': 'Nicomachean Ethics',
        'author': 'Aristotle',
        'translator': 'W. D. Ross',
        'year': 'c. 340 BCE',
        'description': "Aristotle's most important work on ethics, exploring the nature of happiness, virtue, and the good life. Foundational to Western moral philosophy.",
        'category': 'ancient',
        'sections': sections
    }


def main():
    print("Fetching Nicomachean Ethics from Project Gutenberg...")
    url = "https://www.gutenberg.org/cache/epub/8438/pg8438.txt"
    text = fetch_text(url)

    print("Parsing text...")
    data = parse_nicomachean(text)

    print(f"Found {len(data['sections'])} sections across {max(s['book'] for s in data['sections'])} books")

    # Show breakdown by book
    max_book = max(s['book'] for s in data['sections'])
    for book in range(1, max_book + 1):
        count = len([s for s in data['sections'] if s['book'] == book])
        print(f"  Book {book}: {count} sections")

    # Save to file
    output_path = Path(__file__).parent.parent / 'texts' / 'nicomachean-ethics.json'
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
