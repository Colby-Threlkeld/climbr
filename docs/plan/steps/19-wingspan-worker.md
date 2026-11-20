# Step 19: Wingspan estimate: worker

**Phase:** 0 · **Depends on:** 18 · **Branch:** `ai/wingspan-worker`

## Goal
A `wingspan_estimate` job takes an arms-out photo + height, returns an estimate with confidence and measurement lines (or a specific failure reason), writes the result to `body_profiles`, and deletes the photo.

## Read first
- `CLAUDE.md`
- `docs/ai/wingspan-estimation.md`
- `docs/ai/evaluation.md`
- `docs/architecture/data-model.md` (body_profiles, Storage)
- `docs/policies/privacy-safety.md` (Media)

## In scope
- `worker/body/wingspan.py`: person segmentation for outer edges + pose keypoints for validity checks (arms within ~15° of horizontal, elbows > 160°, facing camera, feet visible), tilt correction, sanity range −10 to +15 cm ape index.
- `wingspan-tmp` bucket with owner-only policies + `can_upload` check, and a pg_cron sweep deleting objects older than 1 hour (G4). Storage/pgTAP tests.
- Job handler: download from `wingspan-tmp`, run, and write the result to the job's result payload (`wingspan_result` schema). **Don't** write `body_profiles` here; the app saves after the user taps "Looks right" / "Adjust" (step 20). Delete the photo immediately in all cases (success or failure).
- Failure reasons as user-safe codes (`hands_out_of_frame`, `feet_not_visible`, `arms_not_straight`, `not_facing_camera`, `out_of_range`).
- Unit tests with synthetic fixtures (no real people). Eval entry in `worker/eval` for the 20 tape-measured photos (data provided by a human, not committed).
- Record `gpu_seconds`.

## Out of scope
- App UX (20). On-device estimation (Phase 2).

## Prompt
> Do step 19 (`docs/plan/steps/19-wingspan-worker.md`). Read the docs it lists. Create the `wingspan-tmp` bucket with owner-only policies and a 1-hour pg_cron cleanup. Implement the wingspan estimator in `worker/body/wingspan.py` (segmentation for edges, pose for validity checks, sanity range) and the `wingspan_estimate` job handler that returns the `wingspan_result` payload and always deletes the photo. Justify each ML dependency. Add unit tests with synthetic fixtures and an eval entry. Give me commands and a checklist.

## Expected files
- `worker/body/wingspan.py`, job handler wiring, `worker/tests/test_wingspan.py`, `worker/eval/wingspan.py`
- `supabase/migrations/*_wingspan_tmp.sql`, storage tests
- `shared/schemas/wingspan_result.schema.json` (if refined) + regenerated types

## Done when
- [ ] Unit tests pass; a failure fixture returns the correct reason code
- [ ] Photo object no longer exists after the job (success and failure)
- [ ] Eval reports median error (target ≤ 4 cm when the test set exists)
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
