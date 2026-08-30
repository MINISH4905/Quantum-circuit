import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useCircuitStore } from "../../state/circuit-store";
import { useSimulationStore } from "../../state/simulation-store";
import { useExpandable } from "../../state/expand-store";
import { computeStatevector, type Statevector } from "../../simulation/state-vector-simulator";
import { computeQSphereLayout, DEFAULT_QSPHERE_VIEW, type QSphereView } from "../../simulation/qsphere-layout";
import { ExpandableModule } from "../shared/ExpandableModule";
import { ExpandToggleButton } from "../shared/ExpandToggleButton";

const AUTO_RUN_QUBIT_LIMIT = 8;
const DEBOUNCE_MS = 300;
const DEFAULT_SIZE = 190;
const EXPANDED_SIZE = 340;
const DRAG_SENSITIVITY = 0.5;
const MAX_ELEVATION = 89;
const MIN_ELEVATION = -89;

function hueForPhase(phase: number): string {
  const deg = (phase / (2 * Math.PI)) * 360;
  return `hsl(${deg}, 85%, 60%)`;
}

function formatPhase(phase: number): string {
  return `${((phase / Math.PI) * 180).toFixed(0)}°`;
}

export function QSpherePanel() {
  const circuit = useCircuitStore((s) => s.circuit);
  const hasErrors = useCircuitStore((s) => s.errors.length > 0);

  const mode = useSimulationStore((s) => s.mode);
  const backendResult = useSimulationStore((s) => s.backendResult);
  const backendError = useSimulationStore((s) => s.backendError);

  const [localSv, setLocalSv] = useState<Statevector | null>(null);
  const [view, setView] = useState<QSphereView>(DEFAULT_QSPHERE_VIEW);
  const [showLabels, setShowLabels] = useState(true);
  const [showPhase, setShowPhase] = useState(false);
  const debounceRef = useRef<number | undefined>(undefined);

  const dragState = useRef<{ startX: number; startY: number; startView: QSphereView } | null>(null);
  const { expanded, toggle, collapse } = useExpandable("q-sphere");

  const runLocal = useCallback(() => {
    if (hasErrors) {
      setLocalSv(null);
      return;
    }
    setLocalSv(computeStatevector(circuit));
  }, [circuit, hasErrors]);

  // Local statevector is always kept fresh in the background so it can serve
  // as an immediate fallback if backend mode is selected but unreachable.
  useEffect(() => {
    if (hasErrors || circuit.qubits > AUTO_RUN_QUBIT_LIMIT) {
      if (hasErrors) setLocalSv(null);
      return;
    }
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(runLocal, DEBOUNCE_MS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [circuit, hasErrors]);

  const usingBackendFallback = mode === "backend" && !!backendError;
  const showBackendData = mode === "backend" && !backendError && !!backendResult;

  const backendSv: Statevector | null = useMemo(() => {
    if (!showBackendData || !backendResult) return null;
    const size = backendResult.statevector.length;
    const re = new Float64Array(size);
    const im = new Float64Array(size);
    backendResult.statevector.forEach((amp, i) => {
      re[i] = amp.real;
      im[i] = amp.imag;
    });
    return { qubits: circuit.qubits, re, im };
  }, [showBackendData, backendResult, circuit.qubits]);

  const sv = showBackendData ? backendSv : localSv;
  const points = useMemo(() => (sv ? computeQSphereLayout(sv, view) : null), [sv, view]);

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!points) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    dragState.current = { startX: e.clientX, startY: e.clientY, startView: view };
  };
  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragState.current) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    setView({
      azimuthDeg: dragState.current.startView.azimuthDeg + dx * DRAG_SENSITIVITY,
      elevationDeg: Math.min(
        MAX_ELEVATION,
        Math.max(MIN_ELEVATION, dragState.current.startView.elevationDeg - dy * DRAG_SENSITIVITY)
      ),
    });
  };
  const endDrag = () => {
    dragState.current = null;
  };
  const resetView = () => setView(DEFAULT_QSPHERE_VIEW);

  const tooBig = circuit.qubits > AUTO_RUN_QUBIT_LIMIT;
  const maxProb = useMemo(() => Math.max(...(points ?? []).map((p) => p.probability), 1e-9), [points]);

  const size = expanded ? EXPANDED_SIZE : DEFAULT_SIZE;
  const CENTER = size / 2;
  const SPHERE_R = size / 2 - 20;
  const ellipsePath = (rx: number, ry: number, cy = 0): string =>
    `M ${CENTER - rx} ${CENTER + cy} A ${rx} ${ry} 0 1 0 ${CENTER + rx} ${CENTER + cy} A ${rx} ${ry} 0 1 0 ${CENTER - rx} ${CENTER + cy}`;

  return (
    <ExpandableModule
      as="section"
      className="qsphere-panel"
      ariaLabel="Q-sphere state visualization"
      title="Q-sphere"
      expanded={expanded}
      onCollapse={collapse}
    >
      <div className="probabilities-header">
        <h2 className="panel-title" style={{ margin: 0 }}>
          Q-sphere
        </h2>
        <div className="module-header-actions">
          <div className="canvas-toolbar-group">
            <button type="button" className="icon-btn" onClick={resetView} disabled={!points} aria-label="Reset Q-sphere view" title="Reset view">
              ⤾
            </button>
            <button type="button" className="icon-btn" onClick={runLocal} disabled={hasErrors} aria-label="Refresh local statevector" title="Refresh">
              ↻
            </button>
          </div>
          <ExpandToggleButton expanded={expanded} onClick={toggle} label="Q-sphere" />
        </div>
      </div>

      <div className="probabilities-body qsphere-body">
        {hasErrors && <p className="inspector-empty">Fix circuit validation errors to see the state.</p>}

        {!hasErrors && usingBackendFallback && (
          <p className="sim-fallback-note" role="alert">
            Qiskit Aer backend unreachable — showing local statevector fallback.
          </p>
        )}

        {!hasErrors && mode === "local" && tooBig && !points && (
          <p className="inspector-empty">Circuit has {circuit.qubits} qubits — click ↻ to compute manually.</p>
        )}

        {!hasErrors && points && (
          <div className="qsphere-layout">
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              role="img"
              aria-label="Q-sphere — drag to rotate"
              className="qsphere-svg"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onDoubleClick={resetView}
            >
              <circle cx={CENTER} cy={CENTER} r={SPHERE_R} fill="none" stroke="#383835" strokeWidth={1} />
              <path d={ellipsePath(SPHERE_R, SPHERE_R * 0.32)} fill="none" stroke="#2c2c2a" strokeWidth={1} />
              <path d={ellipsePath(SPHERE_R * 0.75, SPHERE_R * 0.75, -SPHERE_R * 0.35)} fill="none" stroke="#26262488" strokeWidth={1} />
              <path d={ellipsePath(SPHERE_R * 0.75, SPHERE_R * 0.75, SPHERE_R * 0.35)} fill="none" stroke="#26262488" strokeWidth={1} />
              <ellipse cx={CENTER} cy={CENTER} rx={SPHERE_R * 0.32} ry={SPHERE_R} fill="none" stroke="#2c2c2a" strokeWidth={1} />

              {points.map((p) => {
                const r = Math.max(3, Math.sqrt(p.probability / maxProb) * 11);
                const opacity = 0.55 + 0.45 * ((p.depth + 1) / 2);
                const cx = CENTER + p.x * SPHERE_R;
                const cy = CENTER + p.y * SPHERE_R;
                return (
                  <g key={p.index} opacity={opacity}>
                    <line x1={CENTER} y1={CENTER} x2={cx} y2={cy} stroke={hueForPhase(p.phase)} strokeWidth={1} opacity={0.5} />
                    <circle cx={cx} cy={cy} r={r} fill={hueForPhase(p.phase)} stroke="#0d0d0d" strokeWidth={0.75}>
                      <title>
                        |{p.bitstring}⟩ — probability {(p.probability * 100).toFixed(2)}%, phase {formatPhase(p.phase)}
                      </title>
                    </circle>
                    {showLabels && (
                      <text x={cx} y={cy - r - 3} fontSize={9} fill="#c3c2b7" textAnchor="middle" fontFamily="ui-monospace, monospace">
                        {p.bitstring}
                      </text>
                    )}
                    {showPhase && (
                      <text x={cx} y={cy + r + 10} fontSize={8} fill="#898781" textAnchor="middle">
                        {formatPhase(p.phase)}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            <div className="qsphere-legend">
              <div className="phase-wheel" aria-hidden="true" />
              <span className="phase-wheel-label phase-wheel-top">π/2</span>
              <span className="phase-wheel-label phase-wheel-left">π</span>
              <span className="phase-wheel-label phase-wheel-right">0</span>
              <span className="phase-wheel-label phase-wheel-bottom">3π/2</span>
            </div>
          </div>
        )}

        {!hasErrors && points && (
          <div className="qsphere-toggles">
            <label>
              <input type="checkbox" checked={showLabels} onChange={(e) => setShowLabels(e.target.checked)} /> State
            </label>
            <label>
              <input type="checkbox" checked={showPhase} onChange={(e) => setShowPhase(e.target.checked)} /> Phase angle
            </label>
          </div>
        )}
      </div>
    </ExpandableModule>
  );
}
