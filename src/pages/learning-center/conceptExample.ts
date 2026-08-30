import type { QuantumCircuit, QuantumOperation } from "../../circuit/model/types";
import {
  buildSuperpositionCircuit,
  buildBellStateCircuit,
  buildBareQubitCircuit,
  buildControlledGateCircuit,
  buildSwapCircuit,
} from "../../learner/example-circuits";
import { buildDeutschJozsaCircuit, buildGroverCircuit } from "../../circuit/examples/worked-examples";
import type { LearningConcept } from "./types";

/** A hands-on task tied to a ConceptExample's demo circuit. checkSuccess is
 * verified against real simulator output (not guessed) — see the exact
 * probabilities each builder produces, checked directly against
 * runSimulation() before these thresholds were written. */
export interface HandsOnTask {
  goal: string;
  steps: string[];
  hints: string[];
  challenge: string;
  successMessage: string;
  checkSuccess: (probabilities: Record<string, number>) => boolean;
  /** Inspects the actual circuit (not just the probabilities) to name the
   * specific mistake — "you used X instead of H" rather than a generic
   * "not quite yet". Returns null when nothing specific can be said, in
   * which case the caller falls back to a generic message. Optional:
   * Grover/Deutsch–Jozsa's oracle+diffuser structure isn't reduced to a
   * single-gate diagnosis, so they rely on the generic fallback instead of
   * a forced, low-value check. */
  diagnose?: (circuit: QuantumCircuit) => string | null;
}

export interface ConceptExample {
  label: string;
  build: () => QuantumCircuit;
  showBloch?: boolean;
  showQSphere?: boolean;
  showProbability?: boolean;
  task: HandsOnTask;
}

interface Rule {
  test: RegExp;
  example: ConceptExample;
}

const p = (probabilities: Record<string, number>, key: string) => probabilities[key] ?? 0;

const GATE_LABEL: Record<string, string> = {
  h: "H", x: "X", y: "Y", z: "Z", s: "S", t: "T",
  rx: "RX", ry: "RY", rz: "RZ", cx: "CNOT", cz: "CZ", swap: "SWAP",
};
const gateLabel = (id: string) => GATE_LABEL[id] ?? id.toUpperCase();

function nonMeasureOps(circuit: QuantumCircuit): QuantumOperation[] {
  return circuit.operations.filter((op) => op.gate !== "measure");
}
function hasGate(circuit: QuantumCircuit, gateId: string, qubit?: number): boolean {
  return circuit.operations.some((op) => op.gate === gateId && (qubit === undefined || op.targets.includes(qubit)));
}
function describeGates(circuit: QuantumCircuit): string {
  const ops = nonMeasureOps(circuit);
  if (ops.length === 0) return "no gates";
  return ops.map((op) => gateLabel(op.gate)).join(", ");
}

