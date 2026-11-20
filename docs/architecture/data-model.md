# Data model (Supabase / Postgres)

> Read this for any migration, RLS, storage, or query step. This is the **target** schema; each table is created in the plan step that first needs it. Columns marked `-- ➕` were added in the docs audit (see `docs/product/decisions.md`).

```sql
profiles (
  id uuid pk references auth.users,
  display_name text,
  units text default 'imperial',            -- 'imperial' | 'metric'; client sets from locale (C7)
  experience text,                          -- 'new' | '1-3y' | '3y+' (G10a)
  max_grade text,                           -- 'V0'..'V10' | 'V11+' (G10b)
  styles jsonb,                             -- {strengths: [], weaknesses: []} (G9)
  goals text[],
  dominant_hand text,
  home_location_id uuid references locations, -- ➕ G6
  birth_year int not null,                  -- age gate; never displayed
  birth_month int not null check (birth_month between 1 and 12), -- ➕ G2a
  guardian_email text,                      -- required if under 18
  guardian_consent_at timestamptz,          -- null → minor account stays limited (G2c)
  training_data_opt_in boolean default false, -- forced false for under-18s
  video_retention text default '30d'        -- ➕ G3b
    check (video_retention in ('30d','keep','delete_now')), -- minors: never 'keep'
  disclaimer_accepted_at timestamptz,       -- ➕ G3a
  terms_accepted_at timestamptz,            -- ➕ G3a
  onboarding_completed_at timestamptz,
  created_at timestamptz default now()
)

-- Sensitive body data kept in a separate table with stricter access
body_profiles (
  user_id uuid pk references profiles,
  height_cm numeric not null,
  wingspan_cm numeric,                      -- null → assume = height
  wingspan_source text default 'default'    -- 'photo' | 'manual' | 'default'
    check (wingspan_source in ('photo','manual','default')),
  wingspan_confidence numeric,              -- 0–1, photo estimates only
  injuries text,                            -- optional
  updated_at timestamptz default now()
)

locations (id, name, kind 'gym', city, default_wall_height_cm int default 430, created_at)
-- partner gym is seeded in supabase/seed.sql

jobs (
  id uuid pk, user_id uuid, kind text check (kind in ('route_scan','technique_review','wingspan_estimate')),
  target_id uuid,                           -- route_scans.id | technique_reviews.id | body_profiles.user_id (G1b)
  status text check (status in ('queued','processing','done','failed')),
  progress int default 0, stage text, error text,   -- error = user-safe code, never a stack trace
  gpu_seconds numeric,                      -- ➕ G1a
  llm_tokens int,                           -- ➕ G1a
  created_at, updated_at
)

route_scans (
  id uuid pk,                               -- generated on device
  user_id uuid, location_id uuid,
  photo_path text, width int, height int,
  wall_height_cm int,
  holds jsonb,                              -- [{id, polygon, center, bbox, color, type_guess, confidence}] (C9)
  route_hold_ids text[],                    -- user-confirmed route holds
  start_hold_ids text[], top_hold_id text,
  sequences jsonb,                          -- [{label, moves:[{limb, from_hold, to_hold, pose, tip}]}] (C9)
  status text, created_at timestamptz
  -- rating columns removed: ratings live in feedback_ratings (C6)
)

technique_reviews (
  id uuid pk,
  user_id uuid, route_scan_id uuid null,
  video_path text,                          -- raw video: auto-deleted after 30 days (per video_retention)
  video_deleted_at timestamptz,             -- ➕ G3b
  duration_s numeric, trim_start_s numeric, trim_end_s numeric,  -- raw ≤ 120 s, trim range ≤ 60 s (G7)
  pose_path text,                           -- keypoints file in storage (JSON/binary)
  pillar_scores jsonb,                      -- {footwork: 72, ...}
  feedback jsonb,                           -- {moments:[{t, title, text, correction}], positive, drill}
  status text, created_at timestamptz
)

feedback_ratings (id, user_id, target_kind, target_id, item_key, thumbs smallint, reason text, created_at)
app_feedback (id, user_id, message, screenshot_path, app_version, platform, created_at)
```

## Security

- **Row Level Security on every table. Never disable RLS.** Every new table ships with policies **and** a pgTAP test proving another user can't read it.
- **All user content is private by default**, readable only by its owner.
- `body_profiles` is readable only by its owner and the AI worker's service role.
- **Age checks are server-side** (RLS / Edge Function), not just in the UI. Minors without `guardian_consent_at` cannot insert `jobs` or upload to storage (G2c). `training_data_opt_in` is forced false and `video_retention='keep'` is rejected for under-18s.

## Storage

Paths: `{bucket}/{user_id}/{entity_id}/{file}`, protected per user.

| Bucket | Contents | Retention |
|---|---|---|
| `route-photos` | Route Reader photos (max 2048 px, location metadata stripped) | Kept |
| `review-videos` | Raw climbing videos | 30 days by default, per `video_retention` |
| `wingspan-tmp` | Arms-out photos | Deleted right after measuring; pg_cron sweeps anything older than **1 hour** |
| `pose-data` | Pose keypoint files | Kept |
| `feedback-screenshots` ➕ | `app_feedback` screenshots (G5) | Kept |

## Scheduled jobs (pg_cron, decision G4)

- Every 15 min: delete `wingspan-tmp` objects older than 1 hour.
- Daily: delete raw videos older than 30 days where `video_retention = '30d'`; set `video_deleted_at`. Pose data and feedback are kept.
