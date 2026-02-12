#!/usr/bin/env python3
"""
Parse On Liberty (Mill) from Project Gutenberg.
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


def parse_on_liberty(text: str) -> dict:
    """Parse On Liberty into JSON format."""

    lines = text.split('\n')

    # Find chapter boundaries (actual text, not TOC)
    # The actual chapters start around line 495+
    chapter_starts = []
    chapter_titles = {
        1: 'Introductory',
        2: 'Of the Liberty of Thought and Discussion',
        3: 'Of Individuality, as One of the Elements of Well-Being',
        4: 'Of the Limits to the Authority of Society over the Individual',
        5: 'Applications'
    }

    for i, line in enumerate(lines):
        match = re.match(r'^CHAPTER ([IVX]+)\.\s*$', line.strip())
        if match and i > 480:  # Skip TOC
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

    sections = []
    TARGET_SIZE = 400

    # Process each chapter
    for idx, (start_line, chapter_num) in enumerate(chapter_starts):
        # Determine end of this chapter
        if idx + 1 < len(chapter_starts):
            end_line = chapter_starts[idx + 1][0]
        else:
            end_line = end_idx

        # Extract chapter text (skip the chapter header and title line)
        chapter_lines = lines[start_line + 1:end_line]
        chapter_text = '\n'.join(chapter_lines)

        # Skip chapter title if present (all caps line)
        chapter_text = re.sub(r'^[A-Z][A-Z\s,\-\']+\n+', '', chapter_text)

        # Split into paragraphs
        paragraphs = re.split(r'\n\s*\n', chapter_text)

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
                        'book': chapter_num,
                        'number': section_num,
                        'content': '\n\n'.join(current_content)
                    })
                current_content = [para]
                current_length = len(para)

        # Don't forget the last section
        if current_content:
            section_num += 1
            sections.append({
                'book': chapter_num,
                'number': section_num,
                'content': '\n\n'.join(current_content)
            })

    return {
        'id': 'on-liberty',
        'title': 'On Liberty',
        'author': 'John Stuart Mill',
        'year': '1859',
        'description': "Mill's classic defense of individual freedom against the tyranny of the majority. A foundational text in political liberalism exploring the limits of authority over the individual.",
        'category': 'modern',
        'sections': sections
    }


def main():
    print("Fetching On Liberty from Project Gutenberg...")
    url = "https://www.gutenberg.org/cache/epub/34901/pg34901.txt"
    text = fetch_text(url)

    print("Parsing text...")
    data = parse_on_liberty(text)

    print(f"Found {len(data['sections'])} sections across {max(s['book'] for s in data['sections'])} chapters")

    # Show breakdown by chapter
    max_chapter = max(s['book'] for s in data['sections'])
    for chapter in range(1, max_chapter + 1):
        count = len([s for s in data['sections'] if s['book'] == chapter])
        print(f"  Chapter {chapter}: {count} sections")

    # Save to file
    output_path = Path(__file__).parent.parent / 'texts' / 'on-liberty.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\nSaved to {output_path}")

    # Show first few sections as preview
    print("\nPreview of first 3 sections:")
    for s in data['sections'][:3]:
        preview = s['content'][:100] + '...' if len(s['content']) > 100 else s['content']
        print(f"  Chapter {s['book']}, Section {s['number']}: {preview}")


if __name__ == '__main__':
    main()
