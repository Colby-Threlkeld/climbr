# Feature: Route Reader (photo → dots → avatar)

> Read this for any Route Reader step. Related: `docs/ai/hold-detection.md`, `docs/ai/beta-solver.md`, `docs/ai/avatar.md`, overlay colors in `docs/design/design-system.md`, screens 8–10 in `docs/design/screens.md`.

## User flow

1. **Capture.** Camera opens with a framing guide: "Stand back, face the wall straight on, get the whole problem in frame including the floor." (Straight-on photos massively improve accuracy.) The gym is preselected from the user's home gym and can be changed with the simple gym picker (decision G6).
2. **Hold detection** (cloud, target < 5 s). All detected holds are outlined.
3. **Pick the route.** Tap a **hold color** (gym routes are color-coded) *or* tap holds to add or remove them. Then mark the **start hold(s)** and the **top hold**. This "assisted" step is deliberate. Fully automatic route picking is unreliable, and 10 seconds of user input makes results far more accurate.
4. **Scale check.** The app needs to know how big things are in real life. Default: the wall height from the location profile (most bouldering walls are ~4–4.5 m), with a quick "Is this about right?" slider. Phase 2: auto-calibration.
5. **Suggested beta** (cloud, target < 10 s): **numbered dots on each hand and foot hold, connected by lines**, color-coded by limb (left hand, right hand, left foot, right foot). Up to **3 alternative sequences** ("Static", "Dynamic", "Short-climber friendly").
6. **Watch the avatar.** A 2D avatar **scaled to the user's body** animates move by move over the photo. Controls: play/pause, step forward/back one move, speed 0.5×/1×.
7. **Move cards.** A swipeable list under the photo, one card per move: "Move 4: Right hand to the blue crimp. Rock over your left foot first, keep hips close to the wall."
8. **Rate it.** 👍/👎 on the sequence plus an optional "What was wrong?" (wrong holds / impossible move / not how I'd do it). Stored in `feedback_ratings` (decision C6). **This feedback is the training data that makes the product better.**
9. **"Try it, then film it"** button → jumps into Technique Review linked to this route.

Results appear piece by piece (holds → dots → avatar) instead of one long wait.

## Honesty rule

Always call it **"suggested beta,"** never "the optimal route." Beta depends on body, style, and strength, and the app's credibility depends on not overclaiming.

## Required states

Every AI screen handles: loading with real progress, **low confidence** ("We couldn't see the whole wall. Try stepping back?"), failure with retry, and empty.
