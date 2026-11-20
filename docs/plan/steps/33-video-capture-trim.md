# Step 33: Video capture + trim & link

**Phase:** 1 · **Depends on:** 18, 27 · **Branch:** `feat/video-capture`

## Goal
From Capture → Video, the user records or picks a video (≤ 120 s raw), trims it to ≤ 60 s, optionally links a route scan, and taps Analyze, which uploads the video and creates a `technique_review` job.

## Read first
- `CLAUDE.md`
- `docs/features/technique-review.md` (steps 1–4)
- `docs/design/screens.md` (rows 11–12)
- `docs/architecture/data-model.md` (technique_reviews, Storage)
- `docs/architecture/conventions.md` (Video time)

## In scope
- Migration: `technique_reviews` (incl. `video_deleted_at`) + RLS + pgTAP; `review-videos` bucket + policies (`can_upload`).
- Capture Video segment: recording guide ("film only yourself"), expo-image-picker for video, reject raw > 120 s (G7) with a friendly message.
- `app/review/new.tsx`: expo-video preview, trim handles (metadata only, ≤ 60 s), link-to-route picker (prefilled from step 32), Analyze.
- Upload with progress; insert review row + job.

## Out of scope
- Worker processing and Processing screen (34).

## Prompt
> Do step 33 (`docs/plan/steps/33-video-capture-trim.md`). Read the docs it lists. Add the `technique_reviews` table and `review-videos` bucket with RLS and tests, the Video capture segment with recording guide and 120 s raw limit, and the Trim & link screen (metadata trim ≤ 60 s, optional route link) that uploads and creates the job. Give me a phone checklist covering portrait and landscape videos.

## Expected files
- `supabase/migrations/*_technique_reviews.sql`, tests, `app/review/new.tsx`, `src/features/techniqueReview/*`

## Done when
- [ ] 130 s video is rejected; 90 s video can be trimmed to 60 s and uploaded
- [ ] Works on iPhone Safari, Android Chrome, Expo Go
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
