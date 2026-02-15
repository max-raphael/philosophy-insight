#!/usr/bin/env python3
"""
Import script for Marxists Internet Archive (marxists.org).
Parses HTML pages and converts to standard JSON format.
"""

import json
import re
import time
import urllib.request
from pathlib import Path
from dataclasses import dataclass, field
from typing import Optional, List
from html.parser import HTMLParser
from urllib.parse import urljoin


@dataclass
class MarxistTextConfig:
    """Configuration for a text to import from marxists.org."""
    id: str
    title: str
    author: str
    year: str
    description: str
    url: str  # Base URL (index page or single page)
    chapter_pattern: Optional[str] = None  # Pattern for chapter URLs if multi-page
    chapter_urls: Optional[List[str]] = None  # Explicit list of chapter URLs if pattern doesn't work
    translator: Optional[str] = None
    source: str = "marxists.org"
    attribution: str = "Marxists Internet Archive (marxists.org), CC-BY-SA"
    category: str = "marxist"
    single_page: bool = False  # Force single-page parsing (don't look for chapter links)


class HTMLTextExtractor(HTMLParser):
    """Extract text content from HTML, preserving structure."""

    def __init__(self):
        super().__init__()
        self.text_parts = []
        self.current_text = []
        self.in_content = False
        self.skip_tags = {'script', 'style', 'nav', 'header', 'footer', 'noscript'}
        self.block_tags = {'p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'blockquote', 'br', 'hr'}
        self.heading_tags = {'h1', 'h2', 'h3', 'h4', 'h5', 'h6'}
        self.skip_depth = 0
        self.headings = []  # Track headings for structure detection
        self.current_heading_level = 0
        self.current_heading_text = []

    def handle_starttag(self, tag, attrs):
        tag = tag.lower()
        if tag in self.skip_tags:
            self.skip_depth += 1
        if tag in self.heading_tags:
            self.current_heading_level = int(tag[1])
            self.current_heading_text = []
        if tag in self.block_tags and self.current_text:
            text = ''.join(self.current_text).strip()
            if text:
                self.text_parts.append(text)
            self.current_text = []
        if tag == 'br':
            self.current_text.append('\n')
        if tag == 'hr':
            self.text_parts.append('---HR---')  # Marker for section break

    def handle_endtag(self, tag):
        tag = tag.lower()
        if tag in self.skip_tags and self.skip_depth > 0:
            self.skip_depth -= 1
        if tag in self.heading_tags and self.current_heading_level > 0:
            heading_text = ''.join(self.current_heading_text).strip()
            if heading_text:
                self.headings.append({
                    'level': self.current_heading_level,
                    'text': heading_text,
                    'position': len(self.text_parts)
                })
            self.current_heading_level = 0
            self.current_heading_text = []
        if tag in self.block_tags and self.current_text:
            text = ''.join(self.current_text).strip()
            if text:
                self.text_parts.append(text)
            self.current_text = []

    def handle_data(self, data):
        if self.skip_depth == 0:
            self.current_text.append(data)
            if self.current_heading_level > 0:
                self.current_heading_text.append(data)

    def get_text(self):
        if self.current_text:
            text = ''.join(self.current_text).strip()
            if text:
                self.text_parts.append(text)
        return self.text_parts

    def get_headings(self):
        return self.headings


def fetch_url(url: str, delay: float = 1.5) -> str:
    """Fetch URL content with rate limiting."""
    print(f"  Fetching: {url}")
    time.sleep(delay)  # Rate limiting

    headers = {
        'User-Agent': 'Philosophy-Insight/1.0 (Educational Project)',
        'Accept': 'text/html,application/xhtml+xml'
    }

    request = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return response.read().decode('utf-8', errors='replace')
    except Exception as e:
        print(f"  Error fetching {url}: {e}")
        return ""


def extract_text_from_html(html: str) -> tuple[list[str], list[dict]]:
    """Extract text and headings from HTML."""
    parser = HTMLTextExtractor()
    try:
        parser.feed(html)
    except Exception as e:
        print(f"  Warning: HTML parsing error: {e}")
    return parser.get_text(), parser.get_headings()


def clean_text(text: str) -> str:
    """Clean up extracted text."""
    # Remove excessive whitespace
    text = re.sub(r'\s+', ' ', text)
    text = text.strip()
    return text


def is_navigation_text(text: str) -> bool:
    """Check if text is likely navigation/boilerplate."""
    text_lower = text.lower()
    nav_patterns = [
        'marx/engels internet archive',
        'marxists internet archive',
        'archive home',
        'next chapter',
        'previous chapter',
        'table of contents',
        'works index',
        'subject index',
        'last updated',
        'transcribed by',
        'html markup by',
        'online version',
        'e-text',
        'proofread and corrected',
        'from:',
        'source:',
        'first published:',
        'written:',
        'downloaded from',
        'copyright',
        '© ',
        'all rights reserved',
        'mia:',
        'mia >',
        '| marxists',
        'edition |',
        'german edition',
        'russian edition',
        'english edition',
        'polish edition',
        'italian edition',
        'progress publishers',
        'selected works',
        'collected works',
        'first published',
        'marx-engels-lenin institute',
    ]

    for pattern in nav_patterns:
        if pattern in text_lower:
            return True

    # Very short text that's likely navigation
    if len(text) < 30 and any(kw in text_lower for kw in ['back', 'next', 'home', 'index', 'top']):
        return True

    # Text with lots of pipe separators is usually navigation
    if text.count('|') >= 3:
        return True

    return False


def filter_content(text_parts: list[str]) -> list[str]:
    """Filter out navigation and boilerplate text."""
    filtered = []
    started_content = False

    # Pattern for Roman numeral section markers
    roman_numeral_pattern = r'^[IVXLC]+\.?$'

    for text in text_parts:
        # Skip HR markers
        if text == '---HR---':
            if filtered:  # Only add separator if we have content
                filtered.append(text)
            continue

        # Skip navigation text
        if is_navigation_text(text):
            continue

        stripped = text.strip()

        # Keep Roman numeral section markers (I, II, III, etc.)
        if re.match(roman_numeral_pattern, stripped) and len(stripped) <= 5:
            if started_content:
                filtered.append(text)
            continue

        # Keep Arabic numeral section markers (1, 2, 3, etc.)
        if re.match(r'^\d+\.?$', stripped) and len(stripped) <= 4:
            if started_content:
                filtered.append(text)
            continue

        # Skip very short fragments that aren't numbered items
        if len(text) < 20 and not re.match(r'^\d+\.?\s+\w', text):
            continue

        # Start content after we see substantive text
        if len(text) > 50:
            started_content = True

        if started_content or len(text) > 30:
            filtered.append(text)

    return filtered


def detect_sections_from_headings(text_parts: list[str], headings: list[dict]) -> list[dict]:
    """Create sections based on detected headings."""
    if not headings:
        return []

    sections = []

    # Find the primary heading level (most common, or lowest level that appears multiple times)
    level_counts = {}
    for h in headings:
        level_counts[h['level']] = level_counts.get(h['level'], 0) + 1

    # Use the most common heading level, preferring lower levels (h2, h3)
    primary_level = None
    for level in [2, 3, 4, 1]:
        if level_counts.get(level, 0) >= 2:
            primary_level = level
            break

    if not primary_level:
        return []

    # Filter to primary level headings
    primary_headings = [h for h in headings if h['level'] == primary_level]

    if len(primary_headings) < 2:
        return []

    # Create sections between headings
    for i, heading in enumerate(primary_headings):
        start_pos = heading['position']
        end_pos = primary_headings[i + 1]['position'] if i + 1 < len(primary_headings) else len(text_parts)

        section_text = []
        for j in range(start_pos, end_pos):
            if j < len(text_parts) and text_parts[j] != '---HR---':
                section_text.append(text_parts[j])

        content = '\n\n'.join(section_text)
        content = clean_text(content)

        if content and len(content) > 50:
            sections.append({
                'book': 1,
                'number': i + 1,
                'title': heading['text'],
                'content': content
            })

    return sections


def detect_numbered_sections(text_parts: list[str]) -> list[dict]:
    """Detect sections based on numbered patterns (I., II., 1., 2., etc.)."""
    sections = []
    current_section = []
    current_number = None
    current_title = None

    # Roman numeral pattern - match standalone or with content
    # Standalone: just "I" or "XI" etc.
    # With content: "I. Content here" or "1. Content here"
    standalone_roman_pattern = r'^([IVXLC]+)\.?$'
    roman_with_content_pattern = r'^([IVXLC]+)\.?\s+(.+)$'
    standalone_arabic_pattern = r'^(\d+)\.?$'
    arabic_with_content_pattern = r'^(\d+)\.?\s+(.+)$'

    def roman_to_int(roman: str) -> int:
        values = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100}
        result = 0
        prev = 0
        for char in reversed(roman.upper()):
            val = values.get(char, 0)
            if val < prev:
                result -= val
            else:
                result += val
            prev = val
        return result

    for text in text_parts:
        if text == '---HR---':
            continue

        stripped = text.strip()
        is_section_header = False
        new_number = None
        new_title = None
        content_after_header = None

        # Check standalone Roman numeral (like "I", "II", "XI")
        standalone_roman = re.match(standalone_roman_pattern, stripped)
        if standalone_roman and len(stripped) <= 5:  # Very short = standalone number
            roman_str = standalone_roman.group(1)
            num = roman_to_int(roman_str)
            if 1 <= num <= 50:
                is_section_header = True
                new_number = num
                new_title = roman_str

        # Check Roman numeral with content
        elif len(stripped) < 500:
            roman_with_content = re.match(roman_with_content_pattern, stripped)
            if roman_with_content:
                roman_str = roman_with_content.group(1)
                num = roman_to_int(roman_str)
                if 1 <= num <= 50:
                    is_section_header = True
                    new_number = num
                    new_title = roman_str
                    content_after_header = roman_with_content.group(2).strip()

        # Check standalone Arabic numeral
        if not is_section_header:
            standalone_arabic = re.match(standalone_arabic_pattern, stripped)
            if standalone_arabic and len(stripped) <= 4:
                num = int(standalone_arabic.group(1))
                if 1 <= num <= 100:
                    is_section_header = True
                    new_number = num
                    new_title = str(num)

        # Check Arabic numeral with content
        if not is_section_header and len(stripped) < 500:
            arabic_with_content = re.match(arabic_with_content_pattern, stripped)
            if arabic_with_content:
                num = int(arabic_with_content.group(1))
                if 1 <= num <= 100:
                    is_section_header = True
                    new_number = num
                    new_title = str(num)
                    content_after_header = arabic_with_content.group(2).strip()

        if is_section_header:
            # Save previous section
            if current_number is not None and current_section:
                content = '\n\n'.join(current_section)
                content = clean_text(content)
                if len(content) > 30:
                    sections.append({
                        'book': 1,
                        'number': current_number,
                        'title': current_title,
                        'content': content
                    })

            current_number = new_number
            current_title = new_title
            current_section = []
            if content_after_header:
                current_section.append(content_after_header)
        else:
            current_section.append(text)

    # Don't forget the last section
    if current_number is not None and current_section:
        content = '\n\n'.join(current_section)
        content = clean_text(content)
        if len(content) > 30:
            sections.append({
                'book': 1,
                'number': current_number,
                'title': current_title,
                'content': content
            })

    return sections


