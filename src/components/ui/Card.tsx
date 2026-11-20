import { View, type ViewProps } from 'react-native';

import { radii, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

// White on cream in light mode, `surface` (a tint of ink) in dark mode.
export function Card({ style, ...rest }: ViewProps) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        { backgroundColor: colors.surface, borderRadius: radii.card, padding: spacing.md },
        style,
      ]}
      {...rest}
    />
  );
}
