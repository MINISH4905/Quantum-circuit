import { useSimulationStore } from "../../state/simulation-store";
import { AgreementBanner } from "./AgreementBanner";
import { ComparisonColumn } from "./ComparisonColumn";
import { TimingBar } from "./TimingBar";

const BACKEND_ORDER = ["qiskit", "cirq", "pennylane"] as const;
const BACKEND_LABELS: Record<string, string> = {
  qiskit: "Qiskit Aer",
  cirq: "Cirq",
  pennylane: "PennyLane",
};

export function ComparisonDashboard() {
  const results = useSimulationStore((s) => s.compareResults);
  const agreement = useSimulationStore((s) => s.compareAgreement);
  const error = useSimulationStore((s) => s.compareError);
  const loading = useSimulationStore((s) => s.compareLoading);

  if (error) {
    return (
      <div className="comparison-dashboard">
        <div className="comparison-error">{error}</div>
      </div>
    );
  }

  const timings: Record<string, number> = {};
  if (results) {
    for (const key of BACKEND_ORDER) {
      if (results[key]) timings[key] = results[key].timing_ms;
    }
  }

  return (
    <div className="comparison-dashboard">
      <AgreementBanner agreement={agreement} loading={loading} />
      {results && Object.keys(timings).length > 0 && <TimingBar timings={timings} />}
      {results && (
        <div className="comparison-columns">
          {BACKEND_ORDER.map((key) =>
            results[key] ? (
              <ComparisonColumn key={key} label={BACKEND_LABELS[key]} result={results[key]} />
            ) : null
          )}
        </div>
      )}
      {!results && !loading && (
        <div className="comparison-empty">Build a circuit and results will appear here.</div>
      )}
    </div>
  );
}
