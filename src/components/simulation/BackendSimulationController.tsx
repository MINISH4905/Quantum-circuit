import { useEffect, useRef } from "react";
import { useCircuitStore } from "../../state/circuit-store";
import { useSimulationStore } from "../../state/simulation-store";
import { simulateOnBackend, SimulationApiError } from "../../api/simulation-api";

const DEBOUNCE_MS = 400;
const SHOTS = 1024;
const REQUEST_TIMEOUT_MS = 6000;

export function BackendSimulationController() {
  const circuit = useCircuitStore((s) => s.circuit);
  const hasErrors = useCircuitStore((s) => s.errors.length > 0);
  const mode = useSimulationStore((s) => s.mode);
  const activeBackend = useSimulationStore((s) => s.activeBackend);
  const setResult = useSimulationStore((s) => s.setBackendResult);
  const setError = useSimulationStore((s) => s.setBackendError);
  const setLoading = useSimulationStore((s) => s.setBackendLoading);

  const debounceRef = useRef<number | undefined>(undefined);
  const requestIdRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (mode !== "backend") return;

    const backend = activeBackend as "qiskit" | "cirq" | "pennylane";
    if (!["qiskit", "cirq", "pennylane"].includes(backend)) return;

    if (hasErrors) {
      setResult(null);
      setError(null);
      return;
    }

    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      const myRequestId = ++requestIdRef.current;
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      setLoading(true);
      simulateOnBackend(circuit, SHOTS, backend, controller.signal)
        .then((result) => {
          if (myRequestId !== requestIdRef.current) return;
          setResult(result);
          setError(null);
        })
        .catch((err: unknown) => {
          if (myRequestId !== requestIdRef.current) return;
          const isTimeout = err instanceof DOMException && err.name === "AbortError";
          setResult(null);
          setError(
            isTimeout
              ? "Backend request timed out. Is it running?"
              : err instanceof SimulationApiError
                ? err.message
                : "Backend simulation failed"
          );
        })
        .finally(() => {
          window.clearTimeout(timeoutId);
          if (myRequestId === requestIdRef.current) setLoading(false);
        });
    }, DEBOUNCE_MS);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [circuit, hasErrors, mode, activeBackend]);

  return null;
}
