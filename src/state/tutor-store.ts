import { create } from "zustand";
import type { TutorAnalysis } from "../api/tutor-api";

interface TutorState {
  result: TutorAnalysis | null;
  error: string | null;
  loading: boolean;
  setResult: (result: TutorAnalysis | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

// Holds the tutor's latest analysis + request state only — not circuit data,
// same separation of concerns as simulation-store.ts.
export const useTutorStore = create<TutorState>((set) => ({
  result: null,
  error: null,
  loading: false,
  setResult: (result) => set({ result }),
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),
}));
