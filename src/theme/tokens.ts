import { Platform, type TextStyle } from 'react-native';

// Single source of every visual value in the app. Mirrors docs/design/design-system.md 1:1;
// if the two ever differ, the doc wins. No hex codes or magic sizes anywhere else in src/ or app/.

// --- Brand: three colors (cream, ink, tape orange). White is only for cards on cream. ---
export const brand = {
  cream: '#F4EFE6',
  ink: '#141414',
  orange: '#FF5A1F',
  white: '#FFFFFF',
} as const;

// --- Semantic colors. Screens use these names, never brand.* directly, so dark mode just works. ---
// Dark mode flips cream and ink; accent/onAccent are identical in both modes.
export const colors = {
  light: {
    bg: brand.cream,
    surface: brand.white,
    surfaceAlt: '#EAE3D6',
    textPrimary: brand.ink,
    textSecondary: '#5C574F',
    accent: brand.orange,
    onAccent: brand.ink, // ink on orange ≈ 6:1 contrast; white would fail AA
    success: '#1F9D55',
    warning: '#C98A00',
    danger: '#D92D20',
    scrim: 'rgba(20, 20, 20, 0.4)', // ink at 40%: dims the screen behind sheets
  },
  dark: {
    bg: brand.ink,
    surface: '#1F1E1C',
    surfaceAlt: '#2A2926',
    textPrimary: brand.cream,
    textSecondary: '#B5AEA2',
    accent: brand.orange,
    onAccent: brand.ink,
    success: '#34C26F',
    warning: '#F2B233',
    danger: '#F2574B',
    scrim: 'rgba(0, 0, 0, 0.6)', // darker in dark mode so the sheet edge still reads
  },
} as const;

// Soft elevation for floating surfaces (toast, slider thumb). `boxShadow` works on web and native.
export const shadow = {
  raised: '0px 4px 12px rgba(20, 20, 20, 0.18)',
} as const;

export type ColorScheme = keyof typeof colors;
export type ColorToken = keyof typeof colors.light;
export type ThemeColors = { [K in ColorToken]: string };

// --- Overlay palette: drawn on top of photos/video, same in both modes. ---
// Hands vs feet differ by shape (circle vs rounded square), left vs right by color.
const cyan = '#00C2FF';
const magenta = '#FF3DA5';
export const overlay = {
  limb: { LH: cyan, RH: magenta, LF: cyan, RF: magenta },
  // The doc says "dark outline + soft shadow" without a hex; ink keeps the brand at three colors.
  outline: brand.ink,
  sequenceLine: { color: brand.white, width: 3 }, // dashed for feet, solid for hands
  holdOutline: { color: brand.white, width: 2 },
  skeleton: { color: brand.white, opacity: 0.7 },
  ghost: { color: brand.orange, opacity: 0.55 },
} as const;

// --- Spacing: 8-pt grid. ---
export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  screen: 16, // default horizontal screen padding
} as const;

export const radii = {
  control: 10, // inputs, chips
  card: 14,
  sheet: 20,
  full: 9999, // capture button / pills
} as const;

export const borderWidth = {
  hairline: 1,
  thick: 2, // focus / error rings
} as const;

export const opacity = {
  pressed: 0.7,
  disabled: 0.4,
} as const;

// Decision C5: nothing tappable smaller than 48 pt (chalky fingers, one hand busy).
export const touch = {
  min: 48,
  capture: 76,
} as const;

// Fixed component dimensions that aren't on the spacing grid.
export const size = {
  sheetHandle: { width: 36, height: 5 },
  sliderTrack: 4,
  sliderThumb: 28, // visual size; the touch area is still touch.min
  progressBar: 4,
  stageDot: 24,
} as const;

// --- Typography ---
// Decision G11: the CSS stack only works on web. On native, leaving fontFamily unset
// gives the platform system font (SF Pro on iOS, Roboto on Android).
export const webFontStack =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
export const fontFamily: string | undefined = Platform.OS === 'web' ? webFontStack : undefined;

// Mirrors iOS text styles (size/line height).
export const type = {
  largeTitle: { fontSize: 34, lineHeight: 41, fontWeight: '700' },
  title2: { fontSize: 22, lineHeight: 28, fontWeight: '700' },
  headline: { fontSize: 17, lineHeight: 22, fontWeight: '600' },
  body: { fontSize: 17, lineHeight: 22, fontWeight: '400' },
  subhead: { fontSize: 15, lineHeight: 20, fontWeight: '400' },
  footnote: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  // Tabular figures so grades, timestamps, and scores don't jitter as digits change.
  numeric: { fontSize: 17, lineHeight: 22, fontWeight: '400', fontVariant: ['tabular-nums'] },
} as const satisfies Record<string, TextStyle>;

export type TypeVariant = keyof typeof type;

// Accessibility text size is respected everywhere; dense overlays cap it so labels don't collide.
export const textScale = {
  denseMax: 1.4,
} as const;

// --- Motion (ms) ---
export const motion = {
  screen: 250,
  sheet: 300, // spring, ~300 ms
  avatarMove: 800, // default per-move speed, user-adjustable later
  toast: 4000, // how long a toast stays on screen
} as const;
