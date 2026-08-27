import type { QuantumCircuit, QuantumOperation } from "../model/types";
import { createEmptyCircuit } from "../model/types";
import { generateOperationId } from "../model/id";
import { parseParameterExpression } from "../model/parameter-expr";
import { getGateByQiskitName, SUPPORTED_GATE_NAMES } from "../gate-registry/registry";

export interface ParseError {
  line: number;
  message: string;
}

export interface ParseResult {
  circuit: QuantumCircuit | null;
  errors: ParseError[];
}

/**
 * Documented supported Qiskit subset (line-oriented, one statement per line):
 *
 *   from qiskit import QuantumCircuit      (informational, optional)
 *   from numpy import pi                   (informational, optional)
 *   import numpy as np                     (informational, optional)
 *   qc = QuantumCircuit(<qubits>)
 *   qc = QuantumCircuit(<qubits>, <classicalBits>)
 *   qc.h(<qubit>)   qc.x(<qubit>)   qc.y(<qubit>)   qc.z(<qubit>)
 *   qc.s(<qubit>)   qc.t(<qubit>)
 *   qc.rx(<theta>, <qubit>)   qc.ry(<theta>, <qubit>)   qc.rz(<theta>, <qubit>)
 *   qc.cx(<control>, <target>)   qc.cz(<control>, <target>)   qc.swap(<q0>, <q1>)
 *   qc.measure(<qubit>, <classicalBit>)    (classicalBit must equal qubit)
 *
 * <theta> supports: integers/decimals, "pi", "pi/2", "2*pi", "-pi/4", etc.
 * Variables, expressions with other functions, loops, conditionals, and any
 * other Python constructs are NOT supported and will raise a parse error.
 */
export const SUPPORTED_SYNTAX_DESCRIPTION = `Supported gates: ${SUPPORTED_GATE_NAMES}`;

const BLANK_OR_COMMENT = /^\s*(#.*)?$/;
const IMPORT_LINE = /^\s*(from\s+qiskit\s+import\s+QuantumCircuit|from\s+numpy\s+import\s+pi|import\s+numpy(\s+as\s+np)?|import\s+math)\s*$/;
const CTOR_LINE = /^\s*qc\s*=\s*QuantumCircuit\s*\(\s*([^)]*)\)\s*$/;
const CALL_LINE = /^\s*qc\.(\w+)\s*\(\s*([^)]*)\)\s*$/;
const INT_PATTERN = /^-?\d+$/;

function splitArgs(raw: string): string[] {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return [];
  return trimmed.split(",").map((a) => a.trim());
}

function parseInt10(raw: string): number | null {
  return INT_PATTERN.test(raw) ? Number(raw) : null;
}

