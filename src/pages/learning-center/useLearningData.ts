import { useMemo } from "react";
import learningContentRaw from "../../data/learning-content.json";
import learningManifestRaw from "../../data/learning-manifest.json";
import type { LearningContentData, LearningManifestData } from "./types";

// Static ES module imports — no fetch() at runtime, no live GitHub calls.
// Populated by `npm run fetch-content` (scripts/fetch-learning-content.js).
const learningContent = learningContentRaw as unknown as LearningContentData;
const learningManifest = learningManifestRaw as unknown as LearningManifestData;

/** Memoized so the (potentially large) JSON isn't re-walked on every render —
 * the imported objects are already parsed once at module load; useMemo here
 * just guards any derived lookups callers build on top of them. */
export function useLearningData() {
  return useMemo(
    () => ({
      content: learningContent,
      manifest: learningManifest,
      roadmap: learningContent.roadmap,
      metadata: learningContent.metadata,
    }),
    []
  );
}
