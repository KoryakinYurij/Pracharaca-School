# Noble Notes Design + Motion Polish (Quick + Motion)

## TL;DR

> **Quick Summary**: Apply one focused polish pass for UI and motion quality across cards, lesson header, scroll reveal, and background motion while staying inside the existing Noble design language.
>
> **Deliverables**:
> - Refined `QACard`, `TopicCard`, `LessonCard`, and `LessonPage` visual interactions
> - Scroll-driven reveal for lesson cards and tuned Three.js ambient motion
> - Minimal Vitest setup + post-implementation automated tests
>
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 2 implementation waves + Final Verification wave
> **Critical Path**: 1 -> 2 -> 7 -> 10 -> 11 -> F1/F2/F3/F4

---

## Context

### Original Request
User asked to validate and plan design/animation improvements for Noble Notes and explicitly asked whether this should be split into multiple plans.

### Interview Summary
**Key Decisions**:
- Use **one plan only** (no split plans), executed in internal waves.
- Scope package chosen by user: **Quick + Motion**.
- Include: microinteractions, card hover polish, lesson header/back navigation refinement, typography rhythm tuning, scroll-driven reveal, background motion tuning.
- Exclude for now: dark mode and explicit progress indicators.
- Test strategy: **Vitest + tests-after** (not strict TDD).

**Repository Reality Check**:
- Route transitions already exist in `src/App.tsx` + `src/components/PageTransition.tsx`.
- Background is already animated in `src/components/BackgroundShapes.tsx`; work is tuning, not greenfield animation.
- Existing constraints in `docs/constraints.md` and `docs/design-system.md` must stay enforced.

### Metis Review
**Gaps addressed in this plan**:
- Locked down scope to avoid redesign creep.
- Added explicit guardrails for motion/perf/dependency boundaries.
- Added concrete executable QA scenarios per task (happy + negative).
- Added reduced-motion and touch-device checks as mandatory verification.

---

## Work Objectives

### Core Objective
Increase perceived polish and responsiveness of the current UI/motion system without changing product scope, data model, or visual identity foundations.

### Concrete Deliverables
- Updated interaction behavior in `src/components/QACard.tsx`
- Hover/feedback polish in `src/components/TopicCard.tsx` and `src/components/LessonCard.tsx`
- Refined lesson header/back affordance in `src/pages/LessonPage.tsx`
- Typography rhythm adjustments in `src/index.css` (and only where needed)
- Scroll-driven reveal for lesson content flow
- Tuned background motion behavior in `src/components/BackgroundShapes.tsx`
- Vitest setup and targeted component tests

### Definition of Done
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] `npm run test` passes (after Vitest setup)
- [ ] All task QA evidence files exist under `.sisyphus/evidence/`

### Must Have
- Preserve Noble aesthetic (ivory/graphite/gold, restrained motion, subtle depth)
- Respect `prefers-reduced-motion` for all newly introduced motion
- Keep touch behavior intuitive where hover is unavailable
- Keep route/page transitions coherent with existing motion language

### Must NOT Have (Guardrails)
- No dark mode in this plan
- No progress bar/progress tracking feature
- No sticky progress/sidebar navigation tied to reading progress
- No new runtime dependencies outside agreed test tooling
- No flashy gradients, neon, heavy shadows, particles, or postprocessing
- No data-layer/routing/content-schema changes

---

## Verification Strategy (MANDATORY)

> ZERO HUMAN INTERVENTION: every task must be validated by agent-executed scenarios and captured evidence.

### Test Decision
- **Infrastructure exists**: NO (before this work)
- **Automated tests**: YES (tests-after)
- **Framework**: Vitest + React Testing Library
- **Order**: Implement features first, then add/adjust tests

### QA Policy
- **Frontend/UI**: Playwright scenarios with concrete selectors and assertions
- **Component logic**: Vitest + RTL assertions on DOM/state behavior
- **Performance sanity**: scripted checks with repeatable steps and acceptance thresholds
- **Evidence storage**: `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately - visual core, 6 parallel tasks):
├── Task 1: Set up Vitest baseline and test script [quick]
├── Task 2: QACard microinteraction and open-state emphasis [visual-engineering]
├── Task 3: TopicCard hover/border/icon polish [visual-engineering]
├── Task 4: LessonCard hover/border/icon polish [visual-engineering]
├── Task 5: LessonPage sticky back affordance + header spacing tune [visual-engineering]
└── Task 6: Typography rhythm adjustments in global styles [visual-engineering]

Wave 2 (After Wave 1 - motion layering + validation, 5 parallel tasks):
├── Task 7: Scroll-driven reveal for lesson card flow [visual-engineering]
├── Task 8: Three.js background motion tuning (subtle parallax-safe) [visual-engineering]
├── Task 9: Harmonize route transition timing/easing with updated system [quick]
├── Task 10: Post-implementation tests for cards/lesson interactions [unspecified-high]
└── Task 11: Full project verify pass + evidence collation [quick]

Wave FINAL (After ALL tasks - independent review, 4 parallel tasks):
├── Task F1: Plan compliance audit [oracle]
├── Task F2: Code quality + type/lint/test review [unspecified-high]
├── Task F3: Real QA replay from scenario catalog [unspecified-high]
└── Task F4: Scope fidelity and anti-creep review [deep]

Critical Path: 1 -> 2 -> 7 -> 10 -> 11 -> F1/F2/F3/F4
Parallel Speedup: ~60% vs sequential
Max Concurrent: 6
```

