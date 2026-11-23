-- Step 07: locations, profiles, body_profiles + RLS + under-18 guards.
-- Source of truth: docs/architecture/data-model.md. No weight column, ever (privacy-safety.md).
--
-- Grants are explicit on purpose: Supabase is making the default table grants for
-- anon/authenticated opt-in, so we grant exactly what each role needs and nothing more.
-- RLS then decides which rows those grants apply to.

-- ---------------------------------------------------------------------------
-- locations: gyms. Readable by any signed-in user; no client writes.
-- ---------------------------------------------------------------------------
create table public.locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kind text not null default 'gym' check (kind = 'gym'),
  city text,
  default_wall_height_cm int not null default 430 check (default_wall_height_cm > 0),
  created_at timestamptz not null default now()
);

alter table public.locations enable row level security;

revoke all on public.locations from anon, authenticated;
grant select on public.locations to authenticated;

create policy "locations: signed-in users can read"
  on public.locations for select to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- profiles: one row per user. Owner-only.
-- ---------------------------------------------------------------------------
create table public.profiles (
  -- Cascade so deleting the auth user deletes all their data (account deletion, privacy-safety.md).
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  units text not null default 'imperial' check (units in ('imperial', 'metric')), -- C7
  experience text check (experience in ('new', '1-3y', '3y+')), -- G10a
  max_grade text check (max_grade ~ '^V([0-9]|10|11\+)$'), -- G10b: V0..V10 | V11+
  styles jsonb check (styles is null or jsonb_typeof(styles) = 'object'), -- G9
  goals text[],
  dominant_hand text,
  home_location_id uuid references public.locations (id) on delete set null, -- G6
  birth_year int not null check (birth_year between 1900 and 2100), -- never displayed
  birth_month int not null check (birth_month between 1 and 12), -- G2a
  guardian_email text, -- required for minors; enforced in the consent flow (step 15)
  guardian_consent_at timestamptz, -- null -> minor account stays limited (G2c)
  training_data_opt_in boolean not null default false, -- forced false for under-18s
  video_retention text not null default '30d'
    check (video_retention in ('30d', 'keep', 'delete_now')), -- G3b; minors never 'keep'
  disclaimer_accepted_at timestamptz, -- G3a
  terms_accepted_at timestamptz, -- G3a
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

revoke all on public.profiles from anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
-- No client delete: a profile is removed by deleting the auth user (cascade), so a
-- user can't end up signed in without a profile.

-- `(select auth.uid())` instead of `auth.uid()` lets Postgres evaluate it once per
-- query instead of once per row (Supabase RLS performance guidance).
create policy "profiles: owner can read"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "profiles: owner can insert"
  on public.profiles for insert to authenticated
  with check ((select auth.uid()) = id);

create policy "profiles: owner can update"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- ---------------------------------------------------------------------------
-- Age helper. Age is computed from the 1st of the birth month (decision G2a).
-- Stable, not immutable, because it defaults to today's date.
-- ---------------------------------------------------------------------------
create function public.age_from_birth(p_birth_year int, p_birth_month int, p_on date default current_date)
returns int
language sql
stable
set search_path = ''
as $$
  select extract(year from age(p_on, make_date(p_birth_year, p_birth_month, 1)))::int
$$;

-- ---------------------------------------------------------------------------
-- Under-18 guards, enforced in the database so no client can skip them (rule 9).
-- ---------------------------------------------------------------------------
create function public.profiles_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  -- Clients (anon/authenticated) can't change the fields the age and consent rules
  -- depend on. Otherwise a minor could edit their birth year to look 18 and get around
  -- every guard below, or mark their own guardian consent. Server code (service_role,
  -- Edge Functions) is not restricted. The trigger runs as the caller, so current_user
  -- is the caller's role.
  if current_user in ('anon', 'authenticated') then
    if tg_op = 'INSERT' and new.guardian_consent_at is not null then
      raise exception 'guardian_consent_at can only be set by the server'
        using errcode = 'insufficient_privilege';
    end if;
    if tg_op = 'UPDATE' and (
      new.birth_year is distinct from old.birth_year
      or new.birth_month is distinct from old.birth_month
      or new.guardian_consent_at is distinct from old.guardian_consent_at
    ) then
      raise exception 'birth date and guardian consent can only be changed by the server'
        using errcode = 'insufficient_privilege';
    end if;
  end if;

  if public.age_from_birth(new.birth_year, new.birth_month) < 18 then
    -- Forced, not rejected: the opt-in is never offered to minors (data-model.md Security).
    new.training_data_opt_in := false;
    if new.video_retention = 'keep' then
      raise exception 'video_retention ''keep'' is not allowed for users under 18'
        using errcode = 'check_violation';
    end if;
  end if;

  return new;
end;
$$;

create trigger profiles_guard
  before insert or update on public.profiles
  for each row execute function public.profiles_guard();

-- ---------------------------------------------------------------------------
-- body_profiles: sensitive body data, separate table. Owner (and service role) only.
-- ---------------------------------------------------------------------------
create table public.body_profiles (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  height_cm numeric not null check (height_cm > 0),
  wingspan_cm numeric check (wingspan_cm > 0), -- null -> assume = height
  wingspan_source text not null default 'default'
    check (wingspan_source in ('photo', 'manual', 'default')),
  wingspan_confidence numeric check (wingspan_confidence between 0 and 1), -- photo only
  injuries text, -- optional
  updated_at timestamptz not null default now()
);

alter table public.body_profiles enable row level security;

revoke all on public.body_profiles from anon, authenticated;
grant select, insert, update, delete on public.body_profiles to authenticated;

create policy "body_profiles: owner can read"
  on public.body_profiles for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "body_profiles: owner can insert"
  on public.body_profiles for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "body_profiles: owner can update"
  on public.body_profiles for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "body_profiles: owner can delete"
  on public.body_profiles for delete to authenticated
  using ((select auth.uid()) = user_id);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger body_profiles_set_updated_at
  before update on public.body_profiles
  for each row execute function public.set_updated_at();
