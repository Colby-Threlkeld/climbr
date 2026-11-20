import { ActivityIndicator, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { haptics } from '@/lib/haptics';
import { opacity, radii, spacing, touch, type ThemeColors } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { Text, type TextColor } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

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
};

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
        disabled && styles.disabled,
        pressed && !inactive && styles.pressed,
        style,
      ]}
    >
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
  pressed: { opacity: opacity.pressed },
  disabled: { opacity: opacity.disabled },
});