### Dependency Matrix (full)

- **1**: blocked by none -> blocks 10, 11
- **2**: blocked by none -> blocks 7, 10, 11
- **3**: blocked by none -> blocks 10, 11
- **4**: blocked by none -> blocks 10, 11
- **5**: blocked by none -> blocks 7, 10, 11
- **6**: blocked by none -> blocks 9, 11
- **7**: blocked by 2, 5 -> blocks 10, 11
- **8**: blocked by none -> blocks 11
- **9**: blocked by 6 -> blocks 10, 11
- **10**: blocked by 1, 2, 3, 4, 5, 7, 9 -> blocks 11
- **11**: blocked by 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 -> blocks F1, F2, F3, F4
- **F1**: blocked by 11 -> blocks completion
- **F2**: blocked by 11 -> blocks completion
- **F3**: blocked by 11 -> blocks completion
- **F4**: blocked by 11 -> blocks completion

### Agent Dispatch Summary

- **Wave 1**: 6 agents - T1 quick, T2-T6 visual-engineering
- **Wave 2**: 5 agents - T7/T8 visual-engineering, T9 quick, T10 unspecified-high, T11 quick
- **Wave FINAL**: 4 agents - F1 oracle, F2 unspecified-high, F3 unspecified-high (+ playwright), F4 deep

---

## TODOs

- [x] 1. Set up Vitest baseline and test scripts

  **What to do**:
  - Add minimal test tooling for React + TypeScript (`vitest`, `@testing-library/react`, `@testing-library/jest-dom`).
  - Add `test` script in `package.json` and baseline config/setup files.
  - Add one smoke test proving the harness runs in CI-style non-interactive mode.

  **Must NOT do**:
  - Do not add runtime dependencies.
  - Do not add browser E2E frameworks in this task.

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: focused tooling bootstrap across a small file set.
  - **Skills**: `frontend-ui-ux`
    - `frontend-ui-ux`: helps keep test setup aligned with component architecture.
  - **Skills Evaluated but Omitted**:
    - `playwright`: deferred to UI scenario replay tasks, not required for harness bootstrap.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2-6)
  - **Blocks**: 10, 11
  - **Blocked By**: None

  **References**:
  - `package.json` - current script layout and dependency boundaries to extend safely.
  - `tsconfig.app.json` - TypeScript compile target assumptions that test config must respect.
  - `src/main.tsx` - app entrypoint pattern useful for smoke render setup.
  - External docs: `https://vitest.dev/guide/` - canonical test runner setup.
  - External docs: `https://testing-library.com/docs/react-testing-library/intro/` - React testing conventions.

  **Acceptance Criteria**:
  - [ ] `package.json` contains a working `test` script.
  - [ ] `npm run test` exits 0 on a clean checkout.
  - [ ] At least one smoke test executes and passes.

  **QA Scenarios**:
  ```
  Scenario: Vitest smoke run passes
    Tool: Bash
    Preconditions: Dependencies installed with npm
    Steps:
      1. Run: npm run test
      2. Capture terminal output to .sisyphus/evidence/task-1-vitest-smoke.txt
      3. Assert exit code is 0 and output includes "passed" or "PASS"
    Expected Result: Test runner executes at least one test and completes successfully.
    Failure Indicators: Non-zero exit, "No test files" with failure, config load error.
    Evidence: .sisyphus/evidence/task-1-vitest-smoke.txt

  Scenario: Invalid CLI flag fails cleanly
    Tool: Bash
    Preconditions: Vitest script exists
    Steps:
      1. Run: npm run test -- --thisFlagDoesNotExist
      2. Capture output to .sisyphus/evidence/task-1-vitest-invalid-flag-error.txt
      3. Assert non-zero exit and explicit unknown-option error message
    Expected Result: Command fails predictably with parse error, without hanging.
    Failure Indicators: Silent success, hang, or unrelated crash.
    Evidence: .sisyphus/evidence/task-1-vitest-invalid-flag-error.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-1-vitest-smoke.txt`
  - [ ] `.sisyphus/evidence/task-1-vitest-invalid-flag-error.txt`

  **Commit**: YES (group with 2-4)
  - Message: `chore(test): add vitest baseline for ui motion work`
  - Files: `package.json`, `vitest.config.*`, `src/test/*`
  - Pre-commit: `npm run test`

