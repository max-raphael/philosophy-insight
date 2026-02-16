#!/usr/bin/env python3
"""
Summarize a text JSON file for audit review.
Outputs a compact summary (~30-40 lines) that an agent can use to judge quality.
"""

import json
import re
import sys
from collections import defaultdict

def summarize_text(filepath: str) -> str:
    """Generate a compact summary of a text JSON file."""

    with open(filepath) as f:
        data = json.load(f)

    text_id = data.get('id', 'unknown')
    title = data.get('title', 'Unknown')
    author = data.get('author', 'Unknown')
    category = data.get('category', 'unknown')
    sections = data.get('sections', [])

    lines = []
    lines.append(f"Text: {title} by {author}")
    lines.append(f"ID: {text_id}")
    lines.append(f"Category: {category}")

    total_chars = sum(len(s.get('content', '')) for s in sections)
    lines.append(f"Sections: {len(sections)} | Total chars: {total_chars:,}")
    lines.append("")

    # Structure analysis
    lines.append("Structure:")
    books_found = sorted(set(s.get('book', 0) for s in sections))
    lines.append(f"  Books found: {books_found}")

    # Sections per book
    sections_per_book = defaultdict(int)
    for s in sections:
        sections_per_book[s.get('book', 0)] += 1
    lines.append(f"  Sections per book: {dict(sections_per_book)}")

    # Check ordering
    ordering_issues = []
    prev_book = -1
    prev_num = -1
    for i, s in enumerate(sections):
        book = s.get('book', 0)
        num = s.get('number', 0)
        if book < prev_book:
            ordering_issues.append(f"section {i}: book {book} after book {prev_book}")
        elif book == prev_book and num < prev_num and num != 0:
            ordering_issues.append(f"section {i}: ch {num} after ch {prev_num}")
        prev_book = book
        prev_num = num

    if ordering_issues:
        lines.append(f"  Ordering: OUT OF ORDER - {ordering_issues[:3]}")
        if len(ordering_issues) > 3:
            lines.append(f"    ... and {len(ordering_issues) - 3} more ordering issues")
    else:
        lines.append("  Ordering: sequential ✓")

    lines.append("")

    # Section length analysis
    lines.append("Section lengths:")
    if sections:
        lengths = [(i, len(s.get('content', ''))) for i, s in enumerate(sections)]
        min_len = min(lengths, key=lambda x: x[1])
        max_len = max(lengths, key=lambda x: x[1])
        avg_len = total_chars // len(sections) if sections else 0

        lines.append(f"  Min: {min_len[1]} chars (section {min_len[0]})")
        lines.append(f"  Max: {max_len[1]} chars (section {max_len[0]})")
        lines.append(f"  Avg: {avg_len} chars")

    lines.append("")

    # Short sections (potential TOC entries)
    short_sections = []
    for i, s in enumerate(sections):
        content = s.get('content', '')
        if len(content) < 100:
            book = s.get('book', 0)
            num = s.get('number', 0)
            preview = content[:60].replace('\n', ' ')
            short_sections.append((i, book, num, len(content), preview))

    lines.append(f"Short sections (<100 chars): {len(short_sections)} found")
    for i, book, num, length, preview in short_sections[:5]:
        lines.append(f"  - Section {i} (Book {book}, #{num}): \"{preview}\" [{length} chars]")
    if len(short_sections) > 5:
        lines.append(f"  ... and {len(short_sections) - 5} more short sections")

    lines.append("")

    # Long sections
    long_sections = [(i, len(s.get('content', ''))) for i, s in enumerate(sections) if len(s.get('content', '')) > 10000]
    if long_sections:
        lines.append(f"Long sections (>10000 chars): {len(long_sections)} found")
        for i, length in long_sections[:3]:
            lines.append(f"  - Section {i}: {length:,} chars")
    else:
        lines.append("Long sections (>10000 chars): None")

    lines.append("")

    # Preview first 3 sections
    lines.append("First 3 sections (preview):")
    for i, s in enumerate(sections[:3]):
        book = s.get('book', 0)
        num = s.get('number', 0)
        content = s.get('content', '')[:80].replace('\n', ' ')
        lines.append(f"  [{i}] Book {book}, #{num}: \"{content}...\"")

    lines.append("")

    # Preview last 3 sections
    lines.append("Last 3 sections (preview):")
    for i, s in enumerate(sections[-3:], start=max(0, len(sections)-3)):
        book = s.get('book', 0)
        num = s.get('number', 0)
        content = s.get('content', '')[:80].replace('\n', ' ')
        lines.append(f"  [{i}] Book {book}, #{num}: \"{content}...\"")

    lines.append("")

    # Potential issues detection
    lines.append("Potential issues detected:")
    issues = []

    # Check for ALL CAPS + number patterns (TOC entries)
    toc_pattern = re.compile(r'^[A-Z][A-Z\s\-]+\s+\d{1,3}\s*$')
    toc_like = []
    for i, s in enumerate(sections):
        content = s.get('content', '')
        first_line = content.split('\n')[0].strip() if content else ''
        if toc_pattern.match(first_line):
            toc_like.append((i, first_line))
    if toc_like:
        issues.append(f"{len(toc_like)} sections start with ALL CAPS + number pattern (possible TOC entries)")
        for idx, line in toc_like[:3]:
            issues.append(f"    Section {idx}: \"{line}\"")

    # Check for headers in content
    header_pattern = re.compile(r'^(INTRODUCTION|PREFACE|FOREWORD|CONTENTS|TABLE OF CONTENTS)', re.IGNORECASE)
    header_sections = []
    for i, s in enumerate(sections):
        content = s.get('content', '').strip()
        if header_pattern.match(content):
            header_sections.append((i, content[:40]))
    if header_sections:
        issues.append(f"{len(header_sections)} sections start with header-like text")
        for idx, preview in header_sections[:2]:
            issues.append(f"    Section {idx}: \"{preview}...\"")

    # Check for chapter titles in content
    chapter_pattern = re.compile(r'^(CHAPTER|BOOK|PART|SECTION)\s+[IVXLC\d]+', re.IGNORECASE)
    chapter_title_sections = []
    for i, s in enumerate(sections):
        content = s.get('content', '').strip()
        if chapter_pattern.match(content):
            chapter_title_sections.append((i, content[:50]))
    if chapter_title_sections:
        issues.append(f"{len(chapter_title_sections)} sections start with chapter/book markers")
        for idx, preview in chapter_title_sections[:2]:
            issues.append(f"    Section {idx}: \"{preview}...\"")

    # Check for duplicates
    seen = {}
    duplicates = []
    for i, s in enumerate(sections):
        key = (s.get('book', 0), s.get('number', 0))
        if key in seen:
            duplicates.append((i, key, seen[key]))
        else:
            seen[key] = i
    if duplicates:
        issues.append(f"{len(duplicates)} duplicate book/chapter combinations found")
        for idx, key, first_idx in duplicates[:2]:
            issues.append(f"    Section {idx} duplicates section {first_idx} (Book {key[0]}, #{key[1]})")

    # Check for gaps in chapter numbering
    gaps = []
    for book in books_found:
        book_sections = sorted(set(s.get('number', 0) for s in sections if s.get('book', 0) == book))
        if len(book_sections) > 2:
            for i in range(1, len(book_sections)):
                gap = book_sections[i] - book_sections[i-1]
                if gap > 1 and gap < 10:  # Ignore large gaps (likely intentional)
                    gaps.append((book, book_sections[i-1], book_sections[i]))
    if gaps:
        issues.append(f"{len(gaps)} gaps in chapter numbering")
        for book, prev, next_ in gaps[:2]:
            issues.append(f"    Book {book}: chapters {prev} -> {next_}")

    if not issues:
        issues.append("None detected (text appears clean)")

    for issue in issues:
        lines.append(f"  - {issue}")

    return '\n'.join(lines)


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python summarize_text.py <path-to-text.json>")
        sys.exit(1)

    print(summarize_text(sys.argv[1]))
