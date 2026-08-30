import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LearnerTaskState {
  completedTaskIds: string[];
  markTaskComplete: (id: string) => void;
}

/** Hands-on task completion, persisted the same way learner-progress-store
 * persists roadmap progress. Keyed by concept.sourceFile (globally unique —
 * see the sourceFile-vs-id note in useLearningProgress.ts), one task per
 * concept that has a ConceptExample. */
export const useLearnerTaskStore = create<LearnerTaskState>()(
  persist(
    (set) => ({
      completedTaskIds: [],
      markTaskComplete: (id) =>
        set((state) => (state.completedTaskIds.includes(id) ? state : { completedTaskIds: [...state.completedTaskIds, id] })),
    }),
    { name: "quantum-circuit-lab.learner-hands-on-tasks" }
  )
);
