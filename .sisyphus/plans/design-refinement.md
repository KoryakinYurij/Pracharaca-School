# Design Refinement: Eliminate AI Slop Patterns

## TL;DR

> **Quick Summary**: Strip away visual redundancies (nested card containers, repeated gold pill badges, uniform spacing) that make Noble Notes look AI-generated, and let the Three.js background breathe by removing the full-page ivory container — as already required by AGENTS.md.
> 
> **Deliverables**:
> - Layout.tsx freed from the outer container card (Three.js background visible between content blocks)
> - Badge visual hierarchy differentiated by function (numbers vs labels vs markers)
> - QACard accordion animation moved from Framer Motion height to CSS grid-template-rows
> - Spacing rhythm with dramatic contrast between major/minor groupings
> - Batch of minor polish fixes (durations, icon colors, nav weight)
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES — 3 waves
> **Critical Path**: Task 1 → Task 4 → Task 5

---

## Context

### Original Request
Design critique revealed 5 priority issues and 6 minor observations making Noble Notes look like AI-generated output despite an intentionally sophisticated aesthetic. The critique was conducted through code analysis of all 13 components, 2 pages, CSS, and visual screenshots at desktop and mobile widths.

### Interview Summary
**Key Discussions**:
- All issues identified through systematic analysis of code + visual output
- AGENTS.md explicitly prohibits the current Layout pattern: "Layout не должен перекрывать фон сплошной заливкой... контент — через подложки ivory/80 + лёгкий blur"
- Inter font is mandated by AGENTS.md — not changeable despite being an AI-tell font
- No test infrastructure exists — verification relies on build checks + Playwright QA

**Research Findings**:
- `noble-card` CSS class used in 5 locations across 4 files (QACard, LessonCard, PrevNextNav×2, "lesson not found" state)
- Gold pill pattern found in 8 instances across 6 files
- `space-y-` used 11 times across 5 files, values clustered at 2/3/4/5
- CSS `grid-template-rows: 0fr → 1fr` transition supported natively in Tailwind v3.4.17 via arbitrary values

### Metis Review
**Identified Gaps** (addressed):
- Layout container removal cascade — non-card content (Header, DividerOrnament, labels, back-button, lesson title) needs individual backdrops → specified per-section backdrop strategy in Task 1
- QACard animation architecture decision — hybrid CSS+Framer doesn't work because AnimatePresence conditionally renders → chosen full-CSS with always-rendered content
- Badge differentiation hierarchy unspecified → defined concrete visual treatment per use-case in Task 2
- Missing exact animation duration targets → specified: chevron 300ms, page transition 380ms, accordion 350ms
- Build verification missing from acceptance criteria → `npx tsc --noEmit && npx vite build` mandatory after every task
- Edge cases: "lesson not found" state, long titles on mobile, many answer sections in DOM, short content animation → addressed in individual tasks

---

## Work Objectives

### Core Objective
Transform Noble Notes from "AI generated an elegant template" to "a designer made deliberate choices" by eliminating structural redundancy (nested cards, repeated badges, uniform spacing) and exposing the Three.js background as a distinctive atmospheric layer.

### Concrete Deliverables
- Modified `Layout.tsx` — outer card div removed, `<main>` preserved as spacing anchor
- Modified `TopicPage.tsx` — header and content groups wrapped in individual semi-transparent backdrops
- Modified `LessonPage.tsx` — lesson header group with own backdrop, spacing adjustments
- Modified `QACard.tsx` — CSS grid accordion, badge differentiation, chevron timing
- Modified `AnswerSection.tsx` — flattened from card to bordered region, warning icon color
- Modified `answerRenderers.tsx` — step number treatment simplified
- Modified `index.css` — 1 new utility class for grid accordion
- Modified `Header.tsx` — spacing adjustments
- Modified `LessonCard.tsx` — badge differentiation
- Modified `DividerOrnament.tsx` — margin adjustment
- Modified `PrevNextNav.tsx` — reduced visual weight
- Modified `PageTransition.tsx` — duration adjustment
- Modified `ErrorBoundary.tsx` — icon treatment simplified

### Definition of Done
- [x] `npx tsc --noEmit` exits 0
- [x] `npx vite build` exits 0
- [x] `npx eslint .` exits 0
- [x] Three.js background shapes visible between content blocks on both `/` and `/lesson/noble-basics`
- [x] No full-page ivory container wrapping all content
- [x] Gold pill badge used for ≤2 distinct purposes (not 8)
- [x] QACard accordion expands/collapses smoothly without animating `height` property
- [x] Visible spacing contrast between major sections (≥32px) and minor items (≤20px)

### Must Have
- All existing content renders identically (text, cards, sections, navigation)
- All accessibility attributes preserved (`aria-expanded`, `aria-controls`, `useId()`, `focus-ring`)
- `prefers-reduced-motion` support preserved in all animated components
- Mobile layout remains comfortable (320px min-width, adequate padding)
- AGENTS.md compliance: content via individual `ivory/80 + blur` подложки, not full-page cover

### Must NOT Have (Guardrails)
- **NO modifications** to `BackgroundScene.tsx` or `BackgroundShapes.tsx` (Three.js shapes stay as-is)
- **NO modifications** to content files (`content/topic.json`, `content/lessons/*.json`)
- **NO modifications** to `types.ts`, `loader.ts`, or `main.tsx`
- **NO modifications** to the `.noble-card` CSS class definition in `index.css` (use per-element overrides)
- **NO modifications** to `App.tsx` (page-level AnimatePresence stays intact)
- **NO new npm dependencies**
- **NO changes** to font families, font sizes, or font weights
- **NO redesign** of more than `warning` and `pitfalls` icon colors in AnswerSection
- **NO changes** to spacing inside `answerRenderers.tsx` (content-level spacing is out of scope)
- **NO introduction** of new Tailwind color tokens

---

## Verification Strategy (MANDATORY)

> **UNIVERSAL RULE: ZERO HUMAN INTERVENTION**
>
> ALL tasks in this plan MUST be verifiable WITHOUT any human action.
> Every criterion MUST be verifiable by running a command or using a tool.

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: None (no test framework in project)
- **Framework**: None

