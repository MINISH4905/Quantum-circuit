import type { QuantumCircuit, QuantumOperation } from "../model/types";
import { createEmptyCircuit } from "../model/types";
import { generateOperationId } from "../model/id";
import { parseParameterExpression } from "../model/parameter-expr";
import { getGateByCirqName, SUPPORTED_CIRQ_GATE_NAMES } from "../gate-registry/registry";

export interface ParseError {
  line: number;
  message: string;
}

export interface ParseResult {
  circuit: QuantumCircuit | null;
  errors: ParseError[];
}

const BLANK_OR_COMMENT = /^\s*(#.*)?$/;
const IMPORT_LINE = /^\s*(import\s+cirq|import\s+numpy(\s+as\s+np)?|from\s+math\s+import\s+pi)\s*$/;
const QUBIT_LINE = /^\s*q\s*=\s*cirq\.LineQubit\.range\s*\(\s*(\d+)\s*\)\s*$/;
const CIRCUIT_CTOR = /^\s*circuit\s*=\s*cirq\.Circuit\s*\(\s*\)\s*$/;
const SIMULATOR_LINE = /^\s*(simulator|result|print)\b/;

const APPEND_ROTATION = /^\s*circuit\.append\s*\(\s*cirq\.(\w+)\s*\(\s*(?:rads\s*=\s*)?([^)]+)\)\s*\(\s*q\s*\[\s*(\d+)\s*\]\s*\)\s*\)\s*$/;
const APPEND_MEASURE = /^\s*circuit\.append\s*\(\s*cirq\.measure\s*\(\s*q\s*\[\s*(\d+)\s*\]\s*(?:,\s*key\s*=\s*['"][^'"]*['"]\s*)?\)\s*\)\s*$/;
const APPEND_TWO_QUBIT = /^\s*circuit\.append\s*\(\s*cirq\.(\w+)\s*\(\s*q\s*\[\s*(\d+)\s*\]\s*,\s*q\s*\[\s*(\d+)\s*\]\s*\)\s*\)\s*$/;
const APPEND_SINGLE = /^\s*circuit\.append\s*\(\s*cirq\.(\w+)\s*\(\s*q\s*\[\s*(\d+)\s*\]\s*\)\s*\)\s*$/;

const APPEND_LIST_START = /^\s*circuit\.append\s*\(\s*\[\s*$/;
const APPEND_LIST_END = /^\s*\]\s*\)\s*$/;

const LIST_ROTATION = /^\s*cirq\.(\w+)\s*\(\s*(?:rads\s*=\s*)?([^)]+)\)\s*\(\s*q\s*\[\s*(\d+)\s*\]\s*\)\s*,?\s*$/;
const LIST_MEASURE = /^\s*cirq\.measure\s*\(\s*q\s*\[\s*(\d+)\s*\]\s*(?:,\s*key\s*=\s*['"][^'"]*['"]\s*)?\)\s*,?\s*$/;
const LIST_TWO_QUBIT = /^\s*cirq\.(\w+)\s*\(\s*q\s*\[\s*(\d+)\s*\]\s*,\s*q\s*\[\s*(\d+)\s*\]\s*\)\s*,?\s*$/;
const LIST_SINGLE = /^\s*cirq\.(\w+)\s*\(\s*q\s*\[\s*(\d+)\s*\]\s*\)\s*,?\s*$/;

function parseGateCall(
  gateName: string,
  args: { qubitA: number; qubitB?: number; param?: string },
  lineNumber: number,
  operations: QuantumOperation[],
  errors: ParseError[],
): void {
  const gate = getGateByCirqName(gateName);
  if (!gate) {
    errors.push({
      line: lineNumber,
      message: `Unsupported Cirq gate: cirq.${gateName}\n\nSupported gates: ${SUPPORTED_CIRQ_GATE_NAMES}`,
    });
    return;
  }

  const parameters: number[] = [];
  if (args.param !== undefined) {
    const value = parseParameterExpression(args.param);
    if (value === null) {
      errors.push({ line: lineNumber, message: `Invalid parameter expression: "${args.param}"` });
      return;
    }
    parameters.push(value);
  }

  const controls: number[] = [];
  const targets: number[] = [];

  if (gate.controlCount > 0 && args.qubitB !== undefined) {
    controls.push(args.qubitA);
    targets.push(args.qubitB);
  } else if (gate.targetCount === 2 && args.qubitB !== undefined) {
    targets.push(args.qubitA, args.qubitB);
  } else {
    targets.push(args.qubitA);
  }

  operations.push({
    id: generateOperationId("cop"),
    gate: gate.id,
    controls: controls.length ? controls : undefined,
    targets,
    parameters: parameters.length ? parameters : undefined,
    timeStep: 0,
  });
}

