# Decisions - component-migration-tidy

- 2026-02-24T13:49:14+07:00 Chosen deterministic unknown-kind policy: resolve to legacy paragraph strategy without throw ().
- 2026-02-24T13:49:31+07:00 Decided unknown/unready kind policy resolves to safe legacy paragraph strategy with rendererOrder [legacy] and no throw.
- 2026-02-24T14:22:00+07:00 Standardized policy naming in migration module: `COMPAT_FALLBACK_POLICY` (`new -> legacy`) for mapped kinds and `UNKNOWN_KIND_FALLBACK_POLICY` (`legacy`) for unknown/unready kinds.
- 2026-02-24T14:02:02+07:00 Added migration metadata as a nested optional `migration` object in `AnswerSectionData` to align field semantics with `migrationMap` (`target`, `rendererOrder`, `isKnownKind`, deprecation fields) while keeping legacy payloads untouched.
- 2026-02-24T17:30:00+07:00 Removed Unsplash external URL from HeroBanner in kitchen-sink demo; used default bg-graphite to maintain offline capability and design system consistency.
- 2026-02-24T14:21:00Z Chosen adapter API split: normalized outputs for strict checks plus safe fallback outputs for component props, so migration mapping stays data-only and renderers can opt into deterministic defaults.
- 2026-02-24T14:29:06+07:00 Kept RED routing assertions anchored to explicit UI contracts (`data-testid="dev-kitchen-link"` and back-link accessible name `К темам`) so failures remain deterministic and non-flaky.
- 2026-02-24T18:00:00+07:00 Guarded /kitchen-sink route using Vite's import.meta.env.DEV conditional rendering - route only added to React Router in development mode. Production build contains zero kitchen-sink references.

- 2026-02-24T18:45:00+07:00 Topic back navigation uses consistent pattern from LessonPage: sticky container, focus-ring class for keyboard accessibility, ArrowLeft icon decorative (aria-hidden), text "К темам" for screen readers. Maintains existing error-state "На главную" link unchanged.

- 2026-02-24T14:56:00Z Kept renderer integration inside `answerRenderers.tsx` + `AnswerSection.tsx` only: introduced `renderSectionBody` orchestration with explicit new/legacy engine loop, preserved legacy per-kind functions as non-removal fallback for migration stabilization.
- 2026-02-24T15:15:00+07:00 AnswerSection wrapper strategy: lighter border colors for new-rendered kinds (border-gold/20, border-border/30-40) since inner components (Callout, GlossaryList, PrincipleBlock, GiantQuote) already have rich styling. Legacy-only kinds (details, dosdonts, compare) retain stronger borders (border-border/60). Added isLegacyOnly flag to metadata for future use.

- 2026-02-24T18:21:00+07:00 T10 migration strategy: Applied conservative { isKnownKind: true } metadata to all answer sections in lesson 01. This confirms sections use known kinds from types.ts and helps renderer identify properly structured content. Reference lesson 02 (qa-craft) has no migration metadata, suggesting it was already in new format - T10 brings lesson 01 to parity.

- 2026-02-24T19:00:00+07:00 Task 11: Lesson 02 already uses migrated rendering strategy - no JSON modifications needed. Structural consistency with lesson 01 confirmed. Both lessons use identical kind-field patterns supported by migrationMap.

- 2026-02-24T19:30:00+07:00 T11 FIX: Lesson 02 migration metadata added to match lesson 01. All 24 sections now have "migration": { "isKnownKind": true }. Consistent approach ensures renderer can identify properly structured content in both lessons.

- 2026-02-24T10:30:00Z Boulder state refreshed: active_task pointer set to 12 for continued T12+ execution.
- 2026-02-24T15:41:43+07:00 Kept migration test scope anchored to  and ; added / helpers to reduce duplication without softening assertions.
- 2026-02-24T15:42:05+07:00 Correction: test scope anchored to src/test/migration-renderers-red.test.tsx and src/test/migration-routing-red.test.tsx; helper functions makeSection and renderTopicPage were introduced to reduce duplication without weakening assertions.

