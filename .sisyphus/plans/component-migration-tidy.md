# Component Migration Tidy Plan

## TL;DR

> **Quick Summary**: Integrate the new content component library into the production JSON-driven Q/A pipeline with a safe phased migration (compatibility -> full migration -> cleanup), while fixing navigation gaps and stale docs.
>
> **Deliverables**:
> - New components usable in real lesson cards via `AnswerSection` pipeline
> - DEV-only entry to `/kitchen-sink` from main page
> - Back navigation from topic page to topics list
> - Updated docs (`AGENTS.md`, `README.md`, content schema docs)
> - Code-style normalization in new content component files
>
> **Estimated Effort**: Large
> **Parallel Execution**: YES - 3 implementation waves + final verification wave
> **Critical Path**: T1 -> T5 -> T7 -> T8 -> T10/T11 -> T13 -> T17 -> F1-F4

---

## Context

### Original Request
Bring the project into order after PR 19 by validating and properly integrating newly added components and demo page into the product workflow, then update navigation and docs.

### Interview Summary

**Key Discussions**:
- `/kitchen-sink` is a dev-demo helper page and should have DEV-only entry from main page.
- New content components are a priority and should replace overlapping legacy presentation blocks where safe.
- Missing navigation from topic lessons list page back to topics list must be fixed.
- Plan generation was deferred until explicit request (now requested).
- Test strategy selected: TDD with mandatory agent-executed QA scenarios.
- CI/Coverage are out of scope for this cycle.

**Research Findings**:
- New components currently live in `src/components/content/*` and are only used by `src/pages/ContentKitchenSink.tsx`.
- Production rendering still relies on `src/content/types.ts`, `src/components/answerRenderers.tsx`, `src/components/AnswerSection.tsx`.
- `/kitchen-sink` route currently exists in `src/App.tsx` with no DEV-only guard.
- `src/pages/TopicPage.tsx` lacks normal-state back link to `/`.
- Existing test infra: Vitest + React Testing Library (`vitest.config.ts`, `src/test/*`) with only smoke coverage.
- Content migration scope is manageable now (2 lesson files, 45 `kind` sections).

### Metis Review

**Identified Gaps (addressed in this plan)**:
- Data contract mismatch risk (new components expect `ReactNode`, content schema provides strings/arrays): handled via adapter layer and compatibility-first migration.
- Scope creep risk from aggressive replacement: locked to phased execution with explicit migration and cleanup gates.
- Verification gaps: added TDD tasks plus mandatory scenario-based agent QA per task.
- Dev-demo exposure risk: route behavior and entry visibility handled explicitly.
- External dependency risk: remove remote demo image usage.

---

## Work Objectives

### Core Objective
Convert the new component library from demo-only into production-ready rendering paths for lesson content without breaking existing lessons, while improving navigation and documentation consistency.

### Concrete Deliverables
- Integration layer mapping lesson JSON sections to new content components.
- Updated `AnswerSection`/renderer flow supporting migrated content kinds and fallback behavior.
- Migrated lesson JSON content to prioritized new visual section kinds.
- DEV-only main-page entry for kitchen-sink and controlled route behavior.
- Topic-page back navigation to topics listing.
- Updated documentation reflecting route/component/schema reality.

### Definition of Done
- [ ] `npm run lint` passes.
- [ ] `npm run test` passes with new migration-related tests.
- [ ] `npm run build` passes.
- [ ] Topic page includes back-to-topics CTA and works.
- [ ] Kitchen-sink entry is visible only in DEV from main page.
- [ ] Migrated lessons render without runtime errors and preserve readability.
- [ ] Docs match current routes, component usage model, and content schema.

### Must Have
- Backward compatibility during migration phase.
- Phased rollout in one cycle: compatibility -> full migration -> cleanup.
- TDD workflow for code-impacting tasks.
- Agent-executed QA scenarios with evidence paths for each task.

### Must NOT Have (Guardrails)
- No new npm dependencies.
- No CI/Coverage setup in this cycle.
- No hard cut-over before compatibility validation.
- No external image dependency in kitchen-sink demo page.
- No manual-only acceptance checks.

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** - ALL verification is agent-executed.

### Test Decision
- **Infrastructure exists**: YES
- **Automated tests**: TDD
- **Framework**: Vitest + React Testing Library
- **If TDD**: Each applicable implementation task uses RED -> GREEN -> REFACTOR flow.

### QA Policy
Every task includes agent-executed QA scenarios and evidence artifacts under `.sisyphus/evidence/`.

- **Frontend/UI**: Playwright skill for route navigation, selector assertions, screenshots.
- **App behavior / route checks**: Bash + curl for response/markup checks in dev/preview.
- **Module/renderer behavior**: `npm run test` focused test files and assertion outputs.
- **Build quality**: lint/test/build command suite.

---

## Execution Strategy

### Parallel Execution Waves

Wave 1 (Foundation + guardrails, start immediately):
- T1 Migration map + compatibility policy scaffold
- T2 Content component module barrel + demo asset strategy
- T3 DEV-only kitchen-sink entry/route behavior
- T4 Topic-page back navigation
- T5 Extend schema/types for new visual kinds with compatibility
- T6 TDD scaffolding (failing tests for renderers + navigation)

Wave 2 (Core migration, after Wave 1):
- T7 Adapter utilities JSON -> component props
- T8 New renderer integration with fallback behavior
- T9 AnswerSection metadata/layout updates for new kinds
- T10 Migrate lesson JSON: `01-noble-basics.json`
- T11 Migrate lesson JSON: `02-qa-craft.json`
- T12 GREEN phase: make tests from T6 pass + expand assertions

Wave 3 (Cleanup + docs + regression, after Wave 2):
- T13 Cleanup overlapping legacy presentation logic
- T14 Normalize code style in `src/components/content/*.tsx`
- T15 Update docs and AGENTS to current behavior/schema
- T16 Scenario QA sweep (routes + migrated content + dev-demo behavior)
- T17 Full command regression and stabilization

Wave FINAL (Independent review, after all implementation tasks):
- F1 Plan compliance audit
- F2 Code quality review
- F3 Real manual QA replay by agent
- F4 Scope fidelity check

Critical Path: T1 -> T5 -> T7 -> T8 -> T10/T11 -> T13 -> T17 -> F1-F4
Parallel Speedup: ~60-70% vs strictly sequential execution
Max Concurrent: 6 tasks

### Dependency Matrix (FULL)

- **T1**: Blocked By: None | Blocks: T5, T7, T8
- **T2**: Blocked By: None | Blocks: T8, T14, T15
- **T3**: Blocked By: None | Blocks: T12, T16
- **T4**: Blocked By: None | Blocks: T12, T16
- **T5**: Blocked By: T1 | Blocks: T7, T8, T10, T11
- **T6**: Blocked By: None | Blocks: T12
- **T7**: Blocked By: T1, T5 | Blocks: T8, T12
- **T8**: Blocked By: T1, T2, T5, T7 | Blocks: T9, T10, T11, T12, T13
- **T9**: Blocked By: T8 | Blocks: T10, T11, T16
- **T10**: Blocked By: T5, T8, T9 | Blocks: T13, T16, T17
- **T11**: Blocked By: T5, T8, T9 | Blocks: T13, T16, T17
- **T12**: Blocked By: T3, T4, T6, T7, T8 | Blocks: T16, T17
- **T13**: Blocked By: T8, T10, T11 | Blocks: T17
- **T14**: Blocked By: T2, T8 | Blocks: T17
- **T15**: Blocked By: T2, T3, T4, T8, T10, T11 | Blocks: T17
- **T16**: Blocked By: T3, T4, T9, T10, T11, T12 | Blocks: T17
- **T17**: Blocked By: T10, T11, T12, T13, T14, T15, T16 | Blocks: F1-F4

