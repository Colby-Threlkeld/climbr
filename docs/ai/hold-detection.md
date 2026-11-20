# AI: Hold detection

> Read this for steps 22 and 28. Worker module: `worker/holds/` (`detect.py`, `color.py`).

> General rule for all AI work: **don't try to train everything from scratch.** Use proven open models, fine-tune where needed, and use an LLM for language rather than writing coaching text with rules.

- **Model:** YOLO segmentation model (Ultralytics), fine-tuned on climbing holds.
- **Data:** start from public climbing-hold datasets (e.g. on Roboflow Universe, **check each license**), then add **200–500 labeled photos from the partner gym**. Label with Roboflow or CVAT.
- **Output per hold:** polygon, center point, bounding box, **dominant color** (computed in a lighting-robust color space), confidence, and an optional type guess (jug/crimp/sloper/pinch/volume) for coaching language. Shape: `{id, polygon, center, bbox, color, type_guess, confidence}`, coordinates normalized 0–1 (`shared/schemas/holds`).
- **Target:** ≥ 90% of route holds detected on straight-on gym photos. Users fix the rest in the assisted step.
- **Latency target:** < 5 s in the cloud.
- Measured by hold-detection recall in `docs/ai/evaluation.md`.
