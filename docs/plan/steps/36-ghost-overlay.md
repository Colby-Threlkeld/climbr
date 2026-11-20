# Step 36: Ghost overlay ("Show me")

**Phase:** 1 · **Depends on:** 35, 11 · **Branch:** `feat/ghost-overlay`

## Goal
Tapping "Show me" on a moment pauses the video at that time and fades in an orange translucent ghost that animates from the user's actual pose to the corrected pose, with a "solid = you, ghost = better" legend.

## Read first
- `CLAUDE.md`
- `docs/ai/avatar.md` (Correction ghost)
- `docs/features/technique-review.md` (step 5)
- `docs/design/design-system.md` (Overlay palette: ghost = accent 55% + glow; Reduce Motion)

## In scope
- `src/avatar/corrections.ts`: apply a correction spec (or the worker's target pose) to the user's pose via IK; unit tests.
- `src/components/overlay/Ghost.tsx`: accent color, 55% opacity, glow; animation from actual → better; legend.
- Reduce Motion: show end pose without animation.
- Works for each of the 3 moments.

## Out of scope
- 3D ghost (R1).

## Prompt
> Do step 36 (`docs/plan/steps/36-ghost-overlay.md`). Read the docs it lists. Implement correction application in `src/avatar/corrections.ts` (unit-tested, renderer-agnostic) and a `Ghost` overlay that animates from the user's pose to the better pose when "Show me" is tapped, with the legend and Reduce Motion support. Give me a phone checklist.

## Expected files
- `src/avatar/corrections.ts` + tests, `src/components/overlay/Ghost.tsx`, results screen updated

## Done when
- [ ] Ghost aligns with the user's body at the moment's timestamp on web and Expo Go
- [ ] Legend visible; Reduce Motion respected
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