def chunk_by_paragraphs(text_parts: list[str], target_size: int = 800) -> list[dict]:
    """Fall back to chunking by paragraphs."""
    sections = []
    current_content = []
    current_length = 0
    section_num = 0

    for text in text_parts:
        if text == '---HR---':
            # HR is a natural section break
            if current_content:
                section_num += 1
                content = '\n\n'.join(current_content)
                content = clean_text(content)
                if len(content) > 50:
                    sections.append({
                        'book': 1,
                        'number': section_num,
                        'content': content
                    })
                current_content = []
                current_length = 0
            continue

        text_len = len(text)

        if current_length + text_len > target_size and current_content:
            section_num += 1
            content = '\n\n'.join(current_content)
            content = clean_text(content)
            if len(content) > 50:
                sections.append({
                    'book': 1,
                    'number': section_num,
                    'content': content
                })
            current_content = [text]
            current_length = text_len
        else:
            current_content.append(text)
            current_length += text_len

    # Last section
    if current_content:
        section_num += 1
        content = '\n\n'.join(current_content)
        content = clean_text(content)
        if len(content) > 50:
            sections.append({
                'book': 1,
                'number': section_num,
                'content': content
            })

    return sections


def parse_single_page(html: str) -> list[dict]:
    """Parse a single-page text into sections."""
    text_parts, headings = extract_text_from_html(html)
    text_parts = filter_content(text_parts)

    if not text_parts:
        return []

    # Try numbered sections first (most common for philosophical texts)
    sections = detect_numbered_sections(text_parts)
    if len(sections) >= 3:
        print(f"    Found {len(sections)} numbered sections")
        return sections

    # Try heading-based sections
    sections = detect_sections_from_headings(text_parts, headings)
    if len(sections) >= 2:
        print(f"    Found {len(sections)} sections from headings")
        return sections

    # Fall back to paragraph chunking
    sections = chunk_by_paragraphs(text_parts)
    print(f"    Chunked into {len(sections)} sections by paragraphs")
    return sections


