#!/usr/bin/env python3
"""Fix numbering gaps in berkeley-new-theory-vision.json"""
import json

# Load the file
with open('/Users/maxraph/philosophy-insight/backend/texts/berkeley-new-theory-vision.json') as f:
    data = json.load(f)

sections = data['sections']

# Gap 1: Index 20 is numbered 21 (should be 20)
if sections[20]['number'] == 21:
    sections[20]['number'] = 20

# Gap 2: Index 24 is numbered 26 (should be 25)
if sections[24]['number'] == 26:
    sections[24]['number'] = 25

# Save the file
with open('/Users/maxraph/philosophy-insight/backend/texts/berkeley-new-theory-vision.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Fixed: Changed index 20 from 21 to 20, index 24 from 26 to 25")
