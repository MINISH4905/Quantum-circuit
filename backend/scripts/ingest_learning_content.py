"""Fetch every text file under Qiskit/documentation's `learning/` tree
(https://github.com/Qiskit/documentation/tree/main/learning) and write it to
a single JSON file — the whole tree structure, every course/module's
metadata, and the full raw + extracted-markdown content of every
.mdx/.ipynb/.json file.

Two-source fetch strategy (avoids GitHub's 60-req/hour unauthenticated API
cap, which a file-by-file ingestion of ~190 files would blow through in one
run):
  - The file/folder LISTING comes from one single GitHub git-trees API call
    (recursive=1) — cheap, one request for the entire repo.
  - Each file's CONTENT is fetched from the jsDelivr CDN mirror
    (cdn.jsdelivr.net/gh/...), which serves raw GitHub content with no
    meaningful rate limit.

Binary assets (images, PDFs) are intentionally not downloaded — only their
tree entries (path/sha/size) are recorded. Every .mdx/.ipynb/.json file's
full text IS fetched and stored, across every course and module, not just
the ones the app's Learner roadmap currently draws from.

Usage:
    python scripts/ingest_learning_content.py [output_path]

    output_path defaults to backend/data/learning_content.json
"""

from __future__ import annotations

import json
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

import httpx

REPO = "Qiskit/documentation"
BRANCH = "main"
ROOT = "learning"
TREE_API = f"https://api.github.com/repos/{REPO}/git/trees/{BRANCH}?recursive=1"
JSDELIVR = f"https://cdn.jsdelivr.net/gh/{REPO}@{BRANCH}/"
TEXT_EXTENSIONS = {"mdx", "ipynb", "json"}

DEFAULT_OUTPUT = Path(__file__).resolve().parent.parent / "data" / "learning_content.json"

FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.DOTALL)
FRONTMATTER_FIELD_RE = re.compile(r'^(\w+):\s*(?:"([^"]*)"|(.+?))\s*$', re.MULTILINE)


def fetch_tree(client: httpx.Client) -> list[dict]:
    print(f"Fetching repo tree from {TREE_API} ...")
    resp = client.get(TREE_API, timeout=30)
    resp.raise_for_status()
    data = resp.json()
    if data.get("truncated"):
        print("WARNING: GitHub tree API response was truncated.", file=sys.stderr)
    entries = [t for t in data["tree"] if t["path"].startswith(f"{ROOT}/")]
    print(f"Found {len(entries)} entries under {ROOT}/")
    return entries


def fetch_raw(client: httpx.Client, path: str, retries: int = 4) -> str:
    last_exc: Exception | None = None
    for attempt in range(retries):
        try:
            resp = client.get(JSDELIVR + path, timeout=45)
            resp.raise_for_status()
            return resp.text
        except (httpx.TimeoutException, httpx.TransportError) as exc:
            last_exc = exc
            wait = 2**attempt
            print(f"  retry {attempt + 1}/{retries} for {path} after {exc!r} (waiting {wait}s)")
            time.sleep(wait)
    raise RuntimeError(f"Failed to fetch {path} after {retries} attempts") from last_exc


def parse_frontmatter(text: str) -> dict[str, str]:
    match = FRONTMATTER_RE.match(text)
    if not match:
        return {}
    fields: dict[str, str] = {}
    for field_match in FRONTMATTER_FIELD_RE.finditer(match.group(1)):
        key = field_match.group(1)
        value = field_match.group(2) if field_match.group(2) is not None else field_match.group(3)
        fields[key] = value.strip()
    return fields


def extract_markdown_from_ipynb(raw: str) -> tuple[str, str | None]:
    """Returns (joined markdown text, title-if-found-in-first-cell-frontmatter)."""
    try:
        notebook = json.loads(raw)
    except json.JSONDecodeError:
        return "", None
    parts: list[str] = []
    title: str | None = None
    for cell in notebook.get("cells", []):
        if cell.get("cell_type") != "markdown":
            continue
        source = "".join(cell.get("source", []))
        if title is None:
            fm = parse_frontmatter(source)
            if fm.get("title"):
                title = fm["title"]
        parts.append(source)
    return "\n\n".join(parts), title


