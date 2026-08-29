import type { QuantumCircuit } from "../circuit/model/types";
import { SimulationApiError } from "./simulation-api";

// Client for POST /api/tutor/analyze (backend/app/main.py). Owns the HTTP
// contract only, same pattern as simulation-api.ts — no circuit state here.

export interface TutorWarning {
  detected: boolean;
  message: string;
}

export interface TutorAnalysis {
  explanation: string;
  warning: TutorWarning;
  optimization: string;
  /** "llm" when the configured provider answered; "deterministic" when it
   * was unavailable/failed and the backend fell back to rule-based checks. */
  source: "llm" | "deterministic";
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

/** POST the Circuit IR to the tutor endpoint and return the typed analysis. */
export async function analyzeCircuitWithTutor(circuit: QuantumCircuit, signal?: AbortSignal): Promise<TutorAnalysis> {
  let res: Response;
  try {
    res = await fetch(`${BACKEND_URL}/api/tutor/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ circuit }),
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    throw new SimulationApiError("Could not reach the tutor backend. Is it running?");
  }

  if (!res.ok) {
    throw new SimulationApiError(await extractErrorMessage(res), res.status);
  }

  return (await res.json()) as TutorAnalysis;
}
