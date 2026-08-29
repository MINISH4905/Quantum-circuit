# Phase 2 — Backend Quantum Simulation — Build Log

Everything added on top of Phase 1 (see `phase1.md`). Goal: a real Qiskit + Qiskit Aer backend that takes the frontend's existing Circuit IR, executes it, and feeds results back into the existing Probabilities/Q-sphere panels — without touching the Circuit IR, the editor, or any of Phase 1's 78 tests.

Status: 28 backend tests + 16 new frontend tests, all passing. 94/94 total frontend tests. Typecheck clean. Both production build and backend startup verified.

---

## 1. Backend service (`backend/`)

```
backend/
├── app/
│   ├── main.py            FastAPI app, CORS, /health, /simulate, error sanitization
│   ├── models.py          Pydantic mirror of the frontend's Circuit IR
│   ├── gate_registry.py   Python mirror of src/circuit/gate-registry/registry.ts
│   ├── validation.py      Python mirror of src/circuit/validation/validate.ts
│   ├── circuit_builder.py Circuit IR -> Qiskit QuantumCircuit
│   └── simulator.py       Qiskit Aer execution + Bloch angle math
├── tests/
│   ├── conftest.py, test_health.py, test_circuit_builder.py, test_simulate.py
├── requirements.txt
├── README.md
└── .venv/                 (gitignored)
```

Stack: FastAPI, Pydantic v2, Qiskit 2.5, Qiskit Aer 0.17, pytest, httpx. Python 3.13.

### Request/response contract

The backend's Pydantic models are a deliberate structural mirror of `src/circuit/model/types.ts` — same field names (`version`, `qubits`, `classicalBits`, `operations`, `id`, `gate`, `targets`, `controls`, `parameters`, `timeStep`). Nothing was reinvented on the Python side.

```
POST /simulate
{ "circuit": <Circuit IR>, "shots": 1024 }

→ {
  "statevector": [{ "real": ..., "imag": ... }, ...],
  "measurement_histogram": { "00": 512, "11": 512 },
  "bloch_angles": [{ "qubit": 0, "theta": ..., "phi": ..., "r": ..., "pure": true }],
  "shots": 1024
}
```

### Circuit IR → Qiskit (`circuit_builder.py`)

Operations are sorted deterministically (`timeStep`, then lowest involved qubit, then operation id) and applied as `getattr(qc, gate.qiskit_name)(*parameters, *controls, *targets)` — this single formula happens to match every registered gate's real Qiskit method signature (`rx(theta, qubit)`, `cx(control, target)`, `swap(q0, q1)`, etc.) because the gate registry's field order was designed that way from Phase 1.

Two circuit variants are built from the same base:
- **Statevector variant** — no measurements, ends in `save_statevector()`.
- **Counts variant** — explicit `measure(q, q)` per the IR's `measure` ops (classical bit index == qubit index, the frontend's enforced convention), or measures every qubit if the IR has no `measure` ops at all (matching the local simulator's fallback behavior).

### Qiskit Aer execution (`simulator.py`)

- `run_statevector()` — `AerSimulator(method="statevector")`, exact amplitudes.
- `run_counts(shots)` — default `AerSimulator()`, real random shot sampling (not deterministic rounding — statistical tolerance is expected and is what the tests check).
- `compute_bloch_angles()` — partial-traces the full statevector's density matrix down to each qubit, derives the Bloch vector (`rx = 2·Re(ρ01)`, `ry = -2·Im(ρ01)`, `rz = ρ00-ρ11`), and reports `theta`/`phi` **only** when the reduced state's purity `r ≥ 0.999`. For an entangled qubit (e.g. either half of a Bell pair) `r ≈ 0` and the response is `{theta: null, phi: null, pure: false}` — an honest "this qubit has no single point on the Bloch sphere" rather than a misleading `(0,0)`.

### Validation (`validation.py`, `gate_registry.py`)

A second, independent implementation of Phase 1's validation rules (unknown gate, wrong control/target count, out-of-range qubit index, duplicate control/target qubit, wrong parameter count, non-finite parameter, measure's classical bit out of range). The backend is a separate trust boundary — it never assumes a request came from the already-validated frontend store.

