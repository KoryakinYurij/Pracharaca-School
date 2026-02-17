# Noble Notes — Audit Fix Plan

## TL;DR

> **Quick Summary**: Fix 33 quality issues found in comprehensive audit across accessibility, responsive design, code quality, and performance — organized into 4 waves (Normalize → Harden → Optimize → Refactor).
> 
> **Deliverables**:
> - WCAG AA-compliant color contrast throughout (gold text, focus rings, metadata labels)
> - Complete ARIA coverage + reduced-motion respect in all animated components
> - Proper mobile touch targets and overflow guards
> - Error boundary + type safety hardening
> - Code-split Three.js for structural hygiene + unused font weight removal
> - AnswerSection component split for maintainability
> 
> **Estimated Effort**: Medium (~6-8 focused tasks)
> **Parallel Execution**: YES — 3 waves, Wave 1 has 3 parallel tasks
> **Critical Path**: Baseline → Normalize (3 parallel) → Harden → Optimize → Refactor

---

## Context

### Original Request
Fix all issues identified in comprehensive quality audit of Noble Notes project. Audit found 33 issues: 0 Critical, 3 High, 17 Medium, 13 Low across Accessibility (8), Performance (9), Responsive (4), Code Quality (9), Design (3).

### Interview Summary
**Key Decisions**:
- User confirmed all 33 issues should be addressed
- Grouping by audit-recommended commands: normalize, harden, optimize, refactor
- No test infrastructure exists — Agent-Executed QA via Playwright and build verification

**Research Findings**:
- Gold text contrast is ~2.6:1 (need 4.5:1 for WCAG AA)
- Focus ring contrast is ~2.0:1 (need 3:1 for non-text UI)
- Main JS chunk is 1,268 KB with 0 code splitting
- 36 woff2 font files in dist (browser only downloads needed subsets via unicode-range)
- Inter weight 700 imported but unused anywhere in components
- `backdrop-blur-sm` on Layout is required per AGENTS.md — must NOT be removed

### Metis Review
**Identified Gaps** (addressed):
- Missing `useReducedMotion()` in LessonCard.tsx and TopicPage.tsx stagger animation
- `ArrowUpRight` in LessonCard.tsx missing `aria-hidden="true"`
- Screen reader double-numbering: `<ol>` + visual number badges in renderSteps()
- Discriminated unions refactor is highest risk/lowest value — scoped down to optional
- Font subsetting has near-zero impact for local site — only remove unused Inter 700
- `backdrop-blur` on Layout is architecturally required by AGENTS.md
- JSON validation is unnecessary (Vite `import.meta.glob` with `eager: true` fails at build time)
- `frameloop="demand"` + setInterval invalidation is the correct Three.js pattern

---

## Work Objectives

### Core Objective
Fix all user-facing accessibility, responsive, and quality issues while preserving the "Noble" aesthetic and following AGENTS.md constraints.

### Concrete Deliverables
- Updated color tokens (new `--color-gold-dark` for accessible text)
- Focus ring with ≥3:1 contrast ratio
- Complete `aria-hidden` coverage on decorative icons
- `useReducedMotion` in all animated components
- Touch targets ≥44px on all interactive elements
- ErrorBoundary component wrapping App
- Code-split Three.js behind React.lazy
- Split AnswerSection.tsx render functions into sub-modules

### Definition of Done
- [x] `npm run lint && npm run build` exits with code 0
- [x] No new npm dependencies added
- [x] All gold text passes WCAG AA 4.5:1 contrast ratio
- [x] Focus ring passes WCAG 3:1 non-text contrast
- [x] Playwright screenshots captured for before/after comparison
- [x] Three.js in separate chunk (`dist/assets/*.js` count ≥ 2)

### Must Have
- WCAG AA compliance for all text contrast
- Visible focus indicators on all interactive elements
- `prefers-reduced-motion` respected in all animated components
- Build passes without errors or warnings

### Must NOT Have (Guardrails)
- NO new npm dependencies (no zod, ajv, axe-core — per AGENTS.md "only if truly needed")
- NO changes to JSON file structure (type changes are TypeScript-only)
- NO removal of `backdrop-blur-sm` from Layout.tsx (required by AGENTS.md)
- NO changes to Three.js animation mechanism (frameloop + interval is correct)
- NO component splitting except AnswerSection.tsx (all others are <65 lines)
- NO font subsetting work (browser unicode-range handles this; only remove unused weight)
- NO restructuring flat file layout (11 components + 2 pages is correct for this scale)
- NO bounce/elastic easing anywhere
- NO visual style changes beyond contrast fixes

---

## Verification Strategy

> **UNIVERSAL RULE: ZERO HUMAN INTERVENTION**
>
> ALL tasks MUST be verifiable WITHOUT any human action.
>
> **FORBIDDEN**:
> - "User manually tests..."
> - "User visually confirms..."
> - ANY step where a human must perform an action
>
> ALL verification is executed by the agent using tools.

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: None
- **Framework**: None

### Agent-Executed QA Scenarios (MANDATORY — ALL tasks)

