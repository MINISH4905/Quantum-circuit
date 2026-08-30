from __future__ import annotations

import logging
import re
from dataclasses import dataclass
from pathlib import Path

logger = logging.getLogger(__name__)

_FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.DOTALL)
_HEADING_RE = re.compile(r"^#{1,2}\s+(.+)", re.MULTILINE)
_YAML_FIELD_RE = re.compile(r"^(\w[\w_]*):\s*(.+)$", re.MULTILINE)

FRAMEWORKS = {"qiskit", "cirq", "pennylane"}
DOC_TYPES = {"concept", "api", "error", "optimization"}


@dataclass
class ParsedDocument:
    file_path: str
    framework: str
    doc_type: str
    api_version: str
    source_url: str
    license: str
    title: str
    body: str


def _parse_frontmatter(text: str) -> tuple[dict[str, str], str]:
    m = _FRONTMATTER_RE.match(text)
    if not m:
        return {}, text
    yaml_block = m.group(1)
    fields = {k: v.strip().strip("'\"") for k, v in _YAML_FIELD_RE.findall(yaml_block)}
    body = text[m.end():]
    return fields, body


def _extract_title(body: str, file_path: str) -> str:
    m = _HEADING_RE.search(body)
    if m:
        return m.group(1).strip()
    return Path(file_path).stem.replace("__", " / ").replace("_", " ")


def parse_document(file_path: Path, kb_root: Path) -> ParsedDocument | None:
    try:
        text = file_path.read_text(encoding="utf-8", errors="replace")
    except OSError as e:
        logger.warning("Cannot read %s: %s", file_path, e)
        return None

    fields, body = _parse_frontmatter(text)
    rel_path = str(file_path.relative_to(kb_root)).replace("\\", "/")

    framework = fields.get("framework", "")
    doc_type = fields.get("doc_type", "")
    if framework not in FRAMEWORKS or doc_type not in DOC_TYPES:
        logger.debug("Skipping %s (framework=%s, doc_type=%s)", rel_path, framework, doc_type)
        return None

    return ParsedDocument(
        file_path=rel_path,
        framework=framework,
        doc_type=doc_type,
        api_version=fields.get("api_version", ""),
        source_url=fields.get("source_url", ""),
        license=fields.get("license", ""),
        title=_extract_title(body, rel_path),
        body=body.strip(),
    )


def parse_all_documents(kb_root: Path) -> list[ParsedDocument]:
    docs: list[ParsedDocument] = []
    for framework in sorted(FRAMEWORKS):
        fw_dir = kb_root / framework
        if not fw_dir.is_dir():
            continue
        for doc_type in sorted(DOC_TYPES):
            dt_dir = fw_dir / doc_type
            if not dt_dir.is_dir():
                continue
            for md_file in sorted(dt_dir.rglob("*.md")):
                doc = parse_document(md_file, kb_root)
                if doc:
                    docs.append(doc)
    logger.info("Parsed %d documents from %s", len(docs), kb_root)
    return docs
