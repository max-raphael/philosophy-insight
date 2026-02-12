#!/usr/bin/env python3
"""
Generic Gutenberg parser that auto-detects text structure.
Handles: BOOK/CHAPTER/PART divisions, numbered sections, and fallback paragraph chunking.
"""

import json
import re
import urllib.request
from pathlib import Path
from dataclasses import dataclass
from typing import Optional


@dataclass
class TextConfig:
    """Configuration for a text to import."""
    gutenberg_id: int
    id: str
    title: str
    author: str
    year: str
    description: str
    category: str  # ancient, medieval, enlightenment, modern
    translator: Optional[str] = None
    structure_hint: Optional[str] = None  # 'book', 'chapter', 'part', 'section', 'paragraph'


def fetch_text(gutenberg_id: int) -> str:
    """Fetch text from Project Gutenberg."""
    url = f"https://www.gutenberg.org/cache/epub/{gutenberg_id}/pg{gutenberg_id}.txt"
    print(f"  Fetching from {url}")
    with urllib.request.urlopen(url) as response:
        return response.read().decode('utf-8', errors='replace')


def strip_gutenberg_boilerplate(text: str) -> str:
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


def roman_to_int(roman: str) -> int:
    """Convert Roman numeral to integer."""
    values = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}
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


def word_to_int(word: str) -> Optional[int]:
    """Convert word number to integer (FIRST -> 1, etc.)."""
    words = {
        'FIRST': 1, 'SECOND': 2, 'THIRD': 3, 'FOURTH': 4, 'FIFTH': 5,
        'SIXTH': 6, 'SEVENTH': 7, 'EIGHTH': 8, 'NINTH': 9, 'TENTH': 10,
        'ELEVENTH': 11, 'TWELFTH': 12, 'ONE': 1, 'TWO': 2, 'THREE': 3,
        'FOUR': 4, 'FIVE': 5, 'SIX': 6, 'SEVEN': 7, 'EIGHT': 8, 'NINE': 9,
        'TEN': 10, 'ELEVEN': 11, 'TWELVE': 12,
    }
    return words.get(word.upper())


def detect_structure(text: str) -> dict:
    """
    Detect the structural pattern of the text.
    Returns dict with 'type' and 'markers' list.
    """
    lines = text.split('\n')
    text_length = len(text)

    # Structure patterns to detect (in priority order)
    patterns = [
        # "BOOK I", "BOOK ONE", "THE FIRST BOOK", "BOOK 1" (optionally with title after)
        (r'^\s*(THE\s+)?(\w+\s+)?BOOK\s*([IVXLC]+|\d+|ONE|TWO|THREE|FOUR|FIVE|SIX|SEVEN|EIGHT|NINE|TEN|ELEVEN|TWELVE)[\.\:\s]', 'book'),
        # "CHAPTER I", "CHAPTER 1", "CHAPTER ONE" (optionally with title after)
        (r'^\s*CHAPTER\s+([IVXLC]+|\d+|\w+)[\.\:\s]', 'chapter'),
        # "PART I", "PART ONE", "PART 1" (optionally with title after)
        (r'^\s*PART\s+([IVXLC]+|\d+|\w+)[\.\:\s]', 'part'),
        # "SECTION I", "SECTION 1"
        (r'^\s*SECTION\s+([IVXLC]+|\d+)[\.\:\s]', 'section'),
    ]

    markers = []
    detected_type = None

    for i, line in enumerate(lines):
        for pattern, struct_type in patterns:
            match = re.match(pattern, line.strip(), re.IGNORECASE)
            if match:
                # Extract the number/identifier
                groups = match.groups()
                num_str = groups[-1] if groups else None

                # Convert to integer
                num = None
                if num_str:
                    if num_str.isdigit():
                        num = int(num_str)
                    elif re.match(r'^[IVXLC]+$', num_str, re.IGNORECASE):
                        num = roman_to_int(num_str)
                    else:
                        num = word_to_int(num_str)

                if num:
                    markers.append({
                        'line': i,
                        'type': struct_type,
                        'number': num,
                        'raw': line.strip()
                    })
                    if detected_type is None:
                        detected_type = struct_type
                break

    # Filter to only the primary structure type
    if detected_type in ('book', 'chapter', 'part'):
        markers = [m for m in markers if m['type'] == detected_type]

    # Filter out TOC entries: if markers are within 10 lines of each other, keep only the later ones
    # (TOC entries are typically consecutive, actual content markers are far apart)
    if len(markers) > 1:
        filtered_markers = []
        i = 0
        while i < len(markers):
            # Look ahead to see if there's a cluster of consecutive markers (TOC)
            cluster_end = i
            while cluster_end + 1 < len(markers) and markers[cluster_end + 1]['line'] - markers[cluster_end]['line'] < 20:
                cluster_end += 1

            # If this is a cluster (consecutive entries), skip them - they're TOC
            # Otherwise, keep this marker
            if cluster_end > i:
                # This is a TOC cluster, skip it
                i = cluster_end + 1
            else:
                filtered_markers.append(markers[i])
                i += 1

        markers = filtered_markers

    # If we found very few markers for a large text, fall back to paragraphs
    # But be lenient - even 3-5 major divisions is fine for a large text
    if markers and len(markers) < 2 and text_length > 30000:
        print(f"  Warning: Only {len(markers)} markers for {text_length:,} chars, falling back to paragraphs")
        return {'type': 'paragraph', 'markers': []}

    return {
        'type': detected_type or 'paragraph',
        'markers': markers
    }


