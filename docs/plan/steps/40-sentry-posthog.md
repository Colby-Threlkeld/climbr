# Step 40: Sentry + PostHog

**Phase:** 1 · **Depends on:** 38 · **Branch:** `feat/observability`

## Goal
App and worker errors go to Sentry and key product events go to PostHog, with body data provably scrubbed, so Phase 1 metrics can be measured.

## Read first
- `CLAUDE.md`
- `docs/policies/privacy-safety.md` (Body data)
- `docs/product/roadmap.md` (Phase 1 success metrics)
- `docs/architecture/conventions.md` (env vars)

## In scope
- `src/analytics.ts` wrapper with an allow-list of events and properties (no free-form properties): onboarding_completed, route_scan_started/completed, review_started/completed, rating_submitted, feedback_sent, app_opened (for week-2 retention), and durations for Route Reader and review processing.
- Sentry in app (web + native) and worker, with `beforeSend` / breadcrumb scrubbing for body fields, birth date, injuries, emails, media URLs.
- Test that a body field in an error payload is removed.
- `.env.example` updated.

## Out of scope
- Dashboards (step 42).

## Prompt
> Do step 40 (`docs/plan/steps/40-sentry-posthog.md`). Read the docs it lists. Add Sentry (app + worker) and PostHog behind an allow-listed `src/analytics.ts`, emitting the events needed for the Phase 1 metrics, with scrubbing that provably removes body data, birth date, injuries, and emails. Add a test for the scrubber. Give me commands and a checklist.

## Expected files
- `src/analytics.ts` + tests, Sentry init (app + `worker/`), `.env.example`

## Done when
- [ ] A test error appears in Sentry with no body data
- [ ] Events appear in PostHog from web and Expo Go
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
