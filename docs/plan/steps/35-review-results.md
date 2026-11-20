# Step 35: Review results

**Phase:** 1 · **Depends on:** 34 · **Branch:** `feat/review-results`

## Goal
The results screen plays the video with a toggleable skeleton overlay synced to playback, shows pillar bars, up to 3 moment cards that seek the video, a positive note, and one drill.

## Read first
- `CLAUDE.md`
- `docs/features/technique-review.md` (step 5)
- `docs/design/screens.md` (row 14), `docs/design/design-system.md` (Overlay palette, Principles)
- `docs/architecture/conventions.md` (Video time, Pose keypoints, schema_version)

## In scope
- `app/review/[id]/index.tsx`: expo-video player; `Skeleton` overlay (white, 70% opacity) synced to current time from the pose file; toggle.
- `PillarBar` (5 bars, no single overall score), `MomentCard` (timestamp, title, 1–2 sentences, "Show me" seeks the video — ghost comes in 36), positive note shown first, drill card.
- Unknown `schema_version` → "update the app" state. All four AI states.

## Out of scope
- Ghost (36). Ratings (37).

## Prompt
> Do step 35 (`docs/plan/steps/35-review-results.md`). Read the docs it lists. Build the review results screen: video with a playback-synced skeleton overlay and toggle, five `PillarBar`s, up to three `MomentCard`s that seek the video, the positive note, and the drill. Handle schema version mismatch and all AI states. Give me a phone checklist.

## Expected files
- `app/review/[id]/index.tsx`, `src/components/overlay/Skeleton.tsx`, `src/components/ui/{PillarBar,MomentCard}.tsx`, `src/features/techniqueReview/usePoseTrack.ts`

## Done when
- [ ] Skeleton stays aligned while scrubbing on iPhone Safari and Expo Go
- [ ] No single overall score anywhere
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
