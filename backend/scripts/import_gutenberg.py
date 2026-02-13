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
    category: str  # ancient, medieval, enlightenment, modern, chinese, indian, buddhist, sufi
    translator: Optional[str] = None
    structure_hint: Optional[str] = None  # 'book', 'chapter', 'part', 'section', 'paragraph'
    structure_depth: int = 1  # How many nested levels to parse (2 = BOOK > CHAPTER)
    strip_end_markers: bool = False  # Remove "HERE ENDETH CHAPTER" patterns


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


def is_header_line(line: str, match_end: int) -> bool:
    """
    Check if a line is truly a header vs a sentence that starts with BOOK/CHAPTER.
    A header line either:
    - Ends shortly after the match (possibly with title)
    - Doesn't continue into a sentence (lowercase text following)
    """
    remainder = line[match_end:].strip()

    # If nothing after, it's a header
    if not remainder:
        return True

    # If very short remainder, it's likely a header with title
    if len(remainder) < 50:
        return True

    # If remainder starts with lowercase, it's a sentence, not a header
    if remainder and remainder[0].islower():
        return False

    # If remainder has sentence-like structure (lowercase after first word), not a header
    words = remainder.split()
    if len(words) > 2 and any(w[0].islower() for w in words[1:4] if w):
        return False

    return True


def detect_structure(text: str) -> dict:
    """
    Detect the structural pattern of the text.
    Returns dict with 'type' and 'markers' list.
    """
    lines = text.split('\n')
    text_length = len(text)

    # Structure patterns to detect (in priority order)
    # These patterns are stricter - they end with [\.\:]? to allow optional punctuation
    # but we separately verify the line is a header (not a sentence)
    patterns = [
        # "BOOK I", "BOOK ONE", "THE FIRST BOOK", "BOOK 1"
        # The optional word before BOOK must be an ordinal (FIRST, SECOND, etc.), not arbitrary words
        (r'^\s*(THE\s+)?(FIRST|SECOND|THIRD|FOURTH|FIFTH|SIXTH|SEVENTH|EIGHTH|NINTH|TENTH|ELEVENTH|TWELFTH)?\s*BOOK\s*([IVXLC]+|\d+|ONE|TWO|THREE|FOUR|FIVE|SIX|SEVEN|EIGHT|NINE|TEN|ELEVEN|TWELVE)?[\.\:]?\s*', 'book'),
        # "CHAPTER I", "CHAPTER 1", "CHAPTER ONE"
        (r'^\s*CHAPTER\s+([IVXLC]+|\d+|\w+)[\.\:]?\s*', 'chapter'),
        # "PART I", "PART ONE", "PART 1"
        (r'^\s*PART\s+([IVXLC]+|\d+|\w+)[\.\:]?\s*', 'part'),
        # "SECTION I", "SECTION 1"
        (r'^\s*SECTION\s+([IVXLC]+|\d+)[\.\:]?\s*', 'section'),
    ]

    markers = []
    detected_type = None

    for i, line in enumerate(lines):
        stripped = line.strip()
        for pattern, struct_type in patterns:
            match = re.match(pattern, stripped, re.IGNORECASE)
            if match:
                # Verify this is actually a header, not a sentence
                if not is_header_line(stripped, match.end()):
                    continue

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
                        'raw': stripped
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


def parse_by_markers(text: str, markers: list, structure_type: str, depth: int = 1) -> list:
    """
    Parse text into sections based on detected markers.

    Args:
        text: The text to parse
        markers: List of detected structure markers
        structure_type: Type of structure ('book', 'chapter', 'part', 'section')
        depth: How many nested levels to parse (2 = parse CHAPTER within BOOK)
    """
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

        # For book/chapter/part structures with depth > 1, try to detect nested structure
        if structure_type in ('book', 'chapter', 'part') and depth > 1:
            nested_structure = detect_structure(section_text)
            if nested_structure['markers'] and len(nested_structure['markers']) >= 2:
                # Found nested structure (e.g., CHAPTERs within a BOOK)
                # Recursively parse with reduced depth
                nested_sections = parse_by_markers(
                    section_text,
                    nested_structure['markers'],
                    nested_structure['type'],
                    depth - 1
                )
                # Update book numbers to reflect the parent marker
                for s in nested_sections:
                    s['book'] = marker['number']
                sections.extend(nested_sections)
                continue

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


def try_split_by_pattern(text: str, book_num: int, pattern: str, num_extractor) -> list:
    """
    Try to split text by a regex pattern.
    Returns list of sections if successful (>= 2 sections), empty list otherwise.

    Args:
        text: The text to split
        book_num: Book number for the sections
        pattern: Regex pattern with a capture group for the section number
        num_extractor: Function to convert captured string to int
    """
    sections = []
    parts = re.split(pattern, '\n' + text)

    if len(parts) > 3:  # At least 2 sections found (intro, num1, content1, num2, content2...)
        # Handle any content before the first marker
        intro = clean_content(parts[0])
        if intro and len(intro) >= 50:
            # There's substantial content before the first marker - include it
            sections.append({
                'book': book_num,
                'number': 0,
                'content': intro
            })

        i = 1
        while i < len(parts) - 1:
            num_str = parts[i]
            content_str = parts[i + 1]

            num = num_extractor(num_str)
            content = clean_content(content_str)

            if num and content and len(content) >= 20:
                sections.append({
                    'book': book_num,
                    'number': num,
                    'content': content
                })
            i += 2

        # Only return if we found meaningful sections
        if len(sections) >= 2:
            return sections

    return []


