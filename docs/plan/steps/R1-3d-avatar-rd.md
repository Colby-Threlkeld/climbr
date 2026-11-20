# Step R1: 3D avatar R&D (feature-flagged, parallel)

**Phase:** parallel track (not on the critical path) · **Depends on:** 11 · **Branch:** `feat/3d-avatar-rd`

## Goal
A feature-flagged 3D renderer (e.g. React Three Fiber + an avatar rig) draws the same renderer-agnostic poses from `src/avatar/`, so it can replace the 2D avatar later if it loads fast in mobile Safari and testers prefer it.

## Read first
- `CLAUDE.md`
- `docs/ai/avatar.md` (Why not 3D yet, 3D track)
- `docs/architecture/tech-stack.md` (Dependency rule)

## In scope
- Feature flag (local setting or PostHog flag) defaulting **off**.
- `src/components/overlay/Avatar3D.tsx` consuming the same `Pose` data; no changes to `src/avatar/` types other than additive ones.
- Lazy-loaded so the 3D bundle never affects 2D users' first load.
- Measure mobile Safari load time + frame rate; record findings in `decisions.md`.

## Out of scope
- Wall 3D reconstruction, full-body motion generation. Shipping 3D by default (Phase 3 decision).

## Prompt
> Do step R1 (`docs/plan/steps/R1-3d-avatar-rd.md`). Read the docs it lists. Prototype a lazy-loaded, feature-flagged 3D avatar renderer that consumes the existing `src/avatar/` pose data without changing it, and measure its load time and frame rate in mobile Safari. Don't touch the 2D path. Summarize findings for `decisions.md`.

## Expected files
- `src/components/overlay/Avatar3D.tsx`, flag wiring, notes in `docs/product/decisions.md`

## Done when
- [ ] Flag off: zero change to bundle size for 2D users (measured)
- [ ] Flag on: 3D avatar plays a route sequence from the same data
- [ ] Findings recorded
