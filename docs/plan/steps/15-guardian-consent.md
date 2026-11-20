# Step 15: Guardian consent (13–17)

**Phase:** 0 · **Depends on:** 09 · **Branch:** `feat/guardian-consent` · 👤 **Legal review required before minors join the test**

## Goal
A 13–17-year-old enters a guardian email, the guardian gets a consent link, and clicking it sets `guardian_consent_at`; until then the account is limited (can onboard and browse, cannot upload).

## Read first
- `CLAUDE.md`
- `docs/policies/privacy-safety.md` (Age and minors)
- `docs/features/onboarding-profile.md` (Sign-up flow)
- `docs/design/screens.md` (row 2b)
- `docs/architecture/data-model.md` (Security)

## In scope
- `app/(auth)/guardian.tsx`: guardian email, explanation of the limited account, resend link.
- Edge Function `guardian-consent`: issues a signed, expiring token, sends the email, and a public confirm endpoint/page that sets `guardian_consent_at`.
- Limited-account rule is enforced **server-side**: a helper `can_upload(uid)` used later by `jobs` insert and storage policies (wire it now, apply it in 18). Add a pgTAP test for the helper.
- App banner for minors awaiting consent; upload entry points show a friendly explanation.
- Leave a `TODO(legal)` note in the consent email/page copy.

## Out of scope
- Writing the legal text (human). Social features.

## Prompt
> Do step 15 (`docs/plan/steps/15-guardian-consent.md`). Read the docs it lists. Build the guardian email screen, an Edge Function that sends a signed expiring consent link and confirms it, a server-side `can_upload` helper with pgTAP tests, and the limited-account banner. Mark consent copy as pending legal review. Give me commands, files, and a checklist using a test minor account.

## Expected files
- `app/(auth)/guardian.tsx`
- `supabase/functions/guardian-consent/*`, `supabase/migrations/*_can_upload.sql`, `supabase/tests/can_upload.sql`

## Done when
- [ ] Minor without consent: `can_upload` false; after clicking the link: true
- [ ] Expired or tampered token is rejected
- [ ] Legal review recorded as done (or step marked ⏸ for live minors)
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
