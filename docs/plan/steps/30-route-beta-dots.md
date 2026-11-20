# Step 30: Suggested beta: dots, lines, move cards

**Phase:** 1 · **Depends on:** 29 · **Branch:** `feat/route-beta`

## Goal
After confirming the route, the user sees numbered limb-colored dots connected by lines for up to 3 suggested sequences (tabs A/B/C), and swipeable move cards with short, body-aware tips.

## Read first
- `CLAUDE.md`
- `docs/features/route-reader.md` (steps 5, 7, Honesty rule)
- `docs/ai/beta-solver.md`, `docs/ai/llm-coaching.md` (LLM interface)
- `docs/design/design-system.md` (Overlay palette)

## In scope
- Worker: beta stage of the `route_scan` job using `worker/beta` + LLM move tips (body-aware wording, "suggested" language); writes `sequences`; `llm_tokens`.
- `app/route/[id]/index.tsx`: `BetaDots` (circles for hands, rounded squares for feet, cyan left / magenta right, numbered), `SequenceLines` (solid hands, dashed feet, white 3 pt with dark outline), legend with L/R, sequence tabs, `MoveCard` swipeable list, "suggested" label.
- Results appear piece by piece (holds → dots).
- All four AI states.

## Out of scope
- Avatar animation (31). Ratings and "Try it" (32).

## Prompt
> Do step 30 (`docs/plan/steps/30-route-beta-dots.md`). Read the docs it lists. Add the beta stage to the route_scan worker job (solver + LLM move tips) and build the suggested-beta screen with `BetaDots`, `SequenceLines`, a legend, A/B/C tabs, and swipeable `MoveCard`s. Never use "optimal". Give me a phone checklist.

## Expected files
- `worker/` beta stage + tests, `src/components/overlay/{BetaDots,SequenceLines}.tsx`, `src/components/ui/MoveCard.tsx`, `app/route/[id]/index.tsx`

## Done when
- [ ] Median photo → dots < 20 s end to end on a real phone
- [ ] Hands vs feet distinguishable in grayscale (shape check)
- [ ] No "optimal/best/correct" strings in UI (grep)
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
