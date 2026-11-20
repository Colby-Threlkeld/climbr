# Step 14: Profile screen

**Phase:** 0 · **Depends on:** 13 · **Branch:** `feat/profile-screen`

## Goal
The Profile tab shows the user's body profile, level, style, home gym, and units, and every onboarding field can be edited there.

## Read first
- `CLAUDE.md`
- `docs/features/onboarding-profile.md` (Profile tab)
- `docs/design/screens.md` (row 16)

## In scope
- `app/(tabs)/profile.tsx`: sections for Body (height, wingspan + source, ape index, avatar preview), Level, Style, Home gym, Settings (units), sign out.
- Edit flows reuse onboarding form components (Sheet-based or pushed screens).
- Placeholder rows (disabled, "coming soon") for: Estimate wingspan from a photo (20), Progress (38), Privacy & data (39), Send feedback (37).

## Out of scope
- Wingspan photo (20), progress charts (38), privacy/deletion (39), feedback (37).

## Prompt
> Do step 14 (`docs/plan/steps/14-profile-screen.md`). Read the docs it lists. Build the Profile tab showing all profile and body data with edit flows that reuse the onboarding form components, plus disabled placeholder rows for features from later steps. Give me a phone checklist.

## Expected files
- `app/(tabs)/profile.tsx`, `app/profile/*` edit screens (if pushed screens)
- Shared form components in `src/features/onboarding/`

## Done when
- [ ] Editing height in Profile updates the avatar preview and persists
- [ ] Units switch re-renders all body values correctly
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
