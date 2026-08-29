import type { GateDefinition } from "../../circuit/gate-registry/types";
import { GATE_SIZE } from "../circuit/layout";

interface GateGlyphProps {
  gate: GateDefinition;
  /** Role this glyph plays when part of a multi-qubit operation. */
  role?: "control" | "target";
  selected?: boolean;
  size?: number;
  title?: string;
}

/** Visual marker for a single qubit-row endpoint of a gate. */
export function GateGlyph({ gate, role, selected, size = GATE_SIZE, title }: GateGlyphProps) {
  if (gate.category === "multi") {
    if (role === "control") {
      return (
        <span
          className={`gate-marker gate-marker-dot${selected ? " is-selected" : ""}`}
          style={{ width: size * 0.3, height: size * 0.3 }}
          title={title ?? `${gate.name} control`}
          aria-hidden="true"
        />
      );
    }
    if (gate.id === "cx" && role === "target") {
      return (
        <span
          className={`gate-marker gate-marker-cx-target${selected ? " is-selected" : ""}`}
          style={{ width: size, height: size }}
          title={title ?? `${gate.name} target`}
          aria-hidden="true"
        >
          <span className="cx-plus">+</span>
        </span>
      );
    }
    if (gate.id === "cz" && role === "target") {
      return (
        <span
          className={`gate-marker gate-marker-dot${selected ? " is-selected" : ""}`}
          style={{ width: size * 0.3, height: size * 0.3 }}
          title={title ?? `${gate.name} target`}
          aria-hidden="true"
        />
      );
    }
    if (gate.id === "swap") {
      return (
        <span
          className={`gate-marker gate-marker-cross${selected ? " is-selected" : ""}`}
          style={{ width: size, height: size }}
          title={title ?? `${gate.name} target`}
          aria-hidden="true"
        >
          ×
        </span>
      );
    }
  }

  return (
    <span
      className={`gate-marker gate-marker-box gate-cat-${gate.category}${selected ? " is-selected" : ""}`}
      style={{ width: size, height: size }}
      title={title ?? gate.name}
      aria-hidden="true"
    >
      {gate.symbol}
    </span>
  );
}
