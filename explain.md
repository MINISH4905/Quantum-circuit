# Quantum Circuit Lab — A Walkthrough

This document explains the project by walking through it the way a user
(and then a developer reading the code) actually experiences it: open the
app, land on the homepage, build a circuit, watch it simulate live, get
tutored on it, save it, and reopen it later. At each step we stop and trace
exactly what fires under the hood — which file, which function, which
store. By the end you'll have touched every major system in the app in the
order you'd naturally discover them.

For the chronological build history (what was added in which phase and
why), see `phase1.md` through `phase4.md`. This file is the "how does it
all work" tour, not the changelog.

---

## Stop 0: What you're walking through

**Quantum Circuit Lab** is a teaching tool for quantum computing. You build
a circuit visually, and everything else — the equivalent Qiskit code, the
simulated results, the Bloch/Q-sphere visualizations, an AI tutor's
commentary — updates live, with no "Run" button anywhere. Stack: React 19 +
TypeScript + Vite frontend, Zustand for state, a FastAPI + Qiskit Aer
backend for real simulation, and a local Ollama/`llama3` LLM behind the
tutor.

Keep one idea in your head for the whole walkthrough: **there is exactly
one canonical circuit object**, called the Circuit IR
(`src/circuit/model/types.ts`), living in a single Zustand store. Every
screen you're about to visit reads from it or writes to it — nothing keeps
a private copy. That single fact is why editing the code panel updates the
canvas, why undo/redo works uniformly, and why the tutor is always talking
about the circuit actually on screen.

```ts
interface QuantumCircuit {
  version: 1;
  qubits: number;
  classicalBits: number;
  operations: QuantumOperation[];   // { id, gate, targets, controls?, parameters?, timeStep }
}
```

---

## Stop 1: The landing page

You open `http://localhost:5173`. `src/main.tsx` mounts `AppRoot.tsx`,
which is the entire app's router — not a routing library, just a
`useState<View>` with four values: `"landing" | "dashboard" | "learner" |
"folders"`. On first load, `view === "landing"`, so you see
`src/pages/LandingPage.tsx`: a hero section and three feature cards —
**Folders**, **Interactive Circuit Editor**, **Learner**. Each card is a
button that calls a callback prop (`onExplore` / `onLearn` / `onFolders`)
which just flips `AppRoot`'s `view` state. No page reload, no URL change —
it's a single-page app with a hand-rolled switch statement for navigation.

You click **"Explore the Dashboard."** `view` becomes `"dashboard"`, and
`AppRoot` renders `<App />` — the circuit editor. This is where the rest of
the walkthrough happens.

---

## Stop 2: The editor loads — empty circuit, already live

`App.tsx` mounts the three-column IBM-Quantum-Composer-style layout: gate
palette + inspector on the left, canvas + toolbar + visualization panels in
the center, the Qiskit code panel on the right. It also mounts two
invisible components you won't see but that are running from the first
frame: `BackendSimulationController` and `TutorController`. Both watch
`circuit-store` and react to every change — there's no button that "starts"
simulation or tutoring; they're just always subscribed.

The store starts with a default circuit (a couple of empty qubits, no
operations). Because the store already has a value, the code panel
(`CodeEditorPanel.tsx`) immediately generates and shows the equivalent
(empty) Qiskit code, and the Probabilities panel shows `|00⟩` at 100%.
Nothing is uninitialized — you're looking at a live simulation of the empty
circuit before you've touched anything.

---

## Stop 3: You place your first gate — tracing one click all the way through

This is the walkthrough's core: what actually happens, file by file, when
you click the **H** (Hadamard) button in the gate toolbox.

**1. The toolbox.** `src/components/gates/GateToolbox.tsx` renders one
icon per entry in the gate registry (`src/circuit/gate-registry/registry.ts`
— the single array that defines every gate's symbol, qubit roles, parameter
count, and Qiskit method name; nothing else in the codebase hard-codes gate
behavior). Clicking H calls the same handler a drag-and-drop would (via
dnd-kit) — click-to-add exists specifically so keyboard/accessibility users
aren't forced into drag gestures.

