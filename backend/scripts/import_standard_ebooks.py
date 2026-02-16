#!/usr/bin/env python3
"""
Import texts from Standard Ebooks HTML format.

Usage:
    python import_standard_ebooks.py                    # Import all texts
    python import_standard_ebooks.py --id mutual-aid   # Import single text
    python import_standard_ebooks.py --list            # List available texts
"""

import argparse
import json
import re
import urllib.request
from html.parser import HTMLParser
from pathlib import Path
from dataclasses import dataclass, field
from typing import Optional, List


@dataclass
class SETextConfig:
    """Configuration for a Standard Ebooks text."""
    id: str
    title: str
    author: str
    year: str
    description: str
    category: str
    url_path: str  # e.g., "peter-kropotkin/mutual-aid"
    translator: Optional[str] = None


# =============================================================================
# STANDARD EBOOKS MANIFEST
# =============================================================================

TEXTS = [
    # Revolutionary / Anarchist (filling gaps from marxists.org)
    SETextConfig(
        id='kropotkin-mutual-aid',
        title='Mutual Aid: A Factor of Evolution',
        author='Peter Kropotkin',
        year='1902',
        description="Kropotkin's scientific argument that cooperation, not competition, is the chief factor in evolution.",
        category='revolutionary',
        url_path='peter-kropotkin/mutual-aid',
    ),
    SETextConfig(
        id='kropotkin-conquest-bread',
        title='The Conquest of Bread',
        author='Peter Kropotkin',
        year='1892',
        description="Kropotkin's vision of an anarchist-communist society based on mutual aid and voluntary cooperation.",
        category='revolutionary',
        url_path='peter-kropotkin/the-conquest-of-bread/chapman-and-hall',
    ),
    SETextConfig(
        id='malatesta-essays',
        title='Essays',
        author='Errico Malatesta',
        year='1891-1931',
        description="Collection of essays by the Italian anarchist on revolution, violence, and social organization.",
        category='revolutionary',
        url_path='errico-malatesta/essays/various-translators',
    ),
    SETextConfig(
        id='proudhon-what-is-property',
        title='What Is Property?',
        author='Pierre-Joseph Proudhon',
        year='1840',
        description="Proudhon's foundational anarchist text arguing that property is theft.",
        category='revolutionary',
        url_path='pierre-joseph-proudhon/what-is-property/benjamin-tucker',
        translator='Benjamin Tucker',
    ),
    SETextConfig(
        id='jean-grave-moribund-society',
        title='Moribund Society and Anarchy',
        author='Jean Grave',
        year='1893',
        description="French anarchist critique of bourgeois society and vision of anarchist transformation.",
        category='revolutionary',
        url_path='jean-grave/moribund-society-and-anarchy/voltairine-de-cleyre',
        translator='Voltairine de Cleyre',
    ),

    # 20th Century Analytic (texts we couldn't get from Gutenberg)
    SETextConfig(
        id='tractatus',
        title='Tractatus Logico-Philosophicus',
        author='Ludwig Wittgenstein',
        year='1921',
        description="Wittgenstein's early masterpiece on the relationship between language, thought, and reality.",
        category='20th-century',
        url_path='ludwig-wittgenstein/tractatus-logico-philosophicus/c-k-ogden',
        translator='C.K. Ogden',
    ),

    # Women Philosophers
    SETextConfig(
        id='addams-democracy-social-ethics',
        title='Democracy and Social Ethics',
        author='Jane Addams',
        year='1902',
        description="Addams' progressive philosophy connecting democracy to everyday social relationships.",
        category='20th-century',
        url_path='jane-addams/democracy-and-social-ethics',
    ),
    SETextConfig(
        id='cooper-voice-from-south',
        title='A Voice from the South',
        author='Anna Julia Cooper',
        year='1892',
        description="Pioneering work on Black feminism, education, and the intersection of race and gender.",
        category='19th-century',
        url_path='anna-julia-cooper/a-voice-from-the-south',
    ),
    SETextConfig(
        id='gilman-women-economics',
        title='Women and Economics',
        author='Charlotte Perkins Gilman',
        year='1898',
        description="Gilman's feminist analysis of women's economic dependence and its social consequences.",
        category='19th-century',
        url_path='charlotte-perkins-gilman/women-and-economics',
    ),
    SETextConfig(
        id='follett-new-state',
        title='The New State',
        author='Mary Parker Follett',
        year='1918',
        description="Follett's theory of participatory democracy and group organization.",
        category='20th-century',
        url_path='mary-parker-follett/the-new-state',
    ),

    # Ancient (better versions)
    SETextConfig(
        id='diogenes-laertius-lives',
        title='The Lives and Opinions of Eminent Philosophers',
        author='Diogenes Laërtius',
        year='c. 230 CE',
        description="The principal surviving source for the history of ancient Greek philosophy.",
        category='ancient',
        url_path='diogenes-laertius/the-lives-and-opinions-of-eminent-philosophers/c-d-yonge',
        translator='C.D. Yonge',
    ),
    SETextConfig(
        id='seneca-dialogues',
        title='Dialogues',
        author='Seneca',
        year='c. 40-65 CE',
        description="Seneca's philosophical dialogues on anger, providence, tranquility, and the shortness of life.",
        category='ancient',
        url_path='seneca/dialogues/aubrey-stewart',
        translator='Aubrey Stewart',
    ),
    SETextConfig(
        id='cicero-tusculan-disputations',
        title='Tusculan Disputations',
        author='Cicero',
        year='45 BCE',
        description="Cicero's philosophical dialogues on death, pain, grief, emotions, and virtue.",
        category='ancient',
        url_path='cicero/tusculan-disputations/c-d-yonge',
        translator='C.D. Yonge',
    ),

    # Medieval
    SETextConfig(
        id='boethius-consolation-se',
        title='The Consolation of Philosophy',
        author='Boethius',
        year='523 CE',
        description="Boethius's meditation on fortune, happiness, and providence written while awaiting execution.",
        category='medieval',
        url_path='boethius/the-consolation-of-philosophy/h-r-james',
        translator='H.R. James',
    ),

    # Enlightenment
    SETextConfig(
        id='descartes-philosophical-works',
        title='Philosophical Works',
        author='René Descartes',
        year='1637-1649',
        description="Descartes' major philosophical works including Discourse on Method and Meditations.",
        category='enlightenment',
        url_path='rene-descartes/philosophical-works/john-veitch',
        translator='John Veitch',
    ),

    # Social/Political Philosophy
    SETextConfig(
        id='le-bon-crowd',
        title='The Crowd: A Study of the Popular Mind',
        author='Gustave Le Bon',
        year='1895',
        description="Influential study of crowd psychology and mass behavior.",
        category='19th-century',
        url_path='gustave-le-bon/the-crowd/t-fisher-unwin-ltd',
    ),
    SETextConfig(
        id='hobhouse-liberalism',
        title='Liberalism',
        author='L.T. Hobhouse',
        year='1911',
        description="Classic exposition of New Liberalism and social reform.",
        category='20th-century',
        url_path='l-t-hobhouse/liberalism',
    ),
    SETextConfig(
        id='tawney-acquisitive-society',
        title='The Acquisitive Society',
        author='R.H. Tawney',
        year='1920',
        description="Tawney's critique of capitalism's acquisitive ethos and argument for functional society.",
        category='20th-century',
        url_path='r-h-tawney/the-acquisitive-society',
    ),
    SETextConfig(
        id='veblen-leisure-class',
        title='The Theory of the Leisure Class',
        author='Thorstein Veblen',
        year='1899',
        description="Veblen's satirical analysis of conspicuous consumption and status competition.",
        category='19th-century',
        url_path='thorstein-veblen/the-theory-of-the-leisure-class',
    ),
]


