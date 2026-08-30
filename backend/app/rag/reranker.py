from __future__ import annotations

import re
from .retriever import RetrievedChunk


def _query_keywords(query: str) -> set[str]:
    return {w.lower() for w in re.findall(r"[a-zA-Z_]{3,}", query)}


def _is_conceptual_query(query: str) -> bool:
    q = query.lower()
    return any(w in q for w in [
        "what is", "explain", "how does", "why", "concept", "theory",
        "introduction", "basics", "difference between", "meaning",
    ])


def _is_error_query(query: str) -> bool:
    q = query.lower()
    return any(w in q for w in ["error", "exception", "traceback", "bug", "fix", "issue"])


class HeuristicReranker:
    def rerank(self, query: str, chunks: list[RetrievedChunk]) -> list[RetrievedChunk]:
        if not chunks:
            return chunks

        keywords = _query_keywords(query)
        is_conceptual = _is_conceptual_query(query)
        is_error = _is_error_query(query)

        for chunk in chunks:
            boost = 0.0
            doc_type = chunk.metadata.get("doc_type", "")
            title = chunk.metadata.get("title", "").lower()

            if is_conceptual and doc_type == "concept":
                boost += 0.1
            if is_error and doc_type == "error":
                boost += 0.1

            title_words = set(title.split())
            overlap = keywords & title_words
            if overlap:
                boost += 0.05 * min(len(overlap), 3)

            if any(w in title for w in ["changelog", "release", "migration", "deprecat"]):
                boost -= 0.05

            chunk.score += boost

        chunks.sort(key=lambda c: c.score, reverse=True)
        return chunks
