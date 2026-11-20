# CLAUDE.md

Read this every session. Then read **only** the docs your current step lists. Index of all docs: `docs/README.md`.

## Project
**Cruxshot** (working name) is a startup building an AI climbing coach for **indoor bouldering gyms only** (no outdoor, no ropes).
- **Route Reader:** wall photo → hold detection → body-aware suggested beta (numbered dots + 2D avatar).
- **Technique Review:** video → pose tracking → 3 timestamped key moments + ghost-avatar correction.
- **Climber Profile:** height, wingspan, and level drive all personalization.

Built with Expo / React Native (TypeScript), shipped as a mobile **web PWA first** and native later. Python AI worker on Modal. Supabase for auth, db, storage, and realtime. The developer works on Windows.

## Current status
**Step 03 done** (PR #2, CI green). **Step 04 in progress** on `feat/ui-primitives-1`, branched from `feat/theme-tokens`. Built: Button, Card, TextField, Chip, SegmentedControl, the haptics wrapper, and a dev gallery at `/_dev/gallery`; ESLint now blocks hard-coded colors **and sizes**. The checklist passed in headless Edge with an iPhone-size viewport, light and dark. Use `aria-*` props, not `accessibilityState`: react-native-web ignores the latter. Still needed on a real device: Expo Go rendering, haptics, and large accessibility text. The repo lives at `C:\dev\cruxshot`, outside OneDrive (decision O3, revised). **Next: step 05** once 04 is ✅.
Update this line and the Commands section at the end of every step.

## How to work a step
1. Open `docs/plan/BUILD_PLAN.md`, find the next ⬜ step whose dependencies are ✅.
2. Read its file in `docs/plan/steps/` and the docs it lists. Nothing else unless you need it.
3. Build **only** that step's scope. If it's too big or blocked, stop and say so.
4. Finish with: lint, typecheck, tests, a manual phone checklist, and the definition of done.
5. Tick the step in `BUILD_PLAN.md` and update **Current status** here.

**Conflicts:** `docs/product/decisions.md` wins over every other doc. Flag conflicts, don't silently pick.

## Non-negotiable rules
1. **Cross-platform:** every feature works on iPhone Safari, Android Chrome, and Expo Go. Platform code goes in `*.web.ts(x)` / `*.native.ts(x)` with a fallback. Check a library's web support before adding it.
2. **Our UI only:** no `Alert.alert`, `Switch`, or native pickers in screens. Use `src/components/ui/`. No hard-coded colors or sizes; use `src/theme/tokens.ts`.
3. **Worker returns data, app renders.** Never generate overlay images or videos server-side.
4. **`shared/schemas/` is the only contract.** Change a schema → `npm run schemas` → update app + worker in the same commit.
5. **Secrets:** only `EXPO_PUBLIC_*` values in the app. Service-role, Anthropic, and Modal keys stay in worker/Supabase secrets. Never commit `.env`.
6. **RLS on every table.** Every new table ships with policies **and** a pgTAP test proving another user can't read it.
7. **Body data** (`body_profiles`, birth date, injuries, wingspan photos) is never logged and never sent to analytics or Sentry. Wingspan photos are deleted right after measuring. **Weight is not collected.**
8. **Copy:** beta is always "suggested," never "optimal / best / correct." Coaching never mentions weight or body shape, and has at least 1 positive and at most 3 improvements.
9. **Minors (13–17):** no training opt-in, no "keep video longer," no uploads until guardian consent. Under-13s are blocked. Enforce server-side.
10. **Brand:** cream `#F4EFE6`, ink `#141414`, orange `#FF5A1F`. Ink text on orange (never white). Never orange body text.
11. **Every AI screen** handles loading (real progress), low confidence, failure + retry, and empty.
12. **Model or prompt changes** need before/after `worker/eval` numbers in the PR.
13. **`src/avatar/` stays renderer-agnostic:** joints, poses, and corrections only, no drawing code.
14. **Metric only** in DB, schemas, and worker. Image coordinates are normalized 0–1. Limbs are `LH | RH | LF | RF`.

## Commands *(app verified in step 02; Supabase/worker verify in steps 07, 16)*
```bash
npm install && npx expo start          # app (press w for web); --tunnel for phone camera (HTTPS)
npx expo install <pkg>                 # add packages (dev: npx expo install <pkg> "--" --save-dev)
npm run lint && npm run typecheck && npm test   # npm run format fixes Prettier/CRLF issues
npm run schemas                        # regenerate TS + Pydantic types
npx supabase start | db reset | test db   # needs Docker Desktop
cd worker && uv sync && uv run ruff check . && uv run pytest
uv run python -m eval.run              # before model/prompt changes
```
Full reference: `docs/dev/setup-windows.md`.

## Definition of done
Works on phone web and Expo Go. Lint, typecheck, and tests pass. RLS tests exist for new tables. AI states are handled. Schemas are in sync and `.env.example` is updated. No body data in logs and no secrets in the bundle. Manual checklist is written. Docs are updated. Full list: `docs/dev/testing.md`.

## Working with the developer
The developer is learning. Explain non-obvious choices briefly and comment the *why* in code. Give exact Windows (PowerShell) commands. Prefer the simplest thing that meets the spec, and justify every new dependency. The repo lives at `C:\dev\cruxshot`, outside OneDrive (decision O3). Never move it back (`docs/dev/setup-windows.md`). Disagree openly with a decision if needed, but don't override it unilaterally.
