import { create } from "zustand";
import type { BackendSimulationResult } from "../api/simulation-api";

export type SimulationMode = "local" | "backend";

interface SimulationState {
  mode: SimulationMode;
  setMode: (mode: SimulationMode) => void;

  backendResult: BackendSimulationResult | null;
  backendError: string | null;
  backendLoading: boolean;
  setBackendResult: (result: BackendSimulationResult | null) => void;
  setBackendError: (error: string | null) => void;
  setBackendLoading: (loading: boolean) => void;
}

// Holds simulation *results* and the active mode — not circuit data. The
// Circuit IR in circuit-store remains the only source of truth for the
// circuit itself; this store only caches derived simulation output.
export const useSimulationStore = create<SimulationState>((set) => ({
  mode: "local",
  setMode: (mode) => set({ mode, backendResult: null, backendError: null }),

  backendResult: null,
  backendError: null,
  backendLoading: false,
  setBackendResult: (backendResult) => set({ backendResult }),
  setBackendError: (backendError) => set({ backendError }),
  setBackendLoading: (backendLoading) => set({ backendLoading }),
}));
