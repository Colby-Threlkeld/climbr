# Step 09: Age gate + terms

**Phase:** 0 · **Depends on:** 08 · **Branch:** `feat/age-gate`

## Goal
After first sign-in, the user enters birth month + year; under-13s are blocked **server-side**, 13–17s are flagged as minors in a limited state, and everyone accepts privacy policy + terms before continuing.

## Read first
- `CLAUDE.md`
- `docs/policies/privacy-safety.md` (Age and minors, Accounts)
- `docs/features/onboarding-profile.md` (Sign-up flow)
- `docs/design/screens.md` (rows 2a, 2c)
- `docs/architecture/data-model.md` (profiles)

## In scope
- `app/(auth)/birth-date.tsx`: month + year pickers built from our components (no native pickers).
- Server-side creation of the `profiles` row via an Edge Function or RPC that computes age conservatively from the 1st of the birth month (decision G2a) and **rejects under-13**. The client cannot insert a profile directly.
- Under-13 block screen (friendly, no data kept beyond what's needed).
- Shared `isMinor()` / `ageFromBirth()` helper with unit tests (boundary cases around the 13th and 18th birthday months).
- `app/(auth)/terms.tsx`: links to privacy policy + terms (placeholder pages/URLs), records `terms_accepted_at`.
- Route guard: minors without `guardian_consent_at` → route to guardian screen placeholder (built in 15).
- pgTAP: direct client insert of a profile with an under-13 birth date fails.

## Out of scope
- Guardian email + consent link (15). Onboarding (12–13).

## Prompt
> Do step 09 (`docs/plan/steps/09-age-gate.md`). Read the docs it lists. Build the birth month + year screen, a server-side profile-creation function that blocks under-13s using conservative month-based age, the block screen, the terms acceptance screen, and route-guard updates. Add unit tests for the age helper and a pgTAP test that clients can't bypass the gate. Give me commands, files, and a checklist with test birth dates to try.

## Expected files
- `app/(auth)/birth-date.tsx`, `app/(auth)/blocked.tsx`, `app/(auth)/terms.tsx`
- `supabase/functions/create-profile/*` or `supabase/migrations/*_create_profile_rpc.sql`
- `src/lib/age.ts` + tests, `supabase/tests/age_gate.sql`

## Done when
- [ ] A 12-year-old birth date is blocked even if the UI is bypassed (pgTAP / curl test)
- [ ] A 15-year-old lands on the guardian placeholder; an adult continues to onboarding
- [ ] `terms_accepted_at` is set after acceptance
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
