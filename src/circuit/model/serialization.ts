import type { QuantumCircuit, QuantumOperation } from "./types";
import { generateOperationId } from "./id";

export interface CircuitFileMetadata {
  name?: string;
  createdAt?: string;
}

export interface CircuitFileV1 {
  version: 1;
  qubits: number;
  classicalBits: number;
  operations: QuantumOperation[];
  metadata?: CircuitFileMetadata;
}

export interface DeserializeResult {
  circuit: QuantumCircuit | null;
  errors: string[];
  metadata?: CircuitFileMetadata;
}

export function serializeCircuit(circuit: QuantumCircuit, metadata?: CircuitFileMetadata): string {
  const file: CircuitFileV1 = {
    version: 1,
    qubits: circuit.qubits,
    classicalBits: circuit.classicalBits,
    operations: circuit.operations,
    ...(metadata ? { metadata } : {}),
  };
  return JSON.stringify(file, null, 2);
}

function isNumberArray(v: unknown): v is number[] {
  return Array.isArray(v) && v.every((x) => typeof x === "number" && Number.isFinite(x));
}

function parseOperation(raw: unknown, index: number, errors: string[]): QuantumOperation | null {
  if (typeof raw !== "object" || raw === null) {
    errors.push(`operations[${index}] is not an object`);
    return null;
  }
  const o = raw as Record<string, unknown>;

  if (typeof o.gate !== "string") {
    errors.push(`operations[${index}].gate must be a string`);
    return null;
  }
  if (!isNumberArray(o.targets)) {
    errors.push(`operations[${index}].targets must be a number array`);
    return null;
  }
  if (o.controls !== undefined && !isNumberArray(o.controls)) {
    errors.push(`operations[${index}].controls must be a number array`);
    return null;
  }
  if (o.parameters !== undefined && !isNumberArray(o.parameters)) {
    errors.push(`operations[${index}].parameters must be a number array`);
    return null;
  }
  if (typeof o.timeStep !== "number" || !Number.isFinite(o.timeStep)) {
    errors.push(`operations[${index}].timeStep must be a number`);
    return null;
  }

  return {
    id: typeof o.id === "string" ? o.id : generateOperationId("loaded"),
    gate: o.gate,
    targets: o.targets as number[],
    controls: o.controls as number[] | undefined,
    parameters: o.parameters as number[] | undefined,
    timeStep: o.timeStep,
  };
}

/** Parse and structurally validate a saved circuit file. Does not run gate-level validation. */
export function deserializeCircuit(text: string): DeserializeResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { circuit: null, errors: ["File is not valid JSON"] };
  }

  if (typeof raw !== "object" || raw === null) {
    return { circuit: null, errors: ["File does not contain a circuit object"] };
  }
  const o = raw as Record<string, unknown>;

  if (o.version !== 1) {
    return { circuit: null, errors: [`Unsupported schema version: ${JSON.stringify(o.version)} (expected 1)`] };
  }
  if (typeof o.qubits !== "number" || !Number.isInteger(o.qubits) || o.qubits < 1) {
    return { circuit: null, errors: ["qubits must be a positive integer"] };
  }
  if (typeof o.classicalBits !== "number" || !Number.isInteger(o.classicalBits) || o.classicalBits < 0) {
    return { circuit: null, errors: ["classicalBits must be a non-negative integer"] };
  }
  if (!Array.isArray(o.operations)) {
    return { circuit: null, errors: ["operations must be an array"] };
  }

  const errors: string[] = [];
  const operations: QuantumOperation[] = [];
  o.operations.forEach((raw, i) => {
    const op = parseOperation(raw, i, errors);
    if (op) operations.push(op);
  });

  if (errors.length > 0) {
    return { circuit: null, errors };
  }

  const rawMetadata = o.metadata;
  const metadata: CircuitFileMetadata | undefined =
    typeof rawMetadata === "object" && rawMetadata !== null
      ? {
          name: typeof (rawMetadata as Record<string, unknown>).name === "string" ? (rawMetadata as Record<string, unknown>).name as string : undefined,
          createdAt:
            typeof (rawMetadata as Record<string, unknown>).createdAt === "string"
              ? ((rawMetadata as Record<string, unknown>).createdAt as string)
              : undefined,
        }
      : undefined;

  return {
    circuit: { version: 1, qubits: o.qubits, classicalBits: o.classicalBits, operations },
    errors: [],
    metadata,
  };
}
