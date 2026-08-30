from __future__ import annotations

from dataclasses import dataclass
from .retriever import RetrievedChunk


@dataclass
class SourceReference:
    index: int
    title: str
    framework: str
    doc_type: str
    source_url: str
    heading_path: str


def build_context(
    chunks: list[RetrievedChunk],
    max_tokens: int = 3000,
) -> tuple[str, list[SourceReference]]:
    if not chunks:
        return "", []

    sections: list[str] = []
    sources: list[SourceReference] = []
    token_count = 0

    for i, chunk in enumerate(chunks):
        text = chunk.text.strip()
        if not text:
            continue

        chunk_tokens = len(text.split())
        if token_count + chunk_tokens > max_tokens and sections:
            break

        ref_num = len(sources) + 1
        title = chunk.metadata.get("title", "Unknown")
        framework = chunk.metadata.get("framework", "")
        doc_type = chunk.metadata.get("doc_type", "")
        heading = chunk.metadata.get("heading_path", "")
        source_url = chunk.metadata.get("source_url", "")

        header = f"[{ref_num}] {title}"
        if framework:
            header += f" | {framework}"
        if doc_type:
            header += f" | {doc_type}"

        if chunk_tokens > max_tokens - token_count and sections:
            remaining = max_tokens - token_count
            words = text.split()[:remaining]
            text = " ".join(words) + "..."

        sections.append(f"{header}\n{text}")
        sources.append(SourceReference(
            index=ref_num,
            title=title,
            framework=framework,
            doc_type=doc_type,
            source_url=source_url,
            heading_path=heading,
        ))
        token_count += chunk_tokens

    context = "\n\n---\n\n".join(sections)
    return context, sources
