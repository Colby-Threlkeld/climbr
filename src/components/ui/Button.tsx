import { ActivityIndicator, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { haptics } from '@/lib/haptics';
import { opacity, press, radii, sheen, spacing, touch, type ThemeColors } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { Material } from './Material';
import { Text, type TextColor } from './Text';

// `glass` is for controls floating over a photo or video (decision D1), never in forms.
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'glass';

export type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  // Defaults to `label`; set it when the visible label is ambiguous out of context ("Edit").
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: ViewStyle;
};

// Primary = orange fill with INK text (white on orange fails contrast, CLAUDE.md rule 10).
const variants: Record<ButtonVariant, { bg: keyof ThemeColors | null; text: TextColor }> = {
  primary: { bg: 'accent', text: 'onAccent' },
  secondary: { bg: 'surfaceAlt', text: 'textPrimary' },
  ghost: { bg: null, text: 'textPrimary' },
  glass: { bg: null, text: 'textPrimary' },
};

// Glass views must not be faded (Apple: opacity < 1 on a glass parent drops the effect),
// so the glass button shows a press by shrinking slightly instead of dimming.
const pressedFor = (variant: ButtonVariant) =>
  variant === 'glass' ? styles.pressedScale : styles.pressed;

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  accessibilityLabel,
  accessibilityHint,
  style,
}: ButtonProps) {
  const { colors } = useTheme();
  const v = variants[variant];
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      // aria-* (not accessibilityState): react-native-web only maps aria-* to the DOM,
      // and React Native reads both, so this is the one form screen readers get everywhere.
      aria-disabled={inactive}
      aria-busy={loading}
      disabled={inactive}
      onPress={() => {
        if (inactive) return;
        haptics.tap();
        onPress();
      }}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: v.bg ? colors[v.bg] : 'transparent' },
        // Orange stays solid; the only glass treatment allowed on it is a top-edge sheen.
        // Orange is the same in both modes, so it always gets the light sheen.
        variant === 'primary' && { boxShadow: sheen.light },
        variant === 'glass' && styles.clip,
        disabled && styles.disabled,
        pressed && !inactive && pressedFor(variant),
        style,
      ]}
    >
      {variant === 'glass' ? (
        <Material variant="thin" style={[StyleSheet.absoluteFill, styles.glassShape]} />
      ) : null}
      {/* Label stays rendered (invisible) while loading so the button keeps its width. */}
      <View style={loading ? styles.hidden : null}>
        <Text variant="headline" color={v.text}>
          {label}
        </Text>
      </View>
      {loading ? (
        <View style={[StyleSheet.absoluteFill, styles.center]}>
          <ActivityIndicator color={colors[v.text === 'onAccent' ? 'onAccent' : 'textPrimary']} />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: touch.min,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { alignItems: 'center', justifyContent: 'center' },
  hidden: { opacity: 0 },
  clip: { overflow: 'hidden' },
  // Material needs the radius itself (not just the parent clip) so web blur corners round.
  glassShape: { borderRadius: radii.card },
  pressed: { opacity: opacity.pressed },
  pressedScale: { transform: [{ scale: press.scale }] },
  disabled: { opacity: opacity.disabled },
});
