import { useMemo, useCallback } from "react";
import { useCircuitStore } from "../../state/circuit-store";
import { useUiStore } from "../../state/ui-store";
import { getGate } from "../../circuit/gate-registry/registry";
import { GridCell } from "./GridCell";
import { PlacedGate } from "./PlacedGate";
import { ROW_HEIGHT, COL_WIDTH, LABEL_WIDTH } from "./layout";

export function CircuitCanvas() {
  const circuit = useCircuitStore((s) => s.circuit);
  const errors = useCircuitStore((s) => s.errors);
  const removeOperation = useCircuitStore((s) => s.removeOperation);
  const removeQubit = useCircuitStore((s) => s.removeQubit);
  const updateOperation = useCircuitStore((s) => s.updateOperation);
  const addOperation = useCircuitStore((s) => s.addOperation);
  const selectedId = useUiStore((s) => s.selectedOperationId);
  const select = useUiStore((s) => s.select);
  const clipboard = useUiStore((s) => s.clipboard);
  const copySelected = useUiStore((s) => s.copySelected);
  const setLastFocusedQubit = useUiStore((s) => s.setLastFocusedQubit);

  const invalidOpIds = useMemo(() => new Set(errors.map((e) => e.operationId).filter(Boolean)), [errors]);

  const maxTimeStep = circuit.operations.reduce((max, op) => Math.max(max, op.timeStep), -1);
  const timeStepCount = Math.max(maxTimeStep + 2, 6);

  const selectedOp = circuit.operations.find((op) => op.id === selectedId);

  const measureOps = useMemo(() => circuit.operations.filter((op) => op.gate === "measure"), [circuit.operations]);
  const classicalRowY = circuit.qubits * ROW_HEIGHT;
  const hasClassicalRow = circuit.classicalBits > 0;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!selectedOp) return;
      const gate = getGate(selectedOp.gate);
      if (!gate) return;

      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        removeOperation(selectedOp.id);
        select(null);
        return;
      }
      if (e.key === "Escape") {
        select(null);
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") {
        e.preventDefault();
        copySelected(selectedOp);
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v" && clipboard) {
        e.preventDefault();
        addOperation({ ...clipboard, timeStep: selectedOp.timeStep + 1 });
        return;
      }

      const controls = selectedOp.controls ?? [];
      const targets = selectedOp.targets;
      const all = [...controls, ...targets];
      const minQ = Math.min(...all);
      const maxQ = Math.max(...all);

      if (e.key === "ArrowRight") {
        e.preventDefault();
        updateOperation(selectedOp.id, { timeStep: selectedOp.timeStep + 1 });
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        updateOperation(selectedOp.id, { timeStep: Math.max(0, selectedOp.timeStep - 1) });
      } else if (e.key === "ArrowDown" && maxQ < circuit.qubits - 1) {
        e.preventDefault();
        updateOperation(selectedOp.id, {
          controls: controls.map((q) => q + 1),
          targets: targets.map((q) => q + 1),
        });
      } else if (e.key === "ArrowUp" && minQ > 0) {
        e.preventDefault();
        updateOperation(selectedOp.id, {
          controls: controls.map((q) => q - 1),
          targets: targets.map((q) => q - 1),
        });
      }
    },
    [selectedOp, removeOperation, select, copySelected, clipboard, addOperation, updateOperation, circuit.qubits]
  );

  const gridWidth = timeStepCount * COL_WIDTH;
  const gridHeight = circuit.qubits * ROW_HEIGHT + (hasClassicalRow ? ROW_HEIGHT : 0);

  return (
    <div className="circuit-canvas-wrapper">
      <div className="circuit-labels" style={{ width: LABEL_WIDTH }}>
        <div className="circuit-labels-spacer" />
        {Array.from({ length: circuit.qubits }, (_, q) => (
          <div key={q} className="qubit-label" style={{ height: ROW_HEIGHT }} onClick={() => setLastFocusedQubit(q)}>
            q[{q}]
          </div>
        ))}
        {hasClassicalRow && (
          <div className="qubit-label classical-label" style={{ height: ROW_HEIGHT }}>
            c{circuit.classicalBits}
          </div>
        )}
      </div>

      <div
        className="circuit-scroll"
        tabIndex={0}
        role="grid"
        aria-label="Quantum circuit"
        onKeyDown={handleKeyDown}
        onClick={() => select(null)}
      >
        <div className="circuit-timeline-header" style={{ width: gridWidth }}>
          {Array.from({ length: timeStepCount }, (_, t) => (
            <div key={t} className="timeline-header-cell" style={{ width: COL_WIDTH }}>
              t{t}
            </div>
          ))}
        </div>
        <div className="circuit-grid" style={{ width: gridWidth, height: gridHeight, position: "relative" }}>
          {Array.from({ length: circuit.qubits }, (_, q) => (
            <div
              key={q}
              className="qubit-wire"
              style={{ position: "absolute", top: q * ROW_HEIGHT + ROW_HEIGHT / 2, left: 0, width: gridWidth, height: 1 }}
            />
          ))}

          {hasClassicalRow && (
            <div
              className="classical-wire"
              style={{ position: "absolute", top: classicalRowY + ROW_HEIGHT / 2, left: 0, width: gridWidth }}
            >
              <div className="classical-wire-line" />
              <div className="classical-wire-line" />
            </div>
          )}

          {hasClassicalRow &&
            measureOps.map((op) => (
              <div
                key={`mc-${op.id}`}
                className="measure-connector"
                style={{
                  left: op.timeStep * COL_WIDTH + COL_WIDTH / 2,
                  top: op.targets[0] * ROW_HEIGHT + ROW_HEIGHT / 2,
                  height: classicalRowY + ROW_HEIGHT / 2 - (op.targets[0] * ROW_HEIGHT + ROW_HEIGHT / 2),
                }}
                aria-hidden="true"
              />
            ))}

          {Array.from({ length: circuit.qubits }, (_, q) =>
            Array.from({ length: timeStepCount }, (_, t) => <GridCell key={`${q}-${t}`} qubit={q} timeStep={t} />)
          )}

          {circuit.operations.length === 0 && (
            <div className="circuit-empty-hint" aria-hidden="true">
              Drag a gate here, or click a gate in the toolbox to add it
            </div>
          )}

          {circuit.operations.map((op) => {
            const gate = getGate(op.gate);
            if (!gate) return null;
            return (
              <PlacedGate
                key={op.id}
                op={op}
                gate={gate}
                selected={op.id === selectedId}
                invalid={invalidOpIds.has(op.id)}
                onSelect={select}
              />
            );
          })}
        </div>
      </div>

      <div className="circuit-right-rail">
        <div className="circuit-labels-spacer" />
        {Array.from({ length: circuit.qubits }, (_, q) => (
          <div key={q} className="right-rail-row" style={{ height: ROW_HEIGHT }}>
            <button
              type="button"
              className="rail-remove-btn"
              onClick={() => removeQubit(q)}
              disabled={circuit.qubits <= 1}
              aria-label={`Remove qubit ${q}`}
              title={`Remove q[${q}]`}
            >
              −
            </button>
          </div>
        ))}
        {hasClassicalRow && <div className="right-rail-row" style={{ height: ROW_HEIGHT }} />}
      </div>
    </div>
  );
}
