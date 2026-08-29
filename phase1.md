# Dual-Mode Quantum Circuit Editor — Build Log

Status snapshot of everything implemented so far. 78/78 tests passing, typecheck clean, production build clean.

Stack: React + TypeScript + Vite, Zustand (state), dnd-kit (drag/drop), Monaco Editor (code panel), Vitest (tests).

---

## 1. Core architecture: Circuit IR as the single source of truth

Everything in the app — the visual canvas, the generated Qiskit code, the simulator, save/load — reads from and writes to one canonical data structure. Nothing else holds its own copy of circuit state.

```
src/circuit/model/types.ts
```

```ts
interface QuantumCircuit {
  version: 1;
  qubits: number;
  classicalBits: number;
  operations: QuantumOperation[];
}

interface QuantumOperation {
  id: string;
  gate: string;          // gate registry id, e.g. "h", "cx", "rx"
  targets: number[];
  controls?: number[];
  parameters?: number[]; // radians
  timeStep: number;
}
```

Data flow:

```
                Circuit IR (Zustand store)
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
   Visual Canvas   Qiskit Generator   Simulator
          ▲             │
          │             ▼
          └────── Qiskit Parser ◄──── user edits code
```

Visual edits call store actions directly. Code edits get parsed back into the same IR shape and pushed through `setCircuit`. Neither path maintains a separate shadow copy.

## 2. Gate registry

```
src/circuit/gate-registry/{types,registry}.ts
```

A single array of `GateDefinition` objects is the only place gate behavior is declared — symbol, qubit roles, parameter count, and the exact Qiskit method name it maps to. Nothing else in the codebase hard-codes gate logic; every component (canvas, toolbox, generator, parser, simulator) looks gates up here.

Registered: `H, X, Y, Z, S, T` (single-qubit), `RX, RY, RZ` (rotation, 1 parameter each), `CX, CZ` (1 control + 1 target), `SWAP` (2 targets, no control), `MEASURE` (writes a classical bit).

## 3. Validation

```
src/circuit/validation/validate.ts
```

Runs on every store mutation: unknown gate ids, wrong control/target counts, out-of-range qubit indexes, a qubit used as both control and target, wrong parameter counts, non-finite parameters, measure targeting a qubit with no matching classical bit. Errors are collected per-operation and surfaced in the UI (red outline on the bad gate, message in the Inspector) — invalid state is never silently dropped.

## 4. State management

```
src/state/circuit-store.ts   — the canonical circuit + undo/redo history
src/state/ui-store.ts        — ephemeral UI state (selection, clipboard, focused qubit)
```

`circuit-store` wraps every mutation (`addOperation`, `removeOperation`, `updateOperation`, `addQubit`, `insertTimeStep`, etc.) in a history-tracking helper that snapshots the previous circuit before applying a change, so `undo()`/`redo()` work uniformly across every kind of edit — visual drags, parameter edits, and successful code parses all become undo steps.

## 5. Visual circuit editor

```
src/components/circuit/{CircuitCanvas,PlacedGate,GridCell,CanvasToolbar}.tsx
src/components/gates/{GateToolbox,GateGlyph}.tsx
```

- Qubit rows with wire lines, a timeline of columns, and a classical-bit rail (`c2` etc.) with dashed connector lines down from measure gates.
- Gate toolbox: icon-only, color-coded by category (single/rotation/multi/measurement), draggable via dnd-kit **and** click-to-add (keyboard/accessibility path — drag is never the only way to place a gate).
- Placed gates are draggable to move them; multi-qubit gates render as a control dot + target glyph connected by a line, dragged as one unit.
- Selection, keyboard delete (Delete/Backspace), copy/paste (Ctrl+C/V), and keyboard-driven movement (arrow keys shift time step or qubit).
- Per-row "−" buttons on the canvas's right edge remove that specific qubit; a small toolbar above the canvas has undo/redo and ±qubit/±step icon buttons.
- `buildDefaultOperation` (in `circuit/model/placement.ts`) picks sensible default qubits/time-step for a newly dropped or clicked gate, using `findFreeTimeStep` to avoid overwriting existing gates.

## 6. Parameter editing (RX/RY/RZ)

```
src/components/panels/GateInspector.tsx
src/circuit/model/parameter-expr.ts
```

Selecting a gate shows an Inspector panel with its qubits, time step, and — for rotation gates — a text field plus one-click presets (π, π/2, π/4, −π/2, 2π). Parameters are parsed by a small hand-written grammar (`parseParameterExpression`) that accepts numbers and `pi`-fraction expressions like `pi/2`, `2*pi`, `-pi/4` — **no `eval()`**. The same module's `formatParameter` turns a radian value back into the shortest matching `pi` expression for display and code generation.

## 7. Qiskit code generation

