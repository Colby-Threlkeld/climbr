# Step 01: Repo bootstrap

**Phase:** 0 · **Depends on:** — · **Branch:** `chore/repo-bootstrap`

## Goal
The repo is a clean, correctly-rooted git repository with ignore rules, LF line endings, an env template, and OneDrive-safe dependency folders, so every later step starts from a known state.

## Read first
- `CLAUDE.md`
- `docs/dev/setup-windows.md` (gotchas section)
- `docs/architecture/conventions.md` (Environment variables)

## In scope
- Confirm which git repo we're in (`git rev-parse --show-toplevel`). If it's `C:\Users\colby` (accidental parent repo), **stop and ask the developer** before running `git init` here.
- `git init` at the repo root (if needed), default branch `main`.
- `.gitignore` covering Node/Expo (`node_modules`, `.expo`, `dist`, `web-build`), Python (`.venv`, `__pycache__`, `.ruff_cache`, `.pytest_cache`), Supabase (`supabase/.temp`, `supabase/.branches`), `.env*` except `.env.example`, OS files, and any eval media folder.
- `.gitattributes` with `* text=auto eol=lf`.
- `.env.example` listing every var from `conventions.md` with empty values and a comment on where each lives.
- OneDrive junctions for `node_modules` and `worker/.venv` per `setup-windows.md` (developer runs the commands).
- First commit with the existing docs.

## Out of scope
- Any app or worker code (step 02, 16).

## Prompt
> Do step 01 (`docs/plan/steps/01-repo-bootstrap.md`). Read `CLAUDE.md`, `docs/dev/setup-windows.md`, and the env-var table in `docs/architecture/conventions.md`. First check which git repo this folder belongs to and stop to ask me if it's my user folder. Then create `.gitignore`, `.gitattributes`, and `.env.example`, give me the exact PowerShell commands to set up the OneDrive junctions, and make the first commit. No app code. End with a checklist of what I should verify.

## Expected files
- `.gitignore`, `.gitattributes`, `.env.example`

## Done when
- [ ] `git rev-parse --show-toplevel` prints this folder
- [ ] `git status` is clean after the first commit; no `.env` tracked
- [ ] `node_modules` and `worker\.venv` junctions exist and point outside OneDrive
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
