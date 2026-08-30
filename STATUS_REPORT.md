# Quantum Circuit Lab — Status Report

_Generated 2026-08-29 from a direct audit of the repo (build, tests, git history) — not just the phase logs._

## TL;DR

A working, deployable full-stack quantum circuit teaching tool. Frontend build is clean, backend's 17 tests pass, core loop (build circuit → live Qiskit code → live simulation → live Bloch/Q-sphere → live AI tutor) works end-to-end. **Phase 4 of the original plan is functionally complete.** The main gap is test coverage: the phase logs claim ~94 frontend / 28 backend tests, but only **2 frontend tests** and **17 backend tests** (tutor-only) actually exist in the repo today — the Phase 1/2 core test suites (gate registry, validation, generator, parser, simulator, `/simulate`, `circuit_builder`) described in `phase1.md`/`phase2.md` were never committed.

---

## What phase are we on

| Phase | Scope | Status |
|---|---|---|
| 1 | Visual circuit editor, gate registry, Circuit IR, undo/redo, Qiskit codegen + parser, two-way sync, save/load, local statevector simulator, Q-sphere | **Done** |
| 2 | FastAPI + Qiskit Aer backend, `/simulate`, Local/Aer toggle | **Done** |
| 3 | Per-qubit animated Bloch spheres, "floating glass card" UI theme | **Done** |
| 4 | Circuit-grounded AI tutor (deterministic checks + Ollama/llama3 LLM) | **Done** |
| — | Landing page, Folders (saved circuits + worked examples), Learner hub | **Done** (built alongside Phase 4, undocumented as its own phase) |
| 5 | Not started / not planned | — |

There is no `phase5.md`. The most recent commit (`3279c0c`) folded in the landing/Folders/Learner/tutor work together; the last commit (`15149c1`) is deploy config only.

---

## Frontend (`src/`)

**Stack:** React 19 + TypeScript + Vite, Zustand, dnd-kit, Monaco, Vitest.

