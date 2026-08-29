import { create } from "zustand";
import type { QuantumCircuit, QuantumOperation } from "../circuit/model/types";
import { createEmptyCircuit } from "../circuit/model/types";
import { validateCircuit, type ValidationError } from "../circuit/validation/validate";
import { findFreeTimeStep } from "../circuit/model/timing";
import { generateOperationId } from "../circuit/model/id";

export { findFreeTimeStep, generateOperationId };

const MAX_HISTORY = 100;

function cloneCircuit(circuit: QuantumCircuit): QuantumCircuit {
  return {
    ...circuit,
    operations: circuit.operations.map((op) => ({ ...op })),
  };
}

function revalidate(circuit: QuantumCircuit): ValidationError[] {
  return validateCircuit(circuit);
}

interface CircuitState {
  circuit: QuantumCircuit;
  name: string;
  errors: ValidationError[];
  past: QuantumCircuit[];
  future: QuantumCircuit[];

  setCircuit: (circuit: QuantumCircuit, opts?: { history?: boolean }) => void;
  setName: (name: string) => void;
  addQubit: () => void;
  removeQubit: (index: number) => void;
  addOperation: (op: Omit<QuantumOperation, "id">) => string;
  removeOperation: (id: string) => void;
  removeOperations: (ids: string[]) => void;
  updateOperation: (id: string, patch: Partial<Omit<QuantumOperation, "id">>) => void;
  insertTimeStep: (at: number) => void;
  removeTimeStep: (at: number) => void;

  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

/** Wrap a mutator so it snapshots for undo/redo before applying. */
function withHistory(
  set: (fn: (state: CircuitState) => Partial<CircuitState>) => void,
  get: () => CircuitState,
  compute: (circuit: QuantumCircuit) => QuantumCircuit
) {
  const prev = get().circuit;
  const next = compute(prev);
  if (next === prev) return;
  const past = [...get().past, cloneCircuit(prev)].slice(-MAX_HISTORY);
  set(() => ({ circuit: next, errors: revalidate(next), past, future: [] }));
}

export const useCircuitStore = create<CircuitState>((set, get) => ({
  circuit: createEmptyCircuit(2, 2),
  name: "Untitled circuit",
  errors: [],
  past: [],
  future: [],

  setCircuit: (circuit, opts) => {
    if (opts?.history === false) {
      set({ circuit, errors: revalidate(circuit) });
      return;
    }
    withHistory(set, get, () => circuit);
  },

  setName: (name) => set({ name: name.trim() || "Untitled circuit" }),

  addQubit: () =>
    withHistory(set, get, (circuit) => ({ ...circuit, qubits: circuit.qubits + 1 })),

  removeQubit: (index) =>
    withHistory(set, get, (circuit) => {
      if (circuit.qubits <= 1) return circuit;
      return {
        ...circuit,
        qubits: circuit.qubits - 1,
        operations: circuit.operations
          .filter((op) => !op.targets.includes(index) && !(op.controls ?? []).includes(index))
          .map((op) => ({
            ...op,
            targets: op.targets.map((q) => (q > index ? q - 1 : q)),
            controls: op.controls?.map((q) => (q > index ? q - 1 : q)),
          })),
      };
    }),

  addOperation: (op) => {
    const id = generateOperationId();
    withHistory(set, get, (circuit) => ({
      ...circuit,
      operations: [...circuit.operations, { ...op, id }],
    }));
    return id;
  },

  removeOperation: (id) =>
    withHistory(set, get, (circuit) => ({
      ...circuit,
      operations: circuit.operations.filter((op) => op.id !== id),
    })),

  removeOperations: (ids) =>
    withHistory(set, get, (circuit) => ({
      ...circuit,
      operations: circuit.operations.filter((op) => !ids.includes(op.id)),
    })),

  updateOperation: (id, patch) =>
    withHistory(set, get, (circuit) => ({
      ...circuit,
      operations: circuit.operations.map((op) => (op.id === id ? { ...op, ...patch } : op)),
    })),

  insertTimeStep: (at) =>
    withHistory(set, get, (circuit) => ({
      ...circuit,
      operations: circuit.operations.map((op) => (op.timeStep >= at ? { ...op, timeStep: op.timeStep + 1 } : op)),
    })),

  removeTimeStep: (at) =>
    withHistory(set, get, (circuit) => ({
      ...circuit,
      operations: circuit.operations
        .filter((op) => op.timeStep !== at)
        .map((op) => (op.timeStep > at ? { ...op, timeStep: op.timeStep - 1 } : op)),
    })),

  undo: () => {
    const { past, circuit, future } = get();
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    set({
      circuit: previous,
      errors: revalidate(previous),
      past: past.slice(0, -1),
      future: [cloneCircuit(circuit), ...future].slice(0, MAX_HISTORY),
    });
  },

  redo: () => {
    const { future, circuit, past } = get();
    if (future.length === 0) return;
    const next = future[0];
    set({
      circuit: next,
      errors: revalidate(next),
      past: [...past, cloneCircuit(circuit)].slice(-MAX_HISTORY),
      future: future.slice(1),
    });
  },

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,
}));
