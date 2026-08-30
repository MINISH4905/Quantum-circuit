import { SimulationApiError } from "./simulation-api";

// Client for GET /api/learning/* (backend/app/main.py + app/learning_content.py)
// — the Qiskit documentation learning/ content fetched by
// backend/scripts/ingest_learning_content.py. Same HTTP-contract-only
// pattern as simulation-api.ts / tutor-api.ts.

export interface LearningCollection {
  id: string;
  kind: "course" | "module";
  slug: string;
  title: string | null;
  description: string | null;
  hours: number | null;
  isVideo: boolean | null;
  hasBadge: boolean | null;
  githubPath: string;
  githubUrl: string;
}

export interface LearningDocumentSummary {
  path: string;
  fileName: string;
  fileType: "mdx" | "ipynb" | "json";
  title: string | null;
  githubUrl: string;
}

export interface LearningCollectionDetail extends LearningCollection {
  documents: LearningDocumentSummary[];
}

export interface LearningDocumentDetail extends LearningDocumentSummary {
  collectionId: string | null;
  rawContent: string;
  markdownText: string | null;
  sha: string;
  sizeBytes: number | null;
}

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL as string | undefined) ?? "http://localhost:8000";

async function getJson<T>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BACKEND_URL}${path}`);
  } catch {
    throw new SimulationApiError("Could not reach the learning content backend. Is it running?");
  }
  if (!res.ok) {
    let message = `Backend returned HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body?.detail?.message) message = body.detail.message;
    } catch {
      // response body wasn't JSON; keep the generic message
    }
    throw new SimulationApiError(message, res.status);
  }
  return (await res.json()) as T;
}

export function fetchLearningCollections(): Promise<LearningCollection[]> {
  return getJson<LearningCollection[]>("/api/learning/collections");
}

export function fetchLearningCollection(collectionId: string): Promise<LearningCollectionDetail> {
  return getJson<LearningCollectionDetail>(`/api/learning/collections/${collectionId}`);
}

export function fetchLearningDocument(path: string): Promise<LearningDocumentDetail> {
  return getJson<LearningDocumentDetail>(`/api/learning/documents/${path}`);
}