> QA scenarios are the PRIMARY verification method.

**Playwright Setup Note:**
Playwright is already installed **globally** (see AGENTS.md). Use it directly:
- CLI: `playwright screenshot http://localhost:5173 screenshot.png`
- Do NOT run `npx playwright install chrome` — requires sudo and fails
- Browsers are at `~/.cache/ms-playwright/` and work automatically

**Verification Tool by Deliverable Type:**

| Type | Tool | How Agent Verifies |
|------|------|-------------------|
| **Color contrast** | Playwright | Navigate, screenshot, visually confirm via computed styles |
| **ARIA attributes** | Bash (grep) | Search codebase for missing attributes |
| **Build/Bundle** | Bash (npm) | Run build, check chunk count and sizes |
| **Reduced motion** | Playwright | Emulate `prefers-reduced-motion: reduce`, verify static |
| **Touch targets** | Playwright | Measure element dimensions via `boundingBox()` |

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 0 (Baseline — Start Immediately):
└── Task 1: Capture baseline screenshots + metrics

Wave 1 "Normalize" (After Wave 0):
├── Task 2: Color contrast + focus ring fixes
├── Task 3: ARIA + reduced-motion fixes
└── Task 4: Touch targets + overflow guards

Wave 2 "Harden" (After Wave 1):
└── Task 5: Error boundary + type safety

Wave 3 "Optimize" (After Wave 2):
└── Task 6: Code-split Three.js + remove unused font weight

Wave 4 "Refactor" (After Wave 3):
└── Task 7: Split AnswerSection into sub-renderers

Critical Path: Task 1 → Tasks 2,3,4 → Task 5 → Task 6 → Task 7
Parallel Speedup: ~30% faster than sequential (Wave 1 parallelism)
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 2, 3, 4 | None (must run first) |
| 2 | 1 | 5 | 3, 4 |
| 3 | 1 | 5 | 2, 4 |
| 4 | 1 | 5 | 2, 3 |
| 5 | 2, 3, 4 | 6 | None |
| 6 | 5 | 7 | None |
| 7 | 6 | None | None (final) |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Agents |
|------|-------|-------------------|
| 0 | 1 | `task(category="quick", load_skills=["playwright"])` |
| 1 | 2, 3, 4 | 3x parallel `task(category="visual-engineering", load_skills=["frontend-design"])` |
| 2 | 5 | `task(category="quick", load_skills=[])` |
| 3 | 6 | `task(category="unspecified-low", load_skills=[])` |
| 4 | 7 | `task(category="unspecified-low", load_skills=[])` |

---

## TODOs

