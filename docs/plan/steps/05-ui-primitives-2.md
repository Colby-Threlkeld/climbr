# Step 05: UI primitives II

**Phase:** 0 · **Depends on:** 04 · **Branch:** `feat/ui-primitives-2`

## Goal
Sheet, Toast, Slider, and ProgressSteps exist and are shown in the gallery, so later screens never need `Alert.alert`, native pickers, or native sliders.

## Read first
- `CLAUDE.md`
- `docs/design/design-system.md` (Custom components, Motion, Spacing)

## In scope
- `Sheet` (bottom sheet, spring ~300 ms, radius 20, safe-area aware), `Toast` (with a `useToast()` provider; replaces alerts), `Slider` (custom, works with touch on web), `ProgressSteps` (onboarding bar + processing stages).
- Reduce Motion respected (no spring when enabled).
- Add to gallery; component tests.

## Out of scope
- Feature-specific components. Tab bar (06).

## Prompt
> Do step 05 (`docs/plan/steps/05-ui-primitives-2.md`). Read the design-system doc. Build `Sheet`, `Toast` (with provider + hook), `Slider`, and `ProgressSteps` in `src/components/ui/`, token-only, respecting Reduce Motion and safe areas. Before adding any animation or gesture library, confirm it works on web and justify it. Add them to the gallery with tests, then give me a phone checklist.

## Expected files
- `src/components/ui/{Sheet,Toast,Slider,ProgressSteps}.tsx`
- Gallery + tests updated

## Done when
- [ ] Slider drags smoothly with a finger on iPhone Safari and Android Chrome
- [ ] Sheet clears the home indicator on web and native
- [ ] Tests pass
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
