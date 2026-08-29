import { useDraggable } from "@dnd-kit/core";
import type { QuantumOperation } from "../../circuit/model/types";
import type { GateDefinition } from "../../circuit/gate-registry/types";
import { GateGlyph } from "../gates/GateGlyph";
import { ROW_HEIGHT, COL_WIDTH } from "./layout";
import { formatParameter } from "../../circuit/model/parameter-expr";

interface PlacedGateProps {
  op: QuantumOperation;
  gate: GateDefinition;
  selected: boolean;
  invalid: boolean;
  onSelect: (id: string) => void;
}

export function PlacedGate({ op, gate, selected, invalid, onSelect }: PlacedGateProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `op-${op.id}`,
    data: { type: "move-gate", operationId: op.id },
  });

  const controls = op.controls ?? [];
  const targets = op.targets;
  const allQubits = [...controls, ...targets];
  const minQ = Math.min(...allQubits);
  const maxQ = Math.max(...allQubits);
  const x = op.timeStep * COL_WIDTH + COL_WIDTH / 2;

  const style: React.CSSProperties = {
    position: "absolute",
    left: x,
    top: minQ * ROW_HEIGHT + ROW_HEIGHT / 2,
    height: (maxQ - minQ) * ROW_HEIGHT,
    width: 0,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : selected ? 5 : 1,
  };

  const label = gate.parameterCount > 0 && op.parameters?.length
    ? `${gate.name}(${op.parameters.map(formatParameter).join(", ")})`
    : gate.name;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`placed-gate${selected ? " is-selected" : ""}${invalid ? " is-invalid" : ""}`}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(op.id);
      }}
      role="button"
      tabIndex={0}
      aria-label={`${label} on qubit${allQubits.length > 1 ? "s" : ""} ${allQubits.join(", ")}, step ${op.timeStep}${invalid ? ", invalid" : ""}`}
      aria-pressed={selected}
    >
      {allQubits.length > 1 && (
        <span className="gate-connector" style={{ position: "absolute", left: -1, top: 0, width: 2, height: "100%" }} />
      )}
      {controls.map((q) => (
        <span key={`c${q}`} style={{ position: "absolute", left: 0, top: (q - minQ) * ROW_HEIGHT, transform: "translate(-50%, -50%)" }}>
          <GateGlyph gate={gate} role="control" selected={selected} title={label} />
        </span>
      ))}
      {targets.map((q) => (
        <span key={`t${q}`} style={{ position: "absolute", left: 0, top: (q - minQ) * ROW_HEIGHT, transform: "translate(-50%, -50%)" }}>
          <GateGlyph gate={gate} role="target" selected={selected} title={label} />
        </span>
      ))}
    </div>
  );
}
