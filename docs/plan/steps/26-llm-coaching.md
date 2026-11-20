# Step 26: LLM coaching + safety suite

**Phase:** 0.5 · **Depends on:** 25 · **Branch:** `ai/llm-coaching` · 👤 strong climber grades feedback

## Goal
`worker/coach/` turns profile + metrics + key moments + 3–6 key frames into validated `feedback` JSON (moments, positive, drill, correction specs), and the coaching safety & tone suite passes 100% of hard checks.

## Read first
- `CLAUDE.md`
- `docs/ai/llm-coaching.md`
- `docs/policies/privacy-safety.md` (Body data, Coaching)
- `docs/ai/evaluation.md`

## In scope
- `worker/coach/llm.py`: provider interface + Anthropic implementation; JSON validation against `shared/schemas/feedback`; retry once on invalid; record `llm_tokens`.
- `worker/coach/prompts/`: system prompt with tone guide and guardrails; user free text passed as clearly delimited data.
- Body data sent only per policy (height/wingspan; injuries as "avoid X"); never weight.
- `worker/eval/coach/`: ~40-case golden set format, hard checks (schema, ≤3 moments, ≥1 positive, exactly 1 drill, banned words, no "optimal/best/correct beta", injuries respected, no >2 V-grade required moves), soft LLM-as-judge rubric (≥ 90%).
- Unit tests for the hard-check functions themselves.

## Out of scope
- Move tips for Route Reader (30). App UI (35).

## Prompt
> Do step 26 (`docs/plan/steps/26-llm-coaching.md`). Read the docs it lists. Build the swappable LLM interface with an Anthropic implementation, the coaching prompt, strict JSON validation with one retry, and the coaching safety & tone suite in `worker/eval/coach/` with all hard checks plus an LLM-as-judge rubric. Include the adversarial cases (weight mention, minor, injuries, far-above-grade, short climber, prompt injection). Report suite results. Give me commands and a checklist.

## Expected files
- `worker/coach/{llm,__init__}.py`, `worker/coach/prompts/*`, `worker/eval/coach/*`, tests

## Done when
- [ ] Hard checks pass 100%; soft checks ≥ 90%
- [ ] Climber spot-checked 10 random outputs
- [ ] No API key outside Modal secrets / local `.env` (worker only)
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
