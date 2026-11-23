/** @type {import('jest').Config} */
module.exports = {
  // jest-expo mocks Expo's native modules so components render in Node.
  preset: 'jest-expo',
  // Gesture Handler's official mocks for its native module (Slider, Sheet use gestures).
  setupFiles: ['react-native-gesture-handler/jestSetup.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // Reanimated 4's resolver loads its JS (web) implementation in Jest instead of the native
  // worklets module, which doesn't exist in Node. It chains to react-native-worklets' resolver.
  resolver: 'react-native-reanimated/jest/resolver',
  // Jest doesn't read tsconfig `paths`, so mirror the `@/` alias here.
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
