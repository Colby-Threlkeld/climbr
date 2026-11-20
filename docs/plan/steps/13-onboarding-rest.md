# Step 13: Onboarding ②–④

**Phase:** 0 · **Depends on:** 12 · **Branch:** `feat/onboarding-rest`

## Goal
A new user can finish onboarding: level + home gym, style + goals, and optional injuries with the disclaimer and (adults only) training-data opt-in, then lands on Home with `onboarding_completed_at` set.

## Read first
- `CLAUDE.md`
- `docs/features/onboarding-profile.md`
- `docs/policies/privacy-safety.md` (Coaching, AI data use, minors)
- `docs/architecture/data-model.md` (profiles, body_profiles, locations)

## In scope
- `level.tsx`: experience (`new` / `1-3y` / `3y+`, labels "Under 1 year" / "1–3 years" / "3+ years"), hardest grade picker V0–V10 + V11+ (`src/lib/grades.ts` + tests, Font optional), home gym picker from `locations` (decision G6).
- `style.tsx`: two chip groups "I'm good at" / "I want to improve" (G9), goals, dominant hand.
- `optional.tsx`: injuries (free text + common checkboxes, "why we ask"), one-time injury disclaimer (sets `disclaimer_accepted_at`), training-data opt-in **hidden for minors** (server also forces false).
- `GradeBadge` component.
- Finish → `onboarding_completed_at`, route to Home. Route guard skips onboarding once completed.

## Out of scope
- Profile editing (14). Guardian flow (15).

## Prompt
> Do step 13 (`docs/plan/steps/13-onboarding-rest.md`). Read the docs it lists. Build onboarding steps ② level + home gym, ③ style (two chip groups) + goals + dominant hand, and ④ injuries + disclaimer + adult-only training opt-in. Add `grades.ts` with tests and a `GradeBadge`. Mark onboarding complete and route to Home. Give me a phone checklist for an adult and a minor test account.

## Expected files
- `app/(onboarding)/{level,style,optional}.tsx`
- `src/lib/grades.ts` + tests, `src/components/ui/GradeBadge.tsx`

## Done when
- [ ] Full onboarding completes in ≤ 4 screens and data persists
- [ ] Minor account never sees the opt-in, and the DB rejects `true` for them
- [ ] Re-opening the app after finishing goes straight to Home
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
