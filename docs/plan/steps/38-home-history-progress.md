# Step 38: Home history + progress charts

**Phase:** 1 · **Depends on:** 32, 35 · **Branch:** `feat/home-history`

## Goal
Home lists past route scans and reviews (thumbnail, date, type) with "Continue where you left off", and Profile shows pillar scores over time.

## Read first
- `CLAUDE.md`
- `docs/design/design-system.md` (Navigation)
- `docs/design/screens.md` (rows 15–16)
- `docs/features/technique-review.md` (step 7)

## In scope
- `app/(tabs)/index.tsx`: paginated history (TanStack Query), thumbnails from signed URLs, tap to open; "Continue where you left off" for unfinished scans/reviews; a small tips card; empty state.
- Profile progress section: pillar scores across sessions as simple line/bar charts drawn with the chosen renderer (no heavy chart library unless justified and web-compatible). Enable the Profile row.
- Videos past retention show a "video deleted, feedback kept" state.

## Out of scope
- Social/sharing.

## Prompt
> Do step 38 (`docs/plan/steps/38-home-history-progress.md`). Read the docs it lists. Build the Home history list with continue-where-you-left-off and an empty state, and a pillar-progress chart section in Profile using our renderer. Handle deleted videos gracefully. Give me a phone checklist.

## Expected files
- `app/(tabs)/index.tsx`, `src/features/history/*`, `src/features/progress/*`

## Done when
- [ ] History loads fast with 30+ items on a real phone
- [ ] Progress chart reflects new reviews
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
