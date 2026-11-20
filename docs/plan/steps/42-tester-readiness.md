# Step 42: Tester readiness

**Phase:** 1 · **Depends on:** 37–41 · **Branch:** `docs/test-plan` · 👤 developer runs the test

## Goal
Everything needed to run the 15–30 climber Phase 1 test is ready: a test plan, a metrics checklist wired to real data, legal sign-off status, and a smoke test passed on production.

## Read first
- `CLAUDE.md`
- `docs/product/roadmap.md` (Phase 1, success metrics, business model questions)
- `docs/policies/privacy-safety.md`
- `docs/dev/testing.md`

## In scope
- `docs/test-plan.md`: tester onboarding script (link, install, first scan, first review), weekly gym check-in agenda, interview questions incl. "what would you pay?" and "how disappointed if this went away?", how feedback is triaged.
- Metrics checklist: where each Phase 1 metric comes from (PostHog query, SQL over `feedback_ratings` / `jobs`), plus per-analysis cost query (`gpu_seconds`, `llm_tokens`).
- Production smoke test on iPhone Safari (installed PWA) and Android Chrome, adult + minor accounts.
- Confirm: privacy policy + terms live; legal review done before inviting minors (otherwise adults only).

## Out of scope
- Phase 2 work.

## Prompt
> Do step 42 (`docs/plan/steps/42-tester-readiness.md`). Read the docs it lists. Write `docs/test-plan.md` with the tester script, check-in agenda, and interview questions, plus a metrics section showing exactly how to compute each Phase 1 metric and per-analysis cost from PostHog and SQL. Then give me a production smoke-test checklist and a go/no-go list.

## Expected files
- `docs/test-plan.md`, SQL snippets (e.g. `supabase/queries/metrics.sql`)

## Done when
- [ ] Smoke test passes on production
- [ ] Every Phase 1 metric has a working query
- [ ] Legal status for minors recorded in `decisions.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
