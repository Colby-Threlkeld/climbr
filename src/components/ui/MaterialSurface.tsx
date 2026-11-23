import { BlurView } from 'expo-blur';
import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { material, sheen, withAlpha, type GlassVariant } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { useGlassBackdrop } from './GlassBackdrop';

// Shared building blocks for Material.tsx (web/Android/fallback) and Material.native.tsx (iOS).

export type MaterialVariant = GlassVariant | 'solid';
export type MaterialMode = 'liquid-glass' | 'blur' | 'solid';

export type MaterialProps = ViewProps & {
  variant?: MaterialVariant;
  // Top-edge light. On by default: it's what makes a pane read as glass.
  sheen?: boolean;
};

// Opaque fallback: Reduce Transparency, `variant="solid"`, or no blur support.
export function SolidSurface({ style, children, sheen: withSheen = true, ...rest }: MaterialProps) {
  const { colors, scheme } = useTheme();
  return (
    <View
      style={[
        { backgroundColor: colors.surface },
        withSheen ? { boxShadow: sheen[scheme] } : null,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

// Frosted glass: a blur of what's behind + our brand tint on top. The tint alone is enough
// for AA contrast (see material-test.ts); the blur is a bonus where the platform supports it.
export function BlurSurface({
  variant = 'regular',
  style,
  children,
  sheen: withSheen = true,
  ...rest
}: MaterialProps & { variant?: GlassVariant }) {
  const { scheme, isDark } = useTheme();
  const target = useGlassBackdrop();
  const glass = material[scheme][variant];
  // Chrome/Safari ignore the parent's rounded clip for backdrop-filter, which leaves square
  // blurred corners. Giving every layer the caller's radius fixes it on all platforms.
  const corners = radiusOf(style);
  return (
    <View style={[styles.clip, style]} {...rest}>
      <BlurView
        style={[StyleSheet.absoluteFill, corners]}
        intensity={glass.blur}
        tint={isDark ? 'dark' : 'light'}
        // Android only blurs inside a <GlassBackdrop>, and only on Android 12+ (older devices
        // fall back to the tint alone, which still passes contrast).
        blurTarget={target ?? undefined}
        blurMethod={target ? 'dimezisBlurViewSdk31Plus' : 'none'}
      />
      <View
        testID="material-tint"
        style={[
          StyleSheet.absoluteFill,
          corners,
          { backgroundColor: withAlpha(glass.tint, glass.alpha) },
        ]}
      />
      {children}
      {withSheen ? <SheenOverlay style={corners} /> : null}
    </View>
  );
}

// Inset shadows paint under children, so the sheen sits on its own layer above them.
// pointerEvents="none" keeps it from stealing taps.
export function SheenOverlay({ style }: { style?: ViewStyle }) {
  const { scheme } = useTheme();
  return (
    <View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, style, { boxShadow: sheen[scheme] }]}
    />
  );
}

const RADIUS_KEYS = [
  'borderRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
] as const;

// Pulls just the corner radii out of a caller's style, for the inner blur/tint/sheen layers.
export function radiusOf(style: StyleProp<ViewStyle>): ViewStyle {
  const flat: ViewStyle = StyleSheet.flatten(style) ?? {};
  const out: ViewStyle = {};
  for (const k of RADIUS_KEYS) if (flat[k] !== undefined) Object.assign(out, { [k]: flat[k] });
  return out;
}

const styles = StyleSheet.create({
  // Clips the blur + tint layers to the caller's borderRadius.
  clip: { overflow: 'hidden' },
});
