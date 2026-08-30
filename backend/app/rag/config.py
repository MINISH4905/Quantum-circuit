from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

_PROJECT_ROOT = Path(__file__).resolve().parents[3]


@dataclass(frozen=True)
class RAGSettings:
    knowledge_base_dir: Path
    chroma_persist_dir: Path
    bm25_index_path: Path
    ingest_state_path: Path

    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    embedding_dimension: int = 384
    embedding_batch_size: int = 64

    chunk_max_tokens: int = 600
    chunk_overlap_tokens: int = 80
    chunk_min_tokens: int = 50

    semantic_top_k: int = 15
    bm25_top_k: int = 15
    fusion_top_k: int = 8
    rrf_k: int = 60

    max_context_tokens: int = 3000
    chroma_collection_name: str = "quantum_kb"


def get_rag_settings() -> RAGSettings:
    kb_dir = Path(os.environ.get("RAG_KB_DIR", _PROJECT_ROOT / "knowledge_base"))
    data_dir = Path(os.environ.get("RAG_CHROMA_DIR", _PROJECT_ROOT / "backend" / "data" / "chroma_db")).parent

    return RAGSettings(
        knowledge_base_dir=kb_dir,
        chroma_persist_dir=data_dir / "chroma_db",
        bm25_index_path=data_dir / "bm25_index.json",
        ingest_state_path=data_dir / ".ingest_state.json",
        embedding_model=os.environ.get("RAG_EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2"),
    )
