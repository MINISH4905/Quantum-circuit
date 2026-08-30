import type { Step } from "react-joyride";

/** Guided tour of the circuit simulator ("/" dashboard view) — targets
 * data-tour attributes on existing elements, see AppTour.tsx and the
 * data-tour additions in GateToolbox/CircuitCanvas/CanvasToolbar/
 * ProbabilitiesPanel/AppRoot. */
export const TOUR_STEPS: Step[] = [
  {
    target: '[data-tour="gate-palette"]',
    title: "Gate Palette",
    content: "Drag gates onto your circuit.",
    placement: "auto",
    skipBeacon: true,
  },
  {
    target: '[data-tour="circuit-canvas"]',
    title: "Circuit Canvas",
    content: "Your qubit wires live here.",
    placement: "auto",
    skipBeacon: true,
  },
  {
    target: '[data-tour="qubit-controls"]',
    title: "Qubit Controls",
    content: "Add or remove qubits.",
    placement: "auto",
    skipBeacon: true,
  },
  {
    target: '[data-tour="simulate-btn"]',
    title: "Simulate",
    content: "Run your circuit and see results.",
    placement: "auto",
    skipBeacon: true,
  },
  {
    target: '[data-tour="results-panel"]',
    title: "Results",
    content: "Measurement outcomes shown here.",
    placement: "auto",
    skipBeacon: true,
  },
  {
    target: '[data-tour="learn-nav"]',
    title: "Learning Center",
    content: "Structured quantum lessons — gates, algorithms, and more.",
    placement: "auto",
    skipBeacon: true,
  },
  {
    target: "body",
    placement: "center",
    title: "You're ready!",
    content: "That covers the essentials. Go to the Learning Center any time for structured lessons on gates, algorithms, and more.",
    skipBeacon: true,
  },
];
