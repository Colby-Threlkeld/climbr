# Step 28: Route capture + holds overlay

**Phase:** 1 · **Depends on:** 20, 27 · **Branch:** `feat/route-capture`

## Goal
From Capture → Route photo, the user picks a gym (preselected home gym), takes or uploads a straight-on wall photo, and within ~5 s sees all detected holds outlined on the photo.

## Read first
- `CLAUDE.md`
- `docs/features/route-reader.md` (steps 1–2)
- `docs/design/screens.md` (rows 8–9), `docs/design/design-system.md` (Overlay palette, touch)
- `docs/architecture/data-model.md` (route_scans, Storage)
- `docs/ai/hold-detection.md`

## In scope
- Migration: `route_scans` (no rating columns, decision C6) + RLS + pgTAP; `route-photos` bucket + policies (`can_upload`).
- Capture screen Route photo segment: framing guide text/image, gym picker chip (simple picker from `locations`, G6), expo-image-picker, `media.ts` prep (2048 px, strip location).
- Client-generated UUID; upload; insert job `route_scan` (holds stage).
- Worker handler: run `worker/holds`, write `holds` + `width/height` + `wall_height_cm` default from location, progress stages, `gpu_seconds`.
- `app/route/[id]/holds.tsx` with `HoldOutline` overlay (white 2 pt outline, dark outline + shadow), all four AI states.

## Out of scope
- Selecting the route, start/top, scale (29). Beta (30).

## Prompt
> Do step 28 (`docs/plan/steps/28-route-capture-holds.md`). Read the docs it lists. Add the `route_scans` table and `route-photos` bucket with RLS and tests, the Route photo capture flow with framing guide and gym picker, the `route_scan` worker handler for hold detection, and the holds screen with `HoldOutline` overlays and all four AI states. Test on a real phone over HTTPS. Give me commands, files, and a checklist.

## Expected files
- `supabase/migrations/*_route_scans.sql`, tests
- `app/(tabs)/capture.tsx`, `app/route/[id]/holds.tsx`, `src/components/overlay/HoldOutline.tsx`, `src/features/routeScan/*`
- `worker/` route_scan handler + tests

## Done when
- [ ] Photo → outlined holds on iPhone Safari and Expo Go; median < 5 s for detection
- [ ] Low-confidence and failure states appear with retry
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
