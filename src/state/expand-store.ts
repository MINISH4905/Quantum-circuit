import { create } from "zustand";

export type ExpandableModuleId =
  | "circuit-editor"
  | "qiskit-code"
  | "probabilities"
  | "bloch-sphere"
  | "q-sphere"
  | "ai-tutor";

interface ExpandState {
  expandedModule: ExpandableModuleId | null;
  toggle: (id: ExpandableModuleId) => void;
  collapse: () => void;
}

/** Only one module can be expanded at a time — a single shared flag keeps
 * every module's expand control consistent instead of six independent ones. */
export const useExpandStore = create<ExpandState>((set) => ({
  expandedModule: null,
  toggle: (id) => set((s) => ({ expandedModule: s.expandedModule === id ? null : id })),
  collapse: () => set({ expandedModule: null }),
}));

export function useExpandable(id: ExpandableModuleId) {
  const expanded = useExpandStore((s) => s.expandedModule === id);
  const toggleFn = useExpandStore((s) => s.toggle);
  const collapse = useExpandStore((s) => s.collapse);
  return { expanded, toggle: () => toggleFn(id), collapse };
}
