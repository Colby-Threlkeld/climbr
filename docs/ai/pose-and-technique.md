# AI: Pose estimation & technique metrics (video)

> Read this for steps 24, 25, 34, 35. Worker modules: `worker/pose/` (`estimate.py`, `smooth.py`, `contacts.py`), `worker/technique/` (`metrics.py`, `moments.py`).

- **Pose model:** an off-the-shelf 2D human pose model run frame by frame. Candidates: **RTMPose / ViTPose / YOLO-pose / MediaPipe Pose**, chosen by accuracy on climbing footage in spike step 24 (decision G12b). Climbing is hard for pose models because of unusual positions and limbs hidden behind the body. Smooth the keypoints over time to remove jitter.
- **Keypoints:** COCO-17, `[x, y, confidence]` normalized, stored in `pose-data` with the sampling fps.
- **Sample** at ~10–15 frames per second (plenty for climbing, and much cheaper than 30–60).
- **Video prep:** server-side ffmpeg transcodes/downscales to 720p and applies the trim range.
- **Hold contact:** if a Route Reader scan is linked, or holds are detected in a video frame, work out *which hold each hand/foot is on* over time.

## Technique pillars
Each scored 0–100 from measurable signals.

| Pillar | Signals measured |
|---|---|
| **Footwork** | Number of foot readjustments, "foot stabs" (repeated small foot movements), feet cutting loose unexpectedly |
| **Body positioning** | Hips distance from wall (approximated in 2D from body proportions and hip-shoulder alignment), hip rotation on side-pulls, center of mass relative to feet |
| **Arm efficiency** | Time spent with bent arms while static (should mostly be straight), over-gripping indicators |
| **Flow & pacing** | Hesitation pauses, rhythm between moves, time on rest holds vs on crux |
| **Commitment** | Hesitation before dynamic moves, aborted reaches (reach starts then retreats) |

- **Key moments:** the moments where metrics are worst (or best), picked to be **distinct** (not 3 notes on the same move). Max 3.
- **Latency target:** whole review < 90 s.
