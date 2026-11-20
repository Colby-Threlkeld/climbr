# Step 21: Eval harness

**Phase:** 0.5 · **Depends on:** 16 · **Branch:** `ai/eval-harness`

## Goal
`uv run python -m eval.run` loads test sets from a local path outside git, runs registered evaluators, and prints a metrics table that can be pasted into a PR as before/after numbers.

## Read first
- `CLAUDE.md`
- `docs/ai/evaluation.md`
- `docs/ai/llm-coaching.md` (safety suite structure)

## In scope
- `worker/eval/run.py`: CLI with `--suite holds|beta|pose|coach|wingspan|all`, `--data <path>` (default from an env var, e.g. `CRUXSHOT_EVAL_DATA`), JSON + Markdown output.
- Manifest format (documented in `worker/eval/README.md`) for photos, videos, labels, and expected constraints. Labels may be committed if they contain no personal data; media never.
- Evaluator interface + a dummy evaluator with a tiny synthetic dataset so the harness is testable in CI.
- Register the wingspan evaluator from step 19 if it exists.

## Out of scope
- Real model evaluators (added in 22–26).

## Prompt
> Do step 21 (`docs/plan/steps/21-eval-harness.md`). Read the docs it lists. Build the `worker/eval` runner CLI with pluggable evaluators, a documented manifest format, data loaded from a path outside the repo, and Markdown output for PRs. Include a synthetic dummy suite with pytest coverage. Give me commands and a checklist.

## Expected files
- `worker/eval/{__init__,run,base}.py`, `worker/eval/README.md`, `worker/tests/test_eval_harness.py`

## Done when
- [ ] `uv run python -m eval.run --suite dummy` prints a metrics table
- [ ] No media files are tracked by git
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
