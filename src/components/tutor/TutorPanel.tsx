import { useCircuitStore } from "../../state/circuit-store";
import { useTutorStore } from "../../state/tutor-store";
import { useExpandable } from "../../state/expand-store";
import { ExpandableModule } from "../shared/ExpandableModule";
import { ExpandToggleButton } from "../shared/ExpandToggleButton";

export function TutorPanel() {
  const hasErrors = useCircuitStore((s) => s.errors.length > 0);
  const hasGates = useCircuitStore((s) => s.circuit.operations.length > 0);

  const result = useTutorStore((s) => s.result);
  const error = useTutorStore((s) => s.error);
  const loading = useTutorStore((s) => s.loading);
  const { expanded, toggle, collapse } = useExpandable("ai-tutor");

  return (
    <ExpandableModule
      as="section"
      className="tutor-panel"
      ariaLabel="AI circuit tutor"
      title="AI Tutor"
      expanded={expanded}
      onCollapse={collapse}
    >
      <div className="probabilities-header">
        <h2 className="panel-title" style={{ margin: 0 }}>
          AI Tutor
        </h2>
        <div className="module-header-actions">
          {result && result.source === "deterministic" && (
            <span className="tutor-badge" title="No LLM provider configured on the backend">
              rule-based
            </span>
          )}
          <ExpandToggleButton expanded={expanded} onClick={toggle} label="AI tutor" />
        </div>
      </div>

      <div className="probabilities-body tutor-body">
        {hasErrors && <p className="inspector-empty">Fix circuit validation errors to get tutor feedback.</p>}

        {!hasErrors && !hasGates && !result && (
          <p className="inspector-empty">Add a gate to the circuit to get an explanation, warnings, and tips.</p>
        )}

        {!hasErrors && loading && !result && <p className="inspector-empty">Analyzing circuit…</p>}

        {!hasErrors && error && (
          <p className="sim-fallback-note" role="alert">
            {error}
          </p>
        )}

        {!hasErrors && result && (
          <div className={`tutor-sections${loading ? " is-refreshing" : ""}`}>
            <div className="tutor-section">
              <h3 className="tutor-section-title">🧑‍🏫 Explanation</h3>
              <p className="tutor-section-text">{result.explanation}</p>
            </div>

            <div className={`tutor-section${result.warning.detected ? " is-warning" : ""}`}>
              <h3 className="tutor-section-title">⚠️ Conceptual Warning</h3>
              {result.warning.detected ? (
                <p className="tutor-section-text">{result.warning.message}</p>
              ) : (
                <p className="tutor-section-text tutor-section-muted">No obvious conceptual issues detected.</p>
              )}
            </div>

            <div className="tutor-section">
              <h3 className="tutor-section-title">💡 Optimization</h3>
              <p className="tutor-section-text">{result.optimization}</p>
            </div>
          </div>
        )}
      </div>
    </ExpandableModule>
  );
}
