# Step 23: Beta solver

**Phase:** 0.5 · **Depends on:** 22 · **Branch:** `ai/beta-solver` · 👤 strong climber grades 20 real problems

## Goal
Given holds, route selection, wall height, and the user's height/wingspan, `worker/beta/` returns 1–3 body-aware sequences of moves with poses, and a strong climber rates them on 20 real problems.

## Read first
- `CLAUDE.md`
- `docs/ai/beta-solver.md`
- `docs/ai/avatar.md` (body model must match the app)
- `docs/architecture/conventions.md` (Limbs, Units, coordinates)

## In scope
- `worker/beta/body_model.py` mirroring `src/avatar/bodyModel.ts` constants exactly (shared test vectors in a JSON fixture used by both test suites).
- `worker/beta/solver.py`: pixel → cm scale, 4-limb state search with A*/Dijkstra, reach + hands-above-feet + center-of-mass constraints, cost = reach strain + awkwardness + move count, hold-type adjustments; top 1–3 labeled sequences ("Static", "Dynamic", "Short-climber friendly").
- Output validates against `shared/schemas/sequences` (`{limb, from_hold, to_hold, pose, tip}`; `tip` empty until step 30).
- Unit tests on synthetic walls (e.g. a short climber gets a different sequence on a reachy problem).
- Beta evaluator: % rated "reasonable" by the climber (manual labels file).

## Out of scope
- LLM move tips (30). Job handler + UI (30).

## Prompt
> Do step 23 (`docs/plan/steps/23-beta-solver.md`). Read the docs it lists. Implement the body model (matching the app's constants via shared test vectors) and the A* beta solver in `worker/beta/`, returning up to 3 labeled sequences with poses. Add synthetic-wall unit tests, including one showing height changes the sequence, and a beta evaluator that reads a climber's "reasonable / not" labels. Give me commands and a checklist.

## Expected files
- `worker/beta/{body_model,solver}.py`, `shared/fixtures/body_model_vectors.json`, tests (worker + app), `worker/eval/beta.py`

## Done when
- [ ] Shared body-model vectors pass in both Jest and pytest
- [ ] Solver returns sequences in < 10 s on real problems
- [ ] Climber rating recorded for 20 problems
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
