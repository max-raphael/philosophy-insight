#!/usr/bin/env python3
"""
Audit script to identify texts with inline structure markers in content.
These indicate parsing issues where CHAPTER/SECTION/BOOK markers weren't
properly used to structure the text.
"""

import json
import re
from pathlib import Path
from collections import defaultdict


# Patterns that indicate structure markers that should NOT be in content
INLINE_PATTERNS = [
    (r'\bCHAPTER\s+([IVXLC]+|\d+)', 'CHAPTER'),
    (r'\bCHAP\.\s*([IVXLC]+|\d+)', 'CHAP.'),
    (r'\bSECTION\s+([IVXLC]+|\d+)', 'SECTION'),
    (r'\bBOOK\s+([IVXLC]+|\d+)', 'BOOK'),
    (r'\bPART\s+([IVXLC]+|\d+)', 'PART'),
    (r'§\s*\d+', '§ (section symbol)'),
    (r'\bHERE\s+END(?:ETH|S)\s+CHAPTER', 'HERE ENDETH CHAPTER'),
]


def audit_text(filepath: Path) -> dict:
    """Audit a single text file for inline structure markers."""
    with open(filepath, encoding='utf-8') as f:
        data = json.load(f)

    issues = defaultdict(list)

    for section in data.get('sections', []):
        content = section.get('content', '')
        book = section.get('book', 1)
        number = section.get('number', 0)

        for pattern, label in INLINE_PATTERNS:
            matches = re.findall(pattern, content, re.IGNORECASE)
            if matches:
                # Get a snippet showing context
                match = re.search(pattern, content, re.IGNORECASE)
                if match:
                    start = max(0, match.start() - 20)
                    end = min(len(content), match.end() + 30)
                    snippet = content[start:end].replace('\n', ' ')
                    if start > 0:
                        snippet = '...' + snippet
                    if end < len(content):
                        snippet = snippet + '...'

                    issues[label].append({
                        'book': book,
                        'section': number,
                        'count': len(matches),
                        'snippet': snippet
                    })

    return {
        'id': data.get('id', filepath.stem),
        'title': data.get('title', 'Unknown'),
        'author': data.get('author', 'Unknown'),
        'section_count': len(data.get('sections', [])),
        'issues': dict(issues)
    }


def main():
    texts_dir = Path(__file__).parent.parent / 'texts'

    results = []
    clean_texts = []

    print("Auditing texts for inline structure markers...\n")

    for filepath in sorted(texts_dir.glob('*.json')):
        result = audit_text(filepath)
        if result['issues']:
            results.append(result)
        else:
            clean_texts.append(result['id'])

    # Summary
    print("=" * 70)
    print("AUDIT SUMMARY")
    print("=" * 70)
    print(f"\nTotal texts scanned: {len(results) + len(clean_texts)}")
    print(f"Texts with issues: {len(results)}")
    print(f"Clean texts: {len(clean_texts)}")

    # Group by severity
    severe = [r for r in results if sum(len(v) for v in r['issues'].values()) > 10]
    moderate = [r for r in results if 3 <= sum(len(v) for v in r['issues'].values()) <= 10]
    minor = [r for r in results if sum(len(v) for v in r['issues'].values()) < 3]

    print(f"\nSeverity breakdown:")
    print(f"  Severe (>10 markers): {len(severe)}")
    print(f"  Moderate (3-10): {len(moderate)}")
    print(f"  Minor (<3): {len(minor)}")

    # Issue type breakdown
    print(f"\nIssue types found:")
    type_counts = defaultdict(int)
    for r in results:
        for issue_type, occurrences in r['issues'].items():
            type_counts[issue_type] += sum(o['count'] for o in occurrences)

    for issue_type, count in sorted(type_counts.items(), key=lambda x: -x[1]):
        print(f"  {issue_type}: {count} occurrences")

    # Detailed report for severe cases
    if severe:
        print("\n" + "=" * 70)
        print("SEVERE ISSUES (>10 inline markers)")
        print("=" * 70)

        for r in sorted(severe, key=lambda x: -sum(len(v) for v in x['issues'].values())):
            total = sum(len(v) for v in r['issues'].values())
            print(f"\n{r['title']} by {r['author']}")
            print(f"  File: {r['id']}.json ({r['section_count']} sections)")
            print(f"  Total inline markers: {total}")
            for issue_type, occurrences in r['issues'].items():
                print(f"    {issue_type}: {sum(o['count'] for o in occurrences)} in {len(occurrences)} sections")
                # Show first example
                if occurrences:
                    print(f"      Example: \"{occurrences[0]['snippet']}\"")

    # Moderate cases
    if moderate:
        print("\n" + "=" * 70)
        print("MODERATE ISSUES (3-10 inline markers)")
        print("=" * 70)

        for r in sorted(moderate, key=lambda x: -sum(len(v) for v in x['issues'].values())):
            total = sum(len(v) for v in r['issues'].values())
            types = ', '.join(r['issues'].keys())
            print(f"  {r['id']}.json: {total} markers ({types})")

    # Minor cases
    if minor:
        print("\n" + "=" * 70)
        print("MINOR ISSUES (<3 inline markers)")
        print("=" * 70)

        for r in sorted(minor, key=lambda x: x['id']):
            total = sum(len(v) for v in r['issues'].values())
            types = ', '.join(r['issues'].keys())
            print(f"  {r['id']}.json: {total} markers ({types})")

    return results


if __name__ == '__main__':
    main()
