import type { QuantumCircuit, QuantumOperation } from "../circuit/model/types";

// A minimal statevector simulator, deliberately independent of the visual
// editor and circuit state — it only reads the Circuit IR.

interface Complex {
  re: number;
  im: number;
}

const SQRT1_2 = Math.SQRT1_2;

export interface SimulationResult {
  measuredQubits: number[];
  shots: number;
  counts: Record<string, number>;
  probabilities: Record<string, number>;
}

export interface Statevector {
  qubits: number;
  re: Float64Array;
  im: Float64Array;
}

function newZeroState(qubits: number): { re: Float64Array; im: Float64Array } {
  const size = 1 << qubits;
  const re = new Float64Array(size);
  const im = new Float64Array(size);
  re[0] = 1;
  return { re, im };
}

/** Apply a 2x2 unitary (row-major [[a,b],[c,d]]) to `qubit` across the whole state. */
function applySingleQubitGate(
  state: { re: Float64Array; im: Float64Array },
  qubit: number,
  m: [Complex, Complex, Complex, Complex]
) {
  const [a, b, c, d] = m;
  const { re, im } = state;
  const bit = 1 << qubit;
  const size = re.length;
  for (let i = 0; i < size; i++) {
    if ((i & bit) !== 0) continue; // process each (|0>,|1>) pair once, from the |0> index
    const j = i | bit;
    const re0 = re[i];
    const im0 = im[i];
    const re1 = re[j];
    const im1 = im[j];

    re[i] = a.re * re0 - a.im * im0 + b.re * re1 - b.im * im1;
    im[i] = a.re * im0 + a.im * re0 + b.re * im1 + b.im * re1;
    re[j] = c.re * re0 - c.im * im0 + d.re * re1 - d.im * im1;
    im[j] = c.re * im0 + c.im * re0 + d.re * im1 + d.im * re1;
  }
}

function applyControlledSingleQubitGate(
  state: { re: Float64Array; im: Float64Array },
  control: number,
  target: number,
  m: [Complex, Complex, Complex, Complex]
) {
  const [a, b, c, d] = m;
  const { re, im } = state;
  const controlBit = 1 << control;
  const targetBit = 1 << target;
  const size = re.length;
  for (let i = 0; i < size; i++) {
    if ((i & targetBit) !== 0) continue;
    if ((i & controlBit) === 0) continue; // control must be 1
    const j = i | targetBit;
    const re0 = re[i];
    const im0 = im[i];
    const re1 = re[j];
    const im1 = im[j];

    re[i] = a.re * re0 - a.im * im0 + b.re * re1 - b.im * im1;
    im[i] = a.re * im0 + a.im * re0 + b.re * im1 + b.im * re1;
    re[j] = c.re * re0 - c.im * im0 + d.re * re1 - d.im * im1;
    im[j] = c.re * im0 + c.im * re0 + d.re * im1 + d.im * re1;
  }
}

function applySwap(state: { re: Float64Array; im: Float64Array }, a: number, b: number) {
  const { re, im } = state;
  const bitA = 1 << a;
  const bitB = 1 << b;
  const size = re.length;
  for (let i = 0; i < size; i++) {
    const aSet = (i & bitA) !== 0;
    const bSet = (i & bitB) !== 0;
    if (aSet === bSet) continue;
    const j = (i & ~bitA & ~bitB) | (aSet ? bitB : 0) | (bSet ? bitA : 0);
    if (j <= i) continue; // swap each pair once
    [re[i], re[j]] = [re[j], re[i]];
    [im[i], im[j]] = [im[j], im[i]];
  }
}

function applyCZ(state: { re: Float64Array; im: Float64Array }, control: number, target: number) {
  const { re, im } = state;
  const bit = (1 << control) | (1 << target);
  const size = re.length;
  for (let i = 0; i < size; i++) {
    if ((i & bit) === bit) {
      re[i] = -re[i];
      im[i] = -im[i];
    }
  }
}

const c = (re: number, im = 0): Complex => ({ re, im });

