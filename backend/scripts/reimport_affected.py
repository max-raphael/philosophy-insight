#!/usr/bin/env python3
"""
Re-import texts that had structure marker issues.
Uses the improved parser to properly split on §, CHAPTER, CHAP, etc.
"""

import sys
from pathlib import Path

# Add parent to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from scripts.import_gutenberg import import_text, save_text
from scripts.text_manifest import ALL_TEXTS

# IDs of texts with structure issues (from audit_text_structure_v2.py results)
AFFECTED_TEXT_IDS = [
    # Severe (>10 true structure markers)
    'analects',
    'system-of-logic',
    'academica',
    'methods-of-ethics',
    'critique-of-judgment',
    'first-principles',
    'discourses-on-livy',
    'world-as-will-and-representation',
    'essay-concerning-human-understanding',
    'theory-of-moral-sentiments',
    'prolegomena',
    'essays-montaigne',
    'treatise-of-human-nature',
    'leviathan',
    'wisdom-of-confucius',
    'thus-spoke-zarathustra',
    'bhagavad-gita',
    'chinese-classics',
    'principles-of-psychology-vol-2',
    'essence-of-christianity',
    'mahabharata-vol-2',
    'critique-of-pure-reason',
    'enquiry-concerning-human-understanding',
    'life-of-reason',

    # Moderate (3-10 true structure markers)
    'principles-of-psychology-vol-1',
    'theological-political-treatise',
    'enquiry-concerning-morals',
    'jataka-tales',
    'chance-love-and-logic',
    'rights-of-man',
    'unto-this-last',
    'god-and-the-state',
    'on-duties',
    'perpetual-peace',
    'yoga-sutras',
    'art-of-war',
    'democracy-in-america',
    'lives-of-philosophers',
    'twilight-of-the-idols',

    # Minor (<3 true structure markers)
    'age-of-reason',
    'antichrist',
    'categories',
    'city-of-god',
    'communist-manifesto',
    'ecce-homo',
    'enneads-vol-1',
    'festival-of-spring',
    'genealogy-of-morals',
    'jnana-yoga',
    'mutual-aid',
    'nicomachean-ethics',
    'novum-organum',
    'on-the-soul',
    'philosophical-dictionary',
    'ramayana',
    'religion-of-the-samurai',
    'sacred-books-of-east',
    'the-prince',
    'varieties-of-religious-experience',
    'what-is-property',
    'zen-experience',
]


def main():
    output_dir = Path(__file__).parent.parent / 'texts'

    # Build lookup of text configs by ID
    text_configs = {config.id: config for config in ALL_TEXTS}

    # Filter to affected texts
    to_reimport = []
    missing = []
    for text_id in AFFECTED_TEXT_IDS:
        if text_id in text_configs:
            to_reimport.append(text_configs[text_id])
        else:
            missing.append(text_id)

    if missing:
        print(f"Warning: {len(missing)} text IDs not found in manifest:")
        for m in missing[:10]:
            print(f"  - {m}")
        if len(missing) > 10:
            print(f"  ... and {len(missing) - 10} more")
        print()

    print(f"Re-importing {len(to_reimport)} texts with improved parser...\n")

    success = 0
    failed = []

    for i, config in enumerate(to_reimport, 1):
        print(f"[{i}/{len(to_reimport)}] ", end='')
        try:
            data = import_text(config)
            save_text(data, output_dir)
            success += 1
        except Exception as e:
            print(f"  ERROR: {e}")
            failed.append((config.id, str(e)))

    print(f"\n{'='*60}")
    print(f"COMPLETE: {success}/{len(to_reimport)} texts re-imported successfully")
    if failed:
        print(f"\nFailed ({len(failed)}):")
        for text_id, error in failed:
            print(f"  - {text_id}: {error}")


if __name__ == '__main__':
    main()
