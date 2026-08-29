import type { GateDefinition } from "./types";

const GATES: GateDefinition[] = [
  { id: "h", name: "Hadamard", symbol: "H", category: "single", controlCount: 0, targetCount: 1, parameterCount: 0, qiskitName: "h", cirqName: "H", pennylaneName: "Hadamard" },
  { id: "x", name: "Pauli-X", symbol: "X", category: "single", controlCount: 0, targetCount: 1, parameterCount: 0, qiskitName: "x", cirqName: "X", pennylaneName: "PauliX" },
  { id: "y", name: "Pauli-Y", symbol: "Y", category: "single", controlCount: 0, targetCount: 1, parameterCount: 0, qiskitName: "y", cirqName: "Y", pennylaneName: "PauliY" },
  { id: "z", name: "Pauli-Z", symbol: "Z", category: "single", controlCount: 0, targetCount: 1, parameterCount: 0, qiskitName: "z", cirqName: "Z", pennylaneName: "PauliZ" },
  { id: "s", name: "S (Phase)", symbol: "S", category: "single", controlCount: 0, targetCount: 1, parameterCount: 0, qiskitName: "s", cirqName: "S", pennylaneName: "S" },
  { id: "t", name: "T (π/8)", symbol: "T", category: "single", controlCount: 0, targetCount: 1, parameterCount: 0, qiskitName: "t", cirqName: "T", pennylaneName: "T" },

  { id: "rx", name: "Rotation X", symbol: "RX", category: "rotation", controlCount: 0, targetCount: 1, parameterCount: 1, parameterNames: ["theta"], qiskitName: "rx", cirqName: "rx", pennylaneName: "RX" },
  { id: "ry", name: "Rotation Y", symbol: "RY", category: "rotation", controlCount: 0, targetCount: 1, parameterCount: 1, parameterNames: ["theta"], qiskitName: "ry", cirqName: "ry", pennylaneName: "RY" },
  { id: "rz", name: "Rotation Z", symbol: "RZ", category: "rotation", controlCount: 0, targetCount: 1, parameterCount: 1, parameterNames: ["theta"], qiskitName: "rz", cirqName: "rz", pennylaneName: "RZ" },

  { id: "cx", name: "CNOT", symbol: "X", category: "multi", controlCount: 1, targetCount: 1, parameterCount: 0, qiskitName: "cx", cirqName: "CNOT", pennylaneName: "CNOT" },
  { id: "cz", name: "Controlled-Z", symbol: "Z", category: "multi", controlCount: 1, targetCount: 1, parameterCount: 0, qiskitName: "cz", cirqName: "CZ", pennylaneName: "CZ" },
  { id: "swap", name: "SWAP", symbol: "SWAP", category: "multi", controlCount: 0, targetCount: 2, parameterCount: 0, qiskitName: "swap", cirqName: "SWAP", pennylaneName: "SWAP" },

  { id: "measure", name: "Measure", symbol: "M", category: "measurement", controlCount: 0, targetCount: 1, parameterCount: 0, qiskitName: "measure", cirqName: "measure", pennylaneName: "measure", writesClassicalBit: true },
];

const BY_ID = new Map(GATES.map((g) => [g.id, g]));
const BY_QISKIT_NAME = new Map(GATES.map((g) => [g.qiskitName, g]));
const BY_CIRQ_NAME = new Map(GATES.filter((g) => g.cirqName).map((g) => [g.cirqName!, g]));
const BY_PENNYLANE_NAME = new Map(GATES.filter((g) => g.pennylaneName).map((g) => [g.pennylaneName!, g]));

export function listGates(): GateDefinition[] {
  return GATES;
}

export function getGate(id: string): GateDefinition | undefined {
  return BY_ID.get(id);
}

export function getGateByQiskitName(qiskitName: string): GateDefinition | undefined {
  return BY_QISKIT_NAME.get(qiskitName);
}

export function getGateByCirqName(cirqName: string): GateDefinition | undefined {
  return BY_CIRQ_NAME.get(cirqName);
}

export function getGateByPennylaneName(pennylaneName: string): GateDefinition | undefined {
  return BY_PENNYLANE_NAME.get(pennylaneName);
}

export function listGatesByCategory(category: GateDefinition["category"]): GateDefinition[] {
  return GATES.filter((g) => g.category === category);
}

export function qubitCount(gate: GateDefinition): number {
  return gate.controlCount + gate.targetCount;
}

export const SUPPORTED_GATE_NAMES = GATES.map((g) => g.qiskitName.toUpperCase()).join(", ");
export const SUPPORTED_CIRQ_GATE_NAMES = GATES.filter((g) => g.cirqName).map((g) => g.cirqName!).join(", ");
export const SUPPORTED_PENNYLANE_GATE_NAMES = GATES.filter((g) => g.pennylaneName).map((g) => g.pennylaneName!).join(", ");
