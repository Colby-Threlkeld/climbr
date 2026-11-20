# Step 18: Jobs pipeline end to end (echo job)

**Phase:** 0 · **Depends on:** 07, 17 · **Branch:** `feat/jobs-pipeline`

## Goal
The app inserts a job, a database webhook triggers an Edge Function that calls the worker with an HMAC signature, the worker reports progress through fake stages to `done`, and the app shows the progress live via Realtime. No AI yet.

## Read first
- `CLAUDE.md`
- `docs/architecture/overview.md` (Job flow)
- `docs/architecture/data-model.md` (jobs, Security)
- `docs/architecture/conventions.md` (Worker jobs, env vars)

## In scope
- Migration: `jobs` table with `gpu_seconds`, `llm_tokens` (G1a), RLS (owner read; insert only when `can_upload(uid)` from step 15 — or a stub returning true for adults if 15 isn't done; status/progress writable only by service role). Realtime enabled on `jobs`. pgTAP tests.
- Edge Function `start-job`: triggered by DB webhook on insert, signs the request with `WORKER_WEBHOOK_SECRET` (G13).
- Worker: `POST /jobs` verifies HMAC, idempotent per `job_id`, writes `processing` → stages with progress → `done`; user-safe error codes on failure; 5-minute timeout. A temporary `kind` for testing (e.g. a dev-only `echo` flag) that's removed or disabled in prod.
- App: `src/features/jobs/useJob(jobId)` (TanStack Query + Realtime subscription) and a dev screen to start an echo job and watch progress.

## Out of scope
- Any real AI. Storage uploads (19).

## Prompt
> Do step 18 (`docs/plan/steps/18-jobs-pipeline.md`). Read the docs it lists. Build the full job pipeline with a fake echo job: `jobs` migration with RLS + Realtime + pgTAP, a webhook-triggered Edge Function that HMAC-signs the call to the worker, an idempotent worker endpoint that reports staged progress, and a `useJob` hook with a dev screen. Give me commands (local Supabase + local worker exposed to it), files, and a checklist.

## Expected files
- `supabase/migrations/*_jobs.sql`, `supabase/functions/start-job/*`, `supabase/tests/jobs.sql`
- `worker/jobs.py` (or `worker/app.py` routes), `worker/tests/test_jobs.py`
- `src/features/jobs/useJob.ts`, `app/_dev/jobs.tsx`
- `.env.example` updated

## Done when
- [ ] Tapping "Start echo job" shows progress updating live to done on web and Expo Go
- [ ] Unsigned or badly signed worker requests get 401
- [ ] Re-sending the same job ID doesn't duplicate work
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
