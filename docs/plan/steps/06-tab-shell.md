# Step 06: Tab shell

**Phase:** 0 · **Depends on:** 05 · **Branch:** `feat/tab-shell`

## Goal
The app has a custom bottom tab bar (Home · center Capture · Profile) with placeholder screens, and it looks the same on phone web and Expo Go.

## Read first
- `CLAUDE.md`
- `docs/design/design-system.md` (Navigation, Spacing/touch)
- `docs/design/screens.md` (rows 8, 15, 16)

## In scope
- `app/(tabs)/_layout.tsx` with a custom tab bar: 76 pt orange capture button in the center, safe-area padding, labels.
- Placeholders: `(tabs)/index.tsx` (Home), `(tabs)/capture.tsx` (with Route photo / Video `SegmentedControl`, Route photo default), `(tabs)/profile.tsx`.
- Screen transition ~250 ms.

## Out of scope
- Auth gating (08), real content.

## Prompt
> Do step 06 (`docs/plan/steps/06-tab-shell.md`). Read the docs it lists. Build the custom bottom tab bar with a centered 76 pt capture button and three placeholder tab screens; the Capture screen shows a Route photo / Video segmented control. Token-only, safe-area correct on web. Give me a phone checklist.

## Expected files
- `app/(tabs)/_layout.tsx`, `app/(tabs)/index.tsx`, `app/(tabs)/capture.tsx`, `app/(tabs)/profile.tsx`
- `src/components/ui/TabBar.tsx` (or similar)

## Done when
- [ ] Tabs switch on all three targets; capture button is centered and 76 pt
- [ ] Tab bar sits above the iPhone home indicator in Safari
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