### Agent-Executed QA Scenarios (MANDATORY — ALL tasks)

> Without test infrastructure, Agent-Executed QA Scenarios are the PRIMARY verification method.
> Every task includes build verification + Playwright visual verification.

**Playwright Setup Note:**
Playwright is already installed **globally** (see AGENTS.md). Use it directly:
- CLI: `playwright screenshot http://localhost:5173 screenshot.png`
- Do NOT run `npx playwright install chrome` — requires sudo and fails
- Browsers are at `~/.cache/ms-playwright/` and work automatically

**Verification Tool by Deliverable Type:**

| Type | Tool | How Agent Verifies |
|------|------|-------------------|
| **Component changes** | Bash (`npx tsc --noEmit && npx vite build`) | TypeScript compiles, Vite builds |
| **Visual changes** | Playwright (playwright skill) | Navigate, screenshot, assert DOM |
| **Lint** | Bash (`npx eslint .`) | No new errors |

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately):
└── Task 1: Layout container removal + backdrop redistribution
    [HIGHEST RISK — must complete and build before anything else]

Wave 2 (After Wave 1):
├── Task 2: Badge differentiation hierarchy
└── Task 3: QACard accordion animation (CSS grid)

Wave 3 (After Wave 1):
└── Task 4: Spacing rhythm overhaul

Wave 4 (After ALL above):
└── Task 5: Polish batch (durations, icons, nav weight, error boundary)
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 2, 3, 4, 5 | None (solo, high-risk) |
| 2 | 1 | 5 | 3 |
| 3 | 1 | 5 | 2 |
| 4 | 1 | 5 | 2, 3 (but visual context dependency) |
| 5 | 1, 2, 3, 4 | None (final) | None |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Agents |
|------|-------|-------------------|
| 1 | 1 | `task(category="visual-engineering", load_skills=["playwright", "frontend-ui-ux"])` |
| 2 | 2, 3 | Two parallel `task(category="visual-engineering", load_skills=["playwright"])` |
| 3 | 4 | `task(category="visual-engineering", load_skills=["playwright"])` |
| 4 | 5 | `task(category="quick", load_skills=["playwright"])` |

---

## TODOs

