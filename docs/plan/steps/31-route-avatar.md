# Step 31: Route avatar animation

**Phase:** 1 · **Depends on:** 30 · **Branch:** `feat/route-avatar`

## Goal
A 2D avatar scaled to the user's body climbs the selected sequence over the photo, move by move, with play/pause, step forward/back, and 0.5×/1× speed.

## Read first
- `CLAUDE.md`
- `docs/ai/avatar.md`
- `docs/features/route-reader.md` (step 6)
- `docs/design/design-system.md` (Motion, Reduce Motion)

## In scope
- `src/avatar/ik.ts`: simple 2D two-bone IK so hands/feet stay on holds and limbs bend naturally.
- `src/avatar/interpolate.ts`: pose interpolation between solver poses (~0.8 s per move default).
- Controls UI; sync current move with the highlighted `MoveCard` and dots.
- Reduce Motion: auto-play off, step-through only.
- Thorough unit tests for IK and interpolation (pure logic).

## Out of scope
- Ghost overlay (36). 3D (R1).

## Prompt
> Do step 31 (`docs/plan/steps/31-route-avatar.md`). Read the docs it lists. Implement 2D IK and pose interpolation in `src/avatar/` (renderer-agnostic, unit-tested), then animate the `Avatar` over the photo along the selected sequence with play/pause, step, and speed controls synced to the move cards. Respect Reduce Motion. Give me a phone checklist.

## Expected files
- `src/avatar/{ik,interpolate}.ts` + tests, `src/features/routeScan/AvatarPlayer.tsx`

## Done when
- [ ] Avatar animates smoothly on iPhone Safari and Expo Go; limbs never detach from holds
- [ ] Reduce Motion disables auto-play
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
