import { create } from "zustand";
import type { TutorialDef, TutorialStepDef } from "../circuit/examples/tutorials";

export type TutorialStatus = "idle" | "active" | "step-success" | "step-error" | "complete";

interface TutorialState {
  status: TutorialStatus;
  tutorial: TutorialDef | null;
  currentStepIndex: number;
  errorHint: string;

  currentStep: () => TutorialStepDef | null;
  totalSteps: () => number;
  isActive: () => boolean;

  startTutorial: (def: TutorialDef) => void;
  advanceStep: () => void;
  markStepSuccess: () => void;
  markStepError: (hint: string) => void;
  clearError: () => void;
  restart: () => void;
  exit: () => void;
}

export const useTutorialStore = create<TutorialState>((set, get) => ({
  status: "idle",
  tutorial: null,
  currentStepIndex: 0,
  errorHint: "",

  currentStep: () => {
    const { tutorial, currentStepIndex } = get();
    return tutorial?.steps[currentStepIndex] ?? null;
  },
  totalSteps: () => get().tutorial?.steps.length ?? 0,
  isActive: () => get().status !== "idle" && get().status !== "complete",

  startTutorial: (def) =>
    set({ status: "active", tutorial: def, currentStepIndex: 0, errorHint: "" }),

  advanceStep: () => {
    const { currentStepIndex, tutorial } = get();
    if (!tutorial) return;
    if (currentStepIndex >= tutorial.steps.length - 1) {
      set({ status: "complete" });
    } else {
      set({ status: "active", currentStepIndex: currentStepIndex + 1, errorHint: "" });
    }
  },

  markStepSuccess: () => set({ status: "step-success" }),

  markStepError: (hint) => set({ status: "step-error", errorHint: hint }),

  clearError: () => {
    if (get().status === "step-error") set({ status: "active", errorHint: "" });
  },

  restart: () => {
    const { tutorial } = get();
    if (tutorial) set({ status: "active", currentStepIndex: 0, errorHint: "" });
  },

  exit: () => set({ status: "idle", tutorial: null, currentStepIndex: 0, errorHint: "" }),
}));