- [x] 1. Remove Layout Container Card + Redistribute Backdrops

  **What to do**:
  
  **Step 1 — Remove the outer container div from Layout.tsx**:
  - In `Layout.tsx:13`, remove the inner `<div className="rounded-[2rem] border border-border/65 bg-ivory/80 px-4 py-6 shadow-soft backdrop-blur-sm sm:px-8 sm:py-10 lg:px-10">` wrapper
  - Keep the `<main className="relative z-10 mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-12 lg:py-14">` tag intact — it provides max-width centering and horizontal padding
  - Children render directly inside `<main>` with no card wrapper

  **Step 2 — Add per-section backdrops to TopicPage.tsx**:
  - Wrap the `<Header>` component + its immediate siblings (up to the DividerOrnament) in a backdrop container: `<div className="rounded-2xl bg-ivory/80 px-5 py-6 backdrop-blur-sm sm:px-8 sm:py-8">`
  - The "Уроки" label (`<p>` tag on line 19) can sit outside the backdrop — it's a small text element that reads fine over the subtle Three.js shapes
  - LessonCard components already have `noble-card` class — they have their own backdrop, no changes needed

  **Step 3 — Add per-section backdrops to LessonPage.tsx**:
  - Wrap the back-button + lesson header (lines 32-47) in a backdrop container: `<div className="rounded-2xl bg-ivory/80 px-5 py-6 backdrop-blur-sm sm:px-8 sm:py-8">`
  - The "lesson not found" state (lines 13-25) already uses `noble-card` — no change needed
  - QACard components already have `noble-card` class — no change needed
  - PrevNextNav links already have `noble-card` class — no change needed (visual weight reduction is in Task 5)

  **Step 4 — Verify DividerOrnament**:
  - DividerOrnament has no backdrop of its own — its thin horizontal lines and small diamond sit directly on the background. This is intentional: the divider is a subtle separator, not a content block. It remains as-is (the lines are fine over the faint Three.js shapes because they're `bg-border/90` which is opaque enough).

  **Must NOT do**:
  - Do NOT touch `BackgroundScene.tsx` or `BackgroundShapes.tsx`
  - Do NOT modify the `.noble-card` class definition in `index.css`
  - Do NOT change any content files
  - Do NOT modify `App.tsx`
  - Do NOT add any new npm dependencies
  - Do NOT remove the `<main>` tag's existing classes — only remove the inner `<div>`

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Visual layout restructuring requiring spatial awareness of how backdrops layer over the 3D background
  - **Skills**: [`playwright`, `frontend-ui-ux`]
    - `playwright`: Needed for visual verification screenshots on both routes
    - `frontend-ui-ux`: Needed for making aesthetic decisions about backdrop sizing/padding if edge cases arise
  - **Skills Evaluated but Omitted**:
    - `frontend-design`: This is a surgical structural change, not a new design from scratch
    - `git-master`: No commit in this task

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1 (solo)
  - **Blocks**: Tasks 2, 3, 4, 5
  - **Blocked By**: None (starts immediately)

  **References** (CRITICAL):

  **Pattern References**:
  - `src/components/Layout.tsx:8-18` — Current layout structure showing the container to remove (the inner `<div>` on line 13, NOT the `<main>` on line 12)
  - `src/index.css:42-44` — `.noble-card` class definition showing the backdrop pattern to follow for new per-section containers: `bg-ivory/80 shadow-soft backdrop-blur-[2px]` (use similar but without the shadow for section backdrops)
  - `src/pages/TopicPage.tsx:14-44` — Full page structure showing Header + DividerOrnament + lesson list that need backdrop decisions
  - `src/pages/LessonPage.tsx:30-59` — Full page structure showing back-button + header + DividerOrnament + QA cards + PrevNextNav
  - `src/pages/LessonPage.tsx:12-26` — "Lesson not found" state that already has `noble-card` and needs no changes

  **API/Type References**:
  - `AGENTS.md` — "Layout не должен перекрывать фон сплошной заливкой... контент — через подложки ivory/80 + лёгкий blur" — the authoritative requirement this task implements

  **WHY Each Reference Matters**:
  - `Layout.tsx:13` — This is the exact div to remove. The `<main>` on line 12 stays. Misidentifying which element to remove would break the entire layout.
  - `index.css:42-44` — The new per-section backdrops should follow this existing pattern (ivory/80 + blur) for visual consistency
  - TopicPage/LessonPage — The executor must understand which content groups need shared backdrops vs which already have their own via `noble-card`

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios (MANDATORY):**

  ```
  Scenario: Build succeeds after Layout container removal
    Tool: Bash
    Preconditions: None
    Steps:
      1. Run: npx tsc --noEmit
      2. Assert: Exit code 0
      3. Run: npx vite build
      4. Assert: Exit code 0
      5. Run: npx eslint .
      6. Assert: Exit code 0 (or no new errors vs baseline)
    Expected Result: Clean build with no type errors
    Evidence: Terminal output captured

  Scenario: Three.js background visible on home page
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:5173
    Steps:
      1. Navigate to: http://localhost:5173/
      2. Wait for: text "Красивый конспект" visible (timeout: 5s)
      3. Assert: No element with class matching "rounded-[2rem]" wrapping all content
      4. Assert: Header text "Красивый конспект" is visible and readable
      5. Assert: Lesson cards are visible
      6. Screenshot full page: .sisyphus/evidence/task-1-homepage-no-container.png
    Expected Result: Content renders without full-page card, Three.js shapes visible in gaps between content blocks
    Evidence: .sisyphus/evidence/task-1-homepage-no-container.png

  Scenario: Three.js background visible on lesson page
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:5173
    Steps:
      1. Navigate to: http://localhost:5173/lesson/noble-basics
      2. Wait for: text "Основа благородного конспекта" visible (timeout: 5s)
      3. Assert: Back button "К урокам" is visible
      4. Assert: QA cards are visible (at least 5 article elements)
      5. Screenshot full page: .sisyphus/evidence/task-1-lesson-no-container.png
    Expected Result: Lesson page renders with per-section backdrops, Three.js visible between content blocks
    Evidence: .sisyphus/evidence/task-1-lesson-no-container.png

  Scenario: Mobile layout remains usable at 390px
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:5173
    Steps:
      1. Set viewport: 390x844
      2. Navigate to: http://localhost:5173/
      3. Assert: Content does not overflow horizontally (no horizontal scrollbar)
      4. Assert: Header text is visible and not truncated
      5. Navigate to: http://localhost:5173/lesson/noble-basics
      6. Assert: Content does not overflow horizontally
      7. Assert: QA card buttons are visible with adequate padding
      8. Screenshot: .sisyphus/evidence/task-1-mobile-390.png
    Expected Result: Mobile layout maintains adequate padding, no overflow
    Evidence: .sisyphus/evidence/task-1-mobile-390.png

  Scenario: "Lesson not found" state renders correctly
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:5173
    Steps:
      1. Navigate to: http://localhost:5173/lesson/nonexistent-slug-xyz
      2. Wait for: page load (timeout: 5s)
      3. Assert: redirected to "/" OR "Урок не найден" text visible
      4. Screenshot: .sisyphus/evidence/task-1-not-found.png
    Expected Result: Not-found state renders cleanly with noble-card backdrop over Three.js background
    Evidence: .sisyphus/evidence/task-1-not-found.png
  ```

  **Evidence to Capture:**
  - [ ] .sisyphus/evidence/task-1-homepage-no-container.png
  - [ ] .sisyphus/evidence/task-1-lesson-no-container.png
  - [ ] .sisyphus/evidence/task-1-mobile-390.png
  - [ ] .sisyphus/evidence/task-1-not-found.png

  **Commit**: YES
  - Message: `refactor(layout): remove full-page container card, redistribute backdrops per AGENTS.md`
  - Files: `src/components/Layout.tsx`, `src/pages/TopicPage.tsx`, `src/pages/LessonPage.tsx`
  - Pre-commit: `npx tsc --noEmit && npx vite build`

---

- [x] 2. Badge Differentiation Hierarchy

  **What to do**:

  **Design specification for badge differentiation**:
  
  | Use case | Current treatment | New treatment | Files |
  |----------|------------------|---------------|-------|
  | Topic subtitle ("Локальный формат обучения") | Gold pill badge | **KEEP AS-IS** — this is the ONE place a badge makes sense (page-level context label) | `Header.tsx:12` |
  | "Урок 01" label on lesson page | Gold pill badge | **KEEP AS-IS** — navigation context label, same function as topic subtitle | `LessonPage.tsx:41-43` |
  | Lesson order number (01, 02) on LessonCard | Gold pill circle | **Simplify**: Remove the circle container. Use plain styled text: `text-sm font-semibold text-gold-dark` with no border, no background, no rounded-full. Just the number. | `LessonCard.tsx:19-21` |
  | QA card order number (01, 02...) on QACard | Gold pill circle | **Simplify**: Remove the circle container. Use plain styled text: `text-sm font-semibold text-gold-dark/70` — slightly lighter than lesson numbers to indicate secondary hierarchy. | `QACard.tsx:26-28` |
  | Step numbers in ordered lists | Gold pill circle (small) | **Simplify**: Plain numeral with `text-xs font-medium text-graphite/50` — no container, no gold color. Steps are inside content blocks; they don't need highlighting. | `answerRenderers.tsx:46-51` |
  | "Запоминалка" label in mnemonic sections | Gold pill badge | **Remove entirely**: The mnemonic is already inside an AnswerSection with its own "Запоминалка" header label from sectionMeta. This pill is redundant. | `answerRenderers.tsx:228-230` |

  **Must NOT do**:
  - Do NOT change the text content of any badge — only the visual container
  - Do NOT introduce new Tailwind color tokens
  - Do NOT change font families or font weights beyond what's specified above
  - Do NOT modify `Header.tsx` badge treatment (it stays as-is)
  - Do NOT modify the "Урок XX" pill on `LessonPage.tsx` (it stays as-is)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Visual refinement across multiple components requiring consistent aesthetic judgment
  - **Skills**: [`playwright`]
    - `playwright`: Needed for visual verification that badges look differentiated
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Changes are precisely specified, no design decisions needed
    - `git-master`: No complex git operations

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 3)
  - **Blocks**: Task 5
  - **Blocked By**: Task 1

  **References** (CRITICAL):

  **Pattern References**:
  - `src/components/Header.tsx:12-15` — Topic subtitle badge that stays UNCHANGED (the reference gold pill pattern)
  - `src/components/LessonCard.tsx:19-21` — Lesson number circle to simplify (remove container, keep number text)
  - `src/components/QACard.tsx:26-28` — QA number circle to simplify (remove container, keep number text)
  - `src/pages/LessonPage.tsx:41-43` — "Урок XX" pill that stays UNCHANGED
  - `src/components/answerRenderers.tsx:46-51` — Step number circles to simplify (plain numerals)
  - `src/components/answerRenderers.tsx:224-234` — renderMnemonic function with redundant "Запоминалка" pill to remove

  **WHY Each Reference Matters**:
  - Header.tsx badge — DO NOT TOUCH. It's the reference design. The executor needs to see what "stays" to understand the contrast with what changes.
  - LessonCard/QACard numbers — These are the highest-visibility changes. Getting the plain text styling right here defines the new visual language.
  - answerRenderers.tsx step numbers — Smallest change but most instances (every "steps" section renders these). Must feel intentionally different from the QA numbers.
  - answerRenderers.tsx mnemonic pill — Pure removal. The section header above already says "Запоминалка" via `sectionMeta`.

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios (MANDATORY):**

  ```
  Scenario: Build succeeds after badge changes
    Tool: Bash
    Preconditions: Task 1 completed
    Steps:
      1. Run: npx tsc --noEmit
      2. Assert: Exit code 0
      3. Run: npx vite build
      4. Assert: Exit code 0
    Expected Result: Clean build
    Evidence: Terminal output captured

  Scenario: Badges visually differentiated on home page
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:5173
    Steps:
      1. Navigate to: http://localhost:5173/
      2. Wait for: text "Красивый конспект" visible (timeout: 5s)
      3. Assert: Topic subtitle "Локальный формат обучения" has a container with border (pill badge preserved)
      4. Assert: Lesson numbers (01, 02) do NOT have a rounded-full container with border and background
      5. Screenshot: .sisyphus/evidence/task-2-homepage-badges.png
    Expected Result: Topic badge is a pill, lesson numbers are plain text
    Evidence: .sisyphus/evidence/task-2-homepage-badges.png

  Scenario: Badges differentiated on lesson page
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:5173
    Steps:
      1. Navigate to: http://localhost:5173/lesson/noble-basics
      2. Assert: "Урок 01" has pill badge styling (border + background)
      3. Assert: QA card numbers (01, 02, etc.) do NOT have rounded-full container
      4. Click first QA card to expand
      5. Assert: Step numbers in "steps" sections are plain text without gold circle
      6. Screenshot: .sisyphus/evidence/task-2-lesson-badges.png
    Expected Result: Hierarchical badge differentiation visible
    Evidence: .sisyphus/evidence/task-2-lesson-badges.png

  Scenario: Mnemonic section no longer has redundant pill
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, card 5 ("Что делать, если ответ... слишком длинным?") expanded
    Steps:
      1. Navigate to: http://localhost:5173/lesson/noble-basics
      2. Click QA card 5 (text contains "слишком длинным")
      3. Wait for expanded content visible (timeout: 3s)
      4. Locate mnemonic section (text "Один экран, одна мысль")
      5. Assert: No inline pill badge with text "Запоминалка" inside the mnemonic body content
      6. Assert: Section header label "Запоминалка" from AnswerSection still present above
      7. Screenshot: .sisyphus/evidence/task-2-mnemonic-no-pill.png
    Expected Result: Single "Запоминалка" label from section header, no redundant pill in body
    Evidence: .sisyphus/evidence/task-2-mnemonic-no-pill.png
  ```

  **Evidence to Capture:**
  - [ ] .sisyphus/evidence/task-2-homepage-badges.png
  - [ ] .sisyphus/evidence/task-2-lesson-badges.png
  - [ ] .sisyphus/evidence/task-2-mnemonic-no-pill.png

  **Commit**: YES
  - Message: `refactor(ui): differentiate badge hierarchy — plain numbers, reserved pills for labels`
  - Files: `src/components/LessonCard.tsx`, `src/components/QACard.tsx`, `src/components/answerRenderers.tsx`
  - Pre-commit: `npx tsc --noEmit && npx vite build`

