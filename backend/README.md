# Quantum Circuit Editor — Simulation Backend

A small FastAPI service that takes the frontend's canonical Circuit IR, builds
a real Qiskit `QuantumCircuit` from it, and executes it on **Qiskit Aer**. It
is independent of the React app — the frontend's local in-browser simulator
(`src/simulation/state-vector-simulator.ts`) keeps working on its own even if
this backend is never started.

## Architecture

```
Frontend Circuit IR (JSON)
        │  POST /simulate
        ▼
Pydantic models (app/models.py)      — structural validation
        │
Circuit validation (app/validation.py) — mirrors src/circuit/validation/validate.ts
        │
Circuit IR → Qiskit (app/circuit_builder.py)
        │
Qiskit Aer execution (app/simulator.py)
        │  statevector, shot counts, per-qubit Bloch angles
        ▼
JSON response
```

The gate registry (`app/gate_registry.py`) is a Python mirror of
`src/circuit/gate-registry/registry.ts` — the two can't literally share code
across the language boundary, but every gate id, qubit-role count, and
Qiskit method name matches exactly.

## Install

Requires Python 3.11+ (tested with 3.13).

```bash
cd backend
python -m venv .venv
.venv/Scripts/activate       # Windows
# source .venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
```

## Run

```bash
uvicorn app.main:app --reload --port 8000
```

The frontend (Vite dev server on `http://localhost:5173`) is the only
origin allowed by CORS by default. In production, set `ALLOWED_ORIGINS`
(comma-separated) to your deployed frontend's URL — see `app/main.py`.

## Deploy (Render)

A `render.yaml` blueprint lives at the repo root. On [render.com](https://render.com):
"New +" → "Blueprint" → point it at this repo → Render reads `render.yaml`
and provisions a free web service rooted at `backend/` automatically
(`pip install -r requirements.txt` then
`uvicorn app.main:app --host 0.0.0.0 --port $PORT`).

You'll be prompted for these environment variables (all optional, but set
`ALLOWED_ORIGINS` or the deployed frontend can't reach the API):

| Var | Purpose | Example |
|---|---|---|
| `ALLOWED_ORIGINS` | Comma-separated CORS allowlist | `https://your-app.vercel.app` |
| `OLLAMA_BASE_URL` | Public URL of a self-hosted Ollama instance for the AI Tutor's LLM | `https://your-ollama-host.example.com` |
| `OLLAMA_MODEL` | Model name if not `llama3` | `llama3` |

If `OLLAMA_BASE_URL` is unset or unreachable, `/api/tutor/analyze` still
works — it just falls back to the deterministic rule-based explanation
(`source: "deterministic"` in the response) instead of an LLM-phrased one.

Once deployed, copy the service's `https://...onrender.com` URL — the
frontend needs it as `VITE_BACKEND_URL` (see the root `README.md`).

## Test

```bash
pytest -v
```

28 tests covering health, valid circuits (H, X, CX Bell state, RX/RY/RZ,
SWAP, measurement), invalid input (bad gate, bad qubit index, missing
parameter, malformed structure, non-finite parameter, malformed JSON), and
the Circuit IR → Qiskit conversion in isolation from the HTTP layer.

## API

### `GET /health`

```json
{ "status": "ok" }
```

### `POST /simulate`

Request:

```json
{
  "circuit": {
    "version": 1,
    "qubits": 2,
    "classicalBits": 2,
    "operations": [
      { "id": "a", "gate": "h", "targets": [0], "timeStep": 0 },
      { "id": "b", "gate": "cx", "controls": [0], "targets": [1], "timeStep": 1 },
      { "id": "c", "gate": "measure", "targets": [0], "timeStep": 2 },
      { "id": "d", "gate": "measure", "targets": [1], "timeStep": 2 }
    ]
  },
  "shots": 1024
}
```

`shots` is optional (default `1024`, max `100000`).

Response:

```json
{
  "statevector": [
    { "real": 0.7071067811865476, "imag": 0.0 },
    { "real": 0.0, "imag": 0.0 },
    { "real": 0.0, "imag": 0.0 },
    { "real": 0.7071067811865476, "imag": 0.0 }
  ],
  "measurement_histogram": { "00": 512, "11": 512 },
  "bloch_angles": [
    { "qubit": 0, "theta": null, "phi": null, "r": 0.0, "pure": false },
    { "qubit": 1, "theta": null, "phi": null, "r": 0.0, "pure": false }
  ],
  "shots": 1024
}
```

`bloch_angles[i].pure` is `false` when qubit `i`'s reduced single-qubit state
is mixed (e.g. entangled with another qubit, as in the Bell state above) —
`theta`/`phi` are `null` in that case rather than a misleading point on the
sphere. `r` is the Bloch vector's magnitude (1.0 = pure, 0.0 = maximally
mixed).

### curl example

```bash
curl -X POST http://localhost:8000/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "circuit": {
      "version": 1, "qubits": 2, "classicalBits": 2,
      "operations": [
        {"id":"a","gate":"h","targets":[0],"timeStep":0},
        {"id":"b","gate":"cx","controls":[0],"targets":[1],"timeStep":1}
      ]
    },
    "shots": 500
  }'
```

### Errors

Invalid circuits return `422` with structured detail:

```json
{
  "detail": {
    "message": "Circuit validation failed",
    "errors": [{ "message": "Unknown gate: toffoli", "operationId": "a" }]
  }
}
```

Unexpected internal/Aer failures return `500` with a generic message —
tracebacks are never included in the response body.

## Supported gates

`H, X, Y, Z, S, T` (single-qubit) · `RX, RY, RZ` (rotation, radians) ·
`CX, CZ` (control, target) · `SWAP` (two targets) · `MEASURE` (classical bit
index must equal the qubit index — the same convention the frontend
enforces).

## Frontend integration

`src/api/simulation-api.ts` is the typed client. `src/state/simulation-store.ts`
holds the active mode (`local` | `backend`) and the latest backend result.
`src/components/simulation/BackendSimulationController.tsx` debounces circuit
changes (400ms), POSTs to `/simulate`, times out after 6s, and discards
stale/superseded responses. `ProbabilitiesPanel` and `QSpherePanel` read
from the shared store and fall back to the local simulator — with a visible
warning — if the backend is unreachable or times out.

Toggle the engine from the canvas toolbar ("Local" / "Qiskit Aer").