def parse_chapter(html: str, chapter_num: int, chapter_title: str = None) -> list[dict]:
    """Parse a chapter page into sections."""
    text_parts, headings = extract_text_from_html(html)
    text_parts = filter_content(text_parts)

    if not text_parts:
        return []

    # For chapters, try to split into subsections
    sections = detect_numbered_sections(text_parts)

    if len(sections) >= 2:
        # Update book numbers to be chapter numbers
        for s in sections:
            s['book'] = chapter_num
        return sections

    # Fall back to paragraph chunking within the chapter
    sections = chunk_by_paragraphs(text_parts, target_size=1000)
    for s in sections:
        s['book'] = chapter_num

    return sections


def extract_chapter_links(html: str, base_url: str) -> list[tuple[str, str]]:
    """Extract chapter links from an index page."""
    links = []

    # Find all href patterns for chapter links
    # Common patterns: ch01.htm, chap1.htm, one1.htm, preface.htm, etc.
    href_pattern = r'href=["\']([^"\']+\.htm[l]?)["\'][^>]*>([^<]+)<'

    for match in re.finditer(href_pattern, html, re.IGNORECASE):
        href = match.group(1)
        title = match.group(2).strip()

        # Skip navigation links and non-content pages
        skip_href_patterns = [
            'index', '404', 'archive', 'guide', 'study',
            'deutsch', 'francais', 'espanol', 'italiano',
            'russian', 'chinese', 'japanese',
            'original.htm',  # Skip alternate versions
            'admin/', 'legal/', 'cc/', 'by-sa',  # License pages
            'feuerbach.htm',  # Engels on Feuerbach (not part of main text)
            'engels.htm',  # Alternate versions
        ]
        skip_title_patterns = [
            'back', 'home', 'index', 'archive', 'guide',
            'deutsch', 'french', 'spanish', 'italian',
            'study guide', 'original', '1938 translation',
            'creative commons', 'license', 'copyright',
            'mecw translation', 'engels\'',
        ]

        href_lower = href.lower()
        title_lower = title.lower()

        if any(skip in href_lower for skip in skip_href_patterns):
            continue
        if any(skip in title_lower for skip in skip_title_patterns):
            continue

        # Make absolute URL
        full_url = urljoin(base_url, href)
        links.append((full_url, title))

    return links


