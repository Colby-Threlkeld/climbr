# AI: Quality measurement (how we know the AI is good)

> Read this for step 21 and before any model or prompt change. Code: `worker/eval/` (`uv run python -m eval.run`).

- Keep a **test set**: 50 labeled route photos + 30 videos from the partner gym, with real beta and coach notes from a strong climber or setter. Plus 20 tape-measured wingspan photos (`wingspan-estimation.md`) and the ~40-case coaching golden set (`llm-coaching.md`).
- Test-set media is **never** committed to git and never comes from real users without opt-in. Store it outside the repo or in a private bucket; commit only the manifest/labels format.
- Track:

| Metric | Target |
|---|---|
| Hold detection recall (route holds, straight-on photos) | ≥ 90% |
| Suggested sequences a strong climber calls "reasonable" | track (Phase 1 👍 target ≥ 60%) |
| Feedback 👍 rate | ≥ 70% |
| Wingspan median error | ≤ 4 cm |
| Coaching hard checks | 100% |
| Coaching soft checks | ≥ 90% |
| Processing time | holds < 5 s · beta < 10 s · review < 90 s · wingspan < 5 s |

- Rerun the test set **before every model or prompt change** and put before/after numbers in the PR.
- Not run in CI by default (cost).