- [x] 2. QACard microinteraction and open-state emphasis

  **What to do**:
  - Refine accordion answer reveal with subtle vertical motion (`translateY`) layered over existing grid-row animation.
  - Improve open-state visual hierarchy (header/card emphasis) so active card is clearly distinguishable.
  - Keep question index style elegant (badge or divider treatment) without introducing noisy decoration.

  **Must NOT do**:
  - Do not change content schema or answer rendering logic.
  - Do not remove existing ARIA wiring (`aria-expanded`, `aria-controls`).

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: this is high-touch interaction polish in a core reading component.
  - **Skills**: `frontend-ui-ux`, `frontend-design`
    - `frontend-ui-ux`: interaction behavior and spacing rhythm.
    - `frontend-design`: preserve premium visual tone while improving clarity.
  - **Skills Evaluated but Omitted**:
    - `dev-browser`: not required at implementation stage; QA handles browser execution.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3, 4, 5, 6)
  - **Blocks**: 7, 10, 11
  - **Blocked By**: None

  **References**:
  - `src/components/QACard.tsx` - current accordion markup/state and icon rotation behavior.
  - `src/index.css` - `accordion-content` transition contract to extend, not replace.
  - `docs/ux-patterns.md` - accordion behavior conventions to preserve.
  - `docs/animations.md` - existing motion duration/easing style for consistency.
  - External docs: `https://motion.dev/motion/use-reduced-motion/` - reduced-motion handling patterns.

  **Acceptance Criteria**:
  - [ ] Closed->open transition includes visible smooth vertical lift of answer content.
  - [ ] Open card state is visually differentiated without breaking Noble style constraints.
  - [ ] `aria-expanded` and keyboard toggle behavior remain correct.

  **QA Scenarios**:
  ```
  Scenario: First QACard opens with emphasized state
    Tool: Playwright
    Preconditions: Dev server running at http://localhost:5173
    Steps:
      1. Open '/' and click first topic card: section[aria-label="Темы"] li:nth-of-type(1) a
      2. On topic page, click first lesson card: section[aria-label="Список уроков"] a
      3. Click first question button: section[aria-label="Карточки вопрос-ответ"] article:nth-of-type(1) button
      4. Assert button aria-expanded="true"
      5. Assert first answer container has data-open="true" and computed opacity near 1
    Expected Result: Card opens smoothly and active card is visually distinct.
    Failure Indicators: Abrupt pop-in, no active-state differentiation, wrong aria-expanded value.
    Evidence: .sisyphus/evidence/task-2-qacard-open.png

  Scenario: Rapid toggle does not break state
    Tool: Playwright
    Preconditions: Same page as happy path
    Steps:
      1. Double-click first question button quickly
      2. Assert final aria-expanded state is deterministic (true on odd toggles, false on even)
      3. Assert no uncaught console errors in page logs
    Expected Result: Toggle remains stable under rapid interaction.
    Failure Indicators: Stuck visual state, mismatched aria/content state, runtime errors.
    Evidence: .sisyphus/evidence/task-2-qacard-rapid-toggle.json
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-2-qacard-open.png`
  - [ ] `.sisyphus/evidence/task-2-qacard-rapid-toggle.json`

  **Commit**: YES (group with 1, 3, 4)
  - Message: `feat(ui): polish qa card interaction emphasis`
  - Files: `src/components/QACard.tsx`, `src/index.css`
  - Pre-commit: `npm run lint`

- [x] 3. TopicCard hover/border/icon polish

  **What to do**:
  - Add subtle border-color transition on hover/focus to reinforce interactivity.
  - Add slight icon scale boost in addition to existing diagonal nudge.
  - Keep reduced-motion users on non-animated fallback.

  **Must NOT do**:
  - Do not alter card navigation routes or topic data rendering.
  - Do not introduce heavy shadow or saturated color effects.

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: single-component interaction tuning with visual sensitivity.
  - **Skills**: `frontend-ui-ux`
    - `frontend-ui-ux`: precise hover/focus affordance balance.
  - **Skills Evaluated but Omitted**:
    - `frontend-design`: not necessary for a contained state-polish task.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 4, 5, 6)
  - **Blocks**: 10, 11
  - **Blocked By**: None

  **References**:
  - `src/components/TopicCard.tsx` - current hover lift and icon animation baseline.
  - `src/pages/TopicsListingPage.tsx` - list context and card container behavior.
  - `src/index.css` - reusable card/focus utility classes.
  - `docs/design-system.md` - allowed color and shadow intensity boundaries.

  **Acceptance Criteria**:
  - [ ] Hover state shows refined border cue and icon liveliness.
  - [ ] Focus-visible state remains accessible and visually coherent.
  - [ ] No regression in reduced-motion behavior.

  **QA Scenarios**:
  ```
  Scenario: Desktop hover visibly enhances affordance
    Tool: Playwright
    Preconditions: Dev server running; page '/'
    Steps:
      1. Hover first topic card link: section[aria-label="Темы"] li:nth-of-type(1) a
      2. Capture screenshot to .sisyphus/evidence/task-3-topic-hover.png
      3. Assert icon inside card has non-none transform matrix while hovered
    Expected Result: Border and icon feedback increase perceived clickability.
    Failure Indicators: No visual state change or overly aggressive effect.
    Evidence: .sisyphus/evidence/task-3-topic-hover.png

  Scenario: Touch navigation still works without hover dependency
    Tool: Playwright
    Preconditions: Emulate iPhone viewport/touch
    Steps:
      1. Open '/'
      2. Tap first topic card link
      3. Assert URL matches /topic/* and lessons section is visible
    Expected Result: Primary action is available via tap with no hover prerequisite.
    Failure Indicators: Tap ignored, wrong navigation, hidden actionable state.
    Evidence: .sisyphus/evidence/task-3-topic-touch.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-3-topic-hover.png`
  - [ ] `.sisyphus/evidence/task-3-topic-touch.png`

  **Commit**: YES (group with 1, 2, 4)
  - Message: `feat(ui): improve topic card hover feedback`
  - Files: `src/components/TopicCard.tsx`
  - Pre-commit: `npm run lint`