def split_into_subsections(text: str, book_num: int) -> list:
    """
    Split a book/chapter into subsections.
    Tries multiple patterns in order of specificity, then falls back to paragraphs.
    """
    sections = []

    # Pattern definitions: (regex_pattern, number_extractor_function, description)
    # Patterns are tried in order - more specific patterns first
    # Note: \s* after \n allows for indented markers (common in Gutenberg texts)
    split_patterns = [
        # § symbol patterns (common in academic texts)
        # Matches: § 1. , §1. , § 1 , §1 (followed by space/text)
        (r'\n\s*§\s*(\d+)\.?\s+', lambda s: int(s), '§ arabic'),
        (r'\n\s*§\s*([IVXLC]+)\.?\s+', roman_to_int, '§ roman'),

        # CHAPTER/CHAP patterns (may be indented)
        # Matches: CHAPTER I. , CHAPTER 1. , CHAP. I. , CHAP. 1. , CHAP I. , CHAP 1.
        (r'\n\s*CHAPTER\s+([IVXLC]+)\.?[\s\-—:]', roman_to_int, 'CHAPTER roman'),
        (r'\n\s*CHAPTER\s+(\d+)\.?[\s\-—:]', lambda s: int(s), 'CHAPTER arabic'),
        (r'\n\s*CHAP\.?\s+([IVXLC]+)\.?\s+', roman_to_int, 'CHAP roman'),
        (r'\n\s*CHAP\.?\s+(\d+)\.?\s+', lambda s: int(s), 'CHAP arabic'),

        # SECTION patterns
        (r'\n\s*SECTION\s+([IVXLC]+)\.?\s+', roman_to_int, 'SECTION roman'),
        (r'\n\s*SECTION\s+(\d+)\.?\s+', lambda s: int(s), 'SECTION arabic'),

        # Simple Roman numeral at start of line (existing pattern, but more restrictive)
        # Must be followed by period and space to avoid matching mid-word
        (r'\n\s*([IVXLC]+)\.\s+', roman_to_int, 'roman numeral'),

        # Simple Arabic numeral at start of line
        (r'\n\s*(\d+)\.\s+', lambda s: int(s), 'arabic numeral'),
    ]

    for pattern, extractor, desc in split_patterns:
        sections = try_split_by_pattern(text, book_num, pattern, extractor)
        if sections:
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
    """
    Fall back parser: first try pattern-based splitting, then chunk by paragraphs.
    This is used when no top-level structure (BOOK/CHAPTER/PART) is detected.
    """
    # First, try to split by subsection patterns (§, CHAPTER, etc.)
    sections = split_into_subsections(text, book_num=1)
    if sections:
        return sections

    # If no patterns found, fall back to paragraph chunking
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


def strip_end_marker_content(content: str) -> str:
    """
    Remove "HERE ENDETH CHAPTER" and similar end-of-chapter markers.
    These are traditional markers found in texts like Bhagavad Gita.
    """
    # Pattern matches: HERE ENDETH CHAPTER I., HERE ENDS CHAPTER XII., etc.
    # Also matches the title that often follows: "Entitled 'Arjun-Vishad'"
    pattern = r'\s*HERE\s+END(?:ETH|S)\s+(?:CHAPTER|BOOK|SECTION)\s+[IVXLC\d]+\.?[^.]*(?:\.|$)'
    return re.sub(pattern, '', content, flags=re.IGNORECASE).strip()


def is_table_of_contents(content: str) -> bool:
    """
    Detect if content is a table of contents.
    TOC sections have many chapter/section references in a small space.
    """
    # Count chapter-like references
    chapter_refs = re.findall(r'Chapter\s+[IVXLC\d]+', content, re.IGNORECASE)
    part_refs = re.findall(r'Part\s+[IVXLC\d]+', content, re.IGNORECASE)
    section_refs = re.findall(r'Section\s+[IVXLC\d]+', content, re.IGNORECASE)

    total_refs = len(chapter_refs) + len(part_refs) + len(section_refs)

    # High density of structure references = likely TOC
    # More than 5 refs in less than 3000 chars is suspicious
    if total_refs >= 5 and len(content) < 3000:
        return True

    # Or just check for very high density
    if len(content) > 0:
        density = total_refs / len(content) * 1000  # refs per 1000 chars
        if density > 3:  # more than 3 refs per 1000 chars
            return True

    return False


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
        sections = parse_by_markers(
            text,
            structure['markers'],
            structure['type'],
            depth=config.structure_depth
        )
    else:
        sections = parse_by_paragraphs(text)

    # Apply end marker stripping if configured
    if config.strip_end_markers:
        for section in sections:
            section['content'] = strip_end_marker_content(section['content'])

    # Filter out table of contents sections
    original_count = len(sections)
    sections = [s for s in sections if not is_table_of_contents(s['content'])]
    if len(sections) < original_count:
        print(f"  Filtered {original_count - len(sections)} TOC sections")

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
