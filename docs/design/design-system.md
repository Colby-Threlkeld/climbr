# Design system

> Read this for any UI step. Tokens here are mirrored 1:1 in `src/theme/tokens.ts`; if they ever differ, this file wins.

## Principles
1. **Built for the wall, not the desk.** Chalky fingers, one hand busy, glaring sun or dim gym, mid-session. Big targets, bottom-anchored actions.
2. **Show, don't tell.** Every insight comes with a visual: dots, avatar, ghost, timestamp.
3. **Coach, don't judge.** Positive first, max 3 improvements, never a single "you are bad" score.
4. **Fast feels smart.** Clear progress states. Results appear piece by piece (holds → dots → avatar) instead of one long wait.
5. **Feels Apple-native, owned by us.** Apple's system font and iOS spacing and motion conventions, built with *our* components so web and native match.
6. **The climber's image is the canvas.** UI stays quiet: neutral surfaces, one accent, overlays that pop.

## Custom components only
Platform widgets (system alerts, `Switch`, native pickers) look different on web than on iPhone. Build our own in `src/components/ui/`: **Button, Sheet, Toast, Chip, SegmentedControl, TextField, Card, Slider, ProgressSteps, GradeBadge, PillarBar, MomentCard, MoveCard**. Never use `Alert.alert` in UI code.

Overlay components live in `src/components/overlay/`: **HoldOutline, BetaDots, SequenceLines, Skeleton, Avatar, Ghost**.

## Typography
- **Web:** system font stack, which renders Apple's **SF Pro** on iPhone Safari:
  `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- **Native:** leave `fontFamily` unset so the platform system font is used (SF Pro on iOS, Roboto on Android). The stack string doesn't work on native (decision G11).
- Scale (mirrors iOS text styles): `largeTitle 34/41 bold` · `title2 22/28 bold` · `headline 17/22 semibold` · `body 17/22` · `subhead 15/20` · `footnote 13/18` · `numeric` = tabular figures for grades, timestamps, scores.
- Respect accessibility text size (cap ~1.4× in dense overlays).

## Color

**Three-color brand: cream, ink, tape orange.** Overlays need **maximum visibility on busy, colorful gym walls**.

| Brand color | Hex | Role |
|---|---|---|
| **Cream** | `#F4EFE6` | Light-mode background · dark-mode text |
| **Ink** | `#141414` | Light-mode text · dark-mode background · text on orange |
| **Tape orange** | `#FF5A1F` | The single accent: primary buttons, capture button, ghost avatar. Same in both modes |

**Color rules:**
- Text on orange is **always ink**, never white (ink on orange ≈ 6:1 contrast, white ≈ 3:1 fails).
- **Never orange body text.** Orange is for fills and shapes, not reading.
- White `#FFFFFF` is used **only for cards on top of the cream background**, never as a page background.
- Dark mode flips cream and ink. Orange stays the same.

| Token | Light | Dark | Use |
|---|---|---|---|
| `bg` | `#F4EFE6` cream | `#141414` ink | App background |
| `surface` | `#FFFFFF` | `#1F1E1C` | Cards, sheets |
| `surfaceAlt` | `#EAE3D6` | `#2A2926` | Inputs, chips |
| `textPrimary` | `#141414` ink | `#F4EFE6` cream | Text |
| `textSecondary` | `#5C574F` | `#B5AEA2` | Metadata |
| `accent` | `#FF5A1F` | `#FF5A1F` | Primary actions, capture button, ghost avatar |
| `onAccent` | `#141414` | `#141414` | Text/icons on orange |
| `success` / `warning` / `danger` | `#1F9D55` / `#C98A00` / `#D92D20` | `#34C26F` / `#F2B233` / `#F2574B` | Status only (icons, badges), not brand |

The derived tokens (`surface` in dark mode, `surfaceAlt`, `textSecondary`) are tints of cream and ink, so the brand stays three colors.

### Overlay palette
Used on top of photos/video, always with a **dark outline + soft shadow** so they read on any wall color. The outline and shadow color is **ink `#141414`**, which keeps the brand at three colors.

| Element | Color | Shape |
|---|---|---|
| Left hand | `#00C2FF` cyan | Filled circle with number |
| Right hand | `#FF3DA5` magenta | Filled circle with number |
| Left foot | `#00C2FF` cyan | **Rounded square** with number |
| Right foot | `#FF3DA5` magenta | **Rounded square** with number |
| Sequence lines | White, 3 pt, dark outline | Dashed for feet, solid for hands |
| Detected holds | White outline, 2 pt | Selected route holds get a brighter fill |
| User skeleton | White, 70% opacity | |
| Ghost avatar | `accent`, 55% opacity | Glow |

Hands vs feet are distinguished by **shape, not just color** (colorblind-safe), and left vs right by color plus an "L/R" label in the legend.

- **Contrast:** WCAG AA minimum for all text. Dark mode from day one.

## Spacing, shape, touch
- 8-pt grid (4, 8, 12, 16, 20, 24, 32, 40). Screen padding 16.
- Radii: 10 (inputs/chips), 14 (cards, buttons), 20 (sheets), full (capture button).
- Borders: 1 (hairline), 2 (focus/error ring). Opacity: 0.7 pressed, 0.4 disabled.
- Selected chips/segments invert (ink fill + cream text in light mode). Orange stays reserved for primary actions.
- **Minimum touch target 48 pt** everywhere (decision C5). Capture button 76 pt. Tappable holds are expanded to at least 48 pt hit areas even when the hold is small.
- Primary actions at the **bottom**. Respect safe areas (notch/home indicator) on web too.

## Motion
- Sheets: spring, ~300 ms. Screens: ~250 ms. Avatar default speed is ~0.8 s per move (adjustable).
- Haptics on native (capture, result ready), no-op on web.
- **Reduce Motion:** avatar auto-play off by default, step-through only.

## Navigation
Bottom tab bar, with capture in the center:

```
[ Home ]     [ ◉ Capture ]     [ Profile ]
```
- **Home:** recent scans and reviews, "Continue where you left off," tips.
- **Capture:** opens a choice with a **Route photo** / **Video** segmented control, Route photo by default.
- **Profile:** body profile, progress charts (pillar scores over time), settings, feedback, privacy.