- [x] 1. Capture Baseline Screenshots + Metrics

  **What to do**:
  - Start dev server: `npm run dev`
  - Capture Playwright screenshots of:
    - Topic page (`/`) — full page
    - Lesson page (`/lesson/noble-basics`) — full page with first card opened
    - Focus ring on QACard button (Tab to it, screenshot)
    - Badge text closeup (Header subtitle badge)
  - Capture build metrics:
    - `npm run build` output (chunk sizes)
    - `ls dist/assets/*.js | wc -l` → expect 1
    - `ls dist/assets/*.woff2 | wc -l` → expect 36
  - Save all screenshots to `.sisyphus/evidence/baseline-*`
  - Save build metrics to `.sisyphus/evidence/baseline-build.txt`

  **Must NOT do**:
  - Do NOT modify any files
  - Do NOT install dependencies

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`playwright`]
    - `playwright`: Needed for browser screenshots

  **Parallelization**:
  - **Can Run In Parallel**: NO (must complete before Wave 1)
  - **Parallel Group**: Wave 0 (solo)
  - **Blocks**: Tasks 2, 3, 4
  - **Blocked By**: None

  **References**:
  - `src/App.tsx:16-34` — Route definitions (`/` and `/lesson/:slug`)
  - `content/lessons/01-noble-basics.json:2` — First lesson slug: `noble-basics`
  - `src/components/QACard.tsx:19-24` — Button element to focus for ring screenshot
  - `src/components/Header.tsx:12` — Badge element for contrast screenshot

  **Acceptance Criteria**:
  - [ ] Screenshots saved: `baseline-topic.png`, `baseline-lesson.png`, `baseline-focus.png`, `baseline-badge.png`
  - [ ] Build metrics captured: chunk count = 1, woff2 count = 36

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Capture baseline screenshots
    Tool: Playwright (playwright skill)
    Preconditions: Dev server NOT running (agent starts it)
    Steps:
      1. Run: npm run dev (background)
      2. Wait for http://localhost:5173 to respond (timeout: 15s)
      3. Navigate to: http://localhost:5173/
      4. Wait for: .noble-card visible (timeout: 10s)
      5. Screenshot full page: .sisyphus/evidence/baseline-topic.png
      6. Navigate to: http://localhost:5173/lesson/noble-basics
      7. Wait for: article.noble-card visible
      8. Click: first button[aria-expanded="false"]
      9. Wait for: [aria-expanded="true"] visible (timeout: 3s)
      10. Screenshot full page: .sisyphus/evidence/baseline-lesson.png
      11. Press: Tab key until focus is on a button[aria-expanded]
      12. Screenshot focused element area: .sisyphus/evidence/baseline-focus.png
      13. Navigate to: http://localhost:5173/
      14. Screenshot the header badge element: .sisyphus/evidence/baseline-badge.png
    Expected Result: 4 screenshots captured
    Evidence: .sisyphus/evidence/baseline-*.png

  Scenario: Capture build metrics
    Tool: Bash
    Steps:
      1. npm run build 2>&1 | tee .sisyphus/evidence/baseline-build.txt
      2. ls dist/assets/*.js | wc -l → capture result
      3. ls dist/assets/*.woff2 | wc -l → capture result
    Expected Result: 1 JS file, 36 woff2 files
    Evidence: .sisyphus/evidence/baseline-build.txt
  ```

  **Commit**: NO (no changes made)

---

- [x] 2. Normalize — Color Contrast + Focus Ring

  **What to do**:
  1. Add `--color-gold-dark` CSS variable to `src/index.css`:
     ```css
     --color-gold-dark: 126 107 62;
     ```
     This is a darker gold that maintains the "muted gold" aesthetic while passing WCAG AA.
     Target contrast ratios:
     - Against gold/10+ivory background (~rgb(238,231,218)): ≥4.5:1
     - Against pure ivory (rgb(246,241,232)): ≥4.5:1
  2. Add `gold-dark` color to `tailwind.config.js`:
     ```js
     'gold-dark': 'rgb(var(--color-gold-dark) / <alpha-value>)',
     ```
  3. Update `.focus-ring` class in `src/index.css:46`:
     Replace `ring-gold/70` → `ring-gold-dark`
  4. Update gold **text** colors in badge/label elements (NOT decorative icon colors):
     - `src/components/Header.tsx:12` — `text-gold` → `text-gold-dark`
     - `src/pages/LessonPage.tsx:19` — `text-gold` → `text-gold-dark`
     - `src/pages/LessonPage.tsx:41` — `text-gold` → `text-gold-dark`
     - `src/components/QACard.tsx:26` — `text-gold` → `text-gold-dark` (the index number)
     - `src/components/LessonCard.tsx:17` — `text-gold` → `text-gold-dark` (the order number)
     - `src/components/AnswerSection.tsx:138` — `text-gold` → `text-gold-dark` (step numbers)
     - `src/components/AnswerSection.tsx:317` — `text-gold` → `text-gold-dark` (mnemonic badge text)
  5. Fix low-contrast metadata text:
     - `src/components/LessonCard.tsx:28` — `text-graphite/50` → `text-graphite/70`
     - `src/components/PrevNextNav.tsx:20` — `text-graphite/50` → `text-graphite/70`
     - `src/components/PrevNextNav.tsx:34` — `text-graphite/50` → `text-graphite/70`
     - `src/pages/TopicPage.tsx:17` — `text-graphite/55` → `text-graphite/70`
  6. Leave decorative icon tints (`text-gold/80`, `text-gold/70`) unchanged — decorative elements don't need text contrast compliance.

  **Must NOT do**:
  - Do NOT change `--color-gold` itself (keep original for borders, backgrounds, decorative use)
  - Do NOT change icon tint colors (`text-gold/80` on lucide icons)
  - Do NOT remove backdrop-blur from Layout
  - Do NOT change border colors (`border-gold/45` etc.)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-design`]
    - `frontend-design`: Color system changes need design awareness to not break aesthetic

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 3, 4)
  - **Blocks**: Task 5
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `src/index.css:5-11` — Existing CSS custom property pattern (`--color-X: R G B`)
  - `tailwind.config.js:7-11` — Existing Tailwind color registration pattern
  - `src/index.css:45-47` — Existing `.focus-ring` class definition

  **Audit Data** (computed contrast values):
  - Current gold `rgb(165,141,92)` on gold/10+ivory `≈rgb(238,231,218)`: ~2.6:1 ❌
  - Target gold-dark `rgb(126,107,62)` on same background: ~4.7:1 ✅
  - Current focus ring gold/70 composited on ivory: ~2.0:1 ❌
  - Target focus ring gold-dark on ivory: ~4.7:1 ✅
  - Current `text-graphite/50` on ivory: ~2.9:1 ❌
  - Target `text-graphite/70` on ivory: ~5.5:1 ✅

  **Acceptance Criteria**:
  - [ ] `--color-gold-dark` defined in `src/index.css`
  - [ ] `gold-dark` registered in `tailwind.config.js`
  - [ ] `.focus-ring` uses `ring-gold-dark` (not `ring-gold/70`)
  - [ ] All badge/label text uses `text-gold-dark`
  - [ ] All metadata text uses `text-graphite/70` minimum
  - [ ] `npm run lint && npm run build` → exit code 0
  - [ ] Decorative icon colors (`text-gold/80`) unchanged

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Verify color tokens are defined
    Tool: Bash (grep)
    Steps:
      1. grep "gold-dark" src/index.css → should match --color-gold-dark
      2. grep "gold-dark" tailwind.config.js → should match color registration
      3. grep "ring-gold/70" src/index.css → should return NO matches (replaced)
      4. grep "ring-gold-dark" src/index.css → should match in .focus-ring
    Expected Result: New token defined, old focus ring removed
    Evidence: grep output

  Scenario: Verify no text-gold on badges
    Tool: Bash (grep)
    Steps:
      1. grep -n "text-gold\"" src/components/Header.tsx → should return 0 matches
      2. grep -n "text-gold\"" src/components/QACard.tsx → should return 0 matches for badge
      3. grep -n "text-gold-dark" src/components/Header.tsx → should have match
    Expected Result: All badge text uses gold-dark
    Evidence: grep output

  Scenario: Visual verification of color changes
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:5173
    Steps:
      1. Navigate to: http://localhost:5173/
      2. Wait for: header badge visible
      3. Screenshot: .sisyphus/evidence/task-2-topic-after.png
      4. Navigate to: http://localhost:5173/lesson/noble-basics
      5. Wait for: article.noble-card visible
      6. Screenshot: .sisyphus/evidence/task-2-lesson-after.png
      7. Tab to first accordion button
      8. Screenshot focused area: .sisyphus/evidence/task-2-focus-after.png
    Expected Result: Colors are darker gold but still muted; focus ring clearly visible
    Evidence: .sisyphus/evidence/task-2-*.png

  Scenario: Build passes
    Tool: Bash
    Steps:
      1. npm run lint && npm run build
      2. Assert: exit code 0
    Expected Result: Clean build
    Evidence: build output
  ```

  **Commit**: YES
  - Message: `fix(a11y): improve color contrast for gold text and focus ring to meet WCAG AA`
  - Files: `src/index.css`, `tailwind.config.js`, `src/components/Header.tsx`, `src/components/QACard.tsx`, `src/components/LessonCard.tsx`, `src/components/PrevNextNav.tsx`, `src/components/AnswerSection.tsx`, `src/pages/LessonPage.tsx`, `src/pages/TopicPage.tsx`
  - Pre-commit: `npm run lint && npm run build`

---

- [x] 3. Normalize — ARIA + Reduced Motion

  **What to do**:
  1. Add `aria-hidden="true"` to `ArrowUpRight` icon in `src/components/LessonCard.tsx:23`:
     ```tsx
     <ArrowUpRight className="..." aria-hidden="true" />
     ```
  2. Fix screen reader double-numbering in `src/components/AnswerSection.tsx:138`:
     Add `aria-hidden="true"` to the visual number badge `<span>` inside renderSteps:
     ```tsx
     <span aria-hidden="true" className="mt-0.5 inline-flex h-6 w-6 ...">
       {index + 1}
     </span>
     ```
     The `<ol><li>` semantic numbering will still work for screen readers.
  3. Add `useReducedMotion()` to `src/components/LessonCard.tsx`:
     ```tsx
     import { motion, useReducedMotion } from 'framer-motion'
     // ...
     const prefersReducedMotion = useReducedMotion()
     // ...
     <motion.article whileHover={prefersReducedMotion ? undefined : { y: -3 }} ...>
     ```
  4. Add `useReducedMotion()` to `src/pages/TopicPage.tsx`:
     Suppress stagger animation when reduced motion is preferred:
     ```tsx
     import { motion, useReducedMotion } from 'framer-motion'
     // ...
     const prefersReducedMotion = useReducedMotion()
     // Conditionally apply stagger
     variants={prefersReducedMotion ? undefined : { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
     ```
     And suppress individual card fade-in:
     ```tsx
     variants={prefersReducedMotion ? undefined : { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
     ```

  **Must NOT do**:
  - Do NOT change the accordion height animation mechanism in QACard.tsx
  - Do NOT change PageTransition.tsx (already has useReducedMotion)
  - Do NOT change BackgroundShapes.tsx (already has useReducedMotion)
  - Do NOT add reduced-motion checks to ChevronDown rotation in QACard (CSS transform, lightweight)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-design`]
    - `frontend-design`: Motion/ARIA changes need UX awareness

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 4)
  - **Blocks**: Task 5
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `src/components/QACard.tsx:37` — Existing `aria-hidden="true"` on ChevronDown icon (copy this pattern)
  - `src/components/PrevNextNav.tsx:18,37` — Existing `aria-hidden="true"` on ArrowLeft/ArrowRight
  - `src/components/PageTransition.tsx:1-5` — Existing `useReducedMotion()` pattern (import + hook call)
  - `src/components/BackgroundShapes.tsx:97` — Existing reduced motion conditional check

  **Acceptance Criteria**:
  - [ ] `ArrowUpRight` in LessonCard.tsx has `aria-hidden="true"`
  - [ ] Step number badge in AnswerSection.tsx has `aria-hidden="true"`
  - [ ] `LessonCard.tsx` imports and uses `useReducedMotion()`
  - [ ] `TopicPage.tsx` imports and uses `useReducedMotion()`
  - [ ] Under reduced motion: no stagger animation, no hover lift
  - [ ] `npm run lint && npm run build` → exit code 0

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Verify aria-hidden attributes
    Tool: Bash (grep)
    Steps:
      1. grep "aria-hidden" src/components/LessonCard.tsx → should match ArrowUpRight line
      2. grep "aria-hidden" src/components/AnswerSection.tsx → should match step number span
    Expected Result: Both decorative elements have aria-hidden
    Evidence: grep output

  Scenario: Verify reduced motion is imported
    Tool: Bash (grep)
    Steps:
      1. grep "useReducedMotion" src/components/LessonCard.tsx → should match
      2. grep "useReducedMotion" src/pages/TopicPage.tsx → should match
    Expected Result: Both files use the hook
    Evidence: grep output

  Scenario: Verify reduced motion behavior
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:5173
    Steps:
      1. Set: page.emulateMedia({ reducedMotion: 'reduce' })
      2. Navigate to: http://localhost:5173/
      3. Wait for: section[aria-label="Список уроков"] visible
      4. Assert: lesson cards are immediately visible (no stagger delay)
      5. Hover over first lesson card link
      6. Assert: card does NOT move vertically (no y:-3 transform)
      7. Screenshot: .sisyphus/evidence/task-3-reduced-motion.png
    Expected Result: No animations under reduced-motion preference
    Evidence: .sisyphus/evidence/task-3-reduced-motion.png

  Scenario: Build passes
    Tool: Bash
    Steps:
      1. npm run lint && npm run build
      2. Assert: exit code 0
    Expected Result: Clean build
  ```

  **Commit**: YES
  - Message: `fix(a11y): add aria-hidden to decorative icons and reduced-motion guards`
  - Files: `src/components/LessonCard.tsx`, `src/components/AnswerSection.tsx`, `src/pages/TopicPage.tsx`
  - Pre-commit: `npm run lint && npm run build`

---

- [x] 4. Normalize — Touch Targets + Overflow Guards

  **What to do**:
  1. Increase touch target on "К урокам" back links in `src/pages/LessonPage.tsx`:
     - Line 19 (not-found state): Add `min-h-11` (44px) to the link classes
     - Line 34 (normal state): Add `min-h-11` to the link classes
  2. Add overflow protection to flex text containers:
     - `src/components/LessonCard.tsx:21` — Add `min-w-0` to the `<div>` wrapping title + arrow
     - `src/components/LessonCard.tsx:22` — Add `min-w-0 break-words` to the `<h2>` element
     - `src/components/PrevNextNav.tsx:19` — Add `min-w-0` to the text `<span>` container
     - `src/components/PrevNextNav.tsx:33` — Add `min-w-0` to the text `<span>` container
  3. Add word-break to compare table cells in `src/components/AnswerSection.tsx`:
     - Line 264: Add `break-words` class to `<table>` cell content
     - Or add `[overflow-wrap:anywhere]` to `<td>` elements

  **Must NOT do**:
  - Do NOT change QACard button size (already properly sized with px-5 py-5)
  - Do NOT change LessonCard link area (already full-card clickable with p-6)
  - Do NOT change the visual style/appearance of any element
  - Do NOT add complex responsive breakpoints

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-design`]
    - `frontend-design`: Layout/spacing changes need design awareness

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3)
  - **Blocks**: Task 5
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `src/components/QACard.tsx:24` — Example of properly sized touch target (`px-5 py-5` = well above 44px)
  - `src/components/LessonCard.tsx:15` — Example of full-card clickable area (`p-6`)
  - `src/components/AnswerSection.tsx:263` — Existing `overflow-x-auto` on compare table wrapper

  **Acceptance Criteria**:
  - [ ] Both "К урокам" links have `min-h-11` class
  - [ ] Text containers in LessonCard have `min-w-0`
  - [ ] Text containers in PrevNextNav have `min-w-0`
  - [ ] Compare table cells have word-break protection
  - [ ] `npm run lint && npm run build` → exit code 0

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Verify touch target size
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:5173
    Steps:
      1. Navigate to: http://localhost:5173/lesson/noble-basics
      2. Wait for: a:has-text("К урокам") visible
      3. Get bounding box of first "К урокам" link
      4. Assert: height >= 44px
      5. Screenshot: .sisyphus/evidence/task-4-touch-target.png
    Expected Result: Touch target meets 44px minimum
    Evidence: .sisyphus/evidence/task-4-touch-target.png

  Scenario: Verify overflow protection
    Tool: Bash (grep)
    Steps:
      1. grep "min-w-0" src/components/LessonCard.tsx → should have match
      2. grep "min-w-0" src/components/PrevNextNav.tsx → should have match
      3. grep "break-words\|overflow-wrap" src/components/AnswerSection.tsx → should match in table area
    Expected Result: Overflow guards in place
    Evidence: grep output

  Scenario: Build passes
    Tool: Bash
    Steps:
      1. npm run lint && npm run build
      2. Assert: exit code 0
    Expected Result: Clean build
  ```

  **Commit**: YES (groups with Task 2, 3)
  - Message: `fix(responsive): improve touch targets and add overflow guards`
  - Files: `src/pages/LessonPage.tsx`, `src/components/LessonCard.tsx`, `src/components/PrevNextNav.tsx`, `src/components/AnswerSection.tsx`
  - Pre-commit: `npm run lint && npm run build`

---

- [x] 5. Harden — Error Boundary + Type Safety

  **What to do**:
  1. Create `src/components/ErrorBoundary.tsx`:
     - Class component (error boundaries must be class components)
     - Catches render errors from children
     - Shows minimal fallback UI: "Что-то пошло не так" + reload button
     - Styled to match noble aesthetic (font-display heading, ivory bg, gold border)
     - Follow existing component patterns (no external deps)
  2. Wrap `<App />` in `src/main.tsx` with `<ErrorBoundary>`:
     ```tsx
     <StrictMode>
       <ErrorBoundary>
         <App />
       </ErrorBoundary>
     </StrictMode>
     ```
  3. Add simple type guard in `src/content/loader.ts`:
     - NO external library (no zod). Simple function that checks shape.
     - Only validate at the loader level, not at component level.
     - Example: `function isLessonData(data: unknown): data is LessonData`
     - Validate: has `slug` (string), `order` (number), `title` (string), `cards` (array)
     - Throw descriptive error if validation fails (include which file is malformed)
  4. Fix mutable array exposure in `src/content/loader.ts:25`:
     - Change return type to `readonly LessonData[]` or return `lessons.slice()`

  **Must NOT do**:
  - Do NOT add npm dependencies (no zod, ajv, io-ts)
  - Do NOT add retry logic to ErrorBoundary
  - Do NOT add error reporting/telemetry
  - Do NOT change the LessonData/TopicData types themselves
  - Do NOT validate individual AnswerSection fields (too granular for static content)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
    - No special skills needed — straightforward TypeScript

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (sequential after Wave 1)
  - **Blocks**: Task 6
  - **Blocked By**: Tasks 2, 3, 4

  **References**:

  **Pattern References**:
  - `src/pages/LessonPage.tsx:13-25` — Existing error state pattern ("Урок не найден" with styled fallback)
  - `src/content/loader.ts:18-19` — Existing `throw new Error()` pattern for missing topic
  - `src/content/types.ts:47-53` — LessonData interface definition to validate against
  - `src/components/Layout.tsx:4-15` — Styling patterns to follow for ErrorBoundary fallback

  **External References**:
  - React docs: Error boundaries must be class components (no hooks equivalent)

  **Acceptance Criteria**:
  - [ ] `src/components/ErrorBoundary.tsx` exists and exports `ErrorBoundary`
  - [ ] `src/main.tsx` wraps `<App />` with `<ErrorBoundary>`
  - [ ] `src/content/loader.ts` has `isLessonData` type guard function
  - [ ] `getLessons()` returns immutable reference (readonly or slice)
  - [ ] `npm run lint && npm run build` → exit code 0
  - [ ] NO new entries in `package.json` dependencies

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Verify ErrorBoundary exists and is used
    Tool: Bash (grep)
    Steps:
      1. grep "ErrorBoundary" src/components/ErrorBoundary.tsx → should exist
      2. grep "ErrorBoundary" src/main.tsx → should be imported and used
      3. grep "componentDidCatch\|getDerivedStateFromError" src/components/ErrorBoundary.tsx → should match
    Expected Result: ErrorBoundary properly implemented
    Evidence: grep output

  Scenario: Verify type guard exists
    Tool: Bash (grep)
    Steps:
      1. grep "isLessonData\|isTopicData" src/content/loader.ts → should match
      2. grep "readonly\|\.slice()" src/content/loader.ts → should match in getLessons
    Expected Result: Type guard and immutable return in place
    Evidence: grep output

  Scenario: Verify no new dependencies
    Tool: Bash
    Steps:
      1. git diff package.json (or compare with known state)
      2. Assert: no new entries in dependencies or devDependencies
    Expected Result: package.json unchanged
    Evidence: diff output

  Scenario: Build passes
    Tool: Bash
    Steps:
      1. npm run lint && npm run build
      2. Assert: exit code 0
    Expected Result: Clean build
  ```

  **Commit**: YES
  - Message: `feat(harden): add error boundary and content type guards`
  - Files: `src/components/ErrorBoundary.tsx`, `src/main.tsx`, `src/content/loader.ts`
  - Pre-commit: `npm run lint && npm run build`

---

- [x] 6. Optimize — Code-Split Three.js + Remove Unused Font

  **What to do**:
  1. Lazy-load `BackgroundScene` in `src/components/Layout.tsx`:
     ```tsx
     import { lazy, Suspense } from 'react'
     const BackgroundScene = lazy(() => import('./BackgroundScene'))
     // ...
     <Suspense fallback={null}>
       <BackgroundScene />
     </Suspense>
     ```
     Convert `BackgroundScene` to default export if needed.
  2. Remove unused Inter 700 weight import from `src/main.tsx`:
     Delete line 6: `import '@fontsource/inter/700.css'`
     Rationale: No component uses `font-bold` (weight 700). Only `font-semibold` (600) and `font-medium` (500) are used.
  3. Verify Vite produces multiple chunks:
     - After build: `ls dist/assets/*.js | wc -l` should be ≥ 2
     - Main chunk should be noticeably smaller (Three.js ~500KB moved to separate chunk)

  **Must NOT do**:
  - Do NOT add loading spinners or skeleton screens for the background (use `fallback={null}`)
  - Do NOT add per-route code splitting (only 2 pages, not worth it)
  - Do NOT configure Vite manualChunks (lazy import is sufficient)
  - Do NOT do font subsetting (browser unicode-range handles this for local site)
  - Do NOT change `frameloop="demand"` or the setInterval pattern
  - Do NOT remove Playfair Display weights (both 500 and 700 are used)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: []
    - Straightforward import changes, no special skills needed

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (sequential)
  - **Blocks**: Task 7
  - **Blocked By**: Task 5

  **References**:

  **Pattern References**:
  - `src/components/Layout.tsx:1-2` — Current static import of BackgroundScene
  - `src/components/BackgroundScene.tsx:4` — BackgroundScene function (needs default export)
  - `src/main.tsx:3-8` — Current font imports (line 6 is the one to remove)

  **Verification Data**:
  - Before: 1 JS chunk, ~1268 KB raw, 36 woff2 files
  - After: ≥2 JS chunks, main chunk <800 KB raw, 32 woff2 files (4 fewer from Inter 700)

  **Acceptance Criteria**:
  - [ ] BackgroundScene loaded via `React.lazy()` with `Suspense fallback={null}`
  - [ ] `@fontsource/inter/700.css` import removed from main.tsx
  - [ ] `npm run build` → ≥2 JS chunks in dist/assets/
  - [ ] `npm run build` → ≤34 woff2 files in dist/assets/
  - [ ] Main chunk size < 800 KB (raw, before gzip)
  - [ ] `npm run lint && npm run build` → exit code 0
  - [ ] Site renders correctly (Three.js background loads after main content)

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Verify code splitting worked
    Tool: Bash
    Steps:
      1. npm run build
      2. ls dist/assets/*.js | wc -l → assert >= 2
      3. ls dist/assets/*.woff2 | wc -l → assert <= 34
      4. ls -la dist/assets/*.js → check sizes, main chunk < 800KB
    Expected Result: Multiple chunks, smaller main bundle
    Evidence: Build output + file listing

  Scenario: Verify font import removed
    Tool: Bash (grep)
    Steps:
      1. grep "inter/700" src/main.tsx → should return 0 matches
      2. grep "inter/400\|inter/500\|inter/600" src/main.tsx → should return 3 matches
    Expected Result: Inter 700 gone, 400/500/600 remain
    Evidence: grep output

  Scenario: Verify lazy loading works
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:5173
    Steps:
      1. Navigate to: http://localhost:5173/
      2. Wait for: main content visible (timeout: 10s)
      3. Wait for: canvas element visible (timeout: 15s) — Three.js loads after
      4. Screenshot: .sisyphus/evidence/task-6-lazy-loaded.png
    Expected Result: Page loads, then 3D background appears
    Evidence: .sisyphus/evidence/task-6-lazy-loaded.png
  ```

  **Commit**: YES
  - Message: `perf(optimize): lazy-load Three.js and remove unused Inter 700 weight`
  - Files: `src/components/Layout.tsx`, `src/components/BackgroundScene.tsx`, `src/main.tsx`
  - Pre-commit: `npm run lint && npm run build`

---

- [x] 7. Refactor — Split AnswerSection Renderers

  **What to do**:
  1. Extract render functions from `src/components/AnswerSection.tsx` into a new file `src/components/answerRenderers.tsx`:
     - Move functions: `renderText`, `renderSteps`, `renderDefinition`, `renderChecklist`, `renderPitfalls`, `renderColumns`, `renderDosDonts`, `renderCompare`, `renderMnemonic`, `renderReferences`
     - Move helper functions: `getText`, `normalizeItems`, `splitBodyLines`, `getSectionItems`
     - Move the `EMPTY_STATE` constant
     - Keep in AnswerSection.tsx: `sectionMeta` config, `AnswerSection` component, `renderBodyByKind` switch
  2. Update imports in `src/components/AnswerSection.tsx` to import renderers from new file
  3. Normalize inconsistent opacity value: `text-graphite/88` → `text-graphite/90` in AnswerSection.tsx line 320

  **Must NOT do**:
  - Do NOT convert to discriminated unions (highest risk, lowest value per Metis)
  - Do NOT split into per-kind files (too granular for 14 renderers)
  - Do NOT change any rendering logic or visual output
  - Do NOT create nested directory structure (keep flat in components/)
  - Do NOT split any other component (all others are <65 lines)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: []
    - Straightforward extract-function refactor

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4 (final, sequential)
  - **Blocks**: None (final task)
  - **Blocked By**: Task 6

  **References**:

  **Pattern References**:
  - `src/components/AnswerSection.tsx:97-343` — All functions to extract
  - `src/components/AnswerSection.tsx:345-372` — `renderBodyByKind` switch (stays in AnswerSection.tsx)
  - `src/components/AnswerSection.tsx:374-387` — `AnswerSection` component (stays)
  - `src/content/types.ts` — Type imports needed by renderer functions

  **Acceptance Criteria**:
  - [ ] `src/components/answerRenderers.tsx` exists with all render/helper functions
  - [ ] `src/components/AnswerSection.tsx` imports from `./answerRenderers`
  - [ ] `src/components/AnswerSection.tsx` is significantly shorter (< 120 lines)
  - [ ] `src/components/answerRenderers.tsx` contains all extraction (< 280 lines)
  - [ ] `text-graphite/88` replaced with `text-graphite/90`
  - [ ] `npm run lint && npm run build` → exit code 0
  - [ ] Visual output is IDENTICAL (no rendering changes)

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Verify file split
    Tool: Bash
    Steps:
      1. wc -l src/components/AnswerSection.tsx → should be < 120 lines
      2. wc -l src/components/answerRenderers.tsx → should exist, < 280 lines
      3. grep "renderSteps\|renderDefinition\|renderChecklist" src/components/answerRenderers.tsx → should match
      4. grep "import.*answerRenderers" src/components/AnswerSection.tsx → should match
    Expected Result: Functions properly extracted
    Evidence: wc + grep output

  Scenario: Visual regression check
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:5173
    Steps:
      1. Navigate to: http://localhost:5173/lesson/noble-basics
      2. Click all accordion buttons to open all cards
      3. Wait for all animations to complete (2s)
      4. Screenshot full page: .sisyphus/evidence/task-7-all-cards.png
      5. Compare visually with .sisyphus/evidence/baseline-lesson.png
    Expected Result: Identical rendering
    Evidence: .sisyphus/evidence/task-7-all-cards.png

  Scenario: Build passes
    Tool: Bash
    Steps:
      1. npm run lint && npm run build
      2. Assert: exit code 0
    Expected Result: Clean build
  ```

  **Commit**: YES
  - Message: `refactor(components): extract AnswerSection renderers into separate module`
  - Files: `src/components/AnswerSection.tsx`, `src/components/answerRenderers.tsx`
  - Pre-commit: `npm run lint && npm run build`

---

## Commit Strategy

| After Task | Message | Key Files | Verification |
|------------|---------|-----------|--------------|
| 2 | `fix(a11y): improve color contrast for gold text and focus ring to meet WCAG AA` | index.css, tailwind.config.js, 7 components | `npm run lint && npm run build` |
| 3 | `fix(a11y): add aria-hidden to decorative icons and reduced-motion guards` | LessonCard, AnswerSection, TopicPage | `npm run lint && npm run build` |
| 4 | `fix(responsive): improve touch targets and add overflow guards` | LessonPage, LessonCard, PrevNextNav, AnswerSection | `npm run lint && npm run build` |
| 5 | `feat(harden): add error boundary and content type guards` | ErrorBoundary.tsx, main.tsx, loader.ts | `npm run lint && npm run build` |
| 6 | `perf(optimize): lazy-load Three.js and remove unused Inter 700 weight` | Layout, BackgroundScene, main.tsx | `npm run lint && npm run build` |
| 7 | `refactor(components): extract AnswerSection renderers into separate module` | AnswerSection, answerRenderers.tsx | `npm run lint && npm run build` |

---

## Success Criteria

### Verification Commands
```bash
# Build must pass
npm run lint && npm run build  # Expected: exit code 0

# Code splitting worked
ls dist/assets/*.js | wc -l  # Expected: >= 2

# Font reduction
ls dist/assets/*.woff2 | wc -l  # Expected: <= 34

# No new dependencies
cat package.json | grep -c "dependencies" # Expected: unchanged count

# Color token exists
grep "gold-dark" src/index.css  # Expected: --color-gold-dark defined
grep "gold-dark" tailwind.config.js  # Expected: registered

# ARIA coverage
grep -r "ArrowUpRight" src/ --include="*.tsx" | grep -v "aria-hidden" | wc -l  # Expected: 0

# Reduced motion coverage
grep -r "useReducedMotion\|prefersReducedMotion" src/ --include="*.tsx" | wc -l  # Expected: >= 5
```

### Final Checklist
- [x] All "Must Have" present (WCAG AA contrast, focus indicators, reduced-motion, error boundary)
- [x] All "Must NOT Have" absent (no new deps, no removed backdrop-blur, no changed JSON structure)
- [x] All 6 commits created with proper messages
- [x] Before/after screenshots captured in `.sisyphus/evidence/`
- [x] `npm run lint && npm run build` passes clean
