# Step 25: Technique metrics + key moments

**Phase:** 0.5 · **Depends on:** 24 · **Branch:** `ai/technique-metrics`

## Goal
From a pose track (and optionally holds), `worker/pose/contacts.py` and `worker/technique/` compute the five pillar scores (0–100) and pick up to 3 distinct key moments with timestamps.

## Read first
- `CLAUDE.md`
- `docs/ai/pose-and-technique.md` (pillars table, key moments)
- `docs/architecture/conventions.md` (Video time, Limbs)

## In scope
- `contacts.py`: which hold each hand/foot is on over time (when holds are available from a linked scan or frame detection).
- `metrics.py`: signals per pillar (Footwork, Body positioning, Arm efficiency, Flow & pacing, Commitment) → 0–100 scores, documented formulas.
- `moments.py`: worst (or best) moments, de-duplicated so no two are on the same move; max 3; each with time, pillar, and the pose at that moment.
- `pillar_scores` schema output. Unit tests with synthetic pose tracks that trigger each signal.

## Out of scope
- LLM text (26). Job handler (34).

## Prompt
> Do step 25 (`docs/plan/steps/25-technique-metrics.md`). Read the docs it lists. Implement hold contacts, the five pillar metrics with documented formulas, and distinct key-moment selection (max 3) in `worker/pose/contacts.py` and `worker/technique/`. Write synthetic pose-track tests that trigger each signal. Give me commands and a checklist.

## Expected files
- `worker/pose/contacts.py`, `worker/technique/{metrics,moments}.py`, tests

## Done when
- [ ] Each pillar has a test that moves its score in the expected direction
- [ ] Moments are never on the same move
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
