// Canonical Circuit Intermediate Representation (IR).
// This is the single source of truth for circuit state.

export interface QuantumOperation {
  id: string;
  gate: string; // GateDefinition.id
  targets: number[];
  controls?: number[];
  parameters?: number[];
  timeStep: number;
}

export interface QuantumCircuit {
  version: 1;
  qubits: number;
  classicalBits: number;
  operations: QuantumOperation[];
}

export function createEmptyCircuit(qubits = 2, classicalBits = 2): QuantumCircuit {
  return {
    version: 1,
    qubits,
    classicalBits,
    operations: [],
  };
}
