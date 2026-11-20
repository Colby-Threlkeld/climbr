import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { fontFamily, textScale, type, type ColorToken, type TypeVariant } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

// Only colors meant for reading. `accent` is deliberately excluded: never orange body text.
// `inverse` is text on an ink/cream-inverted fill (selected chips/segments).
// `danger` is only for form error messages; other status colors are icons and badges only.
const textColorToken = {
  textPrimary: 'textPrimary',
  textSecondary: 'textSecondary',
  onAccent: 'onAccent',
  inverse: 'bg',
  danger: 'danger',
} as const satisfies Record<string, ColorToken>;

export type TextColor = keyof typeof textColorToken;

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
        { color: theme.colors[textColorToken[color]] },
        fontFamily ? { fontFamily } : null,
        style,
      ]}
      {...rest}
    />
  );
}
