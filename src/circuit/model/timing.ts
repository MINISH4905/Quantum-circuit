import type { QuantumCircuit } from "./types";

/** Find the first timeStep >= from where none of `qubits` already has an operation. */
export function findFreeTimeStep(circuit: QuantumCircuit, qubits: number[], from = 0): number {
  let t = Math.max(0, from);
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const occupied = circuit.operations.some(
      (op) => op.timeStep === t && [...(op.controls ?? []), ...op.targets].some((q) => qubits.includes(q))
    );
    if (!occupied) return t;
    t += 1;
  }
}
