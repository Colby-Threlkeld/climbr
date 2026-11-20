# Testing strategy

> Read this when writing tests or finishing a step.

- **App:** Jest + React Native Testing Library for components/hooks; pure logic (`src/avatar/`, `units`, `grades`) gets thorough unit tests.
- **DB:** pgTAP tests for every RLS policy and storage rule. Every new table has a test proving another user can't read it. Age/consent rules get their own tests.
- **Worker:** pytest unit tests per module with small fixture images/videos in `worker/tests/fixtures/` (synthetic only, **no real user media, ever**).
- **AI quality:** `worker/eval` (`docs/ai/evaluation.md`) + coaching safety suite (`docs/ai/llm-coaching.md`). Not run in CI by default (cost); required in PRs that touch models/prompts.
- **CI (GitHub Actions):** lint + typecheck + unit tests for app and worker, `supabase db reset` + pgTAP on every PR.

## Manual phone checklist (after every change)

List what to test manually on **phone web** and **Expo Go**. Template for the PR / step report:

```
### Manual test
Devices: [ ] iPhone Safari (HTTPS)  [ ] Android Chrome (HTTPS)  [ ] Expo Go
- [ ] <happy path steps>
- [ ] Light + dark mode
- [ ] Large text (accessibility size)
- [ ] Bottom actions clear the home indicator / safe area
- [ ] AI screens: loading · low confidence · failure + retry · empty
- [ ] No body data in console / network logs to analytics
```

## Definition of done (every step)
- [ ] Works on phone web (Safari + Chrome) **and** Expo Go
- [ ] Lint, typecheck, tests pass; new logic has tests; RLS tests for new tables
- [ ] All four AI-screen states handled (if applicable)
- [ ] Schemas + generated types in sync; `.env.example` updated
- [ ] No body data in logs/analytics; no secrets in the app bundle
- [ ] Manual test checklist written
- [ ] Docs updated if a decision changed (`docs/product/decisions.md`); `CLAUDE.md` "Current status" + `docs/plan/BUILD_PLAN.md` status updated
