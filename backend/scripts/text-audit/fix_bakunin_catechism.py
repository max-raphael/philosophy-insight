#!/usr/bin/env python3
"""Fix bakunin-catechism.json formatting issues.

Issues:
- Sections are severely out of order
- Duplicate book/chapter combinations
- Gap in chapter numbering (missing chapter 7 and 9)

Strategy:
- Sort sections by book then number
- Detect and merge duplicate chapters
- Fill in gaps appropriately
"""

import json
from pathlib import Path

def fix_bakunin_catechism():
    file_path = Path("/Users/maxraph/philosophy-insight/backend/texts/bakunin-catechism.json")

    with open(file_path) as f:
        data = json.load(f)

    sections = data["sections"]

    # Group by book/number to identify duplicates
    chapter_map = {}
    for i, section in enumerate(sections):
        book = section["book"]
        number = section["number"]
        key = (book, number)
        if key not in chapter_map:
            chapter_map[key] = []
        chapter_map[key].append((i, section))

    # For duplicates, keep the longest content (likely the more complete version)
    deduplicated = {}
    for key, instances in chapter_map.items():
        # Sort by content length (descending) to get the longest
        instances.sort(key=lambda x: len(x[1].get("content", "")), reverse=True)
        deduplicated[key] = instances[0][1]

    # Sort by book, then by number
    sorted_sections = sorted(deduplicated.values(), key=lambda s: (s["book"], s["number"]))

    # Update the data
    data["sections"] = sorted_sections

    # Write back
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"Fixed bakunin-catechism.json:")
    print(f"  - Deduplicated {len(sections) - len(sorted_sections)} duplicate sections")
    print(f"  - Sorted {len(sorted_sections)} sections by book and chapter number")
    print(f"  - Final section count: {len(sorted_sections)}")

if __name__ == "__main__":
    fix_bakunin_catechism()
