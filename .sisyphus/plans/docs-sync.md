# Синхронизация документации с кодовой базой

## TL;DR

> **Quick Summary**: Обновить 6 файлов документации (AGENTS.md, README.md, CONTENT_GUIDE.md, docs/animations.md, docs/threejs-background.md, docs/ux-patterns.md), которые устарели после рефакторинга мульти-тематической архитектуры.
>
> **Deliverables**:
> - Все маршруты, пути к файлам и код-примеры приведены в соответствие с кодовой базой
> - Ноль устаревших путей (`content/topic.json`, `content/lessons/`) в документации
> - Ноль устаревших маршрутов (`/lesson/:slug`) в документации
>
> **Estimated Effort**: Short
> **Parallel Execution**: YES — 2 waves
> **Critical Path**: Task 1 (AGENTS.md) → Task 6 (верификация)

---

## Context

### Original Request
Проверка соответствия workspace-файлов текущему проекту после мульти-тематического рефакторинга. Аудит выявил расхождения → пользователь запросил план обновления.

### Interview Summary
**Key Discussions**:
- Полный аудит: прочитаны все компоненты, страницы, типы, загрузчик, конфиги, все доки, все файлы контента
- Категории проблем: КРИТИЧЕСКИЕ (3 файла с устаревшими путями/маршрутами), СРЕДНИЕ (3 файла с техническими неточностями), МЕЛКИЕ (clsx не в стеке)

**Research Findings**:
- Мульти-тематический рефакторинг: коммиты `bd8261d` → `fd10735`
- Контент: `content/topic.json` + `content/lessons/` → `content/topics/<slug>/meta.json` + `content/topics/<slug>/lessons/`
- Маршруты: `/` + `/lesson/:slug` → `/` + `/topic/:slug` + `/topic/:slug/lesson/:lessonSlug`
- Аккордеон: AnimatePresence + motion.div → CSS Grid (`grid-template-rows`, `data-open`, 700ms)
- Three.js: ручной 30fps throttle → `frameloop="demand"` + `setInterval/invalidate`
- reduced-motion: `window.matchMedia` → `useReducedMotion()` из framer-motion

### Metis Review
**Identified Gaps** (addressed):
- AGENTS.md строка 39 — описание ссылки на content-schema.md содержит старые пути
- AGENTS.md строка 35 — описание анимаций подразумевает AnimatePresence для аккордеона
- AGENTS.md и README.md строка 3 — единственное число «тема» вместо «темы» (мульти-тематика)
- README.md строка 49 — отдельный устаревший путь в секции «Контент»
- animations.md — дополнительные неточности: easing `ease-out` vs `[0.22, 1, 0.36, 1]`, exit y: -10 vs -8
- threejs-background.md — `useFrame` throttle vs `setInterval/invalidate`, `window.matchMedia` vs `useReducedMotion()`
- CONTENT_GUIDE.md — схема topic.json показывает 3 поля, в типах 5 обязательных

---

## Work Objectives

### Core Objective
Привести все файлы документации в точное соответствие с текущим кодом. Исправить только фактические ошибки, не переписывая и не «улучшая» текст.

### Concrete Deliverables
- Обновлённые файлы: `AGENTS.md`, `README.md`, `CONTENT_GUIDE.md`, `docs/animations.md`, `docs/threejs-background.md`, `docs/ux-patterns.md`

### Definition of Done
- [x] `grep -rn "content/topic\.json\|content/lessons/" AGENTS.md README.md CONTENT_GUIDE.md docs/*.md` → пусто
- [x] `grep -rn '/lesson/:slug' AGENTS.md README.md docs/*.md` → пусто
- [x] `git diff --name-only docs/constraints.md docs/design-system.md docs/dev-setup.md docs/content-schema.md` → пусто
- [x] `git diff --name-only src/ content/ package.json index.html` → пусто
- [x] `npm run build` → exit code 0

### Must Have
- Все маршруты в документации соответствуют `App.tsx`
- Все пути к файлам контента соответствуют `content/topics/` структуре
- Все код-примеры соответствуют фактическим компонентам
- Весь текст остаётся на русском языке
- Структура и стиль документов сохранены

