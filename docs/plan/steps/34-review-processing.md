# Step 34: Technique job + Processing screen

**Phase:** 1 · **Depends on:** 33 · **Branch:** `feat/review-processing`

## Goal
The worker runs the full technique pipeline (pose → contacts → metrics → moments → LLM feedback → ghost corrections) and the Processing screen shows live stages; when done, an in-app notification takes the user to results.

## Read first
- `CLAUDE.md`
- `docs/features/technique-review.md` (step 4)
- `docs/ai/pose-and-technique.md`, `docs/ai/llm-coaching.md`, `docs/ai/avatar.md` (ghost)
- `docs/architecture/overview.md` (Job flow)

## In scope
- Worker `technique_review` handler chaining steps 24–26 modules; `worker/ghost/corrections.py` turns correction specs into target poses; writes `pose_path` (`pose-data` bucket), `pillar_scores`, `feedback`; stages "Tracking your movement… / Finding key moments… / Writing your feedback…"; `gpu_seconds`, `llm_tokens`; 5-minute timeout.
- `pose-data` bucket + policies.
- `app/review/[id]/processing.tsx` with `ProgressSteps` bound to `useJob`, "We'll let you know, keep climbing".
- In-app notification (Toast/banner) when any job finishes while the user is elsewhere in the app (decision C8; no push).

## Out of scope
- Results UI (35), ghost rendering (36).

## Prompt
> Do step 34 (`docs/plan/steps/34-review-processing.md`). Read the docs it lists. Implement the `technique_review` worker handler chaining pose, contacts, metrics, moments, LLM feedback, and ghost corrections, writing all outputs with staged progress. Build the Processing screen and an app-wide in-app "review ready" notification. Give me commands and a checklist.

## Expected files
- `worker/` technique handler, `worker/ghost/corrections.py`, tests
- `supabase/migrations/*_pose_data.sql`, `app/review/[id]/processing.tsx`, `src/features/jobs/JobNotifier.tsx`

## Done when
- [ ] Median processing < 90 s for a 60 s clip
- [ ] Leaving the Processing screen still shows a notification when done
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
