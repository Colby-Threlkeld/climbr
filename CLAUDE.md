# CLAUDE.md

Operating manual for AI assistants in this repo. **Product truth lives in `PROJECT_CONTEXT.md`** (read the relevant § before building a feature). This file covers *how* to work here. If the two conflict, `PROJECT_CONTEXT.md` wins for product decisions and this file wins for engineering conventions. Flag the conflict, don't silently pick.

## Project in one paragraph
**Cruxshot** (repo: `climbr`, working name) is a startup building an AI climbing coach for **indoor bouldering gyms only** (no outdoor, no ropes). Route Reader: wall photo → hold detection → body-aware suggested beta (numbered dots + 2D avatar). Technique Review: climbing video → pose tracking → 3 timestamped key moments + ghost-avatar correction. Climber Profile: height/wingspan/level drive all personalization. Expo/React Native (TypeScript) app shipped as a mobile **web PWA first**, native later. Python AI worker on Modal. Supabase for auth/db/storage/realtime.

## Current status
**Pre-scaffold.** Only docs exist. Next milestone = Phase 0 (`PROJECT_CONTEXT.md` §13, kickoff prompt §17). Update this section and **Commands** as soon as things change.

## Where to look
| Need | Go to |
|---|---|
| Feature behavior / UX flow | §3.3 Profile · §3.4 Route Reader · §3.5 Technique Review |
| Architecture + job flow | §4 |
| AI pipeline details | §5 (holds 5.1, solver 5.2, pose 5.3, LLM 5.4, avatar 5.5, safety tests 5.6, wingspan 5.7, eval 5.8) |
| Design tokens, components, overlay colors | §6 |
| Screen list + required states | §7 |
| Stack + why | §8 |
| DB tables | §9 |
| Privacy rules | §10 |
| Folder layout | §11 |

## Repo layout
Repo root **is** the monorepo root from §11 (ignore the `cruxshot/` prefix there). The Expo app lives at root (`app/`, `src/`); the worker is a separate Python project in `worker/`; `shared/schemas/` is the contract between them; `supabase/` holds migrations and config.

## Commands
> Planned, verify after scaffolding and correct here.

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
uv run python -m eval.run   # eval suite (§5.8) — required before model/prompt changes
uv run modal serve app.py   # dev deploy; `modal deploy app.py` for prod
```

## Non-negotiable rules
1. **Cross-platform:** every app feature works on iPhone Safari, Android Chrome, and Expo Go. Platform code goes in `*.web.ts(x)` / `*.native.ts(x)` with a fallback. Check a library's web support **before** adding it.
2. **No platform UI widgets** (`Alert.alert`, `Switch`, native pickers) in screens. Use `src/components/ui/`. No hard-coded colors/sizes; use `src/theme/tokens.ts`.
3. **Worker returns data, app renders.** Never generate overlay images/videos server-side.
4. **`shared/schemas/` is the only contract.** Change a schema → regenerate types → update app + worker in the **same commit**.
5. **Secrets:** only `EXPO_PUBLIC_*` values in the app (Supabase URL + anon key). Service-role, Anthropic, and Modal keys live only in worker/Supabase secrets. Never commit `.env`.
6. **RLS on every table, always.** Every new table ships with policies **and** a pgTAP test proving another user can't read it.
7. **Body data** (`body_profiles`, birth year, wingspan photos): never logged, never in analytics/Sentry breadcrumbs, sent to the LLM only per §10. Wingspan photos are deleted right after measuring. **Weight is not collected**, so don't add a field for it.
8. **Copy:** beta is always "suggested," never "optimal/best/correct." Never mention weight or body shape in coaching. Coaching copy has at least one positive and at most 3 improvements.
9. **Minors (13–17):** no training-data opt-in, no "keep video longer," limited account until guardian consent. Under-13s are blocked. Check `birth_year` server-side (RLS/Edge Function), not just in the UI.
10. **Brand colors:** cream `#F4EFE6` / ink `#141414` / orange `#FF5A1F`. Ink text on orange (never white), never orange body text, white only for cards on cream (§6.4).
11. **Every AI screen** handles loading (real progress), low confidence, failure + retry, and empty.
12. **Model/prompt changes** require a before/after `worker/eval` run in the PR description.
13. **Avatar data is renderer-agnostic.** `src/avatar/` holds joints, poses, and corrections only, so the 2D renderer (Phase 1) and the 3D renderer (parallel R&D, feature-flagged) share it.

