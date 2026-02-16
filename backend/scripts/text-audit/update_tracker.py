#!/usr/bin/env python3
"""
Update tracker.json with audit results.
Usage:
  python update_tracker.py <text-id> <status> [--issues "issue1" "issue2"] [--fixed "fix1"] [--notes "note"]

Status must be: clean, fixed, needs-manual, error
"""

import json
import sys
import argparse
from datetime import datetime
from pathlib import Path
import fcntl

TRACKER_PATH = Path(__file__).parent / "tracker.json"

def update_tracker(text_id: str, status: str, issues: list = None, fixed: list = None, notes: str = ""):
    """Update a text's status in the tracker with file locking."""

    # Use file locking to prevent race conditions
    with open(TRACKER_PATH, 'r+') as f:
        fcntl.flock(f.fileno(), fcntl.LOCK_EX)

        data = json.load(f)

        if text_id not in data['texts']:
            print(f"ERROR: Text '{text_id}' not found in tracker")
            return False

        # Update the text entry
        data['texts'][text_id]['status'] = status
        data['texts'][text_id]['issues_found'] = issues or []
        data['texts'][text_id]['updated_at'] = datetime.now().isoformat()

        if notes:
            data['texts'][text_id]['notes'] = notes

        # Track what was fixed (add to notes if provided)
        if fixed:
            fix_note = f"Fixed: {', '.join(fixed)}"
            if data['texts'][text_id]['notes']:
                data['texts'][text_id]['notes'] += f"; {fix_note}"
            else:
                data['texts'][text_id]['notes'] = fix_note

        # Update metadata counts
        status_counts = {"pending": 0, "clean": 0, "fixed": 0, "needs-manual": 0, "error": 0}
        for t in data['texts'].values():
            s = t['status']
            if s in status_counts:
                status_counts[s] += 1
        data['metadata']['status_counts'] = status_counts

        # Write back
        f.seek(0)
        f.truncate()
        json.dump(data, f, indent=2)

        fcntl.flock(f.fileno(), fcntl.LOCK_UN)

    print(f"Updated {text_id}: {status}")
    return True

def main():
    parser = argparse.ArgumentParser(description='Update tracker.json')
    parser.add_argument('text_id', help='Text ID to update')
    parser.add_argument('status', choices=['clean', 'fixed', 'needs-manual', 'error'], help='New status')
    parser.add_argument('--issues', nargs='*', default=[], help='Issues found')
    parser.add_argument('--fixed', nargs='*', default=[], help='Issues that were fixed')
    parser.add_argument('--notes', default='', help='Additional notes')

    args = parser.parse_args()

    success = update_tracker(
        args.text_id,
        args.status,
        issues=args.issues,
        fixed=args.fixed,
        notes=args.notes
    )

    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()