**2. Placement.** `buildDefaultOperation` in `circuit/model/placement.ts`
picks a sensible default qubit and time step for the new gate, using
`findFreeTimeStep` so it never silently overwrites something already
there.

**3. The store.** The handler calls `circuit-store`'s `addOperation`. This
wrapper first snapshots the *previous* circuit into undo history, then
applies the new operation — which is why every kind of edit (drag,
parameter tweak, or a successful code parse) becomes a uniform undo step.

**4. Validation.** On every mutation, `circuit/validation/validate.ts` runs
over the whole circuit: unknown gate ids, wrong control/target counts,
out-of-range qubit indexes, a qubit used as both control and target, wrong
parameter counts, non-finite parameters, `measure` targeting a qubit with
no classical bit. Nothing is silently dropped — problems surface as a red
outline on the offending gate and a message in the Inspector.

**5. The canvas re-renders.** `CircuitCanvas.tsx` reads the updated circuit
from the store and draws the new H gate on the grid — a colored glyph on
qubit 0's wire, at whatever time step it landed on.

**6. The code panel reacts.** A `useEffect` in `CodeEditorPanel.tsx` is
watching the store's circuit. It regenerates Qiskit code via
`circuit/generator/qiskit-generator.ts`, which walks the IR in time-step
order and emits one `qc.<gate>(...)` line per operation. You now see
`qc.h(0)` appear in the Monaco editor on the right — generation is
deterministic, so this text is stable and idempotent (round-trip tested).

**7. Simulation kicks off automatically.** `BackendSimulationController`
(if you're in Local mode, this is really just the local simulator running
inline) sees the circuit changed, debounces ~300-400ms, and recomputes. The
local engine, `simulation/state-vector-simulator.ts`, applies H's 2×2
unitary directly to a `Float64Array` pair via bit manipulation — no matrix
library. The Probabilities panel's bars animate from `|00⟩` @ 100% to `|00⟩`
and `|01⟩` @ 50% each (CSS transition, 320ms, not a snap). The Bloch sphere
for qubit 0 rotates from the north pole to the equator. The Q-sphere
updates too.

**8. The tutor reacts too.** `TutorController` sees the same circuit change,
debounces 300ms, and fires a request (traced in full at Stop 6).

All of that — steps 3 through 8 — happens from one click, with no "Run"
button anywhere in the chain. This propagation pattern (store mutation →
validation → every dependent view independently re-derives) is the
template for *every* interaction in the rest of this walkthrough, so we'll
go faster from here.

---

## Stop 4: You edit the code panel instead

Say you now select all the generated code and type `qc.cx(0, 1)` by hand.
Keystrokes are debounced 400ms, then `circuit/parser/qiskit-parser.ts`
parses it — a line-oriented parser for a **documented, explicit subset** of
Qiskit, not arbitrary Python. It understands the constructor line, all 13
registered gates, and `pi`-expression parameters. On success, the parsed
circuit is pushed through the same `setCircuit` store action visual edits
use — with a ref flag set so the code-regeneration `useEffect` from Stop 3
doesn't immediately overwrite what you just typed. On failure (typo, unknown
method, wrong arg count), you get an error like:

```
Unsupported Qiskit operation: qc.foo(...)
Supported gates: H, X, Y, Z, S, T, RX, RY, RZ, CX, CZ, SWAP, MEASURE
```

and — importantly — **the last valid circuit is left untouched**. A typo in
the code panel never corrupts your working circuit; you just see the error
as an editor squiggle and in a list below.

---

## Stop 5: You add a rotation gate and tweak its angle

Click **RX** and place it, then click the gate to select it. The Inspector
panel (`src/components/panels/GateInspector.tsx`) shows its qubit, time
step, and a parameter field with one-click presets (π, π/2, π/4, −π/2, 2π).
Type `pi/2` directly and it works too — parameters are parsed by a small
hand-written grammar (`circuit/model/parameter-expr.ts`,
`parseParameterExpression`) that understands numbers and `pi`-fraction
expressions like `2*pi` or `-pi/4`. It's deliberately **not** `eval()`,
since this is parsing arbitrary text a user typed. The same module's
`formatParameter` turns the stored radian value back into the shortest
matching `pi` expression for both the Inspector display and the generated
Qiskit code.