def derive_title(raw: str, file_type: str) -> tuple[str | None, str]:
    """Returns (title, markdown_text)."""
    if file_type == "ipynb":
        markdown_text, title = extract_markdown_from_ipynb(raw)
        if not title:
            heading = re.search(r"^#\s+(.+)$", markdown_text, re.MULTILINE)
            title = heading.group(1).strip() if heading else None
        return title, markdown_text

    if file_type == "mdx":
        fm = parse_frontmatter(raw)
        title = fm.get("title")
        if not title:
            heading = re.search(r"^#\s+(.+)$", raw, re.MULTILINE)
            title = heading.group(1).strip() if heading else None
        return title, raw

    return None, raw  # json: no meaningful title/markdown


def collection_id_for(path: str) -> str | None:
    """learning/courses/<slug>/... -> "courses/<slug>"; learning/modules/<slug>/... -> "modules/<slug>"."""
    parts = path.split("/")
    if len(parts) >= 3 and parts[0] == ROOT and parts[1] in ("courses", "modules"):
        return f"{parts[1]}/{parts[2]}"
    return None


def build_tree_entries(entries: list[dict]) -> list[dict]:
    return [
        {
            "path": e["path"],
            "type": e["type"],
            "sha": e["sha"],
            "sizeBytes": e.get("size"),
            "githubUrl": e.get("url", ""),
        }
        for e in entries
    ]


def build_collections(client: httpx.Client, entries: list[dict]) -> list[dict]:
    index_paths = [e["path"] for e in entries if e["type"] == "blob" and e["path"].endswith("/index.mdx")]
    collections: list[dict] = []

    for path in index_paths:
        cid = collection_id_for(path)
        if not cid:
            continue
        kind = "course" if cid.startswith("courses/") else "module"
        slug = cid.split("/", 1)[1]
        github_path = path.rsplit("/", 1)[0]

        raw = fetch_raw(client, path)
        fm = parse_frontmatter(raw)
        hours = int(fm["hours"]) if fm.get("hours", "").isdigit() else None

        collections.append(
            {
                "id": cid,
                "kind": kind,
                "slug": slug,
                "title": fm.get("title"),
                "description": fm.get("description"),
                "hours": hours,
                "isVideo": fm.get("isVideo") == "true",
                "hasBadge": fm.get("hasBadge") == "true",
                "githubPath": github_path,
                "githubUrl": f"https://github.com/{REPO}/tree/{BRANCH}/{github_path}",
            }
        )

    print(f"Built {len(collections)} collections (courses + modules).")
    return collections


def build_documents(client: httpx.Client, entries: list[dict]) -> list[dict]:
    text_blobs = [e for e in entries if e["type"] == "blob" and e["path"].rsplit(".", 1)[-1] in TEXT_EXTENSIONS]
    print(f"Fetching content for {len(text_blobs)} text files (mdx/ipynb/json) ...")

    documents: list[dict] = []
    for i, entry in enumerate(text_blobs, 1):
        path = entry["path"]
        file_type = path.rsplit(".", 1)[-1]
        raw = fetch_raw(client, path)
        title, markdown_text = derive_title(raw, file_type)

        documents.append(
            {
                "collectionId": collection_id_for(path),
                "path": path,
                "fileName": path.rsplit("/", 1)[-1],
                "fileType": file_type,
                "title": title,
                "rawContent": raw,
                "markdownText": markdown_text,
                "sha": entry["sha"],
                "sizeBytes": entry.get("size"),
                "githubUrl": f"https://github.com/{REPO}/blob/{BRANCH}/{path}",
            }
        )

        if i % 20 == 0 or i == len(text_blobs):
            print(f"  ...{i}/{len(text_blobs)}")

    print(f"Fetched {len(documents)} documents.")
    return documents


def main() -> None:
    output_path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_OUTPUT
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with httpx.Client(headers={"User-Agent": "quantum-circuit-lab-ingest"}) as client:
        entries = fetch_tree(client)
        tree_entries = build_tree_entries(entries)
        collections = build_collections(client, entries)
        documents = build_documents(client, entries)

    payload = {
        "fetchedAt": datetime.now(timezone.utc).isoformat(),
        "source": f"https://github.com/{REPO}/tree/{BRANCH}/{ROOT}",
        "treeEntries": tree_entries,
        "collections": collections,
        "documents": documents,
    }

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    size_mb = output_path.stat().st_size / 1e6
    print(f"Wrote {output_path} ({size_mb:.1f} MB)")


if __name__ == "__main__":
    main()
