import type { QuantumCircuit } from "../circuit/model/types";

// Client for the FastAPI + Qiskit Aer backend (backend/app/main.py).
// This module owns the HTTP contract only — it does not hold circuit state.

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
    // response body wasn't JSON; fall through to the generic message below
  }
  return `Backend returned HTTP ${res.status}`;
}

/** POST the Circuit IR to the backend and return typed, parsed results. */
export async function simulateOnBackend(
  circuit: QuantumCircuit,
  shots = 1024,
  signal?: AbortSignal
): Promise<BackendSimulationResult> {
  let res: Response;
  try {
    res = await fetch(`${BACKEND_URL}/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ circuit, shots }),
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

/** GET /health — used only to show a connectivity indicator, not required for /simulate to work. */
export async function checkBackendHealth(signal?: AbortSignal): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/health`, { signal });
    return res.ok;
  } catch {
    return false;
  }
}
