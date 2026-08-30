from __future__ import annotations

import json
import logging
import re
from pathlib import Path

logger = logging.getLogger(__name__)

_TOKENIZE_RE = re.compile(r"[a-zA-Z0-9_]+")


def _tokenize(text: str) -> list[str]:
    return [t.lower() for t in _TOKENIZE_RE.findall(text) if len(t) >= 2]


class BM25Index:
    def __init__(self) -> None:
        self._bm25 = None
        self._chunk_ids: list[str] = []
        self._corpus: list[list[str]] = []

    @property
    def is_built(self) -> bool:
        return self._bm25 is not None

    def build(self, chunk_ids: list[str], texts: list[str]) -> None:
        from rank_bm25 import BM25Okapi
        self._chunk_ids = list(chunk_ids)
        self._corpus = [_tokenize(t) for t in texts]
        self._bm25 = BM25Okapi(self._corpus)
        logger.info("BM25 index built with %d documents", len(self._chunk_ids))

    def query(self, query: str, top_k: int = 15) -> list[tuple[str, float]]:
        if not self._bm25 or not self._chunk_ids:
            return []
        tokens = _tokenize(query)
        if not tokens:
            return []
        scores = self._bm25.get_scores(tokens)
        top_indices = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)[:top_k]
        return [(self._chunk_ids[i], float(scores[i])) for i in top_indices if scores[i] > 0]

    def save(self, path: Path) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        data = {
            "chunk_ids": self._chunk_ids,
            "corpus": self._corpus,
        }
        path.write_text(json.dumps(data), encoding="utf-8")
        logger.info("BM25 index saved to %s (%d docs)", path, len(self._chunk_ids))

    @classmethod
    def load(cls, path: Path) -> BM25Index:
        from rank_bm25 import BM25Okapi
        data = json.loads(path.read_text(encoding="utf-8"))
        idx = cls()
        idx._chunk_ids = data["chunk_ids"]
        idx._corpus = data["corpus"]
        idx._bm25 = BM25Okapi(idx._corpus)
        logger.info("BM25 index loaded from %s (%d docs)", path, len(idx._chunk_ids))
        return idx
