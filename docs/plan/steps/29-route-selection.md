# Step 29: Assisted route selection

**Phase:** 1 · **Depends on:** 28 · **Branch:** `feat/route-selection`

## Goal
On the holds screen, the user taps a hold color (or taps holds to add/remove), marks start hold(s) and the top hold, confirms the wall height with a slider, and saves the selection.

## Read first
- `CLAUDE.md`
- `docs/features/route-reader.md` (steps 3–4)
- `docs/design/design-system.md` (Overlay palette, 48 pt hit areas)
- `docs/architecture/data-model.md` (route_scans)

## In scope
- Color chips generated from detected hold colors; tap a chip selects all holds of that color (brighter fill).
- Tap a hold to toggle; hit areas expanded to ≥ 48 pt (C5) even for small holds; overlap resolution (nearest center).
- Mode to mark start hold(s) and top hold, with clear labels.
- Scale check: "Is this about right?" slider prefilled from the location's wall height.
- Save `route_hold_ids`, `start_hold_ids`, `top_hold_id`, `wall_height_cm`.
- Unit tests for hit-testing and color grouping logic.

## Out of scope
- Beta job (30).

## Prompt
> Do step 29 (`docs/plan/steps/29-route-selection.md`). Read the docs it lists. Build assisted route selection on the holds screen: color chips, tap-to-toggle holds with ≥ 48 pt hit areas, start/top marking, and the wall-height slider, then save to `route_scans`. Unit-test the hit-testing and grouping logic. Give me a phone checklist.

## Expected files
- `app/route/[id]/holds.tsx`, `src/features/routeScan/{selection,hitTest}.ts` + tests

## Done when
- [ ] A user can select a route in ~10 s on a real phone
- [ ] Small holds are tappable with a chalky thumb (48 pt)
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
