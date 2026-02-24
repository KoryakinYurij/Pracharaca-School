# Issues - component-migration-tidy

- 2026-02-24T13:49:14+07:00 No blockers in task scope; build succeeded, fallback scenario verified via node one-liner.
- 2026-02-24T13:49:40+07:00 Gotcha: shell interpolation in backticks can corrupt appended notes; use plain text or escaped literals for evidence/notepad appends.
- 2026-02-24T14:22:00+07:00 No blockers in T1 scope; both migration-map and unknown-kind node checks executed successfully and build stayed green.
- 2026-02-24T14:02:02+07:00 No blockers in T5 scope; build passed and node verification confirmed 45 sections without optional metadata still resolve migration strategy safely.
- 2026-02-24T17:30:00+07:00 No blockers in T2 scope; barrel export created, imports refactored, external URL removed, build passes.
- 2026-02-24T14:21:00Z No blockers in T7 scope; targeted adapter tests and full build both pass. Kept legacy renderer paths untouched to avoid behavior drift during adapter introduction.
- 2026-02-24T14:29:06+07:00 Expected RED blockers captured: missing DEV helper entry on topics page, missing normal-state topic back CTA, and missing new-renderer-first summary callout path.
- 2026-02-24T18:00:00+07:00 T3 complete: DEV link now present with data-testid, route guarded for production. Build passes. Test for dev-kitchen-link now passes.

- 2026-02-24T18:45:00+07:00 T4 complete: Topic back navigation now implemented matching LessonPage pattern. Build passes. Routing test now passes. Both normal topic and invalid topic navigation verified via browser QA.

- 2026-02-24T14:56:00Z No blockers in T8 scope; global Playwright module import via absolute path was required for scripted browser QA since project has no local playwright dependency.
- 2026-02-24T15:15:00+07:00 T9 complete: AnswerSection metadata updated with lighter borders for new-rendered kinds. Added isLegacyOnly flag to distinguish legacy-only kinds (details, dosdonts, compare) from new-rendered ones. Subtle Clock icon added for fallback path indication. Build passes. Browser QA screenshots taken for both lessons.

- 2026-02-24T18:21:00+07:00 T10 complete: Lesson 01 migration completed with isKnownKind metadata on all sections. Build passes. Screenshot evidence captured at .sisyphus/evidence/task-10-lesson01-migrated.png.

- 2026-02-24T19:00:00+07:00 Task 11 complete: Lesson 02 verified with build pass and browser QA. No unsupported combinations found - all 13 section kinds (summary, definition, note, compare, warning, steps, checklist, mnemonic, quote, dosdonts, example, pitfalls, references) use valid field combinations per content-schema. Screenshot saved to evidence/.

- 2026-02-24T19:30:00+07:00 T11 FIX complete: Added migration metadata to all 24 sections in lesson 02. Previous attempt was incomplete - no metadata was added. Now lesson 02 has same migration metadata as lesson 01. Build passes. Expanded cards screenshot verified.
- 2026-02-24T15:41:43+07:00 Minor execution gotcha: inline node one-liner initially failed due to shell interpolation of template literals in double quotes; resolved by wrapping script in single quotes.
- 2026-02-24T15:59:46+07:00 No blockers in T13 scope; targeted renderer test, full test suite, build, and browser fallback checks all passed after pruning redundant legacy branches.

- 2026-02-24T15:59:46+07:00 No blockers in T13 scope; targeted renderer test, full test suite, build, and browser fallback checks all passed after pruning redundant legacy branches.
- 2026-02-24T16:25:00+07:00 T14 complete: Style normalization applied to 6 content component files. No behavior changes - all component props unchanged. Pre-existing LSP warnings about array index keys remain (unchanged from original). All verifications pass: lint, migration-renderers-red tests, build.
- 2026-02-24T16:25:00+07:00 T14 complete: Style normalization applied to 6 content component files. No behavior changes - all component props unchanged. Pre-existing LSP warnings about array index keys remain (unchanged from original). All verifications pass: lint, migration-renderers-red tests, build.
- 2026-02-24T16:35:00+07:00 T14 CORRECTION: Found and fixed 4 behavior regressions: (1) extra pb-6 padding in MetaphorBlock, (2) typographic quote replaced with plain quote in GiantQuote, (3) added aria-hidden on background number in StepTimeline, (4) added aria-hidden on icon in PrincipleBlock. All reverted to original behavior while keeping style cleanup.
- 2026-02-24T17:00:00+07:00 T15 complete: Documentation updated to reflect implementation. No blockers - all links verified valid, schema fields match types.ts, build passes. Evidence files generated showing full consistency between docs and implementation.
- 2026-02-24T20:05:00+07:00 T16 QA notes: preview HTTP probe for `/kitchen-sink` returns 200 because Vite preview serves SPA shell; route restriction must be validated at browser level (final path `/`, no kitchen heading, no DEV entry). No blockers.
- 2026-02-24T10:46:08Z T17 regression wave had no initial failures (`lint=0`, `test=0`, `build=0`). No blockers; only non-blocking Vite chunk-size warning surfaced during build output.
- 2026-02-24T17:56:37+07:00 F1 audit found no blocking compliance gaps; one interpretation caveat captured: preview `/kitchen-sink` HTTP 200 is SPA shell behavior, so prod restriction validation remains browser-contract based per `.sisyphus/evidence/task-16-prod-demo-restriction.txt`.
- 2026-02-24T18:08:21+07:00 F2 found no blockers. Non-blocking notes: Vite chunk-size warning persists in build output; migration map still contains `overlap-legacy` metadata markers, but runtime renderer path is deterministic and safe (`new -> legacy` fallback).
- 2026-02-24T18:28:32+07:00 F3 gotcha: preview /kitchen-sink returns HTTP 200 SPA shell, so pass/fail must rely on browser contract assertions (final path /, no kitchen heading, no DEV entry).
- 2026-02-24T12:08:27Z F4 scope audit gotcha: repository contains legacy untracked `.sisyphus/evidence/*` artifacts from prior verification cycles that look out-of-plan at first glance and must be explicitly categorized.
