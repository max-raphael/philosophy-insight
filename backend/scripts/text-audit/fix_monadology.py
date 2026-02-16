#!/usr/bin/env python3
"""
Fix for monadology.json - remove footnote reference sections.
Issues: 40 sections are pure footnote references/editorial markers (not content).
These sections clutter the text and should be removed.
"""

import json
import re

def fix_monadology():
    filepath = '/Users/maxraph/philosophy-insight/backend/texts/monadology.json'

    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    def is_pure_footnote(content):
        """Identify sections that are pure footnotes or editorial markers, not content."""
        if len(content) > 150:
            return False
        # Footnote references start with (number)
        if re.match(r'^\s*\(\d+\)', content):
            return True
        # Section headers like "2. Die Causalität..." are subsection markers, not main content
        if re.match(r'^\d+\.\s+[A-Z]', content) and len(content) < 100:
            return True
        return False

    sections = data['sections']
    original_count = len(sections)

    # Filter out pure footnote sections
    new_sections = [s for s in sections if not is_pure_footnote(s.get('content', ''))]

    # Renumber sections sequentially
    for i, section in enumerate(new_sections):
        section['number'] = i + 1

    data['sections'] = new_sections
    fixes_applied = original_count - len(new_sections)

    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"Removed {fixes_applied} footnote/editorial marker sections")
    print(f"Section count: {original_count} → {len(new_sections)}")
    return fixes_applied

if __name__ == '__main__':
    fix_monadology()
