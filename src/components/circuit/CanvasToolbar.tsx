import { useCircuitStore } from "../../state/circuit-store";
import { useSimulationStore } from "../../state/simulation-store";
import { useExpandable } from "../../state/expand-store";
import { ExpandToggleButton } from "../shared/ExpandToggleButton";

interface CanvasToolbarProps {
  /** The expand button targets the dashboard's specific "circuit-editor"
   * layout (hiding app-right-col/app-bottom-row) — meaningless when this
   * toolbar is reused elsewhere (e.g. the Learner page's embedded editor),
   * so it can be turned off there instead of leaking a dead/misleading
   * control tied to a layout that page doesn't have. */
  showExpandToggle?: boolean;
}

export function CanvasToolbar({ showExpandToggle = true }: CanvasToolbarProps) {
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
  const { expanded, toggle } = useExpandable("circuit-editor");

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
      <div className="canvas-toolbar-group" data-tour="qubit-controls">
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
      {showExpandToggle && (
        <>
          <div className="canvas-toolbar-divider" />
          <div className="canvas-toolbar-group">
            <ExpandToggleButton expanded={expanded} onClick={toggle} label="Circuit editor" />
          </div>
        </>
      )}
    </div>
  );
}
