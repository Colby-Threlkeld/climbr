# Decisions log

> The record of every product and engineering decision. If code or another doc disagrees with this file, this file wins. Flag the conflict, don't silently pick. New proposals are added under **Pending** marked 🔶 DECISION until the founder confirms them.

## Product decisions (finalized November 2026, spec v3)

| Decision | Final call |
|---|---|
| Scope | **Indoor bouldering gyms only.** No outdoor, no ropes |
| Partner gym | Secured, plus a strong climber/setter |
| Project intent | **Startup** |
| Weight | **Not collected** |
| Route selection | Assisted (tap a hold color, adjust, mark start/top) |
| Max video length | 60 seconds (analyzed/trimmed range) |
| Avatar | 2D ships in Phase 1. 3D R&D runs in parallel (`docs/ai/avatar.md`) |
| Hero feature | Decide after testing: build and test both, polish the winner |
| Differentiators | Keep all three (`overview.md`) |
| Raw video retention | 30 days, then auto-delete |
| Minimum age | 13+. Ages 13–17 need parental consent (`docs/policies/privacy-safety.md`) |
| Training data | Opt-in, off by default, adults only |
| Wingspan display | Approximate (≈) with an adjust slider |
| AI hosting | Modal |
| Brand colors | Cream `#F4EFE6` · Ink `#141414` · Tape orange `#FF5A1F` (`docs/design/design-system.md`) |
| Business model | None yet, free through Phase 2 (`roadmap.md`) |
| Engineering defaults | Accepted as written in `docs/architecture/conventions.md` |

## Audit decisions (confirmed November 2026, docs restructure)

These resolve contradictions and gaps found when the spec was split. IDs (C = contradiction, G = gap, O = outdated) are referenced from other docs.

### Tools and setup
| ID | Decision |
|---|---|
| C1 | Python packages are managed with **uv** (not pip + venv). |
| C2 | Python lint **and** format with **Ruff only** (no Black). |
| C3 | The Expo app is scaffolded **at the repo root**. There is no `cruxshot/` subfolder. |
| C10 | Web hosting is **Vercel**. |
| O3 | ~~The repo stays in OneDrive.~~ **Superseded Nov 2026 (step 02):** the repo lives **outside OneDrive** at `C:\dev\cruxshot`; GitHub is the backup. Reason: npm deletes a `node_modules` junction on every install ("Removing non-directory"), so there was no reliable way to keep `node_modules` out of OneDrive sync. |

### Data and contracts
| ID | Decision |
|---|---|
| C4 | `shared/schemas/` (JSON Schema) is the **only** contract. The worker uses **generated** Pydantic types; no hand-written shared schemas in `worker/coach/`. |
| C6 | Route ratings are stored **only in `feedback_ratings`**. `route_scans` has no rating columns. |
| C9 | A move is `{limb, from_hold, to_hold, pose, tip}`. A hold is `{id, polygon, center, bbox, color, type_guess, confidence}`. |
| G1a | `jobs` has `gpu_seconds numeric` and `llm_tokens int` from day one. |
| G1b | A `wingspan_estimate` job's `target_id` is the user's `body_profiles.user_id`. |
| G3a | `profiles` gets `disclaimer_accepted_at` and `terms_accepted_at`. |
| G3b | `profiles` gets `video_retention` (`'30d' \| 'keep' \| 'delete_now'`, default `'30d'`; minors forced `'30d'` or `'delete_now'`). `technique_reviews` gets `video_deleted_at`. |
| G4 | Timed cleanup uses **pg_cron** scheduled jobs: `wingspan-tmp` older than 1 hour, raw videos older than 30 days (respecting `video_retention`). |
| G5 | New storage bucket **`feedback-screenshots`** for `app_feedback.screenshot_path`. |
| G6 | Phase 1 has a **simple gym picker** (list from `locations`, partner gym seeded). The choice is saved as `profiles.home_location_id` and preselected on each scan. |
| G13 | Job trigger: **database webhook → Edge Function → worker**, signed with HMAC (`WORKER_WEBHOOK_SECRET`). |

### Product and UX
| ID | Decision |
|---|---|
| C5 | Minimum touch target is **48 pt everywhere**, including expanded hold hit areas. |
| C7 | Units are **detected from locale** on the client at onboarding. `'imperial'` is only the fallback. |
| C8 | Phase 1 has **in-app notifications only** ("Your review is ready"). Push notifications are Phase 2. |
| C11 | The **wingspan photo estimate lives in Profile only**, not in onboarding. Onboarding step ① offers **Type it in** or **Skip**. Onboarding stays at 4 screens. |
| C12 | Ape index is always shown **in the user's units with the unit label** (e.g. "+2 cm" or "+0.8 in"). |
| G7 | Raw video uploads are capped at **120 seconds**. The trimmed (analyzed) range is capped at 60 s. |
| G9 | Style is **two chip groups**: "I'm good at" and "I want to improve" (same options). Stored as `styles = {strengths: [], weaknesses: []}`. |
| G10a | Experience options: **"Under 1 year" (`new`) · "1–3 years" (`1-3y`) · "3+ years" (`3y+`)**. Chosen set was "<1y / 1–2y / 3y+"; the middle label is widened to 1–3 years so there's no 2–3 year gap. |
| G10b | Grade picker: **V0–V10 plus "V11+"** (Font optional). |
| G11 | Font stack string is used **on web only**. Native uses the platform default system font (SF Pro on iOS). |

### Age and consent
| ID | Decision |
|---|---|
| G2a | Sign-up asks **birth month + birth year**. Age is computed from the 1st of the month (conservative). Under 13 → blocked. Stored as `birth_year` + `birth_month`, never displayed. |
| G2b | Sign-up flow adds a **birth date screen** and, for 13–17, a **guardian email screen**. |
| G2c | **Limited account** (13–17 before guardian consent): can finish onboarding and browse, **cannot upload** photos or videos (enforced by RLS on storage + `jobs` insert, not just UI). |

### Open technical choices and plan
| ID | Decision |
|---|---|
| G12a | Skia vs SVG is decided by a **spike step** (plan step 10) on a real phone. Result recorded here. |
| G12b | Pose model is decided by a **spike step** (plan step 24) on real climbing video. Result recorded here. |
| O1 | The old one-shot kickoff prompt is **replaced by `docs/plan/BUILD_PLAN.md`**. |
| O4 | Wingspan estimation is built in Phase 0, **before** the Phase 0.5 AI-prototype gate, on purpose: it is small and proves the whole upload → job → worker → result pipeline. |

### Spike results
| ID | Result |
|---|---|
| G12a Skia vs SVG | _pending (step 10)_ |
| G12b Pose model | _pending (step 24)_ |

## Still open

1. **Real app name.** "Cruxshot" is a working name. Check App Store, domain, and trademark.
2. **Wingspan photo needs a full-body shot** (head to toe in frame), because the math depends on knowing the user's height in the photo. Flag it if that's a problem.

## Pending 🔶 DECISIONS

_None right now._ Add new proposals here with an ID, the options, and a recommendation.
