import { Pressable, StyleSheet } from 'react-native';

import { haptics } from '@/lib/haptics';
import { opacity, radii, spacing, touch } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { Text } from './Text';

export type ChipProps = {
  label: string;
  selected: boolean;
  // Receives the next state so a parent can keep a Set of picks for multi-select.
  onToggle: (next: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
};

export function Chip({
  label,
  selected,
  onToggle,
  disabled = false,
  accessibilityLabel,
}: ChipProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      // "checkbox" tells screen readers each chip toggles independently (multi-select).
      accessibilityRole="checkbox"
      accessibilityLabel={accessibilityLabel ?? label}
      // aria-* so react-native-web emits the state to the DOM (it ignores accessibilityState).
      aria-checked={selected}
      aria-disabled={disabled}
      disabled={disabled}
      onPress={() => {
        if (disabled) return;
        haptics.selection();
        onToggle(!selected);
      }}
      style={({ pressed }) => [
        styles.base,
        // Selected inverts (ink fill in light mode) instead of using orange, which is for actions.
        { backgroundColor: selected ? colors.textPrimary : colors.surfaceAlt },
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text variant="subhead" color={selected ? 'inverse' : 'textPrimary'}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: touch.min,
    paddingHorizontal: spacing.md,
    borderRadius: radii.control,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: opacity.pressed },
  disabled: { opacity: opacity.disabled },
});
