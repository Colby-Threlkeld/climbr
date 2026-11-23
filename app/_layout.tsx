import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ToastProvider } from '@/components/ui';
import { useTheme } from '@/theme/useTheme';

// Root layout: every screen in app/ renders inside this Stack.
// - GestureHandlerRootView must wrap the whole app for gestures (Slider, Sheet) to work.
// - ToastProvider lets any screen call useToast() instead of Alert.alert.
// Headers are off because we draw our own UI. The background and status bar follow
// the device light/dark setting so every screen inherits the right base colors.
export default function RootLayout() {
  const { colors, isDark } = useTheme();
  return (
    <GestureHandlerRootView style={styles.root}>
      <ToastProvider>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Stack
          screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}
        />
      </ToastProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({ root: { flex: 1 } });
