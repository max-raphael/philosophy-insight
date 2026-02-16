#!/usr/bin/env python3
"""Fix alcibiades-ii.json by removing metadata preamble sections."""

import json
import sys

def fix_alcibiades_ii():
    """Remove sections 1-4 (metadata) and renumber remaining sections."""
    filepath = '/Users/maxraph/philosophy-insight/backend/texts/alcibiades-ii.json'

    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Keep sections starting from index 4 (which is section #5 in numbering)
    # Sections 0-3 are metadata and should be removed
    kept_sections = data['sections'][4:]

    # Renumber sections to be sequential from 1
    for i, section in enumerate(kept_sections, start=1):
        section['number'] = i

    data['sections'] = kept_sections

    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"Fixed alcibiades-ii.json: removed 4 metadata sections, {len(kept_sections)} dialogue sections remain")

if __name__ == '__main__':
    fix_alcibiades_ii()
