import { useEffect, useRef } from "react";
import { useCircuitStore } from "../../state/circuit-store";
import { useSimulationStore } from "../../state/simulation-store";
import { compareBackends, SimulationApiError } from "../../api/simulation-api";

const DEBOUNCE_MS = 500;
const SHOTS = 1024;
const REQUEST_TIMEOUT_MS = 15000;

export function ComparisonController() {
  const circuit = useCircuitStore((s) => s.circuit);
  const hasErrors = useCircuitStore((s) => s.errors.length > 0);
  const mode = useSimulationStore((s) => s.mode);
  const setResults = useSimulationStore((s) => s.setCompareResults);
  const setAgreement = useSimulationStore((s) => s.setCompareAgreement);
  const setError = useSimulationStore((s) => s.setCompareError);
  const setLoading = useSimulationStore((s) => s.setCompareLoading);

  const debounceRef = useRef<number | undefined>(undefined);
  const requestIdRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (mode !== "compare") return;

    if (hasErrors) {
      setResults(null);
      setAgreement(null);
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
      compareBackends(circuit, SHOTS, controller.signal)
        .then((result) => {
          if (myRequestId !== requestIdRef.current) return;
          setResults(result.results);
          setAgreement(result.agreement);
          setError(null);
        })
        .catch((err: unknown) => {
          if (myRequestId !== requestIdRef.current) return;
          const isTimeout = err instanceof DOMException && err.name === "AbortError";
          setResults(null);
          setAgreement(null);
          setError(
            isTimeout
              ? "Compare request timed out. Is the backend running?"
              : err instanceof SimulationApiError
                ? err.message
                : "Backend comparison failed"
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
