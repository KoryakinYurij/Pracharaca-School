# Редизайн страницы тем — Multi-Topic Homepage

## TL;DR

> **Quick Summary**: Реструктуризация Noble Notes из одно-темной архитектуры в мульти-темную: новая listing-страница с responsive grid карточек тем, реструктуризация контента в директории по темам, обновление роутинга и навигации.
> 
> **Deliverables**:
> - Новый компонент `TopicsListingPage` — responsive grid (1→2→3 колонки)
> - Новый компонент `TopicCard` — название + описание + кол-во уроков
> - Реструктуризация `content/` — директории по темам
> - Обновлённый `loader.ts` — мульти-темное API
> - Обновлённый роутинг: `/` → listing, `/topic/:slug` → тема, `/topic/:slug/lesson/:lessonSlug` → урок
> - Все 5 захардкоженных навигационных ссылок обновлены
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES — 4 waves
> **Critical Path**: Branch → Content Migration → Types+Loader → Pages+Routing → QA

---

## Context

### Original Request
Пользователь хочет усовершенствовать дизайн страницы с темами: улучшить расположение элементов, сделать доступнее и понятнее. Тем будет больше. Нужна отдельная ветка в git.

### Interview Summary
**Key Discussions**:
- **Масштаб**: до 10 тем в ближайшей перспективе → простой grid без категорий
- **Карточка темы**: средний уровень — название + описание + кол-во уроков
- **Hero-секция**: НЕТ — сразу к списку тем
- **Тестирование**: без юнит-тестов, QA через Playwright

**Research Findings**:
- Текущая архитектура рассчитана на 1 тему — `topic.json` = один объект, `loader.ts` ожидает единственную тему
- `TopicPage.tsx` вызывает `getTopic()` и `getLessons()` на уровне модуля (строки 7-8) — невозможно параметризировать
- 5 захардкоженных навигационных ссылок: `LessonPage.tsx:18,34`, `PrevNextNav.tsx:15,30`, `LessonCard.tsx:16`
- Существующие CSS классы `noble-card` и `focus-ring` уже содержат все нужные стили для карточек
- `LessonCard.tsx` — идеальный шаблон для нового `TopicCard`
- Responsive grid: `max-w-5xl` (1024px) → 3 колонки по ~325px — достаточно

### Metis Review
**Identified Gaps** (addressed):
- Архитектура контента для мульти-тем: → директории `content/topics/{slug}/`
- Источник slug тем: → из имени директории
- Порядок тем: → поле `order` в TopicData
- Module-level вызовы данных: → перенести внутрь компонента
- Русские склонения: → helper для "урок/урока/уроков"
- Обработка старых URL `/lesson/:slug`: → redirect на `/` (локальный сайт)
- Заголовок listing-страницы: → минимальная метка "Темы" без hero

---

## Work Objectives

### Core Objective
Превратить одно-темный сайт в мульти-темный с красивой listing-страницей, сохраняя весь существующий функционал и дизайн-систему.

### Concrete Deliverables
- `src/pages/TopicsListingPage.tsx` — новая главная страница
- `src/components/TopicCard.tsx` — карточка темы
- `src/utils/pluralize.ts` — helper для русских склонений
- `content/topics/{slug}/meta.json` — метаданные тем (реструктуризация)
- `content/topics/{slug}/lessons/*.json` — уроки по темам (миграция)
- Обновлённые: `types.ts`, `loader.ts`, `App.tsx`, `TopicPage.tsx`, `LessonPage.tsx`, `LessonCard.tsx`, `PrevNextNav.tsx`
- Обновлённый: `docs/content-schema.md`

### Definition of Done
- [x] `npm run build` завершается без ошибок (exit code 0)
- [x] `npm run lint` завершается без ошибок (exit code 0)
- [x] `npm run dev` запускается, все страницы доступны
- [x] Навигация homepage → topic → lesson → back работает полностью
- [x] Responsive grid корректен на 375px / 768px / 1280px
- [x] Все работы выполнены на отдельной ветке

### Must Have
- Responsive grid карточек тем (1→2→3 колонки)
- Карточки с названием, описанием и кол-вом уроков
- Директория-на-тему структура контента
- Рабочая навигация на всех уровнях глубины
- Семантический HTML: `<article>`, `<ul>`, `<section>`, `<h1>`-`<h2>` иерархия
- aria-атрибуты, focus-visible стили, тач-таргеты ≥44px
- Framer Motion stagger-анимация + prefers-reduced-motion
- Работа на отдельной git-ветке

### Must NOT Have (Guardrails)
- ❌ Никаких новых npm-зависимостей
- ❌ Никакого поиска, фильтрации, категорий
- ❌ Никаких иконок/изображений на карточках тем — только текст
- ❌ Никаких breadcrumbs — только кнопка "назад"
- ❌ Никаких placeholder/демо тем — только реструктуризация существующего контента
- ❌ Никаких изменений в `noble-card` / `focus-ring` CSS классах
- ❌ Никаких изменений в `Layout.tsx` (ширина контейнера, BackgroundScene)
- ❌ Никаких градиентов, неона, тяжёлых теней
- ❌ Не оставлять старое одно-темное API рядом с новым
- ❌ Не менять тему Three.js фона
- ❌ Не over-design пустые/error состояния — повторить паттерн из LessonPage

---

## Verification Strategy (MANDATORY)

