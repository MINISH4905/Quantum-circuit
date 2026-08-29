export type GateCategory = "single" | "rotation" | "multi" | "measurement";

export interface GateDefinition {
  /** Internal identifier, used as QuantumOperation.gate */
  id: string;
  /** Human readable name */
  name: string;
  /** Symbol shown on the circuit canvas */
  symbol: string;
  category: GateCategory;
  /** Number of control qubits (0 for non-controlled gates) */
  controlCount: number;
  /** Number of target qubits */
  targetCount: number;
  /** Number of numeric parameters (e.g. rotation angle) */
  parameterCount: number;
  /** Names for each parameter, e.g. ["theta"] */
  parameterNames?: string[];
  /** Method name used on a Qiskit QuantumCircuit instance, e.g. "h", "cx" */
  qiskitName: string;
  /** Cirq gate name, e.g. "H", "CNOT", "rx" */
  cirqName?: string;
  /** PennyLane gate name, e.g. "Hadamard", "CNOT", "RX" */
  pennylaneName?: string;
  /** Whether this operation writes to a classical bit (measurement) */
  writesClassicalBit?: boolean;
}