def import_text(config: MarxistTextConfig) -> dict:
    """Import a text from marxists.org."""
    print(f"\nImporting: {config.title} by {config.author}")

    sections = []

    if config.chapter_urls:
        # Explicit chapter URLs provided
        for i, url in enumerate(config.chapter_urls, 1):
            html = fetch_url(url)
            if html:
                chapter_sections = parse_chapter(html, i)
                sections.extend(chapter_sections)
                print(f"    Chapter {i}: {len(chapter_sections)} sections")

    elif config.chapter_pattern:
        # Generate chapter URLs from pattern
        chapter_num = 1
        while True:
            url = config.chapter_pattern.format(num=chapter_num)
            html = fetch_url(url, delay=1.0)

            if not html or len(html) < 500:  # Stop if page not found or too short
                break

            chapter_sections = parse_chapter(html, chapter_num)
            if not chapter_sections:
                break

            sections.extend(chapter_sections)
            print(f"    Chapter {chapter_num}: {len(chapter_sections)} sections")
            chapter_num += 1

            if chapter_num > 50:  # Safety limit
                break

    else:
        # Single page or try to detect chapters from index
        html = fetch_url(config.url)

        if not html:
            print(f"  Error: Could not fetch {config.url}")
            return None

        # If single_page is set, don't look for chapter links
        if config.single_page:
            print(f"  Parsing as single page text")
            sections = parse_single_page(html)
        else:
            # Check if this is an index page with chapter links
            chapter_links = extract_chapter_links(html, config.url)

            if len(chapter_links) >= 2:
                print(f"  Found {len(chapter_links)} chapter links")
                for i, (url, title) in enumerate(chapter_links, 1):
                    chapter_html = fetch_url(url)
                    if chapter_html:
                        chapter_sections = parse_chapter(chapter_html, i, title)
                        sections.extend(chapter_sections)
                        print(f"    Chapter {i} ({title}): {len(chapter_sections)} sections")
            else:
                # Single page text
                sections = parse_single_page(html)

    if not sections:
        print(f"  Warning: No sections extracted!")
        return None

    print(f"  Total: {len(sections)} sections")

    # Build result
    result = {
        'id': config.id,
        'title': config.title,
        'author': config.author,
        'year': config.year,
        'description': config.description,
        'category': config.category,
        'source': config.source,
        'attribution': config.attribution,
        'sections': sections
    }

    if config.translator:
        result['translator'] = config.translator

    return result


