-- Seed data. Runs after migrations on `supabase db reset` (CI) and with
-- `supabase db push --remote --include-seed` (hosted dev project).
-- Keep it idempotent: a fixed id + `on conflict do nothing` makes re-running safe.

-- The partner gym (decision G6). TODO(developer): replace the placeholder name and city.
insert into public.locations (id, name, kind, city, default_wall_height_cm)
values ('00000000-0000-4000-8000-000000000001', 'Partner Gym (placeholder)', 'gym', null, 430)
on conflict (id) do nothing;
