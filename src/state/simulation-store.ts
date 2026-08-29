import { create } from "zustand";
import type { BackendSimulationResult } from "../api/simulation-api";

export type SimulationBackend = "local" | "qiskit" | "cirq" | "pennylane";
export type SimulationMode = "local" | "backend" | "compare";

interface SimulationState {
  mode: SimulationMode;
  activeBackend: SimulationBackend;
  setMode: (mode: SimulationMode) => void;
  setActiveBackend: (backend: SimulationBackend) => void;

  backendResult: BackendSimulationResult | null;
  backendError: string | null;
  backendLoading: boolean;
  setBackendResult: (result: BackendSimulationResult | null) => void;
  setBackendError: (error: string | null) => void;
  setBackendLoading: (loading: boolean) => void;

  compareResults: Record<string, BackendSimulationResult & { timing_ms: number }> | null;
  compareAgreement: boolean | null;
  compareError: string | null;
  compareLoading: boolean;
  setCompareResults: (results: Record<string, BackendSimulationResult & { timing_ms: number }> | null) => void;
  setCompareAgreement: (agreement: boolean | null) => void;
  setCompareError: (error: string | null) => void;
  setCompareLoading: (loading: boolean) => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  mode: "local",
  activeBackend: "local",
  setMode: (mode) =>
    set({
      mode,
      backendResult: null,
      backendError: null,
      compareResults: null,
      compareAgreement: null,
      compareError: null,
    }),
  setActiveBackend: (activeBackend) =>
    set({
      activeBackend,
      mode: activeBackend === "local" ? "local" : activeBackend === "qiskit" || activeBackend === "cirq" || activeBackend === "pennylane" ? "backend" : "local",
      backendResult: null,
      backendError: null,
    }),

  backendResult: null,
  backendError: null,
  backendLoading: false,
  setBackendResult: (backendResult) => set({ backendResult }),
  setBackendError: (backendError) => set({ backendError }),
  setBackendLoading: (backendLoading) => set({ backendLoading }),

  compareResults: null,
  compareAgreement: null,
  compareError: null,
  compareLoading: false,
  setCompareResults: (compareResults) => set({ compareResults }),
  setCompareAgreement: (compareAgreement) => set({ compareAgreement }),
  setCompareError: (compareError) => set({ compareError }),
  setCompareLoading: (compareLoading) => set({ compareLoading }),
}));
