import { useState } from "react";
import { useCircuitStore } from "../../state/circuit-store";
import { useTutorStore } from "../../state/tutor-store";

type TutorTab = "explain" | "steps" | "gates";

export function TutorPanel() {
  const hasErrors = useCircuitStore((s) => s.errors.length > 0);
  const hasGates = useCircuitStore((s) => s.circuit.operations.length > 0);

  const result = useTutorStore((s) => s.result);
  const error = useTutorStore((s) => s.error);
  const loading = useTutorStore((s) => s.loading);

  const [activeTab, setActiveTab] = useState<TutorTab>("explain");

  return (
    <section className="tutor-panel" id="wt-ai-tutor" aria-label="AI circuit tutor">
      <div className="probabilities-header">
        <h2 className="panel-title" style={{ margin: 0 }}>
          AI Tutor
        </h2>
        {result && (
          <span
            className={`tutor-badge${result.source === "deterministic" ? " is-deterministic" : ""}`}
            title={result.source === "deterministic" ? "No LLM configured — showing rule-based analysis" : "Powered by Groq (Llama 3.3 70B)"}
          >
            {result.source === "deterministic" ? "rule-based" : "AI"}
          </span>
        )}
      </div>

      <div className="probabilities-body tutor-body">
        {hasErrors && <p className="inspector-empty">Fix circuit validation errors to get tutor feedback.</p>}

        {!hasErrors && !hasGates && !result && (
          <p className="inspector-empty">Add a gate to the circuit to get an explanation, warnings, and tips.</p>
        )}

        {!hasErrors && loading && !result && <p className="inspector-empty">Analyzing circuit...</p>}

        {!hasErrors && error && (
          <p className="sim-fallback-note" role="alert">
            {error}
          </p>
        )}

        {!hasErrors && result && (
          <div className={`tutor-sections${loading ? " is-refreshing" : ""}`}>
            {/* Algorithm detection banner */}
            {result.algorithm && !result.algorithm.startsWith("Custom") && (
              <div className="tutor-algorithm-banner">
                <span className="tutor-algorithm-icon">&#x1F9EC;</span>
                <span>{result.algorithm}</span>
              </div>
            )}

            {/* Tab navigation */}
            <div className="tutor-tabs" role="tablist">
              <button
                className={`tutor-tab${activeTab === "explain" ? " is-active" : ""}`}
                role="tab"
                aria-selected={activeTab === "explain"}
                onClick={() => setActiveTab("explain")}
              >
                Explanation
              </button>
              <button
                className={`tutor-tab${activeTab === "steps" ? " is-active" : ""}`}
                role="tab"
                aria-selected={activeTab === "steps"}
                onClick={() => setActiveTab("steps")}
              >
                Steps ({result.steps?.length ?? 0})
              </button>
              <button
                className={`tutor-tab${activeTab === "gates" ? " is-active" : ""}`}
                role="tab"
                aria-selected={activeTab === "gates"}
                onClick={() => setActiveTab("gates")}
              >
                Gate Defs ({result.gateDefinitions?.length ?? 0})
              </button>
            </div>

            {/* Explanation tab */}
            {activeTab === "explain" && (
              <>
                <div className="tutor-section">
                  <p className="tutor-section-text">{result.explanation}</p>
                </div>

                <div className={`tutor-section${result.warning.detected ? " is-warning" : ""}`}>
                  <h3 className="tutor-section-title">Conceptual Warning</h3>
                  {result.warning.detected ? (
                    <p className="tutor-section-text">{result.warning.message}</p>
                  ) : (
                    <p className="tutor-section-text tutor-section-muted">No conceptual issues detected.</p>
                  )}
                </div>

                <div className="tutor-section">
                  <h3 className="tutor-section-title">Optimization</h3>
                  <p className="tutor-section-text">{result.optimization}</p>
                </div>
              </>
            )}

            {/* Steps tab */}
            {activeTab === "steps" && (
              <div className="tutor-steps">
                {result.steps && result.steps.length > 0 ? (
                  result.steps.map((s) => (
                    <div key={s.step} className="tutor-step-card">
                      <div className="tutor-step-header">
                        <span className="tutor-step-number">{s.step}</span>
                        <span className="tutor-step-gate">{s.gate}</span>
                        <span className="tutor-step-qubits">{s.qubits}</span>
                      </div>
                      <p className="tutor-step-action">{s.action}</p>
                      <p className="tutor-step-state">
                        State: <code>{s.stateAfter}</code>
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="tutor-section-muted">No steps to display.</p>
                )}
              </div>
            )}

            {/* Gate definitions tab */}
            {activeTab === "gates" && (
              <div className="tutor-gate-defs">
                {result.gateDefinitions && result.gateDefinitions.length > 0 ? (
                  result.gateDefinitions.map((g) => (
                    <div key={g.gate} className="tutor-gate-card">
                      <h4 className="tutor-gate-name">{g.gate}</h4>
                      <p className="tutor-gate-def">{g.definition}</p>
                      {g.matrix && (
                        <code className="tutor-gate-matrix">{g.matrix}</code>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="tutor-section-muted">No gate definitions to display.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
