"""
Text validation logic for the audit process.
Used by agents to check if a text has formatting issues.
"""

import json
import re
from typing import List, Tuple

def validate_text(filepath: str) -> Tuple[bool, List[str]]:
    """
    Validate a text JSON file for common formatting issues.

    Returns:
        (is_valid, issues) - True if no issues found, list of issue descriptions
    """
    issues = []

    with open(filepath) as f:
        data = json.load(f)

    sections = data.get('sections', [])

    if not sections:
        issues.append("NO_SECTIONS: Text has no sections")
        return False, issues

    # Check 1: Sections should be ordered
    prev_book = -1
    prev_num = -1
    for i, section in enumerate(sections):
        book = section.get('book', 0)
        num = section.get('number', 0)

        # Book should be >= previous book
        if book < prev_book:
            issues.append(f"OUT_OF_ORDER: Section {i} has book {book} after book {prev_book}")
        # If same book, number should be >= previous (allowing for 0-indexed intro sections)
        elif book == prev_book and num < prev_num and num != 0:
            issues.append(f"OUT_OF_ORDER: Section {i} has chapter {num} after chapter {prev_num} in book {book}")

        prev_book = book
        prev_num = num

    # Check 2: No very short sections (likely TOC entries)
    for i, section in enumerate(sections):
        content = section.get('content', '')
        if len(content) < 100:
            # Allow short sections if they look like legitimate short passages
            if not re.search(r'[a-z]{20,}', content.lower()):
                issues.append(f"TOO_SHORT: Section {i} (book {section.get('book')}, ch {section.get('number')}) has only {len(content)} chars: '{content[:50]}...'")

    # Check 3: Content starting with page numbers (TOC artifact)
    page_num_pattern = re.compile(r'^[A-Z][A-Z\s\-]+\s+\d{1,3}\s*$', re.MULTILINE)
    for i, section in enumerate(sections):
        content = section.get('content', '')
        first_line = content.split('\n')[0] if content else ''
        if page_num_pattern.match(first_line):
            issues.append(f"PAGE_NUMBER: Section {i} starts with TOC-style entry: '{first_line}'")

    # Check 4: Check for gaps in chapter numbering (within each book)
    books = {}
    for section in sections:
        book = section.get('book', 0)
        num = section.get('number', 0)
        if book not in books:
            books[book] = []
        books[book].append(num)

    for book, nums in books.items():
        nums_sorted = sorted(set(nums))
        if len(nums_sorted) > 2:
            for i in range(1, len(nums_sorted)):
                gap = nums_sorted[i] - nums_sorted[i-1]
                if gap > 1:
                    issues.append(f"GAP: Book {book} has gap in chapters: {nums_sorted[i-1]} -> {nums_sorted[i]}")

    # Check 5: Content shouldn't start with exact chapter title pattern
    chapter_title_pattern = re.compile(r'^(CHAPTER|BOOK|PART|SECTION)\s+[IVXLC\d]+\s*[\.\:\-]?\s*[A-Z]', re.IGNORECASE)
    for i, section in enumerate(sections):
        content = section.get('content', '').strip()
        if chapter_title_pattern.match(content):
            issues.append(f"TITLE_IN_CONTENT: Section {i} content starts with chapter marker: '{content[:60]}...'")

    # Check 6: Duplicate sections (same book + number appearing multiple times with different content)
    seen = {}
    for i, section in enumerate(sections):
        key = (section.get('book', 0), section.get('number', 0))
        if key in seen:
            prev_i = seen[key]
            issues.append(f"DUPLICATE: Section {i} duplicates book {key[0]}, chapter {key[1]} (first seen at section {prev_i})")
        else:
            seen[key] = i

    # Check 7: Sections too long (poor granularity - entire chapters as single sections)
    MAX_SECTION_CHARS = 5000  # ~800-1000 words, a few paragraphs
    WARN_SECTION_CHARS = 10000  # Definitely too long

    sizes = [len(s.get('content', '')) for s in sections]
    avg_size = sum(sizes) // len(sizes) if sizes else 0
    max_size = max(sizes) if sizes else 0

    if avg_size > WARN_SECTION_CHARS:
        issues.append(f"GRANULARITY_SEVERE: Average section size {avg_size:,} chars (should be <{MAX_SECTION_CHARS:,}). Text needs re-parsing at paragraph level.")
    elif avg_size > MAX_SECTION_CHARS:
        issues.append(f"GRANULARITY_POOR: Average section size {avg_size:,} chars (should be <{MAX_SECTION_CHARS:,}). Consider re-parsing.")

    # Check for single massive sections (even if average is ok)
    massive_sections = [(i, len(s.get('content', ''))) for i, s in enumerate(sections) if len(s.get('content', '')) > 50000]
    if massive_sections:
        for idx, size in massive_sections[:3]:  # Report up to 3
            issues.append(f"MASSIVE_SECTION: Section {idx} has {size:,} chars (entire chapter as one section)")

    # Check 8: Too few sections for content size (entire book as few sections)
    total_chars = sum(sizes)
    if len(sections) < 10 and total_chars > 100000:
        issues.append(f"TOO_FEW_SECTIONS: Only {len(sections)} sections for {total_chars:,} chars. Book likely parsed at chapter level, not paragraph level.")

    is_valid = len(issues) == 0
    return is_valid, issues


def get_text_info(filepath: str) -> dict:
    """Get basic info about a text file."""
    with open(filepath) as f:
        data = json.load(f)

    sections = data.get('sections', [])
    total_chars = sum(len(s.get('content', '')) for s in sections)

    return {
        'id': data.get('id', ''),
        'title': data.get('title', ''),
        'author': data.get('author', ''),
        'category': data.get('category', ''),
        'sections_count': len(sections),
        'total_chars': total_chars,
        'books': list(set(s.get('book', 0) for s in sections))
    }


if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1:
        filepath = sys.argv[1]
        is_valid, issues = validate_text(filepath)
        info = get_text_info(filepath)

        print(f"Text: {info['title']} by {info['author']}")
        print(f"Sections: {info['sections_count']}, Characters: {info['total_chars']:,}")
        print(f"Books: {info['books']}")
        print()

        if is_valid:
            print("✓ VALID - No issues found")
        else:
            print(f"✗ INVALID - {len(issues)} issue(s) found:")
            for issue in issues:
                print(f"  - {issue}")
    else:
        print("Usage: python validate_text.py <path-to-text.json>")
