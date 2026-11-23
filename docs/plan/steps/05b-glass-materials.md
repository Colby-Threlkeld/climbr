# Step 05b: Glass materials

**Phase:** 0 · **Depends on:** 05 · **Branch:** `feat/glass-materials`

## Goal
Chrome that floats over media (toasts, floating controls, short sheets, and later the tab bar) uses a token-driven glass material. It renders as Liquid Glass on iOS 26+, frosted blur elsewhere, and solid with Reduce Transparency, and text stays AA-readable over a busy gym wall.

## Read first
- `CLAUDE.md`
- `docs/product/decisions.md` (D1)
- `docs/design/design-system.md` (Materials)

## In scope
- `material`, `sheen`, and `MIN_GLASS_ALPHA` tokens, plus a WCAG contrast test proving the alpha floor.
- `Material` (`Material.native.tsx` for iOS Liquid Glass / blur, `Material.tsx` for web + Android), `GlassBackdrop` (Android blur target), and `useReduceTransparency` (iOS setting / `prefers-reduced-transparency`).
- Toast on glass, `Button variant="glass"`, `Sheet material="glass"` (opt-in), and a sheen on the primary button.
- A gallery "Materials" section over a CC BY-SA gym-wall photo (`assets/dev/`), with an animated video stand-in and an FPS meter.

## Out of scope
- Tab bar glass (built in step 06 with this material).
- Glass over real video (needs expo-video, steps 33/36).
- An in-app "Reduce transparency" toggle (later settings work).

## Expected files
- `src/theme/tokens.ts`, `src/theme/contrast.ts`, `src/theme/__tests__/material-test.ts`
- `src/components/ui/{Material,Material.native,MaterialSurface,GlassBackdrop}.tsx`, `src/lib/useReduceTransparency{,.native}.ts`
- `src/dev/MaterialsDemo.tsx`, `assets/dev/gym-wall.jpg`, `assets/dev/ATTRIBUTION.md`

## Done when
- [ ] Contrast test passes. Measured contrast over the wall photo is ≥ 4.5:1 in light, dark, and Reduce Transparency.
- [ ] iPhone (iOS 26) in Expo Go shows "Rendering: liquid-glass", and text is readable over the wall.
- [ ] Reduce Transparency on iPhone switches the gallery to "Rendering: solid".
- [ ] FPS meter readings recorded for an iPhone and a mid-range Android (photo + moving background).
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
