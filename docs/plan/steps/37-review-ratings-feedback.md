# Step 37: Review ratings + Send feedback

**Phase:** 1 · **Depends on:** 32, 36 · **Branch:** `feat/review-ratings-feedback`

## Goal
Each feedback point on a review can be rated 👍/👎 ("Was this right?"), and from Profile the user can send free-text app feedback with an optional screenshot.

## Read first
- `CLAUDE.md`
- `docs/features/technique-review.md` (step 6)
- `docs/design/screens.md` (row 16c)
- `docs/architecture/data-model.md` (feedback_ratings, app_feedback, Storage)

## In scope
- `RatingControl` on each moment, the positive, and the drill (`target_kind='technique_review'`, `item_key` = moment index / `positive` / `drill`).
- Migration: `app_feedback` + RLS + pgTAP; `feedback-screenshots` bucket (decision G5).
- `app/profile/feedback.tsx`: message, optional screenshot (image picker), app version + platform auto-filled. Enable the Profile row.

## Out of scope
- Admin tooling for reading feedback (use the Supabase dashboard).

## Prompt
> Do step 37 (`docs/plan/steps/37-review-ratings-feedback.md`). Read the docs it lists. Add per-point ratings on review results using `RatingControl`, the `app_feedback` table and `feedback-screenshots` bucket with RLS and tests, and the Send feedback screen. Give me a phone checklist.

## Expected files
- `supabase/migrations/*_app_feedback.sql`, tests, `app/profile/feedback.tsx`, results screen updated

## Done when
- [ ] Ratings persist per point; feedback with screenshot appears in the DB/storage
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
