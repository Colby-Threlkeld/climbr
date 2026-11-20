const { defineConfig, globalIgnores } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
// Turns off ESLint style rules that would fight Prettier. Prettier itself runs
// separately (`prettier --check` in `npm run lint`) so lint errors stay about code, not spacing.
const prettierConfig = require('eslint-config-prettier/flat');

module.exports = defineConfig([
  globalIgnores(['dist/*', 'web-build/*', '.expo/*', 'coverage/*']),
  expoConfig,
  prettierConfig,
  {
    // CLAUDE.md rule 2: colors and sizes live only in src/theme/tokens.ts. Tests are exempt
    // because they hold the expected values copied from the design doc.
    files: ['src/**/*.{ts,tsx}', 'app/**/*.{ts,tsx}'],
    ignores: ['src/theme/tokens.ts', '**/__tests__/**'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/#[0-9a-fA-F]{3,8}\\b/]',
          message: 'Hard-coded color. Use a token from src/theme/tokens.ts.',
        },
        {
          selector: 'TemplateElement[value.raw=/#[0-9a-fA-F]{3,8}\\b/]',
          message: 'Hard-coded color. Use a token from src/theme/tokens.ts.',
        },
        {
          // Numeric literals on size-like style keys (padding: 12, fontSize: 17, ...).
          // 0 is allowed; flex: 1 isn't matched because `flex` isn't a size key.
          selector:
            "Property[key.name=/^(padding|margin|gap|rowGap|columnGap|width|height|minWidth|minHeight|maxWidth|maxHeight|top|bottom|left|right|inset|fontSize|lineHeight|letterSpacing|borderRadius|border.*Width|opacity)/][value.type='Literal'][value.raw=/^[0-9.]+$/][value.raw!='0']",
          message: 'Hard-coded size. Use a token from src/theme/tokens.ts.',
        },
      ],
    },
  },
]);
