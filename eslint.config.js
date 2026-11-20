const { defineConfig, globalIgnores } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
// Turns off ESLint style rules that would fight Prettier. Prettier itself runs
// separately (`prettier --check` in `npm run lint`) so lint errors stay about code, not spacing.
const prettierConfig = require('eslint-config-prettier/flat');

module.exports = defineConfig([
  globalIgnores(['dist/*', 'web-build/*', '.expo/*', 'coverage/*']),
  expoConfig,
  prettierConfig,
]);