- [x] 4. LessonCard hover/border/icon polish

  **What to do**:
  - Mirror TopicCard hover improvements in lesson cards for consistent interaction language.
  - Keep icon motion restrained and aligned with existing easing.
  - Ensure intro/no-intro lesson cards keep identical visual rhythm.

  **Must NOT do**:
  - Do not change lesson navigation path generation.
  - Do not alter card content hierarchy.

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: direct continuation of card-state design system consistency.
  - **Skills**: `frontend-ui-ux`
    - `frontend-ui-ux`: ensure state consistency and responsive spacing.
  - **Skills Evaluated but Omitted**:
    - `frontend-design`: omitted because pattern should match existing card style exactly.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3, 5, 6)
  - **Blocks**: 10, 11
  - **Blocked By**: None

  **References**:
  - `src/components/LessonCard.tsx` - target card implementation.
  - `src/components/TopicCard.tsx` - canonical hover reference to match.
  - `src/pages/TopicPage.tsx` - lesson-card list container and stagger animation context.
  - `docs/design-system.md` - maintain restrained color/shadow treatment.

  **Acceptance Criteria**:
  - [ ] LessonCard hover/focus interactions match TopicCard quality and tone.
  - [ ] Visual behavior is consistent for cards with and without intro text.
  - [ ] No regressions in navigation click/tap behavior.

  **QA Scenarios**:
  ```
  Scenario: Lesson cards show refined hover response
    Tool: Playwright
    Preconditions: Navigate '/' -> first topic page
    Steps:
      1. Hover first lesson card: section[aria-label="Список уроков"] a:nth-of-type(1)
      2. Capture screenshot to .sisyphus/evidence/task-4-lesson-hover.png
      3. Assert icon transform changes from initial state
    Expected Result: Hover clearly communicates clickability without visual noise.
    Failure Indicators: No change, inconsistent style vs TopicCard, jittery motion.
    Evidence: .sisyphus/evidence/task-4-lesson-hover.png

  Scenario: Tap works on narrow viewport without hover
    Tool: Playwright
    Preconditions: Mobile viewport emulation
    Steps:
      1. Open first topic page
      2. Tap first lesson card
      3. Assert lesson page loaded and section[aria-label="Карточки вопрос-ответ"] exists
    Expected Result: Lesson is reachable by tap only.
    Failure Indicators: Tap misses target, navigation fails, layout overlap blocks action.
    Evidence: .sisyphus/evidence/task-4-lesson-touch.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-4-lesson-hover.png`
  - [ ] `.sisyphus/evidence/task-4-lesson-touch.png`

  **Commit**: YES (group with 1-4)
  - Message: `feat(ui): align lesson card hover polish with topic cards`
  - Files: `src/components/LessonCard.tsx`
  - Pre-commit: `npm run lint`

- [x] 5. LessonPage sticky back affordance + header spacing tune

  **What to do**:
  - Refine placement/behavior of the "back to lessons" control so it remains easy to reach during long-scroll reading.
  - Tune header spacing hierarchy to keep title and intro readable after sticky/back adjustments.
  - Preserve current Noble panel pattern (`bg-ivory/80` + blur) and avoid full-page fills.

  **Must NOT do**:
  - Do not redesign the entire lesson page information architecture.
  - Do not change `PrevNextNav` behavior or routing.

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: layout interaction refinement with responsive constraints.
  - **Skills**: `frontend-ui-ux`, `frontend-design`
    - `frontend-ui-ux`: sticky/scroll ergonomics and spacing rhythm.
    - `frontend-design`: preserve premium composition while adjusting hierarchy.
  - **Skills Evaluated but Omitted**:
    - `playwright`: kept for QA execution, not for implementation.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3, 4, 6)
  - **Blocks**: 7, 10, 11
  - **Blocked By**: None

  **References**:
  - `src/pages/LessonPage.tsx` - current back-link/header layout and spacing.
  - `src/components/Layout.tsx` - main content container widths/paddings that sticky behavior must fit.
  - `docs/constraints.md` - explicit layout constraints for background and panel usage.
  - `docs/ux-patterns.md` - touch target and readability guidance.

  **Acceptance Criteria**:
  - [ ] Back control remains discoverable and usable during long-scroll sessions.
  - [ ] Header spacing remains balanced on mobile and desktop.
  - [ ] No overlap/occlusion between sticky element and content.

  **QA Scenarios**:
  ```
  Scenario: Back affordance remains reachable during deep scroll
    Tool: Playwright
    Preconditions: Open any lesson page with multiple cards
    Steps:
      1. Scroll to 70% page depth
      2. Locate back control selector: a[href^="/topic/"]
      3. Click back control and assert URL returns to /topic/*
    Expected Result: Back action remains available without manual scroll-to-top.
    Failure Indicators: Control leaves viewport permanently, click blocked, wrong route.
    Evidence: .sisyphus/evidence/task-5-sticky-back.mp4

  Scenario: Mobile layout avoids overlap and clipping
    Tool: Playwright
    Preconditions: Emulate 390x844 viewport
    Steps:
      1. Open lesson page
      2. Capture screenshot before and after scroll
      3. Assert back control bounding box does not overlap h1 bounding box
    Expected Result: Clean readable hierarchy at both top and scrolled states.
    Failure Indicators: Overlap, clipped button text, hidden heading content.
    Evidence: .sisyphus/evidence/task-5-mobile-header.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-5-sticky-back.mp4`
  - [ ] `.sisyphus/evidence/task-5-mobile-header.png`

  **Commit**: YES (group with 5-6)
  - Message: `feat(layout): improve lesson header and back affordance`
  - Files: `src/pages/LessonPage.tsx`
  - Pre-commit: `npm run lint`