def parse_by_markers(text: str, markers: list, structure_type: str) -> list:
    """Parse text into sections based on detected markers."""
    lines = text.split('\n')
    sections = []

    if not markers:
        return parse_by_paragraphs(text)

    # Sort markers by line number
    markers = sorted(markers, key=lambda m: m['line'])

    # Find end of text
    end_line = len(lines)

    for idx, marker in enumerate(markers):
        start_line = marker['line'] + 1  # Skip the marker line itself

        # Determine end of this section
        if idx + 1 < len(markers):
            section_end = markers[idx + 1]['line']
        else:
            section_end = end_line

        # Extract text
        section_lines = lines[start_line:section_end]
        section_text = '\n'.join(section_lines)

        # For book/chapter/part structures, split further into subsections
        if structure_type in ('book', 'chapter', 'part'):
            subsections = split_into_subsections(section_text, marker['number'])
            sections.extend(subsections)
        else:
            # For numbered sections, each marker is already a section
            content = clean_content(section_text)
            if content and len(content) >= 20:
                sections.append({
                    'book': 1,
                    'number': marker['number'],
                    'content': content
                })

    return sections


def split_into_subsections(text: str, book_num: int) -> list:
    """
    Split a book/chapter into subsections.
    First try to detect numbered subsections, then fall back to paragraphs.
    """
    sections = []

    # Try to find numbered subsections within the book (1. 2. 3. or I. II. III.)
    # Roman numeral pattern
    roman_parts = re.split(r'\n([IVXLC]+)\.\s+', '\n' + text)
    if len(roman_parts) > 3:  # At least 2 sections found
        i = 1
        while i < len(roman_parts) - 1:
            num = roman_to_int(roman_parts[i])
            content = clean_content(roman_parts[i + 1])
            if content and len(content) >= 20:
                sections.append({
                    'book': book_num,
                    'number': num,
                    'content': content
                })
            i += 2
        return sections

    # Try Arabic numeral pattern
    arabic_parts = re.split(r'\n(\d+)\.\s+', '\n' + text)
    if len(arabic_parts) > 3:
        i = 1
        while i < len(arabic_parts) - 1:
            num = int(arabic_parts[i])
            content = clean_content(arabic_parts[i + 1])
            if content and len(content) >= 20:
                sections.append({
                    'book': book_num,
                    'number': num,
                    'content': content
                })
            i += 2
        return sections

    # Fall back to paragraph chunking
    paragraphs = re.split(r'\n\s*\n', text)
    TARGET_SIZE = 600  # Target characters per section

    section_num = 0
    current_content = []
    current_length = 0

    for para in paragraphs:
        content = clean_content(para)
        if not content or len(content) < 20:
            continue

        if current_length + len(content) < TARGET_SIZE:
            current_content.append(content)
            current_length += len(content)
        else:
            if current_content:
                section_num += 1
                sections.append({
                    'book': book_num,
                    'number': section_num,
                    'content': '\n\n'.join(current_content)
                })
            current_content = [content]
            current_length = len(content)

    # Don't forget the last section
    if current_content:
        section_num += 1
        sections.append({
            'book': book_num,
            'number': section_num,
            'content': '\n\n'.join(current_content)
        })

    return sections


