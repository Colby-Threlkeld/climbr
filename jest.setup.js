// Runs before each test file (see jest.config.js).

// Reanimated's official test helpers: animations resolve instantly and shared values work in Node.
require('react-native-reanimated').setUpTests();

// Safe-area context's official mock: zero insets, no <SafeAreaProvider> needed in tests.
jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);

// Gesture Handler tries to attach to the native UI-thread runtime on import, which doesn't
// exist in Node (Reanimated runs its JS/web build here). Its web build of this file is a no-op.
for (const dir of ['src', 'lib/module']) {
  jest.mock(
    `react-native-gesture-handler/${dir}/handlers/gestures/installUIRuntimeBindings`,
    () => ({
      installUIRuntimeBindings: () => {},
    }),
  );
}