## Engineering conventions (accepted)
- **Units:** store **metric only** (cm) in DB, schemas, and worker. Convert to imperial only at the UI edge (`src/lib/units.ts`).
- **Image coordinates:** **normalized 0–1** relative to the *uploaded* image (x right, y down). Never raw pixels in schemas, so resizing on either side doesn't break overlays.
- **Video time:** seconds (float) from the start of the **original** video; trim is metadata, not re-encoding, on the client.
- **Pose keypoints:** COCO-17 order, `[x, y, confidence]` normalized, sampled at a fixed fps stored with the file.
- **Limbs:** enum `LH | RH | LF | RF` everywhere.
- **Schema versioning:** every payload has `schema_version` (int). Worker writes it; app refuses unknown major versions and shows an "update the app" state.
- **Type generation:** JSON Schema is the source of truth → `json-schema-to-typescript` (app) and `datamodel-code-generator` → Pydantic v2 (worker). Generated files are committed and never hand-edited.
- **IDs:** UUID v4, generated on the client for user-created rows (lets uploads start before the row insert).
- **Storage paths:** `{bucket}/{user_id}/{entity_id}/{file}`. Buckets: `route-photos`, `review-videos`, `wingspan-tmp` (1-hour TTL), `pose-data`.
- **Jobs:** worker is **idempotent** per `job_id` (safe to retry), writes `progress` + `stage` at each pipeline step, hard timeout 5 min, records `gpu_seconds` and `llm_tokens` for cost tracking (§14). Failed jobs store a user-safe `error` code, not a stack trace.
- **App state:** server data via TanStack Query only (no copying into Zustand). Zustand for UI/session state.
- **Errors:** handle at boundaries (query hooks, job handlers, route-level error boundaries). No blanket try/catch on every line.
- **Python:** type hints everywhere, Pydantic models at I/O boundaries, no notebook code imported into `worker/` (prototype in `worker/notebooks/`, port deliberately).
- **TS:** `strict: true`, no `any` without a `// why:` comment, absolute imports via `@/`.

## Environment variables
| Var | Where | Notes |
|---|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | app `.env` | public |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | app `.env` | public (RLS protects data) |
| `EXPO_PUBLIC_POSTHOG_KEY`, `EXPO_PUBLIC_SENTRY_DSN` | app `.env` | public |
| `SUPABASE_SERVICE_ROLE_KEY` | Modal secret, Supabase function secret | **never in app** |
| `ANTHROPIC_API_KEY` | Modal secret | **never in app** |
| `WORKER_WEBHOOK_SECRET` | Supabase function + Modal secret | Edge Function → worker auth (HMAC) |

Keep `.env.example` in sync whenever a var is added.

## Testing strategy
- **App:** Jest + React Native Testing Library for components/hooks; pure logic (`src/avatar/`, `units`, `grades`) gets thorough unit tests. Manual phone checklist per change (rule 12 in §15).
- **DB:** pgTAP tests for every RLS policy and storage rule.
- **Worker:** pytest unit tests per module with small fixture images/videos in `worker/tests/fixtures/` (no real user media, ever).
- **AI quality:** `worker/eval` (§5.8) + coaching safety suite (§5.6). Not run in CI by default (cost); required in PRs that touch models/prompts.
- **CI (GitHub Actions):** lint + typecheck + unit tests for app and worker, `supabase db reset` + pgTAP on every PR.

## Git workflow
- Branch from `main`: `feat/…`, `fix/…`, `chore/…`, `ai/…` (model/prompt work).
- Conventional Commits (`feat(route): add hold color picker`). Small PRs, one concern each.
- PR description: what/why, screenshots (phone web + Expo Go) for UI, eval numbers for AI changes, manual test checklist.
- Never force-push `main`. Never commit media of real people.

## Windows / environment gotchas
- **Repo is inside OneDrive.** OneDrive syncing `node_modules`, `.venv`, `.expo`, and Metro caches causes file-lock errors and slow installs. Exclude those folders from sync, or move the repo outside OneDrive (recommended, e.g. `C:\dev\climbr`).
- `C:\Users\colby` is itself a git repo (likely accidental). Run git commands from the repo root so you don't commit to the wrong one.
- Phone camera needs **HTTPS**. Use Vercel preview URLs or `expo start --tunnel`; plain LAN `http://` won't open the camera.
- Supabase local dev and pgTAP need **Docker Desktop** (WSL2 backend).
- Skia's web build is ~MBs of WASM. Measure first-load on a real phone before committing to it (§8).
- Use LF line endings (`.gitattributes`: `* text=auto eol=lf`) so shell scripts and migrations behave in CI.

## Definition of done
- [ ] Works on phone web (Safari + Chrome) **and** Expo Go
- [ ] Lint, typecheck, tests pass; new logic has tests; RLS tests for new tables
- [ ] All four AI-screen states handled (if applicable)
- [ ] Schemas + generated types in sync; `.env.example` updated
- [ ] No body data in logs/analytics; no secrets in the app bundle
- [ ] Manual test checklist written in the PR
- [ ] This file / `PROJECT_CONTEXT.md` updated if a decision changed

## How to work with the developer
The developer is learning: explain non-obvious choices briefly and comment the *why* in code. Give exact Windows-compatible terminal commands. Prefer the simplest thing that meets the spec; justify every new dependency. Disagree openly with a `PROJECT_CONTEXT.md` decision if needed, but don't override it unilaterally.
