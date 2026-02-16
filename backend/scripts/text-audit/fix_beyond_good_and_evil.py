#!/usr/bin/env python3
"""
Fix for beyond-good-and-evil.json - split embedded section numbers into separate entries.
Issues: Book 9 sections 277-282 have multiple numbered paragraphs merged into single entries.
"""

import json
import re

def fix_beyond_good_and_evil():
    filepath = '/Users/maxraph/philosophy-insight/backend/texts/beyond-good-and-evil.json'

    with open(filepath, 'r') as f:
        data = json.load(f)

    sections = data['sections']
    new_sections = []
    fixes_applied = 0

    i = 0
    while i < len(sections):
        section = sections[i]

        # Check if this is one of the problematic sections
        if section['book'] == 9 and section['number'] == 277:
            # Section 277 contains 277 and 278
            content = section['content']
            # Split on "278.--"
            if '278.--' in content:
                parts = content.split('278.--', 1)
                new_sections.append({
                    'book': 9,
                    'number': 277,
                    'content': parts[0].strip()
                })
                new_sections.append({
                    'book': 9,
                    'number': 278,
                    'content': parts[1].strip()
                })
                fixes_applied += 1
            else:
                new_sections.append(section)

        elif section['book'] == 9 and section['number'] == 280:
            # Section 280 contains 280, 281, and 282
            content = section['content']

            # Split on "281.--" and "282.--"
            if '281.--' in content and '282.--' in content:
                parts1 = content.split('281.--', 1)
                parts2 = parts1[1].split('282.--', 1)

                new_sections.append({
                    'book': 9,
                    'number': 280,
                    'content': parts1[0].strip()
                })
                new_sections.append({
                    'book': 9,
                    'number': 281,
                    'content': parts2[0].strip()
                })
                new_sections.append({
                    'book': 9,
                    'number': 282,
                    'content': parts2[1].strip()
                })
                fixes_applied += 1
            else:
                new_sections.append(section)

        else:
            new_sections.append(section)

        i += 1

    # Update the sections
    data['sections'] = new_sections

    # Write back
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)

    print(f"Fixed {fixes_applied} section(s) with embedded numbered paragraphs")
    print(f"New total sections: {len(new_sections)}")
    return fixes_applied

if __name__ == '__main__':
    fix_beyond_good_and_evil()
