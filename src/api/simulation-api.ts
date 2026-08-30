import type { QuantumCircuit } from "../circuit/model/types";

export interface ApiComplex {
  real: number;
  imag: number;
}

export interface ApiBlochAngle {
  qubit: number;
  theta: number | null;
  phi: number | null;
  r: number;
  pure: boolean;
}

export interface BackendSimulationResult {
  statevector: ApiComplex[];
  measurementHistogram: Record<string, number>;
  blochAngles: ApiBlochAngle[];
  shots: number;
}

export interface CompareResult {
  results: Record<string, BackendSimulationResult & { timing_ms: number }>;
  agreement: boolean;
}

export class SimulationApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "SimulationApiError";
    this.status = status;
  }
}

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL as string | undefined) ?? "http://localhost:8000";

interface BackendErrorDetail {
  message?: string;
  errors?: { message: string; operationId?: string | null }[];
}

async function extractErrorMessage(res: Response): Promise<string> {
  try {
    const body = await res.json();
    const detail = body?.detail as BackendErrorDetail | string | undefined;
    if (typeof detail === "string") return detail;
    if (detail?.errors?.length) return detail.errors.map((e) => e.message).join("; ");
    if (detail?.message) return detail.message;
  } catch {
    // response body wasn't JSON
  }
  return `Backend returned HTTP ${res.status}`;
}

export async function simulateOnBackend(
  circuit: QuantumCircuit,
  shots = 1024,
  backend: "qiskit" | "cirq" | "pennylane" = "qiskit",
  signal?: AbortSignal
): Promise<BackendSimulationResult> {
  let res: Response;
  try {
    res = await fetch(`${BACKEND_URL}/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ circuit, shots, backend }),
      credentials: "include",
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    throw new SimulationApiError("Could not reach the simulation backend. Is it running?");
  }

  if (!res.ok) {
    throw new SimulationApiError(await extractErrorMessage(res), res.status);
  }

  const data = await res.json();
  return {
    statevector: data.statevector,
    measurementHistogram: data.measurement_histogram,
    blochAngles: data.bloch_angles,
    shots: data.shots,
  };
}

export async function compareBackends(
  circuit: QuantumCircuit,
  shots = 1024,
  signal?: AbortSignal
): Promise<CompareResult> {
  let res: Response;
  try {
    res = await fetch(`${BACKEND_URL}/simulate/compare`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ circuit, shots }),
      credentials: "include",
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    throw new SimulationApiError("Could not reach the simulation backend. Is it running?");
  }

  if (!res.ok) {
    throw new SimulationApiError(await extractErrorMessage(res), res.status);
  }

  const data = await res.json();
  const results: CompareResult["results"] = {};
  for (const [key, val] of Object.entries(data.results) as [string, any][]) {
    results[key] = {
      statevector: val.statevector,
      measurementHistogram: val.measurement_histogram,
      blochAngles: val.bloch_angles,
      shots: val.shots,
      timing_ms: val.timing_ms,
    };
  }

  return { results, agreement: data.agreement };
}

export async function checkBackendHealth(signal?: AbortSignal): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/health`, { credentials: "include", signal });
    return res.ok;
  } catch {
    return false;
  }
}
