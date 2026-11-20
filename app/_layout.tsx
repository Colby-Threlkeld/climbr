import { Stack } from 'expo-router';

// Root layout: every screen in app/ renders inside this Stack.
// Headers are off because we'll draw our own UI (steps 03–06).
export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
