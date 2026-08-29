export type WalkthroughPlacement = "top" | "bottom" | "left" | "right";

export interface WalkthroughStep {
  target: string;
  title: string;
  description: string;
  placement: WalkthroughPlacement;
}

/** Configuration-driven tour of the Interactive Circuits page. Targets are ids
 * already present on existing elements — no new UI is introduced, this just
 * points at what's already there. */
export const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    target: "#wt-circuit-editor",
    title: "Circuit Editor",
    description: "This is your workspace for building and modifying quantum circuits — the gate panel, grid, and visualizations all live here.",
    placement: "right",
  },
  {
    target: "#wt-gate-panel",
    title: "Gate Panel",
    description: "Browse gates by category. Click a gate to add it to the circuit, or drag it directly onto the grid.",
    placement: "right",
  },
  {
    target: "#wt-circuit-grid",
    title: "Circuit Grid",
    description: "Each row is a qubit wire. Drop gates onto a time step to place them, and the circuit runs automatically as you build it.",
    placement: "top",
  },
  {
    target: "#wt-visualization",
    title: "Visualization Area",
    description: "See your results here: measurement probabilities, per-qubit Bloch spheres, and the combined Q-sphere.",
    placement: "top",
  },
  {
    target: "#wt-controls",
    title: "Controls",
    description: "Undo/redo, add or remove qubits and time steps, and switch between the local simulator and the Qiskit Aer backend.",
    placement: "bottom",
  },
  {
    target: "#wt-ai-tutor",
    title: "AI Tutor",
    description: "Get a plain-language explanation of your circuit, conceptual warnings, and optimization tips here.",
    placement: "left",
  },
  {
    target: "#wt-help-menu-btn",
    title: "Need a refresher?",
    description: "You can restart this walkthrough anytime from Help → Take a Tour.",
    placement: "bottom",
  },
];
