#!/usr/bin/env python3
"""
Refined audit script that distinguishes between:
1. TRUE STRUCTURE MARKERS - should have been used to split text
   - Appear at start of section content
   - Appear after paragraph breaks (double newline in original)
   - Standalone on their own "line" within the collapsed content

2. CROSS-REFERENCES - legitimate content mentioning other parts
   - Appear mid-sentence ("see Book I, chap. ii")
   - Part of footnotes/citations
"""

import json
import re
from pathlib import Path
from collections import defaultdict
from dataclasses import dataclass
from typing import List, Tuple


@dataclass
class Issue:
    book: int
    section: int
    marker_type: str
    marker_text: str
    is_true_structure: bool
    snippet: str


def classify_marker(content: str, match: re.Match, marker_type: str) -> Tuple[bool, str]:
    """
    Determine if a marker is a true structure marker or a cross-reference.

    True structure markers:
    - At the very start of content
    - After what would have been a paragraph break
    - Preceded only by whitespace on the "line"

    Cross-references:
    - Preceded by words like "see", "in", "from", "(", etc.
    - Part of a flowing sentence
    """
    start = match.start()
    matched_text = match.group(0)

    # Get context before the match
    before = content[:start]
    after = content[start + len(matched_text):start + len(matched_text) + 50]

    # At the very start of content
    if start == 0 or before.strip() == '':
        return True, "at_start"

    # Check what comes immediately before
    # Strip trailing whitespace to find the last non-space char
    before_stripped = before.rstrip()
    if not before_stripped:
        return True, "after_whitespace_only"

    last_char = before_stripped[-1]

    # If preceded by sentence-ending punctuation, likely a new section
    if last_char in '.!?"\'':
        # But check if it's a cross-reference phrase
        last_words = before_stripped[-50:].lower()
        cross_ref_phrases = [
            'see ', 'in ', 'from ', 'cf. ', 'cf ', 'vide ',
            '(see ', '(in ', '(from ', '(cf. ',
            'above, ', 'below, ', 'ante, ', 'post, ',
            'discussed in ', 'mentioned in ', 'described in ',
            'refers to ', 'reference to ', 'cited in ',
        ]
        for phrase in cross_ref_phrases:
            if phrase in last_words:
                return False, f"cross_ref_phrase:{phrase.strip()}"

        # Check if followed by period and more content (likely a header)
        # vs followed by comma/colon (likely mid-sentence)
        after_stripped = after.lstrip()
        if after_stripped and after_stripped[0] in '.,;:—-':
            # Headers typically have a title after, not punctuation
            pass  # Continue to structural check

        return True, "after_sentence_end"

    # If preceded by opening paren, bracket, or citation markers
    if last_char in '([':
        return False, "in_parenthetical"

    # If preceded by comma, semicolon, colon - likely mid-sentence
    if last_char in ',;:':
        return False, "mid_sentence_punctuation"

    # If preceded by lowercase letter - definitely mid-sentence
    if before_stripped[-1:].islower():
        return False, "mid_word"

    # Check for common cross-reference patterns in the before context
    last_30 = before[-30:].lower()
    if any(p in last_30 for p in ['book ', 'chap', 'sect', 'part ', '§', 'page ']):
        # This might be a compound reference like "Book I, Chapter II"
        return False, "compound_reference"

    # Default: if we can't determine, assume it might be structure
    return True, "uncertain"


def audit_text_refined(filepath: Path) -> dict:
    """Audit a single text file with refined classification."""
    with open(filepath, encoding='utf-8') as f:
        data = json.load(f)

    # Patterns that indicate structure markers
    patterns = [
        # Strict patterns for true headers (uppercase, at start of logical unit)
        (r'CHAPTER\s+([IVXLC]+|\d+)\.?(?:\s|$|[—\-:])', 'CHAPTER'),
        (r'CHAP\.\s*([IVXLC]+|\d+)\.?(?:\s|$)', 'CHAP.'),
        (r'SECTION\s+([IVXLC]+|\d+)\.?(?:\s|$)', 'SECTION'),
        (r'BOOK\s+([IVXLC]+|\d+)\.?(?:\s|$|[—\-:])', 'BOOK'),
        (r'PART\s+([IVXLC]+|\d+)\.?(?:\s|$|[—\-:])', 'PART'),
        (r'§\s*\d+\.?\s', '§'),
        (r'HERE\s+END(?:ETH|S)\s+CHAPTER', 'HERE_ENDETH'),
    ]

    true_structure_issues = []
    cross_reference_issues = []

    for section in data.get('sections', []):
        content = section.get('content', '')
        book = section.get('book', 1)
        number = section.get('number', 0)

        for pattern, label in patterns:
            for match in re.finditer(pattern, content, re.IGNORECASE):
                is_structure, reason = classify_marker(content, match, label)

                # Get snippet
                start = max(0, match.start() - 30)
                end = min(len(content), match.end() + 40)
                snippet = content[start:end].replace('\n', ' ')
                if start > 0:
                    snippet = '...' + snippet
                if end < len(content):
                    snippet = snippet + '...'

                issue = Issue(
                    book=book,
                    section=number,
                    marker_type=label,
                    marker_text=match.group(0),
                    is_true_structure=is_structure,
                    snippet=snippet
                )

                if is_structure:
                    true_structure_issues.append((issue, reason))
                else:
                    cross_reference_issues.append((issue, reason))

    return {
        'id': data.get('id', filepath.stem),
        'title': data.get('title', 'Unknown'),
        'author': data.get('author', 'Unknown'),
        'section_count': len(data.get('sections', [])),
        'true_structure': true_structure_issues,
        'cross_references': cross_reference_issues,
    }


