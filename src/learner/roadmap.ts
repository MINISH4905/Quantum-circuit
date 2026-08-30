// The Learner roadmap's content-mapping layer. Curriculum is organized the
// way Qiskit's own learning repository is (Qiskit/documentation, `learning/`
// — basics-of-quantum-information, fundamentals-of-quantum-algorithms,
// use-a-qc-today, and topical modules), transformed into a progressive,
// prerequisite-linked journey. Every topic's description/whyItMatters below
// is grounded in that repository's actual lesson notebooks (paraphrased and
// condensed to fit a roadmap card, not copied verbatim) rather than
// independently authored — githubSource records exactly which lesson each
// topic draws from.

import type { QuantumCircuit } from "../circuit/model/types";
import {
  buildBareQubitCircuit,
  buildBellStateCircuit,
  buildBitFlipCircuit,
  buildControlledGateCircuit,
  buildSingleGateCircuit,
  buildSuperpositionCircuit,
} from "./example-circuits";
import { buildDeutschJozsaCircuit, buildGroverCircuit } from "../circuit/examples/worked-examples";

export type TopicDifficulty = "beginner" | "intermediate" | "advanced";

export interface GithubSource {
  label: string;
  url: string;
  /** Matches the backend's /api/learning/collections/{collectionId} — lets
   * the UI fetch the real, live-served lesson content for this topic. */
  collectionId: string;
}

export interface RoadmapTopic {
  id: string;
  title: string;
  sectionId: string;
  description: string;
  whyItMatters: string;
  difficulty: TopicDifficulty;
  prerequisites: string[];
  githubSource?: GithubSource;
  exampleCircuit?: () => QuantumCircuit;
  showProbability?: boolean;
  showBloch?: boolean;
  showQSphere?: boolean;
}

export interface RoadmapSection {
  id: string;
  title: string;
  description: string;
  topics: RoadmapTopic[];
}

const REPO = "https://github.com/Qiskit/documentation/blob/main/learning/courses";
const src = (label: string, path: string): GithubSource => ({
  label,
  url: `${REPO}/${path}`,
  collectionId: `courses/${path.split("/")[0]}`,
});