- [x] 6. Typography rhythm adjustments in global styles

  **What to do**:
  - Apply targeted tracking/line-height refinements for display headings and key card titles.
  - Keep body readability stable (especially mobile minimum practical text size).
  - Limit changes to existing style system (`src/index.css`, utility classes), avoiding broad typography rewrites.

  **Must NOT do**:
  - Do not replace configured font families.
  - Do not globally reduce text contrast or readability.

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: typographic micro-adjustments with systemic impact.
  - **Skills**: `frontend-design`, `frontend-ui-ux`
    - `frontend-design`: typographic tone and hierarchy quality.
    - `frontend-ui-ux`: readability and responsive text rhythm.
  - **Skills Evaluated but Omitted**:
    - `artistry`: unnecessary for constrained, style-system-safe tuning.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3, 4, 5)
  - **Blocks**: 9, 11
  - **Blocked By**: None

  **References**:
  - `src/index.css` - central global typography and utility layer.
  - `tailwind.config.js` - font family and design token boundaries.
  - `src/pages/LessonPage.tsx` - key H1 treatment to validate rhythm changes.
  - `src/components/TopicCard.tsx` - major card title style usage.
  - `docs/design-system.md` - approved typography direction.

  **Acceptance Criteria**:
  - [ ] Heading rhythm appears tighter/more intentional without harming readability.
  - [ ] Body text remains comfortably readable on mobile.
  - [ ] Typography changes stay within existing design system.

  **QA Scenarios**:
  ```
  Scenario: Heading rhythm updated consistently
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Open '/' and capture first card title screenshot
      2. Open first lesson page and capture h1 screenshot
      3. Assert computed letter-spacing/line-height differ from previous baseline where intended
    Expected Result: Display text appears more cohesive across pages.
    Failure Indicators: No measurable change, over-tight clipping, inconsistent rhythm.
    Evidence: .sisyphus/evidence/task-6-typography-headings.png

  Scenario: Mobile readability remains acceptable
    Tool: Playwright
    Preconditions: Emulate 390x844 viewport
    Steps:
      1. Open lesson page
      2. Query intro paragraph and answer text nodes
      3. Assert computed font-size >= 16px for body text blocks
    Expected Result: No readability regression on mobile.
    Failure Indicators: Body text below threshold or cramped line-height causing overlap.
    Evidence: .sisyphus/evidence/task-6-typography-mobile.json
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-6-typography-headings.png`
  - [ ] `.sisyphus/evidence/task-6-typography-mobile.json`

  **Commit**: YES (group with 5-6)
  - Message: `style(typography): tune heading rhythm for noble layout`
  - Files: `src/index.css`, affected component classnames
  - Pre-commit: `npm run lint`

