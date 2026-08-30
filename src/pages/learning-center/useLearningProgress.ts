import { useCallback, useState } from "react";
import type { LearningModule, LearningStage } from "./types";

const STORAGE_KEY = "qcl_learning_progress";

// Concept `id`s (slugified filenames) collide both across AND within
// modules — e.g. several lesson subfolders in the same course each have
// their own introduction.ipynb, all slugifying to "introduction". Every
// concept's `sourceFile` (its GitHub path) is the only field guaranteed to
// be globally unique, so it's used as the identity for progress, selection,
// and React keys throughout the Learning Center instead of `id`.

function loadProgress(): Record<string, true> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, true>) : {};
  } catch {
    return {};
  }
}

function saveProgress(progress: Record<string, true>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // localStorage unavailable (e.g. private mode) — progress just won't persist
  }
}

/** Tracks completed concepts in localStorage (key: qcl_learning_progress),
 * separate from the existing Learner page's own progress store — this is a
 * deliberately standalone feature, not integrated with it. */
export function useLearningProgress() {
  const [progress, setProgress] = useState<Record<string, true>>(() => loadProgress());

  const isConceptComplete = useCallback((sourceFile: string) => !!progress[sourceFile], [progress]);

  // Optimistic: state update (re-renders sidebar/module card immediately) and
  // the localStorage write happen together, synchronously.
  const markConceptComplete = useCallback((sourceFile: string) => {
    setProgress((prev) => {
      if (prev[sourceFile]) return prev;
      const next = { ...prev, [sourceFile]: true as const };
      saveProgress(next);
      return next;
    });
  }, []);

  const getModuleCompletionCount = useCallback(
    (learningModule: LearningModule) => learningModule.concepts.filter((c) => isConceptComplete(c.sourceFile)).length,
    [isConceptComplete]
  );

  const getModuleCompletionPercent = useCallback(
    (learningModule: LearningModule) => {
      if (learningModule.concepts.length === 0) return 0;
      return Math.round((getModuleCompletionCount(learningModule) / learningModule.concepts.length) * 100);
    },
    [getModuleCompletionCount]
  );

  const getStageCompletionPercent = useCallback(
    (stage: LearningStage) => {
      const totalConcepts = stage.modules.reduce((sum, m) => sum + m.concepts.length, 0);
      if (totalConcepts === 0) return 0;
      const completed = stage.modules.reduce((sum, m) => sum + getModuleCompletionCount(m), 0);
      return Math.round((completed / totalConcepts) * 100);
    },
    [getModuleCompletionCount]
  );

  return {
    isConceptComplete,
    markConceptComplete,
    getModuleCompletionCount,
    getModuleCompletionPercent,
    getStageCompletionPercent,
  };
}
