import type { QuantumCircuit } from "./model/types";
import type { ParseResult } from "./parser/qiskit-parser";
import { generateQiskitCode } from "./generator/qiskit-generator";
import { generateCirqCode } from "./generator/cirq-generator";
import { generatePennylaneCode } from "./generator/pennylane-generator";
import { parseQiskitCode } from "./parser/qiskit-parser";
import { parseCirqCode } from "./parser/cirq-parser";
import { parsePennylaneCode } from "./parser/pennylane-parser";

export type Framework = "qiskit" | "cirq" | "pennylane";

export const FRAMEWORK_LABELS: Record<Framework, string> = {
  qiskit: "Qiskit",
  cirq: "Cirq",
  pennylane: "PennyLane",
};

export function generateCode(framework: Framework, circuit: QuantumCircuit): string {
  switch (framework) {
    case "qiskit":
      return generateQiskitCode(circuit);
    case "cirq":
      return generateCirqCode(circuit);
    case "pennylane":
      return generatePennylaneCode(circuit);
  }
}

export function parseCode(framework: Framework, source: string): ParseResult {
  switch (framework) {
    case "qiskit":
      return parseQiskitCode(source);
    case "cirq":
      return parseCirqCode(source);
    case "pennylane":
      return parsePennylaneCode(source);
  }
}