### Agent Dispatch Summary

- **Wave 1 (6 tasks)**: T1 `deep`, T2 `quick`, T3 `quick`, T4 `quick`, T5 `deep`, T6 `deep`
- **Wave 2 (6 tasks)**: T7 `deep`, T8 `deep`, T9 `quick`, T10 `quick`, T11 `quick`, T12 `deep`
- **Wave 3 (5 tasks)**: T13 `unspecified-high`, T14 `quick`, T15 `writing`, T16 `unspecified-high`, T17 `unspecified-high`
- **Wave FINAL (4 tasks)**: F1 `deep`, F2 `unspecified-high`, F3 `unspecified-high`, F4 `deep`

---

## TODOs

- [ ] 1. Define migration map and compatibility policy

  **What to do**:
  - Create a single migration map module (for example `src/content/migrationMap.ts`) that maps each existing `AnswerKind` to a target presentation pattern in the new component library.
  - Define fallback policy (`new renderer -> legacy renderer`) so unsupported combinations never break card rendering.
  - Encode deprecation notes for overlapping legacy patterns to control cleanup scope in Wave 3.

  **Must NOT do**:
  - Do not remove any existing `kind` support in this task.
  - Do not directly rewrite lesson JSON in this task.

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Requires careful compatibility design across schema, renderer, and migration phases.
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Helps align migration mapping with existing UX semantics.
  - **Skills Evaluated but Omitted**:
    - `frontend-design`: Not required yet; this task is mapping/architecture, not visual polishing.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with T2, T3, T4, T6)
  - **Blocks**: T5, T7, T8
  - **Blocked By**: None

  **References**:
  - **Pattern References**:
    - `src/content/types.ts` - Canonical list of supported section kinds to map completely.
    - `src/components/answerRenderers.tsx` - Current rendering behavior and fallback points.
    - `src/components/AnswerSection.tsx` - Section metadata, labels, and visual wrappers.
  - **API/Type References**:
    - `src/content/types.ts:1` - `AnswerKind` union that migration map must cover 100%.
    - `src/content/types.ts:32` - `AnswerSectionData` shape that adapters must accept.
  - **Test References**:
    - `src/test/smoke.test.tsx` - Existing Vitest style and assertion patterns.
  - **External References**:
    - `docs/content-schema.md` - Documented meaning of each `kind` and expected data fields.
  - **WHY Each Reference Matters**:
    - These files define the runtime contract and guardrails; missing any leads to unrendered or broken sections.

  **Acceptance Criteria**:
  - [ ] Migration map includes all currently supported `AnswerKind` values.
  - [ ] Fallback behavior is explicitly defined for unmapped/partial cases.
  - [ ] `npm run build` passes after adding the migration map scaffolding.

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Migration map covers all kinds
    Tool: Bash
    Preconditions: Task implementation complete; dev deps installed
    Steps:
      1. Run `node -e "import('./src/content/migrationMap.ts').then(m=>console.log(Object.keys(m.MIGRATION_MAP).length))"`
      2. Run `node -e "import('./src/content/types.ts').then(t=>console.log('types-loaded'))"`
      3. Assert key count is >= count of current kinds and command exits 0
    Expected Result: Map loads and includes full kind coverage
    Failure Indicators: Import error, missing map export, key-count mismatch
    Evidence: .sisyphus/evidence/task-1-migration-map-happy.txt

  Scenario: Unknown kind gracefully falls back
    Tool: Bash
    Preconditions: Fallback function exported (or equivalent utility)
    Steps:
      1. Run utility with a fake kind value in a node one-liner
      2. Assert returned strategy is fallback/legacy-safe (not throw)
    Expected Result: Non-crashing fallback behavior
    Evidence: .sisyphus/evidence/task-1-migration-map-fallback.txt
  ```

  **Commit**: YES (group with T5)
  - Message: `refactor(content): add migration map and compatibility policy`
  - Files: `src/content/migrationMap.ts`, related type-safe helpers
  - Pre-commit: `npm run build`

- [ ] 2. Add content barrel export and remove external demo asset dependency

  **What to do**:
  - Add `src/components/content/index.ts` to expose the content component library through a single import surface.
  - Refactor kitchen-sink imports to use the barrel export.
  - Remove Unsplash dependency in `ContentKitchenSink` and switch to local/inline visual treatment that works offline.

  **Must NOT do**:
  - Do not introduce new image/CDN dependencies.
  - Do not alter semantic content of demo sections.

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Localized module organization and low-risk demo adjustment.
  - **Skills**: [`frontend-design`]
    - `frontend-design`: Ensures replacing external image keeps visual quality.
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Not necessary for this file-organization-heavy task.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with T1, T3, T4, T5, T6)
  - **Blocks**: T8, T14, T15
  - **Blocked By**: None

  **References**:
  - **Pattern References**:
    - `src/pages/ContentKitchenSink.tsx` - Current import style and external URL usage to replace.
    - `src/components/content/Decorative.tsx` - `HeroBanner` background behavior when no image is provided.
  - **API/Type References**:
    - `src/components/content/*.tsx` - Named exports that must be re-exported consistently.
  - **Test References**:
    - `src/test/smoke.test.tsx` - Baseline test pattern for adding route/component smoke assertions later.
  - **External References**:
    - `docs/constraints.md` - Keep project local-first and avoid unnecessary external dependencies.
  - **WHY Each Reference Matters**:
    - Prevents broken imports and avoids network-coupled demo rendering.

  **Acceptance Criteria**:
  - [ ] `src/components/content/index.ts` exists and re-exports all content components.
  - [ ] `src/pages/ContentKitchenSink.tsx` no longer contains external URL.
  - [ ] `npm run build` passes with updated import surface.

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Demo renders without external asset dependency
    Tool: Bash (curl)
    Preconditions: `npm run dev` running
    Steps:
      1. Request `http://127.0.0.1:5173/kitchen-sink`
      2. Save HTML response and search for `images.unsplash.com`
      3. Assert no match is found
    Expected Result: Route renders and no external Unsplash URL present
    Failure Indicators: URL still present or route load failure
    Evidence: .sisyphus/evidence/task-2-demo-no-external-url.txt

  Scenario: Barrel export resolves all imports
    Tool: Bash
    Preconditions: Barrel file created
    Steps:
      1. Run `npm run build`
      2. Assert no unresolved import errors for `src/components/content/index.ts`
    Expected Result: Build succeeds with barrel-based imports
    Evidence: .sisyphus/evidence/task-2-barrel-build.txt
  ```

  **Commit**: YES (group with T14)
  - Message: `refactor(content): add barrel exports and localize demo assets`
  - Files: `src/components/content/index.ts`, `src/pages/ContentKitchenSink.tsx`
  - Pre-commit: `npm run build`

- [ ] 3. Implement DEV-only kitchen-sink entry and guarded route behavior

  **What to do**:
  - Add a DEV-only entry point from main topics page to `/kitchen-sink`.
  - Guard the route in `App.tsx` so production behavior redirects safely (or equivalent non-exposure behavior).
  - Keep the UX explicit as a development helper (clear label).

  **Must NOT do**:
  - Do not expose a persistent production-facing link to demo tools.
  - Do not break existing topic-card layout grid and spacing.

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Narrow routing and entry-point adjustment.
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Ensures entry discoverability in dev without polluting production UX.
  - **Skills Evaluated but Omitted**:
    - `frontend-design`: Visual redesign is not required for this navigation utility.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with T1, T2, T4, T5, T6)
  - **Blocks**: T12, T16
  - **Blocked By**: None

  **References**:
  - **Pattern References**:
    - `src/App.tsx` - Existing route configuration and redirect patterns.
    - `src/pages/TopicsListingPage.tsx` - Main-page structure where DEV entry is added.
  - **API/Type References**:
    - `import.meta.env.DEV` usage pattern in Vite environment checks.
  - **Test References**:
    - `src/test/smoke.test.tsx` - Existing test harness style for adding route visibility checks.
  - **External References**:
    - `AGENTS.md` - Route model that must remain coherent after change.
  - **WHY Each Reference Matters**:
    - Route/entry behavior must be controlled in both dev and prod flows to avoid accidental exposure.

  **Acceptance Criteria**:
  - [ ] DEV entry appears on main page only when `import.meta.env.DEV` is true.
  - [ ] Production route behavior for `/kitchen-sink` is safe (redirect/not exposed).
  - [ ] `npm run build` succeeds with guarded route logic.

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: DEV entry visible and route reachable in development
    Tool: Playwright
    Preconditions: `npm run dev` running
    Steps:
      1. Open `/`
      2. Locate DEV entry selector (e.g., `[data-testid="dev-kitchen-link"]`)
      3. Click entry and verify URL becomes `/kitchen-sink`
      4. Assert page contains heading text `Hero & Decorative`
    Expected Result: DEV helper link works end-to-end
    Failure Indicators: Link missing in dev, broken navigation, incorrect target page
    Evidence: .sisyphus/evidence/task-3-dev-entry-happy.png

  Scenario: Production build hides/guards kitchen-sink
    Tool: Bash (preview + curl)
    Preconditions: `npm run build` completed
    Steps:
      1. Run preview server (`npm run preview -- --port 4173`)
      2. Request `/` and verify no DEV entry marker text exists
      3. Request `/kitchen-sink` and assert redirect or non-200 exposure policy
    Expected Result: No production-visible demo entry and guarded route behavior
    Evidence: .sisyphus/evidence/task-3-prod-guard.txt
  ```

  **Commit**: YES (group with T4)
  - Message: `feat(routing): add dev-only kitchen-sink entry and guard`
  - Files: `src/App.tsx`, `src/pages/TopicsListingPage.tsx`
  - Pre-commit: `npm run build`

- [ ] 4. Add topic-level back navigation to topics list

  **What to do**:
  - Add an explicit CTA/link on `TopicPage` normal state that returns user to `/` (topics listing).
  - Follow existing interaction style used in `LessonPage` back chip/button for consistency.
  - Ensure focus styles and accessible naming are present.

  **Must NOT do**:
  - Do not remove current topic header/lessons structure.
  - Do not create duplicate conflicting navigation controls.

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Isolated UX-navigation fix in one page component.
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Ensures accessible label/focus behavior and consistent CTA placement.
  - **Skills Evaluated but Omitted**:
    - `frontend-design`: No broad visual redesign required.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with T1, T2, T3, T5, T6)
  - **Blocks**: T12, T16
  - **Blocked By**: None

  **References**:
  - **Pattern References**:
    - `src/pages/LessonPage.tsx` - Existing back-button style and semantics (`К урокам`).
    - `src/pages/TopicPage.tsx` - Target page missing back CTA.
  - **API/Type References**:
    - `react-router-dom` `Link` usage pattern in current pages.
  - **Test References**:
    - `src/test/smoke.test.tsx` - Baseline style for adding page-level assertions.
  - **External References**:
    - `docs/ux-patterns.md` - Navigation/focus accessibility expectations.
  - **WHY Each Reference Matters**:
    - Keeps navigation behavior coherent across hierarchy: topics -> lessons -> cards.

  **Acceptance Criteria**:
  - [ ] `TopicPage` includes a visible, keyboard-focusable link/button to `/`.
  - [ ] Back CTA has clear text (e.g., `К темам` / `На главную`) and icon is decorative (`aria-hidden`).
  - [ ] `npm run build` passes.

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Topic page shows working back-to-topics CTA
    Tool: Playwright
    Preconditions: `npm run dev` running
    Steps:
      1. Open `/topic/krasivyi-konspekt`
      2. Locate back CTA selector (e.g., `[data-testid="topic-back-to-topics"]` or text `К темам`)
      3. Click CTA
      4. Assert URL is `/` and topics heading is visible
    Expected Result: User can return to topics list in one action
    Failure Indicators: CTA absent, not focusable, wrong destination
    Evidence: .sisyphus/evidence/task-4-topic-back-happy.png

  Scenario: Invalid topic page still keeps recovery navigation
    Tool: Playwright
    Preconditions: dev server running
    Steps:
      1. Open `/topic/unknown-slug`
      2. Confirm fallback state appears
      3. Click `На главную` recovery link
    Expected Result: Recovery route remains functional after nav changes
    Evidence: .sisyphus/evidence/task-4-topic-back-error.png
  ```

  **Commit**: YES (group with T3)
  - Message: `feat(topic): add back navigation to topics list`
  - Files: `src/pages/TopicPage.tsx`
  - Pre-commit: `npm run build`

- [ ] 5. Extend content section type contract for migration metadata (backward compatible)

  **What to do**:
  - Add optional migration-friendly fields to `AnswerSectionData` (for example visual hint/variant/author) without breaking existing JSON.
  - Keep all current required fields and old kinds valid.
  - Document contract in code comments/types and align with migration map from T1.

  **Must NOT do**:
  - Do not remove or rename existing fields used by current lesson JSON.
  - Do not force immediate JSON migration in this task.

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Type-level contract work influences renderer behavior and migration safety.
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Keeps semantic meaning of section kinds stable while enabling richer visuals.
  - **Skills Evaluated but Omitted**:
    - `frontend-design`: Not required for schema typing work.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with T1, T2, T3, T4, T6)
  - **Blocks**: T7, T8, T10, T11
  - **Blocked By**: T1

  **References**:
  - **Pattern References**:
    - `src/content/types.ts` - Source of truth for section contracts.
    - `content/topics/krasivyi-konspekt/lessons/*.json` - Real data shape that must remain valid.
  - **API/Type References**:
    - `src/components/answerRenderers.tsx` - Consumer of section data fields.
  - **Test References**:
    - `src/test/smoke.test.tsx` - Add targeted type-adjacent rendering tests in same style.
  - **External References**:
    - `docs/content-schema.md`
    - `CONTENT_GUIDE.md`
  - **WHY Each Reference Matters**:
    - Ensures schema evolution remains backward compatible and documented for authors.

  **Acceptance Criteria**:
  - [ ] Existing lesson JSON parses and renders after type updates.
  - [ ] New optional metadata fields are type-safe and non-breaking.
  - [ ] `npm run build` passes with updated types.

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Existing lesson content remains valid
    Tool: Bash
    Preconditions: type changes applied
    Steps:
      1. Run `npm run build`
      2. Assert no TS errors from `content/types.ts` consumers
      3. Start dev server and request two lesson URLs via curl
    Expected Result: No schema-break regressions
    Failure Indicators: TS compile failures or runtime render errors on lesson routes
    Evidence: .sisyphus/evidence/task-5-types-backward-compatible.txt

  Scenario: Optional metadata is safely ignored when absent
    Tool: Bash (node)
    Preconditions: optional fields added
    Steps:
      1. Import parser/loader path in a node check script
      2. Feed section objects without new fields
      3. Assert no exception and defaults applied
    Expected Result: Missing optional fields do not crash pipeline
    Evidence: .sisyphus/evidence/task-5-types-optional-safe.txt
  ```

  **Commit**: YES (group with T1)
  - Message: `feat(types): extend section metadata for migration`
  - Files: `src/content/types.ts`, related schema helpers
  - Pre-commit: `npm run build`

- [ ] 6. TDD scaffolding for migration-critical behavior

  **What to do**:
  - Add failing tests first for:
    - migration map coverage,
    - renderer fallback behavior,
    - DEV-only kitchen-sink visibility,
    - topic-page back navigation availability.
  - Create dedicated test files under `src/test/` for migration (do not overload smoke test).

  **Must NOT do**:
  - Do not make tests pass in this task (RED phase only).
  - Do not write brittle selectors without explicit target attributes/text.

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: RED-phase tests must encode intended behavior before implementation.
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Helps define meaningful UI assertions around nav and visibility.
  - **Skills Evaluated but Omitted**:
    - `frontend-design`: Not relevant for test scaffolding.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with T1, T2, T3, T4, T5)
  - **Blocks**: T12
  - **Blocked By**: None

  **References**:
  - **Pattern References**:
    - `src/test/smoke.test.tsx` - Existing Vitest/RTL project baseline.
    - `vitest.config.ts` - Test environment and setup configuration.
  - **API/Type References**:
    - `package.json:scripts.test` - Canonical test command (`vitest run`).
  - **Test References**:
    - `src/pages/TopicPage.tsx`, `src/pages/TopicsListingPage.tsx`, `src/App.tsx` - nav/route behavior under test.
  - **External References**:
    - `docs/ux-patterns.md` - expected navigation semantics.
  - **WHY Each Reference Matters**:
    - RED phase sets non-negotiable behavior contract before renderer and route changes.

  **Acceptance Criteria**:
  - [ ] New migration test files exist and run.
  - [ ] `npm run test` shows expected failing assertions tied to not-yet-implemented behavior.
  - [ ] Failure output clearly indicates missing behavior targets.

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: RED phase is correctly established
    Tool: Bash
    Preconditions: New tests written, implementation not yet done
    Steps:
      1. Run `npm run test`
      2. Confirm failures occur in newly added migration test files
      3. Confirm failure messages map to planned behavior
    Expected Result: Controlled red-state failures
    Failure Indicators: All tests pass prematurely or unrelated random failures
    Evidence: .sisyphus/evidence/task-6-red-phase.txt

  Scenario: Existing smoke tests remain executable
    Tool: Bash
    Preconditions: RED tests added
    Steps:
      1. Run `npm run test -- src/test/smoke.test.tsx`
      2. Assert smoke suite still passes
    Expected Result: New RED tests do not destabilize baseline harness
    Evidence: .sisyphus/evidence/task-6-smoke-still-pass.txt
  ```

  **Commit**: YES (group with T12)
  - Message: `test(migration): add red-phase tests for renderer and nav`
  - Files: `src/test/*migration*.test.tsx`
  - Pre-commit: `npm run test`

- [ ] 7. Implement adapter utilities from JSON section data to content component props

  **What to do**:
  - Build adapter functions converting `AnswerSectionData` primitives (`body`, `items`, `pairs`, `columns`, `table`) into props consumable by new content components.
  - Centralize default/fallback transformations (empty arrays, missing titles, safe text fallbacks).
  - Ensure adapter API is deterministic and testable in isolation.

  **Must NOT do**:
  - Do not render JSX directly inside migration map logic; keep mapping and rendering concerns separated.
  - Do not bypass type checks with unsafe casts.

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Core compatibility bridge between schema and component library.
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Maintains semantic integrity while adapting display props.
  - **Skills Evaluated but Omitted**:
    - `frontend-design`: Adapter correctness is primary; visual refinements come later.

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (sequential foundation before T8)
  - **Blocks**: T8, T12
  - **Blocked By**: T1, T5

  **References**:
  - **Pattern References**:
    - `src/components/answerRenderers.tsx` - Existing per-kind render pathways.
    - `src/components/content/*.tsx` - Target component prop contracts.
  - **API/Type References**:
    - `src/content/types.ts` - Source schema to adapt from.
    - `src/content/migrationMap.ts` (from T1) - kind-level strategy selection.
  - **Test References**:
    - `src/test/*migration*.test.tsx` (from T6) - failing adapter coverage tests.
  - **External References**:
    - `docs/content-schema.md` - Valid field combinations by kind.
  - **WHY Each Reference Matters**:
    - Adapter must guarantee predictable transformations for every content authoring pattern.

  **Acceptance Criteria**:
  - [ ] Adapter module exports typed conversion functions used by renderer integration.
  - [ ] Empty/partial section data returns safe defaults (no runtime throw).
  - [ ] RED adapter tests from T6 move to GREEN for adapter-specific cases.

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Adapter converts all major section shapes
    Tool: Bash
    Preconditions: Adapter implemented; tests present
    Steps:
      1. Run `npm run test -- src/test/migration-adapter.test.tsx`
      2. Assert cases for body/items/pairs/columns/table all pass
      3. Capture test output
    Expected Result: Adapter handles all supported section shapes
    Failure Indicators: Type mismatch errors, undefined property crashes, failing conversion assertions
    Evidence: .sisyphus/evidence/task-7-adapter-green.txt

  Scenario: Invalid or sparse input fails gracefully
    Tool: Bash
    Preconditions: Negative test cases added
    Steps:
      1. Execute tests for sparse/invalid payloads
      2. Assert fallback output rather than thrown exception
    Expected Result: Graceful fallback behavior
    Evidence: .sisyphus/evidence/task-7-adapter-fallback.txt
  ```

  **Commit**: YES (group with T8)
  - Message: `feat(renderer): add section-data adapter utilities`
  - Files: `src/components/*adapter*`, related helpers
  - Pre-commit: `npm run test -- src/test/migration-adapter.test.tsx`

- [ ] 8. Integrate new content components into answer rendering pipeline with fallback

  **What to do**:
  - Wire adapter output into `answerRenderers` so prioritized section kinds use new component primitives.
  - Preserve fallback to legacy renderers where mapping is incomplete or unsafe.
  - Keep output semantics and accessibility intact (headings, lists, term/definition structures).

  **Must NOT do**:
  - Do not remove legacy renderer code before content migration and stabilization.
  - Do not change route/page-level behavior in this task.

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: High-impact core integration in the app's most used rendering path.
  - **Skills**: [`frontend-ui-ux`, `frontend-design`]
    - `frontend-ui-ux`: Preserve semantics and readability.
    - `frontend-design`: Keep visual quality while swapping renderer primitives.
  - **Skills Evaluated but Omitted**:
    - `playwright`: Not needed for implementation task; used in QA tasks.

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (runs after T7)
  - **Blocks**: T9, T10, T11, T12, T13
  - **Blocked By**: T1, T2, T5, T7

  **References**:
  - **Pattern References**:
    - `src/components/answerRenderers.tsx` - Existing rendering branches per kind.
    - `src/components/AnswerSection.tsx` - Wrapper card style and section heading treatment.
    - `src/components/content/*.tsx` - New components to adopt.
  - **API/Type References**:
    - `src/content/types.ts` and migration metadata from T5.
  - **Test References**:
    - `src/test/migration-renderers.test.tsx` and adapter tests from T6/T7.
  - **External References**:
    - `CONTENT_GUIDE.md` kind usage guidance.
  - **WHY Each Reference Matters**:
    - Integration must preserve content meaning while upgrading visuals.

  **Acceptance Criteria**:
  - [ ] Prioritized kinds render through new content component pathways.
  - [ ] Fallback behavior still renders unmigrated or edge data safely.
  - [ ] Renderer GREEN tests pass for mapped and fallback cases.

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Migrated renderer path displays expected structures
    Tool: Playwright
    Preconditions: Dev server running; renderer integration complete
    Steps:
      1. Open `/topic/krasivyi-konspekt/lesson/noble-basics`
      2. Expand first three Q/A cards
      3. Assert presence of selectors for upgraded structures (e.g., glossary `dl`, callout block class, timeline list)
      4. Capture screenshot
    Expected Result: Upgraded visual components render inside real lesson cards
    Failure Indicators: Missing structures, broken layout, empty answer blocks
    Evidence: .sisyphus/evidence/task-8-renderer-upgrade.png

  Scenario: Unmapped/legacy section still renders
    Tool: Playwright
    Preconditions: At least one legacy fallback case retained
    Steps:
      1. Open lesson card containing fallback kind
      2. Expand card and verify content visible and readable
      3. Ensure no runtime overlay/errors in console capture
    Expected Result: Fallback rendering works without blank content
    Evidence: .sisyphus/evidence/task-8-renderer-fallback.png
  ```

  **Commit**: YES (group with T7)
  - Message: `feat(renderer): route section kinds through new content components`
  - Files: `src/components/answerRenderers.tsx`, adapter integration files
  - Pre-commit: `npm run test -- src/test/migration-renderers.test.tsx`

- [ ] 9. Update AnswerSection metadata and visual wrappers for new/fallback paths

  **What to do**:
  - Refresh section metadata map (labels/icons/card classes) to align with migrated rendering strategy.
  - Ensure deprecation labeling is clear for legacy-only paths.
  - Keep wrappers lightweight so component-specific visuals are not double-styled.

  **Must NOT do**:
  - Do not add icon or label noise that reduces readability.
  - Do not duplicate styling already handled inside new content components.

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Focused metadata and wrapper tuning.
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Keeps section hierarchy understandable in mixed migration state.
  - **Skills Evaluated but Omitted**:
    - `frontend-design`: Major visual work is not needed here.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (parallel with T10/T11 after T8)
  - **Blocks**: T10, T11, T16
  - **Blocked By**: T8

  **References**:
  - **Pattern References**:
    - `src/components/AnswerSection.tsx` - section metadata map and wrapper behavior.
    - `src/components/QACard.tsx` - card container structure and section nesting.
  - **API/Type References**:
    - `src/content/types.ts` - kinds and optional metadata fields.
  - **Test References**:
    - `src/test/migration-renderers.test.tsx` - assertions that labels/wrappers remain stable.
  - **External References**:
    - `docs/ux-patterns.md` - readability and touch-target guidance.
  - **WHY Each Reference Matters**:
    - Prevents style collisions and preserves card scannability.

  **Acceptance Criteria**:
  - [ ] Section labels/icons stay meaningful for migrated and fallback paths.
  - [ ] No duplicated borders/background layers from wrapper + inner components.
  - [ ] `npm run build` passes.

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Section metadata remains readable after migration
    Tool: Playwright
    Preconditions: T8 completed
    Steps:
      1. Open both lesson pages
      2. Expand multiple cards
      3. Verify section headers/labels are visible and not visually conflicting
    Expected Result: Clean hierarchy and readable metadata
    Failure Indicators: Duplicate wrappers, cramped labels, missing icons
    Evidence: .sisyphus/evidence/task-9-section-meta-happy.png

  Scenario: Legacy fallback section still has valid metadata
    Tool: Playwright
    Preconditions: At least one fallback section exists
    Steps:
      1. Open fallback card
      2. Verify metadata label/icon appears and content displays
    Expected Result: Fallback sections keep clear metadata context
    Evidence: .sisyphus/evidence/task-9-section-meta-fallback.png
  ```

  **Commit**: YES (group with T8)
  - Message: `refactor(answer-section): align metadata with migrated renderer paths`
  - Files: `src/components/AnswerSection.tsx`
  - Pre-commit: `npm run build`

- [ ] 10. Migrate lesson content file `01-noble-basics.json` to migrated rendering strategy

  **What to do**:
  - Update section structures in `content/topics/krasivyi-konspekt/lessons/01-noble-basics.json` where deterministic mapping is clear.
  - Apply new optional metadata fields introduced in T5 only where they improve rendering quality.
  - Keep textual meaning and pedagogical flow unchanged.

  **Must NOT do**:
  - Do not rewrite lesson meaning, tone, or learning outcomes.
  - Do not introduce schema fields not defined in types/docs.

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single-content-file structured migration.
  - **Skills**: [`writing`, `frontend-ui-ux`]
    - `writing`: Maintains instructional clarity while restructuring sections.
    - `frontend-ui-ux`: Keeps content compatible with visual rendering semantics.
  - **Skills Evaluated but Omitted**:
    - `frontend-design`: Content migration is semantic/structural, not design-system creation.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (parallel with T9, T11, T12 after T8)
  - **Blocks**: T13, T16, T17
  - **Blocked By**: T5, T8, T9

  **References**:
  - **Pattern References**:
    - `content/topics/krasivyi-konspekt/lessons/01-noble-basics.json` - target file.
    - `content/topics/krasivyi-konspekt/lessons/02-qa-craft.json` - consistency reference.
  - **API/Type References**:
    - `src/content/types.ts` - legal schema fields/kinds.
  - **Test References**:
    - `src/test/migration-renderers.test.tsx` - expected rendering behaviors.
  - **External References**:
    - `CONTENT_GUIDE.md` - authoring constraints and style rules.
  - **WHY Each Reference Matters**:
    - Maintains schema validity and consistent learning-content quality.

  **Acceptance Criteria**:
  - [ ] JSON remains valid and parseable.
  - [ ] Lesson renders fully with no blank sections.
  - [ ] Content semantics (question intent + answer meaning) remain unchanged.

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Migrated lesson 01 renders all cards
    Tool: Playwright
    Preconditions: Dev server running; migration applied
    Steps:
      1. Open `/topic/krasivyi-konspekt/lesson/noble-basics`
      2. Expand every Q/A card sequentially
      3. Assert each card shows at least one non-empty answer section
    Expected Result: Full lesson remains readable and complete
    Failure Indicators: Collapsed empty sections, runtime crash, malformed content
    Evidence: .sisyphus/evidence/task-10-lesson01-migrated.png

  Scenario: JSON validity check fails gracefully if malformed
    Tool: Bash
    Preconditions: Migration complete
    Steps:
      1. Run `npm run build`
      2. Assert build succeeds; if parse errors appear, capture and fix
    Expected Result: No JSON parse/type errors
    Evidence: .sisyphus/evidence/task-10-lesson01-build-check.txt
  ```

  **Commit**: YES (group with T11)
  - Message: `refactor(content): migrate lesson 01 to new rendering model`
  - Files: `content/topics/krasivyi-konspekt/lessons/01-noble-basics.json`
  - Pre-commit: `npm run build`

- [ ] 11. Migrate lesson content file `02-qa-craft.json` to migrated rendering strategy

  **What to do**:
  - Apply same migration policy to `content/topics/krasivyi-konspekt/lessons/02-qa-craft.json`.
  - Keep structural consistency with lesson 01 after migration.
  - Verify no unsupported combinations remain in section data.

  **Must NOT do**:
  - Do not diverge style/metadata conventions from lesson 01 migration.
  - Do not remove pedagogically important caution/edge-case sections.

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single-file content migration with known pattern.
  - **Skills**: [`writing`, `frontend-ui-ux`]
    - `writing`: Preserves clarity and educational tone.
    - `frontend-ui-ux`: Ensures migrated structures still map to usable visual patterns.
  - **Skills Evaluated but Omitted**:
    - `frontend-design`: Not required for content semantics conversion.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (parallel with T9, T10, T12 after T8)
  - **Blocks**: T13, T16, T17
  - **Blocked By**: T5, T8, T9

  **References**:
  - **Pattern References**:
    - `content/topics/krasivyi-konspekt/lessons/02-qa-craft.json` - target file.
    - `content/topics/krasivyi-konspekt/lessons/01-noble-basics.json` - migrated pattern baseline.
  - **API/Type References**:
    - `src/content/types.ts` - allowed data model.
  - **Test References**:
    - `src/test/migration-renderers.test.tsx`
  - **External References**:
    - `docs/content-schema.md`
    - `CONTENT_GUIDE.md`
  - **WHY Each Reference Matters**:
    - Keeps both lessons aligned and reduces drift in authoring standards.

  **Acceptance Criteria**:
  - [ ] JSON remains valid and schema-compatible.
  - [ ] Lesson 02 renders all cards and sections correctly.
  - [ ] Migration conventions match lesson 01 approach.

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Migrated lesson 02 renders all cards
    Tool: Playwright
    Preconditions: Dev server running; migration applied
    Steps:
      1. Open `/topic/krasivyi-konspekt/lesson/qa-craft`
      2. Expand every Q/A card
      3. Assert each card shows visible answer content
    Expected Result: No missing sections after migration
    Failure Indicators: Empty cards, visual overflow, render exceptions
    Evidence: .sisyphus/evidence/task-11-lesson02-migrated.png

  Scenario: Schema mismatch detection
    Tool: Bash
    Preconditions: Migration complete
    Steps:
      1. Run `npm run build`
      2. Check output for JSON/type-related failures
    Expected Result: Build succeeds with no schema mismatch errors
    Evidence: .sisyphus/evidence/task-11-lesson02-build-check.txt
  ```

  **Commit**: YES (group with T10)
  - Message: `refactor(content): migrate lesson 02 to new rendering model`
  - Files: `content/topics/krasivyi-konspekt/lessons/02-qa-craft.json`
  - Pre-commit: `npm run build`

- [ ] 12. Complete TDD GREEN/REFACTOR for renderer and navigation behavior

  **What to do**:
  - Turn RED tests from T6 into GREEN by implementing/asserting final behavior from T3/T4/T7/T8.
  - Add regression assertions for mixed migrated/fallback section rendering.
  - Refactor tests to reduce duplication and improve failure readability.

  **Must NOT do**:
  - Do not remove meaningful assertions just to make suite pass.
  - Do not leave flaky tests tied to unstable selectors.

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Multi-feature behavior verification with regression sensitivity.
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Helps encode user-visible behavior assertions accurately.
  - **Skills Evaluated but Omitted**:
    - `frontend-design`: Test quality is primary; no design output required.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (after prerequisite tasks; can overlap with T10/T11)
  - **Blocks**: T16, T17
  - **Blocked By**: T3, T4, T6, T7, T8

  **References**:
  - **Pattern References**:
    - `src/test/smoke.test.tsx` - baseline test style.
    - New migration test files from T6.
  - **API/Type References**:
    - `src/App.tsx`, `src/pages/TopicsListingPage.tsx`, `src/pages/TopicPage.tsx`, `src/components/answerRenderers.tsx`.
  - **Test References**:
    - `vitest.config.ts`, `src/test/setup.ts`.
  - **External References**:
    - `package.json:scripts.test`.
  - **WHY Each Reference Matters**:
    - Confirms route visibility, navigation, and renderer behavior at unit/integration level.

  **Acceptance Criteria**:
  - [ ] RED tests from T6 now pass.
  - [ ] Mixed migrated/fallback renderer cases are covered.
  - [ ] `npm run test` passes cleanly.

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Full migration-related test suite passes
    Tool: Bash
    Preconditions: T3/T4/T7/T8 implemented
    Steps:
      1. Run `npm run test`
      2. Verify migration test files report PASS
      3. Save full output log
    Expected Result: Green suite with migration coverage
    Failure Indicators: Failing nav visibility assertions, fallback mismatches, adapter regressions
    Evidence: .sisyphus/evidence/task-12-tests-green.txt

  Scenario: Prevent false-green by checking assertion count
    Tool: Bash
    Preconditions: Test suite green
    Steps:
      1. Inspect test output for skipped/todo tests
      2. Assert no critical migration tests are skipped
    Expected Result: Meaningful green state (not skipped coverage)
    Evidence: .sisyphus/evidence/task-12-no-skipped-critical.txt
  ```

  **Commit**: YES (group with T6)
  - Message: `test(migration): complete green/refactor phase`
  - Files: `src/test/*migration*.test.tsx`
  - Pre-commit: `npm run test`

- [ ] 13. Cleanup overlapping legacy presentation logic after successful migration

  **What to do**:
  - Remove or simplify redundant legacy rendering branches now superseded by new component-backed paths.
  - Retain canonical behavior for kinds intentionally not migrated.
  - Ensure fallback remains for protected edge cases only, not as duplicate primary path.

  **Must NOT do**:
  - Do not remove fallback handling required by real lesson content.
  - Do not perform broad unrelated refactors in renderer files.

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Requires nuanced pruning without breaking content stability.
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Maintains readability/semantics while reducing code complexity.
  - **Skills Evaluated but Omitted**:
    - `frontend-design`: Not primary; focus is logic cleanup.

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (sequential after T10/T11)
  - **Blocks**: T17
  - **Blocked By**: T8, T10, T11

  **References**:
  - **Pattern References**:
    - `src/components/answerRenderers.tsx` - legacy and new branch coexistence.
    - `src/components/AnswerSection.tsx` - wrapper dependencies on renderer outputs.
  - **API/Type References**:
    - `src/content/migrationMap.ts` and `src/content/types.ts`.
  - **Test References**:
    - `src/test/migration-renderers.test.tsx` - guard against cleanup regressions.
  - **External References**:
    - `docs/content-schema.md` - must remain truthful after cleanup.
  - **WHY Each Reference Matters**:
    - Cleanup should reduce duplication but keep guaranteed section support intact.

  **Acceptance Criteria**:
  - [ ] Redundant legacy branches removed/simplified where superseded.
  - [ ] Remaining fallback branches are intentional and documented.
  - [ ] `npm run test` and `npm run build` still pass.

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Renderer cleanup does not regress migrated views
    Tool: Playwright
    Preconditions: Cleanup complete
    Steps:
      1. Open both lesson pages
      2. Expand first, middle, and last cards
      3. Verify content renders and styling remains coherent
    Expected Result: No visible regressions after branch cleanup
    Failure Indicators: Missing sections, raw JSON artifacts, broken wrappers
    Evidence: .sisyphus/evidence/task-13-cleanup-happy.png

  Scenario: Fallback-only cases still render
    Tool: Bash + Playwright
    Preconditions: At least one fallback path retained
    Steps:
      1. Run targeted test for fallback path
      2. Verify fallback card visually in browser
    Expected Result: Cleanup did not remove required fallback behavior
    Evidence: .sisyphus/evidence/task-13-cleanup-fallback.txt
  ```

  **Commit**: YES
  - Message: `refactor(renderer): remove redundant legacy presentation branches`
  - Files: `src/components/answerRenderers.tsx`, related helpers
  - Pre-commit: `npm run test`

- [ ] 14. Normalize code style in new content component files

  **What to do**:
  - Align `src/components/content/*.tsx` with project style conventions (semicolon usage, spacing, idiomatic component syntax).
  - Remove verbose/non-essential comments where behavior is obvious.
  - Keep behavior and props unchanged while normalizing style.

  **Must NOT do**:
  - Do not alter component behavior while doing style-only cleanup.
  - Do not perform style cleanup outside scoped content component files.

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Mechanical normalization with localized file scope.
  - **Skills**: [`frontend-design`]
    - `frontend-design`: Helps preserve intent of visual component code while cleaning syntax noise.
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Not essential for style-only normalization.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (parallel with T15/T16)
  - **Blocks**: T17
  - **Blocked By**: T2, T8

  **References**:
  - **Pattern References**:
    - `src/components/QACard.tsx` - in-repo formatting and style conventions.
    - `src/components/TopicCard.tsx` - modern project coding style baseline.
  - **API/Type References**:
    - `src/components/content/*.tsx` - scope of normalization.
  - **Test References**:
    - `npm run lint` output - objective style compliance gate.
  - **External References**:
    - `AGENTS.md` coding expectations.
  - **WHY Each Reference Matters**:
    - Keeps newly added files coherent with the rest of the codebase.

  **Acceptance Criteria**:
  - [ ] Content component files follow project formatting conventions.
  - [ ] No behavior changes introduced by style normalization.
  - [ ] `npm run lint` passes.

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Style normalization is behavior-neutral
    Tool: Bash
    Preconditions: Style cleanup complete
    Steps:
      1. Run `npm run lint`
      2. Run `npm run test -- src/test/migration-renderers.test.tsx`
      3. Run `npm run build`
    Expected Result: All checks pass; no functional regression from style changes
    Failure Indicators: New lint errors or failing behavior tests
    Evidence: .sisyphus/evidence/task-14-style-normalization.txt

  Scenario: Scope guard for style cleanup
    Tool: Bash
    Preconditions: Git diff available
    Steps:
      1. Inspect changed files list
      2. Assert style-only task touched only `src/components/content/*.tsx` (plus inevitable import updates)
    Expected Result: No unrelated style churn
    Evidence: .sisyphus/evidence/task-14-style-scope.txt
  ```

  **Commit**: YES
  - Message: `style(content): normalize component file conventions`
  - Files: `src/components/content/*.tsx`
  - Pre-commit: `npm run lint`

- [ ] 15. Update AGENTS and docs to match migrated behavior

  **What to do**:
  - Update `AGENTS.md` route and workflow notes to include dev-demo access policy.
  - Update `README.md` route/docs section to reflect current behavior and migration outcomes.
  - Update `docs/content-schema.md` and `CONTENT_GUIDE.md` with final supported schema and migration guidance.

  **Must NOT do**:
  - Do not document features not implemented in this cycle.
  - Do not leave conflicting definitions across docs.

  **Recommended Agent Profile**:
  - **Category**: `writing`
    - Reason: Documentation coherence and technical accuracy task.
  - **Skills**: [`writing`]
    - `writing`: Ensures concise, consistent, and accurate technical docs.
  - **Skills Evaluated but Omitted**:
    - `frontend-design`: Not relevant for documentation editing.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (parallel with T14/T16)
  - **Blocks**: T17
  - **Blocked By**: T2, T3, T4, T8, T10, T11

  **References**:
  - **Pattern References**:
    - `AGENTS.md`
    - `README.md`
    - `docs/content-schema.md`
    - `CONTENT_GUIDE.md`
  - **API/Type References**:
    - `src/content/types.ts` - schema source of truth for doc alignment.
    - `src/App.tsx` and `src/pages/TopicsListingPage.tsx` - route/access behavior source.
  - **Test References**:
    - `npm run build` and route QA evidence from T16 for factual validation.
  - **External References**:
    - None (project-local docs only).
  - **WHY Each Reference Matters**:
    - Prevents stale onboarding guidance and schema drift.

  **Acceptance Criteria**:
  - [ ] Docs explicitly state DEV-only kitchen-sink entry policy.
  - [ ] Docs align with actual route list and section schema.
  - [ ] No contradictory instructions remain between AGENTS/README/content docs.

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Documentation matches implemented behavior
    Tool: Bash
    Preconditions: Docs updated; implementation complete
    Steps:
      1. Grep docs for `/kitchen-sink`, route list, and schema kinds
      2. Cross-check with `src/App.tsx` and `src/content/types.ts`
      3. Verify no mismatched statements
    Expected Result: Docs and implementation are consistent
    Failure Indicators: Mentioned route/schema not present in code, or missing implemented features in docs
    Evidence: .sisyphus/evidence/task-15-docs-consistency.txt

  Scenario: Broken references check
    Tool: Bash
    Preconditions: Docs updated
    Steps:
      1. Validate that referenced doc paths exist (AGENTS links, README pointers)
      2. Confirm no stale/dead relative links
    Expected Result: All key references resolve
    Evidence: .sisyphus/evidence/task-15-doc-links.txt
  ```

  **Commit**: YES
  - Message: `docs(project): align AGENTS and content docs with migration`
  - Files: `AGENTS.md`, `README.md`, `docs/content-schema.md`, `CONTENT_GUIDE.md`
  - Pre-commit: `npm run build`

- [ ] 16. Run scenario QA sweep for routes, cards, and dev/prod demo behavior

  **What to do**:
  - Execute end-to-end scenario checks covering:
    - main topics page,
    - topic page back navigation,
    - both lesson pages and expanded cards,
    - kitchen-sink behavior in dev and preview/prod modes.
  - Capture evidence artifacts for each scenario in `.sisyphus/evidence/`.

  **Must NOT do**:
  - Do not mark task complete without evidence artifacts.
  - Do not skip negative/error scenarios.

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Broad cross-feature verification with deterministic evidence capture.
  - **Skills**: [`playwright`]
    - `playwright`: Required for reliable browser-level interaction assertions.
  - **Skills Evaluated but Omitted**:
    - `frontend-design`: Not needed for QA execution.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (parallel with T14/T15)
  - **Blocks**: T17
  - **Blocked By**: T3, T4, T9, T10, T11, T12

  **References**:
  - **Pattern References**:
    - `src/App.tsx` - route map including kitchen-sink.
    - `src/pages/TopicsListingPage.tsx`, `src/pages/TopicPage.tsx`, `src/pages/LessonPage.tsx` - primary UX flows.
  - **API/Type References**:
    - `content/topics/krasivyi-konspekt/lessons/*.json` - lesson content that must render.
  - **Test References**:
    - Migration tests from T12 as precondition signals.
  - **External References**:
    - `docs/dev-setup.md` - environment notes for UI verification.
  - **WHY Each Reference Matters**:
    - Ensures planned behavior is validated in real navigation paths.

  **Acceptance Criteria**:
  - [ ] Happy-path and failure-path UI scenarios executed with evidence.
  - [ ] Dev/prod kitchen-sink behavior validated against requirements.
  - [ ] No blocker regressions remain for command regression wave.

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Full happy-path navigation flow
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Open `/`
      2. Navigate to `/topic/krasivyi-konspekt`
      3. Use new back CTA to return to `/`
      4. Navigate to both lessons and expand at least 3 cards each
      5. In DEV, use kitchen-sink entry and verify `/kitchen-sink` renders
    Expected Result: All primary flows work and content is visible
    Failure Indicators: Broken links, missing card content, inaccessible demo entry in dev
    Evidence: .sisyphus/evidence/task-16-happy-flow.png

  Scenario: Production-mode demo restriction
    Tool: Bash + Playwright
    Preconditions: `npm run build` and `npm run preview -- --port 4173`
    Steps:
      1. Open `/` in preview mode and assert no DEV-only entry
      2. Open `/kitchen-sink` and assert guarded behavior (redirect/non-exposure)
    Expected Result: Demo entry hidden and route guarded outside dev
    Evidence: .sisyphus/evidence/task-16-prod-demo-restriction.txt
  ```

  **Commit**: NO
  - Message: n/a
  - Files: n/a (evidence only)
  - Pre-commit: n/a

- [ ] 17. Execute full regression command wave and stabilize blockers

  **What to do**:
  - Run `npm run lint`, `npm run test`, `npm run build` in sequence.
  - Resolve any regressions introduced by migration/style/docs tasks.
  - Re-run until all checks pass cleanly.

  **Must NOT do**:
  - Do not suppress failures with unsafe bypasses.
  - Do not leave flaky tests unresolved.

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Multi-signal stabilization and release-readiness verification.
  - **Skills**: []
    - None required beyond standard project commands.
  - **Skills Evaluated but Omitted**:
    - `playwright`: UI verification already handled in T16.

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 terminal task
  - **Blocks**: F1, F2, F3, F4
  - **Blocked By**: T10, T11, T12, T13, T14, T15, T16

  **References**:
  - **Pattern References**:
    - `package.json:scripts` - canonical command set.
  - **API/Type References**:
    - Full repo impacted by previous tasks.
  - **Test References**:
    - `src/test/*` including migration suites.
  - **External References**:
    - None.
  - **WHY Each Reference Matters**:
    - Final gate for technical readiness before review wave.

  **Acceptance Criteria**:
  - [ ] `npm run lint` PASS.
  - [ ] `npm run test` PASS.
  - [ ] `npm run build` PASS.
  - [ ] Evidence logs for all three commands captured.

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Regression command suite all green
    Tool: Bash
    Preconditions: All implementation tasks complete
    Steps:
      1. Run `npm run lint`
      2. Run `npm run test`
      3. Run `npm run build`
      4. Save outputs for each command
    Expected Result: Three green commands without workaround flags
    Failure Indicators: Any command fails or requires bypass
    Evidence: .sisyphus/evidence/task-17-regression-green.txt

  Scenario: Failure triage loop captured
    Tool: Bash
    Preconditions: At least one initial failure encountered (if any)
    Steps:
      1. Capture failing command output
      2. Apply fix
      3. Re-run failing command and record resolution
    Expected Result: Clear failure-to-fix traceability
    Evidence: .sisyphus/evidence/task-17-regression-triage.txt
  ```

  **Commit**: YES
  - Message: `chore(qa): stabilize lint test build after migration`
  - Files: all regression-driven fixes
  - Pre-commit: `npm run lint && npm run test && npm run build`

---

## Final Verification Wave (MANDATORY - after ALL implementation tasks)

- [ ] F1. **Plan Compliance Audit** - `deep`
  Verify all must-haves/must-not-haves against resulting implementation and evidence artifacts.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT`

- [ ] F2. **Code Quality Review** - `unspecified-high`
  Run lint/type/test/build checks and inspect for anti-patterns (dead code, unsafe casts, stale branches).
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Tests [PASS/FAIL] | VERDICT`

- [ ] F3. **Real QA Replay** - `unspecified-high` (+ `playwright` for UI)
  Replay all task QA scenarios end-to-end with evidence snapshots under `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N] | Integration [PASS/FAIL] | VERDICT`

- [ ] F4. **Scope Fidelity Check** - `deep`
  Compare final diff vs plan scope and ensure no scope creep/no missing required items.
  Output: `Scope [COMPLIANT/NON-COMPLIANT] | Unaccounted Files [N] | VERDICT`

---

## Commit Strategy

- **Commit Group 1 (Wave 1 foundations)**: route/nav/schema/test scaffolding setup
- **Commit Group 2 (Wave 2 migration core)**: adapter/renderer integration + lesson migrations
- **Commit Group 3 (Wave 3 cleanup/docs)**: legacy cleanup + style normalization + docs alignment
- **Commit Group 4 (final stabilization)**: regression fixes from lint/test/build and QA findings

Message style: `type(scope): description`.

---

## Success Criteria

### Verification Commands

```bash
npm run lint
npm run test
npm run build
```

### Final Checklist

- [ ] DEV-only kitchen-sink entry exists on main page and is hidden in production.
- [ ] Topic page has working back navigation to topics list.
- [ ] New content components are used by production answer rendering path.
- [ ] Lesson JSON migration completed for both current lesson files.
- [ ] Legacy overlap cleaned without breaking canonical kinds.
- [ ] Docs and AGENTS reflect current routes/schema/component usage.
- [ ] No external image dependency remains in kitchen-sink demo.
