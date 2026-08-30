"""
Collect one framework's sources into knowledge_base/<framework>/<doc_type>/.

Run one framework at a time:

    python knowledge_base/_ingest/collect.py qiskit
    python knowledge_base/_ingest/collect.py cirq
    python knowledge_base/_ingest/collect.py pennylane

Each run rewrites only its own framework's folders and merges its results into
source_manifest.json / ingestion_summary.md, so the three runs are independent
and re-runnable.
"""

from __future__ import annotations

import argparse
import json
import shutil
import sys
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import extract  # noqa: E402
import fetch  # noqa: E402
from config import (  # noqa: E402
    DOC_TYPES,
    FRAMEWORKS,
    GALLERY_PROSE_REPOS,
    PROSE_EXTENSIONS,
    REPOS,
    SKIP_DIR_PARTS,
    Repo,
)

KB_ROOT = Path(__file__).resolve().parent.parent
MANIFEST = KB_ROOT / "source_manifest.json"
SUMMARY = KB_ROOT / "ingestion_summary.md"

# Guard against a pathological file blowing up a single output document.
# Notebooks get a far higher ceiling because their bulk is base64 output images,
# which extract_notebook discards — cirq's visualizing_calibration_metrics.ipynb
# is 1.5MB+ on disk but only a few KB of actual markdown and code.
MAX_BYTES = 1_500_000
MAX_BYTES_NOTEBOOK = 40_000_000


def flat_name(rel_path: str) -> str:
    """Flatten a repo-relative path into a unique, filesystem-safe filename."""
    cleaned = rel_path.replace("\\", "/").strip("/")
    for ext in (".ipynb", ".mdx", ".md", ".rst", ".py"):
        if cleaned.endswith(ext):
            cleaned = cleaned[: -len(ext)]
            break
    safe = "".join(c if (c.isalnum() or c in "-_.") else "__" for c in cleaned)
    return f"{safe[:180]}.md"


def frontmatter(fw: str, ref: str, doc_type: str, src_path: str, url: str, lic: str) -> str:
    return (
        "---\n"
        f"framework: {fw}\n"
        f"api_version: {ref}\n"
        f"doc_type: {doc_type}\n"
        f"source_path: {src_path}\n"
        f"source_url: {url}\n"
        f"license: {lic}\n"
        "---\n\n"
    )


def should_skip(rel: Path) -> bool:
    return any(part in SKIP_DIR_PARTS for part in rel.parts)


def prose_doc_type(repo: Repo, rel_posix: str) -> str | None:
    """Longest-prefix wins, so docs/api/qiskit/transpiler beats docs/api/qiskit."""
    best: tuple[int, str] | None = None
    for rule in repo.prose_rules:
        if rel_posix.startswith(rule.prefix) and (best is None or len(rule.prefix) > best[0]):
            best = (len(rule.prefix), rule.doc_type)
    return best[1] if best else None


