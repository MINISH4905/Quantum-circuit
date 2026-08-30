from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_list_collections_returns_real_data():
    resp = client.get("/api/learning/collections")
    assert resp.status_code == 200
    collections = resp.json()
    assert len(collections) > 0
    ids = {c["id"] for c in collections}
    assert "courses/basics-of-quantum-information" in ids


def test_collection_detail_includes_documents():
    resp = client.get("/api/learning/collections/courses/basics-of-quantum-information")
    assert resp.status_code == 200
    body = resp.json()
    assert body["id"] == "courses/basics-of-quantum-information"
    assert len(body["documents"]) > 0
    assert all("path" in d and "title" in d for d in body["documents"])
    # Summaries should be lightweight — no raw content included.
    assert "rawContent" not in body["documents"][0]


def test_collection_detail_404_for_unknown_id():
    resp = client.get("/api/learning/collections/courses/does-not-exist")
    assert resp.status_code == 404


def test_document_detail_returns_full_content():
    path = "learning/courses/fundamentals-of-quantum-algorithms/quantum-query-algorithms/deutsch-jozsa-algorithm.ipynb"
    resp = client.get(f"/api/learning/documents/{path}")
    assert resp.status_code == 200
    body = resp.json()
    assert body["path"] == path
    assert "Deutsch" in body["title"]
    assert len(body["markdownText"]) > 1000


def test_document_detail_404_for_unknown_path():
    resp = client.get("/api/learning/documents/learning/does/not/exist.mdx")
    assert resp.status_code == 404
