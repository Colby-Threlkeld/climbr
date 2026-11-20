# Development environment (Windows)

> Read this when setting up a machine, adding a tool, or hitting a Windows-specific problem. Commands marked *(planned)* are verified and corrected in the step that introduces them.

## One-time install
1. Install **Node.js LTS**, **Git**, **VS Code**, **Python 3.11+**, **uv** (`powershell -c "irm https://astral.sh/uv/install.ps1 | iex"`), and **Docker Desktop** (WSL2 backend, needed for local Supabase + pgTAP).
2. App is scaffolded **at the repo root** (decision C3), in plan step 02.
3. Create a free **Supabase** project. Put the URL + anon key in `.env` (copy from `.env.example`).
4. Worker: `cd worker; uv sync`. Create **Modal** and **Anthropic** accounts. API keys go **only** in the worker's secrets (Modal secrets), never in the app.
5. Develop the worker **locally on CPU first** (slow but fine for testing). Deploy to Modal GPU when it works.
6. Install **Expo Go** on your own phone for native checks (**developer only**).
7. ⚠️ **Testing web on your phone:** phones require **HTTPS** for camera features, so use Vercel preview deployments (an HTTPS link on every Git push) or `npx expo start --tunnel`. Plain LAN `http://` won't open the camera.
8. Linting: ESLint + Prettier (app), **Ruff** lint + format (worker, decision C2). Strict typing both sides.

## Commands *(planned)*

```bash
# App (root) — npm is the package manager
npm install
npx expo start              # dev server (press w for web)
npx expo start --tunnel     # HTTPS-ish URL for phone camera testing
npm run lint                # eslint + prettier --check
npm run typecheck           # tsc --noEmit
npm test                    # jest (jest-expo preset)
npm run schemas             # regenerate TS + Python types from shared/schemas
npx expo export -p web      # static web build (deployed by Vercel)

# Supabase (requires Docker Desktop)
npx supabase start          # local stack
npx supabase migration new <name>
npx supabase db reset       # re-apply all migrations + seed locally
npx supabase test db        # pgTAP tests (RLS)

# Worker (worker/) — Python 3.11+, uv
uv sync
uv run ruff check . && uv run ruff format --check .
uv run pytest
uv run python -m eval.run   # eval suite — required before model/prompt changes
uv run modal serve app.py   # dev deploy; `modal deploy app.py` for prod
```

## Windows / environment gotchas
- **Repo is inside OneDrive** and stays there (decision O3). OneDrive syncing `node_modules`, `.venv`, `.expo`, and Metro caches causes file-lock errors and slow installs. **Keep them out of sync.** OneDrive has no simple per-folder "ignore" for folders inside a synced tree (*Free up space* only removes local copies, it still syncs). A common workaround is to make those folders junctions that point outside OneDrive. Check afterwards that OneDrive shows no sync activity for them:
  ```powershell
  # run from the repo root BEFORE the first npm install / uv sync
  New-Item -ItemType Directory -Force C:\dev-cache\cruxshot\node_modules, C:\dev-cache\cruxshot\worker-venv | Out-Null
  cmd /c mklink /J node_modules C:\dev-cache\cruxshot\node_modules
  cmd /c mklink /J worker\.venv C:\dev-cache\cruxshot\worker-venv
  ```
  If you still see `EBUSY`/`EPERM` errors, pause OneDrive syncing while installing.
- `C:\Users\colby` may itself be a git repo (likely accidental). Run git commands from the repo root and check `git rev-parse --show-toplevel` so you don't commit to the wrong one.
- Supabase local dev and pgTAP need **Docker Desktop** (WSL2 backend).
- Skia's web build is ~MBs of WASM. Measure first-load on a real phone before committing to it (plan step 10).
- Use LF line endings (`.gitattributes`: `* text=auto eol=lf`) so shell scripts and migrations behave in CI.
- Give exact PowerShell-compatible commands in instructions (the developer is on Windows).