---

- [x] 3. QACard Accordion: CSS Grid Animation

  **What to do**:

  **Step 1 — Add CSS utility class to index.css**:
  Add ONE new utility class inside `@layer components`:
  ```css
  .accordion-content {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 350ms cubic-bezier(0.22, 1, 0.36, 1),
                opacity 350ms cubic-bezier(0.22, 1, 0.36, 1);
    opacity: 0;
  }

  .accordion-content[data-open="true"] {
    grid-template-rows: 1fr;
    opacity: 1;
  }
  ```
  Note: The easing `cubic-bezier(0.22, 1, 0.36, 1)` matches the existing Framer Motion easing used throughout the app (seen in `QACard.tsx:48` and `PageTransition.tsx:14`).

  **Step 2 — Rewrite QACard.tsx accordion mechanism**:
  - Remove `AnimatePresence` and `motion.div` imports/usage for the accordion content
  - Keep `useState` for `isOpen`, keep `useId()` for `contentId`
  - Replace the conditional render (`{isOpen ? (...) : null}`) with always-rendered content:
    ```tsx
    <div
      id={contentId}
      className="accordion-content"
      data-open={isOpen}
    >
      <div className="overflow-hidden">
        <div className="space-y-3 border-t border-border/70 px-5 py-5 sm:px-6 sm:py-6">
          {card.a.map((section, sectionIndex) => (
            <AnswerSection key={`${section.kind}-${sectionIndex}`} section={section} />
          ))}
        </div>
      </div>
    </div>
    ```
  - The content is always in the DOM (good for a11y — `aria-controls` target always exists)
  - The `overflow: hidden` inner div is required for `grid-template-rows: 0fr` to collapse content

  **Step 3 — Fix chevron duration**:
  - Change chevron `duration-[620ms]` to `duration-300` on line 34

  **Step 4 — Handle prefers-reduced-motion**:
  - Add a CSS media query in `index.css`:
    ```css
    @media (prefers-reduced-motion: reduce) {
      .accordion-content {
        transition-duration: 0.01ms !important;
      }
    }
    ```
  - This preserves the existing `useReducedMotion` behavior but via CSS since we're moving away from Framer for this animation
  - The `useReducedMotion` import in QACard.tsx can be removed if it's no longer used (check if `prefersReducedMotion` is referenced elsewhere in the component — it's NOT, so safe to remove)

  **Must NOT do**:
  - Do NOT touch `AnimatePresence` in `App.tsx` (page-level transitions are separate)
  - Do NOT modify `PageTransition.tsx` in this task (that's Task 5)
  - Do NOT change the button's click handler or accessibility attributes
  - Do NOT modify `AnswerSection.tsx` or `answerRenderers.tsx` in this task
  - Do NOT add more than 1 new utility class to `index.css` (the accordion utility counts as 1 even with the data-open variant and the reduced-motion query)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Animation engineering requiring understanding of CSS grid transitions and interaction feedback
  - **Skills**: [`playwright`]
    - `playwright`: Needed for verifying accordion open/close behavior in browser
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Animation spec is fully defined, no design decisions needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 2)
  - **Blocks**: Task 5
  - **Blocked By**: Task 1

  **References** (CRITICAL):

  **Pattern References**:
  - `src/components/QACard.tsx:1-61` — Full current component. Lines 41-57 are the AnimatePresence block to replace. Lines 32-38 are the chevron to speed up. Lines 1-4 are imports to clean up (remove AnimatePresence, motion).
  - `src/index.css:41-49` — Current `@layer components` block where the new `.accordion-content` utility goes
  - `src/components/PageTransition.tsx:14` — Shows the easing curve `[0.22, 1, 0.36, 1]` used app-wide, which the CSS `cubic-bezier` must match

  **External References**:
  - CSS grid-template-rows animation technique: The pattern is `grid-template-rows: 0fr` on container + `overflow: hidden` on child + `min-height: 0` on child content. Transition to `grid-template-rows: 1fr` expands smoothly.

  **WHY Each Reference Matters**:
  - `QACard.tsx` full file — Executor needs complete context to understand what stays (button, state, a11y) vs what changes (AnimatePresence → CSS grid)
  - `index.css @layer` — New utility must go inside the existing `@layer components` block, not outside
  - PageTransition easing — CSS bezier must exactly match `[0.22, 1, 0.36, 1]` for visual consistency across all app animations

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios (MANDATORY):**

  ```
  Scenario: Build succeeds after animation refactor
    Tool: Bash
    Preconditions: Task 1 completed
    Steps:
      1. Run: npx tsc --noEmit
      2. Assert: Exit code 0
      3. Run: npx vite build
      4. Assert: Exit code 0
    Expected Result: Clean build, Framer Motion imports removed from QACard
    Evidence: Terminal output captured

  Scenario: QACard expands and collapses on click
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:5173
    Steps:
      1. Navigate to: http://localhost:5173/lesson/noble-basics
      2. Wait for: article elements visible (timeout: 5s)
      3. Locate first QA card button (aria-expanded="false")
      4. Click the button
      5. Wait for: 500ms (animation completes at 350ms)
      6. Assert: button now has aria-expanded="true"
      7. Assert: accordion content container has data-open="true"
      8. Assert: answer section content is visible (text content readable)
      9. Click the same button again
      10. Wait for: 500ms
      11. Assert: button now has aria-expanded="false"
      12. Assert: accordion content container has data-open="false"
      13. Screenshot: .sisyphus/evidence/task-3-accordion-toggle.png
    Expected Result: Accordion toggles smoothly, content appears/disappears
    Evidence: .sisyphus/evidence/task-3-accordion-toggle.png

  Scenario: Multiple cards can be open simultaneously
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:5173
    Steps:
      1. Navigate to: http://localhost:5173/lesson/noble-basics
      2. Click first QA card button
      3. Wait 500ms
      4. Click second QA card button
      5. Wait 500ms
      6. Click third QA card button
      7. Wait 500ms
      8. Assert: All three buttons have aria-expanded="true"
      9. Assert: All three accordion containers have data-open="true"
      10. Screenshot: .sisyphus/evidence/task-3-multiple-open.png
    Expected Result: Multiple cards open simultaneously, no interference
    Evidence: .sisyphus/evidence/task-3-multiple-open.png

  Scenario: Framer Motion no longer imported in QACard
    Tool: Bash
    Preconditions: Task completed
    Steps:
      1. Run: grep -c "from 'framer-motion'" src/components/QACard.tsx
      2. Assert: Output is 0 (no framer-motion imports)
      3. Run: grep -c "AnimatePresence" src/components/QACard.tsx
      4. Assert: Output is 0
      5. Run: grep -c "motion.div" src/components/QACard.tsx
      6. Assert: Output is 0
    Expected Result: QACard has no Framer Motion dependency for accordion
    Evidence: Terminal output captured

  Scenario: Chevron rotation uses 300ms duration
    Tool: Bash
    Preconditions: Task completed
    Steps:
      1. Run: grep "duration-" src/components/QACard.tsx
      2. Assert: Contains "duration-300" (not "duration-[620ms]")
    Expected Result: Chevron animation is 300ms
    Evidence: Terminal output captured
  ```

  **Evidence to Capture:**
  - [ ] .sisyphus/evidence/task-3-accordion-toggle.png
  - [ ] .sisyphus/evidence/task-3-multiple-open.png

  **Commit**: YES
  - Message: `refactor(qa-card): replace Framer Motion height animation with CSS grid-template-rows`
  - Files: `src/components/QACard.tsx`, `src/index.css`
  - Pre-commit: `npx tsc --noEmit && npx vite build`

