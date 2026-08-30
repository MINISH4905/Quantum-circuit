import type { QuantumCircuit, QuantumOperation } from "../model/types";
import { createEmptyCircuit } from "../model/types";
import { generateOperationId } from "../model/id";
import { parseParameterExpression } from "../model/parameter-expr";
import { getGateByPennylaneName, SUPPORTED_PENNYLANE_GATE_NAMES } from "../gate-registry/registry";

export interface ParseError {
  line: number;
  message: string;
}

export interface ParseResult {
  circuit: QuantumCircuit | null;
  errors: ParseError[];
}

const BLANK_OR_COMMENT = /^\s*(#.*)?$/;
const IMPORT_LINE = /^\s*(import\s+pennylane\s+as\s+qml|from\s+pennylane\s+import\s+numpy\s+as\s+np|import\s+numpy(\s+as\s+np)?)\s*$/;
const DEVICE_LINE = /^\s*dev\s*=\s*qml\.device\s*\(\s*"default\.qubit"\s*,\s*wires\s*=\s*(\d+)\s*\)\s*$/;
const QNODE_LINE = /^\s*@qml\.qnode\s*\(\s*dev\s*\)\s*$/;
const DEF_LINE = /^\s*def\s+circuit\s*\(\s*\)\s*:\s*$/;
const RETURN_LINE = /^\s*return\s+/;
const RESULT_LINE = /^\s*(result|print)\b/;
const PASS_LINE = /^\s*pass\s*$/;

const GATE_WIRES_LIST = /^\s*qml\.(\w+)\s*\(\s*wires\s*=\s*\[\s*(\d+)\s*,\s*(\d+)\s*\]\s*\)\s*$/;
const GATE_WIRES_SINGLE = /^\s*qml\.(\w+)\s*\(\s*wires\s*=\s*(\d+)\s*\)\s*$/;
const GATE_PARAM_WIRES = /^\s*qml\.(\w+)\s*\(\s*([^,]+)\s*,\s*wires\s*=\s*(\d+)\s*\)\s*$/;
const MEASURE_CALL = /^\s*qml\.measure\s*\(\s*wires\s*=\s*(\d+)\s*\)\s*$/;

export function parsePennylaneCode(source: string): ParseResult {
  const errors: ParseError[] = [];
  let numWires: number | null = null;
  const operations: QuantumOperation[] = [];

  const lines = source.split(/\r?\n/);

  lines.forEach((rawLine, idx) => {
    const lineNumber = idx + 1;

    if (BLANK_OR_COMMENT.test(rawLine)) return;
    if (IMPORT_LINE.test(rawLine)) return;
    if (QNODE_LINE.test(rawLine)) return;
    if (RETURN_LINE.test(rawLine)) return;
    if (RESULT_LINE.test(rawLine)) return;
    if (PASS_LINE.test(rawLine)) return;

    if (DEF_LINE.test(rawLine)) {
      return;
    }

    const deviceMatch = DEVICE_LINE.exec(rawLine);
    if (deviceMatch) {
      if (numWires !== null) {
        errors.push({ line: lineNumber, message: "Device already declared" });
        return;
      }
      numWires = Number(deviceMatch[1]);
      if (numWires < 1) {
        errors.push({ line: lineNumber, message: `Invalid wire count: ${deviceMatch[1]}` });
        numWires = null;
      }
      return;
    }

    const measureMatch = MEASURE_CALL.exec(rawLine);
    if (measureMatch) {
      const qubit = Number(measureMatch[1]);
      operations.push({
        id: generateOperationId("pop"),
        gate: "measure",
        targets: [qubit],
        timeStep: 0,
      });
      return;
    }

    let m = GATE_PARAM_WIRES.exec(rawLine);
    if (m) {
      const gateName = m[1];
      const paramRaw = m[2].trim();
      const qubit = Number(m[3]);
      const gate = getGateByPennylaneName(gateName);
      if (!gate) {
        errors.push({
          line: lineNumber,
          message: `Unsupported PennyLane gate: qml.${gateName}\n\nSupported gates: ${SUPPORTED_PENNYLANE_GATE_NAMES}`,
        });
        return;
      }
      const value = parseParameterExpression(paramRaw);
      if (value === null) {
        errors.push({ line: lineNumber, message: `Invalid parameter expression: "${paramRaw}"` });
        return;
      }
      operations.push({
        id: generateOperationId("pop"),
        gate: gate.id,
        targets: [qubit],
        parameters: [value],
        timeStep: 0,
      });
      return;
    }

    m = GATE_WIRES_LIST.exec(rawLine);
    if (m) {
      const gateName = m[1];
      const q0 = Number(m[2]);
      const q1 = Number(m[3]);
      const gate = getGateByPennylaneName(gateName);
      if (!gate) {
        errors.push({
          line: lineNumber,
          message: `Unsupported PennyLane gate: qml.${gateName}\n\nSupported gates: ${SUPPORTED_PENNYLANE_GATE_NAMES}`,
        });
        return;
      }
      const controls: number[] = [];
      const targets: number[] = [];
      if (gate.controlCount > 0) {
        controls.push(q0);
        targets.push(q1);
      } else {
        targets.push(q0, q1);
      }
      operations.push({
        id: generateOperationId("pop"),
        gate: gate.id,
        controls: controls.length ? controls : undefined,
        targets,
        timeStep: 0,
      });
      return;
    }

    m = GATE_WIRES_SINGLE.exec(rawLine);
    if (m) {
      const gateName = m[1];
      const qubit = Number(m[2]);
      const gate = getGateByPennylaneName(gateName);
      if (!gate) {
        errors.push({
          line: lineNumber,
          message: `Unsupported PennyLane gate: qml.${gateName}\n\nSupported gates: ${SUPPORTED_PENNYLANE_GATE_NAMES}`,
        });
        return;
      }
      operations.push({
        id: generateOperationId("pop"),
        gate: gate.id,
        targets: [qubit],
        timeStep: 0,
      });
      return;
    }

    errors.push({ line: lineNumber, message: `Unrecognized PennyLane syntax: "${rawLine.trim()}"` });
  });

  if (numWires === null) {
    if (errors.length === 0) {
      errors.push({ line: 1, message: 'No device declaration found. Expected: dev = qml.device("default.qubit", wires=N)' });
    }
    return { circuit: null, errors };
  }

  if (errors.length > 0) {
    return { circuit: null, errors };
  }

  assignTimeSteps(operations);
  const measuredQubits = operations.filter((op) => op.gate === "measure").map((op) => op.targets[0]);
  const classicalBits = measuredQubits.length;
  const circuit = createEmptyCircuit(numWires, classicalBits);
  circuit.operations = operations;

  return { circuit, errors: [] };
}

function assignTimeSteps(operations: QuantumOperation[]): void {
  const lastStepPerQubit = new Map<number, number>();
  for (const op of operations) {
    const qubits = [...(op.controls ?? []), ...op.targets];
    const earliest = qubits.reduce((max, q) => Math.max(max, (lastStepPerQubit.get(q) ?? -1) + 1), 0);
    op.timeStep = earliest;
    for (const q of qubits) lastStepPerQubit.set(q, earliest);
  }
}
