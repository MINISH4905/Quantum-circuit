import type { LearningConcept, LearningModule, LearningStage } from "../learning-center/types";

export type LearnerRole = "beginner" | "professional" | "advanced";

export const LEARNER_ROLES: LearnerRole[] = ["beginner", "professional", "advanced"];

export const ROLE_INFO: Record<LearnerRole, { label: string; blurb: string }> = {
  beginner: {
    label: "Beginner",
    blurb: "Start from quantum computing fundamentals and gradually build intuition.",
  },
  professional: {
    label: "Professional",
    blurb: "Focus on practical quantum computing, algorithms, programming and implementation.",
  },
  advanced: {
    label: "Advanced / Expert",
    blurb: "Focus on advanced algorithms, optimization, quantum programming and deeper technical concepts.",
  },
};

// Data-driven mapping layer: the roadmap content itself is 100% sourced from
// learning-content.json (via useLearningData) — this only reorders which of
// its existing stage ids come first for a given role. Keyed by the stage
// `id`s already present in the JSON (foundations/algorithms/advanced-topics/
// exploration), not by hardcoding any topic/module content. Stages that
// exist in the JSON but aren't listed here still appear, appended at the
// end, so new content the fetch script adds later is never hidden.
const ROLE_STAGE_ORDER: Record<LearnerRole, string[]> = {
  beginner: ["foundations", "algorithms", "advanced-topics", "exploration"],
  professional: ["foundations", "exploration", "algorithms", "advanced-topics"],
  advanced: ["algorithms", "advanced-topics", "exploration", "foundations"],
};

/** Reorders (never filters) `roadmap`'s stages for the given role — see the
 * "do not make the roadmap unnecessarily restrictive" note this satisfies:
 * every role can still reach every stage, just in a different recommended
 * order. */
export function getRoadmapForRole(roadmap: LearningStage[], role: LearnerRole): LearningStage[] {
  const order = ROLE_STAGE_ORDER[role];
  return [...roadmap].sort((a, b) => {
    const ai = order.indexOf(a.id);
    const bi = order.indexOf(b.id);
    return (ai === -1 ? order.length : ai) - (bi === -1 ? order.length : bi);
  });
}

export interface ConceptContext {
  stage: LearningStage;
  learningModule: LearningModule;
  concept: LearningConcept;
}

/** First not-yet-completed concept, walking the role-ordered roadmap
 * top to bottom — what "Continue Learning" jumps to when there's no active
 * resume point (or the resume point has since been completed). Returns null
 * once every concept is done. */
export function getRecommendedConcept(
  orderedRoadmap: LearningStage[],
  isConceptComplete: (sourceFile: string) => boolean
): ConceptContext | null {
  for (const stage of orderedRoadmap) {
    for (const learningModule of stage.modules) {
      for (const concept of learningModule.concepts) {
        if (!isConceptComplete(concept.sourceFile)) {
          return { stage, learningModule, concept };
        }
      }
    }
  }
  return null;
}