---

- [x] 4. Spacing Rhythm Overhaul

  **What to do**:

  **Design specification for spacing rhythm**:
  The goal is rhythmic CONTRAST — tight grouping within semantic clusters, generous breathing between them. The current uniform `space-y-3/4/5` creates monotonous vertical pacing.

  **TopicPage.tsx changes**:
  - After the header backdrop container: add `mt-14` before the DividerOrnament (currently DividerOrnament has `my-10`, so effectively change the gap above it to be larger)
  - Change DividerOrnament's `my-10` to `my-12` in `DividerOrnament.tsx` — slightly more breathing room (this is a global change, also affects LessonPage)
  - "Уроки" label to lesson cards: keep tight `mt-3 mb-5` (label is grouped with the list it describes)
  - Between lesson cards: keep `gap-4 sm:gap-5` (cards are peers, should be evenly spaced)

  **LessonPage.tsx changes**:
  - Back-button to lesson header: `mt-6 sm:mt-8` — already exists, keep as-is
  - After header backdrop container: DividerOrnament handles the gap (now `my-12`)
  - QA card list: keep `space-y-4 sm:space-y-5` (cards are peers)
  - QA card list to PrevNextNav: increase from `mt-10` to `mt-16` — create a clear "end of content" breath before navigation

  **QACard.tsx changes (inside expanded content)**:
  - Answer sections: keep `space-y-3` — these are tightly grouped within one card's answer

  **Header.tsx changes**:
  - Change `space-y-5` to `space-y-4` — subtitle badge, title, and description are a tight group, not peers needing equal spacing
  
  **Summary of spacing scale**:
  | Gap type | Current | New | Rationale |
  |----------|---------|-----|-----------|
  | Within tight group (header internals, answer sections) | space-y-3/5 | space-y-3/4 | Tight cohesion within semantic unit |
  | Between peer items (lesson cards, QA cards) | gap-4/5, space-y-4/5 | gap-4/5, space-y-4/5 | No change — peers are evenly spaced |
  | Between major sections (header→content, content→nav) | my-10, mt-10 | my-12, mt-16 | Dramatic breath signals section boundary |

  **Must NOT do**:
  - Do NOT change spacing inside `answerRenderers.tsx` (content-level spacing is out of scope)
  - Do NOT change spacing inside `AnswerSection.tsx`
  - Do NOT change font sizes or weights to create hierarchy (spacing only)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Spatial design requiring visual judgment of rhythm and proportion
  - **Skills**: [`playwright`]
    - `playwright`: Needed for full-page screenshots to verify rhythm contrast
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Spacing values are precisely specified

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Wave 2 tasks, but visual context dependency on Task 1)
  - **Parallel Group**: Wave 3 (after Task 1, can overlap with Wave 2)
  - **Blocks**: Task 5
  - **Blocked By**: Task 1

  **References** (CRITICAL):

  **Pattern References**:
  - `src/pages/TopicPage.tsx:14-44` — Current page structure with spacing values to modify
  - `src/pages/LessonPage.tsx:30-59` — Current page structure; PrevNextNav spacing on line 57
  - `src/components/DividerOrnament.tsx:3` — Current `my-10` to change to `my-12`
  - `src/components/Header.tsx:11` — Current `space-y-5` to change to `space-y-4`
  - `src/components/PrevNextNav.tsx:12` — Current `mt-10` to change to `mt-16`

  **WHY Each Reference Matters**:
  - Each file+line pinpoints the exact Tailwind class to change. The executor should NOT search for spacing values — they're all listed here with before/after values.

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios (MANDATORY):**

  ```
  Scenario: Build succeeds after spacing changes
    Tool: Bash
    Preconditions: Task 1 completed
    Steps:
      1. Run: npx tsc --noEmit && npx vite build
      2. Assert: Exit code 0
    Expected Result: Clean build
    Evidence: Terminal output captured

  Scenario: Visual rhythm contrast visible on home page
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:5173
    Steps:
      1. Navigate to: http://localhost:5173/
      2. Wait for: page loaded (timeout: 5s)
      3. Screenshot full page: .sisyphus/evidence/task-4-homepage-rhythm.png
    Expected Result: Visible contrast between tight header group and generous gaps around divider
    Evidence: .sisyphus/evidence/task-4-homepage-rhythm.png

  Scenario: Visual rhythm contrast visible on lesson page
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:5173
    Steps:
      1. Navigate to: http://localhost:5173/lesson/noble-basics
      2. Wait for: page loaded (timeout: 5s)
      3. Scroll to bottom
      4. Assert: PrevNextNav has generous top margin (visible gap above it)
      5. Screenshot full page: .sisyphus/evidence/task-4-lesson-rhythm.png
    Expected Result: Clear "end of content" breath before PrevNextNav
    Evidence: .sisyphus/evidence/task-4-lesson-rhythm.png
  ```

  **Evidence to Capture:**
  - [ ] .sisyphus/evidence/task-4-homepage-rhythm.png
  - [ ] .sisyphus/evidence/task-4-lesson-rhythm.png

  **Commit**: YES (groups with Task 2 and 3 if in same wave)
  - Message: `style(spacing): introduce rhythmic contrast between major/minor section gaps`
  - Files: `src/components/DividerOrnament.tsx`, `src/components/Header.tsx`, `src/components/PrevNextNav.tsx`, `src/pages/LessonPage.tsx` (if needed)
  - Pre-commit: `npx tsc --noEmit && npx vite build`

