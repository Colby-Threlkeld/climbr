# Feature: Climber Profile (sign-up, onboarding, profile)

> Read this for steps that touch sign-up, onboarding, the Profile tab, or the wingspan photo estimate. Related: `docs/policies/privacy-safety.md` (age gate, consent, body data), `docs/ai/wingspan-estimation.md` (the math), `docs/ai/avatar.md` (live preview).

**Purpose:** personalization. Reach decides beta.

## Profile fields

| Field | Required? | Why it matters | Notes |
|---|---|---|---|
| Birth month + year | **Required** (at sign-up) | Age gate: under 13 blocked, 13–17 need parental consent | Asked once, never displayed. Age computed from the 1st of the month (decision G2a) |
| Guardian email | Required if 13–17 | Consent link | Sign-up screen shown only to minors (G2b) |
| Height | **Required** | Reach and the size of the avatar | ft/in or cm |
| Wingspan | **Optional** | **Ape index** (wingspan − height) changes which moves are possible | In onboarding: **Type it in** (with a 10-second "how to measure with a tape" illustration) or **Skip**. **Estimate from a photo** is offered later in **Profile** (decision C11). Default = height (ape index 0) if skipped. Can be added or redone later in Profile |
| Experience | Required | Pitches the language and advice to their level | "Under 1 year" (`new`), "1–3 years" (`1-3y`), "3+ years" (`3y+`) (G10a) |
| Hardest boulder sent (recent) | Required | Calibrates difficulty of advice | V-scale picker **V0–V10 + V11+** (Font optional) (G10b) |
| Style strengths/weaknesses | Optional | Personalizes feedback ("you said slab is your weakness") | **Two chip groups**: "I'm good at" / "I want to improve" (G9). Options: slab, vertical, overhang, crimps, slopers, dynos, heel/toe hooks |
| Goals | Optional | Frames coaching | "Climb harder grades", "Better technique", "Fewer injuries", "Have fun" |
| Dominant hand | Optional | Small effect on sequencing | |
| Injuries/limitations | Optional | Avoid recommending risky moves (e.g. no deep drop-knees on a bad knee) | Free text + common checkboxes. Handled as sensitive data |
| Units | Required | Imperial/metric | Auto-detect from locale; imperial only as fallback (C7) |
| Home gym | Required | Preselects the location (and wall height) for scans | Simple picker from `locations` (G6) |

## Sign-up flow (before onboarding)

1. **Welcome** → **Sign in** (email → 6-digit code).
2. **Birth date** (month + year). Under 13 → friendly block screen, no account data kept beyond what's needed to enforce the block. Checked **server-side**, not just in the UI.
3. **Guardian email** (13–17 only) → consent link sent. Until confirmed, the account is **limited**: can finish onboarding and browse, **cannot upload** (G2c). Details: `docs/policies/privacy-safety.md`.
4. Accept **privacy policy + terms** (linked) → records `terms_accepted_at`.

## Onboarding UX rules

Max **4 short screens**, a progress bar, everything editable later in Profile, and a "Skip for now" on optional steps. Show a live **avatar preview that resizes to their height/wingspan** as they type. It's delightful and explains *why* we ask.

| Step | Contents |
|---|---|
| ① Body | Height + wingspan (**Type it in** / **Skip**), live avatar preview, units toggle |
| ② Level | Experience + hardest grade + home gym |
| ③ Style | Strengths, weaknesses, goals, dominant hand |
| ④ Optional | Injuries/limitations with clear "why we ask" text · one-time injury disclaimer acknowledgment (records `disclaimer_accepted_at`) · training-data opt-in (**hidden for under-18s**) |

Injury disclaimer text: "Climbing has risk. Suggestions are guidance, not guarantees. Climb within your limits."

## Wingspan photo flow (optional, in Profile → Body → "Estimate from a photo")

1. Card: "Want us to estimate your wingspan? Take one photo with your arms out. It takes 20 seconds." Buttons: **Use a photo** · **Type it in** · **Cancel**.
2. **Setup guide** (one illustrated screen): stand ~3 m (10 ft) from the camera, **whole body in frame head to toe**, arms straight out to the sides at shoulder height, fingers extended, palms forward, feet together, plain background if possible, phone at chest height. A friend takes it, or the phone is propped and uses a **5-second timer** (built into our capture screen).
3. **Capture** with a silhouette outline to line up with (native Phase 2: live outline; web Phase 1: guide image before the camera opens).
4. **Result screen** (target < 5 s): the photo with **two measurement lines drawn on it** (fingertip-to-fingertip and head-to-feet) so the user can see what was measured, plus the estimate: "Wingspan ≈ 5'11" (180 cm) · Ape index +2 cm". The **avatar preview updates** to match.
5. Actions: **Looks right** · **Adjust** (a ±slider, prefilled) · **Retake**.
6. If the photo can't be measured reliably, say exactly why ("We couldn't see your hands, keep them inside the frame") and offer **Retake** or **Type it in**. Never silently save a bad estimate.
7. **The photo is deleted right after measuring** and only the number is saved. The result screen says: "Your photo has been deleted. We only kept the measurement."
8. Minors in a limited account can't use this (it's an upload) until guardian consent.

## Profile tab

Body profile (editable, incl. wingspan photo estimate), home gym, progress charts (pillar scores over time, see `technique-review.md`), settings (units, video retention), Send feedback, Privacy & data, Delete account.