@dataclass
class Section:
    """A section of text."""
    book: int
    number: int
    title: str
    content: str


class StandardEbooksParser(HTMLParser):
    """Parse Standard Ebooks single-page HTML to extract structured text."""

    def __init__(self):
        super().__init__()
        self.sections: List[Section] = []
        self.current_book = 1
        self.current_section = 0
        self.current_title = ""
        self.current_content = []
        self.in_bodymatter = False
        self.in_chapter = False
        self.in_header = False
        self.in_p = False
        self.in_blockquote = False
        self.skip_content = False
        self.depth = 0  # Track nesting depth

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        epub_type = attrs_dict.get('epub:type', '')
        section_id = attrs_dict.get('id', '')

        # Skip front matter and back matter
        if 'frontmatter' in epub_type or 'backmatter' in epub_type:
            self.skip_content = True
            return

        if 'bodymatter' in epub_type:
            self.in_bodymatter = True

        if tag == 'section' and self.in_bodymatter and not self.skip_content:
            self.depth += 1
            # Detect book/part boundaries
            if section_id.startswith('part-') or section_id.startswith('book-'):
                part_match = re.match(r'(?:part|book)-(\d+)', section_id)
                if part_match:
                    self.current_book = int(part_match.group(1))
            # Detect chapter boundaries
            elif section_id.startswith('chapter-') or 'chapter' in epub_type:
                self._save_current_section()
                self.current_section += 1
                self.current_content = []
                self.current_title = ""
                self.in_chapter = True

        elif tag in ('header', 'hgroup'):
            self.in_header = True

        elif tag == 'p' and not self.skip_content and self.in_bodymatter:
            self.in_p = True

        elif tag == 'blockquote':
            self.in_blockquote = True
            if self.current_content:
                self.current_content.append('\n')

    def handle_endtag(self, tag):
        if tag == 'section':
            if self.depth > 0:
                self.depth -= 1
            if self.in_chapter and self.depth == 0:
                self.in_chapter = False
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
        if self.skip_content or not self.in_bodymatter:
            return

        text = data.strip()
        if not text:
            return

        if self.in_header:
            if self.current_title:
                self.current_title += " "
            self.current_title += text
        elif self.in_p or self.in_blockquote:
            # Normalize whitespace
            text = ' '.join(data.split())
            if text:
                self.current_content.append(text)

    def _save_current_section(self):
        if self.current_content:
            content = ''.join(self.current_content).strip()
            content = re.sub(r'\n{3,}', '\n\n', content)
            if content and len(content) > 50:  # Skip very short sections
                self.sections.append(Section(
                    book=self.current_book,
                    number=self.current_section,
                    title=self.current_title,
                    content=content
                ))

    def finalize(self):
        """Call this after parsing is complete."""
        self._save_current_section()


