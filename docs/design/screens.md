# Screens (Phase 1)

> Read this to find which route file a screen lives in and what it must show. Rows marked ➕ were added in the docs audit (decision G8 and related).

| # | Screen | Route file | Key contents |
|---|---|---|---|
| 1 | Welcome | `app/(auth)/welcome.tsx` | Value prop: "See the beta. Fix your technique." · Get started · "Test version, thanks for helping" |
| 2 | Sign in | `app/(auth)/sign-in.tsx` | Email → 6-digit code |
| 2a ➕ | Birth date | `app/(auth)/birth-date.tsx` | Month + year. Under 13 → block screen (G2a) |
| 2b ➕ | Guardian email | `app/(auth)/guardian.tsx` | 13–17 only. Sends consent link, explains limited account (G2b, G2c) |
| 2c ➕ | Terms | `app/(auth)/terms.tsx` | Privacy policy + terms links, accept |
| 3–6 | Onboarding (4 steps) | `app/(onboarding)/body.tsx`, `level.tsx`, `style.tsx`, `optional.tsx` | ① Height + wingspan (type in / skip, live avatar preview) ② Experience + grade + home gym ③ Style (two groups) + goals ④ Optional: injuries/limitations, with clear "why we ask" text, injury disclaimer, plus the training-data opt-in (hidden for under-18s) |
| 7 | Add to Home Screen guide | `app/install.tsx` ➕ | Web only, iPhone Safari, shown once |
| 8 | Capture: Route photo | `app/(tabs)/capture.tsx` | Camera + framing guide overlay, gym picker chip |
| 9 | Route: holds detected | `app/route/[id]/holds.tsx` | Photo, hold outlines, color picker chips, tap to add/remove, mark start/top, scale slider |
| 10 | Route: suggested beta | `app/route/[id]/index.tsx` | Dots/lines overlay, sequence tabs (A/B/C), avatar play controls, swipeable move cards, 👍/👎, "Try it, then film it" |
| 11 | Capture: Video | `app/(tabs)/capture.tsx` (Video segment) | Record or choose from library + recording guide |
| 12 | Trim & link | `app/review/new.tsx` | Trim handles, link-to-route option, Analyze button |
| 13 | Processing | `app/review/[id]/processing.tsx` | Step progress (live), "We'll let you know, keep climbing" |
| 14 | Review results | `app/review/[id]/index.tsx` | Video + skeleton toggle, pillar bars, 3 moment cards with **Show me**, positive note, drill, 👍/👎 per point |
| 15 | Home | `app/(tabs)/index.tsx` | History list (thumbnails, date, type) |
| 16 | Profile | `app/(tabs)/profile.tsx` | Body profile (editable), progress charts, settings, Send feedback, Privacy & data, Delete account |
| 16a ➕ | Wingspan estimate | `app/profile/wingspan/{guide,capture,result}.tsx` | Photo flow from `docs/features/onboarding-profile.md` (C11) |
| 16b ➕ | Privacy & data | `app/profile/privacy.tsx` | Video retention setting, training opt-in (adults), delete account |
| 16c ➕ | Send feedback | `app/profile/feedback.tsx` | Message + optional screenshot |

## States every AI screen must design for

Loading (with real progress), **low confidence** ("We couldn't see the whole wall. Try stepping back?"), failure with retry, and empty.
