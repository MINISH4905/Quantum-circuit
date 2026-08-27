import { useCircuitStore } from "../../state/circuit-store";
import { useSimulationStore } from "../../state/simulation-store";

export function CanvasToolbar() {
  const circuit = useCircuitStore((s) => s.circuit);
  const simMode = useSimulationStore((s) => s.mode);
  const setSimMode = useSimulationStore((s) => s.setMode);
  const backendLoading = useSimulationStore((s) => s.backendLoading);
  const addQubit = useCircuitStore((s) => s.addQubit);
  const removeQubit = useCircuitStore((s) => s.removeQubit);
  const insertTimeStep = useCircuitStore((s) => s.insertTimeStep);
  const removeTimeStep = useCircuitStore((s) => s.removeTimeStep);
  const undo = useCircuitStore((s) => s.undo);
  const redo = useCircuitStore((s) => s.redo);
  const canUndo = useCircuitStore((s) => s.canUndo());
  const canRedo = useCircuitStore((s) => s.canRedo());

  const maxTimeStep = circuit.operations.reduce((max, op) => Math.max(max, op.timeStep), -1);

  return (
    <div className="canvas-toolbar" role="toolbar" aria-label="Canvas controls">
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
      <div className="canvas-toolbar-group" role="radiogroup" aria-label="Simulation engine">
        <button
          type="button"
          className={`icon-btn sim-mode-btn${simMode === "local" ? " is-active" : ""}`}
          onClick={() => setSimMode("local")}
          role="radio"
          aria-checked={simMode === "local"}
          title="Local statevector simulator (in-browser)"
        >
          Local
        </button>
        <button
          type="button"
          className={`icon-btn sim-mode-btn${simMode === "backend" ? " is-active" : ""}`}
          onClick={() => setSimMode("backend")}
          role="radio"
          aria-checked={simMode === "backend"}
          title="Qiskit Aer backend (requires the FastAPI server running)"
        >
          Qiskit Aer{simMode === "backend" && backendLoading ? " …" : ""}
        </button>
      </div>
    </div>
  );
}