def save_text(data: dict, output_dir: Path):
    """Save parsed text to JSON file."""
    output_path = output_dir / f"{data['id']}.json"
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"  Saved to {output_path}")
    return output_path


def main():
    """Batch import texts from Marxists Internet Archive."""
    import argparse

    parser = argparse.ArgumentParser(description='Import texts from Marxists Internet Archive')
    parser.add_argument('--test', type=int, default=0, help='Test with first N configs (0 = all)')
    parser.add_argument('--id', type=str, help='Import specific text by ID')
    parser.add_argument('--skip-existing', action='store_true', help='Skip texts that already exist')
    parser.add_argument('--author', type=str, help='Import texts by specific author (marx, engels, lenin, gramsci, lukacs, bakunin, kropotkin, goldman, luxemburg)')
    args = parser.parse_args()

    # Import manifest
    try:
        from marxists_manifest import ALL_TEXTS, MARX, ENGELS, LENIN, GRAMSCI, LUKACS, BAKUNIN, KROPOTKIN, GOLDMAN, LUXEMBURG
    except ImportError:
        print("Error: marxists_manifest.py not found. Run from backend/scripts directory.")
        return

    output_dir = Path(__file__).parent.parent / 'texts'
    output_dir.mkdir(exist_ok=True)

    # Select configs based on args
    if args.id:
        configs = [c for c in ALL_TEXTS if c.id == args.id]
        if not configs:
            print(f"Error: No text found with id '{args.id}'")
            return
    elif args.author:
        author_map = {
            'marx': MARX,
            'engels': ENGELS,
            'lenin': LENIN,
            'gramsci': GRAMSCI,
            'lukacs': LUKACS,
            'bakunin': BAKUNIN,
            'kropotkin': KROPOTKIN,
            'goldman': GOLDMAN,
            'luxemburg': LUXEMBURG,
        }
        if args.author.lower() not in author_map:
            print(f"Error: Unknown author '{args.author}'. Valid options: {', '.join(author_map.keys())}")
            return
        configs = author_map[args.author.lower()]
    else:
        configs = ALL_TEXTS

    if args.test > 0:
        configs = configs[:args.test]

    # Track results
    successful = []
    failed = []
    skipped = []

    print(f"\nImporting {len(configs)} texts from Marxists Internet Archive\n")
    print("=" * 60)

    for i, config in enumerate(configs, 1):
        print(f"\n[{i}/{len(configs)}] {config.title}")

        # Check if already exists
        output_path = output_dir / f"{config.id}.json"
        if args.skip_existing and output_path.exists():
            print(f"  Skipping (already exists)")
            skipped.append(config.id)
            continue

        try:
            data = import_text(config)
            if data and data.get('sections'):
                save_text(data, output_dir)
                successful.append(config.id)
            else:
                print(f"  Failed: No sections extracted")
                failed.append(config.id)
        except Exception as e:
            print(f"  Failed: {e}")
            failed.append(config.id)

    # Summary
    print("\n" + "=" * 60)
    print("IMPORT SUMMARY")
    print("=" * 60)
    print(f"  Successful: {len(successful)}")
    print(f"  Failed: {len(failed)}")
    print(f"  Skipped: {len(skipped)}")

    if failed:
        print(f"\n  Failed texts:")
        for text_id in failed:
            print(f"    - {text_id}")


if __name__ == '__main__':
    main()