---

- [x] 5. Polish Batch: Durations, Icons, Nav Weight, Error Boundary

  **What to do**:

  This task batches 6 minor observations into one closing pass. Each is a small, isolated change.

  **5a — AnswerSection warning/pitfalls icon color**:
  - In `AnswerSection.tsx:146`, the icon renders with `text-gold/80` for ALL section kinds
  - For `warning` and `pitfalls` kinds only, change the icon color to `text-amber-700/70` (slightly warmer, signals "attention" without breaking the calm palette)
  - Implementation: add a conditional in the render — `const iconColor = (section.kind === 'warning' || section.kind === 'pitfalls') ? 'text-amber-700/70' : 'text-gold/80'`
  - Note: `amber-700` is a built-in Tailwind color, no new tokens needed

  **5b — ErrorBoundary icon treatment**:
  - In `ErrorBoundary.tsx:35-38`, remove the wrapper `<div className="rounded-full bg-gold/10 p-4 text-gold">` around the AlertCircle icon
  - Place the icon inline next to the heading: `<h1>` gets the icon prepended as `<AlertCircle className="inline-block h-7 w-7 text-gold mr-2" />` before the text
  - Remove the `<div className="mb-6 flex justify-center">` container entirely
  - This eliminates the "large icon with rounded corners above heading" anti-pattern

  **5c — PrevNextNav visual weight reduction**:
  - In `PrevNextNav.tsx:16`, replace `noble-card` class on the prev link with: `rounded-xl border border-border/60 bg-ivory/60 backdrop-blur-[2px]`
  - In `PrevNextNav.tsx:31`, same replacement on the next link
  - Remove `hover:shadow-card` from both links (replace with `hover:border-gold/50`)
  - This makes nav links lighter than QA cards, establishing visual hierarchy

  **5d — Page transition duration**:
  - In `PageTransition.tsx:13`, change `duration: prefersReducedMotion ? 0.24 : 0.64` to `duration: prefersReducedMotion ? 0.15 : 0.38`
  - This makes page transitions feel snappier (380ms vs 640ms)

  **5e — AnswerSection flattening (cards → bordered regions)**:
  - In `AnswerSection.tsx:144`, replace the current styling pattern:
    - Current: `rounded-xl border p-4 sm:p-5` + per-kind `cardClassName` (all produce bordered rounded containers)
    - New: Replace with `border-l-2 pl-4 py-2 sm:pl-5 sm:py-3` + per-kind left-border color
  - Update `sectionMeta` cardClassName values to use left-border-only styling:
    - `summary`: `border-gold/50` (left border gold — highlights the key takeaway)
    - `details`: `border-border/80` (neutral left border)
    - `steps`: `border-border/80` (neutral)
    - `example`: `border-gold/35` (light gold)
    - `note`: `border-border/60` (lighter neutral)
    - `warning`: `border-amber-600/50` (warm, attention)
    - `quote`: `border-gold/50` (matches quote aesthetics)
    - `definition`: `border-border/80` (neutral)
    - `checklist`: `border-border/60` (lighter neutral)
    - `pitfalls`: `border-amber-600/50` (warm, attention, matches warning)
    - `dosdonts`: `border-border/80` (neutral)
    - `compare`: `border-border/80` (neutral)
    - `mnemonic`: `border-gold/50` (gold, special)
    - `references`: `border-border/50` (lightest — references are low priority)
  - This eliminates the third level of card nesting (answer sections are no longer cards-within-cards)
  - Note: Remove `bg-*` values from cardClassName — answer sections inherit their background from the QA card's own backdrop

  **Must NOT do**:
  - Do NOT change more than `warning` and `pitfalls` icon colors (leave other 12 kinds as `text-gold/80`)
  - Do NOT redesign the ErrorBoundary beyond icon placement
  - Do NOT change PrevNextNav layout or interaction (only visual weight)
  - Do NOT change page transition easing (only duration)
  - Do NOT add background colors to the new AnswerSection left-border style (inherit from parent)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Six small isolated changes with precise specifications, no design decisions needed
  - **Skills**: [`playwright`]
    - `playwright`: Needed for visual verification of all changes
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: All changes are precisely specified

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4 (final, after all other tasks)
  - **Blocks**: None (final task)
  - **Blocked By**: Tasks 1, 2, 3, 4

  **References** (CRITICAL):

  **Pattern References**:
  - `src/components/AnswerSection.tsx:37-108` — Full `sectionMeta` record to update (cardClassName values)
  - `src/components/AnswerSection.tsx:144-150` — Render function with current `rounded-xl border p-4` pattern to replace
  - `src/components/AnswerSection.tsx:146` — Icon color line to conditionally change for warning/pitfalls
  - `src/components/ErrorBoundary.tsx:32-56` — Error state render block with icon wrapper to simplify
  - `src/components/PrevNextNav.tsx:14-38` — Both nav links with `noble-card` class to replace
  - `src/components/PageTransition.tsx:13` — Duration value to change

  **WHY Each Reference Matters**:
  - AnswerSection sectionMeta — The full record (14 entries) must be updated consistently. Executor must change ALL `cardClassName` values to left-border variants, not just some.
  - ErrorBoundary render — The icon wrapper hierarchy (flex center > rounded-full bg > icon) must be understood to flatten correctly
  - PrevNextNav — Both links use `noble-card` — executor must find and replace BOTH instances
  - PageTransition — A single number change, but must preserve the ternary for reduced-motion

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios (MANDATORY):**

  ```
  Scenario: Build succeeds after all polish changes
    Tool: Bash
    Preconditions: Tasks 1-4 completed
    Steps:
      1. Run: npx tsc --noEmit && npx vite build
      2. Assert: Exit code 0
      3. Run: npx eslint .
      4. Assert: Exit code 0
    Expected Result: Clean build and lint
    Evidence: Terminal output captured

  Scenario: Answer sections use left-border instead of card containers
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:5173
    Steps:
      1. Navigate to: http://localhost:5173/lesson/noble-basics
      2. Click first QA card to expand
      3. Wait 500ms
      4. Assert: Answer sections do NOT have rounded borders (no rounded-xl class)
      5. Assert: Answer sections have left-border accent (border-l-2 visible)
      6. Screenshot: .sisyphus/evidence/task-5-answer-sections.png
    Expected Result: Answer sections are bordered regions, not nested cards
    Evidence: .sisyphus/evidence/task-5-answer-sections.png

  Scenario: Warning/pitfalls icons have distinct color
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, card with warning or pitfalls section expanded
    Steps:
      1. Navigate to: http://localhost:5173/lesson/noble-basics
      2. Click QA card 2 (contains "steps" and "pitfalls" sections)
      3. Wait 500ms
      4. Assert: Pitfalls section icon has amber-toned color (not gold)
      5. Screenshot: .sisyphus/evidence/task-5-warning-icon.png
    Expected Result: Warning/pitfalls icons visually distinct from gold
    Evidence: .sisyphus/evidence/task-5-warning-icon.png

  Scenario: PrevNextNav links are lighter than QA cards
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:5173
    Steps:
      1. Navigate to: http://localhost:5173/lesson/noble-basics
      2. Scroll to bottom
      3. Assert: PrevNextNav links do NOT have noble-card class
      4. Assert: PrevNextNav links have lighter border styling
      5. Screenshot: .sisyphus/evidence/task-5-nav-weight.png
    Expected Result: Nav links visually subordinate to QA cards
    Evidence: .sisyphus/evidence/task-5-nav-weight.png

  Scenario: Page transition feels responsive
    Tool: Bash
    Preconditions: Task completed
    Steps:
      1. Run: grep "duration:" src/components/PageTransition.tsx
      2. Assert: Contains "0.38" (not "0.64")
    Expected Result: Page transition duration reduced to 380ms
    Evidence: Terminal output captured

  Scenario: ErrorBoundary icon is inline, not large-and-centered
    Tool: Bash
    Preconditions: Task completed
    Steps:
      1. Run: grep "rounded-full bg-gold/10" src/components/ErrorBoundary.tsx
      2. Assert: Output is empty (wrapper removed)
      3. Run: grep "AlertCircle" src/components/ErrorBoundary.tsx
      4. Assert: Icon exists but inline with heading
    Expected Result: No rounded icon wrapper, icon is inline
    Evidence: Terminal output captured

  Scenario: Final comprehensive visual check — desktop
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:5173, all tasks complete
    Steps:
      1. Set viewport: 1440x900
      2. Navigate to: http://localhost:5173/
      3. Screenshot full page: .sisyphus/evidence/task-5-final-homepage-desktop.png
      4. Navigate to: http://localhost:5173/lesson/noble-basics
      5. Click cards 1, 3, and 5 to expand
      6. Wait 500ms after each click
      7. Screenshot full page: .sisyphus/evidence/task-5-final-lesson-desktop.png
    Expected Result: Full design refinement visible — no nested cards, differentiated badges, rhythmic spacing
    Evidence: .sisyphus/evidence/task-5-final-homepage-desktop.png, .sisyphus/evidence/task-5-final-lesson-desktop.png

  Scenario: Final comprehensive visual check — mobile
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:5173, all tasks complete
    Steps:
      1. Set viewport: 390x844
      2. Navigate to: http://localhost:5173/
      3. Screenshot full page: .sisyphus/evidence/task-5-final-homepage-mobile.png
      4. Navigate to: http://localhost:5173/lesson/noble-basics
      5. Click first card to expand
      6. Wait 500ms
      7. Screenshot full page: .sisyphus/evidence/task-5-final-lesson-mobile.png
    Expected Result: Mobile layout comfortable with all refinements applied
    Evidence: .sisyphus/evidence/task-5-final-homepage-mobile.png, .sisyphus/evidence/task-5-final-lesson-mobile.png
  ```

  **Evidence to Capture:**
  - [ ] .sisyphus/evidence/task-5-answer-sections.png
  - [ ] .sisyphus/evidence/task-5-warning-icon.png
  - [ ] .sisyphus/evidence/task-5-nav-weight.png
  - [ ] .sisyphus/evidence/task-5-final-homepage-desktop.png
  - [ ] .sisyphus/evidence/task-5-final-lesson-desktop.png
  - [ ] .sisyphus/evidence/task-5-final-homepage-mobile.png
  - [ ] .sisyphus/evidence/task-5-final-lesson-mobile.png

  **Commit**: YES
  - Message: `style(polish): flatten answer sections, adjust durations, reduce nav weight`
  - Files: `src/components/AnswerSection.tsx`, `src/components/ErrorBoundary.tsx`, `src/components/PrevNextNav.tsx`, `src/components/PageTransition.tsx`
  - Pre-commit: `npx tsc --noEmit && npx vite build`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `refactor(layout): remove full-page container card, redistribute backdrops per AGENTS.md` | Layout.tsx, TopicPage.tsx, LessonPage.tsx | `npx tsc --noEmit && npx vite build` |
