import { useEffect, useRef } from "react";
import { useCircuitStore } from "../../state/circuit-store";
import { useSimulationStore } from "../../state/simulation-store";
import { simulateOnBackend, SimulationApiError } from "../../api/simulation-api";

const DEBOUNCE_MS = 400;
const SHOTS = 1024;
const REQUEST_TIMEOUT_MS = 6000;

/**
 * Invisible controller: when simulation mode is "backend", debounces circuit
 * changes and POSTs to /simulate, writing the result into simulation-store
 * for both ProbabilitiesPanel and QSpherePanel to read. Runs once (not once
 * per panel) so the two panels never issue duplicate requests.
 */
export function BackendSimulationController() {
  const circuit = useCircuitStore((s) => s.circuit);
  const hasErrors = useCircuitStore((s) => s.errors.length > 0);
  const mode = useSimulationStore((s) => s.mode);
  const setResult = useSimulationStore((s) => s.setBackendResult);
  const setError = useSimulationStore((s) => s.setBackendError);
  const setLoading = useSimulationStore((s) => s.setBackendLoading);

  const debounceRef = useRef<number | undefined>(undefined);
  const requestIdRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (mode !== "backend") return;

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
      simulateOnBackend(circuit, SHOTS, controller.signal)
        .then((result) => {
          if (myRequestId !== requestIdRef.current) return; // a newer request has already superseded this one
          setResult(result);
          setError(null);
        })
        .catch((err: unknown) => {
          // If a newer request has since started, this one was aborted purely
          // to cancel wasted work — nothing to report. Any error surfacing
          // for the *current* request (including a timeout abort) is real.
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
  }, [circuit, hasErrors, mode]);

  return null;
}