def main():
    texts_dir = Path(__file__).parent.parent / 'texts'

    all_results = []

    print("Refined audit: distinguishing structure markers from cross-references...\n")

    for filepath in sorted(texts_dir.glob('*.json')):
        result = audit_text_refined(filepath)
        if result['true_structure'] or result['cross_references']:
            all_results.append(result)

    # Separate texts by whether they have TRUE structure issues
    texts_with_structure_issues = [r for r in all_results if r['true_structure']]
    texts_with_only_crossrefs = [r for r in all_results if not r['true_structure'] and r['cross_references']]

    # Summary
    print("=" * 70)
    print("REFINED AUDIT SUMMARY")
    print("=" * 70)

    total_structure = sum(len(r['true_structure']) for r in all_results)
    total_crossref = sum(len(r['cross_references']) for r in all_results)

    print(f"\nTotal markers found: {total_structure + total_crossref}")
    print(f"  TRUE STRUCTURE markers (need fixing): {total_structure}")
    print(f"  Cross-references (legitimate content): {total_crossref}")

    print(f"\nTexts breakdown:")
    print(f"  Texts with structure issues to fix: {len(texts_with_structure_issues)}")
    print(f"  Texts with only cross-references (OK): {len(texts_with_only_crossrefs)}")
    print(f"  Clean texts: {187 - len(all_results)}")

    # Group by severity (true structure issues only)
    severe = [r for r in texts_with_structure_issues if len(r['true_structure']) > 10]
    moderate = [r for r in texts_with_structure_issues if 3 <= len(r['true_structure']) <= 10]
    minor = [r for r in texts_with_structure_issues if len(r['true_structure']) < 3]

    print(f"\nSeverity (by TRUE structure issues):")
    print(f"  Severe (>10): {len(severe)}")
    print(f"  Moderate (3-10): {len(moderate)}")
    print(f"  Minor (<3): {len(minor)}")

    # Type breakdown for true structure issues
    print(f"\nTRUE STRUCTURE issues by type:")
    type_counts = defaultdict(int)
    for r in all_results:
        for issue, reason in r['true_structure']:
            type_counts[issue.marker_type] += 1

    for issue_type, count in sorted(type_counts.items(), key=lambda x: -x[1]):
        print(f"  {issue_type}: {count}")

    # Detailed report for severe cases
    if severe:
        print("\n" + "=" * 70)
        print("TEXTS NEEDING ATTENTION (>10 true structure markers)")
        print("=" * 70)

        for r in sorted(severe, key=lambda x: -len(x['true_structure'])):
            struct_count = len(r['true_structure'])
            xref_count = len(r['cross_references'])
            print(f"\n{r['title']} by {r['author']}")
            print(f"  File: {r['id']}.json ({r['section_count']} sections)")
            print(f"  TRUE STRUCTURE: {struct_count} | Cross-refs: {xref_count}")

            # Group by type
            by_type = defaultdict(list)
            for issue, reason in r['true_structure']:
                by_type[issue.marker_type].append((issue, reason))

            for marker_type, issues in sorted(by_type.items(), key=lambda x: -len(x[1])):
                print(f"    {marker_type}: {len(issues)}")
                # Show first example
                issue, reason = issues[0]
                print(f"      Reason: {reason}")
                print(f"      Example: \"{issue.snippet}\"")

    # Moderate cases (summary)
    if moderate:
        print("\n" + "=" * 70)
        print("MODERATE ISSUES (3-10 true structure markers)")
        print("=" * 70)

        for r in sorted(moderate, key=lambda x: -len(x['true_structure'])):
            struct_count = len(r['true_structure'])
            types = set(i.marker_type for i, _ in r['true_structure'])
            print(f"  {r['id']}.json: {struct_count} markers ({', '.join(types)})")

    # Minor cases (summary)
    if minor:
        print("\n" + "=" * 70)
        print("MINOR ISSUES (<3 true structure markers)")
        print("=" * 70)

        for r in sorted(minor, key=lambda x: x['id']):
            struct_count = len(r['true_structure'])
            types = set(i.marker_type for i, _ in r['true_structure'])
            print(f"  {r['id']}.json: {struct_count} markers ({', '.join(types)})")

    # Return data for further processing
    return {
        'severe': severe,
        'moderate': moderate,
        'minor': minor,
        'crossref_only': texts_with_only_crossrefs,
    }


if __name__ == '__main__':
    main()
