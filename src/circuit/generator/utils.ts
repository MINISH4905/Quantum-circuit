import type { QuantumCircuit, QuantumOperation } from "../model/types";

function minQubit(op: QuantumOperation): number {
  return Math.min(...(op.controls ?? []), ...op.targets);
}

export function orderedOperations(circuit: QuantumCircuit): QuantumOperation[] {
  return [...circuit.operations].sort((a, b) => a.timeStep - b.timeStep || minQubit(a) - minQubit(b));
}

export function groupByTimeStep(ops: QuantumOperation[]): Map<number, QuantumOperation[]> {
  const groups = new Map<number, QuantumOperation[]>();
  for (const op of ops) {
    const list = groups.get(op.timeStep);
    if (list) list.push(op);
    else groups.set(op.timeStep, [op]);
  }
  return groups;
}
