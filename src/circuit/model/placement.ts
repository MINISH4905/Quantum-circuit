import type { GateDefinition } from "../gate-registry/types";
import type { QuantumCircuit, QuantumOperation } from "./types";
import { findFreeTimeStep } from "./timing";

/**
 * Build a sensible default operation for `gate` anchored at `baseQubit`.
 * Multi-qubit gates place their remaining roles on adjacent qubits, clamped
 * to the circuit's qubit range.
 */
export function buildDefaultOperation(
  gate: GateDefinition,
  baseQubit: number,
  circuit: QuantumCircuit,
  preferredTimeStep?: number
): Omit<QuantumOperation, "id"> {
  const clamp = (q: number) => Math.min(Math.max(q, 0), circuit.qubits - 1);

  let controls: number[] = [];
  let targets: number[] = [];

  if (gate.category === "multi") {
    if (gate.controlCount === 1 && gate.targetCount === 1) {
      const other = baseQubit + 1 < circuit.qubits ? baseQubit + 1 : Math.max(0, baseQubit - 1);
      controls = [clamp(baseQubit)];
      targets = [clamp(other)];
    } else if (gate.targetCount === 2) {
      const other = baseQubit + 1 < circuit.qubits ? baseQubit + 1 : Math.max(0, baseQubit - 1);
      targets = [clamp(baseQubit), clamp(other)];
    }
  } else {
    targets = [clamp(baseQubit)];
  }

  const involvedQubits = [...controls, ...targets];
  const timeStep = findFreeTimeStep(circuit, involvedQubits, preferredTimeStep ?? 0);

  return {
    gate: gate.id,
    controls: controls.length ? controls : undefined,
    targets,
    parameters: gate.parameterCount > 0 ? Array(gate.parameterCount).fill(Math.PI / 2) : undefined,
    timeStep,
  };
}
