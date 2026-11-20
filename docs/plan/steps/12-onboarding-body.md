# Step 12: Onboarding ①: body

**Phase:** 0 · **Depends on:** 09, 11 · **Branch:** `feat/onboarding-body`

## Goal
Onboarding step ① collects height and optional wingspan (type in or skip) in the user's units, shows a live avatar preview that resizes as they type, and saves to `body_profiles` in cm.

## Read first
- `CLAUDE.md`
- `docs/features/onboarding-profile.md` (fields, Onboarding UX rules)
- `docs/architecture/conventions.md` (Units)
- `docs/policies/privacy-safety.md` (Body data)

## In scope
- `app/(onboarding)/_layout.tsx` with `ProgressSteps` (4 steps) and "Skip for now" on optional parts.
- `app/(onboarding)/body.tsx`: units toggle (default from device locale, decision C7), height (ft/in or cm), wingspan **Type it in** (with a short "how to measure with a tape" illustration) or **Skip** (wingspan photo is Profile-only, decision C11), live `AvatarPreview`, ape index shown with unit (C12).
- `src/lib/units.ts` (cm ↔ ft/in, rounding) with unit tests.
- Save via TanStack Query mutation: `height_cm`, `wingspan_cm` (null if skipped), `wingspan_source` (`manual` / `default`).
- Body values never logged.

## Out of scope
- Steps ②–④ (13). Wingspan photo (19–20).

## Prompt
> Do step 12 (`docs/plan/steps/12-onboarding-body.md`). Read the docs it lists. Build the onboarding layout with a 4-step progress bar and step ① (height + optional typed wingspan, units from locale, live avatar preview, ape index with units). Store metric only via `src/lib/units.ts` (unit-tested) and save to `body_profiles` with TanStack Query. No wingspan photo option here. Give me a phone checklist covering both unit systems.

## Expected files
- `app/(onboarding)/_layout.tsx`, `app/(onboarding)/body.tsx`
- `src/lib/units.ts` + tests, `src/features/onboarding/*`

## Done when
- [ ] Typing a height resizes the avatar live on web and Expo Go
- [ ] 5'10" saves as ~177.8 cm; reloading shows 5'10" again
- [ ] Skipping wingspan saves `wingspan_source='default'`
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
