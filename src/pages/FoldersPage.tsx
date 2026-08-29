import { useNavigate } from "react-router-dom";
import "./PageHeader.css";
import "./FoldersPage.css";
import { useCircuitStore } from "../state/circuit-store";
import { useUiStore } from "../state/ui-store";
import { useSavedCircuitsStore } from "../state/saved-circuits-store";
import type { QuantumCircuit } from "../circuit/model/types";
import { WORKED_EXAMPLES } from "../circuit/examples/worked-examples";

const ACCENT_COUNT = 6;

function summarizeCircuit(circuit: QuantumCircuit): string {
  const qubits = `${circuit.qubits} qubit${circuit.qubits === 1 ? "" : "s"}`;
  const gates = `${circuit.operations.length} gate${circuit.operations.length === 1 ? "" : "s"}`;
  return `${qubits} · ${gates}`;
}

export function FoldersPage() {
  const navigate = useNavigate();
  const setCircuit = useCircuitStore((s) => s.setCircuit);
  const setCircuitName = useCircuitStore((s) => s.setName);
  const select = useUiStore((s) => s.select);
  const savedCircuits = useSavedCircuitsStore((s) => s.savedCircuits);
  const deleteCircuit = useSavedCircuitsStore((s) => s.deleteCircuit);

  const openInEditor = (circuit: QuantumCircuit, name: string) => {
    setCircuit(circuit);
    setCircuitName(name);
    select(null);
    navigate("/dashboard");
  };

  return (
    <div className="folders-page">
      <header className="page-nav">
        <span className="page-brand">Quantum Circuit Lab</span>
        <button type="button" className="page-home-btn" onClick={() => navigate("/")}>
          ← Home
        </button>
      </header>

      <div className="page-intro">
        <p className="page-eyebrow">Folders</p>
        <h1 className="page-title">Your circuits, ready to reopen</h1>
        <p className="page-subtitle">
          Every circuit you save from the editor lands here, alongside ready-made worked examples. Click a card to
          open it in the Circuit Editor.
        </p>
      </div>

      <section className="folders-grid" aria-label="Saved circuits and worked examples">
        {savedCircuits.map((saved, i) => (
          <article className={`folder-card folder-card-c${(i % ACCENT_COUNT) + 1}`} key={saved.id}>
            <button
              type="button"
              className="folder-card-delete"
              onClick={() => deleteCircuit(saved.id)}
              aria-label={`Delete ${saved.name}`}
              title="Delete"
            >
              ×
            </button>
            <button type="button" className="folder-card-open" onClick={() => openInEditor(saved.circuit, saved.name)}>
              <span className="folder-card-badge">Saved</span>
              <h3 className="folder-card-title">{saved.name}</h3>
              <p className="folder-card-desc">{summarizeCircuit(saved.circuit)}</p>
              <span className="folder-card-meta">{new Date(saved.savedAt).toLocaleString()}</span>
            </button>
          </article>
        ))}

        {WORKED_EXAMPLES.map((example, i) => (
          <article
            className={`folder-card folder-card-c${((savedCircuits.length + i) % ACCENT_COUNT) + 1}`}
            key={example.id}
          >
            <button type="button" className="folder-card-open" onClick={() => openInEditor(example.build(), example.label)}>
              <span className="folder-card-badge folder-card-badge-example">Example</span>
              <h3 className="folder-card-title">{example.label}</h3>
              <p className="folder-card-desc">{example.description}</p>
            </button>
          </article>
        ))}

        {savedCircuits.length === 0 && (
          <p className="folders-empty-hint">
            Nothing saved yet — open the Circuit Editor, build something, and use Save file. It'll show up here.
          </p>
        )}
      </section>
    </div>
  );
}