### Must NOT Have (Guardrails)
- ❌ НЕ трогать `docs/constraints.md`, `docs/design-system.md`, `docs/dev-setup.md`, `docs/content-schema.md` — проверены, актуальны
- ❌ НЕ трогать файлы исходного кода (`.tsx`, `.ts`, `.css`, `.json`, `.js`)
- ❌ НЕ исправлять баг плюрализации в `LessonCard.tsx` (отдельная задача)
- ❌ НЕ добавлять документацию для новых компонентов (TopicCard, PrevNextNav и т.д.)
- ❌ НЕ создавать новые файлы документации
- ❌ НЕ реструктурировать документы (не добавлять/удалять/переупорядочивать секции)
- ❌ НЕ «улучшать» формулировки — только фактические исправления
- ❌ НЕ переключать текст на английский язык

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: Неприменимо (документация)
- **Framework**: Нет

### Agent-Executed QA Scenarios (MANDATORY)

Все задачи верифицируются через grep/diff команды в Bash.

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately):
├── Task 1: AGENTS.md (AI-контекст, высший приоритет)
├── Task 2: README.md
├── Task 3: CONTENT_GUIDE.md
├── Task 4: docs/animations.md
└── Task 5: docs/threejs-background.md + docs/ux-patterns.md

Wave 2 (After Wave 1):
└── Task 6: Финальная верификация всех изменений

Critical Path: Все файлы → Task 6
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 6 | 2, 3, 4, 5 |
| 2 | None | 6 | 1, 3, 4, 5 |
| 3 | None | 6 | 1, 2, 4, 5 |
| 4 | None | 6 | 1, 2, 3, 5 |
| 5 | None | 6 | 1, 2, 3, 4 |
| 6 | 1, 2, 3, 4, 5 | None | None (final) |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Agents |
|------|-------|-------------------|
| 1 | 1, 2, 3, 4, 5 | Параллельные `task(category="quick")` |
| 2 | 6 | `task(category="quick")` — верификация |

---

## TODOs

