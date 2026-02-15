#!/usr/bin/env python3
"""
Import texts from Standard Ebooks HTML format.
"""

import json
import re
import urllib.request
from html.parser import HTMLParser
from pathlib import Path
from dataclasses import dataclass, field
from typing import Optional, List


@dataclass
class Section:
    part: int
    section: int
    chapter: int
    title: str
    content: str


class StandardEbooksParser(HTMLParser):
    """Parse Standard Ebooks HTML to extract structured text."""

    def __init__(self):
        super().__init__()
        self.sections: List[Section] = []
        self.current_part = 0
        self.current_section = 0
        self.current_chapter = 0
        self.current_title = ""
        self.current_content = []
        self.in_part = False
        self.in_section = False
        self.in_chapter = False
        self.in_header = False
        self.in_p = False
        self.in_blockquote = False
        self.skip_content = False
        self.tag_stack = []

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        epub_type = attrs_dict.get('epub:type', '')
        section_id = attrs_dict.get('id', '')

        self.tag_stack.append(tag)

        # Skip front matter and back matter
        if 'frontmatter' in epub_type or 'backmatter' in epub_type:
            self.skip_content = True
            return

        if tag == 'section':
            # Parse section ID like "part-1", "section-1-1", "chapter-1-1-1"
            if section_id.startswith('part-'):
                self.in_part = True
                # Handle "part-6-introduction" etc
                part_match = re.match(r'part-(\d+)', section_id)
                if part_match:
                    self.current_part = int(part_match.group(1))
                self.current_section = 0
                self.current_chapter = 0
            elif section_id.startswith('section-'):
                self.in_section = True
                # section-1-1 -> part 1, section 1
                section_match = re.match(r'section-(\d+)-(\d+)', section_id)
                if section_match:
                    self.current_section = int(section_match.group(2))
                self.current_chapter = 0
            elif section_id.startswith('chapter-'):
                self.in_chapter = True
                # chapter-1-1-1 -> part 1, section 1, chapter 1
                chapter_match = re.match(r'chapter-(\d+)-(\d+)-(\d+)', section_id)
                if chapter_match:
                    self.current_chapter = int(chapter_match.group(3))
                self._save_current_section()
                self.current_content = []
                self.current_title = ""

        elif tag in ('header', 'hgroup'):
            self.in_header = True

        elif tag == 'p' and not self.skip_content:
            self.in_p = True

        elif tag == 'blockquote':
            self.in_blockquote = True
            if self.current_content:
                self.current_content.append('\n')

    def handle_endtag(self, tag):
        if self.tag_stack:
            self.tag_stack.pop()

        if tag == 'section':
            if self.in_chapter:
                self.in_chapter = False
            elif self.in_section:
                self.in_section = False
            elif self.in_part:
                self.in_part = False
            self.skip_content = False

        elif tag in ('header', 'hgroup'):
            self.in_header = False

        elif tag == 'p':
            if self.in_p and self.current_content:
                self.current_content.append('\n\n')
            self.in_p = False

        elif tag == 'blockquote':
            self.in_blockquote = False
            if self.current_content:
                self.current_content.append('\n')

    def handle_data(self, data):
        if self.skip_content:
            return

        text = data.strip()
        if not text:
            return

        if self.in_header and self.in_chapter:
            if self.current_title:
                self.current_title += " "
            self.current_title += text
        elif self.in_p or self.in_blockquote:
            # Normalize whitespace
            text = ' '.join(data.split())
            if text:
                self.current_content.append(text)

    def _save_current_section(self):
        if self.current_content and self.current_chapter > 0:
            content = ''.join(self.current_content).strip()
            content = re.sub(r'\n{3,}', '\n\n', content)
            if content:
                self.sections.append(Section(
                    part=self.current_part,
                    section=self.current_section,
                    chapter=self.current_chapter,
                    title=self.current_title,
                    content=content
                ))

    def finalize(self):
        """Call this after parsing is complete."""
        self._save_current_section()


def fetch_standard_ebooks(url: str) -> str:
    """Fetch HTML from Standard Ebooks."""
    print(f"  Fetching from {url}")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=60) as response:
        return response.read().decode('utf-8')


def parse_theory_of_moral_sentiments(html: str) -> dict:
    """Parse Theory of Moral Sentiments from Standard Ebooks HTML."""
    parser = StandardEbooksParser()
    parser.feed(html)
    parser.finalize()

    sections = []
    for sec in parser.sections:
        sections.append({
            "book": sec.part,
            "number": sec.chapter + (sec.section - 1) * 10 if sec.section > 0 else sec.chapter,
            "title": sec.title if sec.title else None,
            "content": sec.content
        })

    return {
        "id": "theory-of-moral-sentiments",
        "title": "The Theory of Moral Sentiments",
        "author": "Adam Smith",
        "year": "1759",
        "description": "Adam Smith's moral philosophy grounding ethics in sympathy and the impartial spectator, foundational to his economic theory.",
        "category": "enlightenment",
        "sections": sections
    }


def main():
    output_dir = Path(__file__).parent.parent / "texts"

    # Theory of Moral Sentiments
    print("\nImporting Theory of Moral Sentiments...")
    url = "https://standardebooks.org/ebooks/adam-smith/the-theory-of-moral-sentiments/text/single-page"
    html = fetch_standard_ebooks(url)

    data = parse_theory_of_moral_sentiments(html)

    output_path = output_dir / f"{data['id']}.json"
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"  Wrote {len(data['sections'])} sections to {output_path}")
    print(f"  Sample section: Part {data['sections'][0]['book']}, {data['sections'][0]['content'][:100]}...")


if __name__ == '__main__':
    main()
