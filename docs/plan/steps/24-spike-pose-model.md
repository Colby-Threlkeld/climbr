# Step 24: Spike: pose model

**Phase:** 0.5 · **Depends on:** 21 · **Branch:** `ai/spike-pose` · 👤 needs ~20 real climbing videos

## Goal
Pick the pose model (RTMPose / ViTPose / YOLO-pose / MediaPipe Pose) based on measured accuracy on climbing footage, and ship `worker/pose/estimate.py` + `smooth.py` with it. Record the choice in `decisions.md` (G12b).

## Read first
- `CLAUDE.md`
- `docs/ai/pose-and-technique.md`
- `docs/ai/evaluation.md`
- `docs/architecture/conventions.md` (Pose keypoints, Video time)

## In scope
- Notebook comparing candidates on the videos: keypoint dropout in hard positions (limbs behind body, inverted, heel hooks), jitter, speed at 10–15 fps on GPU, license.
- Results table + recommendation → developer confirms → `decisions.md` Spike results.
- `worker/pose/estimate.py` (ffmpeg transcode to 720p, apply trim, sample at fixed fps, COCO-17 normalized output), `worker/pose/smooth.py` (temporal smoothing).
- `pose_track` schema output; unit tests on smoothing with synthetic tracks.

## Out of scope
- Hold contacts and metrics (25). Job handler (34).

## Prompt
> Do step 24 (`docs/plan/steps/24-spike-pose-model.md`). Read the docs it lists. Compare the four pose-model candidates on my climbing videos in a notebook (dropout in hard positions, jitter, speed, license), summarize in a table, and recommend one. After I confirm, record it in `decisions.md` and implement `worker/pose/estimate.py` and `smooth.py` producing the `pose_track` schema. Give me commands and a checklist.

## Expected files
- `worker/notebooks/pose_compare.ipynb`, `worker/pose/{estimate,smooth}.py`, tests
- `docs/product/decisions.md` (G12b result)

## Done when
- [ ] Decision confirmed by the developer and recorded
- [ ] Pose track for a 60 s clip produced well within the 90 s review budget
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
