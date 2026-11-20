# Step 03: Theme tokens + typography

**Phase:** 0 · **Depends on:** 02 · **Branch:** `feat/theme-tokens`

## Goal
`src/theme/tokens.ts` holds every color, spacing, radius, type, and motion value from the design system, with light/dark switching that follows the device, and the placeholder screen uses it.

## Read first
- `CLAUDE.md`
- `docs/design/design-system.md` (Color, Typography, Spacing, Motion)

## In scope
- Tokens: brand colors, semantic tokens (light + dark), overlay palette, spacing grid, radii, touch sizes (48 pt min, 76 pt capture), type scale, motion durations.
- Font handling: stack string on web only, unset `fontFamily` on native (decision G11).
- A `useTheme()` hook (system color scheme) and a themed `Text` helper using the type scale, with accessibility size cap for dense overlays.
- Unit tests: token values match the design doc; dark mode flips cream/ink; accent identical in both modes.

## Out of scope
- UI components (04–05). Manual theme toggle in settings (later).

## Prompt
> Do step 03 (`docs/plan/steps/03-theme-tokens.md`). Read `docs/design/design-system.md`. Create `src/theme/tokens.ts` with every token exactly as documented, a `useTheme()` hook that follows the system light/dark setting, and a themed `Text` component using the iOS-style type scale (font stack on web, system default on native). Restyle the placeholder screen with tokens only. Add unit tests. Then give me a phone checklist covering light and dark mode.

## Expected files
- `src/theme/tokens.ts`, `src/theme/useTheme.ts`, `src/theme/Text.tsx` (or `src/components/ui/Text.tsx`)
- `src/theme/__tests__/tokens.test.ts`

## Done when
- [ ] Every hex in `design-system.md` appears in `tokens.ts` and nowhere else in `src/`/`app/`
- [ ] Placeholder screen switches correctly with the phone's dark mode on web and Expo Go
- [ ] Tests pass
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