> **UNIVERSAL RULE: ZERO HUMAN INTERVENTION**
>
> ALL tasks in this plan MUST be verifiable WITHOUT any human action.
> This is NOT conditional — it applies to EVERY task, regardless of test strategy.

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: None
- **Framework**: N/A

### Agent-Executed QA Scenarios (MANDATORY — ALL tasks)

> QA scenarios are the PRIMARY verification method.
> The executing agent DIRECTLY verifies deliverables using Playwright (browser), Bash (build/lint), and tmux (dev server).

**Verification Tool by Deliverable Type:**

| Type | Tool | How Agent Verifies |
|------|------|-------------------|
| **Frontend/UI** | Playwright (playwright skill) | Navigate, interact, assert DOM, screenshot |
| **Build/Lint** | Bash | Run commands, assert exit code 0 |
| **Navigation** | Playwright | Click links, assert URL changes, verify back navigation |

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately):
└── Task 1: Create feature branch

Wave 2 (After Wave 1):
└── Task 2: Restructure content + migrate existing files

Wave 3 (After Wave 2):
└── Task 3: Update types.ts + rewrite loader.ts

Wave 4 (After Wave 3):
├── Task 4: Create TopicsListingPage + TopicCard + pluralize helper
└── Task 5: Adapt TopicPage for :slug parameter

Wave 5 (After Wave 4):
└── Task 6: Update routing (App.tsx) + all navigation links

Wave 6 (After Wave 5):
├── Task 7: Update docs + build/lint verification
└── Task 8: Playwright QA — full navigation + responsive + accessibility

Critical Path: Task 1 → 2 → 3 → 4/5 → 6 → 7/8
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 2 | None |
| 2 | 1 | 3 | None |
| 3 | 2 | 4, 5 | None |
| 4 | 3 | 6 | 5 |
| 5 | 3 | 6 | 4 |
| 6 | 4, 5 | 7, 8 | None |
| 7 | 6 | None | 8 |
| 8 | 6 | None | 7 |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Agents |
|------|-------|-------------------|
| 1 | 1 | task(category="quick", load_skills=["git-master"]) |
| 2 | 2 | task(category="quick", load_skills=[]) |
| 3 | 3 | task(category="unspecified-high", load_skills=[]) |
| 4 | 4, 5 | task(category="visual-engineering", load_skills=["frontend-ui-ux"]) — parallel |
| 5 | 6 | task(category="unspecified-high", load_skills=[]) |
| 6 | 7, 8 | task(category="quick") + task(category="visual-engineering", load_skills=["playwright"]) |

---

## TODOs

- [x] 1. Create feature branch

  **What to do**:
  - Создать ветку `feature/multi-topic-homepage` от текущего HEAD
  - Переключиться на неё

  **Must NOT do**:
  - Не пушить в remote без запроса

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`git-master`]
    - `git-master`: работа с ветками git

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1 (solo)
  - **Blocks**: Task 2
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - N/A — стандартная git-операция

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Feature branch created and checked out
    Tool: Bash
    Steps:
      1. git branch --show-current
      2. Assert: output is "feature/multi-topic-homepage"
    Expected Result: On the new feature branch
  ```

  **Commit**: NO

---

- [x] 2. Restructure content directory + migrate existing files

  **What to do**:
  - Создать директорию `content/topics/krasivyi-konspekt/`
  - Создать `content/topics/krasivyi-konspekt/lessons/`
  - Переместить `content/topic.json` → `content/topics/krasivyi-konspekt/meta.json`
  - Добавить в `meta.json` поля: `"slug": "krasivyi-konspekt"`, `"order": 1`
  - Переместить `content/lessons/01-noble-basics.json` → `content/topics/krasivyi-konspekt/lessons/01-noble-basics.json`
  - Переместить `content/lessons/02-qa-craft.json` → `content/topics/krasivyi-konspekt/lessons/02-qa-craft.json`
  - Удалить пустые директории `content/lessons/` (если осталась) и файл `content/topic.json` (если перемещён, а не скопирован)
  - Файлы уроков НЕ изменять — только переместить

  **Must NOT do**:
  - Не создавать новые темы или демо-контент
  - Не менять содержимое уроков
  - Не удалять файлы до подтверждения успешного перемещения

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (solo)
  - **Blocks**: Task 3
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `content/topic.json` — текущий файл метаданных (title, subtitle, description)
  - `content/lessons/01-noble-basics.json` — первый урок
  - `content/lessons/02-qa-craft.json` — второй урок

  **API/Type References**:
  - `src/content/types.ts:TopicData` — текущий тип (нужно будет расширить в Task 3)

  **Documentation References**:
  - `docs/content-schema.md` — текущая документация схемы (обновится в Task 7)

  **WHY Each Reference Matters**:
  - `content/topic.json` — исходный файл, нужно знать его формат для добавления `slug` и `order`
  - Файлы уроков — нужно перемещать без изменений

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Content directory restructured correctly
    Tool: Bash
    Steps:
      1. ls content/topics/krasivyi-konspekt/meta.json
      2. Assert: file exists
      3. cat content/topics/krasivyi-konspekt/meta.json | grep '"slug"'
      4. Assert: output contains "krasivyi-konspekt"
      5. cat content/topics/krasivyi-konspekt/meta.json | grep '"order"'
      6. Assert: output contains "1"
      7. ls content/topics/krasivyi-konspekt/lessons/
      8. Assert: contains "01-noble-basics.json" and "02-qa-craft.json"
      9. ls content/topic.json 2>/dev/null
      10. Assert: file does NOT exist (moved, not copied)
      11. ls content/lessons/ 2>/dev/null
      12. Assert: directory does NOT exist or is empty
    Expected Result: All content migrated to new structure
  ```

  **Commit**: YES
  - Message: `refactor(content): restructure to directory-per-topic layout`
  - Files: `content/topics/krasivyi-konspekt/meta.json`, `content/topics/krasivyi-konspekt/lessons/*.json`, удалённые `content/topic.json`, `content/lessons/`