class Collector:
    def __init__(self, framework: str) -> None:
        self.framework = framework
        self.counts: dict[str, int] = defaultdict(int)
        self.failures: list[dict] = []
        self.stray_exception_files: list[str] = []
        self.repos_done: list[dict] = []

    def record_failure(self, repo: str, path: str, reason: str) -> None:
        self.failures.append({"repo": repo, "source_path": path, "reason": reason})

    def write(self, doc_type: str, name: str, body: str) -> None:
        out = KB_ROOT / self.framework / doc_type / name
        out.write_text(body, encoding="utf-8")
        self.counts[doc_type] += 1

    def collect_repo(self, repo: Repo, checkout: Path, commit: str) -> None:
        ref_label = repo.ref if repo.ref_kind == "tag" else commit[:12]
        base_url = f"{repo.url}/blob/{commit}"

        for path in sorted(checkout.rglob("*")):
            if not path.is_file():
                continue
            rel = path.relative_to(checkout)
            if should_skip(rel):
                continue
            rel_posix = rel.as_posix()
            suffix = path.suffix.lower()

            is_gallery_py = repo.key in GALLERY_PROSE_REPOS and suffix == ".py"
            is_prose = suffix in PROSE_EXTENSIONS or is_gallery_py
            is_source = suffix == ".py" and not is_gallery_py

            if is_prose:
                doc_type = prose_doc_type(repo, rel_posix)
                if doc_type is None:
                    continue
                self._emit_prose(repo, path, rel_posix, doc_type, ref_label, base_url)
            elif is_source and repo.source_roots:
                if not any(rel_posix.startswith(root) for root in repo.source_roots):
                    continue
                self._emit_source(repo, path, rel_posix, ref_label, base_url)

        self.repos_done.append(
            {
                "repo": repo.key,
                "url": repo.url,
                "ref": repo.ref,
                "ref_kind": repo.ref_kind,
                "commit": commit,
                "license": repo.license,
                "sparse_paths": repo.sparse_paths,
            }
        )

    def _read(self, repo: Repo, path: Path, rel_posix: str) -> str | None:
        try:
            ceiling = MAX_BYTES_NOTEBOOK if path.suffix.lower() == ".ipynb" else MAX_BYTES
            if path.stat().st_size > ceiling:
                self.record_failure(repo.key, rel_posix, f"skipped: exceeds {ceiling} bytes")
                return None
            return path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            self.record_failure(repo.key, rel_posix, "skipped: not valid UTF-8")
        except OSError as exc:
            self.record_failure(repo.key, rel_posix, f"skipped: read error ({exc})")
        return None

    def _emit_prose(
        self, repo: Repo, path: Path, rel_posix: str, doc_type: str, ref_label: str, base_url: str
    ) -> None:
        raw = self._read(repo, path, rel_posix)
        if raw is None:
            return
        try:
            # Notebooks get cleaned too: these .ipynb files carry their own
            # YAML frontmatter inside the first markdown cell, which would
            # otherwise emit a second `---` block and break YAML parsing.
            suffix = path.suffix.lower()
            if suffix == ".ipynb":
                body = extract.clean_prose(extract.extract_notebook(raw))
            elif suffix == ".py":
                # sphinx-gallery demo: narrative and code are interleaved.
                body = extract.extract_gallery_py(raw)
            else:
                body = extract.clean_prose(raw)
        except extract.ExtractError as exc:
            self.record_failure(repo.key, rel_posix, f"parse failed: {exc}")
            return
        if not body.strip():
            self.record_failure(repo.key, rel_posix, "skipped: empty after cleaning")
            return
        head = frontmatter(
            self.framework, ref_label, doc_type, rel_posix, f"{base_url}/{rel_posix}", repo.license
        )
        self.write(doc_type, flat_name(f"{repo.key.split('/')[-1]}/{rel_posix}"), head + body)

    def _emit_source(
        self, repo: Repo, path: Path, rel_posix: str, ref_label: str, base_url: str
    ) -> None:
        raw = self._read(repo, path, rel_posix)
        if raw is None:
            return
        try:
            body, _stats = extract.extract_docstrings(raw, rel_posix)
        except extract.ExtractError as exc:
            reason = str(exc)
            # "no public documented definitions" is the expected outcome for
            # __init__ stubs and private modules — not worth reporting as a
            # failure, but genuine parse errors are.
            if "no public documented" not in reason:
                self.record_failure(repo.key, rel_posix, f"parse failed: {reason}")
            return
        doc_type, _ = extract.classify_python(rel_posix, raw)
        url = f"{base_url}/{rel_posix}"
        name = flat_name(f"{repo.key.split('/')[-1]}/{rel_posix}")

        head = frontmatter(self.framework, ref_label, doc_type, rel_posix, url, repo.license)
        self.write(doc_type, name, head + body)

        # Companion error/ file for the exception + validation surface living
        # inside an otherwise-API module. Nothing is merged — this file still
        # derives from this one source file.
        if doc_type != "error":
            err_body = extract.extract_error_surface(raw, rel_posix)
            if err_body:
                self.stray_exception_files.append(f"{repo.key}:{rel_posix}")
                err_head = frontmatter(self.framework, ref_label, "error", rel_posix, url, repo.license)
                self.write("error", name, err_head + err_body)


