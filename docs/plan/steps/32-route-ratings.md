# Step 32: Route ratings + "Try it, then film it"

**Phase:** 1 · **Depends on:** 31 · **Branch:** `feat/route-ratings`

## Goal
The user can rate a suggested sequence 👍/👎 with an optional reason, and tap "Try it, then film it" to start a video review linked to this route.

## Read first
- `CLAUDE.md`
- `docs/features/route-reader.md` (steps 8–9)
- `docs/architecture/data-model.md` (feedback_ratings, decision C6)

## In scope
- Migration: `feedback_ratings` + RLS + pgTAP (owner-only; worker/service role may read for analysis).
- Reusable `RatingControl` (👍/👎 + optional reason chips: wrong holds / impossible move / not how I'd do it).
- Ratings keyed by `target_kind='route_scan'`, `target_id`, `item_key=<sequence label>`.
- "Try it, then film it" button → navigates to video capture with `route_scan_id` preset (destination screen may be a placeholder until 33).

## Out of scope
- Review ratings (37).

## Prompt
> Do step 32 (`docs/plan/steps/32-route-ratings.md`). Read the docs it lists. Add the `feedback_ratings` table with RLS and tests, a reusable `RatingControl`, route-sequence ratings, and the "Try it, then film it" button that carries the route ID into video capture. Give me a phone checklist.

## Expected files
- `supabase/migrations/*_feedback_ratings.sql`, tests, `src/components/ui/RatingControl.tsx`, route screen updated

## Done when
- [ ] Rating persists and is re-shown on reload
- [ ] Another user cannot read the rating (pgTAP)
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