| 2 | `refactor(ui): differentiate badge hierarchy — plain numbers, reserved pills for labels` | LessonCard.tsx, QACard.tsx, answerRenderers.tsx | `npx tsc --noEmit && npx vite build` |
| 3 | `refactor(qa-card): replace Framer Motion height animation with CSS grid-template-rows` | QACard.tsx, index.css | `npx tsc --noEmit && npx vite build` |
| 4 | `style(spacing): introduce rhythmic contrast between major/minor section gaps` | DividerOrnament.tsx, Header.tsx, PrevNextNav.tsx | `npx tsc --noEmit && npx vite build` |
| 5 | `style(polish): flatten answer sections, adjust durations, reduce nav weight` | AnswerSection.tsx, ErrorBoundary.tsx, PrevNextNav.tsx, PageTransition.tsx | `npx tsc --noEmit && npx vite build && npx eslint .` |

---

## Success Criteria

### Verification Commands
```bash
npx tsc --noEmit          # Expected: Exit code 0
npx vite build            # Expected: Exit code 0
npx eslint .              # Expected: Exit code 0
```

### Final Checklist
- [x] Three.js background visible between content blocks (not hidden behind full-page card)
- [x] Gold pill badge used only for topic subtitle and "Урок XX" label (2 uses, not 8)
- [x] QACard accordion uses CSS grid-template-rows (no Framer Motion height animation)
- [x] No `AnimatePresence` or `motion.div` in QACard.tsx
- [x] Spacing contrast: ≥48px between major sections, ≤20px within tight groups
- [x] Answer sections use left-border accent, not rounded card containers
- [x] Chevron rotation: 300ms (not 620ms)
- [x] Page transition: 380ms (not 640ms)
- [x] Warning/pitfalls icons: amber tone (not gold)
- [x] PrevNextNav: lighter than QA cards (no noble-card class)
- [x] ErrorBoundary: inline icon (no rounded wrapper)
- [x] Mobile layout comfortable at 390px (no horizontal overflow)
- [x] All accessibility attributes preserved (aria-expanded, aria-controls, focus-ring)
- [x] prefers-reduced-motion still respected
- [x] `index.html` still has `lang="ru"` and correct `<title>`