- [x] 7. Scroll-driven reveal for lesson card flow

  **What to do**:
  - Add viewport-based reveal behavior for lesson Q/A card entries so motion is tied to user scroll progression.
  - Keep animation subtle (`opacity` + slight `y`) and consistent with current motion easing.
  - Ensure reduced-motion mode uses immediate/static presentation.

  **Must NOT do**:
  - Do not convert the page into heavy scroll-jacking behavior.
  - Do not animate every nested element; only intended reveal containers.

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: motion choreography tied to viewport behavior.
  - **Skills**: `frontend-ui-ux`
    - `frontend-ui-ux`: user-perceived smoothness and scannability while reading.
  - **Skills Evaluated but Omitted**:
    - `frontend-design`: not required beyond existing style language.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 8, 9, 10, 11)
  - **Blocks**: 10, 11
  - **Blocked By**: 2, 5

  **References**:
  - `src/pages/TopicsListingPage.tsx` - current stagger pattern reference.
  - `src/pages/TopicPage.tsx` - existing in-view/stagger usage for lessons.
  - `src/pages/LessonPage.tsx` - target render loop for QACard list.
  - `src/components/QACard.tsx` - card-level structure and states.
  - `docs/animations.md` - approved transition durations/easing and reduced-motion policy.
  - External docs: `https://motion.dev/docs/react-scroll-animations` - scroll reveal patterns.

  **Acceptance Criteria**:
  - [ ] Q/A cards reveal on entry with subtle movement and opacity change.
  - [ ] Reduced-motion users see static/immediate content reveal.
  - [ ] No scroll performance regressions on long lessons.

  **QA Scenarios**:
  ```
  Scenario: Cards reveal progressively while scrolling
    Tool: Playwright
    Preconditions: Open lesson page with multiple cards
    Steps:
      1. Ensure initial viewport includes first card only
      2. Scroll down by 400px increments
      3. At each step, assert next card transitions to visible state (opacity=1) after entering viewport
      4. Capture sequence screenshots
    Expected Result: Reveal follows viewport entry, not full-page instant animation.
    Failure Indicators: All cards animate immediately, or cards never animate into visibility.
    Evidence: .sisyphus/evidence/task-7-scroll-reveal-sequence.png

  Scenario: Reduced-motion disables reveal animation
    Tool: Playwright
    Preconditions: Context with reducedMotion='reduce'
    Steps:
      1. Open same lesson page
      2. Inspect first offscreen card after scrolling into view
      3. Assert no transitional y-offset animation is applied (static state)
    Expected Result: Content appears without animated motion in reduce mode.
    Failure Indicators: Motion still present despite reduced-motion preference.
    Evidence: .sisyphus/evidence/task-7-scroll-reveal-reduced.json
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-7-scroll-reveal-sequence.png`
  - [ ] `.sisyphus/evidence/task-7-scroll-reveal-reduced.json`

  **Commit**: YES (group with 7-9)
  - Message: `feat(motion): add scroll-driven reveal for lesson cards`
  - Files: `src/pages/LessonPage.tsx`, related motion wrappers
  - Pre-commit: `npm run lint`

- [x] 8. Three.js background motion tuning (subtle parallax-safe)

  **What to do**:
  - Tune existing shape drift/spin/response to feel more alive but still low-contrast and calm.
  - Optionally add very subtle pointer-responsive offset with strict amplitude clamp.
  - Preserve current `frameloop="demand"` + throttled invalidate performance model.

  **Must NOT do**:
  - Do not add postprocessing, particles, bloom, or heavy scene complexity.
  - Do not increase motion amplitude to distract from content readability.

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: R3F scene behavior tuning with performance constraints.
  - **Skills**: `frontend-ui-ux`
    - `frontend-ui-ux`: ensure decorative motion supports, not competes with, content reading.
  - **Skills Evaluated but Omitted**:
    - `frontend-design`: omitted because geometry/look remains unchanged; this is motion tuning.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 7, 9, 10, 11)
  - **Blocks**: 11
  - **Blocked By**: None

  **References**:
  - `src/components/BackgroundScene.tsx` - camera/light/fog envelope to preserve.
  - `src/components/BackgroundShapes.tsx` - drift/spin/interval and reduced-motion behavior.
  - `docs/threejs-background.md` - explicit technical and visual constraints.
  - `docs/constraints.md` - no particles/postprocessing and restrained visuals.

  **Acceptance Criteria**:
  - [ ] Background motion feels subtly richer without drawing focus from content.
  - [ ] Reduced-motion path remains effectively static.
  - [ ] Performance remains stable under current 30fps throttling intent.

  **QA Scenarios**:
  ```
  Scenario: Subtle background responds without overpowering content
    Tool: Playwright
    Preconditions: Open '/' desktop viewport
    Steps:
      1. Capture baseline screenshot
      2. Move mouse in slow diagonal pattern for 3 seconds
      3. Capture second screenshot and compare scene offsets visually
    Expected Result: Noticeable but small ambient shift; text readability unchanged.
    Failure Indicators: No response at all, or exaggerated movement competing with foreground.
    Evidence: .sisyphus/evidence/task-8-background-parallax.png

  Scenario: Reduced-motion keeps scene static
    Tool: Playwright
    Preconditions: Context with reducedMotion='reduce'
    Steps:
      1. Open '/'
      2. Capture screenshot at t=0 and t=2s
      3. Assert minimal pixel delta in background region
    Expected Result: Scene remains effectively static in reduce mode.
    Failure Indicators: Continuous motion visible under reduced-motion.
    Evidence: .sisyphus/evidence/task-8-background-reduced-diff.json
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-8-background-parallax.png`
  - [ ] `.sisyphus/evidence/task-8-background-reduced-diff.json`

  **Commit**: YES (group with 7-9)
  - Message: `feat(motion): tune noble background ambient dynamics`
  - Files: `src/components/BackgroundShapes.tsx`, optional `src/components/BackgroundScene.tsx`
  - Pre-commit: `npm run lint`

