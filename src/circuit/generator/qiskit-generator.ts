import type { QuantumCircuit, QuantumOperation } from "../model/types";
import { getGate } from "../gate-registry/registry";
import { formatParameter } from "../model/parameter-expr";

function minQubit(op: QuantumOperation): number {
  return Math.min(...(op.controls ?? []), ...op.targets);
}

function orderedOperations(circuit: QuantumCircuit): QuantumOperation[] {
  return [...circuit.operations].sort((a, b) => a.timeStep - b.timeStep || minQubit(a) - minQubit(b));
}

function operationLine(op: QuantumOperation): string | null {
  const gate = getGate(op.gate);
  if (!gate) return null;

  const args: string[] = [];
  if (op.parameters?.length) {
    args.push(...op.parameters.map(formatParameter));
  }
  args.push(...(op.controls ?? []).map(String));

  if (gate.writesClassicalBit) {
    const qubit = op.targets[0];
    args.push(String(qubit));
    args.push(String(qubit)); // classical bit mirrors qubit index by convention
  } else {
    args.push(...op.targets.map(String));
  }

  return `qc.${gate.qiskitName}(${args.join(", ")})`;
}

/** Generate readable Qiskit Python source from the canonical Circuit IR. */
export function generateQiskitCode(circuit: QuantumCircuit): string {
  const ops = orderedOperations(circuit);
  const needsPi = ops.some((op) => (op.parameters?.length ?? 0) > 0);

  const lines: string[] = ["from qiskit import QuantumCircuit"];
  if (needsPi) lines.push("from numpy import pi");
  lines.push("");

  const ctorArgs = circuit.classicalBits > 0 ? `${circuit.qubits}, ${circuit.classicalBits}` : `${circuit.qubits}`;
  lines.push(`qc = QuantumCircuit(${ctorArgs})`);
  lines.push("");

  for (const op of ops) {
    const line = operationLine(op);
    if (line) lines.push(line);
  }

  return lines.join("\n") + "\n";
}
