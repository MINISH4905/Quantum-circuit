from __future__ import annotations

import json
import logging
import time
from dataclasses import dataclass
from pathlib import Path

from .chunker import chunk_all_documents
from .config import RAGSettings, get_rag_settings
from .embedder import get_embedder
from .parser import parse_all_documents
from .vector_store import VectorStore
from .bm25_index import BM25Index

logger = logging.getLogger(__name__)


@dataclass
class IngestResult:
    files_parsed: int = 0
    chunks_created: int = 0
    chunks_upserted: int = 0
    orphans_removed: int = 0
    bm25_built: bool = False
    elapsed_seconds: float = 0.0

    def __str__(self) -> str:
        return (
            f"parsed={self.files_parsed} chunks={self.chunks_created} "
            f"upserted={self.chunks_upserted} orphans={self.orphans_removed} "
            f"elapsed={self.elapsed_seconds:.1f}s"
        )


def _load_state(path: Path) -> dict[str, float]:
    if path.exists():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            pass
    return {}


def _save_state(path: Path, state: dict[str, float]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(state), encoding="utf-8")


def ingest(
    kb_root: Path,
    settings: RAGSettings,
    force: bool = False,
) -> IngestResult:
    t0 = time.time()
    result = IngestResult()

    logger.info("Starting ingestion from %s (force=%s)", kb_root, force)

    docs = parse_all_documents(kb_root)
    result.files_parsed = len(docs)

    if not docs:
        logger.warning("No documents parsed from %s", kb_root)
        result.elapsed_seconds = time.time() - t0
        return result

    state = {} if force else _load_state(settings.ingest_state_path)
    if not force:
        changed_docs = []
        for doc in docs:
            full_path = kb_root / doc.file_path
            mtime = full_path.stat().st_mtime if full_path.exists() else 0
            if doc.file_path not in state or state[doc.file_path] != mtime:
                changed_docs.append(doc)
        if not changed_docs and state:
            logger.info("No documents changed since last ingestion — skipping")
            result.elapsed_seconds = time.time() - t0
            return result
        if changed_docs:
            logger.info("%d of %d documents changed — processing", len(changed_docs), len(docs))
            docs = changed_docs

    chunks = chunk_all_documents(
        docs,
        max_tokens=settings.chunk_max_tokens,
        overlap_tokens=settings.chunk_overlap_tokens,
        min_tokens=settings.chunk_min_tokens,
    )
    result.chunks_created = len(chunks)

    if not chunks:
        result.elapsed_seconds = time.time() - t0
        return result

    embedder = get_embedder(settings.embedding_model)
    logger.info("Embedding %d chunks...", len(chunks))
    texts = [c.text for c in chunks]
    embeddings = embedder.embed_texts(texts, batch_size=settings.embedding_batch_size)

    vs = VectorStore(settings.chroma_persist_dir, settings.chroma_collection_name)
    result.chunks_upserted = vs.upsert_chunks(chunks, embeddings)
    logger.info("Upserted %d chunks into ChromaDB", result.chunks_upserted)

    indexed_paths = vs.get_all_file_paths()
    on_disk_paths = {doc.file_path for doc in parse_all_documents(kb_root)}
    orphan_paths = indexed_paths - on_disk_paths
    for orphan_path in orphan_paths:
        removed = vs.delete_by_file(orphan_path)
        result.orphans_removed += removed
    if result.orphans_removed:
        logger.info("Removed %d orphaned chunks", result.orphans_removed)

    all_data = vs._collection.get(include=["documents"])
    all_ids = all_data["ids"]
    all_texts = all_data["documents"]
    bm25 = BM25Index()
    bm25.build(all_ids, all_texts)
    bm25.save(settings.bm25_index_path)
    result.bm25_built = True

    new_state: dict[str, float] = {}
    for doc in parse_all_documents(kb_root):
        full_path = kb_root / doc.file_path
        new_state[doc.file_path] = full_path.stat().st_mtime if full_path.exists() else 0
    _save_state(settings.ingest_state_path, new_state)

    result.elapsed_seconds = time.time() - t0
    logger.info("Ingestion complete: %s", result)
    return result


if __name__ == "__main__":
    import argparse
    import sys

    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(name)s %(levelname)s %(message)s")

    parser = argparse.ArgumentParser(description="Ingest knowledge base into RAG vector store")
    parser.add_argument("--kb-root", type=Path, default=None, help="Knowledge base root directory")
    parser.add_argument("--force", action="store_true", help="Force re-ingestion of all documents")
    args = parser.parse_args()

    settings = get_rag_settings()
    if args.kb_root:
        settings = RAGSettings(
            knowledge_base_dir=args.kb_root,
            chroma_persist_dir=settings.chroma_persist_dir,
            bm25_index_path=settings.bm25_index_path,
            ingest_state_path=settings.ingest_state_path,
            embedding_model=settings.embedding_model,
        )

    result = ingest(settings.knowledge_base_dir, settings, force=args.force)
    print(f"Ingestion result: {result}")
    sys.exit(0)