def merge_manifest(framework: str, repos_done: list[dict], counts: dict[str, int]) -> dict:
    data = {"generated_at": None, "frameworks": {}}
    if MANIFEST.exists():
        try:
            data = json.loads(MANIFEST.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            pass
    data.setdefault("frameworks", {})
    data["generated_at"] = datetime.now(timezone.utc).isoformat()
    data["frameworks"][framework] = {
        "repos": repos_done,
        "file_counts": {dt: counts.get(dt, 0) for dt in DOC_TYPES},
        "total_files": sum(counts.values()),
        "collected_at": datetime.now(timezone.utc).isoformat(),
    }
    MANIFEST.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
    return data


def write_summary(data: dict, failures_by_fw: dict[str, list[dict]], strays: dict[str, list[str]]) -> None:
    lines = [
        "# Ingestion summary",
        "",
        f"Generated {data.get('generated_at', 'unknown')}",
        "",
        "## File counts",
        "",
        "| Framework | concept | api | error | optimization | total |",
        "|---|---:|---:|---:|---:|---:|",
    ]
    grand = 0
    for fw in FRAMEWORKS:
        entry = data.get("frameworks", {}).get(fw)
        if not entry:
            lines.append(f"| {fw} | – | – | – | – | not yet collected |")
            continue
        c = entry["file_counts"]
        grand += entry["total_files"]
        lines.append(
            f"| {fw} | {c['concept']} | {c['api']} | {c['error']} | "
            f"{c['optimization']} | {entry['total_files']} |"
        )
    lines += ["", f"**Total files collected: {grand}**", "", "## Pinned sources", ""]
    lines += ["| Repo | Ref | Kind | Commit | License |", "|---|---|---|---|---|"]
    for fw in FRAMEWORKS:
        entry = data.get("frameworks", {}).get(fw)
        if not entry:
            continue
        for r in entry["repos"]:
            lines.append(
                f"| `{r['repo']}` | `{r['ref']}` | {r['ref_kind']} | `{r['commit'][:12]}` | {r['license']} |"
            )

    lines += ["", "## Skipped and failed files", ""]
    total_failures = sum(len(v) for v in failures_by_fw.values())
    if total_failures == 0:
        lines.append("None — every candidate file was collected.")
    else:
        lines.append(f"{total_failures} file(s) were not collected. None were dropped silently.")
        lines += ["", "| Framework | Repo | Path | Reason |", "|---|---|---|---|"]
        for fw, items in failures_by_fw.items():
            for f in items:
                lines.append(f"| {fw} | `{f['repo']}` | `{f['source_path']}` | {f['reason']} |")

    lines += [
        "",
        "## How Python modules are classified",
        "",
        "Each Python module gets a **primary** `doc_type`, by this precedence:",
        "",
        "1. **error** — the module is named for exceptions (`exceptions.py`,",
        "   `errors.py`), or every public class derives from an exception *and*",
        "   the module exposes no public functions. The function check matters:",
        "   `cirq/linalg/transformations.py` defines ~30 public functions and one",
        "   `EntangledStateError`, and a classes-only rule mislabelled the whole",
        "   module as `error`.",
        "2. **optimization** — the path sits under a transpiler-pass, transformer",
        "   or optimizer module.",
        "3. **api** — everything else.",
        "",
        "### Companion error files",
        "",
        "Exception and validation docstrings frequently live inside ordinary API",
        "modules rather than a dedicated `exceptions.py`. Restricting `error/` to",
        "exception-only modules left it nearly empty — Cirq defines just three",
        "exception classes in `cirq-core` and documents only one of them.",
        "",
        "So a module whose primary type is not `error` **also** emits a companion",
        "file into `error/` containing just its exception classes and `validate_*`",
        "callables. Nothing is merged: each output file still derives from exactly",
        "one source file, so the one-output-per-source rule holds. This is why the",
        "same filename can appear in both `api/` and `error/`.",
        "",
        "Modules that produced a companion `error/` file:",
        "",
    ]
    total_strays = sum(len(v) for v in strays.values())
    if total_strays == 0:
        lines.append("None.")
    else:
        lines.append(f"{total_strays} file(s). Listed per framework:")
        lines.append("")
        for fw in FRAMEWORKS:
            items = strays.get(fw, [])
            if items:
                lines.append(f"<details><summary>{fw} ({len(items)})</summary>")
                lines.append("")
                for s in items:
                    lines.append(f"- `{s}`")
                lines.append("")
                lines.append("</details>")
                lines.append("")
    SUMMARY.write_text("\n".join(lines) + "\n", encoding="utf-8")


def load_side_state() -> tuple[dict, dict]:
    path = KB_ROOT / "_ingest" / ".state.json"
    if path.exists():
        try:
            s = json.loads(path.read_text(encoding="utf-8"))
            return s.get("failures", {}), s.get("strays", {})
        except json.JSONDecodeError:
            pass
    return {}, {}


def save_side_state(failures: dict, strays: dict) -> None:
    path = KB_ROOT / "_ingest" / ".state.json"
    path.write_text(json.dumps({"failures": failures, "strays": strays}, indent=2), encoding="utf-8")


def main() -> int:
    ap = argparse.ArgumentParser(description="Collect one framework's docs into knowledge_base/")
    ap.add_argument("framework", choices=FRAMEWORKS)
    ap.add_argument("--keep-sources", action="store_true", help="don't delete checkouts afterwards")
    ap.add_argument("--scratch", type=Path, default=fetch.DEFAULT_SCRATCH)
    ap.add_argument(
        "--summary-only",
        action="store_true",
        help="regenerate ingestion_summary.md from the existing manifest without re-fetching",
    )
    args = ap.parse_args()

    fw = args.framework

    if args.summary_only:
        data = json.loads(MANIFEST.read_text(encoding="utf-8"))
        failures, strays = load_side_state()
        write_summary(data, failures, strays)
        print(f"regenerated {SUMMARY.relative_to(KB_ROOT.parent)}")
        return 0
    repos = [r for r in REPOS if r.framework == fw]

    for dt in DOC_TYPES:
        d = KB_ROOT / fw / dt
        if d.exists():
            shutil.rmtree(d)
        d.mkdir(parents=True, exist_ok=True)

    print(f"=== {fw} ===  ({len(repos)} repo(s), {fetch.disk_free_mb(args.scratch)} MB free)")
    col = Collector(fw)

    for repo in repos:
        print(f"  fetching {repo.key} @ {repo.ref} ...", flush=True)
        try:
            checkout, commit = fetch.fetch(repo, args.scratch)
        except fetch.FetchError as exc:
            col.record_failure(repo.key, "<repo>", f"fetch failed: {exc}")
            print(f"    FETCH FAILED: {exc}")
            continue
        print(f"    at {commit[:12]}, collecting ...", flush=True)
        before = sum(col.counts.values())
        col.collect_repo(repo, checkout, commit)
        print(f"    +{sum(col.counts.values()) - before} files")
        if not args.keep_sources:
            fetch.purge(repo, args.scratch)

    failures, strays = load_side_state()
    failures[fw] = col.failures
    strays[fw] = col.stray_exception_files
    save_side_state(failures, strays)

    data = merge_manifest(fw, col.repos_done, col.counts)
    write_summary(data, failures, strays)

    print(f"\n  {fw} totals:")
    for dt in DOC_TYPES:
        print(f"    {dt:<13} {col.counts.get(dt, 0)}")
    print(f"    {'TOTAL':<13} {sum(col.counts.values())}")
    print(f"    failures/skips {len(col.failures)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
