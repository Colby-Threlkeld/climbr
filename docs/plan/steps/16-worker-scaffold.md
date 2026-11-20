# Step 16: Worker scaffold

**Phase:** 0 · **Depends on:** 01 · **Branch:** `chore/worker-scaffold`

## Goal
`worker/` is a uv-managed Python 3.11+ project with FastAPI, a `/health` endpoint that runs locally and on Modal, Ruff, pytest, and a CI job.

## Read first
- `CLAUDE.md`
- `docs/architecture/overview.md` (folder layout, worker)
- `docs/architecture/conventions.md` (Python style, Worker jobs)
- `docs/dev/setup-windows.md` (worker commands)

## In scope
- Set up the OneDrive-safe `worker\.venv` junction per `docs/dev/setup-windows.md` before the first `uv sync`.
- `uv init` in `worker/`, `pyproject.toml` with FastAPI, Modal, Pydantic v2; dev deps Ruff, pytest.
- `worker/app.py`: FastAPI app + Modal entrypoint; `GET /health`.
- Empty packages per layout (`holds/`, `beta/`, `pose/`, `technique/`, `coach/`, `ghost/`, `body/`, `eval/`, `schemas/`, `notebooks/`, `tests/fixtures/`).
- Ruff config (lint + format), one pytest test for `/health`.
- CI job: `uv sync`, ruff check + format check, pytest.
- Verify and correct the worker commands in `docs/dev/setup-windows.md` and `CLAUDE.md`.

## Out of scope
- Heavy ML deps (added in the steps that need them). Job handling (18).

## Prompt
> Do step 16 (`docs/plan/steps/16-worker-scaffold.md`). Read the docs it lists. Create the `worker/` uv project with FastAPI, a Modal entrypoint, a `/health` endpoint, the package layout, Ruff, pytest, and a CI job. Don't add ML libraries yet. Give me exact Windows commands to run it locally and with `modal serve`, then a checklist.

## Expected files
- `worker/pyproject.toml`, `worker/uv.lock`, `worker/app.py`, `worker/tests/test_health.py`, package `__init__.py` files
- CI workflow updated

## Done when
- [ ] `uv run pytest` and Ruff checks pass locally and in CI
- [ ] `/health` responds locally and via `uv run modal serve app.py`
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