- [x] 1. Обновить AGENTS.md

  **What to do**:

  1. Строка 3: `тема → уроки` → `темы → уроки` (мульти-тематика)

  2. Строка 8 (после `- npm`): добавить `- clsx (утилита условных классов)` в список техстека

  3. Строки 26-29 — заменить секцию «Структура проекта» целиком:
     ```markdown
     ## Структура проекта

     - `/` — список тем
     - `/topic/:slug` — тема + список уроков
     - `/topic/:slug/lesson/:lessonSlug` — урок с карточками
     - `content/topics/<slug>/meta.json` — метаданные темы
     - `content/topics/<slug>/lessons/*.json` — уроки и карточки
     ```

  4. Строка 35 — обновить описание ссылки animations.md:
     Было: `роут-переходы через AnimatePresence, fade + y-shift, prefers-reduced-motion, анимация карточек`
     Стало: `роут-переходы через AnimatePresence, fade + y-shift, prefers-reduced-motion, CSS Grid аккордеон`

  5. Строка 39 — обновить описание ссылки content-schema.md:
     Было: `JSON-схема topic.json и lessons/*.json, типы секций (kind), ссылка на CONTENT_GUIDE.md`
     Стало: `JSON-схема meta.json и lessons/*.json, типы секций (kind), ссылка на CONTENT_GUIDE.md`

  **Must NOT do**:
  - НЕ менять формат/структуру AGENTS.md
  - НЕ добавлять описания новых компонентов
  - НЕ менять раздел «Команды» или «Definition of Done»
  - НЕ менять описания других ссылок в «Детальные руководства» (кроме строк 35 и 39)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3, 4, 5)
  - **Blocks**: Task 6
  - **Blocked By**: None

  **References**:
  - `src/App.tsx:18-43` — актуальная маршрутизация (3 роута)
  - `src/content/loader.ts:26-34` — glob-паттерны для контента (`/content/topics/*/meta.json`, `/content/topics/*/lessons/*.json`)
  - `package.json:16` — зависимость `clsx`
  - `src/index.css:50-68` — CSS Grid аккордеон (не AnimatePresence)

  **Acceptance Criteria**:
  - [ ] `grep "content/topic\.json\|content/lessons/" AGENTS.md` → пусто
  - [ ] `grep '/lesson/:slug' AGENTS.md` → пусто
  - [ ] `grep "темы → уроки" AGENTS.md` → 1 совпадение
  - [ ] `grep "clsx" AGENTS.md` → 1 совпадение
  - [ ] `grep "/topic/:slug" AGENTS.md` → ≥1 совпадение
  - [ ] `grep "content/topics/" AGENTS.md` → ≥1 совпадение
  - [ ] `grep "CSS Grid" AGENTS.md` → 1 совпадение
  - [ ] `grep "meta\.json" AGENTS.md` → ≥1 совпадение

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Verify no stale paths in AGENTS.md
    Tool: Bash
    Steps:
      1. grep -c "content/topic\.json" AGENTS.md → Assert: 0
      2. grep -c "content/lessons/" AGENTS.md → Assert: 0
      3. grep -c '/lesson/:slug' AGENTS.md → Assert: 0
      4. grep -c "content/topics/" AGENTS.md → Assert: ≥1
      5. grep -c "/topic/:slug" AGENTS.md → Assert: ≥1
      6. grep -c "clsx" AGENTS.md → Assert: 1
    Expected Result: Zero stale paths, all new paths present
  ```

  **Commit**: YES (groups with 2, 3, 4, 5)
  - Message: `docs: sync workspace documentation with multi-topic architecture`
  - Files: `AGENTS.md`

---

- [x] 2. Обновить README.md

  **What to do**:

  1. Строка 3: `тема, уроки и Q/A карточки-аккордеоны` → `темы, уроки и Q/A карточки-аккордеоны`

  2. Строки 31-36 — заменить секцию «Структура»:
     ```markdown
     ## Структура

     - `/` — список тем
     - `/topic/:slug` — тема и список уроков
     - `/topic/:slug/lesson/:lessonSlug` — урок с карточками вопрос/ответ
     - `content/topics/<slug>/meta.json` — метаданные темы
     - `content/topics/<slug>/lessons/*.json` — уроки и карточки
     ```

  3. Строка 49: `content/lessons/*.json` → `content/topics/<slug>/lessons/*.json`

  **Must NOT do**:
  - НЕ менять секции «Стек», «Визуальные эффекты», «Локальный запуск»
  - НЕ реструктурировать README

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3, 4, 5)
  - **Blocks**: Task 6
  - **Blocked By**: None

  **References**:
  - `src/App.tsx:18-43` — актуальные маршруты
  - `content/topics/` — фактическая структура каталогов

  **Acceptance Criteria**:
  - [ ] `grep "content/topic\.json\|content/lessons/" README.md` → пусто
  - [ ] `grep '/lesson/:slug' README.md` → пусто
  - [ ] `grep "content/topics/" README.md` → ≥2 совпадения
  - [ ] `grep "/topic/:slug" README.md` → ≥1 совпадение

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Verify no stale paths in README.md
    Tool: Bash
    Steps:
      1. grep -c "content/topic\.json" README.md → Assert: 0
      2. grep -c "content/lessons/" README.md → Assert: 0
      3. grep -c "content/topics/" README.md → Assert: ≥2
    Expected Result: All paths updated to multi-topic structure
  ```

  **Commit**: YES (groups with 1, 3, 4, 5)
  - Message: `docs: sync workspace documentation with multi-topic architecture`
  - Files: `README.md`

---

- [x] 3. Обновить CONTENT_GUIDE.md

  **What to do**:

  1. Строки 7-8 — обновить пути файлов:
     ```markdown
     - Тема: `content/topics/<topic-slug>/meta.json`
     - Уроки: `content/topics/<topic-slug>/lessons/<order>-<slug>.json`
     ```

  2. Строка 14 — заголовок секции: `## 2. Схема \`topic.json\`` → `## 2. Схема \`meta.json\``

  3. Строки 16-22 — обновить JSON-пример, добавив обязательные поля `slug` и `order`:
     ```json
     {
       "slug": "krasivyi-konspekt",
       "order": 1,
       "title": "Красивый конспект",
       "subtitle": "Локальный формат обучения",
       "description": "Краткое описание темы"
     }
     ```

  **Must NOT do**:
  - НЕ менять секции 3-8 (схема урока, kind, правила композиции и т.д.)
  - НЕ противоречить уже обновлённому `docs/content-schema.md`

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 4, 5)
  - **Blocks**: Task 6
  - **Blocked By**: None

  **References**:
  - `src/content/types.ts:55-62` — тип `TopicData` с 5 обязательными полями
  - `content/topics/krasivyi-konspekt/meta.json` — фактический пример meta.json
  - `docs/content-schema.md:5-36` — уже актуальная схема (для консистентности)

  **Acceptance Criteria**:
  - [ ] `grep "content/topic\.json" CONTENT_GUIDE.md` → пусто
  - [ ] `grep "content/lessons/" CONTENT_GUIDE.md` → пусто (пути без `topics/`)
  - [ ] `grep "meta\.json" CONTENT_GUIDE.md` → ≥2 совпадения
  - [ ] `grep '"slug"' CONTENT_GUIDE.md` → ≥1 совпадение (в секции 2)
  - [ ] `grep '"order"' CONTENT_GUIDE.md` → ≥1 совпадение (в секции 2)

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Verify CONTENT_GUIDE.md consistency with content-schema.md
    Tool: Bash
    Steps:
      1. grep -c "content/topic\.json" CONTENT_GUIDE.md → Assert: 0
      2. grep -c "meta\.json" CONTENT_GUIDE.md → Assert: ≥2
      3. grep -c '"slug"' CONTENT_GUIDE.md → Assert: ≥1
      4. grep -c '"order"' CONTENT_GUIDE.md → Assert: ≥1
      5. grep "content/topics/" CONTENT_GUIDE.md → Assert: ≥1
    Expected Result: Schema matches types.ts, paths match directory structure
  ```

  **Commit**: YES (groups with 1, 2, 4, 5)
  - Message: `docs: sync workspace documentation with multi-topic architecture`
  - Files: `CONTENT_GUIDE.md`

---

- [x] 4. Обновить docs/animations.md

  **What to do**:

  1. **Строки 7-23 — секция «Реализация»**: заменить код-пример роутов на актуальный из `App.tsx`. Показать 3 маршрута (`/`, `/topic/:slug`, `/topic/:slug/lesson/:lessonSlug`), каждый обёрнут в `<PageTransition>`. Указать что роутинг находится в функции `AppRoutes`, а `App` содержит `BrowserRouter`.

  2. **Строки 28-31 — «Характеристики»**:
     - `~300-400ms` → `380ms (0.38s)`
     - `ease-out` → `cubic-bezier(0.22, 1, 0.36, 1)`
     - Остальные пункты (запрещено: резкие слайды и т.д.) — оставить

  3. **Строки 36-43 — код-пример PageTransition**: заменить на актуальный из `PageTransition.tsx`:
     ```tsx
     <motion.div
       initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
       animate={{ opacity: 1, y: 0 }}
       exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
       transition={{
         duration: prefersReducedMotion ? 0.15 : 0.38,
         ease: [0.22, 1, 0.36, 1],
       }}
     >
       {children}
     </motion.div>
     ```

  4. **Строки 46-50 — «Анимации карточек»**: заменить описание аккордеона:
     - Было: `AnimatePresence + motion.div с height: auto`
     - Стало: CSS Grid через `grid-template-rows` (0fr → 1fr), управляемый атрибутом `data-open` на div-контейнере
     - Длительность: `700ms`, easing: `cubic-bezier(0.22, 1, 0.36, 1)`
     - Chevron: оставить (rotation 180° через Tailwind `rotate-180`)

  5. **Строки 54-63 — «prefers-reduced-motion»**: заменить код-пример на `useReducedMotion()` из framer-motion. Показать как используется в `PageTransition.tsx` (duration 0.15, y: 0 вместо сдвига). Убрать пример с `window.matchMedia`.

  **Must NOT do**:
  - НЕ добавлять новые секции
  - НЕ добавлять описание hover-анимаций на карточках (TopicCard/LessonCard `whileHover`)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3, 5)
  - **Blocks**: Task 6
  - **Blocked By**: None

  **References**:
  - `src/App.tsx:10-48` — актуальная структура маршрутов (функция AppRoutes)
  - `src/components/PageTransition.tsx:1-21` — полный код PageTransition
  - `src/index.css:50-68` — CSS Grid аккордеон:
    - `.accordion-content` → `display: grid; grid-template-rows: 0fr; transition: grid-template-rows 700ms`
    - `.accordion-content[data-open="true"]` → `grid-template-rows: 1fr; opacity: 1`
    - `@media (prefers-reduced-motion: reduce)` → `transition-duration: 0.01ms !important`
  - `src/components/QACard.tsx:40-44` — использование `data-open={isOpen}` и `accordion-content`

  **Acceptance Criteria**:
  - [ ] `grep "AnimatePresence.*height" docs/animations.md` → пусто (нет «AnimatePresence + height: auto»)
  - [ ] `grep "250-300ms\|300-400ms" docs/animations.md` → пусто
  - [ ] `grep "grid-template-rows\|CSS Grid\|data-open" docs/animations.md` → ≥1
  - [ ] `grep "useReducedMotion" docs/animations.md` → ≥1
  - [ ] `grep "window\.matchMedia" docs/animations.md` → пусто
  - [ ] `grep "0\.38\|380ms" docs/animations.md` → ≥1
  - [ ] `grep "700ms\|700" docs/animations.md` → ≥1
  - [ ] `grep '/lesson/:slug' docs/animations.md` → пусто

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Verify animations.md matches actual code
    Tool: Bash
    Steps:
      1. grep -c "AnimatePresence.*height\|height.*auto" docs/animations.md → Assert: 0
      2. grep -c "250-300\|300-400" docs/animations.md → Assert: 0
      3. grep -c "grid-template-rows" docs/animations.md → Assert: ≥1
      4. grep -c "useReducedMotion" docs/animations.md → Assert: ≥1
      5. grep -c "window.matchMedia" docs/animations.md → Assert: 0
      6. grep -c "700" docs/animations.md → Assert: ≥1
      7. grep -c "0.38" docs/animations.md → Assert: ≥1
    Expected Result: All code samples and values match actual source
  ```

  **Commit**: YES (groups with 1, 2, 3, 5)
  - Message: `docs: sync workspace documentation with multi-topic architecture`
  - Files: `docs/animations.md`

---

- [x] 5. Обновить docs/threejs-background.md и docs/ux-patterns.md

  **What to do**:

  ### docs/threejs-background.md:

  1. **Строки 9-16 — «Позиционирование»**: заменить код-пример на актуальный из `BackgroundScene.tsx`:
     ```tsx
     <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
       <Canvas
         dpr={[1, 1.5]}
         frameloop="demand"
         camera={{ position: [0, 0, 9], fov: 48, near: 0.1, far: 30 }}
         gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
       >
         {/* Сцена */}
       </Canvas>
     </div>
     ```
     Обновить описание:
     - `fixed inset-0` — на весь экран (на wrapper div)
     - `z-0` — ниже контента (контент имеет `z-10`)
     - `pointer-events-none` — клики проходят сквозь (класс, не inline style)
     - `aria-hidden="true"` — скрыто от скринридеров

  2. **Строки 41-51 — «Троттлинг кадров»**: заменить `useFrame` throttle на актуальный паттерн:
     - Canvas использует `frameloop="demand"` (рендер только по запросу)
     - Кадры запрашиваются через `setInterval(() => invalidate(), 1000/TARGET_FPS)` в `BackgroundShapes`
     - При `reduced-motion`: однократный `invalidate()` для статичного рендера, без интервала

  3. **Строки 58-66 — «prefers-reduced-motion»**: заменить `window.matchMedia` на `useReducedMotion()` из framer-motion. Описать фактическое поведение: однократный `invalidate()` для статичного рендера фигур, без анимационного цикла.

  ### docs/ux-patterns.md:

  4. **Строка 9** — «Анимация: плавное раскрытие через Framer Motion» → «Анимация: плавное раскрытие через CSS Grid (`grid-template-rows` 0fr→1fr, 700ms)»

  5. **Строки 15-33 — код-пример аккордеона**: заменить на актуальный паттерн из `QACard.tsx`:
     ```tsx
     <article className="noble-card overflow-hidden">
       <button
         type="button"
         aria-expanded={isOpen}
         aria-controls={contentId}
         onClick={() => setIsOpen((prev) => !prev)}
         className="focus-ring ..."
       >
         <span>{/* Вопрос */}</span>
         <ChevronDown aria-hidden="true" />
       </button>

       <div
         id={contentId}
         className="accordion-content"
         data-open={isOpen}
       >
         <div className="overflow-hidden">
           {/* Ответ */}
         </div>
       </div>
     </article>
     ```
     Убрать `role="region"`, `aria-labelledby`, `hidden={!isOpen}` — не используются.

  **Must NOT do**:
  - НЕ менять секции «Запреты» в threejs-background.md
  - НЕ менять секции «HTML семантика», «Адаптив» в ux-patterns.md
  - НЕ менять секцию оптимизации Canvas (dpr, antialias) в threejs-background.md — она уже корректна

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3, 4)
  - **Blocks**: Task 6
  - **Blocked By**: None

  **References**:
  - `src/components/BackgroundScene.tsx:1-22` — полный код BackgroundScene (wrapper div + Canvas)
  - `src/components/BackgroundShapes.tsx:96-114` — `useReducedMotion()`, `invalidate()`, `setInterval` паттерн
  - `src/components/QACard.tsx:16-55` — полный код QACard (article, button, accordion-content, data-open)
  - `src/index.css:50-68` — CSS Grid аккордеон (`.accordion-content`)

  **Acceptance Criteria**:
  - [ ] `grep "window\.matchMedia" docs/threejs-background.md` → пусто
  - [ ] `grep "useReducedMotion\|useFrame.*30fps" docs/threejs-background.md` → ≥1 (useReducedMotion)
  - [ ] `grep "frameloop.*demand\|invalidate" docs/threejs-background.md` → ≥1
  - [ ] `grep 'z-10' docs/threejs-background.md` → пусто (было `-z-10`, стало `z-0`)
  - [ ] `grep "role=.region\|aria-labelledby\|hidden=..!isOpen" docs/ux-patterns.md` → пусто
  - [ ] `grep "data-open\|accordion-content" docs/ux-patterns.md` → ≥1
  - [ ] `grep "CSS Grid\|grid-template-rows" docs/ux-patterns.md` → ≥1
  - [ ] `grep "window\.matchMedia" docs/ux-patterns.md` → пусто

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Verify threejs-background.md matches BackgroundScene.tsx
    Tool: Bash
    Steps:
      1. grep -c "window.matchMedia" docs/threejs-background.md → Assert: 0
      2. grep -c "useReducedMotion" docs/threejs-background.md → Assert: ≥1
      3. grep -c "frameloop" docs/threejs-background.md → Assert: ≥1
      4. grep -c "\-z-10" docs/threejs-background.md → Assert: 0
      5. grep -c "z-0" docs/threejs-background.md → Assert: ≥1
    Expected Result: All code and descriptions match actual BackgroundScene

  Scenario: Verify ux-patterns.md matches QACard.tsx
    Tool: Bash
    Steps:
      1. grep -c 'role="region"' docs/ux-patterns.md → Assert: 0
      2. grep -c "aria-labelledby" docs/ux-patterns.md → Assert: 0
      3. grep -c "hidden=.*isOpen" docs/ux-patterns.md → Assert: 0
      4. grep -c "data-open" docs/ux-patterns.md → Assert: ≥1
      5. grep -c "accordion-content\|CSS Grid\|grid-template-rows" docs/ux-patterns.md → Assert: ≥1
    Expected Result: Aria pattern matches actual QACard implementation
  ```

  **Commit**: YES (groups with 1, 2, 3, 4)
  - Message: `docs: sync workspace documentation with multi-topic architecture`
  - Files: `docs/threejs-background.md`, `docs/ux-patterns.md`

