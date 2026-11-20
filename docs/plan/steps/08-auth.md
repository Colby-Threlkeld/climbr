# Step 08: Auth: welcome + email code

**Phase:** 0 · **Depends on:** 06, 07 · **Branch:** `feat/auth`

## Goal
A new user can open the app, see Welcome, sign in with an emailed 6-digit code, stay signed in across reloads, and sign out; signed-out users can't reach the tabs.

## Read first
- `CLAUDE.md`
- `docs/design/screens.md` (rows 1–2)
- `docs/features/onboarding-profile.md` (Sign-up flow)
- `docs/architecture/conventions.md` (App state)

## In scope
- `app/(auth)/welcome.tsx` (value prop, Get started, "Test version, thanks for helping"), `app/(auth)/sign-in.tsx` (email → 6-digit code via Supabase OTP).
- Session persistence: `src/lib/storage.web.ts` / `storage.native.ts` adapter.
- Route guard in `app/_layout.tsx`: signed out → auth; signed in without profile → (next step's) birth date; otherwise tabs.
- Session state in Zustand (UI/session only); sign-out in Profile placeholder.
- Note Supabase's default email rate limits; document custom SMTP as a follow-up if hit.

## Out of scope
- Birth date, guardian, terms screens (09). Onboarding (12–13).

## Prompt
> Do step 08 (`docs/plan/steps/08-auth.md`). Read the docs it lists. Build Welcome and email-code Sign in with Supabase Auth, session persistence via platform storage adapters, a root route guard, and sign-out. Use our UI primitives and Toast for errors (no alerts). Give me commands, files, and a phone checklist including a reload test on web.

## Expected files
- `app/(auth)/_layout.tsx`, `app/(auth)/welcome.tsx`, `app/(auth)/sign-in.tsx`
- `src/lib/storage.web.ts`, `src/lib/storage.native.ts`, `src/features/auth/*`
- `app/_layout.tsx` updated

## Done when
- [ ] Sign in → reload page → still signed in (web); kill + reopen (Expo Go) → still signed in
- [ ] Signed-out user hitting `/profile` is redirected to Welcome
- [ ] Wrong code shows a Toast, not an alert
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