function gateMatrix(gateId: string, theta?: number): [Complex, Complex, Complex, Complex] | null {
  switch (gateId) {
    case "h":
      return [c(SQRT1_2), c(SQRT1_2), c(SQRT1_2), c(-SQRT1_2)];
    case "x":
      return [c(0), c(1), c(1), c(0)];
    case "y":
      return [c(0), c(0, -1), c(0, 1), c(0)];
    case "z":
      return [c(1), c(0), c(0), c(-1)];
    case "s":
      return [c(1), c(0), c(0), c(0, 1)];
    case "t":
      return [c(1), c(0), c(0), c(Math.SQRT1_2, Math.SQRT1_2)];
    case "rx": {
      const t = theta ?? 0;
      return [c(Math.cos(t / 2)), c(0, -Math.sin(t / 2)), c(0, -Math.sin(t / 2)), c(Math.cos(t / 2))];
    }
    case "ry": {
      const t = theta ?? 0;
      return [c(Math.cos(t / 2)), c(-Math.sin(t / 2)), c(Math.sin(t / 2)), c(Math.cos(t / 2))];
    }
    case "rz": {
      const t = theta ?? 0;
      return [c(Math.cos(-t / 2), Math.sin(-t / 2)), c(0), c(0), c(Math.cos(t / 2), Math.sin(t / 2))];
    }
    default:
      return null;
  }
}

function applyOperation(state: { re: Float64Array; im: Float64Array }, op: QuantumOperation) {
  switch (op.gate) {
    case "cx": {
      const m = gateMatrix("x")!;
      applyControlledSingleQubitGate(state, op.controls![0], op.targets[0], m);
      return;
    }
    case "cz":
      applyCZ(state, op.controls![0], op.targets[0]);
      return;
    case "swap":
      applySwap(state, op.targets[0], op.targets[1]);
      return;
    case "measure":
      return; // handled separately during readout, not during evolution
    default: {
      const m = gateMatrix(op.gate, op.parameters?.[0]);
      if (!m) throw new Error(`Simulator does not support gate: ${op.gate}`);
      applySingleQubitGate(state, op.targets[0], m);
    }
  }
}

/** Evolve the circuit's initial |0...0> state through all gates (measurement ops are no-ops). */
export function computeStatevector(circuit: QuantumCircuit): Statevector {
  const state = newZeroState(circuit.qubits);
  const ordered = [...circuit.operations].sort((a, b) => a.timeStep - b.timeStep);
  for (const op of ordered) {
    applyOperation(state, op);
  }
  return { qubits: circuit.qubits, re: state.re, im: state.im };
}

/**
 * Run the circuit on an ideal statevector simulator and sample `shots` times.
 * Measurement ops determine which qubits are read out; if none are present,
 * all qubits are measured. Bitstrings follow Qiskit's convention: highest
 * qubit index first (leftmost).
 */
export function runSimulation(circuit: QuantumCircuit, shots = 1024): SimulationResult {
  const state = computeStatevector(circuit);
  const ordered = circuit.operations;

  const measureOps = ordered.filter((op) => op.gate === "measure");
  const measuredQubits = (measureOps.length > 0 ? measureOps.map((op) => op.targets[0]) : range(circuit.qubits)).sort(
    (a, b) => a - b
  );

  const probabilities: Record<string, number> = {};
  const size = state.re.length;
  for (let i = 0; i < size; i++) {
    const prob = state.re[i] * state.re[i] + state.im[i] * state.im[i];
    if (prob < 1e-12) continue;
    const bitstring = measuredQubits
      .slice()
      .reverse()
      .map((q) => ((i >> q) & 1))
      .join("");
    probabilities[bitstring] = (probabilities[bitstring] ?? 0) + prob;
  }

  const counts: Record<string, number> = {};
  for (const [bitstring, prob] of Object.entries(probabilities)) {
    counts[bitstring] = Math.round(prob * shots);
  }

  return { measuredQubits, shots, counts, probabilities };
}

function range(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i);
}
