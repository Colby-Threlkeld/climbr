# Step 07: Supabase: profiles, body_profiles, locations + RLS

**Phase:** 0 · **Depends on:** 02 · **Branch:** `feat/db-profiles`

## Goal
A local Supabase stack runs with `profiles`, `body_profiles`, and `locations` tables (partner gym seeded), RLS policies, and pgTAP tests proving users can only see their own rows, and CI runs those tests.

## Read first
- `CLAUDE.md`
- `docs/architecture/data-model.md`
- `docs/policies/privacy-safety.md` (Age and minors, Body data)
- `docs/dev/setup-windows.md` (Supabase commands, Docker)

## In scope
- `npx supabase init`, migrations for `locations`, `profiles` (all columns incl. audit additions: `birth_month`, `home_location_id`, `video_retention`, `disclaimer_accepted_at`, `terms_accepted_at`), `body_profiles`.
- Check constraints from the data model. DB-level guards: `training_data_opt_in` must be false and `video_retention <> 'keep'` when the user is under 18 (trigger or check via a helper function on birth year/month).
- RLS: owner-only read/write on `profiles` and `body_profiles`; `locations` readable by any signed-in user, no client writes.
- `supabase/seed.sql`: the partner gym (`default_wall_height_cm 430`; name as a placeholder the developer fills in).
- pgTAP tests: cross-user read denied on both tables; minor opt-in forced false; locations read-only.
- CI job: `supabase db reset` + `supabase test db`.
- `src/lib/supabase.ts` client using `EXPO_PUBLIC_*` vars only.

## Out of scope
- `jobs`, `route_scans`, `technique_reviews`, ratings, feedback tables (later steps). Auth UI (08).

## Prompt
> Do step 07 (`docs/plan/steps/07-supabase-profiles.md`). Read the docs it lists. Set up local Supabase and write migrations for `locations`, `profiles`, and `body_profiles` exactly as in `data-model.md`, with RLS, the under-18 guards, a seed for the partner gym, and pgTAP tests. Add the Supabase client in `src/lib/supabase.ts` and a CI job for db reset + pgTAP. Give me exact Windows commands (Docker Desktop is required) and a checklist.

## Expected files
- `supabase/config.toml`, `supabase/migrations/*_profiles.sql`, `supabase/seed.sql`, `supabase/tests/*.sql`
- `src/lib/supabase.ts`, `.env.example` (confirm vars), CI workflow updated

## Done when
- [ ] `npx supabase db reset` and `npx supabase test db` pass locally and in CI
- [ ] A test proves user B cannot select user A's `profiles` or `body_profiles`
- [ ] No weight column anywhere
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