def fetch_standard_ebooks(url_path: str) -> str:
    """Fetch single-page HTML from Standard Ebooks."""
    url = f"https://standardebooks.org/ebooks/{url_path}/text/single-page"
    print(f"  Fetching: {url}")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=120) as response:
        return response.read().decode('utf-8')


def import_text(config: SETextConfig, output_dir: Path) -> bool:
    """Import a single text from Standard Ebooks."""
    print(f"\nImporting: {config.title} by {config.author}")

    try:
        html = fetch_standard_ebooks(config.url_path)
    except Exception as e:
        print(f"  ERROR: Failed to fetch - {e}")
        return False

    # Parse HTML
    parser = StandardEbooksParser()
    parser.feed(html)
    parser.finalize()

    if not parser.sections:
        print(f"  ERROR: No sections extracted")
        return False

    # Build JSON structure
    sections = []
    for sec in parser.sections:
        section_data = {
            "book": sec.book,
            "number": sec.number,
            "content": sec.content
        }
        if sec.title:
            section_data["title"] = sec.title
        sections.append(section_data)

    data = {
        "id": config.id,
        "title": config.title,
        "author": config.author,
        "year": config.year,
        "description": config.description,
        "category": config.category,
        "source": "standardebooks.org",
        "sections": sections
    }

    if config.translator:
        data["translator"] = config.translator

    # Write JSON
    output_path = output_dir / f"{config.id}.json"
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"  Saved: {len(sections)} sections to {output_path}")
    return True


def main():
    parser = argparse.ArgumentParser(description='Import texts from Standard Ebooks')
    parser.add_argument('--id', help='Import a specific text by ID')
    parser.add_argument('--list', action='store_true', help='List all available texts')
    parser.add_argument('--force', action='store_true', help='Overwrite existing files')
    args = parser.parse_args()

    output_dir = Path(__file__).parent.parent / "texts"

    if args.list:
        print("Available Standard Ebooks texts:\n")
        for config in TEXTS:
            print(f"  {config.id}: {config.title} by {config.author}")
        print(f"\nTotal: {len(TEXTS)} texts")
        return

    # Filter texts to import
    if args.id:
        texts_to_import = [c for c in TEXTS if c.id == args.id]
        if not texts_to_import:
            print(f"ERROR: Text '{args.id}' not found in manifest")
            print("Use --list to see available texts")
            return
    else:
        texts_to_import = TEXTS

    # Skip existing unless --force
    if not args.force:
        filtered = []
        for config in texts_to_import:
            output_path = output_dir / f"{config.id}.json"
            if output_path.exists():
                print(f"Skipping {config.id} (already exists, use --force to overwrite)")
            else:
                filtered.append(config)
        texts_to_import = filtered

    if not texts_to_import:
        print("No texts to import")
        return

    print(f"Importing {len(texts_to_import)} texts from Standard Ebooks\n")
    print("=" * 60)

    success = 0
    failed = 0

    for i, config in enumerate(texts_to_import, 1):
        print(f"\n[{i}/{len(texts_to_import)}] {config.title}")
        if import_text(config, output_dir):
            success += 1
        else:
            failed += 1

    print("\n" + "=" * 60)
    print("IMPORT SUMMARY")
    print("=" * 60)
    print(f"  Successful: {success}")
    print(f"  Failed: {failed}")


if __name__ == '__main__':
    main()