### Error handling

- Structural errors (wrong types, missing fields) → Pydantic → automatic `422`.
- Semantic errors (unknown gate, bad qubit index, etc.) → custom `422` with `{"message", "errors": [{"message","operationId"}]}`.
- Qiskit/Aer failures → `500` with a generic message, never a raw traceback.
- A custom `RequestValidationError` handler sanitizes non-JSON-safe values (see bug #1 below) so the process can never crash while reporting an error.

### CORS

Restricted to `http://localhost:5173` and `http://127.0.0.1:5173` (the Vite dev server) — not a wildcard.

---

## 2. Frontend integration

```
src/api/simulation-api.ts                            typed fetch client
src/state/simulation-store.ts                         mode + cached backend result (not circuit state)
src/components/simulation/BackendSimulationController.tsx   debounced fetch, stale-response guard, timeout
```

- **`simulation-api.ts`** — `simulateOnBackend(circuit, shots, signal)` POSTs the IR as-is and returns a typed, camelCased result; throws `SimulationApiError` with a clean message on non-2xx or network failure.
- **`simulation-store.ts`** — holds `mode: 'local' | 'backend'` and the latest backend result/error/loading flag. Explicitly *not* circuit state — the Zustand circuit store remains the only source of truth for the circuit itself.
- **`BackendSimulationController`** — an invisible component mounted once in `App.tsx`. Debounces circuit changes (400ms), cancels superseded in-flight requests, times out after 6s, and uses a request-id counter so a slow, stale response can never overwrite a newer one.
- **`ProbabilitiesPanel` / `QSpherePanel`** — read `mode` from the store. In `backend` mode they display the backend's histogram/statevector; on any backend error they show a visible warning banner and fall back to the (always-kept-fresh-in-the-background) local simulator result, so the app is never left blank.
- **`CanvasToolbar`** — new "Local / Qiskit Aer" toggle.

---

## 3. Real bugs found and fixed while testing

1. **NaN parameter crashed FastAPI's own error response.** Sending a non-finite gate parameter correctly failed Pydantic's validator, but Starlette's strict JSON encoder (`allow_nan=False`) then choked trying to serialize the *error detail* that echoed the invalid value back — turning a clean `422` into an unhandled `500`. Fixed with a custom `RequestValidationError` handler that sanitizes the error body via `jsonable_encoder` + a recursive NaN/Infinity-to-string pass.
2. **Dead backend left the UI stuck.** With no request timeout, switching to "Qiskit Aer" while the backend was down could leave `fetch` pending for several seconds, during which a "Running on Qiskit Aer…" message and the local fallback histogram rendered simultaneously — contradictory. Fixed with a 6s `AbortController` timeout and a condition tweak so the loading message only shows when there's *no* fallback data yet to display.

Both were caught by actually driving the running app in a browser (Playwright), not just by unit tests passing.

---

## 4. Tests added

**Backend (28, pytest):** health; empty circuit; X; H; H+measure histogram (statistical tolerance); Bell state CX (statistical tolerance, entangled-qubit Bloch check); RX/RY/RZ; SWAP; explicit measurement; invalid qubit index/gate/parameter/structure; malformed JSON; NaN parameter; statevector JSON shape; circuit-builder unit tests independent of the HTTP layer (gate argument order, measurement wiring, deterministic ordering).

**Frontend (16, vitest + React Testing Library):** API request construction, response field mapping, error-message extraction (422 detail, network failure, AbortError passthrough), health check; controller debounce/mode-gating/timeout/stale-response protection; panel-level backend-success / backend-error-fallback rendering.

---

## 5. How to run everything

```bash
# Backend
cd backend
python -m venv .venv && .venv/Scripts/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Frontend (separate terminal, repo root)
npm run dev
```

Open `http://localhost:5173`, build a circuit, click **Qiskit Aer** in the canvas toolbar.

See `backend/README.md` for the full API reference and `phase1.md` for everything the frontend already did before this phase.
