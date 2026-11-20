# PROJECT CONTEXT: AI Climbing Coach (working name: **Cruxshot**)

> **What this file is:** the single source of truth for this project. Give it to any AI coding assistant (Claude, Cursor, Copilot) or any collaborator *before* asking them to build anything. It explains what the app is, who it's for, how it works, why each decision was made, and what's still undecided.
>
> **How to read it:** sections marked **🔶 DECISION** are professional calls made on the founder's behalf to fill gaps. They are deliberate defaults, not facts. Confirm or change them, then delete the marker.
>
> **Version:** 2 (scope expanded to AI route reading, video technique analysis, avatars, and body-profile onboarding). November 2026.

---

## 0. TL;DR

**Cruxshot is a personal AI climbing coach in your pocket.** It does three things, all personalized to *your* body:

1. **Route Reader.** Photograph a boulder problem → the app detects the holds → it draws **numbered dots and lines showing a suggested sequence** sized to your height and reach → an **animated avatar climbs the route on your photo** to show you how.
2. **Technique Review.** Film yourself climbing → the app tracks your body → it gives you **specific, timestamped feedback** on what you did well and what to improve → a **"ghost" avatar overlays your video showing the better body position** at exactly the moment it's talking about.
3. **Climber Profile.** Onboarding collects **height, wingspan (ape index), optional weight, experience, grade, and style**, so every suggestion fits the person climbing.

**Build approach:** React Native + Expo (TypeScript), developed on a **Windows laptop**. Phase 1 testers use it as a **mobile web app** (free, opened from a link). The same code later becomes the **native iPhone/Android app**. The AI runs on a **cloud Python service** (computer vision + a vision-capable LLM). Data and media live in **Supabase**.

**First users:** indoor **boulderers** at one partner gym. 🔶 DECISION

---

## 1. Background: why the project is shaped this way

| Constraint | Consequence |
|---|---|
| Developer works on **Windows**, no Mac | Native Swift is out for daily work. iOS builds happen in the cloud (EAS Build) in Phase 2. |
| Needs **real camera and video** from testers' phones | Browser-streamed simulators are out. Phone browsers *can* take photos and record or upload video, so a web app works for testing. |
| Testers should **tap a link on their phone** | Phase 1 is a **web app (PWA)** they add to their home screen. |
| Testing should be **free at first** | Apple charges $99/yr for *any* app installed on other people's iPhones. The web app avoids this until it's worth paying. Expo Go is for the developer's own phone only (iOS restricts sharing). |
| Must **feel like a real iPhone app** | Custom design system + Apple's system font + home-screen install. See §6. |
| Heavy AI (vision, pose tracking, LLM) | Runs **server-side**, not in the app. The phone captures, uploads, and displays results. This also keeps the web and native versions identical. |

**Rejected options (don't revisit without a reason):** Swift/SwiftUI (needs a Mac, iPhone-only), Flutter (imitates iOS instead of using native components), a throwaway HTML prototype (double work), and fully on-device AI for Phase 1 (doesn't work well across web and native, slower to iterate).

---

## 2. Market reality check (read before building)

AI climbing apps already exist. As of late 2026 there are apps that **detect holds from a wall photo and give beta advice** (e.g. Visionclimb), apps that **analyze climbing video with pose tracking** (e.g. BetterClimber, Bouldering AI: Coach), and at least one that offers **"ghost beta" guidance** (VBeta). Spray-wall apps (Sprai, Crux) do hold detection for setting climbs.