---

- [x] 3. Update TypeScript types + rewrite loader.ts for multi-topic support

  **What to do**:
  - **types.ts**: Добавить в `TopicData` поля `slug: string` и `order: number`
  - **types.ts**: Добавить `lessonCount?: number` для вычисленного значения (не из JSON, а из загрузки)
  - **loader.ts**: Полностью переписать для мульти-темной архитектуры:
    - Новые glob-паттерны: `import.meta.glob('/content/topics/*/meta.json', { eager: true })` и `import.meta.glob('/content/topics/*/lessons/*.json', { eager: true })`
    - Извлечение `topicSlug` из пути файла (например, `/content/topics/krasivyi-konspekt/meta.json` → `krasivyi-konspekt`)
    - Связывание уроков с темами по пути
    - Новый API:
      - `getTopics(): TopicData[]` — все темы, отсортированные по `order`, с вычисленным `lessonCount`
      - `getTopicBySlug(slug: string): TopicData | undefined`
      - `getLessonsForTopic(topicSlug: string): LessonData[]` — уроки конкретной темы, отсортированные по `order`
      - `getLessonBySlug(topicSlug: string, lessonSlug: string): LessonData | undefined`
      - `getAdjacentLessons(topicSlug: string, lessonSlug: string): { prev?: LessonData; next?: LessonData }`
    - Сохранить валидацию `isLessonData()` — расширить её если нужно
    - Добавить валидацию для TopicData (isTopicData)
  - **Удалить** старые функции: `getTopic()`, `getLessons()`, `getLessonBySlug(slug)`, `getAdjacentLessons(slug)`

  **Must NOT do**:
  - Не оставлять старое API рядом с новым
  - Не добавлять runtime-загрузку (все данные eager через import.meta.glob)
  - Не менять типы `LessonData`, `QACardData`, `AnswerSectionData` и другие — только `TopicData`

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []
    - Чистая TypeScript задача без UI

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (solo)
  - **Blocks**: Tasks 4, 5
  - **Blocked By**: Task 2

  **References**:

  **Pattern References**:
  - `src/content/loader.ts:1-55` — текущий loader с glob-паттернами, eager загрузкой и валидацией. Нужно переписать glob-паттерны для новой структуры, сохранить подход к валидации
  - `src/content/loader.ts:14-20` — текущий `import.meta.glob` для topic и lessons. Заменить паттерны на `/content/topics/*/meta.json` и `/content/topics/*/lessons/*.json`

  **API/Type References**:
  - `src/content/types.ts:55-59` — текущий `TopicData` interface, нужно добавить `slug` и `order`
  - `src/content/types.ts:48-53` — `LessonData` interface, НЕ менять

  **WHY Each Reference Matters**:
  - `loader.ts` — полностью переписывается, нужно понимать текущую структуру для миграции
  - `types.ts:TopicData` — расширяется новыми полями
  - `types.ts:LessonData` — НЕ менять, но нужно знать для типов возвращаемых значений

  **Acceptance Criteria**:

  - [ ] Новые функции loader экспортированы и типизированы корректно
  - [ ] Старые функции (`getTopic`, `getLessons`) полностью удалены
  - Примечание: `npx tsc --noEmit` НЕ пройдёт на этом этапе — потребители (`TopicPage`, `LessonPage`) ещё используют старое API. Полная проверка сборки откладывается до Task 6 (после обновления всех потребителей)

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Types updated correctly
    Tool: Bash
    Steps:
      1. grep -n "slug: string" src/content/types.ts
      2. Assert: line exists in TopicData interface
      3. grep -n "order: number" src/content/types.ts
      4. Assert: line exists in TopicData interface
    Expected Result: TopicData has slug and order fields

  Scenario: Loader exports new API
    Tool: Bash
    Steps:
      1. grep "export function getTopics" src/content/loader.ts
      2. Assert: function exists
      3. grep "export function getTopicBySlug" src/content/loader.ts
      4. Assert: function exists
      5. grep "export function getLessonsForTopic" src/content/loader.ts
      6. Assert: function exists
      7. grep "export function getLessonBySlug" src/content/loader.ts
      8. Assert: function signature has 2 params (topicSlug, lessonSlug)
      9. grep "export function getAdjacentLessons" src/content/loader.ts
      10. Assert: function signature has 2 params (topicSlug, lessonSlug)
    Expected Result: All 5 new API functions exported

  Scenario: Old API removed
    Tool: Bash
    Steps:
      1. grep "export function getTopic()" src/content/loader.ts
      2. Assert: NOT found (old single-topic function removed)
      3. grep "export function getLessons()" src/content/loader.ts
      4. Assert: NOT found
    Expected Result: Old single-topic API completely removed
  ```

  **Commit**: YES
  - Message: `refactor(data): rewrite types and loader for multi-topic architecture`
  - Files: `src/content/types.ts`, `src/content/loader.ts`
  - Pre-commit: `npx tsc --noEmit` (может иметь ошибки в потребителях — допустимо)

---

- [x] 4. Create TopicsListingPage + TopicCard + pluralize helper

  **What to do**:
  - **`src/utils/pluralize.ts`**: Создать helper для русских склонений:
    ```typescript
    // pluralizeRu(count, ['урок', 'урока', 'уроков']) → "5 уроков"
    export function pluralizeRu(count: number, forms: [string, string, string]): string
    ```
    Логика: 1 → forms[0], 2-4 → forms[1], 5-20 → forms[2], 21 → forms[0], 22-24 → forms[1], etc.
  - **`src/components/TopicCard.tsx`**: Новый компонент по образцу `LessonCard.tsx`:
    - `motion.article` обёртка с `whileHover={{ y: -3 }}` (с проверкой reduced-motion)
    - `Link to={/topic/${topic.slug}}` обёртка всей карточки
    - CSS классы: `noble-card focus-ring group block p-6 transition-shadow hover:shadow-card sm:p-7`
    - Содержимое:
      - `<span>` с порядковым номером `topic.order` (padStart 2 '0') в gold-dark
      - `<h2>` с `topic.title` в font-display text-2xl
      - `<p>` с `topic.description` в text-sm text-graphite/75, с `line-clamp-3`
      - `<p>` с кол-вом уроков: `pluralizeRu(lessonCount, ['урок', 'урока', 'уроков'])` в text-xs uppercase tracking
      - `ArrowUpRight` иконка (aria-hidden) с hover-анимацией
    - Props: `topic: TopicData & { lessonCount: number }`
  - **`src/pages/TopicsListingPage.tsx`**: Новая listing-страница:
    - Импорт `getTopics` из loader
    - Вызов `getTopics()` на уровне модуля (темы статичны — для listing это ОК)
    - `<section aria-label="Темы">` — landmark region
    - `<p>` метка "Темы" в стиле существующего "Уроки" (`text-xs font-semibold uppercase tracking-[0.16em] text-graphite/70`)
    - `<ul role="list">` контейнер для grid
    - CSS grid: `grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3`
    - `<motion.ul>` со stagger-анимацией (staggerChildren: 0.06) как в текущем TopicPage
    - `<motion.li>` обёртки с fade+y-shift вариантами
    - `TopicCard` внутри каждого `<li>`
    - prefers-reduced-motion support через `useReducedMotion()`

  **Must NOT do**:
  - Не добавлять hero-секцию, Header компонент, или DividerOrnament на эту страницу
  - Не добавлять иконки/изображения на карточки тем
  - Не добавлять фильтрацию, сортировку, категории
  - Не менять CSS классы `noble-card` или `focus-ring`

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: создание UI-компонентов с учётом дизайн-системы

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Task 5)
  - **Blocks**: Task 6
  - **Blocked By**: Task 3

  **References**:

  **Pattern References**:
  - `src/components/LessonCard.tsx:1-42` — ГЛАВНЫЙ образец для TopicCard. Копировать структуру: motion.article обёртка, Link внутри, noble-card + focus-ring классы, order badge, заголовок в font-display, ArrowUpRight иконка, hover y-shift с reduced-motion
  - `src/pages/TopicPage.tsx:22-41` — Stagger-анимация grid: variants hidden/show, staggerChildren: 0.06, motion.div с opacity+y анимацией. Копировать этот паттерн для TopicsListingPage
  - `src/pages/TopicPage.tsx:21` — Метка "Уроки" (`text-xs font-semibold uppercase tracking-[0.16em] text-graphite/70`). Использовать тот же стиль для метки "Темы"

  **API/Type References**:
  - `src/content/types.ts:TopicData` — тип данных для пропсов TopicCard (после расширения в Task 3)
  - `src/content/loader.ts:getTopics()` — API для получения списка тем (создаётся в Task 3)

  **External References**:
  - `lucide-react` — иконка `ArrowUpRight` (уже используется в LessonCard)

  **WHY Each Reference Matters**:
  - `LessonCard.tsx` — точный образец структуры, стилей и анимаций. TopicCard должен быть визуально консистентен
  - `TopicPage.tsx:22-41` — паттерн stagger-анимации, который нужно воспроизвести для grid тем
  - Метка "Уроки" — стиль для секционного заголовка, нужно воспроизвести для "Темы"

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Pluralize helper works correctly for Russian
    Tool: Bash
    Steps:
      1. Create temp test file that imports pluralizeRu and logs results
      2. Assert: pluralizeRu(1, ['урок','урока','уроков']) returns "1 урок"
      3. Assert: pluralizeRu(2, ['урок','урока','уроков']) returns "2 урока"
      4. Assert: pluralizeRu(5, ['урок','урока','уроков']) returns "5 уроков"
      5. Assert: pluralizeRu(11, ['урок','урока','уроков']) returns "11 уроков"
      6. Assert: pluralizeRu(21, ['урок','урока','уроков']) returns "21 урок"
      7. Clean up temp file
    Expected Result: All Russian pluralization cases handled

  Scenario: TopicCard file structure matches LessonCard pattern
    Tool: Bash
    Steps:
      1. grep "motion.article" src/components/TopicCard.tsx
      2. Assert: exists (uses motion wrapper like LessonCard)
      3. grep "noble-card" src/components/TopicCard.tsx
      4. Assert: exists (uses same card styles)
      5. grep "focus-ring" src/components/TopicCard.tsx
      6. Assert: exists (uses same focus styles)
      7. grep "ArrowUpRight" src/components/TopicCard.tsx
      8. Assert: exists (same arrow icon)
      9. grep "useReducedMotion" src/components/TopicCard.tsx
      10. Assert: exists (respects motion preferences)
    Expected Result: TopicCard follows LessonCard pattern exactly

  Scenario: TopicsListingPage has correct structure
    Tool: Bash
    Steps:
      1. grep "aria-label" src/pages/TopicsListingPage.tsx
      2. Assert: contains "Темы"
      3. grep 'role="list"' src/pages/TopicsListingPage.tsx
      4. Assert: exists (semantic list)
      5. grep "grid-cols-1" src/pages/TopicsListingPage.tsx
      6. Assert: exists (responsive grid)
      7. grep "sm:grid-cols-2" src/pages/TopicsListingPage.tsx
      8. Assert: exists (2 columns on sm)
      9. grep "lg:grid-cols-3" src/pages/TopicsListingPage.tsx
      10. Assert: exists (3 columns on lg)
      11. grep "staggerChildren" src/pages/TopicsListingPage.tsx
      12. Assert: exists (stagger animation)
    Expected Result: Listing page has semantic HTML, responsive grid, animations
  ```

  **Commit**: YES (groups with Task 5)
  - Message: `feat(ui): add TopicsListingPage with TopicCard and pluralization`
  - Files: `src/pages/TopicsListingPage.tsx`, `src/components/TopicCard.tsx`, `src/utils/pluralize.ts`

