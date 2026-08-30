from __future__ import annotations

import hashlib
import logging
import re
from dataclasses import dataclass, field

from .parser import ParsedDocument

logger = logging.getLogger(__name__)

_FENCE_RE = re.compile(r"(```[^\n]*\n.*?```)", re.DOTALL)
_HEADING_SPLIT_RE = re.compile(r"(?=^#{2,3}\s)", re.MULTILINE)


@dataclass
class Chunk:
    chunk_id: str
    text: str
    metadata: dict[str, str] = field(default_factory=dict)


def _word_count(text: str) -> int:
    return len(text.split())


def _make_chunk_id(file_path: str, chunk_index: int) -> str:
    raw = f"{file_path}|{chunk_index}"
    return hashlib.sha256(raw.encode()).hexdigest()[:16]


def _extract_heading_path(section_text: str) -> str:
    lines = section_text.split("\n", 5)
    for line in lines:
        line = line.strip()
        if line.startswith("#"):
            return re.sub(r"^#+\s*", "", line).strip()
    return ""


def _split_by_paragraphs(text: str, max_tokens: int, overlap_tokens: int) -> list[str]:
    paragraphs = re.split(r"\n\n+", text)
    chunks: list[str] = []
    current: list[str] = []
    current_len = 0

    for para in paragraphs:
        plen = _word_count(para)
        if current and current_len + plen > max_tokens:
            chunks.append("\n\n".join(current))
            overlap_text = " ".join("\n\n".join(current).split()[-overlap_tokens:])
            current = [overlap_text] if overlap_tokens > 0 else []
            current_len = _word_count(current[0]) if current else 0
        current.append(para)
        current_len += plen

    if current:
        chunks.append("\n\n".join(current))
    return chunks


def chunk_document(
    doc: ParsedDocument,
    max_tokens: int = 600,
    overlap_tokens: int = 80,
    min_tokens: int = 50,
) -> list[Chunk]:
    body = doc.body
    if not body.strip():
        return []

    placeholders: dict[str, str] = {}
    counter = 0

    def _mask_fence(m: re.Match) -> str:
        nonlocal counter
        key = f"\x00CODEBLOCK{counter}\x00"
        placeholders[key] = m.group(0)
        counter += 1
        return key

    masked = _FENCE_RE.sub(_mask_fence, body)
    sections = _HEADING_SPLIT_RE.split(masked)
    sections = [s for s in sections if s.strip()]

    raw_chunks: list[str] = []
    headings: list[str] = []

    for section in sections:
        heading = _extract_heading_path(section)
        wc = _word_count(section)

        if wc <= max_tokens:
            raw_chunks.append(section)
            headings.append(heading)
        else:
            sub_chunks = _split_by_paragraphs(section, max_tokens, overlap_tokens)
            for sc in sub_chunks:
                raw_chunks.append(sc)
                headings.append(heading)

    merged_chunks: list[str] = []
    merged_headings: list[str] = []
    for i, (chunk_text, heading) in enumerate(zip(raw_chunks, headings)):
        if merged_chunks and _word_count(merged_chunks[-1]) < min_tokens:
            merged_chunks[-1] += "\n\n" + chunk_text
            if heading and not merged_headings[-1]:
                merged_headings[-1] = heading
        else:
            merged_chunks.append(chunk_text)
            merged_headings.append(heading)

    if len(merged_chunks) > 1 and _word_count(merged_chunks[-1]) < min_tokens:
        merged_chunks[-2] += "\n\n" + merged_chunks[-1]
        merged_chunks.pop()
        merged_headings.pop()

    results: list[Chunk] = []
    for idx, (chunk_text, heading) in enumerate(zip(merged_chunks, merged_headings)):
        for key, original in placeholders.items():
            chunk_text = chunk_text.replace(key, original)

        results.append(Chunk(
            chunk_id=_make_chunk_id(doc.file_path, idx),
            text=chunk_text.strip(),
            metadata={
                "framework": doc.framework,
                "doc_type": doc.doc_type,
                "api_version": doc.api_version,
                "source_url": doc.source_url,
                "license": doc.license,
                "title": doc.title,
                "heading_path": heading or doc.title,
                "file_path": doc.file_path,
                "chunk_index": str(idx),
            },
        ))

    return results


def chunk_all_documents(
    docs: list[ParsedDocument],
    max_tokens: int = 600,
    overlap_tokens: int = 80,
    min_tokens: int = 50,
) -> list[Chunk]:
    all_chunks: list[Chunk] = []
    for doc in docs:
        all_chunks.extend(chunk_document(doc, max_tokens, overlap_tokens, min_tokens))
    logger.info("Chunked %d documents into %d chunks", len(docs), len(all_chunks))
    return all_chunks