- 2026-02-24T12:00:00Z Boulder state refreshed: active_task pointer set to 13 for T13 execution.
- 2026-02-24T15:59:46+07:00 T13 cleanup decision: remove legacy presentation branches for migrated kinds (`steps`, `quote`, `definition`, `checklist`, `pitfalls`, `mnemonic`, `references`) and keep canonical legacy rendering only for intentionally non-migrated kinds (`compare`, `dosdonts`) with generic text fallback preserving unknown-kind safety.
- 2026-02-24T16:05:17+07:00 T13 cleanup decision: keep new renderers primary by pruning redundant legacy branches, while preserving intentional fallback behavior for `compare`, `dosdonts`, and safe text fallback.
- 2026-02-24T14:00:00Z Boulder state refreshed: active_task pointer set to 14 for T14 execution.

- 2026-02-24T14:00:00Z Boulder state refreshed: active_task pointer set to 14 for T14 execution.
- 2026-02-24T16:25:00+07:00 T14 style normalization: Used baseline reference files (QACard.tsx, TopicCard.tsx) to align content components with project conventions: no semicolons, no verbose block comments, plain function declarations instead of React.FC. Changed only syntactic style - component behavior and props remain unchanged.
- 2026-02-24T16:25:00+07:00 T14 style normalization: Used baseline reference files (QACard.tsx, TopicCard.tsx) to align content components with project conventions: no semicolons, no verbose block comments, plain function declarations instead of React.FC. Changed only syntactic style - component behavior and props remain unchanged.
- 2026-02-24T16:35:00+07:00 T14 correction: Reverted 4 unintended behavior changes: (1) removed pb-6 md:pb-0 from MetaphorBlock, (2) restored Unicode quote character \u201C in GiantQuote, (3) removed aria-hidden from StepTimeline background number, (4) removed aria-hidden from PrincipleBlock icon. Style cleanup preserved, original visual behavior restored.
- 2026-02-24T15:30:00Z Boulder state refreshed: active_task pointer set to 15 for T15 execution.
- 2026-02-24T17:00:00+07:00 T15 documentation update: Added /kitchen-sink route as DEV-only (import.meta.env.DEV guard) to AGENTS.md and README.md. Documented optional schema fields (variant, visualHint, author, migration) in docs/content-schema.md and CONTENT_GUIDE.md. Migration renderer policy documented as new -> legacy with unknown-kind safe fallback to legacy text. All docs now consistent with src/content/types.ts and App.tsx routing.
- 2026-02-24T18:00:00Z Boulder state refreshed: active_task pointer set to 16 for T16 execution.
- 2026-02-24T20:05:00+07:00 T16 verification policy: treat production guard as a browser behavior contract (DEV entry hidden on `/`, direct `/kitchen-sink` resolves to `/`, kitchen-sink heading absent) and record both curl probe facts and browser assertions in `.sisyphus/evidence/task-16-prod-demo-restriction.txt`.
- 2026-02-24T12:45:00Z Boulder state refreshed: active_task pointer set to 17 for T17 execution.
- 2026-02-24T10:46:08Z T17 execution policy: keep regression verification deterministic with strict command order (`lint -> test -> build`), require explicit triage statement `no initial failures` when first wave is green, and still persist full green-run command logs.

- 2026-02-24T14:00:00Z Boulder state refreshed: active_task pointer set to F1 for final verification wave.
- 2026-02-24T17:56:37+07:00 F1 decision: mark plan as COMPLIANT based on explicit evidence-path validation (34/34 expected artifacts present), implementation cross-checks for must-have/guardrail items, and full T1-T17 pass rollup in `.sisyphus/evidence/final-qa/f1-plan-compliance.txt`.
- 2026-02-24T15:00:00Z Boulder state refreshed: active_task pointer set to F2 for continued execution.
- 2026-02-24T18:08:21+07:00 F2 decision: keep code untouched and mark final verdict PASS because lint/test/build all pass, anti-pattern indicators are absent, and stale-branch findings are non-blocking metadata/risk notes only.
- 2026-02-24T18:28:32+07:00 F3 decision: keep verdict source-of-truth in f3-replay-results.json and end ledger with strict format line 'Scenarios [N/N] | Integration [PASS/FAIL] | VERDICT' plus command-log references.
- 2026-02-24T12:08:27Z F4 decision: classify only product-path drift (`src/`, `content/`, `docs/`, root docs) as scope-risk; treat `.sisyphus/evidence/*`, `.sisyphus/notepads/*`, and `.sisyphus/boulder.json` as orchestration artifacts when they map to T1-T17/F1-F4 outputs or historical QA traces.
