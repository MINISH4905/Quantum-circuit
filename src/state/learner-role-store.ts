import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LearnerRole } from "../pages/learner-module/roles";

interface LearnerRoleState {
  role: LearnerRole | null;
  setRole: (role: LearnerRole) => void;
  clearRole: () => void;
  /** The last concept the learner opened, for "Resume where you left off" —
   * separate from completion (a concept can be the resume point without
   * being marked complete yet). */
  lastOpenedSourceFile: string | null;
  setLastOpened: (sourceFile: string) => void;
}

/** Selected Learner Module role (Beginner/Professional/Advanced) plus resume
 * position, persisted the same way learner-progress-store persists roadmap
 * progress — so both stick across visits and the user isn't asked to pick a
 * role or hunt for where they left off every time. */
export const useLearnerRoleStore = create<LearnerRoleState>()(
  persist(
    (set) => ({
      role: null,
      setRole: (role) => set({ role }),
      clearRole: () => set({ role: null }),
      lastOpenedSourceFile: null,
      setLastOpened: (sourceFile) => set({ lastOpenedSourceFile: sourceFile }),
    }),
    { name: "quantum-circuit-lab.learner-module-role" }
  )
);
