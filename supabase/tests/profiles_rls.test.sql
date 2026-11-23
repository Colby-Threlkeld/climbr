-- pgTAP tests for step 07: RLS on locations, profiles, body_profiles + under-18 guards.
-- Runs in CI only (decision D2). Each file runs in a transaction that is rolled back.
begin;
select plan(21);

-- Fake users. Birth years are relative to today so the tests don't age out.
insert into auth.users (id, email) values
  ('11111111-1111-4111-8111-111111111111', 'adult-a@test.local'),
  ('22222222-2222-4222-8222-222222222222', 'adult-b@test.local'),
  ('33333333-3333-4333-8333-333333333333', 'minor@test.local');

insert into public.profiles (id, display_name, birth_year, birth_month) values
  ('11111111-1111-4111-8111-111111111111', 'A', extract(year from now())::int - 30, 1),
  ('22222222-2222-4222-8222-222222222222', 'B', extract(year from now())::int - 30, 1);

insert into public.body_profiles (user_id, height_cm) values
  ('11111111-1111-4111-8111-111111111111', 180),
  ('22222222-2222-4222-8222-222222222222', 165);

-- ---------------------------------------------------------------------------
-- Structure
-- ---------------------------------------------------------------------------
select ok((select relrowsecurity from pg_class where oid = 'public.locations'::regclass), 'RLS is on for locations');
select ok((select relrowsecurity from pg_class where oid = 'public.profiles'::regclass), 'RLS is on for profiles');
select ok((select relrowsecurity from pg_class where oid = 'public.body_profiles'::regclass), 'RLS is on for body_profiles');
select is_empty(
  $$ select 1 from information_schema.columns where table_schema = 'public' and column_name ilike '%weight%' $$,
  'no weight column anywhere'
);

-- ---------------------------------------------------------------------------
-- As user A
-- ---------------------------------------------------------------------------
set local role authenticated;
-- auth.uid() reads the user id from these JWT claims, so this "signs in" as A.
set local request.jwt.claims = '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}';

select results_eq($$ select count(*)::int from public.profiles $$, array[1], 'A sees exactly one profile');
select results_eq($$ select display_name from public.profiles $$, array['A'], 'the profile A sees is their own');
select is_empty(
  $$ select 1 from public.profiles where id = '22222222-2222-4222-8222-222222222222' $$,
  'A cannot read B''s profile'
);
select results_eq($$ select count(*)::int from public.body_profiles $$, array[1], 'A sees exactly one body profile');
select is_empty(
  $$ select 1 from public.body_profiles where user_id = '22222222-2222-4222-8222-222222222222' $$,
  'A cannot read B''s body profile'
);
select throws_ok(
  $$ insert into public.body_profiles (user_id, height_cm) values ('33333333-3333-4333-8333-333333333333', 170) $$,
  '42501', null,
  'A cannot insert a body profile for someone else'
);

-- Updates to rows RLS hides affect 0 rows (no error), so check B's data afterwards.
update public.profiles set display_name = 'hacked' where id = '22222222-2222-4222-8222-222222222222';
update public.body_profiles set height_cm = 999 where user_id = '22222222-2222-4222-8222-222222222222';

select throws_ok(
  $$ update public.profiles set birth_year = 1990 where id = '11111111-1111-4111-8111-111111111111' $$,
  '42501', null,
  'A cannot change their own birth year'
);
select throws_ok(
  $$ update public.profiles set guardian_consent_at = now() where id = '11111111-1111-4111-8111-111111111111' $$,
  '42501', null,
  'A cannot set guardian consent themselves'
);

-- Locations: readable, not writable.
select isnt_empty($$ select 1 from public.locations $$, 'signed-in users can read locations (seeded partner gym)');
select throws_ok(
  $$ insert into public.locations (name) values ('Fake gym') $$,
  '42501', null,
  'signed-in users cannot insert locations'
);
select throws_ok(
  $$ update public.locations set name = 'renamed' $$,
  '42501', null,
  'signed-in users cannot update locations'
);

reset role;
select results_eq(
  $$ select display_name from public.profiles where id = '22222222-2222-4222-8222-222222222222' $$,
  array['B'], 'A''s update did not change B''s profile'
);
select results_eq(
  $$ select height_cm from public.body_profiles where user_id = '22222222-2222-4222-8222-222222222222' $$,
  array[165::numeric], 'A''s update did not change B''s body profile'
);

-- ---------------------------------------------------------------------------
-- Signed out (anon)
-- ---------------------------------------------------------------------------
set local role anon;
select throws_ok($$ select * from public.profiles $$, '42501', null, 'signed-out users cannot read profiles');
select throws_ok($$ select * from public.body_profiles $$, '42501', null, 'signed-out users cannot read body profiles');
reset role;

-- ---------------------------------------------------------------------------
-- Under-18 guards (the minor signs up and tries to opt in / keep videos)
-- ---------------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claims = '{"sub":"33333333-3333-4333-8333-333333333333","role":"authenticated"}';

insert into public.profiles (id, birth_year, birth_month, training_data_opt_in)
values ('33333333-3333-4333-8333-333333333333', extract(year from now())::int - 15, 1, true);
update public.profiles set training_data_opt_in = true where id = '33333333-3333-4333-8333-333333333333';

select results_eq(
  $$ select training_data_opt_in from public.profiles $$,
  array[false], 'a minor''s training-data opt-in is forced false'
);
select throws_ok(
  $$ update public.profiles set video_retention = 'keep' where id = '33333333-3333-4333-8333-333333333333' $$,
  '23514', null,
  'a minor cannot choose to keep videos longer'
);

select * from finish();
rollback;
