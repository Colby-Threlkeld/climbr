# Step 17: Shared schemas + typegen

**Phase:** 0 · **Depends on:** 02, 16 · **Branch:** `chore/shared-schemas`

## Goal
`shared/schemas/` holds versioned JSON Schemas, and one command (`npm run schemas`) generates TypeScript types for the app and Pydantic models for the worker; CI fails if generated files are stale.

## Read first
- `CLAUDE.md`
- `docs/architecture/conventions.md` (Data, Contracts)
- `docs/architecture/data-model.md` (jsonb shapes)
- `docs/product/decisions.md` (C4, C9)

## In scope
- Schemas (each with `schema_version`): `common` (normalized point, limb enum, COCO-17 keypoint), `job` (kind, status, stage, progress, error code), `wingspan_result`, `holds`, `sequences` (move = `{limb, from_hold, to_hold, pose, tip}`), `pose_track`, `feedback` (moments with correction spec, positive, drill), `pillar_scores`.
- `npm run schemas`: `json-schema-to-typescript` → `src/types/generated/`, `datamodel-code-generator` → `worker/schemas/generated/`.
- Generated files committed, header "do not edit".
- CI check: regenerate and `git diff --exit-code`.
- App helper that rejects unknown major `schema_version` (shows "update the app" state later).

## Out of scope
- Using the types in features (later steps). Schemas can grow in later steps; always regenerate in the same commit.

## Prompt
> Do step 17 (`docs/plan/steps/17-shared-schemas.md`). Read the docs it lists. Create the versioned JSON Schemas in `shared/schemas/`, an `npm run schemas` script that generates TS types and Pydantic v2 models, commit the generated files, and add a CI staleness check. Include small round-trip tests on both sides. Give me commands and a checklist.

## Expected files
- `shared/schemas/*.schema.json`, `scripts/gen-schemas.*`
- `src/types/generated/*`, `worker/schemas/generated/*`
- Tests in app + worker, CI updated

## Done when
- [ ] Editing a schema and running `npm run schemas` updates both sides
- [ ] CI fails when generated files are out of date
- [ ] Standard definition of done in `docs/dev/testing.md`
- [ ] `BUILD_PLAN.md` status ticked and `CLAUDE.md` "Current status" updated
