import type { QuantumCircuit, QuantumOperation } from "../model/types";
import { getGate } from "../gate-registry/registry";
import { formatParameter } from "../model/parameter-expr";
import { orderedOperations } from "./utils";

function operationLine(op: QuantumOperation): string | null {
  const gate = getGate(op.gate);
  if (!gate || !gate.pennylaneName) return null;

  if (gate.writesClassicalBit) {
    return `    qml.measure(wires=${op.targets[0]})`;
  }

  if (gate.parameterCount > 0) {
    const param = formatParameter(op.parameters![0]);
    return `    qml.${gate.pennylaneName}(${param}, wires=${op.targets[0]})`;
  }

  if (gate.controlCount > 0) {
    const control = op.controls![0];
    const target = op.targets[0];
    return `    qml.${gate.pennylaneName}(wires=[${control}, ${target}])`;
  }

  if (gate.targetCount === 2) {
    return `    qml.${gate.pennylaneName}(wires=[${op.targets[0]}, ${op.targets[1]}])`;
  }

  return `    qml.${gate.pennylaneName}(wires=${op.targets[0]})`;
}

export function generatePennylaneCode(circuit: QuantumCircuit): string {
  const ops = orderedOperations(circuit);
  const needsPi = ops.some((op) => (op.parameters?.length ?? 0) > 0);
  const hasMeasure = ops.some((op) => op.gate === "measure");

  const lines: string[] = ["import pennylane as qml"];
  if (needsPi) lines.push("import numpy as np");
  lines.push("");
  lines.push(`dev = qml.device("default.qubit", wires=${circuit.qubits})`);
  lines.push("");
  lines.push("@qml.qnode(dev)");
  lines.push("def circuit():");

  if (ops.length === 0) {
    lines.push("    pass");
  } else {
    for (const op of ops) {
      if (op.gate === "measure") continue;
      const line = operationLine(op);
      if (line) lines.push(line);
    }
    if (hasMeasure) {
      const measuredQubits = ops.filter((op) => op.gate === "measure").map((op) => op.targets[0]);
      lines.push(`    return qml.probs(wires=[${measuredQubits.join(", ")}])`);
    } else {
      lines.push(`    return qml.state()`);
    }
  }

  lines.push("");
  lines.push("# Execute");
  lines.push("result = circuit()");
  lines.push("print(result)");

  return lines.join("\n") + "\n";
}
