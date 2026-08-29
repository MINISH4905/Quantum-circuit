import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { QuantumCircuit } from "../circuit/model/types";

export interface SavedCircuit {
  id: string;
  name: string;
  savedAt: string;
  circuit: QuantumCircuit;
}

interface SavedCircuitsState {
  savedCircuits: SavedCircuit[];
  saveCircuit: (name: string, circuit: QuantumCircuit) => void;
  deleteCircuit: (id: string) => void;
}

/** Circuits saved from the toolbar's "Save file" action, persisted to
 * localStorage so the Folders panel can list and reload them across
 * sessions — independent of the on-disk JSON download. */
export const useSavedCircuitsStore = create<SavedCircuitsState>()(
  persist(
    (set) => ({
      savedCircuits: [],

      saveCircuit: (name, circuit) =>
        set((state) => ({
          savedCircuits: [
            {
              id: `saved_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
              name,
              savedAt: new Date().toISOString(),
              circuit,
            },
            ...state.savedCircuits,
          ],
        })),

      deleteCircuit: (id) =>
        set((state) => ({ savedCircuits: state.savedCircuits.filter((c) => c.id !== id) })),
    }),
    { name: "quantum-circuit-lab.saved-circuits" }
  )
);
