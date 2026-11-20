# Feature: Technique Review (video → analysis → ghost avatar)

> Read this for any Technique Review step. Related: `docs/ai/pose-and-technique.md`, `docs/ai/llm-coaching.md`, `docs/ai/avatar.md` (ghost), screens 11–14 in `docs/design/screens.md`.

## User flow

1. **Record or upload** a video of one attempt. Recording guide: "Phone propped or held by a friend, whole wall in frame, ~3–5 m back, landscape or portrait both OK. Film only yourself." Raw video max **120 s** (decision G7).
2. **Trim** to the climb (start/end handles). Max **60 seconds** of trimmed range (keeps cost and processing time reasonable). Trim is metadata, not re-encoding.
3. Optionally **link to a Route Reader scan** of the same problem (enables "compare to suggested beta").
4. **Upload and processing** with a progress screen ("Tracking your movement… Finding key moments… Writing your feedback…"). Target < 90 s. **In-app notification** when done so they can keep climbing (push is Phase 2, decision C8).
5. **Results screen:**
   - The video with a **skeleton overlay** tracking their body (toggleable).
   - A **score summary** across 5 technique pillars (see `docs/ai/pose-and-technique.md`), shown as simple bars, **not** a single overall grade (single scores feel judgmental and are less useful).
   - **3 key moments** (max, so it stays focused): each has a timestamp, a title ("Hips far from wall on move 3"), a 1–2 sentence explanation, and a **"Show me"** button.
   - **"Show me"** jumps the video to that moment and fades in a **ghost avatar**: a translucent version of their own pose, **adjusted to the better position** (e.g. hips rotated in, arm straightened, foot moved to the higher hold), animating from their pose to the improved one. Legend: **solid = you, ghost = better.**
   - **What went well** (at least one positive. Coaching that's only criticism makes people quit).
   - **One drill** to practice related to their biggest issue.
6. **Rate each feedback point** 👍/👎 ("Was this right?"), stored in `feedback_ratings`.
7. **Progress over time:** the Profile shows pillar scores across sessions.

## Required states

Every AI screen handles: loading with real progress, low confidence (e.g. "We lost track of you halfway. Try filming from further back?"), failure with retry, and empty.