---

## Stop 6: Watching the tutor explain what you just built

Below the code panel sits the **AI Tutor** panel (`TutorPanel.tsx`) with
three fixed sections: 🧑‍🏫 Explanation, ⚠️ Conceptual Warning, 💡
Optimization. It updated automatically after every gate you placed above —
no "Ask" button. Here's the full round trip that ran each time, using the
H+CX circuit you've been building as the example:

**1. Deterministic checks run first, with no LLM involved.**
`backend/app/tutor_checks.py` has four pure functions over the Circuit IR:
- *Measurement before entanglement* — a qubit measured, then later used in
  a CX/CZ/SWAP.
- *Gates after measurement* — a gate on a qubit after it was measured.
- *Missing superposition before a CX/CZ control* — the control qubit never
  saw an H/RX/RY first, so the "entangling" gate is really just a
  deterministic flip. (If you'd placed the CX before the H in Stop 3, this
  is exactly what would fire — a very common beginner mistake.)
- *Redundant self-inverse pairs* — the same self-inverse gate (H/X/Y/Z)
  twice in a row on one qubit, nothing in between, cancels to identity.

**2. The circuit gets simulated once** — `tutor.py::build_tutor_response`
reuses the exact same `run_statevector` / `compute_bloch_angles` calls
`/simulate` makes, so the tutor never re-does work the panels already did.
It builds a plain-text circuit summary and a simulation summary (exact
outcome probabilities, per-qubit Bloch state).

**3. Both go to the LLM as ground truth, not as a question.** The
deterministic findings, the circuit summary, and the simulation summary are
handed to `llm_provider.py`'s `TutorLLMProvider` — a `Protocol` interface
implemented by `OllamaTutorProvider`, which calls a local Ollama server
(`llama3`, no API key, nothing leaves the machine) using a schema-
constrained response format so you get guaranteed-parseable JSON back, not
free text to regex apart. **The model's job is to phrase the findings, not
detect them** — `warning.detected = bool(deterministic_issues) or
llm_output.warning_detected`, so a real structural mistake can never be
talked away by the model.

**4. Graceful degradation.** If Ollama isn't running, `build_tutor_response`
falls back to a deterministic-only response (`source: "deterministic"`) —
never a 500. The panel shows a subtle badge in that case instead of failing
silently.

**5. Same reliability pattern as the simulation controller.**
`TutorController.tsx` mirrors `BackendSimulationController` exactly: 300ms
debounce, 60s timeout (generous, because a cold Ollama model reload can
take 30-60s — mitigated separately by a FastAPI startup warm-up hook and
`keep_alive: 30m` on every request), and a request-id counter so a slow,
stale response can never overwrite a newer one if you keep editing while a
request is in flight.

---

## Stop 7: Switching to the real Qiskit Aer backend

So far, every simulation you've seen ran in-browser via
`simulation/state-vector-simulator.ts` — instant, no network. Now click the
**"Local / Qiskit Aer"** toggle in the canvas toolbar. This flips
`simulation-store`'s `mode` to `"backend"`.

`BackendSimulationController` (mounted since Stop 2, previously idle in
this mode) now actually fires: it POSTs your Circuit IR as-is to
`POST /simulate` on the FastAPI backend. On the Python side:

1. **Pydantic validates structure** — the request models in
   `backend/app/models.py` are a deliberate field-for-field mirror of the
   frontend's TypeScript types, so nothing was reinvented crossing
   languages. Structural errors (wrong types, missing fields) auto-reject
   with `422`.
2. **`backend/app/validation.py` re-validates semantics** — the same rules
   as Stop 3's frontend validation, reimplemented independently, because
   the backend is a separate trust boundary and never assumes the request
   already went through the frontend's checks.
3. **`circuit_builder.py` turns the IR into a real `QuantumCircuit`** —
   operations sorted deterministically (time step, then lowest qubit, then
   operation id), applied as
   `getattr(qc, gate.qiskit_name)(*parameters, *controls, *targets)`. That
   one line works for every registered gate because the gate registry's
   field order was designed to match Qiskit's real method signatures.
