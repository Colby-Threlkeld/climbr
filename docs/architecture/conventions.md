# Engineering conventions (accepted)

> Read this before writing code that touches data shapes, the worker, or app state. These are binding defaults; changing one requires an entry in `docs/product/decisions.md`.

## Data
- **Units:** store **metric only** (cm) in DB, schemas, and worker. Convert to imperial only at the UI edge (`src/lib/units.ts`).
- **Image coordinates:** **normalized 0–1** relative to the *uploaded* image (x right, y down). Never raw pixels in schemas, so resizing on either side doesn't break overlays.
- **Video time:** seconds (float) from the start of the **original** video; trim is metadata, not re-encoding, on the client.
- **Pose keypoints:** COCO-17 order, `[x, y, confidence]` normalized, sampled at a fixed fps stored with the file.
- **Limbs:** enum `LH | RH | LF | RF` everywhere.
- **IDs:** UUID v4, generated on the client for user-created rows (lets uploads start before the row insert).
- **Storage paths:** `{bucket}/{user_id}/{entity_id}/{file}`. Buckets: see `data-model.md`.

## Contracts
- **`shared/schemas/` is the only contract** (decision C4). JSON Schema is the source of truth → `json-schema-to-typescript` (app, `src/types/generated/`) and `datamodel-code-generator` → Pydantic v2 (worker, `worker/schemas/generated/`). Generated files are committed and never hand-edited. Change a schema → regenerate → update app + worker in the **same commit**.
- **Schema versioning:** every payload has `schema_version` (int). Worker writes it; app refuses unknown major versions and shows an "update the app" state.

## Worker jobs
- Worker is **idempotent** per `job_id` (safe to retry).
- Writes `progress` + `stage` at each pipeline step.
- Hard timeout 5 min.
- Records `gpu_seconds` and `llm_tokens` for cost tracking.
- Failed jobs store a user-safe `error` code, not a stack trace.
- Worker returns **data**, the app renders. Never generate overlay images/videos server-side.

## App
- **App state:** server data via TanStack Query only (no copying into Zustand). Zustand for UI/session state.
- **Errors:** handle at boundaries (query hooks, job handlers, route-level error boundaries). No blanket try/catch on every line.
- **Platform code:** `*.web.ts(x)` / `*.native.ts(x)` with a fallback.
- **UI:** only `src/components/ui/` primitives in screens; all styling from `src/theme/tokens.ts`. No `Alert.alert`, `Switch`, native pickers, hard-coded colors or sizes.
- **Avatar data is renderer-agnostic.** `src/avatar/` holds joints, poses, and corrections only, so the 2D renderer and the 3D renderer share it.

## Language style
- **TS:** `strict: true`, no `any` without a `// why:` comment, absolute imports via `@/`.
- **Python:** type hints everywhere, Pydantic models at I/O boundaries, no notebook code imported into `worker/` (prototype in `worker/notebooks/`, port deliberately). Ruff for lint + format.
- Comment the *why* on anything non-obvious. The developer is learning.

## Environment variables

| Var | Where | Notes |
|---|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | app `.env` | public |
| `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | app `.env` | public (RLS protects data). Supabase's replacement for the legacy "anon" key (step 07) |
| `EXPO_PUBLIC_POSTHOG_KEY`, `EXPO_PUBLIC_SENTRY_DSN` | app `.env` | public |
| `SUPABASE_SERVICE_ROLE_KEY` | Modal secret, Supabase function secret | **never in app** |
| `ANTHROPIC_API_KEY` | Modal secret | **never in app** |
| `WORKER_WEBHOOK_SECRET` | Supabase function + Modal secret | Edge Function → worker auth (HMAC) |

Only `EXPO_PUBLIC_*` values go in the app. Never commit `.env`. Keep `.env.example` in sync whenever a var is added.
