# Step 39: Privacy & data: deletion + retention

**Phase:** 1 · **Depends on:** 35 · **Branch:** `feat/privacy-data`

## Goal
In Profile → Privacy & data, users can set video retention, change their training opt-in (adults), and delete their account and all data; raw videos are auto-deleted after 30 days.

## Read first
- `CLAUDE.md`
- `docs/policies/privacy-safety.md`
- `docs/architecture/data-model.md` (profiles.video_retention, Scheduled jobs, Storage)
- `docs/design/screens.md` (row 16b)

## In scope
- `app/profile/privacy.tsx`: retention (`30d` / `keep` / `delete_now`; minors see only `30d` / `delete_now`), training opt-in (hidden for minors), links to privacy policy + terms, Delete account (Sheet confirmation, type-to-confirm).
- `delete_now` deletes existing raw videos immediately (sets `video_deleted_at`).
- pg_cron daily job: delete raw videos older than 30 days where retention is `30d`; set `video_deleted_at` (G4). Test with a backdated row.
- Edge Function `delete-account`: deletes all rows (profiles, body_profiles, scans, reviews, ratings, feedback, jobs) and all storage objects under the user's paths, then the auth user.
- pgTAP tests for retention rules for minors.

## Out of scope
- Data export (future).

## Prompt
> Do step 39 (`docs/plan/steps/39-privacy-deletion.md`). Read the docs it lists. Build the Privacy & data screen (retention, adult-only opt-in, policy links, delete account), the 30-day pg_cron video cleanup, and a `delete-account` Edge Function that removes every row and storage object for the user. Add tests, including minor rules. Give me commands and a checklist.

## Expected files
- `app/profile/privacy.tsx`, `supabase/functions/delete-account/*`, `supabase/migrations/*_video_retention_cron.sql`, tests

## Done when
- [ ] After deletion, no rows or storage objects remain for the user (verified by script/test)
- [ ] Backdated 31-day video is deleted by the cron job; feedback is kept
- [ ] Minor cannot choose `keep`
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
