# Privacy, safety, and trust

> Read this for any step that touches body data, media, minors, analytics, LLM input, or deletion. These rules are non-negotiable.

## Body data
- **Body data is sensitive.** Collect only what's useful. **Weight is not collected at all** (don't add a field for it). Injuries are optional with a clear "why."
- Body data (`body_profiles`, birth month/year, wingspan photos) is never shown publicly, **never logged, never sent to analytics or Sentry breadcrumbs**, and goes to the LLM **only when relevant** (height/wingspan yes, injuries only as "avoid X").

## Media
- **Videos show people's bodies and faces.** Private by default. Raw videos are auto-deleted after **30 days** (pose data and feedback are kept), with a user setting to keep longer or delete immediately (`profiles.video_retention`). Other people in the frame: the recording guide asks users to film only themselves.
- **Wingspan photos are never kept.** They're uploaded to a short-lived private path (`wingspan-tmp`), measured, then **deleted immediately** (plus a pg_cron job that deletes anything left in that path after 1 hour as a safety net). Never used for training, even with opt-in. The result screen says: "Your photo has been deleted. We only kept the measurement."
- **Strip location metadata** from all uploaded media.
- Never commit media of real people to the repo (test fixtures are synthetic).

## Coaching
- **No body shaming, no weight advice.** It's in the LLM system prompt and covered by tests (`docs/ai/llm-coaching.md`).
- Beta is always **"suggested,"** never "optimal / best / correct."
- **Injury disclaimer:** a one-time acknowledgment in onboarding ("Climbing has risk. Suggestions are guidance, not guarantees. Climb within your limits"), stored as `disclaimer_accepted_at`, plus a small "suggested" label on all beta.

## Accounts
- **Account and data deletion** in-app (Apple requires it, and it's the right thing to do). Deletes profile, body profile, all scans/reviews/ratings, and all storage objects.
- **Privacy policy + terms** linked at sign-up (required for TestFlight/App Store, so write simple ones in Phase 1). Acceptance stored as `terms_accepted_at`.

## Age and minors
- **Minimum age 13.** Sign-up asks **birth month + year**; age is computed conservatively from the 1st of the month (decision G2a). Under-13s are blocked, which keeps the app outside COPPA. **Checked server-side** (RLS / Edge Function), not just in the UI.
- **Ages 13–17 need parental/guardian consent:** a guardian email gets a consent link, and the account stays **limited** until it's confirmed. Limited = can finish onboarding and browse, **cannot upload photos or videos** (enforced by storage + `jobs` RLS) (G2c). For minors:
  - The training-data opt-in is **not offered** (always off).
  - Raw videos use the **30-day auto-delete with no "keep longer" option**.
  - No future social/public features without separate guardian consent.
  - Store `birth_year`, `birth_month`, `guardian_email`, and `guardian_consent_at` on the profile.
  - **Get a quick legal review of the consent flow and privacy policy before minors join the test** (rules vary by state and country, e.g. GDPR age-of-consent in the EU). *(Human gate before step 15 ships to testers.)*

## AI data use
- An **opt-in** checkbox during onboarding (adults only), off by default, explaining clearly how uploaded photos/videos would be used to improve the models.

## Secrets
- Only `EXPO_PUBLIC_*` values in the app (Supabase URL + anon key are fine because RLS is on). Service-role, Anthropic, and Modal keys live only in worker/Supabase secrets. Never commit `.env`. Never disable RLS.
