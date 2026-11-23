# Tech stack

> Read this before adding a dependency or choosing a library.

| Layer | Choice | Why |
|---|---|---|
| Language | **TypeScript** (strict) app · **Python 3.11+** AI worker | TS for safety in the app. Python is where all CV/ML tooling lives |
| App framework | **React Native + Expo** (latest stable SDK), **Expo Router** | One codebase for web/iOS/Android. Develop on Windows |
| Web output | Expo web static export → **Vercel** (decision C10) | Free, HTTPS (required for camera on phones), preview URL per push |
| Overlays/avatar | **@shopify/react-native-skia** (preferred) or **react-native-svg** | Smooth drawing on photos/video, works on web and native. Skia's web build is large, so measure load time and fall back to SVG if needed. Decided by spike step 10 (G12a) |
| Glass materials | **expo-glass-effect** (Liquid Glass, iOS 26+) + **expo-blur** (frosted blur elsewhere, CSS `backdrop-filter` on web) | Apple-native feel where available, a readable fallback everywhere (decision D1) |
| Animation / gestures | **react-native-reanimated** 4 + **react-native-gesture-handler** 3 | UI-thread drags and springs (Slider, Sheet), web supported |
| Video playback | **expo-video** | Web + native. Overlays sync to the current playback time |
| Photo/video capture | **expo-image-picker** (Phase 1, works on web) → **expo-camera** (Phase 2 native, adds a live framing guide) | |
| Media prep | **expo-image-manipulator** for photos (max 2048 px, strips location metadata). Video: client-side length limit (raw ≤ 120 s) + trim metadata. Server-side **ffmpeg** handles transcoding/downscaling to 720p | |
| Backend | **Supabase**: Auth (email code), Postgres, Storage, Realtime, Edge Functions, pg_cron | One service, Row Level Security, free tier to start |
| AI worker | **Python + FastAPI** on **Modal** (serverless GPU, pay per second), managed with **uv**, linted/formatted with **Ruff** | No server to manage, scales to zero when idle (so ~$0 when nobody is using it). Alternatives: Replicate, RunPod |
| CV/ML | **Ultralytics YOLO** (holds), pose model per `docs/ai/pose-and-technique.md`, **OpenCV**, **NumPy** | Proven, well-documented |
| LLM | **Anthropic API (Claude)** with structured JSON output | Vision + strong instruction following. Behind an interface so it can be swapped |
| Server state | **TanStack Query** · local state **Zustand** | |
| Schema typegen | `json-schema-to-typescript` (app) · `datamodel-code-generator` → Pydantic v2 (worker) | One JSON Schema source |
| Testing | Jest + jest-expo + React Native Testing Library · pytest · pgTAP | |
| Analytics / errors | **PostHog** (product metrics) · **Sentry** (app + worker errors) | Free tiers |
| Native builds (Ph2) | **EAS Build** → **TestFlight** / Android internal | No Mac needed |

**Dependency rule:** every app library must work on **web + iOS + Android** or be isolated in `*.web.ts` / `*.native.ts` files. Check web support **before** adding. Keep dependencies minimal and justify each one in the PR.
