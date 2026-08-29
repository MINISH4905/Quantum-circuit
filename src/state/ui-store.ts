import { create } from "zustand";
import type { QuantumOperation } from "../circuit/model/types";
import type { Framework } from "../circuit/framework";

export interface HighlightStepData {
  gate: string;
  qubits: string;
  action: string;
  stepIndex: number;
  totalSteps: number;
}

interface UiState {
  selectedOperationId: string | null;
  highlightedOpId: string | null;
  highlightedStepData: HighlightStepData | null;
  clipboard: Omit<QuantumOperation, "id" | "timeStep"> | null;
  lastFocusedQubit: number;
  activeFramework: Framework;
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;

  select: (id: string | null) => void;
  highlightStep: (opId: string | null, stepData?: HighlightStepData | null) => void;
  copySelected: (op: QuantumOperation | undefined) => void;
  setLastFocusedQubit: (q: number) => void;
  setActiveFramework: (framework: Framework) => void;
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  selectedOperationId: null,
  highlightedOpId: null,
  highlightedStepData: null,
  clipboard: null,
  lastFocusedQubit: 0,
  activeFramework: "qiskit",
  leftPanelOpen: true,
  rightPanelOpen: true,

  select: (id) => set({ selectedOperationId: id }),
  highlightStep: (opId, stepData) => set({ highlightedOpId: opId, highlightedStepData: stepData ?? null }),

  copySelected: (op) => {
    if (!op) return;
    const { id: _id, timeStep: _timeStep, ...rest } = op;
    set({ clipboard: rest });
  },

  setLastFocusedQubit: (q) => set({ lastFocusedQubit: q }),
  setActiveFramework: (activeFramework) => set({ activeFramework }),
  toggleLeftPanel: () => set((s) => ({ leftPanelOpen: !s.leftPanelOpen })),
  toggleRightPanel: () => set((s) => ({ rightPanelOpen: !s.rightPanelOpen })),
}));
