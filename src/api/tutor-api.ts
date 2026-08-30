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
  confidence_score: number;
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

export interface SourceInfo {
  index: number;
  title: string;
  framework: string;
  doc_type: string;
  url: string;
  heading_path: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  sources?: SourceInfo[];
  confidenceScore?: number;
}

export interface ChatResponse {
  answer: string;
  sources?: SourceInfo[];
  confidence_score?: number;
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

export interface StreamCallbacks {
  onToken: (token: string) => void;
  onSources: (sources: SourceInfo[]) => void;
  onConfidence: (score: number) => void;
  onDone: () => void;
  onError: (error: string) => void;
}

export async function chatWithTutorStream(
  question: string,
  circuit: QuantumCircuit | null,
  history: ChatMessage[],
  callbacks: StreamCallbacks,
  signal?: AbortSignal,
): Promise<void> {
  const payload = JSON.stringify({
    question,
    circuit,
    history: history.slice(-10).map((m) => ({ role: m.role, content: m.content })),
  });

  let res: Response;
  try {
    res = await fetch(`${BACKEND_URL}/api/tutor/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      credentials: "include",
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    callbacks.onError("Could not reach the tutor backend. Is it running?");
    return;
  }

  if (!res.ok) {
    const msg = await extractErrorMessage(res);
    callbacks.onError(msg);
    return;
  }

  const reader = res.body?.getReader();
  if (!reader) {
    callbacks.onError("Streaming not supported by browser");
    return;
  }

  const decoder = new TextDecoder();
  let buffer = "";
  let tokenBatch = "";
  let rafId = 0;
  let currentEvent = "";
  let prevWasData = false;
  let sourcesAccum = "";
  let confidenceAccum = "";

  const flushTokens = () => {
    if (tokenBatch) {
      callbacks.onToken(tokenBatch);
      tokenBatch = "";
    }
    rafId = 0;
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (line.startsWith("event: ")) {
          currentEvent = line.slice(7).trim();
          prevWasData = false;
          sourcesAccum = "";
          confidenceAccum = "";
        } else if (line.startsWith("data:")) {
          const value = line.startsWith("data: ") ? line.slice(6) : line.slice(5);

          if (currentEvent === "token") {
            if (prevWasData) tokenBatch += "\n";
            tokenBatch += value;
            if (!rafId) rafId = requestAnimationFrame(flushTokens);
          } else if (currentEvent === "sources") {
            if (prevWasData) sourcesAccum += "\n";
            sourcesAccum += value;
          } else if (currentEvent === "confidence") {
            if (prevWasData) confidenceAccum += "\n";
            confidenceAccum += value;
          } else if (currentEvent === "done") {
            if (rafId) cancelAnimationFrame(rafId);
            flushTokens();
            callbacks.onDone();
            return;
          } else if (currentEvent === "error") {
            if (rafId) cancelAnimationFrame(rafId);
            flushTokens();
            callbacks.onError(value);
            return;
          }
          prevWasData = true;
        } else if (line.trim() === "") {
          // Blank line = event boundary
          if (currentEvent === "sources" && sourcesAccum) {
            try {
              callbacks.onSources(JSON.parse(sourcesAccum) as SourceInfo[]);
            } catch { /* ignore parse errors */ }
            sourcesAccum = "";
          }
          if (currentEvent === "confidence" && confidenceAccum) {
            try {
              callbacks.onConfidence(JSON.parse(confidenceAccum) as number);
            } catch { /* ignore parse errors */ }
            confidenceAccum = "";
          }
          prevWasData = false;
        }
      }
    }
    if (rafId) cancelAnimationFrame(rafId);
    flushTokens();
    callbacks.onDone();
  } catch (err) {
    if (rafId) cancelAnimationFrame(rafId);
    flushTokens();
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    callbacks.onError(err instanceof Error ? err.message : "Stream interrupted");
  }
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
