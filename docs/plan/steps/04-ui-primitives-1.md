# Step 04: UI primitives I + dev gallery

**Phase:** 0 · **Depends on:** 03 · **Branch:** `feat/ui-primitives-1`

## Goal
Button, Card, TextField, Chip, and SegmentedControl exist as our own components, and a dev-only gallery screen shows every variant in light and dark mode.

## Read first
- `CLAUDE.md`
- `docs/design/design-system.md` (Principles, Custom components, Color rules, Spacing/touch)

## In scope
- `Button` (primary = orange fill with **ink** text, secondary, ghost, disabled, loading), `Card` (white on cream / `surface` in dark), `TextField` (label, error, numeric keyboard option), `Chip` (selectable, multi-select friendly), `SegmentedControl`.
- 48 pt minimum touch targets, accessibility roles/labels, haptics on press (native), no-op on web.
- `app/_dev/gallery.tsx` reachable only in development builds.
- Component tests (render, press, disabled, selected state).

## Out of scope
- Sheet, Toast, Slider, ProgressSteps (05). Feature components like GradeBadge, PillarBar, MomentCard, MoveCard (built with their features).

## Prompt
> Do step 04 (`docs/plan/steps/04-ui-primitives-1.md`). Read the design-system doc. Build `Button`, `Card`, `TextField`, `Chip`, and `SegmentedControl` in `src/components/ui/` using only theme tokens, with 48 pt touch targets and accessibility labels. No platform widgets. Add a dev-only gallery screen and component tests. Give me a phone checklist (web + Expo Go, light + dark).

## Expected files
- `src/components/ui/{Button,Card,TextField,Chip,SegmentedControl}.tsx`, `src/components/ui/index.ts`
- `app/_dev/gallery.tsx`
- `src/components/ui/__tests__/*`

## Done when
- [ ] Gallery shows all variants identically on iPhone Safari and Expo Go
- [ ] No hard-coded colors/sizes (lint rule or grep check)
- [ ] Ink text on orange, never white
- [ ] Tests pass
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