**What this means:**
- ✅ **Demand is validated.** People are building and paying for this.
- ⚠️ **"AI beta" alone is not a differentiator.** Testing has to find out what makes Cruxshot clearly better.
- 🔶 **DECISION: proposed differentiators**, to test with climbers:
  1. **One loop, not two tools:** see the suggested beta → try it → film it → get coached *against that beta* → see the avatar correction. Competitors do one half.
  2. **Truly body-aware:** sequences and corrections change based on *your* height and ape index, and the app **says so** ("At 5'4" with a +1 ape index, this cross is out of reach, so match instead").
  3. **Show, don't tell:** every piece of feedback has a visual (dots, avatar, ghost overlay). No walls of text.
- **Action item before Phase 1:** download and try the top 3–4 competitors. Note what's slow, wrong, or confusing. Keep the notes in `docs/competitors.md`.

---

## 3. Product definition

### 3.1 Target users
- **Primary:** indoor boulderers, V0–V7, 18–40, who climb 1–3×/week and want to improve but don't pay for coaching.
- **Not for Phase 1:** outdoor rock (hold detection on real rock is much harder), rope climbing (long routes don't fit one photo), competition athletes.

### 3.2 Why bouldering in a gym first 🔶 DECISION
- Gym holds are **brightly colored plastic on flat walls**, the easiest case for computer vision.
- Gym routes are **color-coded**, so "which holds are in this route" can be answered by picking a color.
- Bouldering walls are **short enough to fit in one photo**.
- Good Wi-Fi and cell coverage, so AI processing can happen in the cloud.
- **A partner gym** gives testers, consistent walls (better AI accuracy), and possibly setter input.

### 3.3 Feature 1: Climber Profile (onboarding)

**Purpose:** personalization. Reach decides beta.

| Field | Required? | Why it matters | Notes |
|---|---|---|---|
| Height | **Required** | Reach and the size of the avatar | ft/in or cm |
| Wingspan | **Optional** | **Ape index** (wingspan − height) changes which moves are possible | Three ways, user's choice: **① Estimate from a photo** (arms-out photo, see §5.7) · **② Type it in** (with a 10-second "how to measure with a tape" illustration) · **③ Skip**. Default = height (ape index 0) if skipped. Can be added or redone later in Profile |
| Weight | **Optional** | Minor factor (small/poor holds, dynamic moves) | Always "Prefer not to say" available. **Never displayed** anywhere in the app. Explain why it's asked. 🔶 DECISION |
| Experience | Required | Pitches the language and advice to their level | "New (< 6 months)", "1–2 years", "3+ years" |
| Hardest boulder sent (recent) | Required | Calibrates difficulty of advice | V-scale picker (Font optional) |
| Style strengths/weaknesses | Optional | Personalizes feedback ("you said slab is your weakness") | Multi-select: slab, vertical, overhang, crimps, slopers, dynos, heel/toe hooks |
| Goals | Optional | Frames coaching | "Climb harder grades", "Better technique", "Fewer injuries", "Have fun" |
| Dominant hand | Optional | Small effect on sequencing | |
| Injuries/limitations | Optional | Avoid recommending risky moves (e.g. no deep drop-knees on a bad knee) | Free text + common checkboxes. Handled as sensitive data |
| Units | Required | Imperial/metric | Auto-detect from locale |

**Onboarding UX rules:** max **4 short screens**, a progress bar, everything editable later in Profile, and a "Skip for now" on optional steps. Show a live **avatar preview that resizes to their height/wingspan** as they type. It's delightful and explains *why* we ask.

**Wingspan photo flow (optional, inside onboarding step ①, after height):**
1. Card: "Want us to estimate your wingspan? Take one photo with your arms out. It takes 20 seconds." Buttons: **Use a photo** · **Type it in** · **Skip**.
2. **Setup guide** (one illustrated screen): stand ~3 m (10 ft) from the camera, **whole body in frame head to toe**, arms straight out to the sides at shoulder height, fingers extended, palms forward, feet together, plain background if possible, phone at chest height. A friend takes it, or the phone is propped and uses a **5-second timer** (built into our capture screen).
3. **Capture** with a silhouette outline to line up with (native Phase 2: live outline; web Phase 1: guide image before the camera opens).
4. **Result screen** (target < 5 s): the photo with **two measurement lines drawn on it** (fingertip-to-fingertip and head-to-feet) so the user can see what was measured, plus the estimate: "Wingspan ≈ 5'11" (180 cm) · Ape index +2 cm". The **avatar preview updates** to match.
5. Actions: **Looks right** · **Adjust** (a ±slider, prefilled) · **Retake**.
6. If the photo can't be measured reliably, say exactly why ("We couldn't see your hands, keep them inside the frame") and offer **Retake** or **Type it in**. Never silently save a bad estimate.
7. **The photo is deleted right after measuring** and only the number is saved (see §10).

### 3.4 Feature 2: Route Reader (photo → dots → avatar)

**User flow:**
1. **Capture.** Camera opens with a framing guide: "Stand back, face the wall straight on, get the whole problem in frame including the floor." (Straight-on photos massively improve accuracy.)
2. **Hold detection** (cloud, target < 5 s). All detected holds are outlined.
3. **Pick the route.** Tap a **hold color** (gym routes are color-coded) *or* tap holds to add or remove them. Then mark the **start hold(s)** and the **top hold**. 🔶 DECISION: this "assisted" step is deliberate. Fully automatic route picking is unreliable, and 10 seconds of user input makes results far more accurate.
4. **Scale check.** The app needs to know how big things are in real life. Default: the wall height from the location profile (most bouldering walls are ~4–4.5 m), with a quick "Is this about right?" slider. Phase 2: auto-calibration.
5. **Suggested beta** (cloud, target < 10 s): **numbered dots on each hand and foot hold, connected by lines**, color-coded by limb (left hand, right hand, left foot, right foot). Up to **3 alternative sequences** ("Static", "Dynamic", "Short-climber friendly").
6. **Watch the avatar.** A 2D avatar **scaled to the user's body** animates move by move over the photo. Controls: play/pause, step forward/back one move, speed 0.5×/1×.
7. **Move cards.** A swipeable list under the photo, one card per move: "Move 4: Right hand to the blue crimp. Rock over your left foot first, keep hips close to the wall."
8. **Rate it.** 👍/👎 on the sequence plus an optional "What was wrong?" (wrong holds / impossible move / not how I'd do it). **This feedback is the training data that makes the product better.**
9. **"Try it, then film it"** button → jumps into Technique Review linked to this route.

**Honesty rule:** always call it **"suggested beta,"** never "the optimal route." Beta depends on body, style, and strength, and the app's credibility depends on not overclaiming.

### 3.5 Feature 3: Technique Review (video → analysis → ghost avatar)

**User flow:**
1. **Record or upload** a video of one attempt. Recording guide: "Phone propped or held by a friend, whole wall in frame, ~3–5 m back, landscape or portrait both OK."
2. **Trim** to the climb (start/end handles). Max **60 seconds**. 🔶 DECISION (keeps cost and processing time reasonable).
3. Optionally **link to a Route Reader scan** of the same problem (enables "compare to suggested beta").
4. **Upload and processing** with a progress screen ("Tracking your movement… Finding key moments… Writing your feedback…"). Target < 90 s. Push/in-app notification when done so they can keep climbing.
5. **Results screen:**
   - The video with a **skeleton overlay** tracking their body (toggleable).
   - A **score summary** across 4–5 technique pillars (see §5.3), shown as simple bars, **not** a single overall grade (single scores feel judgmental and are less useful).
   - **3 key moments** (max, so it stays focused): each has a timestamp, a title ("Hips far from wall on move 3"), a 1–2 sentence explanation, and a **"Show me"** button.
   - **"Show me"** jumps the video to that moment and fades in a **ghost avatar**: a translucent version of their own pose, **adjusted to the better position** (e.g. hips rotated in, arm straightened, foot moved to the higher hold), animating from their pose to the improved one.
   - **What went well** (at least one positive. Coaching that's only criticism makes people quit).
   - **One drill** to practice related to their biggest issue.
6. **Rate each feedback point** 👍/👎 ("Was this right?").
7. **Progress over time:** the Profile shows pillar scores across sessions.

### 3.6 Scope by phase

**Phase 1 MVP (web, test with 15–30 climbers):**
- Onboarding + profile
- Route Reader with assisted route selection, dots/lines, **2D avatar**
- Technique Review with skeleton overlay, 3 key moments, **2D ghost overlay**
- History of past scans/reviews
- Feedback ratings everywhere + "Send feedback" button
- Account deletion, privacy controls

**Deliberately later:**
- **3D avatar** (Phase 3+. See §5.5 for why)
- Live/real-time coaching while recording
- Outdoor rock, ropes
- Social: sharing beta to a gym feed, following friends, comparing with others on the same problem
- Gym/setter dashboard (possible business model later)
- Training plans, finger-strength programs
- Wearables

---

## 4. System architecture

```
┌────────────────────────────┐        ┌──────────────────────────────┐
│  App (Expo / React Native) │        │  Supabase                    │
│  web PWA (Ph1) + native    │◀──────▶│  Auth · Postgres · Storage   │
│  • capture photo/video     │        │  Realtime (job status)       │
│  • trim + compress         │        │  Edge Function: create job   │
│  • render dots, skeleton,  │        └──────────────┬───────────────┘
│    avatar, ghost overlays  │                       │ job webhook
└────────────────────────────┘                       ▼
                                      ┌──────────────────────────────┐
                                      │  AI Worker (Python, GPU)     │
                                      │  serverless: Modal (default) │
                                      │  • hold detection (YOLO)     │
                                      │  • beta solver (graph search)│
                                      │  • pose estimation (video)   │
                                      │  • metrics + key moments     │
                                      │  • LLM: coaching text (JSON) │
                                      │  • ghost pose generation     │
                                      └──────────────────────────────┘
```

**Key principle:** the AI worker returns **data** (hold coordinates, sequences, pose keypoints, feedback JSON), **not rendered images or videos**. The app draws everything. That's cheaper, faster, interactive (tap a hold, scrub the video), and identical on web and native.

**Job flow:**
1. App uploads media to Supabase Storage → inserts a `jobs` row (`status=queued`).
2. Database webhook / Edge Function calls the AI worker endpoint with the job ID.
3. Worker downloads the media, processes it, writes results to `route_scans` / `technique_reviews`, and updates the job `status` (`processing` → `done` / `failed`) with a progress %.
4. The app watches the job via **Supabase Realtime** and updates the progress screen live.

---

## 5. AI & computer vision: how each piece works

> Professional note: **don't try to train everything from scratch.** Use proven open models, fine-tune where needed, and use an LLM for language rather than writing coaching text with rules.

### 5.1 Hold detection
- **Model:** YOLO segmentation model (Ultralytics), fine-tuned on climbing holds.
- **Data:** start from public climbing-hold datasets (e.g. on Roboflow Universe, **check each license**), then add **200–500 labeled photos from the partner gym**. Label with Roboflow or CVAT.
- **Output per hold:** polygon, center point, bounding box, **dominant color** (computed in a lighting-robust color space), confidence, and an optional type guess (jug/crimp/sloper/pinch/volume) for coaching language.
- **Target:** ≥ 90% of route holds detected on straight-on gym photos. Users fix the rest in the assisted step.

### 5.2 Beta solver (the "dots")
- **Scale:** pixels → centimeters, from the wall height (§3.4 step 4) and the image geometry.
- **Body model:** a simple 2D stick figure built from height and wingspan, using standard body-segment proportions (arm, forearm, torso, thigh, shin lengths as fractions of height, with arm length adjusted by ape index).
- **Search:** each **state** = which hold each of the 4 limbs is on. Each **move** = one limb to a new hold. A move is allowed only if the body can reach it: limb lengths, plus constraints like hands above feet and center of mass over the base of support. Use **A\* / Dijkstra** from start to top, where move cost = reach strain + awkwardness + number of moves. Hold-type guesses adjust costs (crimps cost more to hang off).
- **Output:** the top 1–3 sequences as ordered lists of moves (`{limb, from_hold, to_hold}`), each with a **body pose** (joint positions) for the avatar.
- **Language:** the LLM turns each move into a short, human tip, given the move, the hold types, and the user's profile.
- **Honest limitation:** a 2D photo can't see wall angle changes, volumes in depth, or hold friction. The assisted step, wording ("suggested"), and ratings all exist because of this.

### 5.3 Pose estimation & technique metrics (video)
- **Pose model:** an off-the-shelf 2D human pose model run frame by frame (candidates: **RTMPose / ViTPose / YOLO-pose / MediaPipe Pose**, chosen by accuracy on climbing footage. Climbing is hard for pose models because of unusual positions and limbs hidden behind the body). Smooth the keypoints over time to remove jitter.
- **Sample** at ~10–15 frames per second (plenty for climbing, and much cheaper than 30–60).
- **Hold contact:** if a Route Reader scan is linked, or holds are detected in a video frame, work out *which hold each hand/foot is on* over time.
- **Technique pillars** (each scored 0–100 from measurable signals):

| Pillar | Signals measured |
|---|---|
| **Footwork** | Number of foot readjustments, "foot stabs" (repeated small foot movements), feet cutting loose unexpectedly |
| **Body positioning** | Hips distance from wall (approximated in 2D from body proportions and hip-shoulder alignment), hip rotation on side-pulls, center of mass relative to feet |
| **Arm efficiency** | Time spent with bent arms while static (should mostly be straight), over-gripping indicators |
| **Flow & pacing** | Hesitation pauses, rhythm between moves, time on rest holds vs on crux |
| **Commitment** | Hesitation before dynamic moves, aborted reaches (reach starts then retreats) |

- **Key moments:** the moments where metrics are worst (or best), picked to be **distinct** (not 3 notes on the same move).

### 5.4 LLM coaching layer
- **Model:** a vision-capable LLM via API (default: **Claude** via the Anthropic API). Swappable behind one interface.
- **Input:** user profile, pillar metrics, key-moment data, **3–6 key frames as images**, and (if linked) the suggested beta.
- **Output:** **strict JSON** following a schema (key moments, explanations, a positive, a drill, and a **correction spec** for each moment, e.g. `{"joint":"hips","action":"rotate_toward_wall","amount":"medium"}`). Validate the JSON. Retry once if it's invalid.
- **Tone guide (in the system prompt):** encouraging, specific, plain words, and climbing terms explained once for beginners. Never shame body type or weight. **Never mention weight** unless the user explicitly asks.
- **Safety guardrails:** don't suggest moves beyond the user's level that risk injury, and respect stated injuries. Always frame suggestions as things to try, not guarantees.

### 5.5 Avatars (route demo + correction ghost)
**One shared avatar renderer** is used by both features.

- 🔶 **DECISION: Phase 1 avatar is a stylized 2D figure**, a clean mannequin made of rounded limb shapes (not a stick figure, not a realistic human), drawn over the photo/video with **react-native-skia** or **react-native-svg** (both work on web and native).
- **Route demo:** interpolates between the poses from the beta solver, with simple 2D inverse kinematics so limbs bend naturally while the hands/feet stay on holds. Proportions match the user.
- **Correction ghost:** takes the user's *actual* pose at the key moment, applies the correction spec (§5.4) through IK, and shows a translucent accent-colored figure moving from "your position" to "better position." A legend makes it clear: **solid = you, ghost = better.**
- **Why not 3D yet:** a believable 3D avatar on a wall needs the wall's 3D shape (a single photo doesn't capture it), full-body motion generation, and a 3D engine that runs well in mobile browsers. That's months of specialist work, and the 2D version tests whether people *value* the avatar at all. Phase 3 can upgrade to 3D (e.g. React Three Fiber + an avatar rig) if testers love it.

### 5.7 Wingspan estimation from a photo (optional onboarding feature)
**Core idea:** the user already entered their **height**, so we only need the **ratio** of wingspan to height in the photo. No ruler or reference object is needed.

```
wingspan_cm = height_cm × (fingertip-to-fingertip span in pixels ÷ head-top-to-heel height in pixels)
```

- **Why a body outline and not just a pose skeleton:** standard pose models find **wrists**, not fingertips, and the **eyes/nose**, not the top of the head. Both ends matter. So we combine:
  - **Person segmentation** (a body-outline mask, e.g. MediaPipe Image Segmenter or the YOLO segmentation model we already use) for the true **outer edges**: fingertip to fingertip, top of head to bottom of heels.
  - **Pose keypoints** (same pose model as §5.3) to **check the pose is valid**: arms roughly horizontal (within ~15°), elbows straight (angle > 160°), body facing the camera (shoulder width plausible vs height), feet visible, standing upright.
- **Corrections:** small tilt correction if the phone was rotated. Exclude hair volume at the top of the head where possible.
- **Sanity checks:** reject if the resulting ape index is outside about **−10 cm to +15 cm**, which is outside the normal human range and means the photo is probably wrong. Then ask for a retake.
- **Expected accuracy:** roughly **±3–5 cm** with a good photo. Perspective and slightly bent arms are the main error sources. That's good enough for beta sequencing (reach limits have margin anyway), and the UI lets users fine-tune with the slider. 🔶 DECISION: show the result as "≈", never as an exact measurement.
- **Where it runs:** the AI worker (same pipeline as the other jobs, `kind='wingspan_estimate'`), so it works the same on web and native. Phase 2 option: run on the device for speed and privacy.
- **Store:** `wingspan_cm`, `wingspan_source` (`photo` / `manual` / `default`), and a confidence value. **Not the photo.**
- **Test set:** 20 people with **tape-measured** wingspans. Target median error ≤ 4 cm before launch. Add this to `worker/eval`.

### 5.8 Quality measurement (how we know the AI is good)
- Keep a **test set**: 50 labeled route photos + 30 videos from the partner gym, with real beta and coach notes from a strong climber or setter.
- Track: hold detection recall, % of suggested sequences a strong climber calls "reasonable," feedback 👍 rate (target ≥ 70%), and processing time.
- Rerun the test set **before every model or prompt change.**

---

## 6. Design system

### 6.1 Principles
1. **Built for the wall, not the desk.** Chalky fingers, one hand busy, glaring sun or dim gym, mid-session. Big targets, bottom-anchored actions.
2. **Show, don't tell.** Every insight comes with a visual: dots, avatar, ghost, timestamp.
3. **Coach, don't judge.** Positive first, max 3 improvements, never a single "you are bad" score.
4. **Fast feels smart.** Clear progress states. Results appear piece by piece (holds → dots → avatar) instead of one long wait.
5. **Feels Apple-native, owned by us.** Apple's system font and iOS spacing and motion conventions, built with *our* components so web and native match.
6. **The climber's image is the canvas.** UI stays quiet: neutral surfaces, one accent, overlays that pop.

### 6.2 Custom components only
Platform widgets (system alerts, `Switch`, native pickers) look different on web than on iPhone. Build our own: **Button, Sheet, Toast, Chip, SegmentedControl, TextField, Card, Slider, ProgressSteps, GradeBadge, PillarBar, MomentCard, MoveCard**. Never use `Alert.alert` in UI code.

### 6.3 Typography
- **System font stack**, which renders Apple's **SF Pro** on iPhone in both native and Safari:
  `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- Scale (mirrors iOS text styles): `largeTitle 34/41 bold` · `title2 22/28 bold` · `headline 17/22 semibold` · `body 17/22` · `subhead 15/20` · `footnote 13/18` · `numeric` = tabular figures for grades, timestamps, scores.
- Respect accessibility text size (cap ~1.4× in dense overlays).

### 6.4 Color 🔶 DECISION
Granite, chalk, and climbing tape. Neutral UI with one accent. Overlays need **maximum visibility on busy, colorful gym walls**.

| Token | Light | Dark | Use |
|---|---|---|---|
| `bg` | `#F7F6F3` | `#0E0F11` | App background |
| `surface` | `#FFFFFF` | `#1A1C1F` | Cards, sheets |
| `surfaceAlt` | `#EFEDE8` | `#24272B` | Inputs, chips |
| `textPrimary` | `#15171A` | `#F4F3F0` | Text |
| `textSecondary` | `#5E636B` | `#A3A8B0` | Metadata |
| `accent` | `#FF5A1F` | `#FF6A33` | Primary actions, capture button, ghost avatar |
| `success` / `warning` / `danger` | `#1F9D55` / `#C98A00` / `#D92D20` | `#34C26F` / `#F2B233` / `#F2574B` | Status |

**Overlay palette** (used on top of photos/video, always with a **dark outline + soft shadow** so they read on any wall color):

| Element | Color | Shape |
|---|---|---|
| Left hand | `#00C2FF` cyan | Filled circle with number |
| Right hand | `#FF3DA5` magenta | Filled circle with number |
| Left foot | `#00C2FF` cyan | **Rounded square** with number |
| Right foot | `#FF3DA5` magenta | **Rounded square** with number |
| Sequence lines | White, 3 pt, dark outline | Dashed for feet, solid for hands |
| Detected holds | White outline, 2 pt | Selected route holds get a brighter fill |
| User skeleton | White, 70% opacity | |
| Ghost avatar | `accent`, 55% opacity | Glow |

Hands vs feet are distinguished by **shape, not just color** (colorblind-safe), and left vs right by color plus an "L/R" label in the legend.

- **Contrast:** WCAG AA minimum for all text. Dark mode from day one.

### 6.5 Spacing, shape, touch
- 8-pt grid (4, 8, 12, 16, 20, 24, 32, 40). Screen padding 16.
- Radii: 10 (inputs/chips), 14 (cards), 20 (sheets), full (capture button).
- **Minimum touch target 48 pt.** Capture button 76 pt. Tappable holds are expanded to at least 44 pt hit areas even when the hold is small.
- Primary actions at the **bottom**. Respect safe areas (notch/home indicator) on web too.

### 6.6 Motion
- Sheets: spring, ~300 ms. Screens: ~250 ms. Avatar default speed is ~0.8 s per move (adjustable).
- Haptics on native (capture, result ready), no-op on web.
- **Reduce Motion:** avatar auto-play off by default, step-through only.

### 6.7 Navigation
Bottom tab bar, with capture in the center:

```
[ Home ]     [ ◉ Capture ]     [ Profile ]
```
- **Home:** recent scans and reviews, "Continue where you left off," tips.
- **Capture:** opens a choice with a **Route photo** / **Video** segmented control, Route photo by default.
- **Profile:** body profile, progress charts (pillar scores over time), settings, feedback, privacy.

---

## 7. Screens (Phase 1)

| # | Screen | Key contents |
|---|---|---|
| 1 | Welcome | Value prop: "See the beta. Fix your technique." · Get started · "Test version, thanks for helping" |
| 2 | Sign in | Email → 6-digit code |
| 3–6 | Onboarding (4 steps) | ① Height + wingspan (photo estimate / type in / skip, live avatar preview) ② Experience + grade ③ Style + goals ④ Optional: weight, injuries, with clear "why we ask" text |
| 7 | Add to Home Screen guide | Web only, iPhone Safari, shown once |
| 8 | Capture: Route photo | Camera + framing guide overlay |
| 9 | Route: holds detected | Photo, hold outlines, color picker chips, tap to add/remove, mark start/top, scale slider |
| 10 | Route: suggested beta | Dots/lines overlay, sequence tabs (A/B/C), avatar play controls, swipeable move cards, 👍/👎, "Try it, then film it" |
| 11 | Capture: Video | Record or choose from library + recording guide |
| 12 | Trim & link | Trim handles, link-to-route option, Analyze button |
| 13 | Processing | Step progress (live), "We'll notify you, keep climbing" |
| 14 | Review results | Video + skeleton toggle, pillar bars, 3 moment cards with **Show me**, positive note, drill, 👍/👎 per point |
| 15 | Home | History list (thumbnails, date, type) |
| 16 | Profile | Body profile (editable), progress charts, settings, Send feedback, Privacy & data, Delete account |

**States every AI screen must design for:** loading (with real progress), **low confidence** ("We couldn't see the whole wall. Try stepping back?"), failure with retry, and empty.

---

## 8. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Language | **TypeScript** (strict) app · **Python 3.11+** AI worker | TS for safety in the app. Python is where all CV/ML tooling lives |
| App framework | **React Native + Expo** (latest stable SDK), **Expo Router** | One codebase for web/iOS/Android. Develop on Windows |
| Web output | Expo web static export → **Vercel** or **Cloudflare Pages** | Free, HTTPS (required for camera on phones) |
| Overlays/avatar | **@shopify/react-native-skia** (preferred) or **react-native-svg** | Smooth drawing on photos/video, works on web and native. Skia's web build is large, so measure load time and fall back to SVG if needed |
| Video playback | **expo-video** | Web + native. Overlays sync to the current playback time |
| Photo/video capture | **expo-image-picker** (Phase 1, works on web) → **expo-camera** (Phase 2 native, adds a live framing guide) | |
| Media prep | **expo-image-manipulator** for photos (max 2048 px, strips location metadata). Video: client-side length limit + trim metadata. Server-side **ffmpeg** handles transcoding/downscaling to 720p | |
| Backend | **Supabase**: Auth (email code), Postgres, Storage, Realtime, Edge Functions | One service, Row Level Security, free tier to start |
| AI worker | **Python + FastAPI** on **Modal** (serverless GPU, pay per second) 🔶 DECISION | No server to manage, scales to zero when idle (so ~$0 when nobody is using it). Alternatives: Replicate, RunPod |
| CV/ML | **Ultralytics YOLO** (holds), pose model per §5.3, **OpenCV**, **NumPy** | Proven, well-documented |
| LLM | **Anthropic API (Claude)** with structured JSON output | Vision + strong instruction following. Behind an interface so it can be swapped |
| Server state | **TanStack Query** · local state **Zustand** | |
| Analytics / errors | **PostHog** (product metrics) · **Sentry** (app + worker errors) | Free tiers |
| Native builds (Ph2) | **EAS Build** → **TestFlight** / Android internal | No Mac needed |

**Dependency rule:** every app library must work on **web + iOS + Android** or be isolated in `*.web.ts` / `*.native.ts` files.

---

## 9. Data model (Supabase / Postgres)

```sql
profiles (
  id uuid pk references auth.users,
  display_name text,
  units text default 'imperial',            -- 'imperial' | 'metric'
  experience text,                          -- 'new' | '1-2y' | '3y+'
  max_grade text,                           -- e.g. 'V4'
  styles jsonb,                             -- strengths/weaknesses
  goals text[],
  dominant_hand text,
  onboarding_completed_at timestamptz,
  created_at timestamptz default now()
)

-- Sensitive body data kept in a separate table with stricter access
body_profiles (
  user_id uuid pk references profiles,
  height_cm numeric not null,
  wingspan_cm numeric,                      -- null → assume = height
  wingspan_source text default 'default'    -- 'photo' | 'manual' | 'default'
    check (wingspan_source in ('photo','manual','default')),
  wingspan_confidence numeric,              -- 0–1, photo estimates only
  weight_kg numeric,                        -- optional, never displayed
  injuries text,                            -- optional
  updated_at timestamptz default now()
)

locations (id, name, kind 'gym', city, default_wall_height_cm int default 430, created_at)

jobs (
  id uuid pk, user_id uuid, kind text check (kind in ('route_scan','technique_review','wingspan_estimate')),
  target_id uuid, status text check (status in ('queued','processing','done','failed')),
  progress int default 0, stage text, error text, created_at, updated_at
)

route_scans (
  id uuid pk,                               -- generated on device
  user_id uuid, location_id uuid,
  photo_path text, width int, height int,
  wall_height_cm int,
  holds jsonb,                              -- [{id, polygon, center, color, type_guess, confidence}]
  route_hold_ids text[],                    -- user-confirmed route holds
  start_hold_ids text[], top_hold_id text,
  sequences jsonb,                          -- [{label, moves:[{limb, to_hold, pose, tip}]}]
  rating smallint, rating_reason text,
  status text, created_at timestamptz
)

technique_reviews (
  id uuid pk,
  user_id uuid, route_scan_id uuid null,
  video_path text,                          -- raw video: auto-deleted after 30 days 🔶
  duration_s numeric, trim_start_s numeric, trim_end_s numeric,
  pose_path text,                           -- keypoints file in storage (JSON/binary)
  pillar_scores jsonb,                      -- {footwork: 72, ...}
  feedback jsonb,                           -- {moments:[{t, title, text, correction}], positive, drill}
  status text, created_at timestamptz
)

feedback_ratings (id, user_id, target_kind, target_id, item_key, thumbs smallint, reason text, created_at)
app_feedback (id, user_id, message, screenshot_path, app_version, platform, created_at)
```

**Security:** Row Level Security on every table. **All user content is private by default**, readable only by its owner. `body_profiles` is readable only by its owner and the AI worker's service role. Storage paths are `{user_id}/...` and protected per user. Never disable RLS.

---

## 10. Privacy, safety, and trust

- **Body data is sensitive.** Collect only what's useful. Weight and injuries are optional with a clear "why." It's never shown publicly, never sent to analytics, and goes to the LLM **only when relevant** (height/wingspan yes, weight rarely, injuries only as "avoid X").
- **Videos show people's bodies and faces.** Private by default. Raw videos are auto-deleted after **30 days** (pose data and feedback are kept), with a user setting to keep longer or delete immediately. 🔶 DECISION. Other people in the frame: the recording guide asks users to film only themselves.
- **Wingspan photos are never kept.** They're uploaded to a short-lived private path, measured, then **deleted immediately** (plus a storage rule that auto-deletes anything left in that path after 1 hour as a safety net). Never used for training, even with opt-in. The result screen says: "Your photo has been deleted. We only kept the measurement."
- **Strip location metadata** from all uploaded media.
- **No body shaming, no weight advice.** It's in the LLM system prompt and covered by tests (§5.6).
- **Injury disclaimer:** a one-time acknowledgment in onboarding ("Climbing has risk. Suggestions are guidance, not guarantees. Climb within your limits") plus a small "suggested" label on all beta.
- **Account and data deletion** in-app (Apple requires it, and it's the right thing to do).
- **Privacy policy + terms** linked in onboarding (required for TestFlight/App Store, so write simple ones in Phase 1).
- **Testers 18+** in Phase 1. 🔶
- **AI data use:** state clearly whether uploaded photos/videos are used to improve the models. 🔶 DECISION: **opt-in** checkbox during onboarding, off by default. Builds trust, and still yields training data from willing users.

---

## 11. Project structure (monorepo)

```
cruxshot/
├─ app/                              # Expo Router screens
│  ├─ _layout.tsx
│  ├─ (auth)/welcome.tsx, sign-in.tsx
│  ├─ (onboarding)/body.tsx, level.tsx, style.tsx, optional.tsx
│  ├─ (tabs)/_layout.tsx             # custom tab bar w/ center capture
│  ├─ (tabs)/index.tsx               # Home
│  ├─ (tabs)/capture.tsx
│  ├─ (tabs)/profile.tsx
│  ├─ route/[id]/holds.tsx           # hold confirmation
│  ├─ route/[id]/index.tsx           # suggested beta + avatar
│  ├─ review/new.tsx                 # trim & link
│  ├─ review/[id]/processing.tsx
│  └─ review/[id]/index.tsx          # results
├─ src/
│  ├─ components/ui/                 # design-system primitives
│  ├─ components/overlay/            # HoldOutline, BetaDots, SequenceLines, Skeleton, Avatar, Ghost
│  ├─ avatar/                        # body model (proportions), 2D IK, pose interpolation (shared by both features)
│  ├─ theme/tokens.ts
│  ├─ lib/supabase.ts, grades.ts, units.ts, media.ts, storage.(web|native).ts
│  ├─ features/onboarding/, routeScan/, techniqueReview/, jobs/ (realtime status hook)
│  └─ analytics.ts
├─ worker/                           # Python AI worker
│  ├─ app.py                         # FastAPI + Modal entrypoints
│  ├─ holds/ (detect.py, color.py)
│  ├─ beta/ (body_model.py, solver.py)
│  ├─ pose/ (estimate.py, smooth.py, contacts.py)
│  ├─ technique/ (metrics.py, moments.py)
│  ├─ coach/ (llm.py, prompts/, schemas.py)   # JSON schemas shared with the app
│  ├─ ghost/ (corrections.py)
│  ├─ body/ (wingspan.py)            # arms-out photo → wingspan estimate (§5.7)
│  └─ eval/ (test set runner)
├─ supabase/migrations/              # tables, RLS policies, storage rules
├─ shared/schemas/                   # JSON Schemas for holds, sequences, poses, feedback (single source of truth for app + worker)
├─ docs/competitors.md, docs/test-plan.md
├─ .env.example                      # never commit real .env
└─ PROJECT_CONTEXT.md
```

**Contract rule:** the app and worker communicate *only* through the JSON shapes in `shared/schemas/`. Change a schema → update both sides in the same commit.

---

## 12. Development environment (Windows)

1. Install **Node.js LTS**, **Git**, **VS Code**, **Python 3.11+**.
2. App: `npx create-expo-app@latest cruxshot` (TypeScript, Expo Router).
3. Create a free **Supabase** project. Put the URL + anon key in `.env`.
4. Worker: Python virtual env, `pip install ultralytics fastapi modal opencv-python numpy anthropic`. Create **Modal** and **Anthropic** accounts. API keys go **only** in the worker's secrets, never in the app.
5. Develop the worker **locally on CPU first** (slow but fine for testing). Deploy to Modal GPU when it works.
6. Install **Expo Go** on your own phone for native checks (**developer only**).
7. ⚠️ **Testing web on your phone:** phones require **HTTPS** for camera features, so use Vercel preview deployments (an HTTPS link on every Git push) or `npx expo start --tunnel`.
8. ESLint + Prettier (app), Ruff + Black (worker), strict typing both sides.

---

## 13. Roadmap

> **Realistic timeline note:** for a solo developer who is learning, this is **multi-month** work. The AI parts are the long pole. Build the boring foundation fast, then spend the time on AI quality.

### Phase 0: Foundation (you only)
- [ ] Try competitors → `docs/competitors.md`
- [ ] Find a **partner gym** + one strong climber/setter to help label the test set
- [ ] Scaffold app, theme tokens, UI primitives, tab bar
- [ ] Supabase schema + RLS + storage
- [ ] Auth + 4-step onboarding with live avatar preview (**this builds the avatar body model early**)
- [ ] Wingspan photo estimate (§5.7). A good **first AI feature to build end to end**: small, self-contained, and it exercises the whole upload → job → worker → result pipeline that the bigger features reuse

### Phase 0.5: AI prototypes (in a notebook, before any UI)
- [ ] Hold detection: fine-tune on public data + ~200 gym photos. Measure recall
- [ ] Beta solver on 20 real problems. Have a strong climber grade "reasonable or not"
- [ ] Pose estimation on 20 real videos. Check that tracking survives climbing positions
- [ ] LLM feedback prompt with metrics + frames. Have a strong climber grade the feedback
- **Gate:** if any piece is clearly not good enough, fix or re-scope **before** building UI for it.

### Phase 1: Web PWA test (free, 15–30 climbers, 3–4 weeks)
- [ ] Route Reader end to end (capture → holds → assisted selection → dots → 2D avatar)
- [ ] Technique Review end to end (record → trim → process → results → ghost)
- [ ] Ratings everywhere, Sentry, PostHog, privacy policy, deletion
- [ ] PWA setup + Add-to-Home-Screen guide, deploy
- [ ] Weekly in-person check-ins at the gym
- **Success metrics:**

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

### Phase 2: Native beta (~$99 Apple account)
- [ ] EAS Build → TestFlight + Android internal testing
- [ ] `expo-camera` with a live framing guide, background uploads, push notifications
- [ ] Improve models with opt-in data. Auto scale calibration
- [ ] Top-requested features from Phase 1

### Phase 3: Launch & beyond
- [ ] App Store / Google Play
- [ ] Monetization (§14)
- [ ] 3D avatar, social beta sharing, gym/setter tools, outdoor rock

---

## 14. Costs & business model

### Running costs (rough, verify current prices)
| Item | Phase 1 (≈30 testers) | Notes |
|---|---|---|
| Expo, React Native, web hosting | $0 | |
| Supabase | $0 → $25/mo | Free tier storage is small and **video fills it fast**. The 30-day video auto-delete matters here |
| Modal GPU (holds, pose) | ~$0–30/mo | Pay per second, scales to zero. Modal also has a monthly free credit |
| LLM API | ~$5–50/mo | Roughly cents per analysis, depending on model and number of frames |
| Sentry, PostHog | $0 | Free tiers |
| Apple Developer (Phase 2) | $99/yr | |
| Google Play (Phase 3) | $25 once | |

**Per-analysis cost will be real money at scale.** Track it in the `jobs` table (GPU seconds + LLM tokens) from day one.

### Business model 🔶 DECISION (to validate, not build in Phase 1)
- **Freemium:** a few free Route Reads + Technique Reviews per month, then a subscription (~$5–10/mo). This is the norm among competitors (several use subscriptions or token packs).
- **Later B2B:** gyms pay for setter tools / member perks.
- **In Phase 1, ask testers** "what would you pay?" instead of building payments.

---

## 15. Rules for any AI assistant working on this project

1. **Read this whole file first.** Follow the decisions. If you disagree, explain why. Don't silently swap them.
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

---

## 16. Open questions for the founder

1. **Which gym will you partner with,** and do you know a setter or strong climber who could help label photos and judge the AI's output? *(The biggest factor in AI quality.)*
2. **Which feature is the hero?** Route Reader or Technique Review: if testers only remembered one, which should it be? *(It decides what gets polished first. Default plan: build both, prototype both in Phase 0.5, lead with whichever tests better.)*
3. **What will make Cruxshot better than the existing apps** (§2)? Do the proposed differentiators match your vision?
4. **Wingspan photo:** any objection to it working only with full-body photos (head to toe in frame)? The math depends on knowing the user's height in the photo. Alternatives like a selfie with arms out won't work.
5. **Is weight important to you?** Plan: optional and barely used. Weight has little effect on beta, and asking can put people off.
6. **Real app name?** Check App Store, domain, and trademark.
7. **Business intent:** side project, startup, or portfolio piece? *(It changes how much to invest in polish vs speed.)*
8. **Opt-in for training data:** comfortable with off-by-default, or do you want it on with clear disclosure?

---

## 17. Kickoff prompt (paste into your AI coding assistant)

> I'm building the app described in `PROJECT_CONTEXT.md` (attached). Read all of it. Start with **Phase 0**: scaffold the Expo + TypeScript + Expo Router app with the folder structure in §11, create `src/theme/tokens.ts` from §6, build the UI primitives from §6.2 and the custom bottom tab bar with a center capture button, then build the **4-step onboarding** from §3.3 including the live **2D avatar preview** that resizes with height and wingspan (put the body-proportion model in `src/avatar/` because both features reuse it later). Include the Supabase migration for `profiles` and `body_profiles` with RLS. Everything must render identically on mobile web and in Expo Go. I'm on Windows. Give me exact terminal commands, then the files, then a checklist of what to verify on my phone.