function tryParseGateFromLine(
  line: string,
  lineNumber: number,
  operations: QuantumOperation[],
  errors: ParseError[],
  isListContext: boolean,
): boolean {
  const rotationRe = isListContext ? LIST_ROTATION : APPEND_ROTATION;
  const measureRe = isListContext ? LIST_MEASURE : APPEND_MEASURE;
  const twoQubitRe = isListContext ? LIST_TWO_QUBIT : APPEND_TWO_QUBIT;
  const singleRe = isListContext ? LIST_SINGLE : APPEND_SINGLE;

  let m = rotationRe.exec(line);
  if (m) {
    parseGateCall(m[1], { qubitA: Number(m[3]), param: m[2].trim() }, lineNumber, operations, errors);
    return true;
  }

  m = measureRe.exec(line);
  if (m) {
    const qubit = Number(m[1]);
    operations.push({
      id: generateOperationId("cop"),
      gate: "measure",
      targets: [qubit],
      timeStep: 0,
    });
    return true;
  }

  m = twoQubitRe.exec(line);
  if (m) {
    parseGateCall(m[1], { qubitA: Number(m[2]), qubitB: Number(m[3]) }, lineNumber, operations, errors);
    return true;
  }

  m = singleRe.exec(line);
  if (m) {
    parseGateCall(m[1], { qubitA: Number(m[2]) }, lineNumber, operations, errors);
    return true;
  }

  return false;
}

export function parseCirqCode(source: string): ParseResult {
  const errors: ParseError[] = [];
  let numQubits: number | null = null;
  const operations: QuantumOperation[] = [];
  let inList = false;

  const lines = source.split(/\r?\n/);

  lines.forEach((rawLine, idx) => {
    const lineNumber = idx + 1;

    if (BLANK_OR_COMMENT.test(rawLine)) return;
    if (IMPORT_LINE.test(rawLine)) return;
    if (CIRCUIT_CTOR.test(rawLine)) return;
    if (SIMULATOR_LINE.test(rawLine)) return;

    const qubitMatch = QUBIT_LINE.exec(rawLine);
    if (qubitMatch) {
      if (numQubits !== null) {
        errors.push({ line: lineNumber, message: "Qubit declaration already exists" });
        return;
      }
      numQubits = Number(qubitMatch[1]);
      if (numQubits < 1) {
        errors.push({ line: lineNumber, message: `Invalid qubit count: ${qubitMatch[1]}` });
        numQubits = null;
      }
      return;
    }

    if (APPEND_LIST_START.test(rawLine)) {
      inList = true;
      return;
    }

    if (APPEND_LIST_END.test(rawLine)) {
      inList = false;
      return;
    }

    if (numQubits === null && !inList) {
      if (/circuit\.append/.test(rawLine)) {
        errors.push({ line: lineNumber, message: "Qubits must be declared first: q = cirq.LineQubit.range(N)" });
        return;
      }
    }

    const matched = tryParseGateFromLine(rawLine, lineNumber, operations, errors, inList);
    if (!matched) {
      errors.push({ line: lineNumber, message: `Unrecognized Cirq syntax: "${rawLine.trim()}"` });
    }
  });

  if (numQubits === null) {
    if (errors.length === 0) {
      errors.push({ line: 1, message: "No qubit declaration found. Expected: q = cirq.LineQubit.range(N)" });
    }
    return { circuit: null, errors };
  }

  if (errors.length > 0) {
    return { circuit: null, errors };
  }

  assignTimeSteps(operations);
  const measuredQubits = operations.filter((op) => op.gate === "measure").map((op) => op.targets[0]);
  const classicalBits = measuredQubits.length;
  const circuit = createEmptyCircuit(numQubits, classicalBits);
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
