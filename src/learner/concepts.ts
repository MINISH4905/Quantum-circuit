// Content for the Learner hub — a course-catalog-style page covering the
// core quantum computing concepts used throughout this app. Purely
// informational: it does not load circuits into the editor.

export interface LearnerConcept {
  id: string;
  title: string;
  tag: string;
  blurb: string;
  analogy: string;
  explanation: string;
}

export const LEARNER_CONCEPTS: LearnerConcept[] = [
  {
    id: "qubit",
    title: "Qubit",
    tag: "Fundamentals",
    blurb: "The basic unit of quantum information.",
    analogy: "Not just a coin — a coin that can be any mix of heads and tails until it's flipped.",
    explanation:
      "A qubit's state is a vector α|0⟩ + β|1⟩. Unlike a classical bit, which is only ever 0 or 1, a qubit can hold a weighted combination of both until it's measured.",
  },
  {
    id: "superposition",
    title: "Superposition",
    tag: "Fundamentals",
    blurb: "Being 0 and 1 at once.",
    analogy: "Like a spinning coin — neither heads nor tails until it lands.",
    explanation:
      "A quantum system can exist in a linear combination of basis states simultaneously. Only measurement forces it to settle on one definite outcome.",
  },
  {
    id: "hadamard-gate",
    title: "Hadamard Gate",
    tag: "Gates",
    blurb: "The gate that creates superposition.",
    analogy: "The flick that sets the coin spinning.",
    explanation:
      "H maps |0⟩ to (|0⟩+|1⟩)/√2 and |1⟩ to (|0⟩-|1⟩)/√2 — the standard way to put a qubit into an equal superposition.",
  },
  {
    id: "measurement",
    title: "Measurement",
    tag: "Fundamentals",
    blurb: "Collapsing possibility into fact.",
    analogy: "Opening the box — the coin lands on exactly one face.",
    explanation:
      "Measuring a qubit probabilistically collapses its superposition into one classical outcome, with probability given by the squared amplitude of that outcome.",
  },
  {
    id: "bloch-sphere",
    title: "Bloch Sphere",
    tag: "Visualization",
    blurb: "Picturing a qubit's state.",
    analogy: "A globe where the north and south poles are |0⟩ and |1⟩.",
    explanation:
      "Any single-qubit pure state maps to a point on a unit sphere. Gates rotate that point — which is exactly what the Bloch sphere panel shows live.",
  },
  {
    id: "entanglement",
    title: "Entanglement",
    tag: "Multi-qubit",
    blurb: "Qubits that share one fate.",
    analogy: "Two coins that always land the same way, no matter how far apart they are.",
    explanation:
      "Entangled qubits have a joint state that can't be split into independent single-qubit states — measuring one instantly determines the other's outcome.",
  },
  {
    id: "quantum-gates",
    title: "Quantum Gates",
    tag: "Gates",
    blurb: "Reversible building blocks.",
    analogy: "Each move in a puzzle that can always be undone.",
    explanation:
      "Gates like X, Y, Z, and the rotation gates are unitary — reversible — operations that rotate a qubit's state vector without collapsing it.",
  },
  {
    id: "interference",
    title: "Interference",
    tag: "Advanced",
    blurb: "Amplitudes adding up or cancelling out.",
    analogy: "Ripples on water — crests can reinforce or cancel each other.",
    explanation:
      "Quantum algorithms steer probability amplitudes so wrong answers interfere destructively while the right answer interferes constructively.",
  },
  {
    id: "quantum-circuits",
    title: "Quantum Circuits",
    tag: "Fundamentals",
    blurb: "Programs made of gates.",
    analogy: "A sheet of music — each line is a qubit, each symbol a gate played in time.",
    explanation:
      "A circuit is an ordered sequence of gates applied to qubits, ending in measurement — exactly what the circuit editor lets you build and simulate.",
  },
  {
    id: "quantum-algorithms",
    title: "Quantum Algorithms",
    tag: "Advanced",
    blurb: "Real speedups over classical computing.",
    analogy: "A shortcut only visible if you can walk every path at once.",
    explanation:
      "Deutsch–Jozsa and Grover's Search — both one-click loadable from Folders — show how superposition and interference solve problems in fewer steps than any classical approach.",
  },
];
