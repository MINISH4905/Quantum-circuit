from __future__ import annotations

import logging
import re
from dataclasses import dataclass, field
from collections import defaultdict

from .bm25_index import BM25Index
from .config import RAGSettings
from .embedder import Embedder
from .vector_store import VectorStore

logger = logging.getLogger(__name__)

_FRAMEWORK_KEYWORDS = {
    "qiskit": ["qiskit", "ibm", "transpiler", "aer", "terra"],
    "cirq": ["cirq", "google", "quantumlib"],
    "pennylane": ["pennylane", "penny", "xanadu", "qml", "qnode"],
}


@dataclass
class RetrievedChunk:
    chunk_id: str
    text: str
    score: float
    metadata: dict[str, str] = field(default_factory=dict)
    retrieval_method: str = "semantic"
    semantic_score: float = 0.0


def _detect_framework(query: str) -> str | None:
    q_lower = query.lower()
    for fw, keywords in _FRAMEWORK_KEYWORDS.items():
        if any(kw in q_lower for kw in keywords):
            return fw
    return None


def _detect_doc_type(query: str) -> str | None:
    q_lower = query.lower()
    if any(w in q_lower for w in ["error", "exception", "traceback", "bug", "fix"]):
        return "error"
    if any(w in q_lower for w in ["optimize", "transpile", "compile", "pass", "reduce"]):
        return "optimization"
    if any(w in q_lower for w in ["api", "function", "method", "class", "import", "parameter"]):
        return "api"
    return None


class HybridRetriever:
    def __init__(
        self,
        vector_store: VectorStore,
        bm25_index: BM25Index,
        embedder: Embedder,
        settings: RAGSettings,
    ):
        self.vector_store = vector_store
        self.bm25_index = bm25_index
        self.embedder = embedder
        self.settings = settings

    def retrieve(
        self,
        query: str,
        framework_filter: str | None = None,
        doc_type_filter: str | None = None,
        top_k: int | None = None,
    ) -> list[RetrievedChunk]:
        top_k = top_k or self.settings.fusion_top_k

        detected_fw = framework_filter or _detect_framework(query)
        detected_dt = doc_type_filter or _detect_doc_type(query)

        where: dict | None = None
        if detected_fw and detected_dt:
            where = {"$and": [{"framework": detected_fw}, {"doc_type": detected_dt}]}
        elif detected_fw:
            where = {"framework": detected_fw}
        elif detected_dt:
            where = {"doc_type": detected_dt}

        query_embedding = self.embedder.embed_query(query)
        semantic_results = self.vector_store.query(
            query_embedding, top_k=self.settings.semantic_top_k, where=where,
        )

        if len(semantic_results) < 3 and where:
            semantic_results = self.vector_store.query(
                query_embedding, top_k=self.settings.semantic_top_k, where=None,
            )

        bm25_results = self.bm25_index.query(query, top_k=self.settings.bm25_top_k)

        chunk_data: dict[str, RetrievedChunk] = {}
        for sr in semantic_results:
            chunk_data[sr.chunk_id] = RetrievedChunk(
                chunk_id=sr.chunk_id, text=sr.text, score=0.0,
                metadata=sr.metadata, retrieval_method="semantic",
                semantic_score=sr.score,
            )

        semantic_ranks: dict[str, int] = {sr.chunk_id: i + 1 for i, sr in enumerate(semantic_results)}
        bm25_ranks: dict[str, int] = {cid: i + 1 for i, (cid, _) in enumerate(bm25_results)}

        all_ids = set(semantic_ranks.keys()) | set(bm25_ranks.keys())
        rrf_scores: dict[str, float] = defaultdict(float)
        k = self.settings.rrf_k

        for cid in all_ids:
            if cid in semantic_ranks:
                rrf_scores[cid] += 1.0 / (k + semantic_ranks[cid])
            if cid in bm25_ranks:
                rrf_scores[cid] += 1.0 / (k + bm25_ranks[cid])

        sorted_ids = sorted(rrf_scores.keys(), key=lambda x: rrf_scores[x], reverse=True)[:top_k]

        results: list[RetrievedChunk] = []
        for cid in sorted_ids:
            if cid in chunk_data:
                chunk = chunk_data[cid]
                chunk.score = rrf_scores[cid]
                if cid in semantic_ranks and cid in bm25_ranks:
                    chunk.retrieval_method = "both"
                elif cid in bm25_ranks:
                    chunk.retrieval_method = "bm25"
                results.append(chunk)
            else:
                results.append(RetrievedChunk(
                    chunk_id=cid, text="", score=rrf_scores[cid],
                    metadata={}, retrieval_method="bm25",
                ))

        logger.debug(
            "Retrieved %d chunks for query=%r (semantic=%d, bm25=%d, fused=%d)",
            len(results), query[:50], len(semantic_results), len(bm25_results), len(results),
        )
        return results
