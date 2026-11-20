# Roadmap, metrics, costs, business model

> Read this for phase goals and success metrics. The step-by-step build order for Phases 0–1 lives in `docs/plan/BUILD_PLAN.md`.

> **Realistic timeline note:** for a solo developer who is learning, this is **multi-month** work. The AI parts are the long pole. Build the boring foundation fast, then spend the time on AI quality.

## Phase 0: Foundation (developer only)
- [ ] Try competitors → `docs/competitors.md` *(human task)*
- [x] Secure a **partner bouldering gym** + one strong climber/setter to help label the test set
- [ ] Parental-consent flow for 13–17 + legal review of privacy policy/terms *(legal review is a human task)*
- [ ] Scaffold app, theme tokens, UI primitives, tab bar
- [ ] Supabase schema + RLS + storage
- [ ] Auth + 4-step onboarding with live avatar preview (**this builds the avatar body model early**)
- [ ] Wingspan photo estimate (in Profile, decision C11). A good **first AI feature to build end to end**: small, self-contained, and it exercises the whole upload → job → worker → result pipeline that the bigger features reuse (decision O4)

## Phase 0.5: AI prototypes (in a notebook, before any UI)
- [ ] Hold detection: fine-tune on public data + ~200 gym photos. Measure recall
- [ ] Beta solver on 20 real problems. Have a strong climber grade "reasonable or not"
- [ ] Pose estimation on 20 real videos. Check that tracking survives climbing positions
- [ ] LLM feedback prompt with metrics + frames. Have a strong climber grade the feedback
- **Gate:** if any piece is clearly not good enough, fix or re-scope **before** building UI for it.

## Phase 1: Web PWA test (free, 15–30 climbers, 3–4 weeks)
- [ ] Route Reader end to end (capture → holds → assisted selection → dots → 2D avatar)
- [ ] Technique Review end to end (record → trim → process → results → ghost)
- [ ] Ratings everywhere, Sentry, PostHog, privacy policy, deletion
- [ ] PWA setup + Add-to-Home-Screen guide, deploy
- [ ] Weekly in-person check-ins at the gym *(human)*

**Success metrics:**

| Metric | Target |
|---|---|
| Testers who complete onboarding | ≥ 85% |
| Testers who use **both** features at least once | ≥ 60% |
| Testers who return in week 2+ | ≥ 40% |
| Beta sequences rated 👍 | ≥ 60% |
| Technique feedback points rated 👍 | ≥ 70% |
| Median Route Reader time (photo → dots) | < 20 s |
| Median Technique Review processing | < 90 s |
| "Would be very disappointed if this went away" | ≥ 40% |

## Phase 2: Native beta (~$99 Apple account)
- [ ] EAS Build → TestFlight + Android internal testing
- [ ] `expo-camera` with a live framing guide, background uploads, push notifications
- [ ] Improve models with opt-in data. Auto scale calibration
- [ ] Top-requested features from Phase 1

## Phase 3: Launch & beyond
- [ ] App Store / Google Play
- [ ] Monetization (below)
- [ ] Ship the 3D avatar (if R&D proves out), social beta sharing, gym/setter tools

## Running costs (rough, verify current prices)

| Item | Phase 1 (≈30 testers) | Notes |
|---|---|---|
| Expo, React Native, web hosting | $0 | |
| Supabase | $0 → $25/mo | Free tier storage is small and **video fills it fast**. The 30-day video auto-delete matters here |
| Modal GPU (holds, pose) | ~$0–30/mo | Pay per second, scales to zero. Modal also has a monthly free credit |
| LLM API | ~$5–50/mo | Roughly cents per analysis, depending on model and number of frames |
| Sentry, PostHog | $0 | Free tiers |
| Apple Developer (Phase 2) | $99/yr | |
| Google Play (Phase 3) | $25 once | |

**Per-analysis cost will be real money at scale.** Track it in the `jobs` table (`gpu_seconds` + `llm_tokens`) from day one.

## Business model
- **No monetization plan yet.** The app is free through Phase 1 and Phase 2. Focus on the product.
- **Still, collect the evidence a startup needs:** in Phase 1, ask testers "what would you pay?" and track per-analysis cost (above), so the decision is easy later.
- **Options to evaluate before launch:** freemium subscription (the norm among competitors), gym licensing (B2B), or both.
