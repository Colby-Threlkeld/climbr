# Step 20: Wingspan estimate: Profile UX

**Phase:** 0 · **Depends on:** 14, 19 · **Branch:** `feat/wingspan-profile`

## Goal
From Profile → Body, a user can take an arms-out photo (with setup guide and 5-second timer), see the photo with measurement lines and an "≈" estimate, then confirm, adjust, or retake; only the number is saved and the photo is gone.

## Read first
- `CLAUDE.md`
- `docs/features/onboarding-profile.md` (Wingspan photo flow)
- `docs/design/screens.md` (row 16a), `docs/design/design-system.md` (Overlay palette)
- `docs/architecture/data-model.md` (Storage, Scheduled jobs)
- `docs/policies/privacy-safety.md` (Media)

## In scope
- `app/profile/wingspan/guide.tsx` (setup illustration), `capture.tsx` (expo-image-picker; guide image before camera on web; 5-second timer), `result.tsx` (photo + two measurement lines, "Wingspan ≈ … · Ape index …" in user units, avatar updates, **Looks right** · **Adjust** slider · **Retake**, "Your photo has been deleted. We only kept the measurement.").
- Photo prep with expo-image-manipulator (max 2048 px, strip location metadata) in `src/lib/media.ts`.
- All four AI states: progress, low confidence/failure reasons with **Retake** or **Type it in**, never silently saving a bad estimate.
- Saves `wingspan_cm`, `wingspan_source='photo'`, `wingspan_confidence` on confirm.
- Enable the Profile row from step 14.

## Out of scope
- Live silhouette outline (Phase 2 native).

## Prompt
> Do step 20 (`docs/plan/steps/20-wingspan-profile-ux.md`). Read the docs it lists. Build the Profile wingspan photo flow (the bucket and cleanup already exist from step 19): setup guide, capture with a 5-second timer, upload, job progress via `useJob`, and a result screen with measurement lines and Looks right / Adjust / Retake. Handle every failure reason clearly. Test on a real phone over HTTPS (`npx expo start --tunnel`). Give me commands, files, and a checklist.

## Expected files
- `app/profile/wingspan/{guide,capture,result}.tsx`, `src/lib/media.ts`, `src/features/wingspan/*`

## Done when
- [ ] End to end on iPhone Safari: photo → estimate in < 5 s target → saved number
- [ ] Storage shows no leftover photo after the flow
- [ ] Failure path shows the specific reason and offers Retake / Type it in
- [ ] Minor without consent cannot start the flow
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
