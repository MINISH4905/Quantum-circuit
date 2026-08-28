# Quantum Circuit Lab

A visual quantum circuit editor: drag-and-drop gates, live Qiskit code sync,
real simulation (in-browser or via a Qiskit Aer backend), Bloch sphere /
Q-sphere visualizations, worked examples (Deutsch–Jozsa, Grover's Search), a
"Folders" library of saved circuits, a Learner hub of core quantum computing
concepts, and a circuit-grounded AI tutor.

- `src/` — React + TypeScript + Vite frontend
- `backend/` — FastAPI + Qiskit Aer simulation backend, plus the AI tutor
  endpoint (see `backend/README.md`)

## Run locally

```bash
npm install
npm run dev
```

Opens on `http://localhost:5173`. The circuit editor's local (in-browser)
simulator works with no backend running. To use the "Qiskit Aer" engine
toggle and the AI Tutor, also start the backend — see `backend/README.md`.

## Deploy

**Frontend → Vercel.** Import this repo in Vercel; it auto-detects Vite
(build command `npm run build`, output `dist/`). No `vercel.json` needed.
Set one environment variable in the Vercel project settings:

| Var | Value |
|---|---|
| `VITE_BACKEND_URL` | Your deployed backend's URL, e.g. `https://your-backend.onrender.com` |

If unset, the frontend falls back to `http://localhost:8000` — fine for
local dev, not for production.

**Backend → Render** (or any host that runs a persistent Python process —
Qiskit Aer is too large/slow-cold-starting for typical serverless
functions). A `render.yaml` blueprint at the repo root automates this —
see `backend/README.md` for the full deploy guide and required env vars
(`ALLOWED_ORIGINS` must include your Vercel URL; `OLLAMA_BASE_URL` is
optional — the AI Tutor gracefully falls back to rule-based explanations
if no LLM is configured).

Deploy order: backend first (to get its URL) → set `VITE_BACKEND_URL` on
Vercel → set `ALLOWED_ORIGINS` on Render to the Vercel URL once you have it
(redeploy the backend after).

## Tests

```bash
npm run test          # frontend (vitest)
cd backend && pytest  # backend
```
