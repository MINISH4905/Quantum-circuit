# Quantum Circuit Lab

A full-stack visual quantum circuit editor built for learning and experimentation. Drag-and-drop gates onto qubit wires, see live Qiskit Python code, run simulations (in-browser or via a real Qiskit Aer backend), explore results through Bloch sphere and Q-sphere visualizations, and get circuit-grounded feedback from an AI tutor — all in the browser.

---

## Table of Contents

- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Frontend Deep Dive](#frontend-deep-dive)
  - [Pages and Navigation](#pages-and-navigation)
  - [Circuit Data Model (IR)](#circuit-data-model-ir)
  - [Gate System](#gate-system)
  - [Qiskit Code Generation and Parsing](#qiskit-code-generation-and-parsing)
  - [State Management](#state-management)
  - [Simulation Engine](#simulation-engine)
  - [UI Components](#ui-components)
  - [Drag-and-Drop](#drag-and-drop)
  - [Walkthrough System](#walkthrough-system)
  - [Worked Examples and Saved Circuits](#worked-examples-and-saved-circuits)
- [Backend Deep Dive](#backend-deep-dive)
  - [API Endpoints](#api-endpoints)
  - [Circuit Building Pipeline](#circuit-building-pipeline)
  - [Qiskit Aer Simulation](#qiskit-aer-simulation)
  - [AI Tutor System](#ai-tutor-system)
  - [Deterministic Circuit Checks](#deterministic-circuit-checks)
  - [LLM Provider](#llm-provider)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Testing](#testing)
- [Key Design Decisions](#key-design-decisions)

---

## Features

| Area | What it does |
|---|---|
| **Visual Circuit Editor** | Drag-and-drop gates onto qubit wires in a grid canvas with undo/redo, copy/paste, and keyboard navigation |
| **Live Code Sync** | Bidirectional sync between the visual circuit and a Monaco-powered Qiskit Python editor — edit either side and the other updates |
| **Dual Simulation** | In-browser state-vector simulator (instant, up to 14 qubits) or real Qiskit Aer backend (any size the server can handle) |
| **Visualizations** | Probability histogram, per-qubit Bloch spheres, interactive Q-sphere with drag-to-rotate |
| **AI Tutor** | Circuit-grounded explanations, warnings, and optimization tips via deterministic checks + optional LLM (Ollama) |
| **Learner Hub** | 10 quantum computing concepts with analogies and expandable explanations |
| **Folders / Library** | Save/load circuits to localStorage and JSON files; two built-in worked examples (Deutsch–Jozsa, Grover's Search) |
| **Guided Walkthrough** | 7-step interactive tour highlighting every part of the editor on first visit |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend (React SPA)                  │
│                                                         │
│  ┌──────────┐  ┌────────────┐  ┌─────────────────────┐  │
│  │ Circuit  │  │  Monaco    │  │   Visualizations    │  │
│  │ Canvas   │◄─┤  Code      │  │  (Probabilities,    │  │
│  │ (DnD)    │─►│  Editor    │  │   Bloch, Q-sphere)  │  │
│  └────┬─────┘  └────────────┘  └──────────▲──────────┘  │
│       │                                   │              │
│       ▼                                   │              │
│  ┌──────────────────────────────────┐     │              │
│  │  Circuit Store (Zustand)         │─────┘              │
│  │  QuantumCircuit IR + Undo/Redo   │                    │
│  └───────────┬──────────────────────┘                    │
│              │                                           │
│   ┌──────────┴───────────┐                               │
│   │ Local State-Vector   │  (in-browser, no backend)     │
│   │ Simulator            │                               │
│   └──────────────────────┘                               │
└──────────────────┬──────────────────────────────────────┘
                   │ POST /simulate, POST /api/tutor/analyze
                   ▼
┌─────────────────────────────────────────────────────────┐
│                 Backend (FastAPI)                        │
│                                                         │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ Validate │─►│ Build Qiskit │─►│ Run on Aer        │  │
│  │ Circuit  │  │ Circuit      │  │ (statevector +    │  │
│  │          │  │              │  │  shot sampling)   │  │
│  └──────────┘  └──────────────┘  └───────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │ AI Tutor Pipeline                                │   │
│  │ deterministic checks + optional Ollama LLM       │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

The frontend works fully standalone — the in-browser simulator needs no backend. The backend adds Qiskit Aer simulation (higher qubit counts, shot-based measurement) and the AI tutor.

---

## Tech Stack

### Frontend
| Dependency | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript 6 | Type safety |
| Vite 8 | Build tool and dev server |
| Zustand 5 | State management (6 stores) |
| @dnd-kit/core | Drag-and-drop for gate placement |
| Monaco Editor | Embedded Python code editor |
| oxlint | Linting |
| Vitest + Testing Library | Unit/integration testing |

### Backend
| Dependency | Purpose |
|---|---|
| FastAPI | REST API framework |
| Pydantic v2 | Request/response validation |
| Qiskit ≥ 1.0 | Quantum circuit construction |
| Qiskit Aer ≥ 0.14 | Simulation (statevector + sampling) |
| Ollama (optional) | Local LLM for AI tutor (default: llama3) |
| Uvicorn | ASGI server |
| pytest + httpx | Testing |

---

## Project Structure

```
Quantum-circuit/
├── src/                          # Frontend source
│   ├── main.tsx                  # React entry point
│   ├── AppRoot.tsx               # Top-level view router (landing/dashboard/learner/folders)
│   ├── App.tsx                   # Dashboard — the circuit editor workspace
│   │
│   ├── circuit/                  # Circuit domain logic (no UI)
│   │   ├── model/
│   │   │   ├── types.ts          # QuantumCircuit & QuantumOperation IR types
│   │   │   ├── id.ts             # Unique operation ID generator (op_1, op_2, …)
│   │   │   ├── timing.ts         # findFreeTimeStep() — auto-place on grid
│   │   │   ├── placement.ts      # buildDefaultOperation() — smart defaults for new gates
│   │   │   ├── build-helpers.ts  # op() / buildCircuit() — programmatic IR construction
│   │   │   ├── parameter-expr.ts # Safe pi-expression parser/formatter (no eval)
│   │   │   └── serialization.ts  # JSON save/load with structural validation
│   │   ├── gate-registry/
│   │   │   ├── types.ts          # GateDefinition type
│   │   │   └── registry.ts       # 13 gates: H, X, Y, Z, S, T, RX, RY, RZ, CX, CZ, SWAP, Measure
│   │   ├── generator/
│   │   │   └── qiskit-generator.ts  # Circuit IR → Qiskit Python source
│   │   ├── parser/
│   │   │   └── qiskit-parser.ts     # Qiskit Python source → Circuit IR
│   │   ├── validation/
│   │   │   └── validate.ts          # Per-operation and full-circuit validation
│   │   └── examples/
│   │       ├── worked-examples.ts   # Deutsch–Jozsa & Grover's Search circuits
│   │       └── worked-examples.test.ts
│   │
│   ├── simulation/               # In-browser quantum simulation
│   │   ├── state-vector-simulator.ts  # Full statevector sim (all 13 gate matrices)
│   │   ├── bloch.ts                   # Per-qubit Bloch angles via partial trace
│   │   └── qsphere-layout.ts         # Q-sphere projection (Hamming-weight latitude)
│   │
│   ├── state/                    # Zustand stores
│   │   ├── circuit-store.ts      # Circuit IR + undo/redo (max 100 levels)
│   │   ├── simulation-store.ts   # Simulation mode (local/backend) + results
│   │   ├── ui-store.ts           # Selection, clipboard, focus state
│   │   ├── tutor-store.ts        # AI tutor results
│   │   ├── saved-circuits-store.ts   # localStorage-persisted circuit library
│   │   └── walkthrough-store.ts      # Guided tour state
│   │
│   ├── api/                      # Backend API clients
│   │   ├── simulation-api.ts     # POST /simulate, GET /health
│   │   └── tutor-api.ts          # POST /api/tutor/analyze
│   │
│   ├── components/               # React components
│   │   ├── circuit/              # Canvas grid, placed gates, toolbar
│   │   ├── gates/                # Gate palette (toolbox) and gate SVG glyphs
│   │   ├── panels/               # Gate inspector (properties editor)
│   │   ├── code-editor/          # Monaco-based Qiskit code editor
│   │   ├── simulation/           # Probabilities, Bloch spheres, Q-sphere panels
│   │   ├── toolbar/              # Top menu bar (file/edit/help, save/load)
│   │   ├── tutor/                # AI tutor panel + auto-fire controller
│   │   └── walkthrough/          # Guided tour overlay
│   │
│   ├── pages/                    # Top-level page components
│   │   ├── LandingPage.tsx       # Hero + feature cards
│   │   ├── FoldersPage.tsx       # Saved circuits + worked examples
│   │   └── LearnerPage.tsx       # Quantum concepts catalog
│   │
│   └── learner/
│       └── concepts.ts           # 10 quantum computing concepts (data)
│
├── backend/                      # Python backend
│   ├── app/
│   │   ├── main.py               # FastAPI app, CORS, endpoints
│   │   ├── models.py             # Pydantic request/response schemas
│   │   ├── gate_registry.py      # 13 gate definitions (mirrors frontend)
│   │   ├── validation.py         # Circuit validation (separate trust boundary)
│   │   ├── circuit_builder.py    # Circuit IR → Qiskit QuantumCircuit
│   │   ├── simulator.py          # Qiskit Aer execution + Bloch angle computation
│   │   ├── tutor.py              # AI tutor orchestrator
│   │   ├── tutor_checks.py       # 4 deterministic circuit analysis checks
│   │   ├── tutor_models.py       # Tutor request/response models
│   │   └── llm_provider.py       # LLM interface + Ollama implementation
│   ├── tests/
│   │   ├── conftest.py
│   │   ├── test_tutor_api.py     # 6 API-level tests with mock LLM
│   │   └── test_tutor_checks.py  # 10 unit tests for deterministic checks
│   ├── requirements.txt
│   └── README.md
│
├── samples/
│   └── bell-state.json           # Example circuit file
├── render.yaml                   # Render.com deployment blueprint
├── package.json
├── vite.config.ts
├── tsconfig.json
└── index.html
```

---

## Frontend Deep Dive

### Pages and Navigation

The app uses a state-driven view system (no router library). `AppRoot.tsx` holds a `View` state that switches between four views:

| View | Component | Purpose |
|---|---|---|
| `"landing"` | `LandingPage` | Hero section with animated CSS qubit-orbit visual and feature cards |
| `"dashboard"` | `App` | The main circuit editor workspace (three-column layout) |
| `"learner"` | `LearnerPage` | Course catalog of 10 quantum concepts with expandable cards |
| `"folders"` | `FoldersPage` | Saved circuits (localStorage) + worked examples |

### Circuit Data Model (IR)

The canonical data structure shared between frontend and backend:

```typescript
interface QuantumCircuit {
  version: 1;
  qubits: number;
  classicalBits: number;
  operations: QuantumOperation[];
}

interface QuantumOperation {
  id: string;            // e.g. "op_1", "op_2"
  gate: string;          // gate registry ID: "h", "cx", "rx", etc.
  targets: number[];     // target qubit indices
  controls?: number[];   // control qubit indices (for CX, CZ)
  parameters?: number[]; // rotation angles (for RX, RY, RZ)
  timeStep: number;      // column position on the grid
}
```

Supporting modules handle ID generation, automatic time-step placement, safe pi-expression parsing (`π/2`, `2π`, etc. — no `eval()`), and JSON serialization with structural validation.

### Gate System

13 gates registered in a centralized gate registry (mirrored identically on frontend and backend):

| Category | Gates | Details |
|---|---|---|
| Single-qubit | H, X, Y, Z, S, T | 1 target, 0 controls, 0 parameters |
| Rotation | RX, RY, RZ | 1 target, 0 controls, 1 parameter (θ) |
| Multi-qubit | CX (CNOT), CZ, SWAP | CX/CZ: 1 control + 1 target; SWAP: 2 targets |
| Measurement | Measure | 1 target, writes classical bit |

Each gate definition includes: `id`, `name`, `symbol`, `category`, `controlCount`, `targetCount`, `parameterCount`, `qiskitName`, and whether it `writesClassicalBit`.

### Qiskit Code Generation and Parsing

**Generator** (`qiskit-generator.ts`): Converts Circuit IR → valid Qiskit Python source code. Generates proper import statements, `QuantumCircuit` constructor, and gate method calls in time-step order. Parameters are formatted as human-readable pi-fraction expressions.

**Parser** (`qiskit-parser.ts`): Converts Qiskit Python source → Circuit IR. Supports:
- `qc = QuantumCircuit(n)` / `qc = QuantumCircuit(n, m)` constructors
- Gate calls: `qc.h(0)`, `qc.cx(0, 1)`, `qc.rx(pi/2, 0)`, etc.
- Pi expressions in parameters
- Returns structured parse errors with line numbers

The code editor (Monaco) and the visual canvas stay synchronized through this bidirectional pipeline, with a 400ms debounce on code edits.

### State Management

Six Zustand stores, each owning a distinct slice of application state:

| Store | Responsibility |
|---|---|
| `circuit-store` | Circuit IR, validation errors, undo/redo stacks (max 100). Every mutation is wrapped in `withHistory()`. |
| `simulation-store` | Simulation mode (`"local"` / `"backend"`), backend result/error/loading. |
| `ui-store` | Selected operation ID, clipboard (copy/paste), last focused qubit. |
| `tutor-store` | AI tutor analysis result, error, and loading state. |
| `saved-circuits-store` | Persisted to localStorage. Array of saved circuits for the Folders page. |
| `walkthrough-store` | Guided tour state (current step, open/dismissed, "seen" flag in localStorage). |

### Simulation Engine

#### In-Browser State-Vector Simulator

`state-vector-simulator.ts` — a pure TypeScript simulator operating on `Float64Array` pairs (real + imaginary) representing the full state vector. Implements all 13 gate unitary matrices.

- `computeStatevector(circuit)` — initializes |0…0⟩ and evolves through all gates in time-step order. Measurement ops are no-ops during evolution.
- `runSimulation(circuit, shots)` — computes the statevector, then samples measurement outcomes probabilistically. Bitstrings follow Qiskit convention (highest qubit index = leftmost bit).
- Auto-runs for circuits ≤ 14 qubits (probabilities) / ≤ 8 qubits (Bloch/Q-sphere), debounced at 300ms.

#### Bloch Sphere Computation

`bloch.ts` — computes per-qubit Bloch angles by partial-tracing the full density matrix to get each qubit's reduced state. Returns `{ theta, phi, r, pure }` for each qubit. When the Bloch vector magnitude `r < 0.999` (e.g., the qubit is entangled), theta/phi are `null` and `pure = false`.

#### Q-Sphere Layout

`qsphere-layout.ts` — projects each computational basis state onto a sphere. Latitude is determined by Hamming weight (|0…0⟩ at the north pole, |1…1⟩ at the south pole). Same-weight states are evenly distributed around the latitude ring. Supports interactive rotation via pointer-drag (azimuth/elevation). Returns 2D projected coordinates, depth (for z-ordering), phase angle, and probability.

### UI Components

The dashboard layout (`App.tsx`) is a three-column workspace wrapped in a `DndContext`:

```
┌────────────────────────────────────────────────────────────┐
│                     Toolbar (top bar)                      │
│  Circuit name │ File │ Edit │ Help │ Save │ Load           │
├──────────┬─────────────────────────────┬───────────────────┤
│ Gate     │  Canvas Toolbar             │ Code Editor       │
│ Toolbox  │  (undo/redo, add qubit,     │ (Monaco, Python)  │
│          │   sim mode toggle)          │                   │
│          ├─────────────────────────────┤                   │
│ Gate     │  Circuit Canvas             │                   │
│ Inspector│  (grid of qubit wires,      │                   │
│          │   placed gates, DnD zones)  │                   │
│          ├─────────────────────────────┤                   │
│          │  Probabilities │ Bloch │ Q  │ Tutor Panel       │
│          │  histogram     │Sphere │Sph │ (AI feedback)     │
└──────────┴─────────────────────────────┴───────────────────┘
```

Key components:

- **CircuitCanvas** — Grid of droppable `GridCell` zones. Qubit wires rendered as horizontal lines, classical wire as a double line. Measurement connectors (dashed vertical lines) link measure gates to the classical wire.
- **PlacedGate / GateGlyph** — SVG rendering of gates. Control qubits get a filled dot, CX target gets ⊕, CZ target gets a dot, SWAP gets ×, others get a labeled box.
- **GateToolbox** — Categorized palette of draggable gates.
- **GateInspector** — Properties panel for the selected gate: qubits, time step, editable parameters with preset buttons (π, π/2, π/4), validation errors, delete.
- **CodeEditorPanel** — Monaco editor with bidirectional sync. Parse errors shown as inline markers. Status indicator shows "Synced" or error count.
- **ProbabilitiesPanel** — Bar chart histogram of measurement outcomes (top 16). Tooltips on hover.
- **BlochSpheresPanel** — One SVG Bloch sphere per qubit. Wireframe with X/Y/Z axes, |0⟩/|1⟩ poles, state vector arrow (hue from phi, dashed if mixed).
- **QSpherePanel** — Interactive SVG Q-sphere. Dot size = probability, dot color = phase. Drag to rotate, double-click to reset. Toggle labels and phase angles.

### Drag-and-Drop

Uses `@dnd-kit/core` with `PointerSensor` (4px activation distance). Two drag types:

- **`"new-gate"`** — Dragged from the GateToolbox onto a GridCell. On drop, `buildDefaultOperation()` creates a sensible operation (auto-placing multi-qubit gates on adjacent wires, finding a free time step).
- **`"move-gate"`** — Dragged from a PlacedGate. On drop, recalculates qubit offsets (clamped to valid range) and finds a free time step at the new position.

### Walkthrough System

A 7-step guided tour targeting DOM elements by CSS selector:

1. Circuit Editor overview
2. Gate Panel — where to find gates
3. Circuit Grid — how to place gates
4. Visualization Area — probabilities, Bloch, Q-sphere
5. Controls — undo/redo, qubits, time steps
6. AI Tutor — circuit-grounded feedback
7. Help Menu — keyboard shortcuts reference

Auto-launches on first visit (tracked via localStorage). Restartable via Help → "Take a Tour". Keyboard navigable (arrow keys, Enter, Escape). Spotlight overlay highlights each target element.

### Worked Examples and Saved Circuits

Two built-in worked examples constructed programmatically via `buildCircuit()`:

- **Deutsch–Jozsa Algorithm** — 3 qubits, 2 classical bits, balanced oracle (CX-based), 10 operations
- **Grover's Search** — 2 qubits, 2 classical bits, marks |11⟩, 12 operations

The **saved circuits store** persists to `localStorage` under `"quantum-circuit-lab.saved-circuits"`. The toolbar's Save action both downloads a `.json` file and saves to this store. The Folders page lists saved circuits with delete/reopen actions.

---

## Backend Deep Dive

### API Endpoints

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/health` | Health check → `{"status": "ok"}` |
| `POST` | `/simulate` | Accept Circuit IR, validate, build Qiskit circuit, run statevector + shot simulation + Bloch angles |
| `POST` | `/api/tutor/analyze` | Accept Circuit IR, run deterministic checks + optional LLM, return explanation/warnings/optimization |

CORS is configured via the `ALLOWED_ORIGINS` environment variable (defaults to `localhost:5173`).

### Circuit Building Pipeline

```
Circuit IR (JSON) → Validate → Build Qiskit QuantumCircuit → Execute on Aer
```

1. **Validation** (`validation.py`) — Re-validates every circuit server-side (separate trust boundary from the frontend). Checks: gate exists, correct control/target/parameter counts, qubit indices in range, no duplicate qubits, finite parameters, measurement classical bits match.

2. **Circuit Builder** (`circuit_builder.py`) — Converts validated IR into a real `qiskit.QuantumCircuit`. Operations sorted deterministically by `(timeStep, min involved qubit, operation id)`. Two build modes:
   - `build_statevector_circuit()` — all gates, no measurements, appended `save_statevector()`
   - `build_counts_circuit()` — all gates + measurements (uses explicit measures from IR, or falls back to measuring every qubit)

### Qiskit Aer Simulation

`simulator.py` runs the built circuits on `AerSimulator`:

- **Statevector** — method `"statevector"`, returns the full state vector
- **Counts** — default method, runs N shots, returns measurement histogram
- **Bloch angles** — computed via `partial_trace` of the full density matrix. If Bloch vector magnitude < 0.999 (qubit is entangled/mixed), theta/phi are `null` and `pure = false`

### AI Tutor System

The tutor pipeline in `tutor.py`:

1. Generate a human-readable circuit summary (qubits, gates in time order)
2. Generate a simulation summary (top 8 probabilities + per-qubit Bloch state)
3. Run 4 deterministic checks (always)
4. Ask the LLM for explanation/warning/optimization (if configured)
5. Merge results — **deterministic findings always win** if the LLM disagrees

The response includes a `source` field (`"llm"` or `"deterministic"`) so the frontend can show the appropriate badge.

### Deterministic Circuit Checks

Four rule-based checks in `tutor_checks.py` that run without any LLM:

| Check | What it catches |
|---|---|
| `find_measurement_before_entanglement` | Qubit measured then later used in CX/CZ/SWAP |
| `find_gates_after_measurement` | Gate applied to a qubit after it was already measured |
| `find_missing_superposition_before_control` | CX/CZ control qubit never put into superposition (no H/RX/RY) |
| `find_redundant_self_inverse_pairs` | Back-to-back identical self-inverse gates (H·H, X·X, etc.) that cancel out |

### LLM Provider

`llm_provider.py` defines a `TutorLLMProvider` protocol with an Ollama implementation:

- Connects to a local Ollama server (configurable via `OLLAMA_BASE_URL`, default `localhost:11434`)
- Default model: `llama3` (configurable via `OLLAMA_MODEL`)
- Uses Ollama's structured output (JSON schema) for reliable response parsing
- `warm_up()` fires a trivial request in a background thread at startup to pre-load the model
- 60s timeout for generation
- **Graceful degradation** — if Ollama isn't running or the LLM fails, the tutor falls back to deterministic-only responses. No API key required.

The provider is injected via FastAPI's dependency system, making it trivially swappable in tests (see `FakeProvider` in `test_tutor_api.py`).

---

## Getting Started

**See [QUICKSTART.md](QUICKSTART.md) for the full step-by-step setup**, including Google OAuth, the Postgres/Redis services, and the known Apple Silicon dependency issue.

### Prerequisites

- **Node.js 20.19+** (for the frontend — Vite 8 warns below this)
- **Python 3.11+** (for the backend)
- **Postgres 14+** and **Redis 7+** (required — see below)
- **Ollama** (for the AI tutor LLM, optional)

### The backend is no longer optional

Google SSO and instructor groups added `init_redis()` and `create_tables()` to the backend's startup lifespan (`app/main.py`), so **Postgres and Redis must be running for the backend to boot**. Login is also required to reach the editor — `/dashboard` is behind `ProtectedRoute`, so without OAuth configured you only get the landing and login pages.

The in-browser simulator still runs entirely client-side once you are past login, and still works if the backend goes down mid-session.

```bash
# Services
docker compose up -d postgres redis

# Terminal 1 — backend (create backend/.env first, see QUICKSTART.md)
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Terminal 2 — frontend
npm run dev
```

First backend start takes 60–90 seconds — Qiskit, Cirq, and PennyLane are imported at module load. Wait for `Application startup complete.`

Toggle "Qiskit Aer" in the canvas toolbar to use the backend simulator. The AI Tutor panel auto-fires on every circuit change.

### With Ollama (AI Tutor LLM)

```bash
# Install and start Ollama, then pull a model
ollama pull llama3
ollama serve

# Set env vars before starting the backend
export OLLAMA_BASE_URL=http://localhost:11434
export OLLAMA_MODEL=llama3
```

Without Ollama the tutor still works — it falls back to rule-based deterministic analysis.

---

## Deployment

### Frontend → Vercel

Import this repo in Vercel; it auto-detects Vite (build command `npm run build`, output `dist/`). Set one environment variable:

| Variable | Value |
|---|---|
| `VITE_BACKEND_URL` | Your deployed backend URL, e.g. `https://your-backend.onrender.com` |

If unset, falls back to `http://localhost:8000`.

### Backend → Render

A `render.yaml` blueprint at the repo root automates deployment. Environment variables:

| Variable | Required | Purpose |
|---|---|---|
| `ALLOWED_ORIGINS` | Yes | Comma-separated allowed CORS origins (your Vercel URL) |
| `OLLAMA_BASE_URL` | No | Ollama server URL (AI tutor degrades gracefully without it) |
| `OLLAMA_MODEL` | No | Ollama model name (default: `llama3`) |

**Deploy order:** backend first (to get its URL) → set `VITE_BACKEND_URL` on Vercel → set `ALLOWED_ORIGINS` on Render to the Vercel URL → redeploy backend.

---

## Testing

```bash
# Frontend — vitest
npm run test

# Backend — pytest
cd backend
pytest
```

**Frontend tests:** Worked examples structural validation.

**Backend tests (16 total):**
- `test_tutor_api.py` (6 tests) — API-level tests with a mock LLM provider: LLM-backed responses, fallback to deterministic, deterministic warnings surviving LLM disagreement, invalid circuit → 422, LLM failure → fallback, empty circuit handling.
- `test_tutor_checks.py` (10 tests) — Unit tests for each deterministic check: redundant gate pairs, measurement ordering, superposition requirements, cross-qubit false positives, non-self-inverse gates, aggregation.

---

## Key Design Decisions

1. **Dual simulation architecture** — The in-browser simulator gives instant feedback without any server. The Qiskit Aer backend adds real quantum simulation fidelity and handles larger circuits. Users toggle between them.

2. **Centralized gate registry** — Both frontend and backend maintain identical gate registries. Validation, circuit building, code generation, and UI rendering all look up gates from this single source of truth.

3. **Separate trust boundaries** — The backend re-validates every circuit independently rather than trusting frontend validation. This is a deliberate defense-in-depth choice.

4. **Deterministic checks override LLM** — The AI tutor runs rule-based analysis alongside the LLM. If they disagree, deterministic findings always win. This prevents the LLM from silently suppressing real issues.

5. **Graceful degradation everywhere** — No backend? Local simulator works. No Ollama? Deterministic tutor works. Backend unreachable mid-session? Falls back to local simulation. Every optional component degrades cleanly.

6. **Bidirectional code sync** — The Monaco editor and visual canvas share the same Circuit IR. Changes in either direction are parsed/generated through the Qiskit code pipeline, keeping them always consistent.

7. **Bloch sphere purity handling** — Entangled qubits report theta/phi as `null` with `pure = false` instead of showing a misleading point on the Bloch sphere. The UI renders these as dashed arrows.

8. **Deterministic operation ordering** — Operations are sorted by `(timeStep, min qubit, operation id)` on both frontend and backend, ensuring the Qiskit code generator and the Aer circuit builder produce identical circuits.
