
# Phase 4 — Circuit-Grounded AI Tutor — Build Log

Everything added on top of Phase 3 (see `phase3.md`). Goal: a tutor panel that analyzes the user's *actual current circuit* — not a generic chatbot — and returns exactly three things: a plain-English explanation, a conceptual-mistake warning, and one optimization suggestion. Auto-refreshes on every gate add/remove via the existing debounce mechanism; no "Run"/"Ask" button.

Status: 17 new backend tests passing, `tsc -b` clean, verified live end-to-end against a real local LLM (Ollama + llama3) in a real browser — zero console errors.

---

## 1. Backend (`backend/app/`)

```
tutor_checks.py    deterministic circuit analysis (pure functions, no LLM, no network)
llm_provider.py     TutorLLMProvider interface + OllamaTutorProvider implementation
tutor.py            orchestrator — reuses /simulate's exact simulation calls
tutor_models.py      Pydantic request/response models
main.py              POST /api/tutor/analyze + startup warm-up
```

### Deterministic checks (`tutor_checks.py`)

Four pure functions over the Circuit IR, no simulation needed, each returning human-readable issue strings:

- **Measurement before entanglement** — a qubit is measured, then later used in a CX/CZ/SWAP — the entangling gate can't affect the already-collapsed result.
- **Gates after measurement** — any gate applied to a qubit after it was measured has no effect on the reported outcome.
- **Missing superposition before a CX/CZ control** — the control qubit never saw an H/RX/RY beforehand, so the gate is just a deterministic flip, not real entanglement — a very common beginner mistake.
- **Redundant self-inverse pairs** — the same self-inverse single-qubit gate (H/X/Y/Z) applied twice in a row on the same qubit with nothing else touching that qubit in between cancels to the identity.

These are combined in `analyze_circuit()` and passed to the LLM as ground-truth findings — **the LLM's job is to phrase them, not to detect them from scratch.** In `tutor.py::build_tutor_response`, `warning.detected` is `bool(deterministic_issues) or llm_output.warning_detected` — a real deterministic finding is structurally impossible for the model to hallucinate away.

### LLM provider interface (`llm_provider.py`)

```python
class TutorLLMProvider(Protocol):
    def is_configured(self) -> bool: ...
    def generate(self, *, circuit_summary, simulation_summary, detected_issues) -> TutorLLMOutput: ...
    def warm_up(self) -> None: ...
```

`tutor.py` and `main.py` only depend on this Protocol — no vendor SDK import anywhere outside the provider implementation itself. Swapping providers is a one-file change.

**`OllamaTutorProvider`** (the only implementation) calls a local Ollama server (`http://localhost:11434` by default) running `llama3` — no API key, nothing leaves the machine. Uses Ollama's schema-constrained `format` option (a raw JSON Schema, same shape as `TUTOR_JSON_SCHEMA`) so the response is guaranteed-parseable structured JSON, not free text to regex out. Configurable via `OLLAMA_BASE_URL` / `OLLAMA_MODEL` env vars.

> An earlier iteration of this provider called the Anthropic API (Claude); it was fully replaced with the Ollama/llama3 implementation per explicit request — there is no Claude/Anthropic code path left anywhere in the tutor feature.

### Cold-start reliability

Ollama unloads an idle model after ~5 minutes; reloading it from disk takes 30-60s. Two fixes:
- `OllamaTutorProvider.warm_up()` fires a trivial request in a background thread from a FastAPI `lifespan` startup hook, so the model is already resident before a judge's first real interaction.
- Every request (including the warm-up) sends `"keep_alive": "30m"` instead of Ollama's 5-minute default.
- The frontend's request timeout is 60s (see §2) to tolerate a worst-case cold load even if warm-up didn't get a chance to run first.

### Orchestration (`tutor.py`)

`build_tutor_response(circuit, sv, bloch, provider)` — takes an **already-simulated** statevector and Bloch angles (the exact same `run_statevector`/`compute_bloch_angles` calls `/simulate` makes) rather than re-simulating, so the tutor endpoint never duplicates work the rest of the app already does. Builds a plain-text circuit summary (gates in time order) and simulation summary (exact outcome probabilities + per-qubit Bloch state, from `Statevector.probabilities_dict()` — no shot sampling needed for a lightweight tutor call), hands both plus the deterministic issues to the provider, and gracefully degrades to a deterministic-only response (`source: "deterministic"`) if the provider is unavailable or the request fails — never a 500 to the user for an LLM hiccup.

### Endpoint (`main.py`)

```
POST /api/tutor/analyze
{ "circuit": <Circuit IR> }

→ {
  "explanation": "...",
  "warning": { "detected": true, "message": "..." },
  "optimization": "...",
  "source": "llm" | "deterministic"
}
```

Same validation path as `/simulate` (422 on invalid circuits, structured error detail). `source` is additive beyond the spec'd contract — lets the frontend show a subtle "rule-based, no LLM" badge without treating it as an error state. Provider is injected via FastAPI `Depends(get_tutor_provider)`, overridden in tests so no test needs a live LLM.

---

## 2. Frontend

```
src/api/tutor-api.ts                  typed fetch client (same pattern as simulation-api.ts)
src/state/tutor-store.ts              result/error/loading only — not circuit state
src/components/tutor/TutorController.tsx   invisible, debounced, mounted once in App.tsx
src/components/tutor/TutorPanel.tsx        visible 3-section panel
```