```
src/circuit/generator/qiskit-generator.ts
```

Walks the IR (sorted by time step, then qubit) and emits one `qc.<gate>(...)` line per operation, adding `from numpy import pi` only if a parameterized gate is present. Output is deterministic and idempotent — regenerating from a freshly-parsed circuit produces byte-identical code (verified by round-trip tests).

## 8. Qiskit code parsing

```
src/circuit/parser/qiskit-parser.ts
```

Line-oriented parser for a **documented, explicit subset** of Qiskit — not arbitrary Python. Supports the constructor line, all 13 registered gates, and `pi`-expression parameters. Anything outside that subset (unknown methods, wrong arg counts, undefined circuit before use, bad syntax) produces a `{ line, message }` error with the exact supported-gate list, e.g.:

```
Unsupported Qiskit operation: qc.foo(...)
Supported gates: H, X, Y, Z, S, T, RX, RY, RZ, CX, CZ, SWAP, MEASURE
```

## 9. Two-way sync

```
src/components/code-editor/CodeEditorPanel.tsx
```

Monaco editor with Python syntax highlighting, line numbers, and error squiggles (via `monaco.editor.setModelMarkers`).

- **Visual → code**: a `useEffect` watches the store's circuit and regenerates code — *unless* the change originated from a successful parse (a ref flag prevents that loop).
- **Code → visual**: keystrokes are debounced 400ms, then parsed. On success, the IR updates (flagging the source so the effect above doesn't immediately overwrite the user's own text). On failure, **the last valid circuit is left untouched** and errors are shown both as editor markers and a list below the editor.

## 10. Save / Load

```
src/circuit/model/serialization.ts
```

Versioned JSON schema (`{ version: 1, qubits, classicalBits, operations, metadata? }`). `deserializeCircuit` structurally validates every field before accepting a file — malformed JSON, wrong version, or bad operation shapes are rejected with specific messages, and the current circuit is preserved on failure. Save triggers a browser download; Load reads a file via a hidden `<input type="file">`.

## 11. Simulation

```
src/simulation/state-vector-simulator.ts
src/simulation/qsphere-layout.ts
src/components/simulation/{ProbabilitiesPanel,QSpherePanel}.tsx
```

A dependency-free statevector simulator (`computeStatevector`) applies each gate's 2×2 unitary (or controlled/swap variant) directly to a `Float64Array` pair via bit manipulation — no matrix library. `runSimulation` samples the resulting distribution into shot counts.

Two live, auto-updating panels sit below the canvas:

- **Probabilities** — a bar-chart histogram (colors from a colorblind-validated categorical palette), auto-recomputes on every circuit change (debounced, capped at 14 qubits before requiring a manual refresh for performance).
- **Q-sphere** — projects each basis state onto a sphere (latitude by Hamming weight, so `|00...0⟩` sits at the north pole and `|11...1⟩` at the south), dot size ∝ √probability, color ∝ phase. **Draggable** — click and drag rotates the sphere (azimuth + elevation), double-click or the ⤾ button resets the view. Hover tooltips on both the histogram bars and the Q-sphere dots show exact values.

## 12. UI layout

Restyled to mirror IBM Quantum Composer's structure: top bar → left column (gate palette + inspector) → center column (canvas toolbar, canvas, probabilities/Q-sphere row) → right column (full-height, resizable Qiskit code panel).

## 13. Testing

9 test files, 78 tests, covering: gate registry lookups, validation rules, store mutations + undo/redo + time-step insert/remove, Qiskit generation, Qiskit parsing (valid subset + invalid-code error messages), **round-trip** IR→code→IR and code→IR→code equivalence, save/load serialization, the statevector simulator (including phase correctness), and Q-sphere projection geometry.

## 14. Project structure

```
src/
├── circuit/
│   ├── model/         IR types, id gen, parameter expressions, placement, timing, serialization
│   ├── gate-registry/  centralized gate definitions
│   ├── generator/      IR → Qiskit
│   ├── parser/         Qiskit → IR
│   └── validation/      circuit/operation validation
├── simulation/          statevector simulator, Q-sphere projection
├── state/               Zustand stores (circuit + ui)
├── components/
│   ├── circuit/         canvas, placed gates, grid cells, canvas toolbar
│   ├── gates/            toolbox, gate glyph rendering
│   ├── code-editor/      Monaco panel + sync logic
│   ├── panels/           gate inspector
│   ├── simulation/       probabilities panel, Q-sphere panel
│   └── toolbar/          top app bar (save/load)
└── tests/                all Vitest specs
```

## What's not built yet

Everything in the original spec's Phase 0–8 checklist is done. Not yet attempted: tablet/narrow-viewport responsive layout, a backend service (intentionally out of scope — the app is fully client-side), and any collaborative/multi-user features.
