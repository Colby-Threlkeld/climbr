# Architecture overview

> Read this for any step that crosses the app / Supabase / worker boundary, or when you need the folder layout.

## System diagram

```
┌────────────────────────────┐        ┌──────────────────────────────┐
│  App (Expo / React Native) │        │  Supabase                    │
│  web PWA (Ph1) + native    │◀──────▶│  Auth · Postgres · Storage   │
│  • capture photo/video     │        │  Realtime (job status)       │
│  • trim + compress         │        │  Edge Function: start job    │
│  • render dots, skeleton,  │        │  pg_cron: cleanup jobs       │
│    avatar, ghost overlays  │        └──────────────┬───────────────┘
└────────────────────────────┘                       │ HMAC-signed call
                                                     ▼
                                      ┌──────────────────────────────┐
                                      │  AI Worker (Python, GPU)     │
                                      │  serverless: Modal           │
                                      │  • hold detection (YOLO)     │
                                      │  • beta solver (graph search)│
                                      │  • pose estimation (video)   │
                                      │  • metrics + key moments     │
                                      │  • LLM: coaching text (JSON) │
                                      │  • ghost pose generation     │
                                      │  • wingspan estimate         │
                                      └──────────────────────────────┘
```

**Key principle:** the AI worker returns **data** (hold coordinates, sequences, pose keypoints, feedback JSON), **not rendered images or videos**. The app draws everything. That's cheaper, faster, interactive (tap a hold, scrub the video), and identical on web and native.

## Job flow

1. App uploads media to Supabase Storage → inserts a `jobs` row (`status=queued`).
2. A **database webhook** on `jobs` insert calls an **Edge Function**, which calls the AI worker endpoint with the job ID, signed with HMAC (`WORKER_WEBHOOK_SECRET`) (decision G13).
3. Worker downloads the media, processes it, writes results to `route_scans` / `technique_reviews` / `body_profiles`, and updates the job `status` (`processing` → `done` / `failed`) with `progress` % and `stage`, plus `gpu_seconds` / `llm_tokens`.
4. The app watches the job via **Supabase Realtime** and updates the progress screen live.

Job kinds: `route_scan`, `technique_review`, `wingspan_estimate`. Worker rules (idempotent, timeouts, error codes) are in `conventions.md`.

## Folder layout (monorepo = repo root, decision C3)

```
./
├─ app/                              # Expo Router screens (full list: docs/design/screens.md)
│  ├─ _layout.tsx
│  ├─ (auth)/welcome.tsx, sign-in.tsx, birth-date.tsx, guardian.tsx, terms.tsx
│  ├─ (onboarding)/body.tsx, level.tsx, style.tsx, optional.tsx
│  ├─ (tabs)/_layout.tsx             # custom tab bar w/ center capture
│  ├─ (tabs)/index.tsx               # Home
│  ├─ (tabs)/capture.tsx
│  ├─ (tabs)/profile.tsx
│  ├─ profile/wingspan/…, privacy.tsx, feedback.tsx
│  ├─ install.tsx                    # Add to Home Screen guide (web)
│  ├─ route/[id]/holds.tsx           # hold confirmation
│  ├─ route/[id]/index.tsx           # suggested beta + avatar
│  ├─ review/new.tsx                 # trim & link
│  ├─ review/[id]/processing.tsx
│  └─ review/[id]/index.tsx          # results
├─ src/
│  ├─ components/ui/                 # design-system primitives
│  ├─ components/overlay/            # HoldOutline, BetaDots, SequenceLines, Skeleton, Avatar, Ghost
│  ├─ avatar/                        # body model (proportions), 2D IK, pose interpolation (shared by both features, renderer-agnostic)
│  ├─ theme/tokens.ts
│  ├─ lib/supabase.ts, grades.ts, units.ts, media.ts, storage.(web|native).ts
│  ├─ features/onboarding/, routeScan/, techniqueReview/, jobs/ (realtime status hook)
│  ├─ types/generated/               # generated from shared/schemas (never hand-edit)
│  └─ analytics.ts
├─ worker/                           # Python AI worker (uv project)
│  ├─ app.py                         # FastAPI + Modal entrypoints
│  ├─ holds/ (detect.py, color.py)
│  ├─ beta/ (body_model.py, solver.py)
│  ├─ pose/ (estimate.py, smooth.py, contacts.py)
│  ├─ technique/ (metrics.py, moments.py)
│  ├─ coach/ (llm.py, prompts/)
│  ├─ ghost/ (corrections.py)
│  ├─ body/ (wingspan.py)            # arms-out photo → wingspan estimate
│  ├─ schemas/generated/             # Pydantic models generated from shared/schemas (decision C4)
│  ├─ eval/ (test set runner; eval/coach/ = safety & tone suite)
│  ├─ notebooks/                     # prototypes only, never imported
│  └─ tests/ (fixtures/ = synthetic media only)
├─ supabase/migrations/              # tables, RLS policies, storage rules, cron jobs
├─ supabase/functions/               # Edge Functions
├─ supabase/tests/                   # pgTAP
├─ shared/schemas/                   # JSON Schemas for holds, sequences, poses, feedback, jobs (single source of truth for app + worker)
├─ docs/
├─ .env.example                      # never commit real .env
└─ CLAUDE.md
```

**Contract rule:** the app and worker communicate *only* through the JSON shapes in `shared/schemas/`. Change a schema → regenerate types → update both sides in the same commit.
