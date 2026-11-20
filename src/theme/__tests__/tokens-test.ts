import { brand, colors, motion, overlay, radii, spacing, textScale, touch, type } from '../tokens';
import { themeFor } from '../useTheme';

// Expected values are copied from docs/design/design-system.md. If this test fails,
// either tokens.ts drifted or the doc changed; the doc wins.
describe('tokens match the design system', () => {
  it('brand colors', () => {
    expect(brand).toEqual({
      cream: '#F4EFE6',
      ink: '#141414',
      orange: '#FF5A1F',
      white: '#FFFFFF',
    });
  });

  it('light + dark semantic colors', () => {
    expect(colors.light).toEqual({
      bg: '#F4EFE6',
      surface: '#FFFFFF',
      surfaceAlt: '#EAE3D6',
      textPrimary: '#141414',
      textSecondary: '#5C574F',
      accent: '#FF5A1F',
      onAccent: '#141414',
      success: '#1F9D55',
      warning: '#C98A00',
      danger: '#D92D20',
    });
    expect(colors.dark).toEqual({
      bg: '#141414',
      surface: '#1F1E1C',
      surfaceAlt: '#2A2926',
      textPrimary: '#F4EFE6',
      textSecondary: '#B5AEA2',
      accent: '#FF5A1F',
      onAccent: '#141414',
      success: '#34C26F',
      warning: '#F2B233',
      danger: '#F2574B',
    });
  });

  it('overlay palette', () => {
    expect(overlay.limb).toEqual({ LH: '#00C2FF', RH: '#FF3DA5', LF: '#00C2FF', RF: '#FF3DA5' });
    expect(overlay.sequenceLine).toEqual({ color: '#FFFFFF', width: 3 });
    expect(overlay.holdOutline).toEqual({ color: '#FFFFFF', width: 2 });
    expect(overlay.skeleton).toEqual({ color: '#FFFFFF', opacity: 0.7 });
    expect(overlay.ghost).toEqual({ color: '#FF5A1F', opacity: 0.55 });
  });

  it('spacing, radii, touch, motion', () => {
    expect([
      spacing.xxs,
      spacing.xs,
      spacing.sm,
      spacing.md,
      spacing.lg,
      spacing.xl,
      spacing.xxl,
      spacing.xxxl,
    ]).toEqual([4, 8, 12, 16, 20, 24, 32, 40]);
    expect(spacing.screen).toBe(16);
    expect([radii.control, radii.card, radii.sheet]).toEqual([10, 14, 20]);
    expect(touch).toEqual({ min: 48, capture: 76 });
    expect(motion).toEqual({ screen: 250, sheet: 300, avatarMove: 800 });
  });

  it('type scale (size / line height / weight)', () => {
    const scale = Object.fromEntries(
      Object.entries(type).map(([k, v]) => [k, [v.fontSize, v.lineHeight, v.fontWeight]]),
    );
    expect(scale).toEqual({
      largeTitle: [34, 41, '700'],
      title2: [22, 28, '700'],
      headline: [17, 22, '600'],
      body: [17, 22, '400'],
      subhead: [15, 20, '400'],
      footnote: [13, 18, '400'],
      numeric: [17, 22, '400'],
    });
    expect(type.numeric.fontVariant).toEqual(['tabular-nums']);
    expect(textScale.denseMax).toBe(1.4);
  });
});

describe('dark mode', () => {
  it('flips cream and ink', () => {
    const light = themeFor('light').colors;
    const dark = themeFor('dark').colors;
    expect(light.bg).toBe(dark.textPrimary);
    expect(light.textPrimary).toBe(dark.bg);
  });

  it('keeps the accent and text-on-accent identical', () => {
    expect(themeFor('dark').colors.accent).toBe(themeFor('light').colors.accent);
    expect(themeFor('dark').colors.onAccent).toBe(themeFor('light').colors.onAccent);
  });

  it('reports isDark', () => {
    expect(themeFor('dark').isDark).toBe(true);
    expect(themeFor('light').isDark).toBe(false);
  });
});

// "No hex colors outside tokens.ts" is enforced by ESLint (eslint.config.js), not here.
