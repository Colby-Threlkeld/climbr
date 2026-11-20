# Avatars (route demo + correction ghost)

> Read this for steps 10, 11, 12, 31, 36, and R1. App code: `src/avatar/` (data + math) and `src/components/overlay/Avatar`, `Ghost` (drawing). Worker: `worker/ghost/corrections.py`.

**One shared avatar renderer** is used by both features.

- **Phase 1 avatar is a stylized 2D figure**, a clean mannequin made of rounded limb shapes (not a stick figure, not a realistic human), drawn over the photo/video with **react-native-skia** or **react-native-svg** (both work on web and native; chosen in spike step 10).
- **Body model:** proportions from height + wingspan (same model as `worker/beta/body_model.py`, see `docs/ai/beta-solver.md`). Also drives the live onboarding preview.
- **Route demo:** interpolates between the poses from the beta solver, with simple 2D inverse kinematics so limbs bend naturally while the hands/feet stay on holds. Proportions match the user. Default ~0.8 s per move; play/pause, step, 0.5×/1×. Reduce Motion → no auto-play.
- **Correction ghost:** takes the user's *actual* pose at the key moment, applies the correction spec (`docs/ai/llm-coaching.md`) through IK, and shows a translucent accent-colored figure (orange, 55% opacity, glow) moving from "your position" to "better position." A legend makes it clear: **solid = you, ghost = better.**
- **Why not 3D yet:** a believable 3D avatar on a wall needs the wall's 3D shape (a single photo doesn't capture it), full-body motion generation, and a 3D engine that runs well in mobile browsers. That's months of specialist work, so it can't block Phase 1.
- **3D track (in progress, parallel, plan step R1):** 3D R&D (e.g. React Three Fiber + an avatar rig) runs alongside the 2D build. To keep it cheap to swap in later:
  - The body model, poses, and correction specs in `src/avatar/` stay **renderer-agnostic** (joint data, not drawing code). The 2D and 3D renderers are interchangeable views over the same data.
  - Prototype 3D behind a feature flag. It replaces 2D only when it loads fast in mobile Safari and testers prefer it.
