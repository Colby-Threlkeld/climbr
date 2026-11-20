# Step 41: PWA + Add to Home Screen + Vercel

**Phase:** 1 · **Depends on:** 40 · **Branch:** `feat/pwa-deploy`

## Goal
The web build deploys to Vercel (preview per push, production on `main`), installs to the iPhone home screen as a full-screen PWA, and shows a one-time Add to Home Screen guide in iPhone Safari.

## Read first
- `CLAUDE.md`
- `docs/design/screens.md` (row 7)
- `docs/architecture/tech-stack.md` (Web output)
- `docs/dev/setup-windows.md`

## In scope
- Web manifest, icons, theme colors (cream/ink), `apple-mobile-web-app-*` meta, safe-area viewport.
- `app/install.tsx`: shown once in iPhone Safari when not installed (standalone detection); dismiss persisted.
- Vercel project config for `npx expo export -p web`; env vars set in Vercel (public only); SPA routing.
- Measure first-load on a real phone and record it.

## Out of scope
- Push notifications (Phase 2). Offline mode.

## Prompt
> Do step 41 (`docs/plan/steps/41-pwa-deploy.md`). Read the docs it lists. Make the web build an installable PWA (manifest, icons, iOS meta tags, safe areas), add the one-time Add to Home Screen guide for iPhone Safari, and configure Vercel preview + production deploys. Tell me exactly what to click in Vercel. Give me a phone checklist including install and first-load timing.

## Expected files
- `app.json` web config / `public/manifest.json`, icons, `app/install.tsx`, `vercel.json`

## Done when
- [ ] Production URL installs to the iPhone home screen and opens full-screen
- [ ] Camera and video work from the installed PWA
- [ ] Guide shows once in Safari and never in the installed app
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
