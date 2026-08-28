# Phase 3 — Live Bloch Sphere Visualization — Build Log

Everything added on top of Phase 2 (see `phase2.md`). Goal: the demo's hero moment — a per-qubit Bloch sphere that visibly animates the instant a gate is added or removed, alongside smoothly transitioning probability bars, with **no "Run"/"Visualize" button**. Reuses the existing circuit → simulation → visualization pipeline; no new API calls, no new dependencies.

Status: typecheck clean, lint clean (no new warnings), verified live in a real browser via Playwright (see §4) — every physical result matched theory, zero console errors. Also includes a dev-environment CORS fix (§6) and a full UI theme overhaul (§7) done in the same session.

---

## 1. What was missing before this phase

- Only a multi-qubit **Q-sphere** existed (`QSpherePanel.tsx`) — no per-qubit Bloch sphere.
- Probability bars and the Q-sphere updated by snapping instantly to new values — no animation.

## 2. New files

```
src/simulation/bloch.ts                          local per-qubit Bloch-angle computation
src/components/simulation/BlochSphere.tsx        single-qubit SVG Bloch sphere
src/components/simulation/BlochSpheresPanel.tsx  one sphere per qubit, wired to existing stores
```

### `bloch.ts` — local Bloch angles

Mirrors `backend/app/simulator.py::compute_bloch_angles` exactly (same partial-trace math, same `PURITY_THRESHOLD = 0.999`), so the local-mode fallback doesn't need a backend round trip:

```
rho00 = Σ|amp(bit=0)|²        rho11 = Σ|amp(bit=1)|²        rho01 = Σ amp(bit=0)·conj(amp(bit=1))
rx = 2·Re(rho01)   ry = -2·Im(rho01)   rz = rho00 - rho11   r = |rx,ry,rz|
theta = acos(rz/r), phi = atan2(ry,rx)   — only reported when r ≥ 0.999, else {theta:null, phi:null, pure:false}
```

### `BlochSphere.tsx` — single-qubit sphere

No 3D library exists in this project (`package.json` has no three.js/R3F), so the sphere is drawn the same way the existing Q-sphere is: an SVG wireframe with a fixed rotate-then-tilt projection (identical formula to `qsphere-layout.ts`'s `computeQSphereLayout`, with the Bloch z-axis mapped to the viewer's vertical axis). Contains: wireframe circle + two guide ellipses, X/Y/Z axis lines and labels, origin dot, `|0⟩`/`|1⟩` pole labels, the state vector, and a "Qubit N" + `θ/φ` readout underneath. Defaults to `θ=0` (+Z) before the first simulation result lands, since every circuit starts at `|0⟩`.

### `BlochSpheresPanel.tsx` — container

Follows the exact pattern already established by `QSpherePanel`/`ProbabilitiesPanel`: reads `circuit`/`errors` from `circuit-store`, `mode`/`backendResult`/`backendError` from `simulation-store`, keeps its own debounced (300ms) local statevector fresh in the background, and renders `angles?.find(a => a.qubit === q)` per qubit into a `<BlochSphere>`. No shared derived-state store was introduced — each viz panel independently deriving from the same source of truth is the codebase's existing convention, not something new.

## 3. Animation

- **Bloch vector** (`BlochSphere.tsx` + `App.css` `.bloch-vector`): the vector is a fixed-length line wrapped in a `<g>` whose `style.transform = rotate(angleDeg) scale(lengthFrac)` changes on every re-render; `.bloch-vector { transition: transform 320ms cubic-bezier(0.4,0,0.2,1); }` animates the change. A rotate+scale transform (rather than animating raw SVG `cx`/`cy`) was chosen for cross-browser reliability. No R3F is present, so this is CSS-only, per the "avoid animation libraries if an existing dependency isn't already present" constraint.
- **Probability bars** (`ProbabilitiesPanel.tsx`, unchanged JS): `App.css`'s `.histogram-fill` gained `transition: height 320ms cubic-bezier(0.4,0,0.2,1);` — the component's existing `style={{ height: ... }}` now animates instead of snapping.

Full flow (unchanged apart from the render step at the end):

```
Circuit change → existing 300ms debounce → existing local/backend simulation
  → BlochSpheresPanel/ProbabilitiesPanel re-render with new values
  → CSS transition animates vector rotation + bar height (~320ms)
```

## 4. Verification performed

Typecheck (`tsc -b`) and lint (`oxlint`) were clean. The app was then actually driven in headless Chromium (Playwright, invoked ad hoc via `npx` — not added to `package.json`) against `npm run dev`, clicking real gate buttons (click-to-add is the same code path as drag-and-drop — both call `store.addOperation`) and reading the live DOM:

| Action | Expected | Observed |
|---|---|---|
| Initial `\|0⟩`, 2 qubits | vector at +Z on both | `θ=0° φ=0°` both qubits ✅ |
| Add `H` on qubit 0 | vector → equator, P(0)=P(1)=50% | `θ=90° φ=0°`; bars 00/01 both 50.0% ✅ |
| Qubit 1 during the above | untouched | stayed `θ=0° φ=0°` — no cross-qubit overwrite ✅ |
| Remove the `H` | vector + bars animate back | back to `θ=0° φ=0°`, single 100% bar at `00` ✅ |
| Add `X` alone | vector → −Z (`\|1⟩`) | `θ=180° φ=0°` ✅ |
| Add `Z` alone on `\|0⟩` | unchanged (`Z\|0⟩=\|0⟩`) | `θ=0° φ=0°` ✅ |
| `H` then `Z` | `\|+⟩→\|−⟩`, vector flips to −X | `θ=90° φ=180°` ✅ |

