import json

with open('backend/texts/arnold-essays-criticism.json', 'r') as f:
    data = json.load(f)

# The file has 30 sections:
# - Indices 0-10 are TOC entries (short, should be removed)
# - Indices 11-29 are actual content (19 essays)
# We need to:
# 1. Remove the TOC entries (indices 0-10)
# 2. Renumber the content sections 1-19

new_sections = []
content_sections = data['sections'][11:]  # Skip TOC entries

for i, section in enumerate(content_sections, start=1):
    new_section = section.copy()
    new_section['number'] = i
    new_sections.append(new_section)

data['sections'] = new_sections

with open('backend/texts/arnold-essays-criticism.json', 'w') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Fixed: Removed 11 TOC entries, kept {len(new_sections)} content sections")
print("Renumbered sections 1-19")
