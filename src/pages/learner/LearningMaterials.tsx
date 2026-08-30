import { useEffect, useState } from "react";
import {
  fetchLearningCollection,
  fetchLearningDocument,
  type LearningCollectionDetail,
  type LearningDocumentDetail,
  type LearningDocumentSummary,
} from "../../api/learning-api";

/** Real Qiskit lesson material for this topic's course, fetched live from
 * the backend (which serves data/learning_content.json — the whole
 * learning/ tree pulled from github.com/Qiskit/documentation). Only
 * fetched once this section is actually opened. */
export function LearningMaterials({ collectionId }: { collectionId: string }) {
  const [collection, setCollection] = useState<LearningCollectionDetail | null>(null);
  const [collectionError, setCollectionError] = useState<string | null>(null);
  const [collectionLoading, setCollectionLoading] = useState(true);

  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [document, setDocument] = useState<LearningDocumentDetail | null>(null);
  const [documentError, setDocumentError] = useState<string | null>(null);
  const [documentLoading, setDocumentLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setCollectionLoading(true);
    setCollectionError(null);
    fetchLearningCollection(collectionId)
      .then((data) => {
        if (cancelled) return;
        setCollection(data);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setCollectionError(err instanceof Error ? err.message : "Failed to load learning materials");
      })
      .finally(() => {
        if (!cancelled) setCollectionLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [collectionId]);

  const openDocument = (doc: LearningDocumentSummary) => {
    if (doc.fileType === "json") return; // _toc.json etc. — no readable content
    setSelectedPath(doc.path);
    setDocument(null);
    setDocumentError(null);
    setDocumentLoading(true);
    fetchLearningDocument(doc.path)
      .then(setDocument)
      .catch((err: unknown) => setDocumentError(err instanceof Error ? err.message : "Failed to load document"))
      .finally(() => setDocumentLoading(false));
  };

  if (collectionLoading) return <p className="inspector-empty">Loading learning materials…</p>;
  if (collectionError) return <p className="sim-warning">{collectionError}</p>;
  if (!collection) return null;

  const readableDocs = collection.documents.filter((d) => d.fileType !== "json");

  return (
    <div className="learning-materials">
      <p className="learning-materials-source">
        Source: {collection.title !== "Overview" ? collection.title : collection.slug} — {readableDocs.length} lessons
        from{" "}
        <a href={collection.githubUrl} target="_blank" rel="noreferrer noopener">
          Qiskit Learning
        </a>
      </p>
      <div className="learning-materials-body">
        <ul className="learning-materials-list">
          {readableDocs.map((doc) => (
            <li key={doc.path}>
              <button
                type="button"
                className={`learning-materials-item${doc.path === selectedPath ? " is-selected" : ""}`}
                onClick={() => openDocument(doc)}
              >
                {doc.title ?? doc.fileName}
              </button>
            </li>
          ))}
        </ul>
        <div className="learning-materials-reader">
          {!selectedPath && <p className="inspector-empty">Select a lesson to read it.</p>}
          {documentLoading && <p className="inspector-empty">Loading…</p>}
          {documentError && <p className="sim-warning">{documentError}</p>}
          {document && (
            <>
              <h4 className="learning-materials-reader-title">{document.title ?? document.fileName}</h4>
              <pre className="learning-materials-reader-text">{document.markdownText || document.rawContent}</pre>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
