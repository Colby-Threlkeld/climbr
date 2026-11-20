import { Pressable, StyleSheet, View } from 'react-native';

import { haptics } from '@/lib/haptics';
import { opacity, radii, spacing, touch } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { Text } from './Text';

export type SegmentOption<T extends string> = { value: T; label: string };

export type SegmentedControlProps<T extends string> = {
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  // Names the whole group for screen readers, e.g. "Capture type".
  accessibilityLabel: string;
};

// Our own control instead of the native one so web and iOS look identical (design-system.md).
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel,
}: SegmentedControlProps<T>) {
  const { colors } = useTheme();
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      style={[styles.track, { backgroundColor: colors.surfaceAlt }]}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityLabel={option.label}
            // aria-* so react-native-web emits the state to the DOM (it ignores accessibilityState).
            aria-checked={selected}
            onPress={() => {
              if (selected) return;
              haptics.selection();
              onChange(option.value);
            }}
            style={({ pressed }) => [
              styles.segment,
              selected && { backgroundColor: colors.textPrimary },
              pressed && !selected && styles.pressed,
            ]}
          >
            <Text variant="subhead" color={selected ? 'inverse' : 'textPrimary'}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    padding: spacing.xxs,
    borderRadius: radii.control,
    gap: spacing.xxs,
  },
  segment: {
    flex: 1,
    minHeight: touch.min,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.control,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: opacity.pressed },
});
