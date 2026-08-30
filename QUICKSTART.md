# Quickstart

Getting this running locally, end to end. The root `README.md` documents the
architecture in depth; this file is just the setup path.

> **This is not the frontend-only setup the README's "Getting Started" section
> describes.** Since Google SSO and instructor groups landed, the backend calls
> `init_redis()` and `create_tables()` in its startup lifespan (`app/main.py`),
> so **Redis and Postgres are now required for the backend to boot at all** —
> it is no longer an optional add-on. Login is also required to reach the
> editor: `/dashboard` sits behind `ProtectedRoute`, so without Google OAuth
> configured you only ever see the landing and login pages.

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | **20.19+** or 22.12+ | Vite 8 refuses to guarantee support below this and warns on every start |
| Python | **3.11+** | The backend uses 3.11 syntax; 3.10 will not work |
| Postgres | 14+ | Users, groups, memberships |
| Redis | 7+ | Session store |

## 1. Clone

```bash
git clone https://github.com/MINISH4905/Quantum-circuit.git
cd Quantum-circuit
```

## 2. Frontend dependencies

```bash
npm install
```

**On Apple Silicon, `npm run dev` may then crash with `Cannot find native
binding`.** This is the [npm optional-dependencies
bug](https://github.com/npm/cli/issues/4828) — npm silently skips Vite 8's
platform-specific rolldown binary even though it is present in
`package-lock.json`. Fix it without touching your lockfile:

```bash
npm install @rolldown/binding-darwin-arm64 --no-save
```

`npm run lint` fails the same way, for the same reason — oxlint ships its
binary identically:

```bash
npm install @oxlint/binding-darwin-arm64 --no-save
```

Substitute your platform's bindings if you are not on Apple Silicon
(`@rolldown/binding-linux-x64-gnu`, `@oxlint/binding-darwin-x64`, etc.) —
`node -p "process.platform + process.arch"` will tell you which.

## 3. Postgres and Redis

### Option A — Docker (matches `docker-compose.yml`)

```bash
docker compose up -d postgres redis
```

This gives you a `postgres` / `postgres` superuser and a `quantumlab`
database on the standard ports, matching the default `DATABASE_URL`.

### Option B — Local services

```bash
# macOS / Homebrew
brew services start postgresql@14
brew services start redis
createdb quantumlab
```

Homebrew's Postgres creates a superuser named after your OS user, not
`postgres`, so your `DATABASE_URL` must use `$(whoami)` rather than the
docker-compose default. Step 4 covers this.

## 4. Backend environment

Create `backend/.env` (gitignored — never commit it):

```ini
# Docker (Option A):
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/quantumlab
# Local services (Option B) — substitute your OS username:
# DATABASE_URL=postgresql+asyncpg://YOUR_USERNAME@localhost:5432/quantumlab

REDIS_URL=redis://localhost:6379/0

ENV=development
SESSION_SECRET=any-long-random-string-for-local-dev
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback

# Optional — AI tutor LLM. Unset falls back to deterministic rule-based analysis.
# GROQ_API_KEY=
```

Tables are created automatically on first boot; there is no migration step.

## 5. Google OAuth

The editor is behind a login wall, so you need your own OAuth client.

1. [Google Cloud Console](https://console.cloud.google.com/) → create or select
   a project.
2. **OAuth consent screen** → User type **External**. Fill in the app name and
   support emails. Under **Audience**, add your own Google account as a **test
   user** — otherwise you get "access blocked: app has not completed
   verification" *after* entering your email. The app only requests
   `openid email profile`, all non-sensitive, so no Google review is needed.
3. **Credentials** → **Create credentials** → **OAuth client ID** → **Web
   application**. Set one authorized redirect URI:

   ```
   http://localhost:8000/auth/google/callback
   ```

   This must match byte-for-byte — no trailing slash, `http` not `https`, and
   port **8000** (the backend, not the frontend). A mismatch gives
   `redirect_uri_mismatch`. Authorized JavaScript origins can be left empty:
   this is a server-side redirect flow, not the JS SDK.
4. Paste the client ID and secret into `backend/.env`.

An empty `GOOGLE_CLIENT_ID` produces
`Missing required parameter: client_id` from Google rather than a login screen.

## 6. Backend

```bash
cd backend
python3.11 -m venv .venv
source .venv/bin/activate        # .venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**First start takes 60–90 seconds.** The backend imports Qiskit, Cirq, and
PennyLane at module load. It looks hung; it is not. Wait for
`Application startup complete.` before assuming failure.

## 7. Frontend

In a second terminal, from the repo root:

```bash
npm run dev
```

Open http://localhost:5173 and sign in with Google.

> **The first account to log in becomes `admin`.** `auth.py` assigns the
> `ADMIN` role when the users table is empty and `USER` to everyone after.
> Log in with the account you want as admin first.

## Verify

```bash
curl http://localhost:8000/health
# {"status":"ok"}

# Bell state — expect (|00> + |11>)/sqrt(2) and a ~50/50 histogram
curl -X POST http://localhost:8000/simulate \
  -H "Content-Type: application/json" \
  -d '{"circuit":{"version":1,"qubits":2,"classicalBits":2,"operations":[
        {"id":"a","gate":"h","targets":[0],"timeStep":0},
        {"id":"b","gate":"cx","controls":[0],"targets":[1],"timeStep":1}]},
      "shots":500}'
```

## Troubleshooting

| Symptom | Cause |
|---|---|
| `Cannot find native binding` on `npm run dev` | Missing rolldown binary — see step 2 |
| Backend appears to hang on startup | Normal; Qiskit/Cirq/PennyLane imports take 60–90s |
| Changes to `.env` have no effect | `uvicorn --reload` only watches `.py` files, and `get_settings()` is `lru_cache`d. Fully restart the process |
| `Missing required parameter: client_id` | `GOOGLE_CLIENT_ID` is empty in `backend/.env` |
| `redirect_uri_mismatch` | Console redirect URI differs from `GOOGLE_REDIRECT_URI` — check scheme, port, trailing slash |
| "Access blocked", app not verified | Your Google account is not a test user on the consent screen |
| Backend exits at startup, Redis/Postgres errors | Both services must be running before the backend starts |
| `/auth/me` returns 401 | Expected with no session — sign in first |

## Tests

```bash
npm run test          # frontend (vitest)
cd backend && pytest  # backend
```
