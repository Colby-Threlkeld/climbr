import { useColorScheme } from 'react-native';

import { colors, type ColorScheme, type ThemeColors } from './tokens';

export type Theme = {
  scheme: ColorScheme;
  isDark: boolean;
  colors: ThemeColors;
};

// Pure helper so the light/dark mapping can be unit-tested without a device.
export function themeFor(scheme: ColorScheme): Theme {
  return { scheme, isDark: scheme === 'dark', colors: colors[scheme] };
}

// Follows the device setting (prefers-color-scheme on web). Anything other than
// "dark" (including unknown/null) falls back to light. A manual toggle comes later.
export function useTheme(): Theme {
  return themeFor(useColorScheme() === 'dark' ? 'dark' : 'light');
}
