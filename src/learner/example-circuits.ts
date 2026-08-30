// Small demo circuits for roadmap topics that don't already have a worked
// example. Built the same way as src/circuit/examples/worked-examples.ts —
// direct Circuit IR via the shared op/buildCircuit helpers — so they reuse
// the same store, simulator, code generator, and visualizations as any
// hand-built circuit. Topics for Deutsch–Jozsa / Grover reuse the existing
// builders from worked-examples.ts directly instead of duplicating them.

import type { QuantumCircuit } from "../circuit/model/types";
import { op, buildCircuit as build } from "../circuit/model/build-helpers";

/** |0⟩ --gate--M-- : apply one single-qubit gate and measure. Covers every
 * single-qubit gate topic (X, Y, Z, H, S, T, RX/RY/RZ) without a dedicated
 * builder per gate. */
export function buildSingleGateCircuit(gateId: string, parameters?: number[]): QuantumCircuit {
  return build(1, 1, [op(gateId, [0], 0, { parameters }), op("measure", [0], 1)]);
}

export function buildSuperpositionCircuit(): QuantumCircuit {
  return buildSingleGateCircuit("h");
}

export function buildBitFlipCircuit(): QuantumCircuit {
  return buildSingleGateCircuit("x");
}

/** q0 --H--*--M--   q1 -----gate--M-- : entangling a controlled gate onto a
 * qubit already in superposition. cx gives the Bell pair; cz gives the
 * phase-only entangled analogue. */
export function buildControlledGateCircuit(gateId: "cx" | "cz"): QuantumCircuit {
  return build(2, 2, [
    op("h", [0], 0),
    op(gateId, [1], 1, { controls: [0] }),
    op("measure", [0], 2),
    op("measure", [1], 2),
  ]);
}

export function buildBellStateCircuit(): QuantumCircuit {
  return buildControlledGateCircuit("cx");
}

/** A bare, ungated qubit — the default |0⟩ state, for the very first "Qubits" topic demo. */
export function buildBareQubitCircuit(): QuantumCircuit {
  return build(1, 1, [op("measure", [0], 0)]);
}

/** Two independent (unentangled) qubits — introduces multi-qubit registers before entanglement. */
export function buildTwoQubitRegisterCircuit(): QuantumCircuit {
  return build(2, 2, [op("measure", [0], 0), op("measure", [1], 0)]);
}

/** SWAP demo: put q0 in a distinct state (X), then swap it onto q1. */
export function buildSwapCircuit(): QuantumCircuit {
  return build(2, 2, [op("x", [0], 0), op("swap", [0, 1], 1), op("measure", [0], 2), op("measure", [1], 2)]);
}
