// Mirrors the exact shape scripts/fetch-learning-content.js writes to
// src/data/learning-content.json / learning-manifest.json. Concept `id`s are
// only unique *within* a module (e.g. "introduction" repeats across
// modules) — always key progress/lookups by (stageId, moduleId, conceptId).

// Assessment nodes (`type: "assessment"`) carry a structured `assessment`
// object merged in by scripts/merge-assessments.js, alongside the prose
// `content`. The prose spells out the correct answers inline, so the
// interactive UI reads *only* these structured fields — see AssessmentPanel.

export interface AssessmentOption {
  key: string;
  text: string;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: AssessmentOption[];
  /** The `key` of the correct option (e.g. "C"). */
  correct: string;
  explanation: string;
}

/** Only `measurement_probability` targets are mechanically checkable: `target`
 * is a bitstring → probability map. `statevector` targets hold a human-readable
 * label ("|Φ+⟩"), and `value` targets hold classical scalars, neither of which
 * can be graded against a simulated circuit — see isAutoGradable in grading.ts. */
export interface AssessmentTarget {
  type: "measurement_probability" | "statevector" | "value";
  target: Record<string, number> | string;
  tolerance?: number;
}

export interface AssessmentChallenge {
  id: string;
  title: string;
  difficulty: string;
  description: string;
  starterCode: string;
  target: AssessmentTarget | null;
  quizOnly?: boolean;
}

export interface ConceptAssessment {
  module: string;
  concept: string;
  questionCount: number;
  challengeCount: number;
  quizOnly: boolean;
  questions: AssessmentQuestion[];
  challenges: AssessmentChallenge[];
  difficultyProgression?: string[];
  sourceReference?: string;
}

export interface LearningConcept {
  id: string;
  title: string;
  type: string;
  content: string;
  order: number | null;
  sourceFile: string;
  githubUrl: string;
  /** Present only on `type: "assessment"` concepts (27 of 183). */
  assessment?: ConceptAssessment;
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
