import { useEffect, useRef } from "react";
import { useCircuitStore } from "../../state/circuit-store";
import { useTutorStore } from "../../state/tutor-store";
import { analyzeCircuitWithTutor } from "../../api/tutor-api";
import { SimulationApiError } from "../../api/simulation-api";

const DEBOUNCE_MS = 300;
// Generous: a local LLM (e.g. Ollama) that's been idle can take 30-60s to
// reload into memory. The backend also warms it at startup to avoid this
// in practice, but the timeout still needs to tolerate a cold worst case.
const REQUEST_TIMEOUT_MS = 60000;

/**
 * Invisible controller: debounces circuit changes (same 300ms window the
 * viz panels use) and POSTs to /api/tutor/analyze, writing the result into
 * tutor-store for TutorPanel to read. Runs once (not once per panel) so
 * only a single tutor request is ever in flight — mirrors
 * BackendSimulationController's debounce/abort/stale-response pattern.
 */
export function TutorController() {
  const circuit = useCircuitStore((s) => s.circuit);
  const hasErrors = useCircuitStore((s) => s.errors.length > 0);
  const setResult = useTutorStore((s) => s.setResult);
  const setError = useTutorStore((s) => s.setError);
  const setLoading = useTutorStore((s) => s.setLoading);

  const debounceRef = useRef<number | undefined>(undefined);
  const requestIdRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (hasErrors) {
      setResult(null);
      setError(null);
      setLoading(false);
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
      analyzeCircuitWithTutor(circuit, controller.signal)
        .then((result) => {
          if (myRequestId !== requestIdRef.current) return; // superseded by a newer request
          setResult(result);
          setError(null);
        })
        .catch((err: unknown) => {
          if (myRequestId !== requestIdRef.current) return;
          const isTimeout = err instanceof DOMException && err.name === "AbortError";
          setResult(null);
          setError(
            isTimeout
              ? "Tutor request timed out. Is the backend (and its LLM provider) running?"
              : err instanceof SimulationApiError
                ? err.message
                : "Tutor analysis failed"
          );
        })
        .finally(() => {
          window.clearTimeout(timeoutId);
          if (myRequestId === requestIdRef.current) setLoading(false);
        });
    }, DEBOUNCE_MS);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [circuit, hasErrors]);

  return null;
}
