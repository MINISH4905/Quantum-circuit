import { TUTORIALS, type TutorialDef } from "../../circuit/examples/tutorials";

interface TutorialPickerProps {
  onSelect: (tutorial: TutorialDef) => void;
}

export function TutorialPicker({ onSelect }: TutorialPickerProps) {
  return (
    <div className="tutorial-picker-list">
      {TUTORIALS.map((tut) => (
        <button
          key={tut.id}
          type="button"
          className="tutorial-picker-card"
          onClick={() => onSelect(tut)}
        >
          <span className="tutorial-picker-name">{tut.title}</span>
          <span className="tutorial-picker-desc">{tut.description}</span>
          <span className="lab-card-meta">
            <span className="lab-card-badge">{tut.steps.length} steps</span>
            <span className="lab-card-badge">{tut.qubits}q</span>
          </span>
        </button>
      ))}
    </div>
  );
}
