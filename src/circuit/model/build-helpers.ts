// Shared helpers for constructing Circuit IR programmatically (worked
// examples, etc.) without hand-writing ids.

import type { QuantumCircuit, QuantumOperation } from "./types";
import { generateOperationId } from "./id";

export type OpInput = Omit<QuantumOperation, "id">;

export function op(
  gate: string,
  targets: number[],
  timeStep: number,
  opts: { controls?: number[]; parameters?: number[] } = {}
): OpInput {
  return { gate, targets, timeStep, controls: opts.controls, parameters: opts.parameters };
}

export function buildCircuit(qubits: number, classicalBits: number, ops: OpInput[]): QuantumCircuit {
  return {
    version: 1,
    qubits,
    classicalBits,
    operations: ops.map((o) => ({ ...o, id: generateOperationId("gen") })),
  };
}
