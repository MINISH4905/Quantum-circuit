from __future__ import annotations

import logging
from dataclasses import dataclass, field
from pathlib import Path

import chromadb

from .chunker import Chunk

logger = logging.getLogger(__name__)


@dataclass
class SearchResult:
    chunk_id: str
    text: str
    score: float
    metadata: dict[str, str] = field(default_factory=dict)


class VectorStore:
    def __init__(self, persist_dir: Path, collection_name: str = "quantum_kb"):
        persist_dir.mkdir(parents=True, exist_ok=True)
        self._client = chromadb.PersistentClient(path=str(persist_dir))
        self._collection = self._client.get_or_create_collection(
            name=collection_name,
            metadata={"hnsw:space": "cosine"},
        )
        logger.info("ChromaDB collection '%s' opened — %d documents", collection_name, self._collection.count())

    def upsert_chunks(self, chunks: list[Chunk], embeddings: list[list[float]]) -> int:
        if not chunks:
            return 0
        batch_size = 500
        total = 0
        for i in range(0, len(chunks), batch_size):
            batch_chunks = chunks[i:i + batch_size]
            batch_embeds = embeddings[i:i + batch_size]
            self._collection.upsert(
                ids=[c.chunk_id for c in batch_chunks],
                documents=[c.text for c in batch_chunks],
                embeddings=batch_embeds,
                metadatas=[c.metadata for c in batch_chunks],
            )
            total += len(batch_chunks)
        return total

    def query(
        self,
        query_embedding: list[float],
        top_k: int = 15,
        where: dict | None = None,
    ) -> list[SearchResult]:
        kwargs: dict = {
            "query_embeddings": [query_embedding],
            "n_results": top_k,
            "include": ["documents", "metadatas", "distances"],
        }
        if where:
            kwargs["where"] = where

        try:
            results = self._collection.query(**kwargs)
        except Exception as e:
            logger.error("ChromaDB query failed: %s", e)
            return []

        items: list[SearchResult] = []
        if results and results["ids"] and results["ids"][0]:
            for idx, cid in enumerate(results["ids"][0]):
                distance = results["distances"][0][idx] if results["distances"] else 0.0
                score = 1.0 - distance
                items.append(SearchResult(
                    chunk_id=cid,
                    text=results["documents"][0][idx] if results["documents"] else "",
                    score=score,
                    metadata=results["metadatas"][0][idx] if results["metadatas"] else {},
                ))
        return items

    def count(self) -> int:
        return self._collection.count()

    def get_all_file_paths(self) -> set[str]:
        all_meta = self._collection.get(include=["metadatas"])
        paths: set[str] = set()
        if all_meta and all_meta["metadatas"]:
            for m in all_meta["metadatas"]:
                fp = m.get("file_path", "")
                if fp:
                    paths.add(fp)
        return paths

    def delete_by_file(self, file_path: str) -> int:
        results = self._collection.get(where={"file_path": file_path}, include=[])
        if results and results["ids"]:
            self._collection.delete(ids=results["ids"])
            return len(results["ids"])
        return 0
