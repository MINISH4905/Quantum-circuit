import type { QuantumCircuit, QuantumOperation } from "../model/types";
import { getGate } from "../gate-registry/registry";

export interface ValidationError {
  operationId?: string;
  message: string;
}

export function validateOperation(
  op: QuantumOperation,
  circuit: Pick<QuantumCircuit, "qubits" | "classicalBits">
): ValidationError[] {
  const errors: ValidationError[] = [];
  const gate = getGate(op.gate);

  if (!gate) {
    errors.push({ operationId: op.id, message: `Unknown gate: ${op.gate}` });
    return errors;
  }

  const controls = op.controls ?? [];
  const targets = op.targets ?? [];

  if (controls.length !== gate.controlCount) {
    errors.push({
      operationId: op.id,
      message: `${gate.name} requires ${gate.controlCount} control qubit(s), got ${controls.length}`,
    });
  }

  if (targets.length !== gate.targetCount) {
    errors.push({
      operationId: op.id,
      message: `${gate.name} requires ${gate.targetCount} target qubit(s), got ${targets.length}`,
    });
  }

  for (const q of [...controls, ...targets]) {
    if (!Number.isInteger(q) || q < 0 || q >= circuit.qubits) {
      errors.push({
        operationId: op.id,
        message: `Invalid qubit index ${q}: circuit has ${circuit.qubits} qubit(s)`,
      });
    }
  }

  const allQubits = [...controls, ...targets];
  const uniqueQubits = new Set(allQubits);
  if (uniqueQubits.size !== allQubits.length) {
    errors.push({
      operationId: op.id,
      message: `${gate.name} cannot use the same qubit as both control and target`,
    });
  }

  const paramCount = op.parameters?.length ?? 0;
  if (paramCount !== gate.parameterCount) {
    errors.push({
      operationId: op.id,
      message: `${gate.name} requires ${gate.parameterCount} parameter(s), got ${paramCount}`,
    });
  }

  if (op.parameters) {
    for (const p of op.parameters) {
      if (!Number.isFinite(p)) {
        errors.push({ operationId: op.id, message: `${gate.name} has a non-finite parameter value` });
      }
    }
  }

  if (gate.writesClassicalBit) {
    // Measurement targets a classical bit with the same index as the target qubit by convention;
    // callers may override via a dedicated field in later phases.
    const target = targets[0];
    if (target !== undefined && target >= circuit.classicalBits) {
      errors.push({
        operationId: op.id,
        message: `Measure target qubit ${target} has no matching classical bit (classicalBits=${circuit.classicalBits})`,
      });
    }
  }

  return errors;
}

export function validateCircuit(circuit: QuantumCircuit): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!Number.isInteger(circuit.qubits) || circuit.qubits < 1) {
    errors.push({ message: "Circuit must have at least 1 qubit" });
  }
  if (!Number.isInteger(circuit.classicalBits) || circuit.classicalBits < 0) {
    errors.push({ message: "classicalBits must be a non-negative integer" });
  }

  for (const op of circuit.operations) {
    errors.push(...validateOperation(op, circuit));
  }

  return errors;
}

export function isCircuitValid(circuit: QuantumCircuit): boolean {
  return validateCircuit(circuit).length === 0;
}
