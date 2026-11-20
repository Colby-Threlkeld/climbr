# Step 10: Spike: Skia vs SVG

**Phase:** 0 · **Depends on:** 03 · **Branch:** `chore/spike-overlay-renderer`

## Goal
Decide, with measurements from a real phone, whether overlays and the avatar are drawn with `@shopify/react-native-skia` or `react-native-svg`, and record the result in `docs/product/decisions.md` (G12a).

## Read first
- `CLAUDE.md`
- `docs/architecture/tech-stack.md` (Overlays/avatar row)
- `docs/ai/avatar.md`
- `docs/design/design-system.md` (Overlay palette)

## In scope
- A throwaway dev screen per library drawing over a sample wall photo: ~60 hold outlines, 12 numbered dots (circles + rounded squares), dashed + solid lines with dark outline/shadow, and a simple jointed figure animating at 60 fps.
- Measure on iPhone Safari (via HTTPS tunnel or Vercel preview) and Expo Go: first-load size/time on web (cold cache), animation smoothness, tap hit-testing on a hold.
- Write a short results table into `decisions.md` → Spike results, plus the recommendation. **Developer confirms** the choice.
- Remove the loser library and the spike screens after the decision (keep a note of numbers).

## Out of scope
- Real overlay components (built with features). The avatar body model (11).

## Prompt
> Do step 10 (`docs/plan/steps/10-spike-skia-vs-svg.md`). Read the docs it lists. Build two throwaway dev screens, one with Skia and one with react-native-svg, drawing the same overlay test scene over a sample photo plus an animated jointed figure. Tell me exactly how to measure first-load time and smoothness on my iPhone in Safari and in Expo Go, then summarize the results in a table and recommend one. Wait for my confirmation before recording it in `decisions.md` and removing the other library.

## Expected files
- `app/_dev/spike-skia.tsx`, `app/_dev/spike-svg.tsx` (temporary)
- `docs/product/decisions.md` (Spike results row)

## Done when
- [ ] Measurements recorded for both libraries on iPhone Safari + Expo Go
- [ ] Decision confirmed by the developer and recorded under G12a
- [ ] Unused library and spike screens removed
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
