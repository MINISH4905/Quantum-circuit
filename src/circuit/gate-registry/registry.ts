import type { GateDefinition } from "./types";

// Centralized gate registry. Add new gates here only —
// no gate behavior should be hard-coded elsewhere in the app.
const GATES: GateDefinition[] = [
  { id: "h", name: "Hadamard", symbol: "H", category: "single", controlCount: 0, targetCount: 1, parameterCount: 0, qiskitName: "h" },
  { id: "x", name: "Pauli-X", symbol: "X", category: "single", controlCount: 0, targetCount: 1, parameterCount: 0, qiskitName: "x" },
  { id: "y", name: "Pauli-Y", symbol: "Y", category: "single", controlCount: 0, targetCount: 1, parameterCount: 0, qiskitName: "y" },
  { id: "z", name: "Pauli-Z", symbol: "Z", category: "single", controlCount: 0, targetCount: 1, parameterCount: 0, qiskitName: "z" },
  { id: "s", name: "S (Phase)", symbol: "S", category: "single", controlCount: 0, targetCount: 1, parameterCount: 0, qiskitName: "s" },
  { id: "t", name: "T (π/8)", symbol: "T", category: "single", controlCount: 0, targetCount: 1, parameterCount: 0, qiskitName: "t" },

  { id: "rx", name: "Rotation X", symbol: "RX", category: "rotation", controlCount: 0, targetCount: 1, parameterCount: 1, parameterNames: ["theta"], qiskitName: "rx" },
  { id: "ry", name: "Rotation Y", symbol: "RY", category: "rotation", controlCount: 0, targetCount: 1, parameterCount: 1, parameterNames: ["theta"], qiskitName: "ry" },
  { id: "rz", name: "Rotation Z", symbol: "RZ", category: "rotation", controlCount: 0, targetCount: 1, parameterCount: 1, parameterNames: ["theta"], qiskitName: "rz" },

  { id: "cx", name: "CNOT", symbol: "X", category: "multi", controlCount: 1, targetCount: 1, parameterCount: 0, qiskitName: "cx" },
  { id: "cz", name: "Controlled-Z", symbol: "Z", category: "multi", controlCount: 1, targetCount: 1, parameterCount: 0, qiskitName: "cz" },
  { id: "swap", name: "SWAP", symbol: "SWAP", category: "multi", controlCount: 0, targetCount: 2, parameterCount: 0, qiskitName: "swap" },

  { id: "measure", name: "Measure", symbol: "M", category: "measurement", controlCount: 0, targetCount: 1, parameterCount: 0, qiskitName: "measure", writesClassicalBit: true },
];

const BY_ID = new Map(GATES.map((g) => [g.id, g]));
const BY_QISKIT_NAME = new Map(GATES.map((g) => [g.qiskitName, g]));

export function listGates(): GateDefinition[] {
  return GATES;
}

export function getGate(id: string): GateDefinition | undefined {
  return BY_ID.get(id);
}

export function getGateByQiskitName(qiskitName: string): GateDefinition | undefined {
  return BY_QISKIT_NAME.get(qiskitName);
}

export function listGatesByCategory(category: GateDefinition["category"]): GateDefinition[] {
  return GATES.filter((g) => g.category === category);
}

export function qubitCount(gate: GateDefinition): number {
  return gate.controlCount + gate.targetCount;
}

export const SUPPORTED_GATE_NAMES = GATES.map((g) => g.qiskitName.toUpperCase()).join(", ");
