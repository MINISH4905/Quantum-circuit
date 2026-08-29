import type { BackendSimulationResult } from "../../api/simulation-api";

interface ComparisonColumnProps {
  label: string;
  result: BackendSimulationResult & { timing_ms: number };
}

export function ComparisonColumn({ label, result }: ComparisonColumnProps) {
  const sorted = Object.entries(result.measurementHistogram).sort((a, b) => b[1] - a[1]);
  const totalShots = sorted.reduce((sum, [, count]) => sum + count, 0) || 1;

  return (
    <div className="comparison-column">
      <h3 className="comparison-column-header">{label}</h3>

      <div className="comparison-section">
        <h4>Measurement Histogram</h4>
        <div className="comparison-histogram">
          {sorted.map(([bitstring, count]) => {
            const pct = (count / totalShots) * 100;
            return (
              <div key={bitstring} className="histogram-row">
                <span className="histogram-label">|{bitstring}&#x27E9;</span>
                <div className="histogram-track">
                  <div className="histogram-fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="histogram-value">{pct.toFixed(1)}%</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="comparison-section">
        <h4>Bloch Angles</h4>
        <div className="comparison-bloch-list">
          {result.blochAngles.map((b) => (
            <div key={b.qubit} className="bloch-angle-row">
              <span className="bloch-qubit">q{b.qubit}</span>
              {b.pure ? (
                <span className="bloch-values">
                  &theta;={b.theta?.toFixed(3)} &phi;={b.phi?.toFixed(3)}
                </span>
              ) : (
                <span className="bloch-values is-mixed">mixed (r={b.r.toFixed(3)})</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="comparison-section">
        <h4>Statevector</h4>
        <div className="comparison-statevector">
          {result.statevector.map((amp, i) => {
            const mag = Math.sqrt(amp.real * amp.real + amp.imag * amp.imag);
            if (mag < 1e-6) return null;
            const numQubits = Math.log2(result.statevector.length);
            const bitstring = i.toString(2).padStart(numQubits, "0");
            const sign = amp.imag >= 0 ? "+" : "-";
            return (
              <div key={i} className="sv-row">
                <span className="sv-label">|{bitstring}&#x27E9;</span>
                <span className="sv-value">
                  {amp.real.toFixed(4)} {sign} {Math.abs(amp.imag).toFixed(4)}i
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