No console/page errors in any run. No second simulation request was triggered — `BackendSimulationController` fires exactly once per debounced change, same as before this phase.

---

## 5. Sample script to check it yourself

Requires the dev server running (`npm run dev`, default `http://localhost:5173`) and Playwright's Chromium available (`npx playwright install chromium` once, if not already cached). Save as `verify-bloch.mjs` in the repo root and run `node verify-bloch.mjs`:

```js
import { chromium } from "playwright"; // or a file:// path to a locally cached playwright/index.mjs

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto("http://localhost:5173", { waitUntil: "networkidle" });
await page.waitForSelector("text=Bloch spheres");
await page.waitForTimeout(500);

const readout = (q) => page.locator(".bloch-sphere-readout").nth(q).textContent();
const bars = () =>
  page.locator(".histogram-fill").evaluateAll((els) =>
    els.map((e) => [e.parentElement.parentElement.querySelector(".histogram-x-label").textContent, e.style.height])
  );

console.log("initial q0:", await readout(0));       // expect "θ=0° φ=0°"
console.log("initial bars:", await bars());          // expect [["00","100%"]]

await page.getByRole("button", { name: /Add Hadamard gate/i }).click(); // no Run button — this alone triggers everything
await page.waitForTimeout(900); // debounce (300ms) + sim + CSS transition (320ms)

console.log("post-H q0:", await readout(0));          // expect "θ=90° φ=0°"
console.log("post-H bars:", await bars());            // expect 00 and 01 both "100%" (bar heights are relative to the max bar)

await page.getByRole("button", { name: /Delete gate/i }).click();
await page.waitForTimeout(900);

console.log("post-remove q0:", await readout(0));      // expect back to "θ=0° φ=0°"
console.log("errors:", errors);                        // expect []

await browser.close();
```

Expected output:

```
initial q0: θ=0° φ=0°
initial bars: [ [ '00', '100%' ] ]
post-H q0: θ=90° φ=0°
post-H bars: [ [ '00', '100%' ], [ '01', '100%' ] ]
post-remove q0: θ=0° φ=0°
errors: []
```

(Bar heights are scaled relative to the tallest bar, not absolute probability — that's pre-existing `ProbabilitiesPanel` behavior, unrelated to this phase. The actual percentage values are in each bar's `.histogram-value-label` text, e.g. "50.0%".)

---

## 6. Dev-environment bug found and fixed

**Symptom:** switching to "Qiskit Aer" mode showed a red "Qiskit Aer backend unreachable" banner on every panel, and the backend's own logs showed `OPTIONS /simulate HTTP/1.1 400 Bad Request` on every request (while `GET /health` returned `200`).

**Root cause:** `backend/app/main.py`'s CORS config only allows `http://localhost:5173` / `http://127.0.0.1:5173`. Several stray `npm run dev` processes had been left running (backgrounded during earlier verification passes) and were still holding ports `5173` and `5174`, so the *actual* browser tab had been auto-bumped by Vite to `http://localhost:5175` — an origin the backend's CORS middleware correctly rejects at the preflight (`OPTIONS`) stage, before the request ever reaches `/simulate`'s handler. `/health` still returned `200` because simple `GET` requests aren't subject to the same preflight check.

**Fix:** killed the 3 stray `node.exe` Vite processes (confirmed identity via `tasklist` before killing) and restarted the dev server once, cleanly, on `5173`. No code change was needed — CORS config was already correct; the environment had drifted. Lesson for future sessions: don't leave `npm run dev`/backend servers backgrounded across turns without tracking/killing them — verify with `netstat -ano | grep LISTENING` before assuming a fresh `npm run dev` landed on `5173`.

## 7. UI theme overhaul

Restyled to match a reference "floating glass card" design (dark, near-black canvas, rounded panels with soft shadows and gaps, instead of edge-to-edge strips with hard 1px dividers). **CSS-only change** — `src/App.css` was rewritten; no component/JSX/logic changes.

- Added a design-token block (`:root { --bg, --panel, --panel-alt, --border, --radius-lg/md/sm, --text, --text-dim, --accent, ... }`) centralizing the palette instead of scattered literal hex values.
- Every major region — gate toolbox + inspector (left), canvas toolbar, circuit canvas, the three bottom viz panels (Probabilities / Bloch spheres / Q-sphere), and the code editor (right) — is now its own floating rounded card (`16px` radius, `1px` soft border, drop shadow), separated by a consistent `12px` gap, instead of being glued together with `border-right`/`border-bottom` dividers.
- **Alignment fix:** header rows across different panels (`.probabilities-header`, `.code-editor-header`, `.canvas-toolbar`) previously had inconsistent padding/heights (`5px 10px` vs `6px 12px` vs `8px 14px`); unified to `10px 14px` / `40px` min-height everywhere so headers line up visually across the bottom-row cards and top toolbar.
- Icon buttons (`.icon-btn`) standardized to `30×30px` with a softer glass background (`rgba(255,255,255,.04)`) and accent-tinted hover/active state (used for the Local/Qiskit Aer toggle).
- Added thin custom `::-webkit-scrollbar` styling to match the dark theme.

Verified with `tsc -b` (clean) and a live Playwright screenshot against the running dev server — confirmed the floating-card composition renders as intended.

## 8. What's not covered

Entangling gates (CX/CZ) driving a qubit's reduced state impure — `BlochSphere.tsx` has a `mixed` rendering path (dashed, faded vector + `r=` readout instead of `θ/φ`) for `pure: false`, but it wasn't exercised in this phase's verification pass.
