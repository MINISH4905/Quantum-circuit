import type { QuantumCircuit, QuantumOperation } from "../model/types";
import { getGate } from "../gate-registry/registry";
import { formatParameter } from "../model/parameter-expr";
import { orderedOperations, groupByTimeStep } from "./utils";

function operationExpr(op: QuantumOperation): string | null {
  const gate = getGate(op.gate);
  if (!gate || !gate.cirqName) return null;

  if (gate.writesClassicalBit) {
    return `cirq.measure(q[${op.targets[0]}], key='q${op.targets[0]}')`;
  }

  if (gate.parameterCount > 0) {
    const param = formatParameter(op.parameters![0]);
    return `cirq.${gate.cirqName}(rads=${param})(q[${op.targets[0]}])`;
  }

  if (gate.controlCount > 0) {
    const control = op.controls![0];
    const target = op.targets[0];
    return `cirq.${gate.cirqName}(q[${control}], q[${target}])`;
  }

  if (gate.targetCount === 2) {
    return `cirq.${gate.cirqName}(q[${op.targets[0]}], q[${op.targets[1]}])`;
  }

  return `cirq.${gate.cirqName}(q[${op.targets[0]}])`;
}

export function generateCirqCode(circuit: QuantumCircuit): string {
  const ops = orderedOperations(circuit);
  const needsPi = ops.some((op) => (op.parameters?.length ?? 0) > 0);
  const groups = groupByTimeStep(ops);

  const lines: string[] = ["import cirq"];
  if (needsPi) lines.push("import numpy as np");
  lines.push("");
  lines.push(`q = cirq.LineQubit.range(${circuit.qubits})`);
  lines.push("");
  lines.push("circuit = cirq.Circuit()");

  for (const [, stepOps] of groups) {
    const exprs: string[] = [];
    for (const op of stepOps) {
      const expr = operationExpr(op);
      if (expr) exprs.push(expr);
    }
    if (exprs.length === 1) {
      lines.push(`circuit.append(${exprs[0]})`);
    } else if (exprs.length > 1) {
      lines.push("circuit.append([");
      for (const expr of exprs) {
        lines.push(`    ${expr},`);
      }
      lines.push("])");
    }
  }

  lines.push("");
  lines.push("# Simulate");
  lines.push("simulator = cirq.Simulator()");
  lines.push("result = simulator.simulate(circuit)");
  lines.push("print(result.final_state_vector)");

  return lines.join("\n") + "\n";
}
