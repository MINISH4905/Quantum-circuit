import { create } from "zustand";
import type { QuantumOperation } from "../circuit/model/types";
import type { Framework } from "../circuit/framework";

interface UiState {
  selectedOperationId: string | null;
  clipboard: Omit<QuantumOperation, "id" | "timeStep"> | null;
  lastFocusedQubit: number;
  activeFramework: Framework;

  select: (id: string | null) => void;
  copySelected: (op: QuantumOperation | undefined) => void;
  setLastFocusedQubit: (q: number) => void;
  setActiveFramework: (framework: Framework) => void;
}

export const useUiStore = create<UiState>((set) => ({
  selectedOperationId: null,
  clipboard: null,
  lastFocusedQubit: 0,
  activeFramework: "qiskit",

  select: (id) => set({ selectedOperationId: id }),

  copySelected: (op) => {
    if (!op) return;
    const { id: _id, timeStep: _timeStep, ...rest } = op;
    set({ clipboard: rest });
  },

  setLastFocusedQubit: (q) => set({ lastFocusedQubit: q }),
  setActiveFramework: (activeFramework) => set({ activeFramework }),
}));
