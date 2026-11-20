# Contributing (git workflow + rules for AI assistants)

> Read this before committing or opening a PR.

## Git workflow
- Branch from `main`: `feat/…`, `fix/…`, `chore/…`, `ai/…` (model/prompt work), `docs/…`.
- Conventional Commits (`feat(route): add hold color picker`). Small PRs, one concern each. One plan step ≈ one PR.
- PR description: what/why, screenshots (phone web + Expo Go) for UI, eval numbers for AI changes, manual test checklist (`testing.md`).
- Never force-push `main`. Never commit media of real people. Never commit `.env`.

## Rules for any AI assistant working on this project
1. **Read `CLAUDE.md`, then only the docs your current step lists.** Follow the decisions in `docs/product/decisions.md`. If you disagree, explain why. Don't silently swap them.
2. **App features must work on mobile web (Safari + Chrome) AND native.** Platform-specific code goes in `.web.ts` / `.native.ts` with graceful fallbacks.
3. **No platform-native UI widgets** in screens. Use `src/components/ui`. All styling from theme tokens.
4. **The worker returns data, the app renders.** No server-rendered overlay images.
5. **`shared/schemas/` is the contract** between app and worker. Keep both sides in sync.
6. **Never put API keys in the app.** Only `EXPO_PUBLIC_*` safe values (Supabase anon key is fine because RLS is on). Never disable RLS.
7. **Body data is sensitive:** never log it, never send it to analytics, only send it to the LLM when needed.
8. **Never call beta "optimal" in the UI.** Always "suggested."
9. **Every AI screen handles:** loading with progress, low confidence, failure + retry, empty.
10. Before changing a model or prompt, **run `worker/eval`** and report the before/after numbers.
11. Keep dependencies minimal and justify each one. Comment the *why* on anything non-obvious. The developer is learning.
12. After each change: list what to test manually on **phone web** and **Expo Go**.
13. **Stay inside the step.** Don't build things from later steps. If the step is too big or blocked, stop and say so.

## How to work with the developer
The developer is learning: explain non-obvious choices briefly and comment the *why* in code. Give exact Windows-compatible terminal commands. Prefer the simplest thing that meets the spec; justify every new dependency. Disagree openly with a decision if needed, but don't override it unilaterally.
