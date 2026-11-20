# Step 27: Gate review

**Phase:** 0.5 · **Depends on:** 22–26 · **Branch:** `docs/ai-gate` · 👤 developer + strong climber decide

## Goal
A written go / fix / re-scope decision for each AI piece (holds, beta, pose, metrics, coaching) based on eval numbers, before any Phase 1 UI is built on top of it.

## Read first
- `CLAUDE.md`
- `docs/ai/evaluation.md`
- `docs/product/roadmap.md` (Phase 0.5 gate, Phase 1 metrics)

## In scope
- Run `uv run python -m eval.run --suite all` and collect results.
- Write a short gate report in `docs/product/decisions.md` (new section "AI gate, <date>"): per piece, the numbers, the verdict, and any re-scope (e.g. "beta: ship only 1 sequence in Phase 1").
- Adjust Phase 1 step files if scope changes.

## Out of scope
- Building fixes (create new steps for them).

## Prompt
> Do step 27 (`docs/plan/steps/27-ai-gate-review.md`). Run the full eval suite, summarize the numbers against targets per AI piece, and draft a go / fix / re-scope recommendation for each. Wait for my decision, then record it in `decisions.md` and update any affected Phase 1 step files.

## Expected files
- `docs/product/decisions.md` (AI gate section), possibly `docs/plan/steps/28–36` edits

## Done when
- [ ] Every AI piece has a recorded verdict
- [ ] Phase 1 steps reflect any re-scope
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
