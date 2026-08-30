// Mirrors the exact shape scripts/fetch-learning-content.js writes to
// src/data/learning-content.json / learning-manifest.json. Concept `id`s are
// only unique *within* a module (e.g. "introduction" repeats across
// modules) — always key progress/lookups by (stageId, moduleId, conceptId).

export interface LearningConcept {
  id: string;
  title: string;
  type: string;
  content: string;
  order: number | null;
  sourceFile: string;
  githubUrl: string;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  estimatedTime: string;
  order: number | null;
  prerequisites: string[];
  tags: string[];
  concepts: LearningConcept[];
}

export interface LearningStage {
  id: string;
  title: string;
  description: string;
  order: number;
  modules: LearningModule[];
}

export interface LearningMetadata {
  fetchedAt: string;
  totalModules: number;
  totalConcepts: number;
  source: string;
  filesFetched?: number;
  filesTotal?: number;
}

export interface LearningContentData {
  roadmap: LearningStage[];
  metadata: LearningMetadata;
}

export interface ManifestConcept {
  id: string;
  title: string;
  type: string;
}

export interface ManifestModule {
  id: string;
  title: string;
  difficulty: string;
  estimatedTime: string;
  order: number | null;
  concepts: ManifestConcept[];
}

export interface ManifestStage {
  id: string;
  title: string;
  order: number;
  modules: ManifestModule[];
}

export interface LearningManifestData {
  roadmap: ManifestStage[];
  metadata: LearningMetadata;
}