---

- [x] 5. Adapt TopicPage for :slug parameter

  **What to do**:
  - **Удалить** module-level вызовы (строки 7-8): `const topic = getTopic()` и `const lessons = getLessons()`
  - **Добавить** `useParams()` из react-router-dom для получения `slug`
  - **Добавить** вызовы `getTopicBySlug(slug)` и `getLessonsForTopic(slug)` внутри компонента
  - **Добавить** not-found состояние если тема не найдена (по образцу `LessonPage.tsx:13-25`):
    - Сообщение "Тема не найдена"
    - Ссылка "На главную" → `/`
  - **НЕ передавать** `topicSlug` в `LessonCard` на этом этапе — LessonCard ещё не принимает этот prop. Передача произойдёт в Task 6, где обновляются и пропсы LessonCard, и ссылки
  - Сохранить всё остальное: Header, DividerOrnament, stagger-анимацию, "Уроки" метку

  **Must NOT do**:
  - Не менять визуальный дизайн TopicPage
  - Не менять Header, DividerOrnament компоненты
  - Не менять стили или анимации

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: адаптация существующего UI компонента

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Task 4)
  - **Blocks**: Task 6
  - **Blocked By**: Task 3

  **References**:

  **Pattern References**:
  - `src/pages/TopicPage.tsx:1-50` — ТЕКУЩИЙ компонент, который нужно адаптировать. Ключевые изменения: убрать строки 7-8 (module-level calls), добавить useParams, добавить not-found
  - `src/pages/LessonPage.tsx:13-25` — Паттерн not-found состояния: проверка `if (!lesson)`, рендер сообщения с ссылкой назад. Копировать этот подход для "тема не найдена"

  **API/Type References**:
  - `src/content/loader.ts:getTopicBySlug(slug)` — новая функция для получения темы (создаётся в Task 3)
  - `src/content/loader.ts:getLessonsForTopic(topicSlug)` — новая функция для уроков темы (создаётся в Task 3)

  **WHY Each Reference Matters**:
  - `TopicPage.tsx` — файл, который модифицируется. Нужно знать текущую структуру
  - `LessonPage.tsx:13-25` — паттерн not-found, который нужно воспроизвести

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Module-level calls removed
    Tool: Bash
    Steps:
      1. grep "const topic = getTopic()" src/pages/TopicPage.tsx
      2. Assert: NOT found (module-level call removed)
      3. grep "const lessons = getLessons()" src/pages/TopicPage.tsx
      4. Assert: NOT found (module-level call removed)
      5. grep "useParams" src/pages/TopicPage.tsx
      6. Assert: found (uses route params)
    Expected Result: Data fetching moved inside component

  Scenario: Not-found state exists
    Tool: Bash
    Steps:
      1. grep -A 3 "не найдена" src/pages/TopicPage.tsx
      2. Assert: contains not-found message and link
    Expected Result: Topic not-found state implemented
  ```

  **Commit**: YES (groups with Task 4)
  - Message: `refactor(pages): adapt TopicPage for slug-based routing`
  - Files: `src/pages/TopicPage.tsx`

---

- [x] 6. Update routing (App.tsx) + all navigation links

  **What to do**:
  - **App.tsx**: Обновить роуты:
    - `"/"` → `<TopicsListingPage />` (новая)
    - `"/topic/:slug"` → `<TopicPage />` (существующая, адаптированная)
    - `"/topic/:slug/lesson/:lessonSlug"` → `<LessonPage />` (существующая)
    - Добавить redirect: `"/lesson/:slug"` → `"/"` (для обратной совместимости, хоть и локальный сайт)
    - `"*"` → `<Navigate to="/" replace />` (оставить)
  - **LessonCard.tsx**: Принять новый prop `topicSlug: string`, обновить ссылку:
    - Было: `` to={`/lesson/${lesson.slug}`} ``
    - Стало: `` to={`/topic/${topicSlug}/lesson/${lesson.slug}`} ``
  - **LessonPage.tsx**: Получить `slug` (topicSlug) и `lessonSlug` из `useParams()`:
    - Обновить строку 18: `<Link to="/">` → `<Link to={/topic/${slug}}>`
    - Обновить строку 34: `<Link to="/">` → `<Link to={/topic/${slug}}>`
    - Обновить вызовы loader: `getLessonBySlug(slug, lessonSlug)`, `getAdjacentLessons(slug, lessonSlug)`
  - **PrevNextNav.tsx**: Принять новый prop `topicSlug: string`:
    - Обновить строку 15: `` to={`/lesson/${prev.slug}`} `` → `` to={`/topic/${topicSlug}/lesson/${prev.slug}`} ``
    - Обновить строку 30: `` to={`/lesson/${next.slug}`} `` → `` to={`/topic/${topicSlug}/lesson/${next.slug}`} ``
  - **Обновить вызовы** PrevNextNav и LessonCard в LessonPage и TopicPage чтобы передавать topicSlug prop

  **Must NOT do**:
  - Не менять визуальное оформление компонентов
  - Не добавлять breadcrumbs
  - Не менять PageTransition, AnimatePresence, ScrollToTop
  - Не менять Layout компонент

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []
    - Чистый рефакторинг роутинга и пропсов

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 5 (solo)
  - **Blocks**: Tasks 7, 8
  - **Blocked By**: Tasks 4, 5

  **References**:

  **Pattern References**:
  - `src/App.tsx:17-32` — текущая настройка роутов. Нужно добавить новые роуты и redirect
  - `src/components/LessonCard.tsx:16` — захардкоженная ссылка `/lesson/${lesson.slug}` → нужно заменить на вложенный путь
  - `src/pages/LessonPage.tsx:18` — `<Link to="/">` "К урокам" → нужно заменить на `/topic/${slug}`
  - `src/pages/LessonPage.tsx:34` — `<Link to="/">` back link → нужно заменить
  - `src/components/PrevNextNav.tsx:15` — `/lesson/${prev.slug}` → нужно заменить на `/topic/${topicSlug}/lesson/${prev.slug}`
  - `src/components/PrevNextNav.tsx:30` — `/lesson/${next.slug}` → нужно заменить

  **API/Type References**:
  - `src/content/loader.ts:getLessonBySlug(topicSlug, lessonSlug)` — обновлённая сигнатура (Task 3)
  - `src/content/loader.ts:getAdjacentLessons(topicSlug, lessonSlug)` — обновлённая сигнатура (Task 3)

  **WHY Each Reference Matters**:
  - Все 5 ссылок ДОЛЖНЫ быть обновлены атомарно с изменением роутинга, иначе навигация сломается

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: No hardcoded flat lesson routes remain
    Tool: Bash
    Steps:
      1. grep -rn '"/lesson/' src/ --include="*.tsx" --include="*.ts" | grep -v node_modules | grep -v "/topic/"
      2. Assert: No results (all lesson routes are nested under /topic/)
    Expected Result: All lesson routes use nested pattern

  Scenario: Routing includes all required paths
    Tool: Bash
    Steps:
      1. grep 'path="/"' src/App.tsx
      2. Assert: exists (homepage route)
      3. grep 'path="/topic/:slug"' src/App.tsx
      4. Assert: exists (topic detail route)
      5. grep '/topic/:slug/lesson/:lessonSlug' src/App.tsx
      6. Assert: exists (lesson route nested under topic)
      7. grep 'TopicsListingPage' src/App.tsx
      8. Assert: exists (new listing page imported)
    Expected Result: All 3 main routes + redirect configured

  Scenario: LessonCard accepts topicSlug prop
    Tool: Bash
    Steps:
      1. grep "topicSlug" src/components/LessonCard.tsx
      2. Assert: exists (new prop accepted)
      3. grep "topicSlug" src/components/PrevNextNav.tsx
      4. Assert: exists (new prop accepted)
    Expected Result: Navigation components accept topic context
  ```

  **Commit**: YES
  - Message: `feat(routing): implement nested topic/lesson URL structure`
  - Files: `src/App.tsx`, `src/components/LessonCard.tsx`, `src/pages/LessonPage.tsx`, `src/components/PrevNextNav.tsx`
  - Pre-commit: `npm run build`

