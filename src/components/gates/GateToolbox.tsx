import { useDraggable } from "@dnd-kit/core";
import { listGatesByCategory } from "../../circuit/gate-registry/registry";
import type { GateDefinition, GateCategory } from "../../circuit/gate-registry/types";
import { GateGlyph } from "./GateGlyph";

const CATEGORY_LABELS: Record<GateCategory, string> = {
  single: "Single Qubit",
  rotation: "Rotation",
  multi: "Multi Qubit",
  measurement: "Measurement",
};

const CATEGORY_ORDER: GateCategory[] = ["single", "rotation", "multi", "measurement"];

interface ToolboxGateProps {
  gate: GateDefinition;
  onAddGate: (gateId: string) => void;
}

function ToolboxGate({ gate, onAddGate }: ToolboxGateProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `toolbox-${gate.id}`,
    data: { type: "new-gate", gateId: gate.id },
  });

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      type="button"
      className={`toolbox-gate${isDragging ? " is-dragging" : ""}`}
      onClick={() => onAddGate(gate.id)}
      aria-label={`Add ${gate.name} gate`}
      title={`${gate.name} — click to add, or drag onto the circuit`}
    >
      <GateGlyph gate={gate} size={36} />
    </button>
  );
}

interface GateToolboxProps {
  onAddGate: (gateId: string) => void;
}

export function GateToolbox({ onAddGate }: GateToolboxProps) {
  return (
    <nav className="gate-toolbox" data-tour="gate-palette" aria-label="Gate toolbox">
      <h2 className="panel-title">Gates</h2>
      {CATEGORY_ORDER.map((category) => (
        <section key={category} className="toolbox-section">
          <h3 className="toolbox-section-title">{CATEGORY_LABELS[category]}</h3>
          <div className="toolbox-grid">
            {listGatesByCategory(category).map((gate) => (
              <ToolboxGate key={gate.id} gate={gate} onAddGate={onAddGate} />
            ))}
          </div>
        </section>
      ))}
      <p className="toolbox-hint">Drag onto the circuit, or click to add.</p>
    </nav>
  );
}