---

- [x] 6. Финальная верификация

  **What to do**:

  Запустить полный набор проверок:

  1. **Проверка отсутствия устаревших путей** во всех изменённых файлах:
     ```bash
     grep -rn "content/topic\.json\|content/lessons/" AGENTS.md README.md CONTENT_GUIDE.md docs/*.md
     # → пусто
     ```

  2. **Проверка отсутствия устаревших маршрутов**:
     ```bash
     grep -rn '/lesson/:slug' AGENTS.md README.md docs/*.md
     # → пусто (ищем без ведущей кавычки — пути могут быть в бэктиках)
     ```

  3. **Проверка что «нетронутые» файлы не изменены**:
     ```bash
     git diff --name-only docs/constraints.md docs/design-system.md docs/dev-setup.md docs/content-schema.md
     # → пусто
     ```

  4. **Проверка что код не изменён**:
     ```bash
     git diff --name-only src/ content/ package.json index.html
     # → пусто
     ```

  5. **Проверка что новые термины присутствуют**:
     ```bash
     grep -l "content/topics/" AGENTS.md README.md CONTENT_GUIDE.md
     # → 3 файла
     grep -l "/topic/:slug" AGENTS.md README.md
     # → 2 файла
     grep -l "grid-template-rows\|CSS Grid\|data-open" docs/animations.md docs/ux-patterns.md
     # → 2 файла
     grep -l "frameloop.*demand\|invalidate" docs/threejs-background.md
     # → 1 файл
     grep -l "useReducedMotion" docs/animations.md docs/threejs-background.md
     # → 2 файла
     ```

  6. **Проверка билда** (markdown не должен сломать ничего):
     ```bash
     npm run build
     # → exit code 0
     ```

  7. **Проверка количества изменённых файлов**:
     ```bash
     git diff --name-only | sort
     # → AGENTS.md, CONTENT_GUIDE.md, README.md, docs/animations.md, docs/threejs-background.md, docs/ux-patterns.md
     ```

  **Must NOT do**:
  - НЕ вносить дополнительных правок
  - НЕ «дочищать» файлы которые прошли проверку

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (sequential, after all edits)
  - **Blocks**: None (final)
  - **Blocked By**: Tasks 1, 2, 3, 4, 5

  **References**:
  - Все файлы из Tasks 1-5

  **Acceptance Criteria**:
  - [ ] Все grep-проверки из шагов 1-5 пройдены
  - [ ] `npm run build` → exit code 0
  - [ ] Ровно 6 файлов изменено

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Full verification suite
    Tool: Bash
    Steps:
      1. grep -rn "content/topic\.json\|content/lessons/" AGENTS.md README.md CONTENT_GUIDE.md docs/*.md → Assert: empty
      2. grep -rn '/lesson/:slug' AGENTS.md README.md docs/*.md → Assert: empty
      3. git diff --name-only docs/constraints.md docs/design-system.md docs/dev-setup.md docs/content-schema.md → Assert: empty
      4. git diff --name-only src/ content/ package.json index.html → Assert: empty
      5. grep -l "content/topics/" AGENTS.md README.md CONTENT_GUIDE.md → Assert: 3 files
      6. npm run build → Assert: exit code 0
      7. git diff --name-only | wc -l → Assert: 6
    Expected Result: All checks pass, exactly 6 docs files updated
  ```

  **Commit**: YES
  - Message: `docs: sync workspace documentation with multi-topic architecture`
  - Files: все 6 файлов одним коммитом
  - Pre-commit: `npm run build`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 6 (all at once) | `docs: sync workspace documentation with multi-topic architecture` | AGENTS.md, README.md, CONTENT_GUIDE.md, docs/animations.md, docs/threejs-background.md, docs/ux-patterns.md | `npm run build` |

---

## Success Criteria

### Verification Commands
```bash
# Нет устаревших путей
grep -rn "content/topic\.json\|content/lessons/" AGENTS.md README.md CONTENT_GUIDE.md docs/*.md
# Expected: пусто

# Нет устаревших маршрутов
grep -rn '/lesson/:slug' AGENTS.md README.md docs/*.md
# Expected: пусто

# Код не тронут
git diff --name-only src/ content/ package.json index.html
# Expected: пусто

# Билд работает
npm run build
# Expected: exit code 0
```

### Final Checklist
- [x] Все «Must Have» выполнены
- [x] Все «Must NOT Have» соблюдены
- [x] Все grep-проверки проходят
- [x] Билд успешен
- [x] Ровно 6 файлов изменено
- [x] Все 4 «нетронутых» docs-файла без изменений
