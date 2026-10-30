#!/usr/bin/env python3
"""
Download philosopher portraits from Wikimedia Commons and self-host them.

Reads src/data/philosopherImages.ts, fetches each image through the Commons API
(which returns a valid thumbnail size plus license/author), converts it to a
400px-wide WebP in public/philosophers/, writes public/philosophers/credits.json,
and rewrites the data file to point at the local copies.

Hotlinking broke in 2026: Commons began rejecting non-standard thumbnail widths
and rate-limits pages that load ~150 images at once.

Usage (from frontend/):
    python3 scripts/fetch_philosopher_images.py
Requires `cwebp` (brew install webp).
"""

import json
import re
import subprocess
import tempfile
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_FILE = ROOT / "src" / "data" / "philosopherImages.ts"
OUT_DIR = ROOT / "public" / "philosophers"
USER_AGENT = "PhilosophyInsight/1.0 (https://www.philosophyinsight.com; portrait sync script)"
WIDTH = 400
ENTRY_PATTERN = re.compile(r"^(\s*)(['\"])(.+?)\2:\s*'(https://upload\.wikimedia\.org/[^']+)',?\s*$")


def get(url: str, attempts: int = 6) -> bytes:
    """GET with a descriptive User-Agent, backing off on rate limits."""
    for attempt in range(attempts):
        request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                return response.read()
        except urllib.error.HTTPError as e:
            if e.code not in (429, 503) or attempt == attempts - 1:
                raise
            time.sleep(int(e.headers.get("Retry-After") or 0) or 5 * 2 ** attempt)
    raise RuntimeError("unreachable")


def commons_filename(url: str) -> str:
    """Extract the Commons file name from an original or thumbnail URL."""
    parts = urllib.parse.urlparse(url).path.split("/")
    if "thumb" in parts:
        return urllib.parse.unquote(parts[parts.index("thumb") + 3])
    return urllib.parse.unquote(parts[-1])


def slugify(name: str) -> str:
    ascii_name = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", ascii_name.lower()).strip("-")


def strip_html(value: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", value or "")).strip()


def image_info(filename: str) -> dict:
    query = urllib.parse.urlencode({
        "action": "query", "format": "json", "titles": f"File:{filename}",
        "prop": "imageinfo", "iiprop": "url|extmetadata", "iiurlwidth": 500,
    })
    pages = json.loads(get(f"https://commons.wikimedia.org/w/api.php?{query}"))["query"]["pages"]
    info = next(iter(pages.values()))["imageinfo"][0]
    meta = info.get("extmetadata", {})
    return {
        "download_url": info.get("thumburl") or info["url"],
        "source": info["descriptionurl"],
        "license": strip_html(meta.get("LicenseShortName", {}).get("value", "")),
        "artist": strip_html(meta.get("Artist", {}).get("value", "")),
    }


def main():
    lines = DATA_FILE.read_text().splitlines()
    entries = [(i, m) for i, line in enumerate(lines) if (m := ENTRY_PATTERN.match(line))]
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    local_by_url: dict[str, str] = {}
    credits_path = OUT_DIR / "credits.json"
    # Merge with earlier runs, which only processed entries still pointing at Commons
    credits = {c["file"]: c for c in json.loads(credits_path.read_text())} if credits_path.exists() else {}
    failures = []
    for n, (i, match) in enumerate(entries, 1):
        indent, quote, name, url = match.groups()
        if url not in local_by_url:
            slug = slugify(name)
            out_path = OUT_DIR / f"{slug}.webp"
            try:
                info = image_info(commons_filename(url))
                if not out_path.exists():
                    with tempfile.NamedTemporaryFile(suffix=Path(info["download_url"]).suffix) as tmp:
                        tmp.write(get(info["download_url"]))
                        tmp.flush()
                        subprocess.run(
                            ["cwebp", "-quiet", "-q", "80", "-resize", str(WIDTH), "0", tmp.name, "-o", str(out_path)],
                            check=True,
                        )
                    time.sleep(1)  # Be polite to Commons
                local_by_url[url] = f"/philosophers/{slug}.webp"
                credits[out_path.name] = {"philosopher": name, "file": out_path.name, **{k: info[k] for k in ("source", "license", "artist")}}
                print(f"[{n}/{len(entries)}] {name}", flush=True)
            except Exception as e:
                failures.append((name, str(e)))
                print(f"[{n}/{len(entries)}] FAILED {name}: {e}", flush=True)
                continue
        lines[i] = f"{indent}{quote}{name}{quote}: '{local_by_url[url]}',"

    lines = [
        "// Philosopher portraits from Wikimedia Commons, self-hosted in public/philosophers/.",
        "// Regenerate with scripts/fetch_philosopher_images.py; sources and licenses in credits.json.",
    ] + [line for line in lines if not line.startswith("// Philosopher portraits (from Wikipedia)")]
    DATA_FILE.write_text("\n".join(lines) + "\n")
    credits_path.write_text(json.dumps(sorted(credits.values(), key=lambda c: c["file"]), indent=2, ensure_ascii=False) + "\n")

    print(f"\nDone: {len(local_by_url)} images, {len(failures)} failures")
    for name, error in failures:
        print(f"  {name}: {error}")


if __name__ == "__main__":
    main()