---

- [x] 7. Update docs + build/lint verification

  **What to do**:
  - **`docs/content-schema.md`**: Обновить раздел "Файлы":
    - Было: `content/topic.json` и `content/lessons/<order>-<slug>.json`
    - Стало: `content/topics/<topic-slug>/meta.json` и `content/topics/<topic-slug>/lessons/<order>-<slug>.json`
    - Обновить пример `topic.json` → `meta.json` (добавить `slug` и `order`)
    - Добавить описание новых полей
  - **Проверить** `npm run build` → exit code 0
  - **Проверить** `npm run lint` → exit code 0
  - **Исправить** любые ошибки TypeScript или ESLint

  **Must NOT do**:
  - Не обновлять CONTENT_GUIDE.md, README.md, AGENTS.md — только content-schema.md
  - Не добавлять новые файлы документации

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 6 (with Task 8)
  - **Blocks**: None
  - **Blocked By**: Task 6

  **References**:

  **Documentation References**:
  - `docs/content-schema.md` — файл для обновления, текущая структура описания контента

  **WHY Each Reference Matters**:
  - Документация должна отражать актуальную структуру контента

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Build passes cleanly
    Tool: Bash
    Steps:
      1. npm run build
      2. Assert: exit code 0
      3. Assert: no TypeScript errors in output
    Expected Result: Clean build

  Scenario: Lint passes cleanly
    Tool: Bash
    Steps:
      1. npm run lint
      2. Assert: exit code 0
    Expected Result: No lint errors

  Scenario: Docs updated with new structure
    Tool: Bash
    Steps:
      1. grep "content/topics" docs/content-schema.md
      2. Assert: new directory structure documented
      3. grep '"slug"' docs/content-schema.md
      4. Assert: new slug field documented
    Expected Result: Documentation reflects new content architecture
  ```

  **Commit**: YES
  - Message: `docs(schema): update content-schema for multi-topic structure`
  - Files: `docs/content-schema.md`

---

- [x] 8. Playwright QA — full navigation + responsive + accessibility

  **What to do**:
  - Запустить dev-сервер (`npm run dev`)
  - Провести полную проверку через Playwright (глобальный, НЕ локальный — см. `docs/dev-setup.md`)

  **Must NOT do**:
  - Не устанавливать Playwright локально
  - Не менять код — только проверять

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`playwright`]
    - `playwright`: браузерная автоматизация для визуальной проверки

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 6 (with Task 7)
  - **Blocks**: None
  - **Blocked By**: Task 6

  **References**:

  **Documentation References**:
  - `docs/dev-setup.md` — настройка Playwright (глобальный, пути, команды для скриншотов)

  **WHY Each Reference Matters**:
  - Playwright должен использоваться глобальный, а не локальный — иначе нарушит ограничения проекта

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Homepage renders topics grid
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:5173
    Steps:
      1. Navigate to: http://localhost:5173
      2. Wait for: article element visible (timeout: 10s)
      3. Assert: At least 1 article element exists (topic card)
      4. Assert: First article contains text "Красивый конспект"
      5. Assert: First article contains lesson count text (matches pattern /\d+ урок/)
      6. Assert: First article contains description text
      7. Screenshot: .sisyphus/evidence/task-8-homepage-grid.png
    Expected Result: Homepage shows topic cards with title, description, lesson count
    Evidence: .sisyphus/evidence/task-8-homepage-grid.png

  Scenario: Topic card navigates to topic detail
    Tool: Playwright (playwright skill)
    Preconditions: On homepage
    Steps:
      1. Click: first article a link
      2. Wait for: URL matches /topic/ (timeout: 5s)
      3. Assert: URL contains "/topic/krasivyi-konspekt"
      4. Assert: h1 contains "Красивый конспект"
      5. Assert: page contains text "Уроки"
      6. Assert: lesson cards visible (article elements)
      7. Screenshot: .sisyphus/evidence/task-8-topic-detail.png
    Expected Result: Topic detail page loads with lessons
    Evidence: .sisyphus/evidence/task-8-topic-detail.png

  Scenario: Lesson navigation works from topic
    Tool: Playwright (playwright skill)
    Preconditions: On topic detail page /topic/krasivyi-konspekt
    Steps:
      1. Click: first lesson card link
      2. Wait for: URL matches /topic/krasivyi-konspekt/lesson/ (timeout: 5s)
      3. Assert: URL contains "/topic/krasivyi-konspekt/lesson/noble-basics"
      4. Assert: page contains lesson content
      5. Find: link with text containing "К урокам" or back navigation
      6. Assert: link href contains "/topic/krasivyi-konspekt" (NOT just "/")
      7. Click: back link
      8. Wait for: URL is /topic/krasivyi-konspekt (timeout: 5s)
      9. Assert: returned to topic detail page
      10. Screenshot: .sisyphus/evidence/task-8-lesson-navigation.png
    Expected Result: Full navigation cycle works
    Evidence: .sisyphus/evidence/task-8-lesson-navigation.png

  Scenario: PrevNext navigation within topic
    Tool: Playwright (playwright skill)
    Preconditions: On lesson page /topic/krasivyi-konspekt/lesson/noble-basics
    Steps:
      1. Find: "next" navigation link
      2. Assert: href contains "/topic/krasivyi-konspekt/lesson/qa-craft"
      3. Click: next link
      4. Wait for: URL contains "qa-craft" (timeout: 5s)
      5. Find: "previous" navigation link
      6. Assert: href contains "/topic/krasivyi-konspekt/lesson/noble-basics"
      7. Screenshot: .sisyphus/evidence/task-8-prevnext-nav.png
    Expected Result: Prev/Next links work within topic scope
    Evidence: .sisyphus/evidence/task-8-prevnext-nav.png

  Scenario: Responsive grid — mobile (375px)
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Set viewport: 375x812
      2. Navigate to: http://localhost:5173
      3. Wait for: article visible (timeout: 10s)
      4. Assert: articles are stacked vertically (single column — verify bounding boxes)
      5. Screenshot: .sisyphus/evidence/task-8-responsive-mobile.png
    Expected Result: Single column layout on mobile
    Evidence: .sisyphus/evidence/task-8-responsive-mobile.png

  Scenario: Responsive grid — tablet (768px)
    Tool: Playwright (playwright skill)
    Steps:
      1. Set viewport: 768x1024
      2. Navigate to: http://localhost:5173
      3. Wait for: article visible (timeout: 10s)
      4. Screenshot: .sisyphus/evidence/task-8-responsive-tablet.png
    Expected Result: Two column layout on tablet
    Evidence: .sisyphus/evidence/task-8-responsive-tablet.png

  Scenario: Responsive grid — desktop (1280px)
    Tool: Playwright (playwright skill)
    Steps:
      1. Set viewport: 1280x800
      2. Navigate to: http://localhost:5173
      3. Wait for: article visible (timeout: 10s)
      4. Screenshot: .sisyphus/evidence/task-8-responsive-desktop.png
    Expected Result: Three column layout on desktop
    Evidence: .sisyphus/evidence/task-8-responsive-desktop.png

  Scenario: Accessibility — semantic HTML and focus
    Tool: Playwright (playwright skill)
    Preconditions: On homepage
    Steps:
      1. Assert: html[lang="ru"] exists
      2. Assert: main element exists
      3. Assert: topic cards are article elements
      4. Assert: h2 elements exist inside article (heading hierarchy)
      5. Press Tab key multiple times
      6. Assert: focus-visible outline appears on topic card links (gold outline)
      7. Assert: focus moves logically through cards
      8. Screenshot: .sisyphus/evidence/task-8-focus-visible.png
    Expected Result: Semantic HTML correct, keyboard navigation works
    Evidence: .sisyphus/evidence/task-8-focus-visible.png

  Scenario: Invalid topic slug shows not-found
    Tool: Playwright (playwright skill)
    Steps:
      1. Navigate to: http://localhost:5173/topic/nonexistent-topic
      2. Wait for: page content loaded (timeout: 5s)
      3. Assert: page contains "не найдена" text or similar not-found message
      4. Assert: link to homepage exists
      5. Screenshot: .sisyphus/evidence/task-8-topic-not-found.png
    Expected Result: Graceful not-found state
    Evidence: .sisyphus/evidence/task-8-topic-not-found.png

  Scenario: Old /lesson/ route redirects
    Tool: Playwright (playwright skill)
    Steps:
      1. Navigate to: http://localhost:5173/lesson/noble-basics
      2. Wait for: navigation (timeout: 5s)
      3. Assert: URL is now http://localhost:5173/ (redirected to homepage)
      4. Screenshot: .sisyphus/evidence/task-8-old-route-redirect.png
    Expected Result: Old lesson URLs redirect to homepage
    Evidence: .sisyphus/evidence/task-8-old-route-redirect.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-8-homepage-grid.png`
  - [ ] `.sisyphus/evidence/task-8-topic-detail.png`
  - [ ] `.sisyphus/evidence/task-8-lesson-navigation.png`
  - [ ] `.sisyphus/evidence/task-8-prevnext-nav.png`
  - [ ] `.sisyphus/evidence/task-8-responsive-mobile.png`
  - [ ] `.sisyphus/evidence/task-8-responsive-tablet.png`
  - [ ] `.sisyphus/evidence/task-8-responsive-desktop.png`
  - [ ] `.sisyphus/evidence/task-8-focus-visible.png`
  - [ ] `.sisyphus/evidence/task-8-topic-not-found.png`
  - [ ] `.sisyphus/evidence/task-8-old-route-redirect.png`

  **Commit**: NO (QA only — if bugs found, fix in-place and commit with descriptive message)

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 2 | `refactor(content): restructure to directory-per-topic layout` | content/topics/\* | ls + cat assertions |
| 3 | `refactor(data): rewrite types and loader for multi-topic architecture` | src/content/types.ts, src/content/loader.ts | grep + tsc |
| 4+5 | `feat(ui): add multi-topic homepage with TopicCard component` | src/pages/TopicsListingPage.tsx, src/components/TopicCard.tsx, src/utils/pluralize.ts, src/pages/TopicPage.tsx | npm run build |
| 6 | `feat(routing): implement nested topic/lesson URL structure` | src/App.tsx + 3 nav components | npm run build |
| 7 | `docs(schema): update content-schema for multi-topic structure` | docs/content-schema.md | npm run build && npm run lint |

---

## Success Criteria

### Verification Commands
```bash
npm run build    # Expected: exit code 0, no errors
npm run lint     # Expected: exit code 0, no warnings
npm run dev      # Expected: dev server starts on :5173
```

### Final Checklist
- [x] Все "Must Have" присутствуют
- [x] Все "Must NOT Have" отсутствуют
- [x] `npm run build` → exit code 0
- [x] `npm run lint` → exit code 0
- [x] Навигация: homepage → topic → lesson → back работает
- [x] Responsive: 1 col (375px) → 2 col (768px) → 3 col (1280px)
- [x] Accessibility: lang="ru", article, focus-visible, 44px targets
- [x] Анимации: stagger + fade + prefers-reduced-motion
- [x] Все 10 Playwright QA скриншотов в `.sisyphus/evidence/`
- [x] Работа на ветке `feature/multi-topic-homepage`