4. **`simulator.py` runs it on Qiskit Aer** — exact amplitudes via
   `AerSimulator(method="statevector")`, plus real random shot sampling for
   counts (not deterministic rounding), plus the same Bloch-angle math
   described in Stop 6's simulation summary, including the honest
   `{theta: null, phi: null, pure: false}` result for an entangled qubit
   that has no single point on the Bloch sphere.
5. **The response comes back and replaces what you'd see locally** — same
   Probabilities/Bloch/Q-sphere panels, just now backed by real Aer output
   instead of the hand-rolled simulator.

If the backend is down or slow, the controller's 6-second timeout kicks in,
the panels show a warning banner, and — because the local simulator has
been quietly kept up to date in the background the whole time regardless of
mode — you fall back to that instead of a blank screen.

---

## Stop 8: Saving your circuit

Click **Save file** in the top toolbar. `circuit/model/serialization.ts`
serializes the current IR into a versioned JSON schema
(`{ version: 1, qubits, classicalBits, operations, metadata? }`) and
triggers a browser download. Separately, the same action calls
`saved-circuits-store.ts`'s `saveCircuit`, which persists a copy to
`localStorage` (key `quantum-circuit-lab.saved-circuits`) — this is what
makes it show up on the Folders page next, independent of the downloaded
file. Loading a file later goes through `deserializeCircuit`, which
structurally validates every field before accepting it — a malformed file,
wrong version, or bad operation shape gets rejected with a specific
message, and your current circuit is left alone.

---

## Stop 9: Visiting Folders

Click **← Home**, then the **Folders** card. `src/pages/FoldersPage.tsx`
renders a grid combining two sources:

- **Your saved circuits**, read straight from `saved-circuits-store` — the
  one you just saved in Stop 8 is here, with a delete button and a
  timestamp.
- **Worked examples**, from `src/circuit/examples/worked-examples.ts` — a
  **Deutsch–Jozsa** circuit (2 input qubits + 1 ancilla, a balanced oracle
  `f(x0,x1) = x0 XOR x1` via two CX gates) and a **Grover's Search** circuit
  (2 qubits, one oracle-marks-`|11⟩` iteration). These are built directly as
  Circuit IR using the same `op`/`buildCircuit` helpers any hand-built
  circuit uses — clicking one runs through the *exact* same store, code
  generator, simulator, and tutor as anything you built yourself in this
  walkthrough. Nothing about worked examples is special-cased.

Click any card and `openInEditor` calls `setCircuit` + `setName` on the
store and switches you back to the dashboard — you land back at Stop 3's
flow, now with a real Deutsch–Jozsa circuit to poke at instead of an empty
one.

---

## Stop 10: Visiting Learner

Back to Home, then the **Learner** card. `LearnerPage.tsx` renders a static
course-catalog of `LEARNER_CONCEPTS` (`src/learner/concepts.ts`) — things
like Qubit, Superposition, Hadamard Gate — each with a one-line blurb, an
everyday analogy ("a spinning coin, not just a flipped one"), and a fuller
explanation. This page is purely informational: it never touches
`circuit-store` or loads anything into the editor. It's meant to be read
alongside building circuits, not instead of it.

---

## Stop 11: Running and deploying it yourself

```bash
# Frontend (repo root)
npm install
npm run dev              # http://localhost:5173 — local simulator works with no backend

# Backend (separate terminal, backend/)
cd backend
python -m venv .venv && .venv/Scripts/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Optional: AI tutor (separate terminal)
ollama pull llama3        # once
ollama serve               # tutor gracefully falls back to rule-based text if this isn't running
```

```bash
npm run test           # frontend tests (Vitest)
cd backend && pytest   # backend tests
```