`TutorController` mirrors `BackendSimulationController`'s exact debounce/abort/stale-response-guard shape: 300ms debounce (same window the viz panels use), 60s timeout, request-id counter so a slow stale response can never overwrite a newer one. `TutorPanel` renders three fixed sections — 🧑‍🏫 Explanation, ⚠️ Conceptual Warning, 💡 Optimization — plus loading/empty/error states and the deterministic-fallback badge. Mounted in the right column, stacked below the Qiskit code editor (same "flex-shrink:0, capped height, own scroll" pattern `GateInspector` already uses under the gate toolbox).

No chat input anywhere — the panel only ever reflects the current circuit.

---

## 3. Tests

**Backend (17, pytest, `backend/tests/`):**
- `test_tutor_checks.py` — each deterministic check in isolation (redundant pairs detected/not-detected across qubits/when interrupted, non-self-inverse gates never flagged, measurement-before-entanglement, gates-after-measurement, missing-superposition-before-control, empty circuit).
- `test_tutor_api.py` — endpoint tests via a `FakeProvider` injected through `app.dependency_overrides[get_tutor_provider]` (no real LLM call in CI): LLM-configured success, LLM-unconfigured fallback, a deterministic warning surviving even when the fake LLM output says `warningDetected=false`, LLM failure falling back to deterministic, invalid-circuit 422, empty-circuit clean analysis.

**Frontend:** no test runner changes needed — `tsc -b` clean, `oxlint` shows no new warnings beyond pre-existing ones in unrelated files.

---

## 4. Verification performed

Live end-to-end in a real browser (Playwright, headless Chromium) against the real running stack (Vite dev server + FastAPI backend + real Ollama/llama3, not mocks):

| Circuit | `warning.detected` | Notes |
|---|---|---|
| Empty (default 2-qubit `\|00⟩`) | `false` | Explanation correctly describes the trivial starting state |
| `H` on q0 | `false` | Explanation correctly describes superposition + 50/50 split |
| `H;H` on q0 (redundant pair) | `true` | Message correctly identifies the cancelling pair |

Confirmed the explanation **actually changes** after adding a gate (not just present-but-stale — an early verification pass had a false negative here from a too-weak wait condition in the test script itself, not an app bug; fixed by waiting for the text to differ from its pre-click value). Zero console/page errors in any run. No second `/simulate` call triggered by the tutor request — it reuses the same simulation the panels already have.

---

## 5. Sample to check it yourself

Requires the dev server (`npm run dev`), the backend (`uvicorn app.main:app --port 8000`), and Ollama running locally with `llama3` pulled (`ollama pull llama3` once, if not already).

### Quick curl check

```bash
curl -X POST http://localhost:8000/api/tutor/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "circuit": {
      "version": 1, "qubits": 1, "classicalBits": 1,
      "operations": [
        {"id":"a","gate":"h","targets":[0],"timeStep":0},
        {"id":"b","gate":"h","targets":[0],"timeStep":1}
      ]
    }
  }'
```

Expected shape (wording varies — it's a live LLM call):

```json
{
  "explanation": "This circuit applies a Hadamard gate to a single qubit... The second Hadamard gate is redundant and cancels the first...",
  "warning": {
    "detected": true,
    "message": "Don't worry, this is a common mistake! Just remove the redundant gate to simplify your circuit."
  },
  "optimization": "Remove the second Hadamard gate at step 1 to simplify the circuit.",
  "source": "llm"
}
```

The important invariant to check, not the exact wording: `warning.detected` must be `true` for this circuit (H;H cancels — deterministic check `find_redundant_self_inverse_pairs` guarantees it regardless of what the LLM says), and `source` should read `"llm"` if Ollama is reachable or `"deterministic"` if it isn't (kill Ollama and re-run the same curl to see the graceful fallback — the response still comes back 200, just with a rule-based explanation instead).

### Browser check

```js
// verify-tutor.mjs — node verify-tutor.mjs
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://localhost:5173", { waitUntil: "networkidle" });
await page.waitForSelector("text=AI Tutor");

await page.waitForFunction(
  () => document.querySelector(".tutor-section-text")?.textContent?.length > 20,
  { timeout: 30000 }
);
const before = await page.locator(".tutor-section-text").first().textContent();

await page.getByRole("button", { name: /Add Hadamard gate/i }).click(); // no "Ask tutor" button — this alone triggers it

await page.waitForFunction(
  (prev) => {
    const el = document.querySelector(".tutor-section-text");
    return el?.textContent && el.textContent !== prev && el.textContent.length > 20;
  },
  before,
  { timeout: 40000 }
);

console.log("Tutor panel updated automatically after adding H:");
console.log(await page.locator(".tutor-section-text").first().textContent());
await browser.close();
```

Expected: a printed explanation that now mentions superposition/the Hadamard gate, having changed from whatever it said about the empty circuit before the click — with no button clicked except the gate itself.

---

## 6. What's not covered

Multi-qubit conceptual checks beyond the four listed (e.g. SWAP misuse, redundant CX pairs, over-rotation via repeated RX/RY) — left for a future pass if the demo needs them. The `LLMNotConfiguredError` exception path in `llm_provider.py` is currently unused by `OllamaTutorProvider` (which never reports "unconfigured", only connection failures) — it's kept in the interface for a future provider that does have a credential gate.
