"""Serves the pre-fetched Qiskit learning content (see
scripts/ingest_learning_content.py, data/learning_content.json) to the
frontend via the /api/learning/* endpoints in main.py. The JSON file is
loaded once and cached in memory — re-run the ingestion script and restart
the server to pick up fresh content.
"""

from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "learning_content.json"


class LearningContentUnavailable(RuntimeError):
    pass


@lru_cache(maxsize=1)
def _load() -> dict:
    if not DATA_PATH.exists():
        raise LearningContentUnavailable(
            f"{DATA_PATH} not found. Run scripts/ingest_learning_content.py to generate it."
        )
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def list_collections() -> list[dict]:
    return _load()["collections"]


def get_collection(collection_id: str) -> dict | None:
    return next((c for c in _load()["collections"] if c["id"] == collection_id), None)


def list_documents_for_collection(collection_id: str) -> list[dict]:
    """Lightweight summaries (no raw/markdown content) of a collection's documents."""
    docs = [d for d in _load()["documents"] if d["collectionId"] == collection_id]
    return [
        {
            "path": d["path"],
            "fileName": d["fileName"],
            "fileType": d["fileType"],
            "title": d["title"],
            "githubUrl": d["githubUrl"],
        }
        for d in docs
    ]


def get_document(path: str) -> dict | None:
    return next((d for d in _load()["documents"] if d["path"] == path), None)
