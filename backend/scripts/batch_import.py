#!/usr/bin/env python3
"""
Batch import all texts from the manifest.
Tracks progress and handles failures gracefully.
"""

import sys
import json
import time
from pathlib import Path
from datetime import datetime

from text_manifest import NEW_TEXTS, ALL_TEXTS, EXISTING_IDS
from import_gutenberg import import_text, save_text, TextConfig


def batch_import(texts: list[TextConfig], output_dir: Path, skip_existing: bool = True):
    """
    Import all texts, tracking successes and failures.
    """
    results = {
        'successes': [],
        'failures': [],
        'skipped': [],
    }

    total = len(texts)
    print(f"\n{'='*60}")
    print(f"BATCH IMPORT: {total} texts")
    print(f"Output directory: {output_dir}")
    print(f"{'='*60}\n")

    for i, config in enumerate(texts, 1):
        print(f"\n[{i}/{total}] ", end='')

        # Check if already exists
        output_path = output_dir / f"{config.id}.json"
        if skip_existing and output_path.exists():
            print(f"SKIP: {config.title} (already exists)")
            results['skipped'].append(config.id)
            continue

        try:
            data = import_text(config)
            save_text(data, output_dir)
            results['successes'].append({
                'id': config.id,
                'title': config.title,
                'sections': len(data['sections']),
            })
            print(f"  ✓ SUCCESS: {len(data['sections'])} sections")

            # Small delay to be nice to Gutenberg
            time.sleep(0.5)

        except Exception as e:
            print(f"  ✗ FAILED: {config.title}")
            print(f"    Error: {e}")
            results['failures'].append({
                'id': config.id,
                'title': config.title,
                'error': str(e),
            })

    # Summary
    print(f"\n{'='*60}")
    print("IMPORT COMPLETE")
    print(f"{'='*60}")
    print(f"  Successes: {len(results['successes'])}")
    print(f"  Failures:  {len(results['failures'])}")
    print(f"  Skipped:   {len(results['skipped'])}")

    if results['failures']:
        print(f"\nFailed texts:")
        for f in results['failures']:
            print(f"  - {f['title']}: {f['error'][:50]}...")

    # Save results log (in scripts dir, not texts dir)
    log_dir = Path(__file__).parent / 'logs'
    log_dir.mkdir(exist_ok=True)
    log_path = log_dir / f"import_log_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(log_path, 'w') as f:
        json.dump(results, f, indent=2)
    print(f"\nLog saved to: {log_path}")

    return results


def main():
    import argparse
    parser = argparse.ArgumentParser(description='Batch import philosophy texts')
    parser.add_argument('--all', action='store_true', help='Import all texts (including existing)')
    parser.add_argument('--test', type=int, help='Import only first N texts for testing')
    parser.add_argument('--id', type=str, help='Import a single text by ID')
    args = parser.parse_args()

    output_dir = Path(__file__).parent.parent / 'texts'
    output_dir.mkdir(exist_ok=True)

    if args.id:
        # Import single text
        text = next((t for t in ALL_TEXTS if t.id == args.id), None)
        if not text:
            print(f"Error: Text '{args.id}' not found in manifest")
            print(f"Available IDs: {[t.id for t in ALL_TEXTS]}")
            sys.exit(1)
        batch_import([text], output_dir, skip_existing=False)

    elif args.test:
        # Test mode: import first N new texts
        batch_import(NEW_TEXTS[:args.test], output_dir)

    elif args.all:
        # Import all texts
        batch_import(ALL_TEXTS, output_dir, skip_existing=False)

    else:
        # Import only new texts
        batch_import(NEW_TEXTS, output_dir)


if __name__ == '__main__':
    main()
