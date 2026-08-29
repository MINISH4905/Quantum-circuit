import { useEffect, useMemo, useRef, useState } from "react";
import { useCircuitStore } from "../../state/circuit-store";
import { useSimulationStore } from "../../state/simulation-store";
import { runSimulation, type SimulationResult } from "../../simulation/state-vector-simulator";

const MAX_BARS = 16;
const SHOTS = 1024;
const AUTO_RUN_QUBIT_LIMIT = 14;
const DEBOUNCE_MS = 300;

interface TooltipState {
  text: string;
  x: number;
  y: number;
}

interface Bar {
  bitstring: string;
  probability: number;
  count: number;
}

export function ProbabilitiesPanel() {
  const circuit = useCircuitStore((s) => s.circuit);
  const hasErrors = useCircuitStore((s) => s.errors.length > 0);

  const mode = useSimulationStore((s) => s.mode);
  const backendResult = useSimulationStore((s) => s.backendResult);
  const backendError = useSimulationStore((s) => s.backendError);
  const backendLoading = useSimulationStore((s) => s.backendLoading);

  const [localResult, setLocalResult] = useState<SimulationResult | null>(null);
  const [localRunError, setLocalRunError] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const debounceRef = useRef<number | undefined>(undefined);

  const runLocal = () => {
    try {
      setLocalRunError(null);
      setLocalResult(runSimulation(circuit, SHOTS));
    } catch (err) {
      setLocalResult(null);
      setLocalRunError(err instanceof Error ? err.message : "Simulation failed");
    }
  };

  // The local simulator always keeps a fresh result in the background so it
  // can be shown immediately if backend mode is selected but unreachable.
  useEffect(() => {
    if (hasErrors) {
      setLocalResult(null);
      return;
    }
    if (circuit.qubits > AUTO_RUN_QUBIT_LIMIT) return; // manual run only for large circuits
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(runLocal, DEBOUNCE_MS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [circuit, hasErrors]);

  const usingBackendFallback = mode === "backend" && !!backendError;
  const showBackendData = mode === "backend" && !backendError && !!backendResult;

  const bars: Bar[] = useMemo(() => {
    if (showBackendData && backendResult) {
      const total = Object.values(backendResult.measurementHistogram).reduce((a, b) => a + b, 0) || 1;
      return Object.entries(backendResult.measurementHistogram)
        .sort((a, b) => b[1] - a[1])
        .slice(0, MAX_BARS)
        .map(([bitstring, count]) => ({ bitstring, probability: count / total, count }));
    }
    if (!localResult) return [];
    return Object.entries(localResult.probabilities)
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAX_BARS)
      .map(([bitstring, probability]) => ({ bitstring, probability, count: localResult.counts[bitstring] ?? 0 }));
  }, [showBackendData, backendResult, localResult]);

  const shotsShown = showBackendData && backendResult ? backendResult.shots : SHOTS;
  const maxProb = bars.reduce((m, b) => Math.max(m, b.probability), 0) || 1;
  const totalOutcomes = bars.length > 0 ? (showBackendData && backendResult ? Object.keys(backendResult.measurementHistogram).length : Object.keys(localResult?.probabilities ?? {}).length) : 0;
  const needsManualLocalRun = circuit.qubits > AUTO_RUN_QUBIT_LIMIT && !localResult;

  return (
    <section className="probabilities-panel" aria-label="Measurement probabilities">
      <div className="probabilities-header">
        <h2 className="panel-title" style={{ margin: 0 }}>
          Probabilities
        </h2>
        <button
          type="button"
          className="icon-btn"
          onClick={runLocal}
          disabled={hasErrors}
          aria-label="Run local simulation"
          title="Re-run local simulation"
        >
          ↻
        </button>
      </div>

      <div className="probabilities-body">
        {hasErrors && <p className="inspector-empty">Fix circuit validation errors to see probabilities.</p>}

        {!hasErrors && usingBackendFallback && (
          <p className="sim-fallback-note" role="alert">
            Qiskit Aer backend unreachable ({backendError}) — showing local simulator fallback.
          </p>
        )}

        {!hasErrors && mode === "backend" && !backendError && !backendResult && backendLoading && bars.length === 0 && (
          <p className="inspector-empty">Running on Qiskit Aer…</p>
        )}

        {!hasErrors && mode === "local" && needsManualLocalRun && (
          <p className="inspector-empty">Circuit has {circuit.qubits} qubits — click ↻ to run manually.</p>
        )}
        {!hasErrors && localRunError && !showBackendData && (
          <p className="sim-warning" role="alert">
            {localRunError}
          </p>
        )}

        {!hasErrors && bars.length > 0 && (
          <>
            <p className="sim-meta">
              {showBackendData ? "Qiskit Aer · " : "Local · "}
              {shotsShown} shots · {totalOutcomes} outcome{totalOutcomes === 1 ? "" : "s"}
              {totalOutcomes > MAX_BARS ? ` (top ${MAX_BARS})` : ""}
            </p>
            <div className="viz-root histogram" role="img" aria-label="Measurement outcome histogram">
              <div className="histogram-bars">
                {bars.map((b) => (
                  <div
                    className="histogram-bar-col"
                    key={b.bitstring}
                    tabIndex={0}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltip({
                        text: `|${b.bitstring}⟩ — ${(b.probability * 100).toFixed(2)}% · ${b.count} of ${shotsShown} shots`,
                        x: rect.left + rect.width / 2,
                        y: rect.top,
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    onFocus={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltip({
                        text: `|${b.bitstring}⟩ — ${(b.probability * 100).toFixed(2)}% · ${b.count} of ${shotsShown} shots`,
                        x: rect.left + rect.width / 2,
                        y: rect.top,
                      });
                    }}
                    onBlur={() => setTooltip(null)}
                  >
                    <span className="histogram-value-label">{(b.probability * 100).toFixed(1)}%</span>
                    <div className="histogram-track">
                      <div className="histogram-fill" style={{ height: `${Math.max(2, (b.probability / maxProb) * 100)}%` }} />
                    </div>
                    <span className="histogram-x-label">{b.bitstring}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {tooltip && (
        <div className="floating-tooltip" style={{ left: tooltip.x, top: tooltip.y }} role="tooltip">
          {tooltip.text}
        </div>
      )}
    </section>
  );
}
