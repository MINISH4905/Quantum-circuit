// Predefined "worked example" circuits, loadable with one click from the UI.
// Built directly as Circuit IR so they reuse the same store, gate model,
// code generator, simulator, and visualizations as any hand-built circuit.

import type { QuantumCircuit } from "../model/types";
import { op, buildCircuit as build } from "../model/build-helpers";

/**
 * Deutsch–Jozsa, 2 input qubits (q0, q1) + 1 ancilla (q2), with a balanced
 * oracle f(x0, x1) = x0 XOR x1 implemented as CX(q0,q2), CX(q1,q2).
 * Measuring the input qubits as anything other than 00 confirms "balanced".
 */
export function buildDeutschJozsaCircuit(): QuantumCircuit {
  const [q0, q1, ancilla] = [0, 1, 2];
  return build(3, 2, [
    op("x", [ancilla], 0),
    op("h", [q0], 1),
    op("h", [q1], 1),
    op("h", [ancilla], 1),
    op("cx", [ancilla], 2, { controls: [q0] }),
    op("cx", [ancilla], 3, { controls: [q1] }),
    op("h", [q0], 4),
    op("h", [q1], 4),
    op("measure", [q0], 5),
    op("measure", [q1], 5),
  ]);
}

/**
 * Grover's search, 2 qubits, one iteration marking |11>. A single iteration
 * is optimal for N=4 with one marked state, so the |11> outcome measures
 * with probability 1 (ideal, noise-free simulation).
 */
export function buildGroverCircuit(): QuantumCircuit {
  const [q0, q1] = [0, 1];
  return build(2, 2, [
    op("h", [q0], 0),
    op("h", [q1], 0),
    // Oracle: phase-flip |11>
    op("cz", [q1], 1, { controls: [q0] }),
    // Diffusion operator (inversion about the mean)
    op("h", [q0], 2),
    op("h", [q1], 2),
    op("x", [q0], 3),
    op("x", [q1], 3),
    op("cz", [q1], 4, { controls: [q0] }),
    op("x", [q0], 5),
    op("x", [q1], 5),
    op("h", [q0], 6),
    op("h", [q1], 6),
    op("measure", [q0], 7),
    op("measure", [q1], 7),
  ]);
}

/**
 * Bell State (|Φ+⟩): simplest entanglement circuit.
 * H on q0 → CX(q0,q1) → measure both.
 */
export function buildBellStateCircuit(): QuantumCircuit {
  const [q0, q1] = [0, 1];
  return build(2, 2, [
    op("h", [q0], 0),
    op("cx", [q1], 1, { controls: [q0] }),
    op("measure", [q0], 2),
    op("measure", [q1], 2),
  ]);
}

/**
 * GHZ State: 3-qubit entanglement. H → two CX gates → measure all.
 */
export function buildGHZCircuit(): QuantumCircuit {
  const [q0, q1, q2] = [0, 1, 2];
  return build(3, 3, [
    op("h", [q0], 0),
    op("cx", [q1], 1, { controls: [q0] }),
    op("cx", [q2], 2, { controls: [q0] }),
    op("measure", [q0], 3),
    op("measure", [q1], 3),
    op("measure", [q2], 3),
  ]);
}

/**
 * Quantum Teleportation: teleport an X-prepared state from q0 to q2
 * via a Bell pair on q1-q2. Corrections applied unconditionally
 * (ideal simulation without classical conditioning).
 */
export function buildTeleportationCircuit(): QuantumCircuit {
  const [q0, q1, q2] = [0, 1, 2];
  return build(3, 2, [
    op("x", [q0], 0),
    op("h", [q1], 1),
    op("cx", [q2], 2, { controls: [q1] }),
    op("cx", [q1], 3, { controls: [q0] }),
    op("h", [q0], 4),
    op("measure", [q0], 5),
    op("measure", [q1], 5),
    op("cx", [q2], 6, { controls: [q1] }),
    op("cz", [q2], 7, { controls: [q0] }),
  ]);
}

/**
 * Superdense Coding: encode classical bits "11" into one qubit of a
 * Bell pair. Alice applies X+Z, then Bob decodes with CX+H+Measure.
 */
export function buildSuperdenseCodingCircuit(): QuantumCircuit {
  const [q0, q1] = [0, 1];
  return build(2, 2, [
    op("h", [q0], 0),
    op("cx", [q1], 1, { controls: [q0] }),
    op("x", [q0], 2),
    op("z", [q0], 3),
    op("cx", [q1], 4, { controls: [q0] }),
    op("h", [q0], 5),
    op("measure", [q0], 6),
    op("measure", [q1], 6),
  ]);
}

export interface WorkedExample {
  id: string;
  label: string;
  description: string;
  qubits: number;
  gateCount: number;
  build: () => QuantumCircuit;
}

export const WORKED_EXAMPLES: WorkedExample[] = [
  {
    id: "bell-state",
    label: "Bell State",
    description: "Entangle 2 qubits into |Φ+⟩",
    qubits: 2,
    gateCount: 4,
    build: buildBellStateCircuit,
  },
  {
    id: "ghz-state",
    label: "GHZ State",
    description: "3-qubit entanglement (|000⟩ + |111⟩)/√2",
    qubits: 3,
    gateCount: 6,
    build: buildGHZCircuit,
  },
  {
    id: "superdense",
    label: "Superdense Coding",
    description: "Send 2 classical bits using 1 qubit",
    qubits: 2,
    gateCount: 8,
    build: buildSuperdenseCodingCircuit,
  },
  {
    id: "teleportation",
    label: "Quantum Teleportation",
    description: "Teleport a qubit state via Bell pair",
    qubits: 3,
    gateCount: 9,
    build: buildTeleportationCircuit,
  },
  {
    id: "deutsch-jozsa",
    label: "Deutsch–Jozsa",
    description: "2 input qubits + 1 ancilla, balanced oracle",
    qubits: 3,
    gateCount: 10,
    build: buildDeutschJozsaCircuit,
  },
  {
    id: "grover",
    label: "Grover's Search",
    description: "2 qubits, 1 iteration, marks |11⟩",
    qubits: 2,
    gateCount: 13,
    build: buildGroverCircuit,
  },
];
