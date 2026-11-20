import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useTheme } from '@/theme/useTheme';

// Root layout: every screen in app/ renders inside this Stack.
// Headers are off because we draw our own UI. The background and status bar follow
// the device light/dark setting so every screen inherits the right base colors.
export default function RootLayout() {
  const { colors, isDark } = useTheme();
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }} />
    </>
  );
}
