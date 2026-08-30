import { useEffect, useMemo, useRef, useState } from "react";
import { useCircuitStore } from "../../state/circuit-store";
import { useSimulationStore } from "../../state/simulation-store";
import { useExpandable } from "../../state/expand-store";
import { computeStatevector, type Statevector } from "../../simulation/state-vector-simulator";
import { computeBlochAngles, type BlochAngle } from "../../simulation/bloch";
import { BlochSphere } from "./BlochSphere";
import { ExpandableModule } from "../shared/ExpandableModule";
import { ExpandToggleButton } from "../shared/ExpandToggleButton";

const AUTO_RUN_QUBIT_LIMIT = 8;
const DEBOUNCE_MS = 300;

export function BlochSpheresPanel() {
  const circuit = useCircuitStore((s) => s.circuit);
  const hasErrors = useCircuitStore((s) => s.errors.length > 0);

  const mode = useSimulationStore((s) => s.mode);
  const backendResult = useSimulationStore((s) => s.backendResult);
  const backendError = useSimulationStore((s) => s.backendError);

  const [localSv, setLocalSv] = useState<Statevector | null>(null);
  const debounceRef = useRef<number | undefined>(undefined);
  const { expanded, toggle, collapse } = useExpandable("bloch-sphere");

  // Mirrors the local-statevector-in-the-background pattern already used by
  // QSpherePanel/ProbabilitiesPanel — each viz panel keeps its own fresh copy
  // rather than sharing derived state, so no new shared state manager is added.
  useEffect(() => {
    if (hasErrors || circuit.qubits > AUTO_RUN_QUBIT_LIMIT) {
      if (hasErrors) setLocalSv(null);
      return;
    }
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      setLocalSv(computeStatevector(circuit));
    }, DEBOUNCE_MS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [circuit, hasErrors]);

  const usingBackendFallback = mode === "backend" && !!backendError;
  const showBackendData = mode === "backend" && !backendError && !!backendResult;

  const angles: BlochAngle[] | null = useMemo(() => {
    if (showBackendData && backendResult) return backendResult.blochAngles;
    if (!localSv) return null;
    return computeBlochAngles(localSv);
  }, [showBackendData, backendResult, localSv]);

  const tooBig = circuit.qubits > AUTO_RUN_QUBIT_LIMIT;

  return (
    <ExpandableModule
      as="section"
      className="bloch-panel"
      ariaLabel="Per-qubit Bloch spheres"
      title="Bloch Spheres"
      expanded={expanded}
      onCollapse={collapse}
    >
      <div className="probabilities-header">
        <h2 className="panel-title" style={{ margin: 0 }}>
          Bloch spheres
        </h2>
        <div className="module-header-actions">
          <ExpandToggleButton expanded={expanded} onClick={toggle} label="Bloch spheres" />
        </div>
      </div>

      <div className="probabilities-body bloch-body">
        {hasErrors && <p className="inspector-empty">Fix circuit validation errors to see qubit states.</p>}

        {!hasErrors && usingBackendFallback && (
          <p className="sim-fallback-note" role="alert">
            Qiskit Aer backend unreachable — showing local statevector fallback.
          </p>
        )}

        {!hasErrors && mode === "local" && tooBig && !angles && (
          <p className="inspector-empty">Circuit has {circuit.qubits} qubits — too large to auto-render live.</p>
        )}

        {!hasErrors && !tooBig && (
          <div className="bloch-spheres-row">
            {Array.from({ length: circuit.qubits }, (_, q) => (
              <BlochSphere
                key={q}
                qubitIndex={q}
                angle={angles?.find((a) => a.qubit === q) ?? null}
                size={expanded ? 220 : 130}
              />
            ))}
          </div>
        )}
      </div>
    </ExpandableModule>
  );
}
