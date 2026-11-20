# Step 02: Scaffold Expo app + CI

**Phase:** 0 · **Depends on:** 01 · **Branch:** `chore/scaffold-expo`

## Goal
An Expo + TypeScript + Expo Router app lives at the repo root and shows a placeholder screen on phone web and in Expo Go, with lint, typecheck, and tests wired into npm scripts and GitHub Actions.

## Read first
- `CLAUDE.md`
- `docs/architecture/overview.md` (folder layout)
- `docs/architecture/tech-stack.md`
- `docs/architecture/conventions.md` (TS style)
- `docs/dev/setup-windows.md` (commands)

## In scope
- Scaffold **at the repo root** (decision C3), not in a subfolder. Latest stable Expo SDK, Expo Router, TypeScript. Don't let the scaffolder overwrite `.gitignore`, `.gitattributes`, `.env.example`, `CLAUDE.md`, or `docs/` (scaffold into a temp folder and copy in if needed).
- Verify Metro bundles through the OneDrive `node_modules` junction from step 01 (web + Expo Go). If it fails, follow the fallback in `docs/dev/setup-windows.md` and note it there.
- `tsconfig.json`: `strict: true`, `@/` path alias → `src/`.
- ESLint + Prettier; scripts `lint`, `typecheck`, `test` (jest-expo + React Native Testing Library) with one trivial passing test.
- Empty folders from the layout with `.gitkeep` only where needed (`src/components/ui`, `src/theme`, `src/lib`, `src/avatar`, `src/features`).
- `app/_layout.tsx` + `app/index.tsx` placeholder.
- `.github/workflows/ci.yml`: install, lint, typecheck, test on PRs.
- Verify and correct the app commands in `docs/dev/setup-windows.md` and `CLAUDE.md`.

## Out of scope
- Theme, components, tabs (03–06). Supabase (07). Worker (16).

## Prompt
> Do step 02 (`docs/plan/steps/02-scaffold-expo.md`). Read the docs it lists. Scaffold Expo + TypeScript + Expo Router at the repo root (no subfolder), set up strict TS with the `@/` alias, ESLint/Prettier, Jest with jest-expo, and a GitHub Actions CI workflow. Keep the placeholder screen minimal. Give me exact Windows commands first, then the files, then a manual checklist for phone web (via `npx expo start --tunnel`) and Expo Go. Update the Commands section of `CLAUDE.md` if anything differs.

## Expected files
- `package.json`, `app.json`, `tsconfig.json`, `babel.config.js` (if needed), `.eslintrc*`/`eslint.config.*`, `.prettierrc`, `jest.config.*`
- `app/_layout.tsx`, `app/index.tsx`
- `.github/workflows/ci.yml`

## Done when
- [ ] `npm run lint`, `npm run typecheck`, `npm test` all pass locally
- [ ] Placeholder renders on iPhone Safari, Android Chrome, and Expo Go
- [ ] CI runs green on a PR
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