**Deploying**: frontend → **Vercel** (auto-detects Vite; set
`VITE_BACKEND_URL` to your backend's URL, otherwise it falls back to
`http://localhost:8000`, fine only for local dev). Backend → **Render** (or
any host running a persistent Python process — Qiskit Aer is too
heavy/slow-starting for typical serverless functions); `render.yaml` at the
repo root automates this. Deploy order: backend first (to get its URL) →
set `VITE_BACKEND_URL` on Vercel → set `ALLOWED_ORIGINS` on Render to the
Vercel URL → redeploy the backend. `OLLAMA_BASE_URL` is optional in
production — the tutor just falls back to rule-based explanations without
it, same as Stop 6's graceful-degradation path.

---

## What the walkthrough revealed: the patterns underneath

Having now walked click-by-click through every screen, a few conventions
should be visible as *repeats*, not coincidences:

1. **One source of truth per concern.** The Circuit IR is the only circuit
   state anywhere (Stop 0). `simulation-store` and `tutor-store` hold only
   derived *results*, never a copy of the circuit — every panel
   independently re-derives from the same store rather than sharing state
   through some new abstraction.
2. **No "Run" button, ever.** Every stop from 3 onward is triggered by a
   store mutation flowing through a short debounce into whatever reacts to
   it — simulation, code generation, the tutor. You never click "compute."
3. **Graceful degradation, never a blank or broken screen.** Backend down
   (Stop 7)? Fall back to the local simulator with a warning banner. LLM
   down (Stop 6)? Fall back to deterministic tutor text. Bad code typed
   (Stop 4)? Keep the last valid circuit and show inline errors.
4. **The backend never trusts the frontend.** Stop 7's backend re-runs
   validation independently rather than assuming a request already passed
   the frontend's checks (Stop 3) — separate trust boundary, separate
   implementation.
5. **Minimal dependencies, hand-rolled where it's cheap to.** No 3D library
   for the Bloch/Q-spheres (SVG projection instead), no `eval()` for
   parameter parsing (Stop 5's small grammar instead), no chat framework
   for the tutor (a typed request/response cycle instead, Stop 6).

---

## Project structure, for reference after the tour

```
src/
├── circuit/
│   ├── model/          IR types, id gen, parameter expressions, placement, timing, serialization
│   ├── gate-registry/  centralized gate definitions
│   ├── generator/       IR → Qiskit
│   ├── parser/          Qiskit → IR
│   ├── validation/       circuit/operation validation
│   └── examples/         worked-example circuit builders (Deutsch–Jozsa, Grover)
├── simulation/           statevector simulator, Q-sphere projection, local Bloch-angle math
├── state/                 Zustand stores: circuit, ui, simulation, tutor, saved-circuits
├── learner/               static content for the Learner page
├── pages/                 LandingPage, FoldersPage, LearnerPage
├── api/                   typed fetch clients (simulation-api, tutor-api)
├── components/
│   ├── circuit/           canvas, placed gates, grid cells, canvas toolbar
│   ├── gates/              toolbox, gate glyph rendering
│   ├── code-editor/        Monaco panel + sync logic
│   ├── panels/             gate inspector
│   ├── simulation/         probabilities panel, Bloch sphere(s), Q-sphere panel, backend controller
│   ├── tutor/               tutor controller + panel
│   └── toolbar/             top app bar (save/load)
├── AppRoot.tsx            top-level view router (landing/dashboard/learner/folders)
├── App.tsx                the circuit editor "dashboard" view
└── tests/                 Vitest specs

backend/
├── app/
│   ├── main.py            FastAPI app: CORS, /health, /simulate, /api/tutor/analyze
│   ├── models.py          Pydantic mirror of the Circuit IR
│   ├── gate_registry.py   Python mirror of the frontend gate registry
│   ├── validation.py      Python mirror of the frontend validation rules
│   ├── circuit_builder.py Circuit IR → Qiskit QuantumCircuit
│   ├── simulator.py       Qiskit Aer execution + Bloch angle math
│   ├── tutor_checks.py    deterministic circuit-mistake detectors
│   ├── llm_provider.py    LLM provider interface + Ollama implementation
│   ├── tutor.py            tutor orchestration
│   └── tutor_models.py    tutor request/response Pydantic models
└── tests/                  pytest specs mirroring the app/ modules
```
