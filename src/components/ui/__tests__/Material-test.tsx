import { render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { useReduceTransparency } from '@/lib/useReduceTransparency';
import { colors, material, sheen, withAlpha } from '@/theme/tokens';

import { Button } from '../Button';
import { Material } from '../Material';
import { Text } from '../Text';

jest.mock('@/lib/useReduceTransparency', () => ({ useReduceTransparency: jest.fn(() => false) }));
jest.mock('@/lib/haptics', () => ({ haptics: { tap: jest.fn(), selection: jest.fn() } }));
// Jest runs the iOS build (Material.native.tsx). Default: an iPhone WITHOUT Liquid Glass
// (iOS < 26), which takes the frosted-blur path. The Liquid Glass path is tested below.
jest.mock('expo-glass-effect', () => {
  const { View } = jest.requireActual('react-native');
  return {
    GlassView: (props: object) => <View testID="glass-view" {...props} />,
    isGlassEffectAPIAvailable: jest.fn(() => false),
    isLiquidGlassAvailable: jest.fn(() => false),
  };
});

const flat = (testID: string) => StyleSheet.flatten(screen.getByTestId(testID).props.style);
// The brand tint layers inside blur surfaces, filtered by their exact background color.
const tintLayers = (rgba: string) =>
  screen
    .queryAllByTestId('material-tint')
    .filter((n) => StyleSheet.flatten(n.props.style).backgroundColor === rgba);

// File-level so one test turning Reduce Transparency on can't leak into the next.
beforeEach(() => jest.mocked(useReduceTransparency).mockReturnValue(false));

describe('<Material />', () => {
  it('regular glass layers the brand tint at its token alpha', async () => {
    await render(
      <Material testID="m" variant="regular">
        <Text>On glass</Text>
      </Material>,
    );
    const g = material.light.regular;
    expect(tintLayers(withAlpha(g.tint, g.alpha)).length).toBeGreaterThan(0);
    expect(screen.getByText('On glass')).toBeTruthy();
  });

  it('solid variant is an opaque surface with the sheen', async () => {
    await render(<Material testID="m" variant="solid" />);
    expect(flat('m')).toMatchObject({
      backgroundColor: colors.light.surface,
      boxShadow: sheen.light,
    });
  });

  it('falls back to solid when Reduce Transparency is on', async () => {
    jest.mocked(useReduceTransparency).mockReturnValue(true);
    await render(<Material testID="m" variant="regular" />);
    expect(flat('m').backgroundColor).toBe(colors.light.surface);
    const g = material.light.regular;
    expect(tintLayers(withAlpha(g.tint, g.alpha))).toHaveLength(0);
  });
});

describe('<Material /> on iOS 26+ (Liquid Glass)', () => {
  it('renders GlassView tinted with the brand color at the contrast floor', async () => {
    const glass = jest.requireMock('expo-glass-effect');
    glass.isGlassEffectAPIAvailable.mockReturnValue(true);
    glass.isLiquidGlassAvailable.mockReturnValue(true);
    // `liquidGlass` is computed at import time, so load a fresh copy of the module.
    let Fresh: typeof Material = Material;
    jest.isolateModules(() => {
      Fresh = require('../Material').Material;
    });
    await render(<Fresh variant="thin" />);
    const view = screen.getByTestId('glass-view');
    const g = material.light.thin;
    expect(view.props.tintColor).toBe(withAlpha(g.tint, g.alpha));
    expect(view.props.glassEffectStyle).toBe('clear');
    glass.isGlassEffectAPIAvailable.mockReturnValue(false);
    glass.isLiquidGlassAvailable.mockReturnValue(false);
  });
});

describe('Button + materials', () => {
  it('primary stays solid orange and only gains a sheen', async () => {
    await render(<Button label="Go" onPress={() => {}} />);
    expect(StyleSheet.flatten(screen.getByRole('button').props.style)).toMatchObject({
      backgroundColor: colors.light.accent,
      boxShadow: sheen.light,
    });
  });

  it('glass variant renders thin glass behind an ink label', async () => {
    await render(<Button label="Back" variant="glass" onPress={() => {}} />);
    const g = material.light.thin;
    expect(tintLayers(withAlpha(g.tint, g.alpha)).length).toBeGreaterThan(0);
    expect(StyleSheet.flatten(screen.getByText('Back').props.style).color).toBe(
      colors.light.textPrimary,
    );
  });
});
