import { WORKED_EXAMPLES, type WorkedExample } from "../../circuit/examples/worked-examples";

interface LabPickerProps {
  onSelect: (example: WorkedExample) => void;
}

export function LabPicker({ onSelect }: LabPickerProps) {
  return (
    <div className="lab-picker-grid">
      {WORKED_EXAMPLES.map((ex) => (
        <button
          key={ex.id}
          type="button"
          className="lab-card"
          onClick={() => onSelect(ex)}
        >
          <span className="lab-card-name">{ex.label}</span>
          <span className="lab-card-desc">{ex.description}</span>
          <span className="lab-card-meta">
            <span className="lab-card-badge">{ex.qubits}q</span>
            <span className="lab-card-badge">{ex.gateCount} gates</span>
          </span>
        </button>
      ))}
    </div>
  );
}
