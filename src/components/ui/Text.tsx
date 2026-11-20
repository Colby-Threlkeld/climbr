import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { fontFamily, textScale, type, type TypeVariant } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

// Only colors meant for reading. `accent` is deliberately excluded: never orange body text.
// Status colors (success/warning/danger) are for icons and badges, not text.
export type TextColor = 'textPrimary' | 'textSecondary' | 'onAccent';

export type TextProps = RNTextProps & {
  variant?: TypeVariant;
  color?: TextColor;
  // Dense overlays (hold numbers, legends) cap accessibility scaling so labels don't collide.
  dense?: boolean;
};

export function Text({
  variant = 'body',
  color = 'textPrimary',
  dense = false,
  style,
  ...rest
}: TextProps) {
  const theme = useTheme();
  return (
    <RNText
      maxFontSizeMultiplier={dense ? textScale.denseMax : undefined}
      style={[
        type[variant],
        { color: theme.colors[color] },
        fontFamily ? { fontFamily } : null,
        style,
      ]}
      {...rest}
    />
  );
}
