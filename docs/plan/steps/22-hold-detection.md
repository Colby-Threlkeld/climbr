# Step 22: Hold detection

**Phase:** 0.5 · **Depends on:** 21 · **Branch:** `ai/hold-detection` · 👤 needs 200–500 labeled partner-gym photos

## Goal
A fine-tuned YOLO segmentation model detects holds on gym photos and `worker/holds/` returns the `holds` schema (polygon, center, bbox, dominant color, type guess, confidence), with recall measured by the eval harness.

## Read first
- `CLAUDE.md`
- `docs/ai/hold-detection.md`
- `docs/ai/evaluation.md`
- `docs/architecture/conventions.md` (normalized coordinates)

## In scope
- Notebook in `worker/notebooks/` for dataset assembly (public datasets with **license check recorded**, plus gym labels from Roboflow/CVAT) and fine-tuning.
- `worker/holds/detect.py` (inference → normalized polygons/bboxes/centers), `worker/holds/color.py` (dominant color in a lighting-robust color space, e.g. Lab/HSV with white-balance handling).
- Model weights stored outside git (Modal volume or object storage); load path configurable.
- Holds evaluator: recall on route holds for straight-on photos (target ≥ 90%), latency.
- Unit tests on color and coordinate normalization with synthetic images.

## Out of scope
- The job handler and app UI (28).

## Prompt
> Do step 22 (`docs/plan/steps/22-hold-detection.md`). Read the docs it lists. Help me assemble the dataset (record each public dataset's license), fine-tune a YOLO segmentation model in a notebook, then port inference into `worker/holds/detect.py` and `color.py` returning the `holds` schema with normalized coordinates. Add a holds evaluator and unit tests. Keep weights out of git. Give me exact commands, and tell me what data I need to provide.

## Expected files
- `worker/notebooks/holds_*.ipynb`, `worker/holds/{detect,color}.py`, `worker/eval/holds.py`, tests
- `worker/eval/README.md` updated with dataset licenses

## Done when
- [ ] Recall reported on the gym test set (target ≥ 90%) and latency < 5 s on GPU
- [ ] Output validates against `shared/schemas/holds`
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
