# Product overview

> Read this when you need the "why" behind the product, the target user, or what's in/out of scope. Feature details live in `docs/features/`.

**Scope:** **indoor bouldering gyms only.** No outdoor climbing, no rope climbing.
**Working name:** Cruxshot (not final, see `decisions.md` → Still open). **Intent:** a **startup**: build for real users, real quality, and eventual scale.

## TL;DR

**Cruxshot is a personal AI climbing coach in your pocket.** It does three things, all personalized to *your* body:

1. **Route Reader.** Photograph a boulder problem → the app detects the holds → it draws **numbered dots and lines showing a suggested sequence** sized to your height and reach → an **animated avatar climbs the route on your photo** to show you how. → `docs/features/route-reader.md`
2. **Technique Review.** Film yourself climbing → the app tracks your body → it gives you **specific, timestamped feedback** on what you did well and what to improve → a **"ghost" avatar overlays your video showing the better body position** at exactly the moment it's talking about. → `docs/features/technique-review.md`
3. **Climber Profile.** Onboarding collects **height, wingspan (ape index), experience, grade, and style**, so every suggestion fits the person climbing. → `docs/features/onboarding-profile.md`

**Build approach:** React Native + Expo (TypeScript), developed on a **Windows laptop**. Phase 1 testers use it as a **mobile web app** (free, opened from a link). The same code later becomes the **native iPhone/Android app**. The AI runs on a **cloud Python service** (computer vision + a vision-capable LLM). Data and media live in **Supabase**.

**First users:** indoor **boulderers** at our partner bouldering gym (secured, along with a strong climber/setter for testing and labeling).

## Why the project is shaped this way

| Constraint | Consequence |
|---|---|
| Developer works on **Windows**, no Mac | Native Swift is out for daily work. iOS builds happen in the cloud (EAS Build) in Phase 2. |
| Needs **real camera and video** from testers' phones | Browser-streamed simulators are out. Phone browsers *can* take photos and record or upload video, so a web app works for testing. |
| Testers should **tap a link on their phone** | Phase 1 is a **web app (PWA)** they add to their home screen. |
| Testing should be **free at first** | Apple charges $99/yr for *any* app installed on other people's iPhones. The web app avoids this until it's worth paying. Expo Go is for the developer's own phone only (iOS restricts sharing). |
| Must **feel like a real iPhone app** | Custom design system + Apple's system font + home-screen install. See `docs/design/design-system.md`. |
| Heavy AI (vision, pose tracking, LLM) | Runs **server-side**, not in the app. The phone captures, uploads, and displays results. This also keeps the web and native versions identical. |

**Rejected options (don't revisit without a reason):** Swift/SwiftUI (needs a Mac, iPhone-only), Flutter (imitates iOS instead of using native components), a throwaway HTML prototype (double work), and fully on-device AI for Phase 1 (doesn't work well across web and native, slower to iterate).

## Market reality check

AI climbing apps already exist. As of late 2026 there are apps that **detect holds from a wall photo and give beta advice** (e.g. Visionclimb), apps that **analyze climbing video with pose tracking** (e.g. BetterClimber, Bouldering AI: Coach), and at least one that offers **"ghost beta" guidance** (VBeta). Spray-wall apps (Sprai, Crux) do hold detection for setting climbs.

- ✅ **Demand is validated.** People are building and paying for this.
- ⚠️ **"AI beta" alone is not a differentiator.** Testing has to find out what makes Cruxshot clearly better.
- **Differentiators** (confirmed, to validate with climbers):
  1. **One loop, not two tools:** see the suggested beta → try it → film it → get coached *against that beta* → see the avatar correction. Competitors do one half.
  2. **Truly body-aware:** sequences and corrections change based on *your* height and ape index, and the app **says so** ("At 5'4" with a +1 in ape index, this cross is out of reach, so match instead").
  3. **Show, don't tell:** every piece of feedback has a visual (dots, avatar, ghost overlay). No walls of text.
- **Action item before Phase 1 (human):** download and try the top 3–4 competitors. Note what's slow, wrong, or confusing in `docs/competitors.md`.

## Target users

- **Primary:** indoor gym boulderers, V0–V7, ages 13+ (13–17 with parental consent, see `docs/policies/privacy-safety.md`), who climb 1–3×/week and want to improve but don't pay for coaching.
- **Out of scope:** outdoor climbing of any kind (hold detection on real rock is much harder), rope climbing (long routes don't fit one photo), and competition athletes.

## Why bouldering gyms only

- Gym holds are **brightly colored plastic on flat walls**, the easiest case for computer vision.
- Gym routes are **color-coded**, so "which holds are in this route" can be answered by picking a color.
- Bouldering walls are **short enough to fit in one photo**.
- Good Wi-Fi and cell coverage, so AI processing can happen in the cloud.
- **A partner gym** gives testers, consistent walls (better AI accuracy), and possibly setter input.

## Scope by phase

**Phase 1 MVP (web, test with 15–30 climbers):**
- Onboarding + profile
- Route Reader with assisted route selection, dots/lines, **2D avatar**
- Technique Review with skeleton overlay, 3 key moments, **2D ghost overlay**
- History of past scans/reviews
- Feedback ratings everywhere + "Send feedback" button
- Account deletion, privacy controls

**Deliberately later:**
- **3D avatar** (R&D runs in parallel from Phase 1, ships once it beats the 2D version. See `docs/ai/avatar.md`)
- Live/real-time coaching while recording
- Social: sharing beta to a gym feed, following friends, comparing with others on the same problem
- Gym/setter dashboard (possible business model later)
- Training plans, finger-strength programs
- Wearables

Full phase plan and success metrics: `docs/product/roadmap.md`.
