from __future__ import annotations

import logging
from dataclasses import dataclass, field

from .config import RAGSettings, get_rag_settings
from .context_builder import SourceReference, build_context
from .reranker import HeuristicReranker
from .retriever import HybridRetriever, RetrievedChunk

logger = logging.getLogger(__name__)

_pipeline: RAGPipeline | None = None


@dataclass
class RAGResult:
    context: str
    sources: list[SourceReference] = field(default_factory=list)
    retrieved_chunks: list[RetrievedChunk] = field(default_factory=list)
    confidence_score: float = 0.0


def _compute_confidence(chunks: list[RetrievedChunk]) -> float:
    if not chunks:
        return 0.0
    semantic_scores = [c.semantic_score for c in chunks[:3] if c.semantic_score > 0]
    if not semantic_scores:
        return 0.4
    top = semantic_scores[0]
    avg = sum(semantic_scores) / len(semantic_scores)
    score = 0.2 + 0.55 * top + 0.25 * avg
    both_count = sum(1 for c in chunks[:3] if c.retrieval_method == "both")
    score += both_count * 0.05
    return min(score, 1.0)


class RAGPipeline:
    def __init__(
        self,
        retriever: HybridRetriever,
        reranker: HeuristicReranker,
        settings: RAGSettings,
    ):
        self.retriever = retriever
        self.reranker = reranker
        self.settings = settings

    def answer(
        self,
        question: str,
        framework_hint: str | None = None,
    ) -> RAGResult:
        chunks = self.retriever.retrieve(
            query=question,
            framework_filter=framework_hint,
        )

        chunks = self.reranker.rerank(question, chunks)

        context, sources = build_context(chunks, max_tokens=self.settings.max_context_tokens)

        return RAGResult(
            context=context,
            sources=sources,
            retrieved_chunks=chunks,
            confidence_score=_compute_confidence(chunks),
        )


async def init_rag_pipeline() -> None:
    global _pipeline

    settings = get_rag_settings()

    if not settings.knowledge_base_dir.is_dir():
        logger.warning("Knowledge base dir not found at %s — RAG disabled", settings.knowledge_base_dir)
        return

    from .embedder import get_embedder
    from .vector_store import VectorStore
    from .bm25_index import BM25Index

    embedder = get_embedder(settings.embedding_model)

    vs = VectorStore(settings.chroma_persist_dir, settings.chroma_collection_name)

    bm25 = BM25Index()
    if settings.bm25_index_path.exists():
        try:
            bm25 = BM25Index.load(settings.bm25_index_path)
        except Exception as e:
            logger.warning("Failed to load BM25 index: %s — will rebuild", e)

    if vs.count() == 0:
        logger.info("Vector store is empty — running initial ingestion")
        from .ingest import ingest
        result = ingest(settings.knowledge_base_dir, settings)
        logger.info("Initial ingestion complete: %s", result)
        if settings.bm25_index_path.exists():
            bm25 = BM25Index.load(settings.bm25_index_path)

    if not bm25.is_built and vs.count() > 0:
        logger.info("BM25 index missing — rebuilding from vector store")
        all_data = vs._collection.get(include=["documents", "metadatas"])
        if all_data["ids"]:
            bm25.build(all_data["ids"], all_data["documents"])
            bm25.save(settings.bm25_index_path)

    retriever = HybridRetriever(vs, bm25, embedder, settings)
    reranker = HeuristicReranker()
    _pipeline = RAGPipeline(retriever, reranker, settings)
    logger.info("RAG pipeline initialized — %d chunks indexed", vs.count())


def get_rag_pipeline() -> RAGPipeline | None:
    return _pipeline
