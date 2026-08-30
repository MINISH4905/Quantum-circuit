from __future__ import annotations

import logging

logger = logging.getLogger(__name__)

_model_instance = None


class Embedder:
    def __init__(self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        from sentence_transformers import SentenceTransformer
        logger.info("Loading embedding model: %s", model_name)
        self._model = SentenceTransformer(model_name, device="cpu")
        self._dim = self._model.get_sentence_embedding_dimension()
        logger.info("Embedding model loaded — dimension=%d", self._dim)

    @property
    def dimension(self) -> int:
        return self._dim

    def embed_texts(self, texts: list[str], batch_size: int = 64) -> list[list[float]]:
        if not texts:
            return []
        embeddings = self._model.encode(
            texts, batch_size=batch_size, show_progress_bar=len(texts) > 100, normalize_embeddings=True,
        )
        return embeddings.tolist()

    def embed_query(self, query: str) -> list[float]:
        embedding = self._model.encode([query], normalize_embeddings=True)
        return embedding[0].tolist()


def get_embedder(model_name: str = "sentence-transformers/all-MiniLM-L6-v2") -> Embedder:
    global _model_instance
    if _model_instance is None:
        _model_instance = Embedder(model_name)
    return _model_instance