- [x] 9. Harmonize route transition timing/easing with updated motion system

  **What to do**:
  - Align page transition timing/easing values with the refined interaction language from Wave 1.
  - Keep existing transition type (fade + slight y-shift), only tuning parameters if needed.
  - Confirm reduced-motion transition remains short and non-disorienting.

  **Must NOT do**:
  - Do not introduce slide-heavy, scale-heavy, or rotational page transitions.
  - Do not change routing structure or route map.

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: constrained, single-component timing calibration task.
  - **Skills**: `frontend-ui-ux`
    - `frontend-ui-ux`: maintain coherent motion hierarchy between page and component transitions.
  - **Skills Evaluated but Omitted**:
    - `frontend-design`: tuning is behavioral, not visual redesign.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 7, 8, 10, 11)
  - **Blocks**: 10, 11
  - **Blocked By**: 6

  **References**:
  - `src/components/PageTransition.tsx` - current transition values and reduced-motion fallback.
  - `src/App.tsx` - route wiring and transition placement.
  - `docs/animations.md` - project-approved route transition character.
  - External docs: `https://motion.dev/docs/react-animate-presence` - route transition mechanics.

  **Acceptance Criteria**:
  - [ ] Page transitions remain smooth and subtle across all routes.
  - [ ] Reduced-motion transition remains significantly shorter and non-shifting.
  - [ ] Timing feels coherent with card/accordion motion.

  **QA Scenarios**:
  ```
  Scenario: Route transition remains smooth and consistent
    Tool: Playwright
    Preconditions: Desktop viewport, start at '/'
    Steps:
      1. Click first topic card and wait for topic header to appear
      2. Click first lesson card and wait for lesson h1 to appear
      3. Navigate browser back and forward
      4. Capture short video of transitions
    Expected Result: No abrupt jumps; fade+y transitions feel consistent across pages.
    Failure Indicators: Jarring jumps, delayed stale content, or route flicker.
    Evidence: .sisyphus/evidence/task-9-route-transition.mp4

  Scenario: Reduced-motion route transition stays minimal
    Tool: Playwright
    Preconditions: reducedMotion='reduce'
    Steps:
      1. Repeat '/' -> '/topic/*' navigation
      2. Assert transition completes quickly and without visible y-shift
      3. Capture timings to JSON
    Expected Result: Near-immediate, low-motion transition behavior.
    Failure Indicators: Long/animated transitions despite reduced-motion.
    Evidence: .sisyphus/evidence/task-9-route-transition-reduced.json
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-9-route-transition.mp4`
  - [ ] `.sisyphus/evidence/task-9-route-transition-reduced.json`

  **Commit**: YES (group with 7-9)
  - Message: `chore(motion): harmonize route transitions with polished interactions`
  - Files: `src/components/PageTransition.tsx`
  - Pre-commit: `npm run lint`

- [x] 10. Post-implementation automated tests for interaction and motion fallbacks

  **What to do**:
  - Add targeted component tests for QACard state toggling and key card interaction states.
  - Add reduced-motion related tests for transition/fallback behavior where practical.
  - Keep tests concise and deterministic (no brittle timing assertions).

  **Must NOT do**:
  - Do not attempt full visual regression in unit tests.
  - Do not introduce flaky time-dependent assertions without stable mocks.

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: multi-component test coverage with behavior contracts.
  - **Skills**: `frontend-ui-ux`
    - `frontend-ui-ux`: validates UI behavior semantics under interaction and fallback paths.
  - **Skills Evaluated but Omitted**:
    - `playwright`: reserved for scenario-level QA; this task is unit/component automation.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 7, 8, 9, 11)
  - **Blocks**: 11
  - **Blocked By**: 1, 2, 3, 4, 5, 7, 9

  **References**:
  - `package.json` - test command contract established in Task 1.
  - `src/components/QACard.tsx` - accordion behavior and aria state transitions.
  - `src/components/TopicCard.tsx` - hover/focus interaction contract.
  - `src/components/LessonCard.tsx` - mirrored card interaction contract.
  - `src/components/PageTransition.tsx` - reduced-motion transition contract.
  - External docs: `https://vitest.dev/guide/` - test runner features.
  - External docs: `https://testing-library.com/docs/queries/about/` - robust query strategy.

  **Acceptance Criteria**:
  - [ ] Tests cover QACard open/close + aria-expanded behavior.
  - [ ] Tests cover at least one reduced-motion fallback path.
  - [ ] `npm run test` passes consistently.

  **QA Scenarios**:
  ```
  Scenario: Full automated test suite passes
    Tool: Bash
    Preconditions: Tasks 1-9 complete
    Steps:
      1. Run: npm run test
      2. Save output to .sisyphus/evidence/task-10-test-suite-pass.txt
      3. Assert exit code 0 and expected suite count present
    Expected Result: New tests execute and pass without flaky retries.
    Failure Indicators: Non-zero exit, hanging tests, snapshot/timer instability.
    Evidence: .sisyphus/evidence/task-10-test-suite-pass.txt

  Scenario: Missing test target fails clearly
    Tool: Bash
    Preconditions: Test command available
    Steps:
      1. Run: npm run test -- src/does-not-exist.test.tsx
      2. Save output to .sisyphus/evidence/task-10-missing-target-error.txt
      3. Assert non-zero exit with explicit "No test files" style message
    Expected Result: Runner error path is explicit and non-ambiguous.
    Failure Indicators: Silent success, ambiguous output, or process hang.
    Evidence: .sisyphus/evidence/task-10-missing-target-error.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-10-test-suite-pass.txt`
  - [ ] `.sisyphus/evidence/task-10-missing-target-error.txt`

  **Commit**: YES (group with 10-11)
  - Message: `test(ui): add interaction and reduced-motion coverage`
  - Files: `src/**/*.test.tsx`, test setup/config files
  - Pre-commit: `npm run test`

