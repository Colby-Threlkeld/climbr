# AI: Wingspan estimation from a photo (optional, in Profile)

> Read this for steps 19 and 20. Worker module: `worker/body/wingspan.py`. UX flow: `docs/features/onboarding-profile.md` → Wingspan photo flow. Offered in **Profile only**, not onboarding (decision C11).

**Core idea:** the user already entered their **height**, so we only need the **ratio** of wingspan to height in the photo. No ruler or reference object is needed.

```
wingspan_cm = height_cm × (fingertip-to-fingertip span in pixels ÷ head-top-to-heel height in pixels)
```

- **Why a body outline and not just a pose skeleton:** standard pose models find **wrists**, not fingertips, and the **eyes/nose**, not the top of the head. Both ends matter. So we combine:
  - **Person segmentation** (a body-outline mask, e.g. MediaPipe Image Segmenter or the YOLO segmentation model we already use) for the true **outer edges**: fingertip to fingertip, top of head to bottom of heels.
  - **Pose keypoints** (same pose model as `pose-and-technique.md`) to **check the pose is valid**: arms roughly horizontal (within ~15°), elbows straight (angle > 160°), body facing the camera (shoulder width plausible vs height), feet visible, standing upright.
- **Corrections:** small tilt correction if the phone was rotated. Exclude hair volume at the top of the head where possible.
- **Sanity checks:** reject if the resulting ape index is outside about **−10 cm to +15 cm**, which is outside the normal human range and means the photo is probably wrong. Then ask for a retake with a specific reason.
- **Expected accuracy:** roughly **±3–5 cm** with a good photo. Perspective and slightly bent arms are the main error sources. That's good enough for beta sequencing (reach limits have margin anyway), and the UI lets users fine-tune with the slider. Always show the result as "≈", never as an exact measurement.
- **Where it runs:** the AI worker (same pipeline as the other jobs, `kind='wingspan_estimate'`, `target_id` = `body_profiles.user_id`), so it works the same on web and native. Phase 2 option: run on the device for speed and privacy.
- **Output for the app:** estimate, confidence, and the two measurement lines (normalized coordinates) so the result screen can draw them. Or a user-safe failure reason ("hands out of frame").
- **Store:** `wingspan_cm`, `wingspan_source` (`photo` / `manual` / `default`), and `wingspan_confidence`. **Not the photo.** Delete the photo from `wingspan-tmp` right after measuring (pg_cron 1-hour sweep is the safety net). Never used for training, even with opt-in.
- **Latency target:** < 5 s.
- **Test set:** 20 people with **tape-measured** wingspans. Target median error ≤ 4 cm before launch. Part of `worker/eval`.