def parse_by_paragraphs(text: str, target_size: int = 600) -> list:
    """Fall back parser: split by paragraphs and chunk to target size."""
    paragraphs = re.split(r'\n\s*\n', text)
    sections = []

    section_num = 0
    current_content = []
    current_length = 0

    for para in paragraphs:
        content = clean_content(para)
        if not content or len(content) < 20:
            continue

        if current_length + len(content) < target_size:
            current_content.append(content)
            current_length += len(content)
        else:
            if current_content:
                section_num += 1
                sections.append({
                    'book': 1,
                    'number': section_num,
                    'content': '\n\n'.join(current_content)
                })
            current_content = [content]
            current_length = len(content)

    if current_content:
        section_num += 1
        sections.append({
            'book': 1,
            'number': section_num,
            'content': '\n\n'.join(current_content)
        })

    return sections


def clean_content(text: str) -> str:
    """Clean up section content."""
    # Collapse multiple spaces/newlines
    text = re.sub(r'\s+', ' ', text)
    text = text.strip()
    return text


def import_text(config: TextConfig) -> dict:
    """
    Import a text from Gutenberg using auto-detection.
    """
    print(f"\nImporting: {config.title} by {config.author}")

    # Fetch
    raw_text = fetch_text(config.gutenberg_id)
    print(f"  Fetched {len(raw_text):,} characters")

    # Strip boilerplate
    text = strip_gutenberg_boilerplate(raw_text)
    print(f"  After stripping: {len(text):,} characters")

    # Detect structure
    if config.structure_hint:
        structure = {'type': config.structure_hint, 'markers': []}
        # Re-detect with hint
        detected = detect_structure(text)
        if detected['type'] == config.structure_hint:
            structure = detected
    else:
        structure = detect_structure(text)

    print(f"  Detected structure: {structure['type']} ({len(structure['markers'])} markers)")

    # Parse
    if structure['markers']:
        sections = parse_by_markers(text, structure['markers'], structure['type'])
    else:
        sections = parse_by_paragraphs(text)

    print(f"  Parsed {len(sections)} sections")

    # Build result
    result = {
        'id': config.id,
        'title': config.title,
        'author': config.author,
        'year': config.year,
        'description': config.description,
        'category': config.category,
        'sections': sections
    }

    if config.translator:
        result['translator'] = config.translator

    return result


def save_text(data: dict, output_dir: Path):
    """Save parsed text to JSON file."""
    output_path = output_dir / f"{data['id']}.json"
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"  Saved to {output_path}")


def main():
    """Test with multiple texts."""
    test_configs = [
        TextConfig(
            gutenberg_id=59,
            id='discourse-on-method',
            title='Discourse on Method',
            author='René Descartes',
            translator='John Veitch',
            year='1637',
            description="Descartes' foundational work introducing systematic doubt and the famous 'cogito ergo sum'.",
            category='enlightenment',
        ),
        TextConfig(
            gutenberg_id=1232,
            id='the-prince',
            title='The Prince',
            author='Niccolò Machiavelli',
            translator='W. K. Marriott',
            year='1532',
            description="The foundational text of modern political philosophy, examining power, statecraft, and the nature of political leadership.",
            category='enlightenment',
        ),
        TextConfig(
            gutenberg_id=3800,
            id='ethics',
            title='Ethics',
            author='Baruch Spinoza',
            translator='R. H. M. Elwes',
            year='1677',
            description="Spinoza's masterwork presenting a comprehensive philosophical system using geometric method, exploring God, mind, emotions, and human freedom.",
            category='enlightenment',
        ),
    ]

    config = test_configs[2]  # Test Ethics

    output_dir = Path(__file__).parent.parent / 'texts'
    output_dir.mkdir(exist_ok=True)

    data = import_text(config)
    save_text(data, output_dir)

    # Show preview
    print(f"\nPreview of first 3 sections:")
    for s in data['sections'][:3]:
        preview = s['content'][:150] + '...' if len(s['content']) > 150 else s['content']
        print(f"  Book {s['book']}, Section {s['number']}: {preview}\n")


if __name__ == '__main__':
    main()
