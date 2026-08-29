import { useEffect, useState } from "react";
import { useCircuitStore } from "../../state/circuit-store";
import { useUiStore } from "../../state/ui-store";
import { getGate } from "../../circuit/gate-registry/registry";
import { formatParameter, parseParameterExpression } from "../../circuit/model/parameter-expr";

const PARAM_PRESETS: Array<{ label: string; value: number }> = [
  { label: "π", value: Math.PI },
  { label: "π/2", value: Math.PI / 2 },
  { label: "π/4", value: Math.PI / 4 },
  { label: "-π/2", value: -Math.PI / 2 },
  { label: "2π", value: 2 * Math.PI },
];

export function GateInspector() {
  const circuit = useCircuitStore((s) => s.circuit);
  const errors = useCircuitStore((s) => s.errors);
  const updateOperation = useCircuitStore((s) => s.updateOperation);
  const removeOperation = useCircuitStore((s) => s.removeOperation);
  const selectedId = useUiStore((s) => s.selectedOperationId);
  const select = useUiStore((s) => s.select);

  const op = circuit.operations.find((o) => o.id === selectedId);
  const gate = op ? getGate(op.gate) : undefined;

  const [paramDrafts, setParamDrafts] = useState<string[]>([]);
  const [paramError, setParamError] = useState<string | null>(null);

  useEffect(() => {
    if (op?.parameters) {
      setParamDrafts(op.parameters.map(formatParameter));
    } else {
      setParamDrafts([]);
    }
    setParamError(null);
  }, [op?.id, op?.parameters?.join(",")]);

  if (!op || !gate) {
    return (
      <aside className="gate-inspector" aria-label="Gate inspector">
        <h2 className="panel-title">Inspector</h2>
        <p className="inspector-empty">Select a gate to edit its properties.</p>
      </aside>
    );
  }

  const opErrors = errors.filter((e) => e.operationId === op.id);

  const commitParam = (index: number, raw: string) => {
    const value = parseParameterExpression(raw);
    if (value === null) {
      setParamError(`"${raw}" is not a valid expression (try: pi, pi/2, 2*pi, 1.57)`);
      return;
    }
    setParamError(null);
    const next = [...(op.parameters ?? [])];
    next[index] = value;
    updateOperation(op.id, { parameters: next });
  };

  return (
    <aside className="gate-inspector" aria-label="Gate inspector">
      <h2 className="panel-title">Inspector</h2>

      <div className="inspector-field">
        <span className="inspector-label">Gate</span>
        <span className="inspector-value">{gate.name}</span>
      </div>

      {gate.controlCount > 0 && (
        <div className="inspector-field">
          <span className="inspector-label">Control</span>
          <span className="inspector-value">q{op.controls?.join(", q")}</span>
        </div>
      )}
      <div className="inspector-field">
        <span className="inspector-label">{gate.targetCount > 1 ? "Targets" : "Target"}</span>
        <span className="inspector-value">q{op.targets.join(", q")}</span>
      </div>
      <div className="inspector-field">
        <span className="inspector-label">Time step</span>
        <span className="inspector-value">{op.timeStep}</span>
      </div>

      {gate.parameterNames?.map((name, i) => (
        <div className="inspector-field" key={name}>
          <label className="inspector-label" htmlFor={`param-${i}`}>
            {name}
          </label>
          <input
            id={`param-${i}`}
            className="inspector-input"
            type="text"
            value={paramDrafts[i] ?? ""}
            onChange={(e) => {
              const next = [...paramDrafts];
              next[i] = e.target.value;
              setParamDrafts(next);
            }}
            onBlur={(e) => commitParam(i, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            }}
            aria-describedby={paramError ? "param-error" : undefined}
          />
          <div className="inspector-presets">
            {PARAM_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  const next = [...paramDrafts];
                  next[i] = formatParameter(p.value);
                  setParamDrafts(next);
                  commitParam(i, formatParameter(p.value));
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      ))}
      {paramError && (
        <p id="param-error" className="inspector-error" role="alert">
          {paramError}
        </p>
      )}

      {opErrors.length > 0 && (
        <div className="inspector-field">
          <span className="inspector-label">Validation</span>
          <ul className="inspector-errors">
            {opErrors.map((e, i) => (
              <li key={i}>{e.message}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        className="inspector-delete"
        onClick={() => {
          removeOperation(op.id);
          select(null);
        }}
      >
        Delete gate
      </button>
    </aside>
  );
}
