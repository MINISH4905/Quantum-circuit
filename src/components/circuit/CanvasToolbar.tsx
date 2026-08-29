import { useCircuitStore } from "../../state/circuit-store";
import { useSimulationStore, type SimulationBackend } from "../../state/simulation-store";

const BACKEND_OPTIONS: { value: SimulationBackend; label: string }[] = [
  { value: "local", label: "Local" },
  { value: "qiskit", label: "Qiskit Aer" },
  { value: "cirq", label: "Cirq" },
  { value: "pennylane", label: "PennyLane" },
];

export function CanvasToolbar() {
  const circuit = useCircuitStore((s) => s.circuit);
  const activeBackend = useSimulationStore((s) => s.activeBackend);
  const mode = useSimulationStore((s) => s.mode);
  const setActiveBackend = useSimulationStore((s) => s.setActiveBackend);
  const setMode = useSimulationStore((s) => s.setMode);
  const backendLoading = useSimulationStore((s) => s.backendLoading);
  const compareLoading = useSimulationStore((s) => s.compareLoading);
  const addQubit = useCircuitStore((s) => s.addQubit);
  const removeQubit = useCircuitStore((s) => s.removeQubit);
  const insertTimeStep = useCircuitStore((s) => s.insertTimeStep);
  const removeTimeStep = useCircuitStore((s) => s.removeTimeStep);
  const undo = useCircuitStore((s) => s.undo);
  const redo = useCircuitStore((s) => s.redo);
  const canUndo = useCircuitStore((s) => s.canUndo());
  const canRedo = useCircuitStore((s) => s.canRedo());

  const maxTimeStep = circuit.operations.reduce((max, op) => Math.max(max, op.timeStep), -1);
  const isCompare = mode === "compare";

  return (
    <div className="canvas-toolbar" id="wt-controls" role="toolbar" aria-label="Canvas controls">
      <div className="canvas-toolbar-group">
        <button type="button" className="icon-btn" onClick={undo} disabled={!canUndo} aria-label="Undo (Ctrl+Z)" title="Undo">
          ↶
        </button>
        <button type="button" className="icon-btn" onClick={redo} disabled={!canRedo} aria-label="Redo (Ctrl+Shift+Z)" title="Redo">
          ↷
        </button>
      </div>
      <div className="canvas-toolbar-divider" />
      <div className="canvas-toolbar-group">
        <button type="button" className="icon-btn" onClick={addQubit} aria-label="Add qubit" title="Add qubit">
          q+
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={() => removeQubit(circuit.qubits - 1)}
          disabled={circuit.qubits <= 1}
          aria-label="Remove last qubit"
          title="Remove last qubit"
        >
          q−
        </button>
      </div>
      <div className="canvas-toolbar-group">
        <button
          type="button"
          className="icon-btn"
          onClick={() => insertTimeStep(maxTimeStep + 1)}
          aria-label="Add time step"
          title="Add time step"
        >
          t+
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={() => removeTimeStep(maxTimeStep)}
          disabled={maxTimeStep < 0}
          aria-label="Remove last time step"
          title="Remove last time step"
        >
          t−
        </button>
      </div>
      <div className="canvas-toolbar-divider" />
      <div className="canvas-toolbar-group">
        <select
          className="framework-selector"
          value={isCompare ? "__compare__" : activeBackend}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "__compare__") {
              setMode("compare");
            } else {
              setActiveBackend(val as SimulationBackend);
            }
          }}
          aria-label="Simulation engine"
        >
          {BACKEND_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
          <option value="__compare__">Compare All</option>
        </select>
        {mode === "backend" && backendLoading && <span className="sim-loading-indicator">...</span>}
        {isCompare && compareLoading && <span className="sim-loading-indicator">...</span>}
      </div>
    </div>
  );
}