- [x] 11. Full verification pass and evidence collation

  **What to do**:
  - Run lint/build/test together and resolve remaining regressions.
  - Execute all scenario QA checks from Tasks 2-10 and store evidence artifacts.
  - Produce a short evidence index in `.sisyphus/evidence/` for final audit readability.

  **Must NOT do**:
  - Do not introduce net-new features while fixing verification failures.
  - Do not skip failed checks; fix and re-run.

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: deterministic verification orchestration and cleanup.
  - **Skills**: `playwright`, `frontend-ui-ux`
    - `playwright`: execute and capture UI scenario evidence.
    - `frontend-ui-ux`: validate visual/interaction acceptance expectations.
  - **Skills Evaluated but Omitted**:
    - `dev-browser`: playwright skill already covers required browser automation depth.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 7, 8, 9, 10)
  - **Blocks**: F1, F2, F3, F4
  - **Blocked By**: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10

  **References**:
  - `docs/constraints.md` - source of non-negotiable exclusions to re-check.
  - `docs/animations.md` - expected route and interaction motion character.
  - `.sisyphus/plans/design-animation-quick-motion.md` - scenario source of truth for evidence completion.
  - `package.json` - canonical verify commands.

  **Acceptance Criteria**:
  - [ ] `npm run lint`, `npm run build`, `npm run test` all pass.
  - [ ] Every task evidence artifact exists at expected path.
  - [ ] Evidence index maps task number -> artifact list.

  **QA Scenarios**:
  ```
  Scenario: Full command verification succeeds
    Tool: Bash
    Preconditions: Tasks 1-10 complete
    Steps:
      1. Run: npm run lint
      2. Run: npm run build
      3. Run: npm run test
      4. Save combined logs to .sisyphus/evidence/task-11-verify-all.txt
    Expected Result: All verification commands exit 0.
    Failure Indicators: Any non-zero exit or unresolved warning promoted to failure.
    Evidence: .sisyphus/evidence/task-11-verify-all.txt

  Scenario: Guardrail scan catches forbidden scope
    Tool: Bash
    Preconditions: Code changes complete
    Steps:
      1. Search for potential forbidden additions (dark mode/progress keywords) in changed files
      2. Save output to .sisyphus/evidence/task-11-guardrail-scan.txt
      3. Assert scan report is empty or explicitly justified false positives
    Expected Result: No unauthorized dark-mode/progress implementations.
    Failure Indicators: Unapproved scope additions detected in source.
    Evidence: .sisyphus/evidence/task-11-guardrail-scan.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-11-verify-all.txt`
  - [ ] `.sisyphus/evidence/task-11-guardrail-scan.txt`

  **Commit**: YES (group with 10-11)
  - Message: `chore(qa): finalize verification and evidence package`
  - Files: changed source + tests + evidence index
  - Pre-commit: `npm run lint && npm run build && npm run test`

---

## Final Verification Wave (MANDATORY)

- [x] F1. **Plan Compliance Audit** - `oracle`
  Verify all Must Have / Must NOT Have clauses against actual implementation and evidence files.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT`

- [x] F2. **Code Quality Review** - `unspecified-high`
  Run `npm run lint`, `npm run build`, and `npm run test`; inspect changed files for anti-patterns and slop.
  Output: `Lint [PASS/FAIL] | Build [PASS/FAIL] | Test [PASS/FAIL] | VERDICT`

- [x] F3. **Scenario Replay QA** - `unspecified-high` + `playwright`
  Replay all task QA scenarios exactly, collect evidence in `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N] | Integration [PASS/FAIL] | Edge Cases [PASS/FAIL] | VERDICT`

- [x] F4. **Scope Fidelity Check** - `deep`
  Confirm no dark mode/progress/scope-creep additions and no unrelated subsystem modifications.
  Output: `Tasks [N/N compliant] | Creep [0 issues] | VERDICT`

---

## Commit Strategy

- Group 1 (T1-T4): `chore(ui): establish test baseline and card interaction polish`
- Group 2 (T5-T9): `feat(ui): refine lesson flow motion and background dynamics`
- Group 3 (T10-T11): `test(ui): add interaction coverage and finalize verification`

---

## Success Criteria

### Verification Commands
```bash
npm run lint
npm run build
npm run test
```

### Final Checklist
- [ ] All Must Have items implemented
- [ ] All Must NOT Have items absent
- [ ] Automated tests pass
- [ ] Scenario evidence captured for every task
- [ ] Final verification wave returns APPROVE across F1-F4
