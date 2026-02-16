#!/usr/bin/env python3
"""
Re-validate all texts with updated validation criteria.
Updates tracker.json with new results.
"""

import json
import os
from datetime import datetime
from pathlib import Path
from validate_text import validate_text, get_text_info

TEXTS_DIR = Path(__file__).parent.parent.parent / "texts"
TRACKER_PATH = Path(__file__).parent / "tracker.json"

def main():
    # Load current tracker
    with open(TRACKER_PATH) as f:
        tracker = json.load(f)

    # Get all text files
    text_files = sorted([f for f in os.listdir(TEXTS_DIR) if f.endswith('.json')])

    print(f"Re-validating {len(text_files)} texts...")
    print()

    status_counts = {"clean": 0, "needs-reparse": 0, "needs-manual": 0, "error": 0}

    for i, filename in enumerate(text_files):
        filepath = TEXTS_DIR / filename
        text_id = filename.replace('.json', '')

        try:
            is_valid, issues = validate_text(str(filepath))
            info = get_text_info(str(filepath))

            # Categorize issues
            granularity_issues = [iss for iss in issues if 'GRANULARITY' in iss or 'MASSIVE_SECTION' in iss or 'TOO_FEW_SECTIONS' in iss]
            structural_issues = [iss for iss in issues if iss not in granularity_issues]

            # Determine status
            if is_valid:
                status = "clean"
            elif granularity_issues and not structural_issues:
                status = "needs-reparse"  # Only granularity issues - can auto-fix
            else:
                status = "needs-manual"  # Structural issues require review

            status_counts[status] += 1

            # Update tracker
            if text_id in tracker['texts']:
                tracker['texts'][text_id]['status'] = status
                tracker['texts'][text_id]['issues_found'] = issues
                tracker['texts'][text_id]['updated_at'] = datetime.now().isoformat()

            # Progress output
            if not is_valid:
                print(f"[{i+1}/{len(text_files)}] {text_id}: {status}")
                for iss in issues[:3]:
                    print(f"    {iss[:100]}")
                if len(issues) > 3:
                    print(f"    ... and {len(issues) - 3} more issues")

        except Exception as e:
            status_counts["error"] += 1
            print(f"[{i+1}/{len(text_files)}] {text_id}: ERROR - {e}")
            if text_id in tracker['texts']:
                tracker['texts'][text_id]['status'] = "error"
                tracker['texts'][text_id]['issues_found'] = [str(e)]

    # Update metadata
    tracker['metadata']['status_counts'] = status_counts
    tracker['metadata']['updated_at'] = datetime.now().isoformat()

    # Save tracker
    with open(TRACKER_PATH, 'w') as f:
        json.dump(tracker, f, indent=2)

    print()
    print("=" * 50)
    print("SUMMARY")
    print("=" * 50)
    print(f"Clean (ready to use):     {status_counts['clean']}")
    print(f"Needs re-parse:           {status_counts['needs-reparse']}")
    print(f"Needs manual review:      {status_counts['needs-manual']}")
    print(f"Errors:                   {status_counts['error']}")
    print()
    print(f"Tracker updated: {TRACKER_PATH}")

if __name__ == '__main__':
    main()