// Reuses the same demo-circuit builders as the (curated) Learner page and
// the dashboard's worked examples — no new circuits are built here, only a
// mapping from a fetched concept's title to one of them. Matched against the
// concept's own title only (data-driven, not a per-concept hardcoded list),
// so it keeps working as the fetched content set grows. Deliberately does
// NOT scan the body text: an early attempt matching phrases like "bell
// state" or "cnot gate" anywhere in the (long) content produced false
// positives on unrelated concepts that merely mention the term in passing
// (e.g. Shor's algorithm's page mentions superposition, VQE's mentions
// CNOT) — better to under-match than attach a misleading example.
const TITLE_RULES: Rule[] = [
  {
    test: /grover/i,
    example: {
      label: "Grover's Search",
      build: buildGroverCircuit,
      showProbability: true,
      showQSphere: true,
      task: {
        goal: "Confirm Grover's algorithm amplifies the marked state's probability.",
        steps: [
          "Open the Interactive Circuit section and load the example.",
          "Run the local simulator (click ↻ in the Probability panel if it doesn't auto-run).",
          "Check which outcome dominates the Probability panel.",
        ],
        hints: [
          "Grover's algorithm rotates the state vector toward the marked answer with each iteration.",
          "This circuit's oracle marks |11⟩ and runs exactly one iteration.",
          "One iteration is optimal for 2 qubits — look for an outcome close to 100%, not spread evenly.",
        ],
        challenge: "Try changing the oracle to mark |01⟩ instead (swap which qubit the CZ targets) and predict which bar will dominate before running it.",
        successMessage: "|11⟩ was amplified to (near) certainty — that's Grover's algorithm working.",
        checkSuccess: (probs) => p(probs, "11") > 0.85,
      },
    },
  },
  {
    test: /deutsch|jozsa/i,
    example: {
      label: "Deutsch–Jozsa",
      build: buildDeutschJozsaCircuit,
      showProbability: true,
      task: {
        goal: "Use the Deutsch–Jozsa circuit to identify a balanced function in a single query.",
        steps: [
          "Open the Interactive Circuit section and load the example.",
          "Run the local simulator.",
          "Check whether the input qubits measure as 00 (constant) or anything else (balanced).",
        ],
        hints: [
          "A classical algorithm would need to query the function twice in the worst case to be sure.",
          "This oracle implements f(x0,x1) = x0 XOR x1, which is balanced.",
          "If the result is 00, the function is constant; anything else means balanced.",
        ],
        challenge: "Change the oracle to a constant function (remove both CX gates) and confirm the input qubits now measure 00.",
        successMessage: "The input qubits didn't measure 00 — correctly identifying the oracle as balanced, in a single query.",
        checkSuccess: (probs) => p(probs, "00") < 0.15,
      },
    },
  },
  {
    test: /bell state|entangl/i,
    example: {
      label: "Bell State",
      build: buildBellStateCircuit,
      showProbability: true,
      showQSphere: true,
      task: {
        goal: "Create an entangled Bell pair and confirm the two qubits are perfectly correlated.",
        steps: [
          "Open the Interactive Circuit section and load the example (H on q0, then CX).",
          "Run the local simulator.",
          "Check that only 00 and 11 appear in the Probability panel — never 01 or 10.",
        ],
        hints: [
          "Hadamard puts q0 into superposition first, so the outcome isn't fixed in advance.",
          "The CX gate then entangles q1 with q0 — they'll always match when measured.",
          "You should see roughly a 50/50 split between exactly 00 and 11.",
        ],
        challenge: "Add an X gate on q1 before the CX and predict how the correlation changes (hint: it will still correlate, just to the opposite pair of outcomes).",
        successMessage: "Only 00 and 11 appeared — the qubits are entangled, not just independently random.",
        checkSuccess: (probs) => p(probs, "00") > 0.3 && p(probs, "11") > 0.3 && p(probs, "01") < 0.15 && p(probs, "10") < 0.15,
        diagnose: (circuit) => {
          if (!hasGate(circuit, "h")) return `Your circuit currently applies ${describeGates(circuit)} — add an H gate on q0 first to create superposition before entangling.`;
          if (!hasGate(circuit, "cx") && !hasGate(circuit, "cz")) return "You have superposition on q0, but no CNOT (controlled-X) yet — add one to entangle q0 and q1.";
          return null;
        },
      },
    },
  },
  {
    test: /cnot|controlled.?not/i,
    example: {
      label: "CNOT",
      build: () => buildControlledGateCircuit("cx"),
      showProbability: true,
      task: {
        goal: "Use a CNOT (CX) gate to entangle two qubits and see the correlation it creates.",
        steps: [
          "Open the Interactive Circuit section and load the example.",
          "Run the local simulator.",
          "Check that the two qubits always measure the same as each other.",
        ],
        hints: [
          "A CNOT flips its target qubit only when the control qubit is |1⟩.",
          "Because the control (q0) is in superposition here, the flip itself becomes probabilistic — but always consistent with q0's outcome.",
          "You should only ever see 00 or 11, never a mismatch.",
        ],
        challenge: "Remove the Hadamard so q0 starts as a definite |0⟩ — confirm the CNOT then has no effect and q1 stays |0⟩ every time.",
        successMessage: "The two qubits always matched — exactly what a CNOT-created correlation looks like.",
        checkSuccess: (probs) => p(probs, "00") > 0.3 && p(probs, "11") > 0.3 && p(probs, "01") < 0.15 && p(probs, "10") < 0.15,
        diagnose: (circuit) => {
          if (!hasGate(circuit, "cx") && !hasGate(circuit, "cz")) return `Your circuit applies ${describeGates(circuit)} — it needs a CNOT (CX) gate connecting q0 to q1.`;
          if (!hasGate(circuit, "h")) return "The CNOT is there, but q0 isn't in superposition yet — add an H gate on q0 first.";
          return null;
        },
      },
    },
  },
  {
    test: /swap/i,
    example: {
      label: "SWAP",
      build: buildSwapCircuit,
      showProbability: true,
      task: {
        goal: "Use a SWAP gate to move q0's state onto q1.",
        steps: [
          "Open the Interactive Circuit section and load the example (X on q0, then SWAP).",
          "Run the local simulator.",
          "Check which qubit ends up in state |1⟩.",
        ],
        hints: [
          "The X gate first flips q0 from |0⟩ to |1⟩.",
          "SWAP then exchanges the two qubits' states completely.",
          "After the swap, q0 should be back to |0⟩ and q1 should hold the |1⟩.",
        ],
        challenge: "Add a second SWAP right after the first and predict the final state before running it (it should undo the first swap).",
        successMessage: "The |1⟩ moved from q0 to q1 — the SWAP gate worked as expected.",
        checkSuccess: (probs) => p(probs, "10") > 0.85 || p(probs, "01") > 0.85,
        diagnose: (circuit) => {
          if (!hasGate(circuit, "swap")) return `Your circuit applies ${describeGates(circuit)} — it needs a SWAP gate between q0 and q1.`;
          if (!hasGate(circuit, "x")) return "The SWAP is there, but nothing's been flipped to |1⟩ yet — add an X gate on q0 before the SWAP.";
          return null;
        },
      },
    },
  },
  {
    test: /superposition|hadamard/i,
    example: {
      label: "Superposition",
      build: buildSuperpositionCircuit,
      showBloch: true,
      showProbability: true,
      task: {
        goal: "Put a qubit into an equal superposition using a Hadamard gate.",
        steps: [
          "Open the Interactive Circuit section — it starts with H on q0, then measure.",
          "Run the local simulator.",
          "Check the Probability panel for the split between 0 and 1.",
        ],
        hints: [
          "Think about what happens to |0⟩ when an H gate is applied.",
          "The Hadamard gate produces (|0⟩+|1⟩)/√2 — an equal mix, not a fixed value.",
          "Expect roughly P(0) ≈ 50% and P(1) ≈ 50%.",
        ],
        challenge: "Remove the H gate, run again, and compare — then add a second H gate after the first and predict the result (it should undo the superposition).",
        successMessage: "P(0) ≈ 50% and P(1) ≈ 50% — that's an equal superposition.",
        checkSuccess: (probs) => p(probs, "0") > 0.35 && p(probs, "0") < 0.65 && p(probs, "1") > 0.35 && p(probs, "1") < 0.65,
        diagnose: (circuit) => {
          const ops = nonMeasureOps(circuit);
          if (ops.length === 0) return "Your circuit doesn't have any gates yet — try adding an H gate to q0.";
          if (!hasGate(circuit, "h")) return `Your circuit currently applies ${describeGates(circuit)} instead of H. Try replacing it with an H gate to create a superposition.`;
          const hCount = circuit.operations.filter((op) => op.gate === "h" && op.targets.includes(0)).length;
          if (hCount % 2 === 0) return "You have an even number of H gates on q0 — each pair cancels out. Try leaving just one.";
          return null;
        },
      },
    },
  },
  {
    test: /^single systems?$|^qubits?$/i,
    example: {
      label: "Qubit",
      build: buildBareQubitCircuit,
      showBloch: true,
      task: {
        goal: "Initialize and measure a single qubit.",
        steps: [
          "Open the Interactive Circuit section — a single qubit, no gates, just measure.",
          "Run the local simulator.",
          "Check the Probability panel — with no gates applied, the outcome should be certain.",
        ],
        hints: [
          "Every qubit starts in the |0⟩ state unless a gate changes it.",
          "With no gates in the circuit, there's nothing to introduce uncertainty.",
          "Expect P(0) = 100%.",
        ],
        challenge: "Add a single X gate before the measurement and predict the new outcome before running it.",
        successMessage: "P(0) = 100% — an unmodified qubit measures deterministically.",
        checkSuccess: (probs) => p(probs, "0") > 0.9,
        diagnose: (circuit) => {
          const ops = nonMeasureOps(circuit);
          if (ops.length > 0) return `Your circuit applies ${describeGates(circuit)} — remove it so the qubit stays in its initial |0⟩ state.`;
          return null;
        },
      },
    },
  },
];

export function getConceptExample(concept: LearningConcept): ConceptExample | null {
  for (const rule of TITLE_RULES) {
    if (rule.test.test(concept.title)) return rule.example;
  }
  return null;
}