export function parseQiskitCode(source: string): ParseResult {
  const errors: ParseError[] = [];
  let circuit: QuantumCircuit | null = null;
  const operations: QuantumOperation[] = [];

  const lines = source.split(/\r?\n/);

  lines.forEach((rawLine, idx) => {
    const lineNumber = idx + 1;
    const line = rawLine;

    if (BLANK_OR_COMMENT.test(line) || IMPORT_LINE.test(line)) {
      return;
    }

    const ctorMatch = CTOR_LINE.exec(line);
    if (ctorMatch) {
      if (circuit) {
        errors.push({ line: lineNumber, message: "QuantumCircuit is already defined; only one definition is supported" });
        return;
      }
      const args = splitArgs(ctorMatch[1]);
      if (args.length < 1 || args.length > 2) {
        errors.push({ line: lineNumber, message: "QuantumCircuit(...) expects 1 or 2 integer arguments: qubits[, classicalBits]" });
        return;
      }
      const qubits = parseInt10(args[0]);
      const classicalBits = args.length === 2 ? parseInt10(args[1]) : 0;
      if (qubits === null || qubits < 1) {
        errors.push({ line: lineNumber, message: `Invalid qubit count: ${args[0]}` });
        return;
      }
      if (classicalBits === null || classicalBits < 0) {
        errors.push({ line: lineNumber, message: `Invalid classical bit count: ${args[1]}` });
        return;
      }
      circuit = createEmptyCircuit(qubits, classicalBits);
      return;
    }

    const callMatch = CALL_LINE.exec(line);
    if (callMatch) {
      const [, methodName, argsRaw] = callMatch;

      if (!circuit) {
        errors.push({ line: lineNumber, message: "QuantumCircuit must be defined (qc = QuantumCircuit(...)) before adding gates" });
        return;
      }

      const gate = getGateByQiskitName(methodName);
      if (!gate) {
        errors.push({
          line: lineNumber,
          message: `Unsupported Qiskit operation: qc.${methodName}(...)\n\n${SUPPORTED_SYNTAX_DESCRIPTION}`,
        });
        return;
      }

      const args = splitArgs(argsRaw);
      const expectedArgCount = gate.parameterCount + gate.controlCount + gate.targetCount + (gate.writesClassicalBit ? 1 : 0);
      if (args.length !== expectedArgCount) {
        errors.push({
          line: lineNumber,
          message: `${gate.name} (qc.${gate.qiskitName}) requires ${expectedArgCount} argument(s), got ${args.length}`,
        });
        return;
      }

      let cursor = 0;
      const parameters: number[] = [];
      for (let i = 0; i < gate.parameterCount; i++) {
        const value = parseParameterExpression(args[cursor]);
        if (value === null) {
          errors.push({ line: lineNumber, message: `Invalid parameter expression: "${args[cursor]}"` });
          return;
        }
        parameters.push(value);
        cursor++;
      }

      const controls: number[] = [];
      for (let i = 0; i < gate.controlCount; i++) {
        const q = parseInt10(args[cursor]);
        if (q === null) {
          errors.push({ line: lineNumber, message: `Invalid qubit index: "${args[cursor]}"` });
          return;
        }
        controls.push(q);
        cursor++;
      }

      const targets: number[] = [];
      for (let i = 0; i < gate.targetCount; i++) {
        const q = parseInt10(args[cursor]);
        if (q === null) {
          errors.push({ line: lineNumber, message: `Invalid qubit index: "${args[cursor]}"` });
          return;
        }
        targets.push(q);
        cursor++;
      }

      if (gate.writesClassicalBit) {
        const clbit = parseInt10(args[cursor]);
        if (clbit === null) {
          errors.push({ line: lineNumber, message: `Invalid classical bit index: "${args[cursor]}"` });
          return;
        }
        if (clbit !== targets[0]) {
          errors.push({
            line: lineNumber,
            message: `qc.measure(q, c): this editor requires the classical bit to match the qubit index (got measure(${targets[0]}, ${clbit}))`,
          });
          return;
        }
        cursor++;
      }

      operations.push({
        id: generateOperationId("pop"),
        gate: gate.id,
        controls: controls.length ? controls : undefined,
        targets,
        parameters: parameters.length ? parameters : undefined,
        timeStep: 0, // assigned below once all operations are known
      });
      return;
    }

    errors.push({ line: lineNumber, message: `Unrecognized syntax: "${line.trim()}"` });
  });

  if (!circuit) {
    if (errors.length === 0) {
      errors.push({ line: 1, message: "No QuantumCircuit definition found. Expected: qc = QuantumCircuit(<qubits>)" });
    }
    return { circuit: null, errors };
  }

  if (errors.length > 0) {
    return { circuit: null, errors };
  }

  assignTimeSteps(operations);
  (circuit as QuantumCircuit).operations = operations;

  return { circuit, errors: [] };
}

/** Assign each operation the earliest time step where none of its qubits are already occupied. */
function assignTimeSteps(operations: QuantumOperation[]): void {
  const lastStepPerQubit = new Map<number, number>();
  for (const op of operations) {
    const qubits = [...(op.controls ?? []), ...op.targets];
    const earliest = qubits.reduce((max, q) => Math.max(max, (lastStepPerQubit.get(q) ?? -1) + 1), 0);
    op.timeStep = earliest;
    for (const q of qubits) lastStepPerQubit.set(q, earliest);
  }
}
