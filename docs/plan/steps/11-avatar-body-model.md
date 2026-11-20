# Step 11: Avatar body model + preview

**Phase:** 0 · **Depends on:** 10 · **Branch:** `feat/avatar-body-model`

## Goal
`src/avatar/` turns height + wingspan into a renderer-agnostic 2D body (segment lengths + joint positions), and an `AvatarPreview` component draws the stylized mannequin that visibly resizes when the inputs change.

## Read first
- `CLAUDE.md`
- `docs/ai/avatar.md`
- `docs/ai/beta-solver.md` (Body model)
- `docs/architecture/conventions.md` (Data, avatar rule)
- `docs/product/decisions.md` (G12a result)

## In scope
- `src/avatar/bodyModel.ts`: standard body-segment proportions (arm, forearm, torso, thigh, shin as fractions of height; arm length adjusted by ape index). Metric in, metric out. Wingspan missing → equals height.
- `src/avatar/types.ts`: joints, `Pose` type (joint positions), limb enum `LH|RH|LF|RF`.
- `src/avatar/pose.ts`: a neutral standing pose and an arms-out pose from a body model.
- `src/components/overlay/Avatar.tsx`: stylized mannequin (rounded limb shapes, not a stick figure) drawn with the library chosen in step 10, from a `Pose` only.
- Thorough unit tests on the body model (proportions sum sensibly, ape index changes arm length only, extreme inputs clamp).
- Add to the dev gallery with height/wingspan sliders.
- Document the proportion constants so `worker/beta/body_model.py` (step 23) can mirror them.

## Out of scope
- IK and interpolation (31). Ghost (36). Onboarding wiring (12).

## Prompt
> Do step 11 (`docs/plan/steps/11-avatar-body-model.md`). Read the docs it lists. Build the renderer-agnostic body model and pose types in `src/avatar/` (pure TypeScript, metric, fully unit-tested) and an `Avatar` overlay component that draws a stylized rounded-limb mannequin from a pose using the renderer chosen in step 10. Add a gallery demo with height and wingspan sliders. Keep drawing code out of `src/avatar/`. Give me a phone checklist.

## Expected files
- `src/avatar/{types,bodyModel,pose}.ts` + `__tests__/`
- `src/components/overlay/Avatar.tsx`
- Gallery updated

## Done when
- [ ] Moving the height slider visibly resizes the avatar on web and Expo Go
- [ ] `src/avatar/` has no imports from rendering libraries
- [ ] Unit tests cover proportions and ape-index behavior
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
