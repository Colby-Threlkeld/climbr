import { composite, contrastRatio, hexToRgb } from '../contrast';
import { colors, material, MIN_GLASS_ALPHA, withAlpha } from '../tokens';

// Worst-case backdrops: a gym wall can put any of these behind a glass pane. We ignore the
// blur entirely (blur only averages toward mid-tones, which helps), so this is a floor.
const BACKDROPS = {
  black: '#000000',
  white: '#FFFFFF',
  red: '#FF0000',
  green: '#00FF00',
  blue: '#0000FF',
  yellow: '#FFFF00',
  magenta: '#FF00FF',
  cyan: '#00FFFF',
};

const worstContrast = (scheme: 'light' | 'dark', alpha: number, textHex: string) => {
  const tint = hexToRgb(material[scheme].regular.tint);
  return Math.min(
    ...Object.values(BACKDROPS).map((bg) =>
      contrastRatio(hexToRgb(textHex), composite(tint, alpha, hexToRgb(bg))),
    ),
  );
};

describe('glass materials keep text readable (WCAG AA)', () => {
  for (const scheme of ['light', 'dark'] as const) {
    for (const variant of ['regular', 'thin'] as const) {
      it(`${scheme} ${variant}: textPrimary ≥ 4.5:1 over any backdrop`, () => {
        const { alpha } = material[scheme][variant];
        expect(alpha).toBeGreaterThanOrEqual(MIN_GLASS_ALPHA[scheme]);
        expect(worstContrast(scheme, alpha, colors[scheme].textPrimary)).toBeGreaterThanOrEqual(
          4.5,
        );
      });
    }

    it(`${scheme}: the alpha floor itself still passes`, () => {
      expect(
        worstContrast(scheme, MIN_GLASS_ALPHA[scheme], colors[scheme].textPrimary),
      ).toBeGreaterThanOrEqual(4.5);
    });

    // Documents the rule "no textSecondary on glass": it fails on a worst-case backdrop.
    it(`${scheme}: textSecondary is NOT safe on thin glass`, () => {
      expect(
        worstContrast(scheme, material[scheme].thin.alpha, colors[scheme].textSecondary),
      ).toBeLessThan(4.5);
    });
  }

  it('tints are brand colors only (cream / ink)', () => {
    expect(material.light.regular.tint).toBe('#F4EFE6');
    expect(material.dark.regular.tint).toBe('#141414');
  });

  it('withAlpha builds rgba strings', () => {
    expect(withAlpha('#F4EFE6', 0.72)).toBe('rgba(244, 239, 230, 0.72)');
  });
});

describe('contrast math sanity', () => {
  it('matches known WCAG values', () => {
    expect(contrastRatio(hexToRgb('#000000'), hexToRgb('#FFFFFF'))).toBeCloseTo(21, 0);
    // Ink on orange ≈ 6:1 (design-system.md), white on orange fails AA.
    expect(contrastRatio(hexToRgb('#141414'), hexToRgb('#FF5A1F'))).toBeGreaterThan(5.5);
    expect(contrastRatio(hexToRgb('#FFFFFF'), hexToRgb('#FF5A1F'))).toBeLessThan(4.5);
  });
});
