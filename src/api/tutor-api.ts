import type { QuantumCircuit } from "../circuit/model/types";
import { SimulationApiError } from "./simulation-api";

export interface TutorWarning {
  detected: boolean;
  message: string;
}

export interface TutorStep {
  step: number;
  gate: string;
  qubits: string;
  action: string;
  stateAfter: string;
  opId?: string;
}

export interface TutorGateDefinition {
  gate: string;
  definition: string;
  matrix?: string;
}

export interface TutorAnalysis {
  explanation: string;
  steps: TutorStep[];
  gateDefinitions: TutorGateDefinition[];
  algorithm: string;
  warning: TutorWarning;
  optimization: string;
  source: "llm" | "deterministic";
}

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL as string | undefined) ?? "http://localhost:8001";

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

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  answer: string;
}

async function fetchChat(
  body: string,
  signal?: AbortSignal
): Promise<Response> {
  return fetch(`${BACKEND_URL}/api/tutor/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    credentials: "include",
    signal,
  });
}

export async function chatWithTutor(
  question: string,
  circuit: QuantumCircuit | null,
  history: ChatMessage[],
  signal?: AbortSignal
): Promise<ChatResponse> {
  const payload = JSON.stringify({ question, circuit, history: history.slice(-10) });

  let res: Response;
  try {
    res = await fetchChat(payload, signal);
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    throw new SimulationApiError("Could not reach the tutor backend. Is it running?");
  }

  if (res.status === 404 || res.status === 503) {
    await new Promise((r) => setTimeout(r, 2000));
    try {
      res = await fetchChat(payload, signal);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") throw err;
      throw new SimulationApiError("Could not reach the tutor backend. Is it running?");
    }
  }

  if (!res.ok) {
    const msg = await extractErrorMessage(res);
    if (res.status === 404) {
      throw new SimulationApiError(
        "Chat endpoint not available — restart the backend server.",
        res.status
      );
    }
    throw new SimulationApiError(msg, res.status);
  }

  return (await res.json()) as ChatResponse;
}

export async function analyzeCircuitWithTutor(circuit: QuantumCircuit, signal?: AbortSignal): Promise<TutorAnalysis> {
  let res: Response;
  try {
    res = await fetch(`${BACKEND_URL}/api/tutor/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ circuit }),
      credentials: "include",
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
