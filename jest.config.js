/** @type {import('jest').Config} */
module.exports = {
  // jest-expo mocks Expo's native modules so components render in Node.
  preset: 'jest-expo',
  // Jest doesn't read tsconfig `paths`, so mirror the `@/` alias here.
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
