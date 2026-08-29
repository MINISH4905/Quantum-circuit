interface TimingBarProps {
  timings: Record<string, number>;
}

const BACKEND_LABELS: Record<string, string> = {
  qiskit: "Qiskit Aer",
  cirq: "Cirq",
  pennylane: "PennyLane",
};

const BACKEND_COLORS: Record<string, string> = {
  qiskit: "var(--timing-qiskit)",
  cirq: "var(--timing-cirq)",
  pennylane: "var(--timing-pennylane)",
};

export function TimingBar({ timings }: TimingBarProps) {
  const maxTime = Math.max(...Object.values(timings), 1);

  return (
    <div className="timing-bar">
      <h4 className="timing-bar-title">Execution Time</h4>
      {Object.entries(timings).map(([key, ms]) => (
        <div key={key} className="timing-bar-row">
          <span className="timing-bar-label">{BACKEND_LABELS[key] ?? key}</span>
          <div className="timing-bar-track">
            <div
              className="timing-bar-fill"
              style={{
                width: `${(ms / maxTime) * 100}%`,
                backgroundColor: BACKEND_COLORS[key] ?? "var(--accent)",
              }}
            />
          </div>
          <span className="timing-bar-value">{ms.toFixed(1)}ms</span>
        </div>
      ))}
    </div>
  );
}