export const ROADMAP: RoadmapSection[] = [
  {
    id: "foundations",
    title: "01 — Foundations",
    description: "Qubits, superposition, measurement, and probability — the mathematical basics everything else builds on.",
    topics: [
      {
        id: "classical-computing-basics",
        title: "Classical Computing Basics",
        sectionId: "foundations",
        difficulty: "beginner",
        prerequisites: [],
        githubSource: src("Use a QC Today · Quantum computing context", "use-a-qc-today/quantum-computing-context.ipynb"),
        description:
          "Classical bits are always definitely 0 or 1, and classical circuits chain logic gates like AND, OR, and NOT to compute with them — the acyclic \"wires and gates\" model that quantum circuits also follow.",
        whyItMatters:
          "Quantum computing isn't a way to \"check every answer at once,\" and it won't replace classical computers — it's a fundamentally different resource that's powerful only for specific problems, which is exactly why the classical baseline matters first.",
      },
      {
        id: "qubits",
        title: "Qubits",
        sectionId: "foundations",
        difficulty: "beginner",
        prerequisites: ["classical-computing-basics"],
        githubSource: src("Basics of Quantum Information · Single systems", "basics-of-quantum-information/single-systems/introduction.ipynb"),
        description:
          "A qubit is a quantum system whose classical state set is {0,1} — literally a bit, but one that can be placed in a quantum state: a column vector with complex-number entries whose absolute values squared sum to 1.",
        whyItMatters:
          "Every other topic in this roadmap — gates, circuits, algorithms — is really about what can be done with a vector like this that has no classical bit equivalent.",
        exampleCircuit: buildBareQubitCircuit,
        showBloch: true,
      },
      {
        id: "quantum-states",
        title: "Quantum States",
        sectionId: "foundations",
        difficulty: "beginner",
        prerequisites: ["qubits"],
        githubSource: src("Basics of Quantum Information · Quantum information", "basics-of-quantum-information/single-systems/quantum-information.ipynb"),
        description:
          "A quantum state is written in Dirac (bra-ket) notation, like |0⟩ or |ψ⟩ = α|0⟩ + β|1⟩. Vectors of standard basis states like this are unit vectors — their Euclidean norm is always exactly 1.",
        whyItMatters: "This vector, not a single 0 or 1, is what every gate in a circuit actually operates on.",
        exampleCircuit: buildBareQubitCircuit,
        showBloch: true,
      },
      {
        id: "superposition",
        title: "Superposition",
        sectionId: "foundations",
        difficulty: "beginner",
        prerequisites: ["quantum-states"],
        githubSource: src("Basics of Quantum Information · Quantum information", "basics-of-quantum-information/single-systems/quantum-information.ipynb"),
        description:
          "A superposition is any linear combination of basis states — \"superposition\" and \"linear combination\" mean the same thing for quantum states. The Hadamard gate produces the standard example: |+⟩ = (|0⟩+|1⟩)/√2.",
        whyItMatters:
          "Measuring |+⟩ and the \"minus state\" |−⟩ gives identical 50/50 outcomes, yet applying a Hadamard first reveals they're different states with certainty — proof that a qubit carries more information than any single measurement can show.",
        exampleCircuit: buildSuperpositionCircuit,
        showBloch: true,
        showQSphere: true,
        showProbability: true,
      },
      {
        id: "measurement",
        title: "Measurement",
        sectionId: "foundations",
        difficulty: "beginner",
        prerequisites: ["superposition"],
        githubSource: src("Basics of Quantum Information · Quantum information", "basics-of-quantum-information/single-systems/quantum-information.ipynb"),
        description:
          "The Born rule governs measurement: each classical outcome appears with probability equal to the absolute value squared of its amplitude, and afterward the state collapses to match whatever outcome occurred.",
        whyItMatters:
          "|+⟩ and |−⟩ measure identically despite being different states — a reminder that one measurement only ever reveals a single probabilistic sample, never the full state vector.",
        exampleCircuit: buildSuperpositionCircuit,
        showProbability: true,
      },
      {
        id: "probability",
        title: "Probability",
        sectionId: "foundations",
        difficulty: "beginner",
        prerequisites: ["measurement"],
        githubSource: src("Basics of Quantum Information · Quantum information", "basics-of-quantum-information/single-systems/quantum-information.ipynb"),
        description:
          "Because a state vector's absolute values squared must sum to 1, so do the probabilities of every measurement outcome — the same normalization that produces a valid histogram, never over 100%.",
        whyItMatters:
          "P = |amplitude|² is the entire bridge between the abstract state vector and the concrete percentages this app's Probabilities panel plots after every run.",
        exampleCircuit: buildSuperpositionCircuit,
        showProbability: true,
      },
    ],
  },
  {
    id: "gates",
    title: "02 — Quantum Gates",
    description: "The unitary building blocks — Pauli, Hadamard, phase, rotation, and controlled gates — that make up every circuit.",
    topics: [
      {
        id: "quantum-gates-intro",
        title: "Quantum Gates",
        sectionId: "gates",
        difficulty: "beginner",
        prerequisites: ["probability"],
        githubSource: src("Basics of Quantum Information · Quantum information", "basics-of-quantum-information/single-systems/quantum-information.ipynb"),
        description:
          "Gates are unitary matrices U (satisfying U†U = I) applied to a state vector — and multiplying by a unitary matrix always returns another valid, unit-length quantum state.",
        whyItMatters:
          "Unitary means reversible: every gate has an exact inverse, which is why a quantum circuit — aside from measurement — can always, in principle, be run backward.",
      },
      {
        id: "x-gate",
        title: "X Gate",
        sectionId: "gates",
        difficulty: "beginner",
        prerequisites: ["quantum-gates-intro"],
        githubSource: src("Basics of Quantum Information · Quantum information", "basics-of-quantum-information/single-systems/quantum-information.ipynb"),
        description: "Pauli-X is the bit-flip (NOT) gate: X|0⟩ = |1⟩ and X|1⟩ = |0⟩ — a 180° rotation on the Bloch sphere.",
        whyItMatters: "It's the simplest gate for building intuition for how any gate rotates a state vector rather than just toggling a bit.",
        exampleCircuit: buildBitFlipCircuit,
        showBloch: true,
      },
      {
        id: "y-z-gates",
        title: "Y and Z Gates",
        sectionId: "gates",
        difficulty: "beginner",
        prerequisites: ["x-gate"],
        githubSource: src("Basics of Quantum Information · Quantum information", "basics-of-quantum-information/single-systems/quantum-information.ipynb"),
        description:
          "Pauli-Z is the phase-flip gate — it leaves |0⟩ unchanged but sends |1⟩ to −|1⟩, changing the state without changing measurement probabilities. Pauli-Y combines a bit-flip and a phase-flip together.",
        whyItMatters:
          "X, Y, and Z (plus the identity) are the four Pauli matrices — the exact basis this roadmap's error-correction section uses to describe every possible single-qubit error.",
        exampleCircuit: () => buildSingleGateCircuit("z"),
        showBloch: true,
      },
      {
        id: "h-gate",
        title: "H Gate",
        sectionId: "gates",
        difficulty: "beginner",
        prerequisites: ["quantum-gates-intro"],
        githubSource: src("Basics of Quantum Information · Quantum information", "basics-of-quantum-information/single-systems/quantum-information.ipynb"),
        description:
          "The Hadamard gate maps H|0⟩ = |+⟩ and H|1⟩ = |−⟩, and applying it twice returns the original state — H is its own inverse.",
        whyItMatters:
          "H turns an invisible phase difference into a readable one: |+⟩ and |−⟩ measure identically on their own, but applying H first lets you tell them apart with certainty.",
        exampleCircuit: buildSuperpositionCircuit,
        showBloch: true,
        showQSphere: true,
      },
      {
        id: "s-t-gates",
        title: "S and T Gates",
        sectionId: "gates",
        difficulty: "intermediate",
        prerequisites: ["h-gate"],
        githubSource: src("Basics of Quantum Information · Quantum information", "basics-of-quantum-information/single-systems/quantum-information.ipynb"),
        description:
          "S and T are phase gates: S = P(π/2) applies a 90° phase rotation and T = P(π/4) a 45° rotation, both leaving measurement probabilities in the standard basis unchanged.",
        whyItMatters: "H, S, and T together with CNOT form a standard \"universal\" gate set — circuits built only from these four gates can approximate any quantum computation.",
        exampleCircuit: () => buildSingleGateCircuit("s"),
        showBloch: true,
      },
      {
        id: "rotation-gates",
        title: "Rotation Gates",
        sectionId: "gates",
        difficulty: "intermediate",
        prerequisites: ["s-t-gates"],
        githubSource: src("Basics of Quantum Information · Quantum information", "basics-of-quantum-information/single-systems/quantum-information.ipynb"),
        description:
          "The phase gate family Pθ generalizes S and T to any angle θ (S = P(π/2), T = P(π/4)); RX, RY, and RZ do the same for the Pauli gates, rotating by an arbitrary angle around each axis.",
        whyItMatters: "Variational algorithms later in this roadmap (VQE, QAOA) are built almost entirely from tunable rotation gates like these.",
        exampleCircuit: () => buildSingleGateCircuit("rx", [Math.PI / 2]),
        showBloch: true,
      },
      {
        id: "controlled-gates",
        title: "Controlled Gates",
        sectionId: "gates",
        difficulty: "intermediate",
        prerequisites: ["rotation-gates", "quantum-states"],
        githubSource: src("Basics of Quantum Information · Circuits", "basics-of-quantum-information/quantum-circuits/circuits.ipynb"),
        description:
          "A controlled-NOT gate flips its target qubit only when its control qubit is |1⟩ — drawn as a solid dot (control) connected to a ⊕ symbol (target) by a vertical line.",
        whyItMatters:
          "Running CX on a qubit already in superposition (H then CX) is exactly how this roadmap's entangled two-qubit states — including the Bell states ahead — get built.",
        exampleCircuit: () => buildControlledGateCircuit("cx"),
        showProbability: true,
      },
    ],
  },
  {
    id: "circuits",
    title: "03 — Quantum Circuits",
    description: "How gates combine into a runnable circuit, and how Qiskit represents that circuit in code.",
    topics: [
      {
        id: "circuit-construction",
        title: "Circuit Construction",
        sectionId: "circuits",
        difficulty: "beginner",
        prerequisites: ["controlled-gates"],
        githubSource: src("Basics of Quantum Information · Circuits", "basics-of-quantum-information/quantum-circuits/circuits.ipynb"),
        description:
          "A quantum circuit is a finite, acyclic sequence of gates on qubit wires, read left to right — the same wires-and-gates model as a classical Boolean circuit, but with unitary gates instead of logic gates.",
        whyItMatters: "This is exactly the model the Circuit Editor uses: qubit wires, time steps, and gates you drag onto them.",
        exampleCircuit: buildSuperpositionCircuit,
        showProbability: true,
      },
      {
        id: "circuit-execution",
        title: "Circuit Execution",
        sectionId: "circuits",
        difficulty: "beginner",
        prerequisites: ["circuit-construction"],
        githubSource: src("Use a QC Today · Your first quantum experiment", "use-a-qc-today/your-first-quantum-experiment.ipynb"),
        description:
          "Qiskit's standard workflow runs a circuit in four steps: map the problem onto qubits and gates, optimize (transpile) the circuit for a specific backend, execute it, then post-process the results.",
        whyItMatters: "The editor's Local/Qiskit Aer toggle is a hands-on version of exactly the optimize-and-execute steps of that same pattern.",
        exampleCircuit: buildSuperpositionCircuit,
        showProbability: true,
      },
      {
        id: "circuit-measurement",
        title: "Circuit Measurement",
        sectionId: "circuits",
        difficulty: "beginner",
        prerequisites: ["circuit-execution"],
        githubSource: src("Basics of Quantum Information · Circuits", "basics-of-quantum-information/quantum-circuits/circuits.ipynb"),
        description:
          "A measurement gate converts a qubit into its post-measurement classical value and overwrites that value onto a classical bit, drawn as a double wire in circuit diagrams.",
        whyItMatters: "Every worked example in this app ends with explicit measurement gates for exactly this reason.",
        exampleCircuit: buildBellStateCircuit,
        showProbability: true,
      },
      {
        id: "circuit-visualization",
        title: "Circuit Visualization",
        sectionId: "circuits",
        difficulty: "beginner",
        prerequisites: ["circuit-measurement"],
        githubSource: src("Basics of Quantum Information · Circuits", "basics-of-quantum-information/quantum-circuits/circuits.ipynb"),
        description:
          "The same circuit can be read as a gate diagram, a probability histogram, a Bloch sphere per qubit, or a Q-sphere for the whole system's state.",
        whyItMatters: "Switching between these views is often the fastest way to build intuition for what a circuit actually does.",
        exampleCircuit: buildBellStateCircuit,
        showProbability: true,
        showBloch: true,
        showQSphere: true,
      },
      {
        id: "qiskit-programming",
        title: "Qiskit Programming",
        sectionId: "circuits",
        difficulty: "intermediate",
        prerequisites: ["circuit-visualization"],
        githubSource: src("Use a QC Today · Build and run your first quantum program", "use-a-qc-today/build-and-run-your-first-quantum-program.ipynb"),
        description:
          "Qiskit's QuantumCircuit class defines a circuit's qubits and the operations applied to them — the same representation, gate for gate, as the visual editor.",
        whyItMatters: "The Qiskit Code panel keeps the generated Python in sync with the visual editor in real time, in both directions.",
        exampleCircuit: buildBellStateCircuit,
      },
    ],
  },
  {
    id: "quantum-information",
    title: "04 — Quantum Information",
    description: "Entanglement, Bell states, and teleportation — what makes multi-qubit systems fundamentally non-classical.",
    topics: [
      {
        id: "bloch-sphere",
        title: "Bloch Sphere",
        sectionId: "quantum-information",
        difficulty: "beginner",
        prerequisites: ["quantum-states"],
        githubSource: src("Basics of Quantum Information · Quantum information", "basics-of-quantum-information/single-systems/quantum-information.ipynb"),
        description:
          "Every single-qubit quantum state is a unit vector — which is exactly why it maps to a single point on a sphere of radius 1, with |0⟩ and |1⟩ at the poles.",
        whyItMatters: "This is exactly what the Bloch Sphere panel shows live as you add gates to a circuit — each gate visibly rotates that point.",
        exampleCircuit: () => buildSingleGateCircuit("rx", [Math.PI / 3]),
        showBloch: true,
      },
      {
        id: "pure-vs-mixed-states",
        title: "Pure vs Mixed States",
        sectionId: "quantum-information",
        difficulty: "intermediate",
        prerequisites: ["bloch-sphere"],
        githubSource: src("Basics of Quantum Information · Multiple systems", "basics-of-quantum-information/multiple-systems/quantum-information.ipynb"),
        description:
          "A qubit that's part of a larger entangled system doesn't have its own quantum state vector — its \"reduced\" state can only be described using a density matrix, a tool that generalizes state vectors to mixed states.",
        whyItMatters: "This is exactly why partial measurement of an entangled pair is subtle: the untouched qubit has no state vector of its own until you use the mixed-state formalism.",
      },
      {
        id: "entanglement",
        title: "Entanglement",
        sectionId: "quantum-information",
        difficulty: "intermediate",
        prerequisites: ["controlled-gates", "bloch-sphere"],
        githubSource: src("Basics of Quantum Information · Multiple systems", "basics-of-quantum-information/multiple-systems/quantum-information.ipynb"),
        description:
          "A state like (|00⟩+|11⟩)/√2 can't be written as a tensor product of two individual qubit states — that impossibility is the precise mathematical definition of entanglement.",
        whyItMatters:
          "Quantum information theory treats one Bell pair as a single unit of entanglement, an \"e-bit\" — a resource that teleportation and superdense coding both spend to do things impossible with classical correlation alone.",
        exampleCircuit: buildBellStateCircuit,
        showProbability: true,
      },
      {
        id: "bell-states",
        title: "Bell States",
        sectionId: "quantum-information",
        difficulty: "intermediate",
        prerequisites: ["entanglement"],
        githubSource: src("Basics of Quantum Information · Multiple systems", "basics-of-quantum-information/multiple-systems/quantum-information.ipynb"),
        description:
          "The four Bell states |φ+⟩, |φ−⟩, |ψ+⟩, |ψ−⟩ are the maximally entangled two-qubit states, and together they form a basis: any two-qubit state can be written as a combination of them.",
        whyItMatters:
          "The H-then-CNOT circuit used throughout this app converts the standard basis into the Bell basis one state at a time — |00⟩ becomes |φ+⟩, |01⟩ becomes |φ−⟩, and so on.",
        exampleCircuit: buildBellStateCircuit,
        showProbability: true,
        showBloch: true,
        showQSphere: true,
      },
      {
        id: "quantum-teleportation",
        title: "Quantum Teleportation",
        sectionId: "quantum-information",
        difficulty: "advanced",
        prerequisites: ["bell-states"],
        githubSource: src("Basics of Quantum Information · Quantum teleportation", "basics-of-quantum-information/entanglement-in-action/quantum-teleportation.ipynb"),
        description:
          "Teleportation lets Alice send an unknown qubit's exact state to Bob using one shared e-bit plus two bits of classical communication — what moves is the quantum information, not any physical particle.",
        whyItMatters: "The no-cloning theorem proves classical communication alone can never transmit a qubit's state — teleportation is the proof that entanglement plus classical communication together can.",
      },
      {
        id: "quantum-measurement-revisited",
        title: "Quantum Measurement (Multi-Qubit)",
        sectionId: "quantum-information",
        difficulty: "intermediate",
        prerequisites: ["bell-states"],
        githubSource: src("Basics of Quantum Information · Multiple systems", "basics-of-quantum-information/multiple-systems/quantum-information.ipynb"),
        description:
          "Measuring only one qubit of an entangled pair collapses just enough of the joint state to stay consistent with that outcome — the untouched qubit's state changes too, instantly.",
        whyItMatters:
          "The probability of your own local measurement outcome never depends on whether the distant qubit was also measured — correlation, not faster-than-light signaling, is what entanglement actually gives you.",
      },
    ],
  },
  {
    id: "algorithms",
    title: "05 — Quantum Algorithms",
    description: "Deutsch–Jozsa, Grover, and Shor — where quantum computers provably outperform classical ones.",
    topics: [
      {
        id: "interference",
        title: "Interference",
        sectionId: "algorithms",
        difficulty: "intermediate",
        prerequisites: ["bell-states"],
        githubSource: src("Fundamentals of Quantum Algorithms · Query algorithms", "fundamentals-of-quantum-algorithms/quantum-query-algorithms/deutsch-jozsa-algorithm.ipynb"),
        description:
          "Sandwiching a function's phase kickback between two layers of Hadamard gates causes wrong-answer amplitudes to cancel and the right-answer amplitude to reinforce — quantum interference, engineered on purpose.",
        whyItMatters: "This exact double-Hadamard interference pattern is what the Deutsch–Jozsa algorithm's proof relies on, and it reappears across many other quantum algorithms.",
      },
      {
        id: "deutsch-jozsa",
        title: "Deutsch–Jozsa",
        sectionId: "algorithms",
        difficulty: "advanced",
        prerequisites: ["interference", "controlled-gates"],
        githubSource: src("Fundamentals of Quantum Algorithms · Deutsch–Jozsa algorithm", "fundamentals-of-quantum-algorithms/quantum-query-algorithms/deutsch-jozsa-algorithm.ipynb"),
        description:
          "Given a function promised to be either constant or balanced, one query — and two layers of Hadamard gates around the function's phase kickback — determines which with certainty: all-zeros measures with probability exactly 1 if constant, exactly 0 if balanced.",
        whyItMatters:
          "Any deterministic classical algorithm needs up to 2ⁿ⁻¹+1 queries in the worst case; the Deutsch–Jozsa algorithm needs exactly one, no matter how large n gets.",
        exampleCircuit: buildDeutschJozsaCircuit,
        showProbability: true,
      },
      {
        id: "grovers-algorithm",
        title: "Grover's Algorithm",
        sectionId: "algorithms",
        difficulty: "advanced",
        prerequisites: ["deutsch-jozsa"],
        githubSource: src("Fundamentals of Quantum Algorithms · Grover's algorithm", "fundamentals-of-quantum-algorithms/grover-algorithm/grover-algorithm-description.ipynb"),
        description:
          "Grover's algorithm repeats a \"Grover operation\" — built from a phase-flip-the-answer gate and a phase-flip-about-the-mean gate — roughly √N times to search an unstructured list of N items, then measures.",
        whyItMatters:
          "It's a proven quadratic (not exponential) speedup over any classical unstructured-search algorithm, and the same \"mark, then amplify\" pattern reappears across many other quantum algorithms.",
        exampleCircuit: buildGroverCircuit,
        showProbability: true,
      },
      {
        id: "quantum-fourier-transform",
        title: "Quantum Fourier Transform",
        sectionId: "algorithms",
        difficulty: "advanced",
        prerequisites: ["grovers-algorithm"],
        githubSource: src("Fundamentals of Quantum Algorithms · Phase estimation and factoring", "fundamentals-of-quantum-algorithms/phase-estimation-and-factoring/introduction.ipynb"),
        description:
          "The quantum Fourier transform is the unitary that turns a periodic phase pattern encoded across several qubits into a value that can actually be read out by measurement.",
        whyItMatters: "The QFT is the core subroutine used inside phase estimation and, from there, Shor's factoring algorithm.",
      },
      {
        id: "phase-estimation",
        title: "Phase Estimation",
        sectionId: "algorithms",
        difficulty: "advanced",
        prerequisites: ["quantum-fourier-transform"],
        githubSource: src("Fundamentals of Quantum Algorithms · Phase estimation and factoring", "fundamentals-of-quantum-algorithms/phase-estimation-and-factoring/introduction.ipynb"),
        description:
          "Phase estimation extracts the eigenvalue phase of a unitary operator, given one of its eigenvectors, using controlled applications of that unitary followed by an inverse quantum Fourier transform.",
        whyItMatters: "It's the workhorse subroutine behind Shor's algorithm — reframed there as solving the \"order-finding\" problem.",
      },
      {
        id: "shors-algorithm",
        title: "Shor's Algorithm",
        sectionId: "algorithms",
        difficulty: "advanced",
        prerequisites: ["phase-estimation"],
        githubSource: src("Fundamentals of Quantum Algorithms · Shor's algorithm", "fundamentals-of-quantum-algorithms/phase-estimation-and-factoring/shor-algorithm.ipynb"),
        description:
          "Shor's algorithm factors integers by first reducing the problem — entirely classically — to order-finding (the smallest r with aʳ ≡ 1 mod N), then solving order-finding efficiently with phase estimation.",
        whyItMatters: "Only the order-finding step needs a quantum computer; it's the piece that makes Shor's algorithm the one most responsible for quantum computing's cryptographic significance.",
      },
    ],
  },
  {
    id: "practical",
    title: "06 — Practical Quantum Computing",
    description: "Running real circuits with Qiskit — simulators, backends, and reading the results.",
    topics: [
      {
        id: "qiskit-overview",
        title: "Qiskit",
        sectionId: "practical",
        difficulty: "intermediate",
        prerequisites: ["qiskit-programming"],
        githubSource: src("Use a QC Today · Your first quantum experiment", "use-a-qc-today/your-first-quantum-experiment.ipynb"),
        description:
          "Qiskit exposes two \"primitives\" for getting answers out of a circuit: Sampler, which returns a histogram of measured outcomes, and Estimator, which combines measurements into a single expectation value (like an energy).",
        whyItMatters: "Everything built in this app's editor is designed to translate directly into real, runnable Qiskit code using exactly these primitives.",
      },
      {
        id: "backend-selection",
        title: "Backend Selection",
        sectionId: "practical",
        difficulty: "intermediate",
        prerequisites: ["qiskit-overview"],
        githubSource: src("Use a QC Today · Build and run your first quantum program", "use-a-qc-today/build-and-run-your-first-quantum-program.ipynb"),
        description:
          "A circuit can run on AerSimulator (a fast classical simulator, good for testing and learning) or on a real IBM Quantum processor — same circuit, same Qiskit code, different backend.",
        whyItMatters: "The editor's Local vs Qiskit Aer toggle is a direct, hands-on version of this exact choice.",
      },
      {
        id: "simulation",
        title: "Simulation",
        sectionId: "practical",
        difficulty: "intermediate",
        prerequisites: ["backend-selection"],
        githubSource: src("Use a QC Today · Your first quantum experiment", "use-a-qc-today/your-first-quantum-experiment.ipynb"),
        description:
          "Sampler-based simulation answers \"what did we measure\" with a probability histogram; Estimator-based simulation answers \"what's the value of this quantity\" with a single number — both without any hardware noise.",
        whyItMatters: "Simulation is how you validate a circuit's logic before ever touching real, noisy, queued quantum hardware.",
        exampleCircuit: buildBellStateCircuit,
        showProbability: true,
      },
      {
        id: "running-circuits",
        title: "Running Circuits",
        sectionId: "practical",
        difficulty: "intermediate",
        prerequisites: ["simulation"],
        githubSource: src("Use a QC Today · Build and run your first quantum program", "use-a-qc-today/build-and-run-your-first-quantum-program.ipynb"),
        description:
          "Running a circuit means executing the map → optimize → execute → post-process pattern: prepare the circuit, transpile it for the target backend, run it for a number of shots, and collect the outcomes.",
        whyItMatters: "This is exactly what happens every time the editor's simulator (or the Qiskit Aer backend) recomputes results as you edit.",
        exampleCircuit: buildBellStateCircuit,
        showProbability: true,
      },
      {
        id: "interpreting-results",
        title: "Interpreting Results",
        sectionId: "practical",
        difficulty: "intermediate",
        prerequisites: ["running-circuits"],
        githubSource: src("Use a QC Today · Your first quantum experiment", "use-a-qc-today/your-first-quantum-experiment.ipynb"),
        description:
          "\"What state did we measure\" and \"what's the value of this physical quantity\" are different questions — which is exactly why Qiskit gives you Sampler and Estimator as two separate tools rather than one.",
        whyItMatters: "The AI Tutor panel is built specifically to help with this: explaining what a given circuit's results actually mean.",
      },
      {
        id: "hardware-execution",
        title: "Hardware Execution",
        sectionId: "practical",
        difficulty: "advanced",
        prerequisites: ["interpreting-results"],
        githubSource: src("Use a QC Today · Build and run your first quantum program", "use-a-qc-today/build-and-run-your-first-quantum-program.ipynb"),
        description:
          "On real IBM Quantum hardware, a circuit is transpiled to match that specific device's native gate set and qubit connectivity before it runs, and QPU time is a metered, queued resource rather than instant like a simulator.",
        whyItMatters: "It's the gap between an ideal simulated circuit and what you'd actually observe running on a real, noisy QPU.",
      },
    ],
  },
  {
    id: "advanced",
    title: "07 — Advanced Quantum Computing",
    description: "Noise, error correction, and variational algorithms — the frontier of near-term quantum computing.",
    topics: [
      {
        id: "noise-and-errors",
        title: "Noise",
        sectionId: "advanced",
        difficulty: "advanced",
        prerequisites: ["hardware-execution"],
        githubSource: src("Foundations of Quantum Error Correction · Overview", "foundations-of-quantum-error-correction/index.mdx"),
        description:
          "Real qubits decohere and gates are imperfect, introducing errors that accumulate with circuit depth — the central obstacle standing between today's hardware and reliable large-scale quantum computing.",
        whyItMatters: "Every mitigation and correction technique that follows in this section exists specifically to fight this.",
      },
      {
        id: "error-correction",
        title: "Error Correction",
        sectionId: "advanced",
        difficulty: "advanced",
        prerequisites: ["noise-and-errors"],
        githubSource: src("Foundations of Quantum Error Correction · Overview", "foundations-of-quantum-error-correction/index.mdx"),
        description:
          "Quantum error correcting codes — including Calderbank–Shor–Steane (CSS) codes and surface/toric codes, built on the stabilizer formalism — protect logical qubits by detecting and correcting errors without directly measuring (and collapsing) the protected information.",
        whyItMatters: "Fault-tolerant, error-corrected qubits built this way are the widely-cited requirement for large-scale, reliable quantum computing.",
      },
      {
        id: "variational-algorithms",
        title: "Variational Algorithms",
        sectionId: "advanced",
        difficulty: "advanced",
        prerequisites: ["shors-algorithm"],
        githubSource: src("Variational Algorithm Design · Overview", "variational-algorithm-design/index.mdx"),
        description:
          "A variational algorithm alternates a parameterized circuit (an \"ansatz\") with a classical optimizer that adjusts those parameters to minimize some measured quantity — a hybrid quantum-classical loop.",
        whyItMatters: "This hybrid pattern, built from the rotation gates covered earlier in this roadmap, is the most practical way to use today's noisy, limited-qubit hardware.",
      },
      {
        id: "vqe",
        title: "VQE",
        sectionId: "advanced",
        difficulty: "advanced",
        prerequisites: ["variational-algorithms"],
        githubSource: src("Quantum Chemistry with VQE · Overview", "quantum-chem-with-vqe/index.mdx"),
        description:
          "The Variational Quantum Eigensolver estimates a system's ground-state energy: Estimator evaluates a Hamiltonian's expectation value on a parameterized ansatz circuit, and a classical optimizer adjusts the parameters to minimize it.",
        whyItMatters: "VQE is one of the leading near-term candidates for quantum advantage in quantum chemistry and materials science.",
      },
      {
        id: "qaoa",
        title: "QAOA",
        sectionId: "advanced",
        difficulty: "advanced",
        prerequisites: ["variational-algorithms"],
        githubSource: src("Variational Algorithm Design · Overview", "variational-algorithm-design/index.mdx"),
        description:
          "The Quantum Approximate Optimization Algorithm runs the same ansatz-plus-classical-optimizer loop as VQE, but alternates problem and mixing unitaries to approximately solve combinatorial optimization problems instead of estimating an energy.",
        whyItMatters: "QAOA is the variational-algorithm analogue for optimization, the way VQE is for chemistry.",
      },
    ],
  },
];

const TOPICS_BY_ID = new Map<string, RoadmapTopic>(ROADMAP.flatMap((section) => section.topics).map((t) => [t.id, t]));

export const ALL_TOPICS: RoadmapTopic[] = ROADMAP.flatMap((section) => section.topics);

export function getTopic(id: string): RoadmapTopic | undefined {
  return TOPICS_BY_ID.get(id);
}

export function getSectionForTopic(topicId: string): RoadmapSection | undefined {
  return ROADMAP.find((section) => section.topics.some((t) => t.id === topicId));
}

/** The next topic in roadmap order after the given one — the curriculum is
 * curated in dependency order, so "next" and "next unlocked" usually agree. */
export function getNextTopic(id: string): RoadmapTopic | undefined {
  const index = ALL_TOPICS.findIndex((t) => t.id === id);
  return index >= 0 ? ALL_TOPICS[index + 1] : undefined;
}
