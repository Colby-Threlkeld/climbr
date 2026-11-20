# Build plan

> The ordered list of small, end-to-end, testable steps for Phases 0–1. Each step has its own file in `steps/` with: goal, docs to read, scope, a paste-ready prompt, expected files, and definition of done.
>
> **How to use:** paste `Do step NN. Read docs/plan/steps/NN-*.md and follow it.` into your AI assistant. One step ≈ one branch ≈ one PR. When it's done, tick it here and update "Current status" in `CLAUDE.md`.
>
> **Rules:** don't start a step until its dependencies are ✅. Don't pull work forward from later steps. 👤 = needs a human (you, the gym, or a lawyer).

Status: ⬜ not started · 🟨 in progress · ✅ done · ⏸ blocked

## Phase 0: Foundation

| # | Step | Depends on | Status |
|---|---|---|---|
| 01 | [Repo bootstrap](steps/01-repo-bootstrap.md) | — | ✅ |
| 02 | [Scaffold Expo app + CI](steps/02-scaffold-expo.md) | 01 | ⬜ |
| 03 | [Theme tokens + typography](steps/03-theme-tokens.md) | 02 | ⬜ |
| 04 | [UI primitives I + dev gallery](steps/04-ui-primitives-1.md) | 03 | ⬜ |
| 05 | [UI primitives II](steps/05-ui-primitives-2.md) | 04 | ⬜ |
| 06 | [Tab shell](steps/06-tab-shell.md) | 05 | ⬜ |
| 07 | [Supabase: profiles, body_profiles, locations + RLS](steps/07-supabase-profiles.md) | 02 | ⬜ |
| 08 | [Auth: welcome + email code](steps/08-auth.md) | 06, 07 | ⬜ |
| 09 | [Age gate + terms](steps/09-age-gate.md) | 08 | ⬜ |
| 10 | [Spike: Skia vs SVG](steps/10-spike-skia-vs-svg.md) | 03 | ⬜ |
| 11 | [Avatar body model + preview](steps/11-avatar-body-model.md) | 10 | ⬜ |
| 12 | [Onboarding ①: body](steps/12-onboarding-body.md) | 09, 11 | ⬜ |
| 13 | [Onboarding ②–④](steps/13-onboarding-rest.md) | 12 | ⬜ |
| 14 | [Profile screen](steps/14-profile-screen.md) | 13 | ⬜ |
| 15 | [Guardian consent (13–17)](steps/15-guardian-consent.md) 👤 legal review | 09 | ⬜ |
| 16 | [Worker scaffold](steps/16-worker-scaffold.md) | 01 | ⬜ |
| 17 | [Shared schemas + typegen](steps/17-shared-schemas.md) | 02, 16 | ⬜ |
| 18 | [Jobs pipeline end to end (echo job)](steps/18-jobs-pipeline.md) | 07, 17 | ⬜ |
| 19 | [Wingspan estimate: worker](steps/19-wingspan-worker.md) | 18 | ⬜ |
| 20 | [Wingspan estimate: Profile UX](steps/20-wingspan-profile-ux.md) | 14, 19 | ⬜ |

## Phase 0.5: AI prototypes (gate before Phase 1 UI)

Mostly worker-only. Notebooks go in `worker/notebooks/`; only proven code is ported into modules.

| # | Step | Depends on | Status |
|---|---|---|---|
| 21 | [Eval harness](steps/21-eval-harness.md) | 16 | ⬜ |
| 22 | [Hold detection](steps/22-hold-detection.md) 👤 labeled gym photos | 21 | ⬜ |
| 23 | [Beta solver](steps/23-beta-solver.md) 👤 climber grades 20 problems | 22 | ⬜ |
| 24 | [Spike: pose model](steps/24-spike-pose-model.md) 👤 20 real videos | 21 | ⬜ |
| 25 | [Technique metrics + key moments](steps/25-technique-metrics.md) | 24 | ⬜ |
| 26 | [LLM coaching + safety suite](steps/26-llm-coaching.md) 👤 climber grades feedback | 25 | ⬜ |
| 27 | [Gate review](steps/27-ai-gate-review.md) 👤 | 22–26 | ⬜ |

## Phase 1: Web PWA test

| # | Step | Depends on | Status |
|---|---|---|---|
| 28 | [Route capture + holds overlay](steps/28-route-capture-holds.md) | 20, 27 | ⬜ |
| 29 | [Assisted route selection](steps/29-route-selection.md) | 28 | ⬜ |
| 30 | [Suggested beta: dots, lines, move cards](steps/30-route-beta-dots.md) | 29 | ⬜ |
| 31 | [Route avatar animation](steps/31-route-avatar.md) | 30 | ⬜ |
| 32 | [Route ratings + "Try it, then film it"](steps/32-route-ratings.md) | 31 | ⬜ |
| 33 | [Video capture + trim & link](steps/33-video-capture-trim.md) | 18, 27 | ⬜ |
| 34 | [Technique job + Processing screen](steps/34-review-processing.md) | 33 | ⬜ |
| 35 | [Review results](steps/35-review-results.md) | 34 | ⬜ |
| 36 | [Ghost overlay ("Show me")](steps/36-ghost-overlay.md) | 35, 11 | ⬜ |
| 37 | [Review ratings + Send feedback](steps/37-review-ratings-feedback.md) | 32, 36 | ⬜ |
| 38 | [Home history + progress charts](steps/38-home-history-progress.md) | 32, 35 | ⬜ |
| 39 | [Privacy & data: deletion + retention](steps/39-privacy-deletion.md) | 35 | ⬜ |
| 40 | [Sentry + PostHog](steps/40-sentry-posthog.md) | 38 | ⬜ |
| 41 | [PWA + Add to Home Screen + Vercel](steps/41-pwa-deploy.md) | 40 | ⬜ |
| 42 | [Tester readiness](steps/42-tester-readiness.md) 👤 | 37–41 | ⬜ |

## Parallel track (off the critical path)

| # | Step | Depends on | Status |
|---|---|---|---|
| R1 | [3D avatar R&D (feature-flagged)](steps/R1-3d-avatar-rd.md) | 11 | ⬜ |

## Human tasks (no step file)
- 👤 Competitor teardown → `docs/competitors.md` (before Phase 1)
- 👤 Collect 200–500 labeled gym photos, 30 videos, 20 tape-measured wingspans (before 22–24, 19 eval)
- 👤 Legal review of consent flow + privacy policy (before minors join; blocks step 15 going live)
- 👤 Weekly in-person check-ins at the gym (Phase 1)

Phases 2–3 are tracked in `docs/product/roadmap.md` and get step files when Phase 1 ends.