- **Circuit editor** — drag-and-drop + click-to-add gate placement, 13 gates (H,X,Y,Z,S,T,RX,RY,RZ,CX,CZ,SWAP,MEASURE), multi-qubit gate rendering, keyboard delete/copy/paste/move, undo/redo, per-row qubit add/remove, per-column time-step insert/remove.
- **Circuit IR** (`circuit/model/types.ts`) is the single source of truth — canvas, code panel, simulator, save/load, tutor all read/write the same Zustand store (`state/circuit-store.ts`).
- **Validation** runs on every mutation, surfaced inline (red outline + Inspector message), never silently drops bad state.
- **Qiskit two-way sync** — deterministic IR→code generator; a hand-written parser (documented subset, not `eval`/arbitrary Python) for code→IR, Monaco editor with error squiggles, debounced 400ms, last-valid-circuit-preserved on parse failure.
- **Parameter editing** — small `pi`-fraction grammar (no `eval()`), presets (π, π/2, π/4, −π/2, 2π).
- **Simulation UI** — Probabilities histogram (animated), multi-qubit Q-sphere (draggable), per-qubit animated Bloch spheres — all auto-update on every circuit change, no "Run" button anywhere.
- **Local/Qiskit Aer toggle** — `BackendSimulationController` debounces, cancels stale requests, times out at 6s, falls back to the local simulator with a warning banner if the backend is unreachable.
- **AI Tutor panel** — three fixed sections (explanation / conceptual warning / optimization), auto-refreshes 300ms after circuit changes, deterministic-fallback badge when no LLM is reachable.
- **Save/Load** — versioned JSON schema, structural validation on load, browser download/file-input; separately persists to `localStorage` for the Folders page.
- **Landing page → dashboard/learner/folders** router (`AppRoot.tsx`, hand-rolled `useState` view switch, no routing library).
- **Folders page** — saved circuits grid + two worked examples (Deutsch–Jozsa, Grover's Search), built as ordinary Circuit IR, open into the same editor as anything hand-built.
- **Learner page** — static 10-concept reference catalog, purely informational.
- **Toolbar** — functional File/Edit/Help menus, inline-editable circuit title, save/load toast feedback.
- **UI theme** — dark "floating glass card" design, IBM-Quantum-Composer-inspired 3-column layout.

**Verified now:** `npm run build` → clean (`tsc -b` + `vite build`, 85 modules, ~97KB gzip). `npm run test` → **1 test file, 2 tests, passing** (only `worked-examples.test.ts` exists; the Phase 1 test suite described in `phase1.md` — 9 files / 78 tests covering gate registry, validation, store, generator, parser, round-trip, serialization, simulator, Q-sphere — is **not present in the repo** despite being documented as complete). No component/integration tests exist for the tutor panel, backend controller, or API clients either, despite `phase2.md`/`phase4.md` claiming 16 + more frontend tests for those.

## Backend (`backend/`)

**Stack:** FastAPI, Pydantic v2, Qiskit 2.5 + Qiskit Aer 0.17, pytest, httpx, Python 3.13.

- `POST /simulate` — Circuit IR → Qiskit `QuantumCircuit` → Aer execution → statevector + measurement histogram + per-qubit Bloch angles (with honest `pure:false`/`null` angles for entangled qubits).
- `POST /api/tutor/analyze` — four deterministic conceptual-mistake checks (measurement-before-entanglement, gates-after-measurement, missing-superposition-before-control, redundant self-inverse pairs) combined with an Ollama/llama3 LLM provider behind a swappable `Protocol` interface; graceful `source:"deterministic"` fallback if the LLM is unreachable; warm-up + `keep_alive` to avoid Ollama cold-start timeouts.
- Independent second implementation of gate registry + validation rules (backend never trusts the frontend's checks).
- CORS restricted to explicit dev origins (`ALLOWED_ORIGINS` env var for prod).
- Sanitized error responses (structural 422 via Pydantic, semantic 422 custom, Aer failures generic 500 — never a raw traceback).

**Verified now:** `pytest` → **17 tests passing** — but these are only the tutor tests (`test_tutor_api.py`, `test_tutor_checks.py`, `conftest.py`). The Phase 2 core suite documented in `phase2.md` (`test_health.py`, `test_circuit_builder.py`, `test_simulate.py` — 28 tests covering `/simulate`, Bell states, RX/RY/RZ, SWAP, invalid input, NaN handling) **does not exist in the repo** — those files aren't in `backend/tests/` and were never committed to git.

An earlier iteration of the tutor used the Anthropic/Claude API before being fully replaced with Ollama/llama3 per explicit request — no Claude code path remains, but a stray leftover file `backend/=0.40` (an accidental shell-redirect artifact from a `pip install "anthropic>=0.40"`-style command) is still sitting untracked in the repo root of `backend/` and should be deleted.

## Simulation

- **Local (in-browser):** `src/simulation/state-vector-simulator.ts` — dependency-free statevector engine, bit-manipulation on `Float64Array`, no matrix library. Debounced auto-recompute, capped at 14 qubits before requiring manual refresh.
- **Backend (Qiskit Aer):** exact statevector + real random shot sampling for counts, reduced-density-matrix Bloch angles via partial trace.
- **Bloch spheres:** local mirror of the backend's Bloch math so local mode doesn't need a round trip; SVG-projected (no 3D library), CSS-transition animated (320ms).
- **Q-sphere:** SVG projection by Hamming weight, draggable rotation, phase-colored/probability-sized dots.
- **Not exercised:** the "mixed state" (mid-entanglement, mid-CX) rendering path on the Bloch sphere exists in code but per `phase3.md` was never verified live.

## Deployment

- `render.yaml` (backend → Render) and Vercel auto-detection (frontend, `VITE_BACKEND_URL` env var) are in place. Deploy order and required env vars (`ALLOWED_ORIGINS`, `OLLAMA_BASE_URL`) documented in `README.md`/`backend/README.md`. Not verified in this audit whether an actual Render/Vercel deployment has been done — only that the config files exist.

## Pending / gaps

1. **Test suite regression (biggest gap).** Documented test counts (94 frontend, 28+17 backend) don't match reality (2 frontend, 17 backend). Either restore the Phase 1/2 test files from wherever they were written, or treat the phase logs' test claims as aspirational and backfill real coverage for: gate registry, validation, store mutations/undo-redo, Qiskit generator/parser round-trip, serialization, local simulator, Q-sphere geometry, `/simulate` endpoint, `circuit_builder`.
2. **Untracked working-tree clutter** — `DEUTSCH_JOZSA_GUIDE.md`, `DEUTSCH_JOZSA_TALK.md` (demo/pitch material, fine to keep but should be committed or moved out of repo root), `explain.md` (dev walkthrough doc, same), and `backend/=0.40` (stray artifact, should be deleted) are all uncommitted.
3. **Multi-qubit tutor checks** — only 4 conceptual checks implemented; SWAP misuse, redundant CX pairs, over-rotation via repeated RX/RY explicitly deferred (`phase4.md` §6).
4. **Mixed-state Bloch rendering** — code path exists, unverified live.
5. **Responsive/narrow-viewport layout** — explicitly out of scope so far (`phase1.md`).
6. **No collaborative/multi-user features** — single-user, localStorage-only persistence; out of scope so far.
7. **Actual deployment unverified** — config exists but no confirmation a live Vercel+Render instance is up.

## Recommendation

Before treating this as demo-ready for judging, prioritize: (a) restoring/writing real automated coverage for the core simulate/validate/generate/parse path since that's currently unguarded by tests, (b) cleaning the four untracked root-level files, (c) confirming a live deployed URL actually works end-to-end (Vercel frontend hitting Render backend hitting Ollama or gracefully falling back).
